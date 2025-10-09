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

(function loadStyles() {
  // ✅ CRITICAL: Inline critical CSS immediately to prevent render-blocking
  const criticalCSS = `
    /* Critical CSS for immediate rendering - Enhanced for LCP optimization */
    * { box-sizing: border-box; }
    
    body { 
      font-family: 'Trebuchet MS', sans-serif; 
      margin: 0; 
      padding: 0;
      line-height: 1.4;
      color: #000;
      background: #fff;
      font-size: 16px;
    }
    
    h1, h2, h3, h4, h5, h6 { 
      font-family: 'Trebuchet MS', sans-serif; 
      font-weight: 700;
      line-height: 1.2;
      margin: 0.5em 0;
      color: #000;
    }
    
    h1 { 
      font-size: clamp(1.8rem, 4vw, 3rem); 
      font-weight: 900;
      line-height: 1.1;
    }
    h2 { font-size: clamp(1.5rem, 3vw, 2.5rem); }
    h3 { font-size: clamp(1.2rem, 2.5vw, 2rem); }
    
    /* Critical LCP section styling */
    .section:first-child { 
      min-height: 100vh; 
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 2rem 1rem;
    }
    
    main { 
      display: block; 
      width: 100%; 
      min-height: 100vh;
    }
    
    /* Critical image styling */
    img { 
      max-width: 100%; 
      height: auto; 
      display: block;
    }
    
    /* Critical button styling */
    button, .button {
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 16px;
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: inline-block;
    }
    
    /* Critical text styling */
    p {
      font-family: 'Trebuchet MS', sans-serif;
      font-size: 16px;
      line-height: 1.5;
      margin: 1em 0;
    }
    
    /* Prevent layout shift during font loading */
    .headline h1, #free-logo-maker {
      font-size: clamp(1.8rem, 4vw, 3rem);
      font-weight: 900;
      line-height: 1.1;
      color: #000;
    }
    
    /* Critical responsive design */
    @media (min-width: 600px) {
      .section:first-child {
        padding: 3rem 2rem;
      }
    }
    
    @media (min-width: 900px) {
      .headline h1, #free-logo-maker {
        font-size: clamp(2.5rem, 5vw, 4rem);
      }
      .section:first-child {
        padding: 4rem 3rem;
      }
    }
    
    /* Critical loading states */
    .loading {
      opacity: 0.7;
    }
    
    .loaded {
      opacity: 1;
      transition: opacity 0.3s ease;
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
  
  // ✅ Preload critical TypeKit fonts to reduce render delay
  const fontPreloads = [
    'https://use.typekit.net/af/7cdcb44/000000000000000000000000/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257b9199&fvd=n7&v=3',
    'https://use.typekit.net/af/7cdcb44/000000000000000000000000/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257b9199&fvd=n4&v=3',
    'https://use.typekit.net/af/7cdcb44/000000000000000000000000/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257b9199&fvd=n9&v=3'
  ];
  
  fontPreloads.forEach((href) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
  
  // ✅ Preload TypeKit CSS with high priority
  const typekitCSS = document.createElement('link');
  typekitCSS.rel = 'preload';
  typekitCSS.href = 'https://use.typekit.net/jdq5hay.css';
  typekitCSS.as = 'style';
  typekitCSS.onload = function() {
    this.onload = null;
    this.rel = 'stylesheet';
  };
  document.head.appendChild(typekitCSS);
  
  // ✅ Fallback for browsers that don't support preload
  const typekitFallback = document.createElement('link');
  typekitFallback.rel = 'stylesheet';
  typekitFallback.href = 'https://use.typekit.net/jdq5hay.css';
  typekitFallback.media = 'print';
  typekitFallback.onload = function() {
    this.media = 'all';
  };
  document.head.appendChild(typekitFallback);
  
  // ✅ Defer non-critical CSS to prevent render-blocking
  setTimeout(() => {
    const paths = [`${miloLibs}/styles/styles.css`];
    if (STYLES) { paths.push(STYLES); }
    paths.forEach((path) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = path;
      // Add onload to ensure CSS is loaded before showing content
      link.onload = () => {
        document.body.style.visibility = 'visible';
      };
      document.head.appendChild(link);
    });
  }, 50); // Small delay to ensure critical CSS is applied first
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
  
  // ✅ Register service worker for cache optimization
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/express/code/scripts/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  }

  // ✅ Universal image optimization for better performance
  (async function optimizeImages() {
    const { createOptimizedPicture } = await import('./utils/media.js');
    
    // Optimize all images on the page
    const images = document.querySelectorAll('img[src*="/media_"]');
    images.forEach((img) => {
      const src = img.src;
      if (!src.includes('/media_')) return;
      
      const url = new URL(src, window.location.href);
      const { pathname } = url;
      const ext = pathname.substring(pathname.lastIndexOf('.') + 1);
      
      // Determine if LCP candidate
      const isFirstSection = img.closest('.section') === document.querySelector('.section');
      const isFirstImage = img === img.closest('.section')?.querySelector('img');
      const isLCPCandidate = isFirstSection && isFirstImage;
      
      if (isLCPCandidate) {
        // LCP optimization: eager loading, high priority, WebP format
        img.setAttribute('loading', 'eager');
        img.setAttribute('fetchpriority', 'high');
        
        // Calculate optimal width based on container
        const container = img.closest('.section, .column, .block');
        const containerWidth = container?.offsetWidth || 750;
        const optimalWidth = Math.min(containerWidth * 2, 1200); // 2x for retina, max 1200px
        
        // Update src with optimized parameters - more aggressive compression
        const newSrc = `${pathname}?width=${optimalWidth}&format=webp&optimize=high&quality=85`;
        if (img.src !== newSrc) {
          img.src = newSrc;
        }
        
        // Set proper dimensions
        img.setAttribute('width', optimalWidth);
        img.setAttribute('height', Math.round(optimalWidth * 0.6));
        
        // Preload LCP image
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = newSrc;
        preloadLink.fetchPriority = 'high';
        document.head.appendChild(preloadLink);
        
      } else {
        // Standard optimization: lazy loading, WebP format
        img.setAttribute('loading', 'lazy');
        
        // Calculate responsive width
        const container = img.closest('.section, .column, .block');
        const containerWidth = container?.offsetWidth || 400;
        const optimalWidth = Math.min(containerWidth * 2, 900); // 2x for retina, max 900px
        
        // Update src with optimized parameters - more aggressive compression
        const newSrc = `${pathname}?width=${optimalWidth}&format=webp&optimize=high&quality=80`;
        if (img.src !== newSrc) {
          img.src = newSrc;
        }
        
        // Set proper dimensions
        img.setAttribute('width', optimalWidth);
        img.setAttribute('height', Math.round(optimalWidth * 0.6));
      }
    });
  }());
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

  import('./express-delayed.js').then((mod) => {
    mod.default();
  });
}());
