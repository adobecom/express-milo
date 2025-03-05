/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';

let createTag; let loadScript;
let getConfig; let isStage;
let loadIms;

const usp = new URLSearchParams(window.location.search);

const onRedirect = (e) => {
  // eslint-disable-next-line no-console
  console.log('redirecting to:', e.detail);
  setTimeout(() => {
    window.location.assign(e.detail);
    // temporary solution: allows analytics to go thru
  }, 100);
};
const onError = (e) => {
  window.lana?.log('on error:', e);
};

export function loadSUSIScripts() {
  const CDN_URL = `https://auth-light.identity${isStage ? '-stage' : ''}.adobe.com/sentry/wrapper.js`;
  return loadScript(CDN_URL);
}

function getDestURL(url) {
  let destURL;
  try {
    destURL = new URL(url);
  } catch (err) {
    window.lana?.log(`invalid redirect uri for susi-light: ${url}`);
    destURL = new URL('https://new.express.adobe.com');
  }
  if (isStage && ['new.express.adobe.com', 'express.adobe.com'].includes(destURL.hostname)) {
    destURL.hostname = 'stage.projectx.corp.adobe.com';
  }
  return destURL.toString();
}

function sendEventToAnalytics(type, eventName, client_id) {
  const sendEvent = () => {
    window._satellite.track('event', {
      xdm: {},
      data: {
        eventType: 'web.webinteraction.linkClicks',
        web: {
          webInteraction: {
            name: eventName,
            linkClicks: {
              value: 1,
            },
            type,
          },
        },
        _adobe_corpnew: {
          digitalData: {
            primaryEvent: {
              eventInfo: {
                eventName,
                client_id,
              },
            },
          },
        },
      },
    });
  };
  if (window._satellite?.track) {
    sendEvent();
  } else {
    window.addEventListener('alloy_sendEvent', () => {
      sendEvent();
    }, { once: true });
  }
}

function createSUSIComponent({ variant, config, authParams, destURL }) {
  const susi = createTag('susi-sentry-light');
  susi.authParams = authParams;
  susi.authParams.redirect_uri = destURL;
  susi.authParams.dctx_id = 'v:2,s,dcp-r,bg:express2024,45faecb0-e687-11ee-a865-f545a8ca5d2c';
  susi.config = config;
  if (isStage) susi.stage = 'true';
  susi.variant = variant;
  const onAnalytics = (e) => {
    const { type, event } = e.detail;
    sendEventToAnalytics(type, event, authParams.client_id);
  };
  susi.addEventListener('redirect', onRedirect);
  susi.addEventListener('on-error', onError);
  susi.addEventListener('on-analytics', onAnalytics);
  return susi;
}

function buildSUSIParams({ client_id, variant, destURL, locale, title, hideIcon }) {
  const params = {
    variant,
    authParams: {
      dt: false,
      locale,
      response_type: 'code',
      client_id,
      scope: 'AdobeID,openid',
    },
    destURL,
    config: {
      consentProfile: 'free',
      fullWidth: true,
    },
  };
  if (title !== undefined) {
    params.config.title = title;
  }
  if (hideIcon) {
    params.config.hideIcon = true;
  }
  return params;
}

