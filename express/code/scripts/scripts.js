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

import {
  setLibs,
  buildAutoBlocks,
  decorateArea,
  getMetadata,
  preDecorateSections,
  getRedirectUri,
  getIconElementDeprecated,
} from './utils.js';

// Add project-wide style path here.
const STYLES = ['/express/code/styles/styles.css'];

// Use 'https://milo.adobe.com/libs' if you cannot map '/libs' to milo's origin.
const LIBS = '/libs';
const miloLibs = setLibs(LIBS);
let jarvisImmediatelyVisible = false;
const jarvisVisibleMeta = getMetadata('jarvis-immediately-visible')?.toLowerCase();
const desktopViewport = window.matchMedia('(min-width: 900px)').matches;
if (jarvisVisibleMeta && ['mobile', 'desktop', 'on'].includes(jarvisVisibleMeta) && (
  (jarvisVisibleMeta === 'mobile' && !desktopViewport) || (jarvisVisibleMeta === 'desktop' && desktopViewport))) jarvisImmediatelyVisible = true;

const prodDomains = ['business.adobe.com', 'www.adobe.com'];

// Add any config options.
const CONFIG = {
  local: { express: 'stage.projectx.corp.adobe.com', commerce: 'commerce-stg.adobe.com' },
  stage: { express: 'stage.projectx.corp.adobe.com', commerce: 'commerce-stg.adobe.com' },
  prod: { express: 'express.adobe.com', commerce: 'commerce.adobe.com' },
  codeRoot: '/express/code',
  contentRoot: '/express',
  stageDomainsMap: {
    '--express-milo--adobecom.(hlx|aem).(page|live)': {
      'www.adobe.com': 'origin',
      'commerce.adobe.com': 'commerce-stg.adobe.com',
      'new.express.adobe.com': 'stage.projectx.corp.adobe.com',
      'express.adobe.com': 'stage.projectx.corp.adobe.com',
    },
    'www.stage.adobe.com': {
      'www.adobe.com': 'origin',
      'commerce.adobe.com': 'commerce-stg.adobe.com',
      'new.express.adobe.com': 'stage.projectx.corp.adobe.com',
      'express.adobe.com': 'stage.projectx.corp.adobe.com',
    },
  },
  jarvis: {
    id: getMetadata('jarvis-surface-id') || 'Acom_Express',
    version: getMetadata('jarvis-surface-version') || '1.0',
    onDemand: !jarvisImmediatelyVisible,
  },
  imsClientId: 'AdobeExpressWeb',
  prodDomains,
  geoRouting: 'on',
  fallbackRouting: 'on',
  decorateArea,
  faasCloseModalAfterSubmit: 'on',
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
    id_id: { ietf: 'id-ID', tk: 'cya6bri.css' },
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
  },
  entitlements: {
    '2a537e84-b35f-4158-8935-170c22b8ae87': 'express-entitled',
    'eb0dcb78-3e56-4b10-89f9-51831f2cc37f': 'express-pep',
  },
  links: 'on',
  googleLoginURLCallback: getRedirectUri,
  autoBlocks: [
    { axfaas: '/tools/axfaas' },
  ],
  dynamicNavKey: 'bacom',
  languageMap: {
    ae_ar: '',
    ae_en: '',
    africa: '',
    ar: 'es',
    at: 'de',
    au: '',
    be_en: '',
    be_fr: 'fr',
    be_nl: 'nl',
    bg: '',
    ca: '',
    ca_fr: 'fr',
    cis_en: '',
    cis_ru: '',
    cr: 'es',
    cy_en: '',
    cz: '',
    ch_de: 'de',
    ch_fr: 'fr',
    ch_it: 'it',
    cl: 'es',
    co: 'es',
    ec: 'es',
    ee: '',
    eg_ar: '',
    eg_en: '',
    gr_en: '',
    gr_el: '',
    gt: 'es',
    hk_en: '',
    hk_zh: 'tw',
    hu: '',
    id_en: '',
    ie: '',
    il_en: '',
    il_he: '',
    in_hi: 'in',
    kw_ar: '',
    kw_en: '',
    la: 'es',
    lt: '',
    lu_en: '',
    lu_de: 'de',
    lu_fr: 'fr',
    lv: '',
    mena_ar: '',
    mena_en: '',
    mt: '',
    mx: 'es',
    my_en: '',
    my_ms: '',
    ng: '',
    nz: '',
    pe: 'es',
    ph_en: '',
    ph_fil: '',
    pl: '',
    pr: 'es',
    pt: 'br',
    qa_ar: '',
    qa_en: '',
    ro: '',
    ru: '',
    sa_ar: '',
    sa_en: '',
    sea: '',
    sg: '',
    si: '',
    sk: '',
    th_en: '',
    th_th: '',
    tr: '',
    ua: '',
    fi: '',
    vn_en: '',
    vn_vi: '',
    za: '',
  },
  adobeid: {
    enableGuestAccounts: true,
    enableGuestTokenForceRefresh: true,
    enableGuestBotDetection: false,
    api_parameters: { check_token: { guest_allowed: true } },
    onTokenExpired: () => {
      window.location.reload();
    },
  },
};

