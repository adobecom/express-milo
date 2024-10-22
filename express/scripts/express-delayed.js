import { getLibs } from './utils.js';
import BlockMediator from './block-mediator.min.js';
import {decorateButtonsDeprecated} from "./utils/decorate.js";

const { createTag, getMetadata, getConfig, loadStyle } = await import(`${getLibs()}/utils/utils.js`);

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
  const { imslib } = window.feds.utilities;
  return new Promise((res) => {
    imslib.onReady().then(() => {
      if (!imslib.isSignedInUser()) res(null);
      if (window.fedsConfig.universalNav === true) {
        // Using Universal Navigation
        // The new Profile Menu does not send an event when the method or data are available
        const imsDataPromise = imslib.getProfile();
        const profileDataPromise = new Promise((resolve) => {
          // The new Profile Menu will expose adobeProfile.getUserProfile, but there is no
          // event or callback to inform us that the profile has rendered and the method
          // is available
          // We have to build a polling mechanism to see when the method is available
          let interval;
          const setDefault = () => resolve({});
          const onReady = () => window.adobeProfile?.getUserProfile()
            .then(resolve).catch(setDefault);
          const isProfileMethodAvailable = () => typeof window.adobeProfile?.getUserProfile === 'function';
          if (isProfileMethodAvailable()) {
            onReady();
          } else {
            const timeout = setTimeout(() => {
              clearInterval(interval);
              setDefault();
            }, 5000);

            interval = setInterval(() => {
              if (isProfileMethodAvailable()) {
                clearTimeout(timeout);
                clearInterval(interval);
                onReady();
              }
            }, 150);
          }
        });
        Promise.all([imsDataPromise, profileDataPromise])
          .then(([imsData, profileData]) => {
            res({
              avatar: profileData?.avatar,
              display_name: imsData?.displayName,
              email: imsData?.email,
              enterpriseAdmin: undefined,
              first_name: imsData?.first_name,
              id: imsData?.userId,
              last_name: imsData?.last_name,
              name_id: undefined,
              teamAdmin: undefined,
            });
          })
          .catch(() => {
            res(null);
          });
      } else {
        // Using old Profile Menu
        const getProfileData = () => window.adobeProfile?.getUserProfile();
        if (window.feds.events?.profile_data === true) {
          // Profile data has been loaded
          res(getProfileData());
        } else {
          // Profile data is not available yet
          const eventDriven = () => {
            window.removeEventListener('feds.events.profile_data.loaded', eventDriven);
            res(getProfileData());
          };
          window.addEventListener('feds.events.profile_data.loaded', eventDriven);// You might want to remove th});
        }
      }
    }).catch(() => {
      res(null);
      // IMS timeout, the "sign in" CTA will not be displayed
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
    if (window.feds?.utilities?.imslib) {
      const { imslib } = window.feds.utilities;
      imslib.onReady().then(() => {
        resolve(imslib.isSignedInUser());
      }).catch(() => resolve(false));
    } else {
      resolve(false);
    }
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

function turnContentLinksIntoButtons() {
  document.querySelectorAll('.section > .content').forEach((content) => {
    decorateButtonsDeprecated(content);
  });
}

/**
 * Executes everything that happens a lot later, without impacting the user experience.
 */
export default async function loadDelayed() {
  try {
    turnContentLinksIntoButtons();
    preloadSUSILight();
    if (await canPEP()) {
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