let tabsId = 0;
function buildSUSITabs(el, options) {
  tabsId += 1;
  const rows = [...el.children];
  const wrapper = createTag('div', { class: 'susi-tabs' });
  const tabList = createTag('div', { role: 'tab-list' });
  const panels = options.map((option, i) => {
    const { footer, tabName, variant } = option;
    const panel = createTag('div', { role: 'tab-panel', class: variant });
    panel.append(createSUSIComponent(option));
    if (footer) {
      footer.classList.add('footer');
      if (footer.querySelector('h2')) {
        footer.classList.add('susi-bubbles');
        const bubbleContainer = createTag('div', { class: 'susi-bubble-container' });
        [...footer.querySelectorAll('p')].forEach((p) => {
          p.classList.add('susi-bubble');
          bubbleContainer.append(p);
        });
        footer.append(bubbleContainer);
      } else {
        footer.classList.add('susi-banner');
      }
      panel.append(footer);
    }

    const id = `${tabName}-${tabsId}`;
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.id = `panel-${id}`;
    panel.setAttribute('aria-hidden', i > 0);
    const tab = createTag('button', {
      role: 'tab',
      'aria-selected': i === 0,
      'aria-controls': `panel-${id}`,
      id: `tab-${id}`,
    }, tabName);
    tab.addEventListener('click', () => {
      tabList.querySelector('[aria-selected=true]')?.setAttribute('aria-selected', false);
      tab.setAttribute('aria-selected', true);
      panels.forEach((p) => {
        p.setAttribute('aria-hidden', p !== panel);
      });
    });
    tabList.append(tab);
    return panel;
  });

  const logo = getIconElementDeprecated('adobe-express-logo');
  logo.classList.add('express-logo');
  logo.height = 24;
  const title = rows[0].textContent?.trim();
  const titleDiv = createTag('div', { class: 'title' }, title);
  wrapper.append(logo, titleDiv, tabList, ...panels);
  return wrapper;
}

function redirectIfLoggedIn(destURL) {
  const goDest = () => {
    sendEventToAnalytics('redirect', 'logged-in-auto-redirect');
    window.location.assign(destURL);
  };
  if (window.adobeIMS) {
    window.adobeIMS.isSignedInUser() && goDest();
  } else {
    loadIms()
      .then(() => {
        /* c8 ignore next */
        window.adobeIMS?.isSignedInUser() && goDest();
      })
      .catch((e) => { window.lana?.log(`Unable to load IMS in susi-light: ${e}`); });
  }
}

export default async function init(el) {
  ({ createTag, loadScript, getConfig, loadIms } = await import(`${getLibs()}/utils/utils.js`));
  isStage = (usp.get('env') && usp.get('env') !== 'prod') || getConfig().env.name !== 'prod';
  const locale = getConfig().locale.ietf.toLowerCase();
  const { imsClientId } = getConfig();

  const isTabs = el.classList.contains('tabs');
  const noRedirect = el.classList.contains('no-redirect');

  await loadSUSIScripts();

  // only edu variant shows single
  if (!isTabs) {
    const rows = el.querySelectorAll(':scope > div > div');
    const redirectUrl = rows[0]?.textContent?.trim().toLowerCase();
    const client_id = rows[1]?.textContent?.trim() || (imsClientId ?? 'AdobeExpressWeb');
    const title = rows[2]?.textContent?.trim();
    const variant = 'edu-express';
    const params = buildSUSIParams(client_id, variant, getDestURL(redirectUrl), locale, title);
    if (!noRedirect) {
      redirectIfLoggedIn(params.destURL);
    }
    el.replaceChildren(createSUSIComponent(params));
    return;
  }
  const rows = [...el.children];
  const tabNames = [...rows[1].querySelectorAll('div')].map((div) => div.textContent);
  const variants = [...rows[2].querySelectorAll('div')].map((div) => div.textContent?.trim().toLowerCase());
  const redirectUrls = [...rows[3].querySelectorAll('div')].map((div) => div.textContent?.trim().toLowerCase());
  const client_ids = [...rows[4].querySelectorAll('div')].map((div) => div.textContent?.trim() || (imsClientId ?? 'AdobeExpressWeb'));
  const footers = rows[5] ? [...rows[5].querySelectorAll('div')] : [];
  const tabParams = tabNames.map((tabName, index) => ({
    tabName,
    ...buildSUSIParams({
      client_id: client_ids[index],
      variant: variants[index],
      destURL: getDestURL(redirectUrls[index]),
      locale,
      title: '', // rm titles
      hideIcon: true,
    }),
    footer: footers[index] ?? null,
  }));
  if (!noRedirect) {
    // redirect to first one if logged in
    redirectIfLoggedIn(tabParams[0].destURL);
  }
  el.replaceChildren(buildSUSITabs(el, tabParams));
}
