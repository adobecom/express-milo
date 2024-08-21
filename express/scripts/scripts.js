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

import { setLibs, buildAutoBlocks, decorateArea, removeIrrelevantSections } from './utils.js';

// Add project-wide style path here.
const STYLES = ['/express/styles/styles.css'];

// Use 'https://milo.adobe.com/libs' if you cannot map '/libs' to milo's origin.
const LIBS = '/libs';

window.express = {};

// Add any config options.
const CONFIG = {
  local: { express: 'stage.projectx.corp.adobe.com', commerce: 'commerce-stg.adobe.com' },
  stage: { express: 'stage.projectx.corp.adobe.com', commerce: 'commerce-stg.adobe.com' },
  prod: { express: 'express.adobe.com', commerce: 'commerce.adobe.com' },
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
  entitlements: {
    '2a537e84-b35f-4158-8935-170c22b8ae87': 'express-entitled',
    'eb0dcb78-3e56-4b10-89f9-51831f2cc37f': 'express-pep',
  },
  links: 'on',
};

const urlParams = new URLSearchParams(window.location.search);

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

const miloLibs = setLibs(LIBS);

document.body.dataset.device = navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop';
removeIrrelevantSections(document);
// LCP image decoration
(function decorateLCPImage() {
  const lcpImg = document.querySelector('img');
  lcpImg?.removeAttribute('loading');
}());

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

function decorateHeroLCP(loadStyle, config, createTag, getMetadata) {
  const template = getMetadata('template');
  const h1 = document.querySelector('main h1');
  if (template !== 'blog') {
    if (h1 && !h1.closest('main > div > div')) {
      const heroPicture = h1.parentElement.querySelector('picture');
      let heroSection;
      const main = document.querySelector('main');
      if (main.children.length === 1) {
        heroSection = createTag('div', { id: 'hero' });
        const div = createTag('div');
        heroSection.append(div);
        if (heroPicture) {
          div.append(heroPicture);
        }
        div.append(h1);
        main.prepend(heroSection);
      } else {
        heroSection = h1.closest('main > div');
        heroSection.id = 'hero';
        heroSection.removeAttribute('style');
      }
      if (heroPicture) {
        heroPicture.classList.add('hero-bg');
      } else {
        heroSection.classList.add('hero-noimage');
      }
    }
  } else if (template === 'blog' && h1 && getMetadata('author') && getMetadata('publication-date')) {
    loadStyle(`${config.codeRoot}/templates/blog/blog.css`);
    document.body.style.visibility = 'hidden';
    const heroSection = createTag('div', { id: 'hero' });
    const main = document.querySelector('main');
    main.prepend(heroSection);
    // split sections for template-list
    const blocks = document.querySelectorAll('main > div > .template-list');
    blocks.forEach((block) => {
      const $section = block.parentNode;
      const $elems = [...$section.children];

      if ($elems.length <= 1) return;

      const $blockSection = createTag('div');
      const $postBlockSection = createTag('div');
      const $nextSection = $section.nextElementSibling;
      $section.parentNode.insertBefore($blockSection, $nextSection);
      $section.parentNode.insertBefore($postBlockSection, $nextSection);

      let $appendTo;
      $elems.forEach(($e) => {
        if ($e === block || ($e.className === 'section-metadata')) {
          $appendTo = $blockSection;
        }

        if ($appendTo) {
          $appendTo.appendChild($e);
          $appendTo = $postBlockSection;
        }
      });

      if (!$postBlockSection.hasChildNodes()) {
        $postBlockSection.remove();
      }
    });
  }
}

(async function loadPage() {
  const {
    loadArea,
    loadStyle,
    setConfig,
    getMetadata,
    loadLana,
    createTag,
  } = await import(`${miloLibs}/utils/utils.js`);

  const jarvisVisibleMeta = getMetadata('jarvis-immediately-visible')?.toLowerCase();
  const desktopViewport = window.matchMedia('(min-width: 900px)').matches;
  if (jarvisVisibleMeta && ['mobile', 'desktop', 'on'].includes(jarvisVisibleMeta) && (
    (jarvisVisibleMeta === 'mobile' && !desktopViewport) || (jarvisVisibleMeta === 'desktop' && desktopViewport))) CONFIG.jarvis.onDemand = false;

  const config = setConfig({ ...CONFIG, miloLibs });
  // Decorate the page with site specific needs.
  decorateArea();

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

  // prevent milo gnav from loading
  const headerMeta = createTag('meta', { name: 'custom-header', content: 'on' });
  document.head.append(headerMeta);
  const footerMeta = createTag('meta', { name: 'custom-footer', content: 'on' });
  document.head.append(footerMeta);

  // listenMiloEvents();
  buildAutoBlocks();
  decorateHeroLCP(loadStyle, config, createTag, getMetadata);
  if (urlParams.get('martech') !== 'off' && getMetadata('martech') !== 'off') {
    import('./instrument.js').then((mod) => { mod.default(); });
  }

  const { default: replaceContent } = await import('./utils/content-replace.js');
  await replaceContent(document.querySelector('main'));

  await loadArea();
  import('./express-delayed.js').then((mod) => {
    mod.default();
  });
}());
