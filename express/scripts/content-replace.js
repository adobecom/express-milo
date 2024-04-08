import { getLibs } from './utils.js';

const { getMetadata } = await import(`${getLibs()}/utils/utils.js`);

export const REG = /\{\{(.*?)\}\}/g;

function handleRegisterButton(a) {
  const signIn = () => {
    if (typeof window.adobeIMS?.signIn !== 'function') {
      window?.lana.log({ message: 'IMS signIn method not available', tags: 'errorType=warn,module=gnav' });
      return;
    }

    window.adobeIMS.signIn();
  };

  a.addEventListener('click', (e) => {
    e.preventDefault();
    signIn();
  });
}

export function autoUpdateLinks(scope) {
  scope.querySelectorAll('a[href*="#"]').forEach((a) => {
    try {
      const url = new URL(a.href);
      if (getMetadata(url.hash.replace('#', ''))) {
        a.href = getMetadata(url.hash.replace('#', ''));
      }

      if (a.href.endsWith('#rsvp-form')) {
        const profile = window.bm8tr.get('imsProfile');
        if (profile?.noProfile) {
          handleRegisterButton(a);
        } else if (!profile) {
          window.bm8tr.subscribe('imsProfile', ({ newValue }) => {
            if (newValue?.noProfile) {
              handleRegisterButton(a);
            }
          });
        }
      }
    } catch (e) {
      window.lana?.log(`Error while attempting to replace link ${a.href}: ${e}`);
    }
  });
}
