import { getLibs } from './utils.js';

const { getConfig, getMetadata, loadScript, loadStyle } = await import(`${getLibs()}/utils/utils.js`);

const isHomepage = window.location.pathname.endsWith('/express/');
function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

async function checkRedirect(location, geoLookup) {
  const splits = location.pathname.split('/express/');
  splits[0] = '';
  const prefix = geoLookup && geoLookup !== 'us' ? `/${geoLookup}` : '';

  // remove ?geocheck param
  const params = new URLSearchParams(location.search);
  params.delete('geocheck');
  const queryString = params.toString() ? `?${params.toString()}` : '';

  return `${prefix}${splits.join('/express/')}${queryString}${location.hash}`;
}

async function checkGeo(userGeo, userLocale, geoCheckForce) {
  const geoLookup = async () => {
    let region = '';
    const resp = await fetch('/express/system/geo-map.json');
    const json = await resp.json();
    const matchedGeo = json.data.find((row) => (row.usergeo === userGeo));
    const { userlocales, redirectlocalpaths, redirectdefaultpath } = matchedGeo;
    region = redirectdefaultpath;

    if (userlocales) {
      const redirectLocalPaths = redirectlocalpaths.split(',');
      const [userLanguage] = userLocale.split('-');
      const userExpectedPath = `${userGeo.toLowerCase()}_${userLanguage}`;
      region = redirectLocalPaths.find((locale) => locale.trim() === userExpectedPath) || region;
    }
    return (region);
  };

  const region = geoCheckForce ? await geoLookup() : getCookie('international') || await geoLookup();
  return checkRedirect(window.location, region);
}

async function loadIMS() {
  window.adobeid = {
    client_id: getConfig().imsClientId,
    scope: 'AdobeID,openid',
    locale: getConfig().locale.region,
    environment: 'prod',
  };
  if (!['www.stage.adobe.com'].includes(window.location.hostname)) {
    await loadScript('https://auth.services.adobe.com/imslib/imslib.min.js');
  } else {
    await loadScript('https://auth-stg1.services.adobe.com/imslib/imslib.min.js');
    window.adobeid.environment = 'stg1';
  }
}

// eslint-disable-next-line import/prefer-default-export
export async function buildBreadCrumbArray(prefix) {
  if (isHomepage || getMetadata('breadcrumbs') !== 'on') {
    return null;
  }

  const validSecondPathSegments = ['create', 'feature'];
  const pathSegments = window.location.pathname
    .split('/')
    .filter((e) => e !== '')
    .filter((e) => e !== prefix);
  const localePath = prefix === '' ? '' : `${prefix}/`;
  const secondPathSegment = pathSegments[1].toLowerCase();
  const pagesShortNameElement = document.head.querySelector('meta[name="short-title"]');
  const pagesShortName = pagesShortNameElement?.getAttribute('content') ?? null;
  const { replaceKey } = await import(`${getLibs()}/features/placeholders.js`);
  const breadcrumbsPlaceholder = await replaceKey(`breadcrumbs-${secondPathSegment}`, getConfig());
  const replacedCategory = breadcrumbsPlaceholder.toLowerCase();

  if (!pagesShortName
    || pathSegments.length <= 2
    || !replacedCategory
    || !validSecondPathSegments.includes(replacedCategory)
    || prefix !== '') { // Remove this line once locale translations are complete
    return null;
  }

  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
  const buildBreadCrumb = (path, name, parentPath = '') => (
    { title: capitalize(name), url: `${parentPath}/${path}` }
  );
  const secondBreadCrumb = buildBreadCrumb(secondPathSegment, capitalize(replacedCategory), `${localePath}/express`);
  const breadCrumbList = [secondBreadCrumb];

  if (pathSegments.length >= 3) {
    const thirdBreadCrumb = buildBreadCrumb(pagesShortName, pagesShortName, secondBreadCrumb.url);
    breadCrumbList.push(thirdBreadCrumb);
  }
  return breadCrumbList;
}

