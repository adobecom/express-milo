/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';

let createTag; let loadScript;
let getConfig; let isStage;

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

export function loadWrapper() {
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

function buildSUSIParams(client_id, variant, destURL, locale, title) {
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
    },
  };
  if (title) {
    params.config.title = title;
  }
  return params;
}

function extractOptions(rows, locale, imsClientId) {
  const tabNames = [...rows[1].querySelectorAll('div')].map((div) => div.textContent);
  const variants = [...rows[2].querySelectorAll('div')].map((div) => div.textContent?.trim().toLowerCase());
  const redirectUrls = [...rows[3].querySelectorAll('div')].map((div) => div.textContent?.trim().toLowerCase());
  const client_ids = [...rows[4].querySelectorAll('div')].map((div) => div.textContent?.trim() || (imsClientId ?? 'AdobeExpressWeb'));
  const guests = [...rows[5].querySelectorAll('div')];
  const options = tabNames.map((tabName, index) => ({
    tabName,
    ...buildSUSIParams(
      client_ids[index],
      variants[index],
      getDestURL(redirectUrls[index]),
      locale,
    ),
    guest: guests[index],
  }));
  return options;
}

function extractSingleOption(el, locale, imsClientId) {
  const rows = el.querySelectorAll(':scope > div > div');
  const redirectUrl = rows[0]?.textContent?.trim().toLowerCase();
  const client_id = rows[1]?.textContent?.trim() || (imsClientId ?? 'AdobeExpressWeb');
  const title = rows[2]?.textContent?.trim();
  // only edu variant used singly
  const variant = 'edu-express';
  return buildSUSIParams(client_id, variant, getDestURL(redirectUrl), locale, title);
}

function buildTabs(el, locale, imsClientId) {
  const rows = [...el.children];
  const options = extractOptions(rows, locale, imsClientId);
  const wrapper = createTag('div', { class: 'easy-in-wrapper' });
  const panelList = createTag('div', { class: 'panel-list' });
  const panels = options.map((option) => {
    const panel = createTag('div', { class: 'panel' });
    panel.append(createSUSIComponent(option));
    const guestDiv = createTag('div', { class: 'guest' }, option.guest);
    [...guestDiv.querySelectorAll('a, button')].forEach((e) => {
      e.addEventListener('click', () => {
        sendEventToAnalytics('event', `acomx:susi-light:guest-${e.title || e.textContent}`, option.authParams.client_id);
      });
    });
    panel.append(guestDiv);
    return panel;
  });

  const logo = getIconElementDeprecated('adobe-express-logo');
  logo.classList.add('express-logo');
  const title = rows[0].textContent?.trim();
  const titleDiv = createTag('div', { class: 'title' }, title);
  wrapper.append(logo, titleDiv, panelList, ...panels);
  return wrapper;
}

export default async function init(el) {
  ({ createTag, loadScript, getConfig } = await import(`${getLibs()}/utils/utils.js`));
  isStage = (usp.get('env') && usp.get('env') !== 'prod') || getConfig().env.name !== 'prod';
  const locale = getConfig().locale.ietf.toLowerCase();
  const { imsClientId } = getConfig();

  const isTabs = el.classList.contains('tabs');

  const loadWrapperPromise = loadWrapper();
  if (!isTabs) {
    const option = extractSingleOption(el, locale, imsClientId);
    const goDest = () => window.location.assign(option.destURL);
    if (window.feds?.utilities?.imslib) {
      const { imslib } = window.feds.utilities;
      /* eslint-disable chai-friendly/no-unused-expressions */
      imslib.isReady() && imslib.isSignedInUser() && goDest();
      imslib.onReady().then(() => imslib.isSignedInUser() && goDest());
    }
    await loadWrapperPromise;
    const susi = createSUSIComponent(option);
    el.innerHTML = '';
    el.append(susi);
  } else {
    await loadWrapperPromise;
    const tabs = buildTabs(el, locale, imsClientId);
    el.innerHTML = '';
    el.append(tabs);
  }
}
