import { getLibs } from './utils.js';
import BlockMediator from './block-mediator.min.js';

const { createTag, getMetadata, getConfig } = await import(`${getLibs()}/utils/utils.js`);

export function getDestination() {
  return BlockMediator.get('primaryCtaUrl')
      || document.querySelector('a.button.xlarge.same-as-floating-button-CTA, a.primaryCTA')?.href;
}

// TODO see if we even want to preload the product. Currently we're not in the old project
// eslint-disable-next-line no-unused-vars
function loadExpressProduct() {
  if (!window.hlx.preload_product) return;
  if (document.body.dataset.device === 'mobile') return;
  const path = ['www.adobe.com'].includes(window.location.hostname)
    ? 'https://new.express.adobe.com/static/preload.html' : 'https://stage.projectx.corp.adobe.com/static/preload.html';
  const iframe = createTag('iframe', { src: path, style: 'display:none' });
  document.body.append(iframe);
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
  const { feds, adobeProfile, fedsConfig } = window;
  if (fedsConfig?.universalNav) {
    return feds?.services?.universalnav?.interface?.adobeProfile?.getUserProfile()
        || adobeProfile?.getUserProfile();
  }
  return feds?.services?.profile?.interface?.adobeProfile?.getUserProfile()
      || adobeProfile?.getUserProfile();
}

async function isSignedIn() {
  if (getProfile()) return true;
  if (window.feds.events?.profile_data) return false; // data ready -> not signed in
  let resolve;
  const resolved = new Promise((r) => {
    resolve = r;
  });
  window.addEventListener('feds.events.profile_data.loaded', () => {
    resolve();
  }, { once: true });
  // if not ready, abort
  // eslint-disable-next-line no-promise-executor-return
  await Promise.race([resolved, new Promise((r) => setTimeout(r, 5000))]);
  if (getProfile() === null) {
    // retry after 1s
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 1000));
  }
  return getProfile();
}

// product entry prompt
async function canPEP() {
  // TODO test this whole method
  if (document.body.dataset.device !== 'desktop') return false;
  const pepSegment = getMetadata('pep-segment');
  if (!pepSegment) return false;
  if (!getDestination()) return false;

  const { replaceKeyArray } = await import(`${getLibs()}/features/placeholders.js`);
  const [pepHeader, pepCancel] = await replaceKeyArray(['pep-header', 'pep-cancel'], getConfig());

  if (!pepHeader || !pepCancel) return false;
  const segments = getSegmentsFromAlloyResponse(await window.alloyLoader);
  if (!pepSegment.replace(/\s/g, '').split(',').some((pepSeg) => segments.includes(pepSeg))) return false;
  return !!(await isSignedIn());
}

const PEP_DELAY = 3000;

/**
 * Executes everything that happens a lot later, without impacting the user experience.
 */
export default async function loadDelayed(DELAY = 15000) {
  if (await canPEP()) {
    const { default: loadLoginUserAutoRedirect } = await import('../features/direct-path-to-product/direct-path-to-product.js');
    return new Promise((resolve) => {
      // TODO: not preloading product this early to protect desktop CWV
      // until we see significant proof of preloading improving product load time
      // loadExpressProduct();
      setTimeout(() => {
        loadLoginUserAutoRedirect();
        resolve();
      }, PEP_DELAY);
    });
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      // TODO see if we even want to preload the product. Currently we're not in the old project
      // loadExpressProduct();
      resolve();
    }, window.delay_preload_product ? DELAY * 2 : DELAY);
  });
}