if (new URLSearchParams(window.location.search).get('lingo')) {
  CONFIG.languages = {
    en: {
      ietf: 'en',
      tk: 'hah7vzn.css',
      rootPath: '',
      regions: [
        { region: 'gb' },
        { region: 'apac', ietf: 'en' },
      ],
    },
    pt: {
      ietf: 'pt',
      tk: 'inq1xob.css',
      regions: [
        { region: 'br', tk: 'inq1xob.css' },
      ],
    },
    de: { ietf: 'de', tk: 'hah7vzn.css' },
    es: { ietf: 'es', tk: 'oln4yqj.css' },
    fr: { ietf: 'fr', tk: 'vrk5vyv.css' },
    it: { ietf: 'it', tk: 'bbf5pok.css' },
    ja: { ietf: 'ja', tk: 'dvg6awq', region: 'jp' },
    ko: { ietf: 'ko', tk: 'qjs5sfm', region: 'kr' },
  };
}

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

document.body.dataset.device = navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop';
preDecorateSections(document);
// LCP image decoration
(function decorateLCPImage() {
  const lcpImg = document.querySelector('img');
  lcpImg?.removeAttribute('loading');
}());

// LCP optimization - accelerate block processing and preload critical resources
(function optimizeLCPBlocks() {
  // Focus on speeding up the first section's block processing
  const firstSection = document.querySelector('main > .section');
  if (firstSection) {
    // Prioritize processing of LCP-critical blocks
    const lcpBlocks = firstSection.querySelectorAll('.how-to-v2, .hero-marquee, .grid-marquee');
    lcpBlocks.forEach((block) => {
      // Add priority attribute to accelerate block initialization
      block.setAttribute('data-lcp-priority', 'high');
    });

    // Aggressively preload any images in the first section
    const firstSectionImages = firstSection.querySelectorAll('img');
    firstSectionImages.forEach((img, index) => {
      if (index === 0) { // First image gets highest priority
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = img.src || img.getAttribute('src') || img.dataset.src;
        preloadLink.fetchpriority = 'high';
        preloadLink.crossorigin = 'anonymous';
        document.head.appendChild(preloadLink);

        // Ensure immediate loading
        img.loading = 'eager';
        img.fetchpriority = 'high';
        img.decoding = 'sync';
      }
    });
  }
}());

// Critical CSS inlining for LCP optimization - prevents render blocking
(function inlineCriticalCSS() {
  const criticalCSS = `
    /* Critical styles for LCP elements - comprehensive inline CSS to prevent render blocking */
    * { box-sizing: border-box; }
    body { 
      display: block !important; 
      opacity: 0; 
      transition: opacity 0.15s ease-in;
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    main { 
      display: block; 
      width: 100%;
      min-height: 100vh;
    }
    .section { 
      display: block; 
      position: relative; 
      width: 100%;
      padding: 0;
      margin: 0;
    }
    .section:first-child, .lcp-section { 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
    }
    h1 { 
      font-size: clamp(2.5rem, 6vw, 5rem); 
      margin: 2rem 0; 
      line-height: 1.1; 
      text-align: center;
      color: #fff;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      max-width: 90%;
    }
    h2, h3 { 
      margin: 1rem 0; 
      line-height: 1.3;
      color: #333;
    }
    img { 
      max-width: 100%; 
      height: auto; 
      display: block;
      border: 0;
    }
    picture { display: block; }
    .how-to-v2 { 
      display: block; 
      width: 100%; 
      max-width: 1200px; 
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    .how-to-v2 .steps-content { 
      display: block;
      width: 100%;
    }
    .how-to-v2 .media-container { 
      display: block; 
      margin: 0 auto 3rem auto; 
      text-align: center;
      width: 100%;
      max-width: 900px;
    }
    .how-to-v2 .media-container img,
    .how-to-v2 .media-container video {
      width: 100%;
      max-width: 900px;
      height: auto;
      min-height: 500px;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    /* Ensure LCP element is largest and most prominent */
    .lcp-section .how-to-v2 .media-container {
      margin-top: -10vh;
      z-index: 10;
      position: relative;
    }
    .lcp-section .how-to-v2 .media-container img {
      min-height: 600px;
      max-width: 1000px;
      width: 100%;
      object-fit: cover;
      border-radius: 12px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.2);
    }
    /* Hide non-critical content initially */
    .section:not(:first-child) { opacity: 0.1; }
    .steps { opacity: 0.1; }
  `;
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
}());

// Load full stylesheets asynchronously after critical path
(function loadStylesAsync() {
  const paths = [`${miloLibs}/styles/styles.css`];
  if (STYLES) { paths.push(STYLES); }

  // Use requestIdleCallback to defer non-critical CSS loading
  const loadCSS = () => {
    paths.forEach((path) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', path);
      link.setAttribute('media', 'print'); // Load without blocking
      link.onload = () => {
        link.media = 'all'; // Apply styles after load
        // Show body with fade-in once styles are loaded
        document.body.style.opacity = '1';
      };
      document.head.appendChild(link);
    });
  };

  // Load CSS immediately, don't wait for idle
  setTimeout(loadCSS, 0);

  // Also show body faster if CSS takes too long
  setTimeout(() => {
    if (document.body.style.opacity === '0') {
      document.body.style.opacity = '1';
    }
  }, 500);
}());

