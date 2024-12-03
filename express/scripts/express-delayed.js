import { getLibs } from './utils.js';
import BlockMediator from './block-mediator.min.js';
import { decorateButtonsDeprecated } from './utils/decorate.js';

let createTag; let getMetadata;
let getConfig; let loadStyle;
let getUserProfile;

export function getDestination() {
  const pepDestinationMeta = getMetadata('pep-destination');
  return pepDestinationMeta || BlockMediator.get('primaryCtaUrl')
      || document.querySelector('a.button.xlarge.same-fcta, a.primaryCTA, a.con-button.button-xxl.same-fcta, a.con-button.xxl-button.same-fcta')?.href;
}

function getSegmentsFromAlloyResponse(response) {
  const ids = [];
  if (response?.destinations) {
    Object.values(response.destinations).forEach(({ segments }) => {
      if (segments) {
        Object.values(segments).forEach(({ id }) => {
          ids.push(id);
        });
      }
    });
  }
  return ids;
}

export function getProfile() {
  return new Promise((res) => {
    getUserProfile()
      .then((data) => {
        res({
          avatar: data.avatar,
          display_name: data.display_name,
          email: data.email,
          enterpriseAdmin: undefined,
          first_name: data?.first_name,
          id: data?.userId,
          last_name: data?.last_name,
          name_id: undefined,
          teamAdmin: undefined,
        });
      })
      .catch(() => {
        res(null);
      });
  });
}

const branchLinkOriginPattern = /^https:\/\/adobesparkpost(-web)?\.app\.link/;
function isBranchLink(url) {
  return branchLinkOriginPattern.test(new URL(url).origin);
}

// product entry prompt
async function canPEP() {
  // TODO test this whole method
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('force-pep')) return true;
  if (document.body.dataset.device !== 'desktop') return false;
  const pepSegment = getMetadata('pep-segment');
  if (!pepSegment) return false;
  const destination = getDestination();
  if (!destination || !isBranchLink(destination)) return false;

  const { replaceKeyArray } = await import(`${getLibs()}/features/placeholders.js`);
  const [cancel, pepHeader, pepCancel] = await replaceKeyArray(['cancel', 'pep-header', 'pep-cancel'], getConfig());
  if (!cancel || !pepHeader || !pepCancel) return false;
  const segments = getSegmentsFromAlloyResponse(await window.alloyLoader);
  if (!pepSegment.replace(/\s/g, '').split(',').some((pepSeg) => segments.includes(pepSeg))) return false;

  return new Promise((resolve) => {
    resolve(window.adobeIMS?.isSignedInUser() ?? false);
  });
}

const PEP_DELAY = 3000;

function preloadSUSILight() {
  const config = getConfig();
  if (!getMetadata('preload-susi-light')) return;
  const preloadTag = createTag('meta', {
    name: 'susi-sentry-preload',
    content: 'edu-express',
    'data-locale': config.locale.ietf.toLowerCase(),
  });
  if (config.env.name !== 'prod') {
    preloadTag.setAttribute('data-stage', 'true');
  }
  import('../blocks/susi-light/susi-light.js')
    .then((mod) => mod.loadWrapper())
    .then(() => {
      document.head.append(preloadTag);
    });
  loadStyle('/express/blocks/susi-light/susi-light.css');
  import(`${getLibs()}/blocks/fragment/fragment.js`);
}

function loadTOC() {
  if (getMetadata('toc-seo') === 'on') {
    loadStyle('/express/features/table-of-contents-seo/table-of-contents-seo.css');
    import('../features/table-of-contents-seo/table-of-contents-seo.js').then(({ default: setTOCSEO }) => setTOCSEO());
  }
}

function turnContentLinksIntoButtons() {
  document.querySelectorAll('.section > .content').forEach((content) => {
    const links = content.querySelectorAll('a');
    links.forEach((link) => {
      const $up = link.parentElement;
      const $twoup = link.parentElement.parentElement;
      if (!link.querySelector('img')) {
        if ($up.childNodes.length === 1 && ($up.tagName === 'P' || $up.tagName === 'DIV')) {
          decorateButtonsDeprecated($up);
        }
        if ($up.childNodes.length === 1 && $up.tagName === 'STRONG'
            && $twoup.children.length === 1 && $twoup.tagName === 'P') {
          decorateButtonsDeprecated($twoup);
        }
        if ($up.childNodes.length === 1 && $up.tagName === 'EM'
            && $twoup.children.length === 1 && $twoup.tagName === 'P') {
          decorateButtonsDeprecated($twoup);
        }
      }
    });
  });
}

/**
 * Executes everything that happens a lot later, without impacting the user experience.
 */
export default async function loadDelayed() {
  try {
    await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/blocks/global-navigation/utilities/utilities.js`)]).then(([utils, utilities]) => {
      ({ createTag, getMetadata, getConfig, loadStyle } = utils);
      ({ getUserProfile } = utilities);
    });
    loadTOC();
    turnContentLinksIntoButtons();
    preloadSUSILight();
    if (await canPEP()) {
      // eslint-disable-next-line import/no-unresolved
      const { default: loadLoginUserAutoRedirect } = await import('../features/direct-path-to-product/direct-path-to-product.js');
      return new Promise((resolve) => {
        // TODO: not preloading product to protect desktop CWV
        // until we see significant proof of preloading improving product load time
        // loadExpressProduct();
        setTimeout(() => {
          loadLoginUserAutoRedirect();
          resolve();
        }, PEP_DELAY);
      });
    }
    return null;
  } catch (err) {
    window.lana?.log(`Express-Delayed Error: ${err}`);
    return null;
  }
}
