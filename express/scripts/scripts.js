/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { setLibs, decorateArea, listenMiloEvents } from './utils.js';
import { autoUpdateContent } from './content-replace.js';

// Add project-wide style path here.
const STYLES = ['/express/styles/styles.css'];

// Use 'https://milo.adobe.com/libs' if you cannot map '/libs' to milo's origin.
const LIBS = '/libs';

window.express = {};

// Add any config options.
const CONFIG = {
  local: { express: 'stage.projectx.corp.adobe.com', commerce: 'commerce-stg.adobe.com' },
  stage: { express: 'stage.projectx.corp.adobe.com', commerce: 'commerce-stg.adobe.com' },
  prod: { express: 'new.express.adobe.com', commerce: 'commerce.adobe.com' },
  codeRoot: '/express',
  contentRoot: '/express',
  jarvis: {
    id: 'Acom_Express',
    version: '1.0',
    onDemand: true,
  },
  imsClientId: 'AdobeExpressWeb',
  // geoRouting: 'off',
  // fallbackRouting: 'off',
  decorateArea,
  locales: {
    '': { ietf: 'en-US', tk: 'jdq5hay.css' },
    br: { ietf: 'pt-BR', tk: 'inq1xob.css' },
    // eslint-disable-next-line max-len
    // TODO check that this ietf is ok to use everywhere. It's different in the old project zh-Hans-CN
    cn: { ietf: 'zh-CN', tk: 'qxw8hzm' },
    de: { ietf: 'de-DE', tk: 'vin7zsi.css' },
    dk: { ietf: 'da-DK', tk: 'aaz7dvd.css' },
    es: { ietf: 'es-ES', tk: 'oln4yqj.css' },
    fi: { ietf: 'fi-FI', tk: 'aaz7dvd.css' },
    fr: { ietf: 'fr-FR', tk: 'vrk5vyv.css' },
    gb: { ietf: 'en-GB', tk: 'pps7abe.css' },
    in: { ietf: 'en-IN', tk: 'pps7abe.css' },
    it: { ietf: 'it-IT', tk: 'bbf5pok.css' },
    jp: { ietf: 'ja-JP', tk: 'dvg6awq' },
    kr: { ietf: 'ko-KR', tk: 'qjs5sfm' },
    nl: { ietf: 'nl-NL', tk: 'cya6bri.css' },
    no: { ietf: 'no-NO', tk: 'aaz7dvd.css' },
    se: { ietf: 'sv-SE', tk: 'fpk1pcd.css' },
    // eslint-disable-next-line max-len
    // TODO check that this ietf is ok to use everywhere. It's different in the old project zh-Hant-TW
    tw: { ietf: 'zh-TW', tk: 'jay0ecd' },
    uk: { ietf: 'en-GB', tk: 'pps7abe.css' },
    tr: { ietf: 'tr-TR', tk: 'ley8vds.css' },
    eg: { ietf: 'en-EG', tk: 'pps7abe.css' },
  },
  links: 'on',
};

// Decorate the page with site specific needs.
decorateArea();

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

const miloLibs = setLibs(LIBS);

(function loadStyles() {
  const paths = [`${miloLibs}/styles/styles.css`];
  if (STYLES) { paths.push(STYLES); }
  paths.forEach((path) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  });
}());

(async function loadPage() {
  const { loadArea, setConfig, getMetadata, loadLana, createTag } = await import(`${miloLibs}/utils/utils.js`);

  const jarvisVisibleMeta = getMetadata('jarvis-immediately-visible')?.toLowerCase();
  const desktopViewport = window.matchMedia('(min-width: 900px)').matches;
  if (jarvisVisibleMeta && ['mobile', 'desktop', 'on'].includes(jarvisVisibleMeta) && (
    (jarvisVisibleMeta === 'mobile' && !desktopViewport) || (jarvisVisibleMeta === 'desktop' && desktopViewport))) CONFIG.jarvis.onDemand = false;

  const config = setConfig({ ...CONFIG, miloLibs });

  if (getMetadata('hide-breadcrumbs') !== 'true' && !getMetadata('breadcrumbs') && !window.location.pathname.endsWith('/express/')) {
    // TODO only add this back once we're consuming the milo version of gnav
    // const meta = createTag('meta', { name: 'breadcrumbs', content: 'on' });
    // document.head.append(meta);
    // TODO add with gnav task
    // eslint-disable-next-line max-len
    // import('./gnav.js').then((gnav) => gnav.buildBreadCrumbArray(getConfig().locale.prefix.replaceAll('/', ''))).then((breadcrumbs) => {
    //   if (breadcrumbs && breadcrumbs.length) document.body.classList.add('breadcrumbs-spacing');
    // });
  } else if (getMetadata('breadcrumbs') === 'on' && !!getMetadata('breadcrumbs-base') && (!!getMetadata('short-title') || !!getMetadata('breadcrumbs-page-title'))) document.body.classList.add('breadcrumbs-spacing');

  loadLana({ clientId: 'express' });
  console.log(config);

  const isMobileGating = ['yes', 'true', 'on'].includes(getMetadata('mobile-benchmark')?.toLowerCase()) && document.body.dataset.device === 'mobile';
  const rushGating = ['yes', 'on', 'true'].includes(getMetadata('rush-beta-gating')?.toLowerCase());
  const runGating = () => {
    // TODO add mobile beta stuff
    // import('./mobile-beta-gating.js').then(async (gatingScript) => {
    //   gatingScript.default();
    // });
  };

  if (isMobileGating && rushGating) { runGating(); }

  // prevent milo gnav from loading
  const headerMeta = createTag('meta', { name: 'custom-header', content: 'on' });
  document.head.append(headerMeta);
  const footerMeta = createTag('meta', { name: 'custom-footer', content: 'on' });
  document.head.append(footerMeta);

  // handle split
  const { userAgent } = navigator;
  document.body.dataset.device = userAgent.includes('Mobile') ? 'mobile' : 'desktop';
  const fqaMeta = createTag('meta', { content: 'on' });
  if (document.body.dataset.device === 'mobile'
      || (/Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS|Edg|OPR|Opera|OPiOS|Vivaldi|YaBrowser|Avast|VivoBrowser|GSA/.test(userAgent))) {
    fqaMeta.setAttribute('name', 'fqa-off');
  } else {
    fqaMeta.setAttribute('name', 'fqa-on');
  }
  document.head.append(fqaMeta);

  listenMiloEvents();
  if (getMetadata('sheet-powered') === 'Y') {
    autoUpdateContent(document.getElementsByTagName('main')[0], miloLibs);
  }

  await loadArea();

  if (isMobileGating && !rushGating) { runGating(); }

  import('./express-delayed.js').then((mod) => {
    mod.default();
  });
}());