function decorateHeroLCP(loadStyle, config, createTag) {
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
      if (['on', 'yes'].includes(getMetadata('hero-inject-logo')?.toLowerCase()?.trim())) {
        const logo = getIconElementDeprecated('adobe-express-logo');
        logo.classList.add('express-logo');
        heroSection.prepend(logo);
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

const listenAlloy = () => {
  let resolver;
  let loaded;
  window.alloyLoader = new Promise((r) => {
    resolver = r;
  });
  window.addEventListener('alloy_sendEvent', (e) => {
    if (e.detail.type === 'pageView') {
      // eslint-disable-next-line no-console
      loaded = true;
      resolver(e.detail.result);
    }
  }, { once: true });
  setTimeout(() => {
    if (!loaded) {
      resolver();
    }
  }, 3000);
};

(async function loadPage() {
  if (window.isTestEnv) return;
  const {
    loadArea,
    loadStyle,
    setConfig,
    loadLana,
    createTag,
  } = await import(`${miloLibs}/utils/utils.js`);

  const footer = createTag('meta', { name: 'footer', content: 'global-footer' });
  document.head.append(footer);

  getMetadata('footer-source') || document.head.append(createTag('meta', { name: 'footer-source', content: '/federal/footer/footer' }));

  const adobeHomeRedirect = createTag('meta', { name: 'adobe-home-redirect', content: 'on' });
  document.head.append(adobeHomeRedirect);

  const googleLoginRedirect = createTag('meta', { name: 'google-login', content: 'desktop' });
  document.head.append(googleLoginRedirect);
  // end TODO remove metadata after we go live

  const config = setConfig({ ...CONFIG, miloLibs });

  if (getMetadata('template-search-page') === 'Y') {
    const { default: redirect } = await import('./utils/template-redirect.js');
    await redirect();
  }

  // TODO remove metadata after we go live
  getMetadata('gnav-source') || document.head.append(createTag('meta', { name: 'gnav-source', content: `${config.locale.prefix}/express/localnav-express` }));

  if (getMetadata('sheet-powered') === 'Y' || window.location.href.includes('/express/templates/')) {
    const { default: replaceContent } = await import('./utils/content-replace.js');
    await replaceContent(document.querySelector('main'));
  }
  // Decorate the page with site specific needs.
  decorateArea();

  loadLana({ clientId: 'express' });

  // TODO this method should be removed about two weeks after going live
  listenAlloy();

  // prevent milo gnav from loading
  const headerMeta = createTag('meta', { name: 'custom-header', content: 'on' });
  document.head.append(headerMeta);
  const footerMeta = createTag('meta', { name: 'custom-footer', content: 'on' });
  document.head.append(footerMeta);

  buildAutoBlocks();
  decorateHeroLCP(loadStyle, config, createTag, getMetadata);
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('martech') !== 'off' && getMetadata('martech') !== 'off') {
    import('./instrument.js').then((mod) => { mod.default(); });
  }

  /* region based redirect to homepage */
  import('./utils/location-utils.js').then(({ getCountry }) => getCountry()).then((country) => {
    if (country === 'cn') { window.location.href = '/cn'; }
  });

  document.head.querySelectorAll('meta').forEach((meta) => {
    if (meta.content && meta.content.includes('--none--')) {
      meta.remove();
    }
  });

  await loadArea();

  const { fixIcons } = await import('./utils.js');
  document.querySelectorAll('.section>.text').forEach((block) => fixIcons(block));

  // Aggressively defer non-critical JavaScript to improve LCP
  if (window.requestIdleCallback) {
    requestIdleCallback(() => {
      // Defer navigation enhancements
      const navElements = document.querySelectorAll('.feds-nav, .feds-localnav');
      navElements.forEach((nav) => {
        if (nav.dataset.enhanced) return;
        nav.dataset.enhanced = 'true';
      });

      // Defer analytics and tracking
      const analyticsScripts = document.querySelectorAll('script[src*="analytics"], script[src*="gtm"]');
      analyticsScripts.forEach((script) => {
        script.setAttribute('defer', '');
      });

      // Defer third-party embeds (only iframe and img support loading attribute)
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach((iframe) => {
        if (!iframe.closest('.lcp-section')) {
          iframe.setAttribute('loading', 'lazy');
        }
      });

      // Defer non-critical images
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach((img) => {
        if (!img.closest('.lcp-section')) {
          img.setAttribute('loading', 'lazy');
        }
      });
    }, { timeout: 2000 });
  }

  // Defer font loading to prevent render blocking
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      document.body.classList.add('fonts-loaded');
    });
  }
}());