async function loadFEDS() {
  const config = getConfig();
  const prefix = config.locale.prefix.replaceAll('/', '');

  async function showRegionPicker() {
    const { getModal } = await import(`${getLibs()}/blocks/modal/modal.js`);
    const details = {
      path: '/express/fragments/regions',
      id: 'langnav',
    };
    loadStyle('/express/blocks/modal/modal.css');
    return getModal(details);
  }

  function handleConsentSettings() {
    try {
      if (!window.adobePrivacy || window.adobePrivacy.hasUserProvidedCustomConsent()) {
        window.sprk_full_consent = false;
        return;
      }
      if (window.adobePrivacy.hasUserProvidedConsent()) {
        window.sprk_full_consent = true;
      } else {
        window.sprk_full_consent = false;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Couldn't determine user consent status:", e);
      window.sprk_full_consent = false;
    }
  }

  window.addEventListener('adobePrivacy:PrivacyConsent', handleConsentSettings);
  window.addEventListener('adobePrivacy:PrivacyReject', handleConsentSettings);
  window.addEventListener('adobePrivacy:PrivacyCustom', handleConsentSettings);

  const isMegaNav = window.location.pathname.startsWith('/express')
    || window.location.pathname.startsWith('/in/express')
    || window.location.pathname.startsWith('/uk/express')
    || window.location.pathname.startsWith('/education')
    || window.location.pathname.startsWith('/in/education')
    || window.location.pathname.startsWith('/uk/education')
    || window.location.pathname.startsWith('/drafts');
  const fedsExp = isMegaNav
    ? 'adobe-express/ax-gnav-x'
    : 'adobe-express/ax-gnav-x-row';

  window.fedsConfig = {
    ...(window.fedsConfig || {}),

    footer: {
      regionModal: () => {
        showRegionPicker();
      },
    },
    locale: (prefix === '' ? 'en' : prefix),
    content: { experience: getMetadata('gnav') || fedsExp },
    profile: {
      customSignIn: () => {
        const sparkLang = config.locale.ietf;
        const sparkPrefix = sparkLang === 'en-US' ? '' : `/${sparkLang}`;
        let sparkLoginUrl = `https://express.adobe.com${sparkPrefix}/sp/`;
        const { env } = getConfig();
        if (isHomepage) {
          sparkLoginUrl = 'https://new.express.adobe.com/?showCsatOnExportOnce=True&promoid=GHMVYBFM&mv=other';
        } else if (env && env.express) {
          sparkLoginUrl = sparkLoginUrl.replace('express.adobe.com', env.express);
        }
        window.location.href = sparkLoginUrl;
      },
    },
    jarvis: {},
    breadcrumbs: {
      showLogo: true,
      links: await buildBreadCrumbArray(prefix),
    },
  };

  window.addEventListener('feds.events.experience.loaded', async () => {
    document.querySelector('body').classList.add('feds-loaded');

    if (['no', 'f', 'false', 'n', 'off'].includes(getMetadata('gnav-retract').toLowerCase())) {
      window.feds.components.NavBar.disableRetractability();
    }

    /* attempt to switch link */
    if (window.location.pathname.includes('/create/')
      || window.location.pathname.includes('/discover/')
      || window.location.pathname.includes('/feature/')) {
      const $aNav = document.querySelector('header a.feds-navLink--primaryCta');
      const $aHero = document.querySelector('main > div:first-of-type a.button.accent');
      if ($aNav && $aHero) {
        $aNav.href = $aHero.href;
      }
    }

    const geocheck = new URLSearchParams(window.location.search).get('geocheck');
    if (geocheck === 'on' || geocheck === 'force') {
      const userGeo = window.feds
      && window.feds.data
      && window.feds.data.location
      && window.feds.data.location.country
        ? window.feds.data.location.country : null;
      const navigatorLocale = navigator.languages
      && navigator.languages.length
        ? navigator.languages[0].toLowerCase()
        : navigator.language.toLowerCase();
      const redirect = await checkGeo(userGeo, navigatorLocale, geocheck === 'force');
      if (redirect) {
        window.location.href = redirect;
      }
    }
    /* region based redirect to homepage */
    if (window.feds && window.feds.data && window.feds.data.location && window.feds.data.location.country === 'CN') {
      const regionpath = prefix === '' ? '/' : `/${prefix}/`;
      window.location.href = regionpath;
    }
  });
  let domain = '';
  if (!['www.adobe.com', 'www.stage.adobe.com'].includes(window.location.hostname)) {
    domain = 'https://www.adobe.com';
  }
  loadScript(`${domain}/etc.clientlibs/globalnav/clientlibs/base/feds.js`).then((script) => {
    script.id = 'feds-script';
    const fedsHeader = document.querySelector('header header');
    if (fedsHeader) fedsHeader.classList.add('custom-header');
    else {
      const header = document.querySelector('header');

      const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            // Loop through all added nodes
            mutation.addedNodes.forEach((node) => {
              // Check if the added node is a 'header' or contains a 'header'
              if (node.nodeType === Node.ELEMENT_NODE) { // Ensure it's an element node
                if (node.tagName === 'HEADER' || node.querySelector('header')) {
                  const nodeHeader = node.querySelector('header');
                  nodeHeader.classList.add('custom-header');
                  observer.disconnect();
                }
              }
            });
          }
        }
      };

      const observer = new MutationObserver(callback);
      observer.observe(header, { childList: true, subtree: true });
    }
  });
  setTimeout(() => {
    const acom = '7a5eb705-95ed-4cc4-a11d-0cc5760e93db';
    const ids = {
      'hlx.page': '3a6a37fe-9e07-4aa9-8640-8f358a623271-test',
      'hlx.live': '926b16ce-cc88-4c6a-af45-21749f3167f3-test',
    };
    // eslint-disable-next-line max-len
    const otDomainId = ids?.[Object.keys(ids).find((domainId) => window.location.host.includes(domainId))] ?? acom;
    window.fedsConfig.privacy = { otDomainId };
    loadScript('https://www.adobe.com/etc.clientlibs/globalnav/clientlibs/base/privacy-standalone.js');
  }, 4000);
  const footer = document.querySelector('footer');
  footer?.addEventListener('click', (event) => {
    if (event.target.closest('a[data-feds-action="open-adchoices-modal"]')) {
      event.preventDefault();
      window.adobePrivacy?.showPreferenceCenter();
    }
  });
}

// eslint-disable-next-line max-len
// TODO maybe put the code in this if statment. Only do if we want to test our applicaiton without the gnav sometimes
if (!window.hlx || window.hlx.gnav) {
  await loadIMS();
  loadFEDS();
  setTimeout(() => {
    import('./google-yolo.js').then((mod) => {
      mod.default();
    });
  }, 4000);
}
/* Core Web Vitals RUM collection */
// TODO maybe add this back
// sampleRUM('cwv');
