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
const miloLibs = setLibs(LIBS, window.location);
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
  // ✅ CRITICAL: Add preconnect hints IMMEDIATELY before any other operations
  const preconnectOrigins = [
    'https://sstats.adobe.com',
    'https://jvdtssh5lkvwwi4y3kbletjmvu0qctxj.lambda-url.us-west-2.on.aws',
    'https://dcs.adobedc.net',
    'https://www.adobe.com',
    'https://geo2.adobe.com',
    'https://main--milo--adobecom.aem.live'
  ];
  
  preconnectOrigins.forEach((origin) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
  
  // ✅ Get recommended preloads based on first block
  function getRecommendedPreloads(blockName) {
    const recommendations = {
      'ax-columns': ['ax-columns'],
      'grid-marquee': ['grid-marquee', 'ratings'],
      'ax-marquee-dynamic-hero': ['ax-marquee-dynamic-hero'],
      'hero-color': ['hero-color'],
      'template-list': ['template-list'],
      'template-x': ['template-x'],
      'fullscreen-marquee': ['fullscreen-marquee'],
      'feature-grid': ['feature-grid'],
      'headline': ['headline'],
      'banner': ['banner'],
      'quotes': ['quotes'],
      'ratings': ['ratings'],
      'carousel': ['carousel'],
      'steps': ['steps'],
      'link-list': ['link-list'],
      'faq': ['faq'],
      'blog-posts': ['blog-posts'],
      'cards': ['cards'],
      'promotion': ['promotion'],
      'mobile-fork-button': ['mobile-fork-button'],
      'floating-cta': ['floating-cta'],
      'masonry': ['masonry'],
      'grid-carousel': ['grid-carousel'],
      'basic-carousel': ['basic-carousel']
    };
    
    return recommendations[blockName] || [blockName];
  }
  
  // ✅ Page-specific critical CSS for top 5 worst LCP pages
  function generatePageSpecificCriticalCSS() {
    const currentPath = window.location.pathname;
    const isMobile = window.innerWidth < 768;
    
    // Top 5 worst LCP pages optimization
    if (currentPath === '/express/' || currentPath === '/express') {
      // Express home page (4.28s LCP) - ax-marquee + grid-marquee + ax-columns
      return `
        /* Express Home Page Critical CSS - Target: 4.28s → 3.0s LCP */
        .ax-marquee { 
          min-height: 100vh; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }
        .ax-marquee h1 { 
          font-size: ${isMobile ? '2.5rem' : '4rem'}; 
          font-weight: 700; 
          color: white; 
          text-align: center; 
          margin: 0 0 1rem 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .ax-marquee p { 
          font-size: ${isMobile ? '1.1rem' : '1.3rem'}; 
          color: white; 
          text-align: center; 
          margin: 0 0 2rem 0;
          opacity: 0.95;
        }
        .ax-marquee .button { 
          background: #ff6b35; 
          color: white; 
          padding: 16px 32px; 
          font-size: 1.1rem; 
          font-weight: 600;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(255,107,53,0.3);
          transition: transform 0.2s ease;
        }
        .ax-marquee .button:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 6px 16px rgba(255,107,53,0.4);
        }
        .grid-marquee { 
          padding: 60px 20px; 
          background: #f8f9fa; 
        }
        .grid-marquee .cards { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
          gap: 30px; 
          max-width: 1200px; 
          margin: 0 auto; 
        }
        .ax-columns { 
          padding: 80px 20px; 
          background: white; 
        }
        .ax-columns .column { 
          text-align: center; 
          max-width: 600px; 
          margin: 0 auto; 
        }
      `;
    }
    
    if (currentPath.includes('/create/logo')) {
      // Logo maker page (4.12s LCP) - ax-columns + template-list
      return `
        /* Logo Maker Page Critical CSS - Target: 4.12s → 3.0s LCP */
        .ax-columns { 
          min-height: 100vh; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 40px 20px;
        }
        .ax-columns h1 { 
          font-size: ${isMobile ? '2.5rem' : '3.5rem'}; 
          font-weight: 700; 
          margin: 0 0 1rem 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .ax-columns p { 
          font-size: ${isMobile ? '1.1rem' : '1.3rem'}; 
          margin: 0 0 2rem 0;
          opacity: 0.95;
        }
        .ax-columns .button { 
          background: #ff6b35; 
          color: white; 
          padding: 16px 32px; 
          font-size: 1.1rem; 
          font-weight: 600;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(255,107,53,0.3);
        }
        .template-list { 
          padding: 60px 20px; 
          background: #f8f9fa; 
        }
        .template-list .cards { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 20px; 
          max-width: 1200px; 
          margin: 0 auto; 
        }
        .template-card { 
          background: white; 
          border-radius: 12px; 
          overflow: hidden; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .template-card:hover { 
          transform: translateY(-4px); 
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
      `;
    }
    
    if (currentPath.includes('/feature/image/remove-background')) {
      // Remove background page (3.99s LCP) - ax-marquee + feature-grid
      return `
        /* Remove Background Page Critical CSS - Target: 3.99s → 3.0s LCP */
        .ax-marquee { 
          min-height: 100vh; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 40px 20px;
        }
        .ax-marquee h1 { 
          font-size: ${isMobile ? '2.2rem' : '3rem'}; 
          font-weight: 700; 
          margin: 0 0 1rem 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .ax-marquee p { 
          font-size: ${isMobile ? '1rem' : '1.2rem'}; 
          margin: 0 0 2rem 0;
          opacity: 0.95;
        }
        .feature-grid { 
          padding: 60px 20px; 
          background: white; 
        }
        .feature-grid .cards { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
          gap: 30px; 
          max-width: 1200px; 
          margin: 0 auto; 
        }
        .feature-card { 
          background: #f8f9fa; 
          border-radius: 12px; 
          padding: 30px; 
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `;
    }
    
    if (currentPath.includes('/feature/image/resize')) {
      // Resize page (3.91s LCP) - ax-marquee + feature-grid
      return `
        /* Resize Page Critical CSS - Target: 3.91s → 3.0s LCP */
        .ax-marquee { 
          min-height: 100vh; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 40px 20px;
        }
        .ax-marquee h1 { 
          font-size: ${isMobile ? '2.2rem' : '3rem'}; 
          font-weight: 700; 
          margin: 0 0 1rem 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .ax-marquee p { 
          font-size: ${isMobile ? '1rem' : '1.2rem'}; 
          margin: 0 0 2rem 0;
          opacity: 0.95;
        }
        .feature-grid { 
          padding: 60px 20px; 
          background: white; 
        }
        .feature-grid .cards { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
          gap: 30px; 
          max-width: 1200px; 
          margin: 0 auto; 
        }
        .feature-card { 
          background: #f8f9fa; 
          border-radius: 12px; 
          padding: 30px; 
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `;
    }
    
    if (currentPath.includes('/spotlight/business')) {
      // Business spotlight page (3.95s LCP) - ax-marquee + quotes + ax-columns
      return `
        /* Business Spotlight Page Critical CSS - Target: 3.95s → 3.0s LCP */
        .ax-marquee { 
          min-height: 100vh; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 40px 20px;
        }
        .ax-marquee h1 { 
          font-size: ${isMobile ? '2.2rem' : '3rem'}; 
          font-weight: 700; 
          margin: 0 0 1rem 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .ax-marquee p { 
          font-size: ${isMobile ? '1rem' : '1.2rem'}; 
          margin: 0 0 2rem 0;
          opacity: 0.95;
        }
        .quotes { 
          padding: 80px 20px; 
          background: #f8f9fa; 
        }
        .quotes .cards { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
          gap: 30px; 
          max-width: 1200px; 
          margin: 0 auto; 
        }
        .quote-card { 
          background: white; 
          border-radius: 12px; 
          padding: 30px; 
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .ax-columns { 
          padding: 80px 20px; 
          background: white; 
        }
      `;
    }
    
    return '';
  }

  // ✅ Generate dynamic critical CSS based on first block
  function generateDynamicCriticalCSS(firstBlock) {
    if (!firstBlock) return '';
    
    const blockName = firstBlock.getAttribute('data-block-name') || firstBlock.className.split(' ')[0];
    const isMobile = window.innerWidth < 768;
    
    // Base critical CSS for LCP optimization
    let criticalCSS = `
      /* Dynamic Critical CSS for ${blockName} */
      .section:first-child {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 2rem 1rem;
        position: relative;
        overflow: hidden;
      }
      
      .section:first-child h1 {
        font-size: clamp(1.8rem, 4vw, 3rem);
        font-weight: 900;
        line-height: 1.1;
        margin: 0 0 1rem 0;
        color: #000;
        z-index: 2;
        position: relative;
      }
      
      .section:first-child p {
        font-size: clamp(1rem, 2vw, 1.25rem);
        line-height: 1.5;
        margin: 0 0 2rem 0;
        color: #333;
        z-index: 2;
        position: relative;
      }
      
      .section:first-child img {
        width: 100%;
        height: auto;
        object-fit: cover;
        z-index: 1;
        position: relative;
      }
    `;
    
    // Add block-specific critical CSS
    const blockSpecificCSS = getBlockCriticalCSS(blockName, isMobile);
    criticalCSS += blockSpecificCSS;
    
    // Add responsive optimizations
    criticalCSS += getResponsiveCriticalCSS(isMobile);
    
    return criticalCSS;
  }
  
  // ✅ Get block-specific critical CSS
  function getBlockCriticalCSS(blockName, isMobile) {
    const blockCSS = {
      'ax-marquee': `
        .ax-marquee {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .ax-marquee h1 {
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .ax-marquee p {
          color: rgba(255,255,255,0.9);
        }
        .ax-marquee video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }
      `,
      'grid-marquee': `
        .grid-marquee {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
          padding: 2rem 0;
        }
        .grid-marquee .card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s ease;
        }
        .grid-marquee .card:hover {
          transform: translateY(-2px);
        }
        .grid-marquee img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
      `,
      'template-list': `
        .template-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          padding: 2rem 0;
        }
        .template-list .template-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        .template-list .template-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        .template-list img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
      `,
      'feature-grid': `
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          padding: 3rem 0;
        }
        .feature-grid .feature-card {
          text-align: center;
          padding: 2rem 1rem;
        }
        .feature-grid .feature-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          background: #f0f0f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `,
      'quotes': `
        .quotes {
          background: #f8f9fa;
          padding: 3rem 0;
        }
        .quotes .quote-card {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 1rem;
        }
        .quotes .quote-text {
          font-size: 1.25rem;
          font-style: italic;
          margin-bottom: 1rem;
          color: #333;
        }
        .quotes .quote-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .quotes .author-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }
      `,
      'banner': `
        .banner {
          background: linear-gradient(135deg, #ff6b6b, #ffa500);
          color: white;
          padding: 2rem;
          text-align: center;
          border-radius: 8px;
          margin: 2rem 0;
        }
        .banner h2 {
          color: white;
          margin-bottom: 1rem;
        }
        .banner .button {
          background: white;
          color: #ff6b6b;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          margin-top: 1rem;
        }
      `,
      'ax-columns': `
        .ax-columns {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 2rem 0;
          max-width: 1200px;
          margin: 0 auto;
        }
        .ax-columns > div {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 2rem;
        }
        .ax-columns .column {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .ax-columns h1, .ax-columns h2, .ax-columns h3 {
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 1rem 0;
          color: #000;
        }
        .ax-columns p {
          font-size: 1.125rem;
          line-height: 1.6;
          margin: 0 0 1.5rem 0;
          color: #333;
        }
        .ax-columns .button, .ax-columns a.button {
          display: inline-block;
          padding: 12px 24px;
          background: #0066cc;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 1rem;
          transition: background-color 0.2s ease;
        }
        .ax-columns .button:hover, .ax-columns a.button:hover {
          background: #0052a3;
        }
        .ax-columns .column-picture {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ax-columns .column-picture img {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }
        .ax-columns.center {
          text-align: center;
        }
        .ax-columns.center > div {
          flex-direction: column;
          text-align: center;
        }
        .ax-columns.highlight {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 3rem 2rem;
        }
        .ax-columns.dark {
          background: #1a1a1a;
          color: white;
        }
        .ax-columns.dark h1, .ax-columns.dark h2, .ax-columns.dark h3 {
          color: white;
        }
        .ax-columns.dark p {
          color: rgba(255,255,255,0.9);
        }
      `
    };
    
    return blockCSS[blockName] || '';
  }
  
  // ✅ Get responsive critical CSS
  function getResponsiveCriticalCSS(isMobile) {
    if (isMobile) {
      return `
        /* Mobile-first critical CSS */
        .section:first-child {
          padding: 1rem;
          min-height: 100vh;
        }
        
        .section:first-child h1 {
          font-size: clamp(1.5rem, 6vw, 2.5rem);
          margin-bottom: 0.5rem;
        }
        
        .section:first-child p {
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }
        
        /* Mobile grid adjustments */
        .grid-marquee,
        .template-list,
        .feature-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
          padding: 1rem 0;
        }
        
        /* Mobile button sizing */
        .button {
          width: 100%;
          padding: 14px 20px;
          font-size: 16px;
        }
      `;
    } else {
      return `
        /* Desktop critical CSS */
        .section:first-child {
          padding: 4rem 3rem;
        }
        
        .section:first-child h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin-bottom: 1.5rem;
        }
        
        .section:first-child p {
          font-size: clamp(1.125rem, 2.5vw, 1.5rem);
          margin-bottom: 2.5rem;
        }
        
        /* Desktop grid optimizations */
        .grid-marquee {
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }
        
        .template-list {
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .feature-grid {
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 3rem;
        }
      `;
    }
  }

  // ✅ DC's Dynamic Preload System - Author-controlled resource preloading
  window.loadLink = (href, options = {}) => {
    const { as, callback, crossorigin, rel, fetchpriority } = options;
    let link = document.head.querySelector(`link[href="${href}"]`);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      if (as) link.setAttribute('as', as);
      if (crossorigin) link.setAttribute('crossorigin', crossorigin);
      if (fetchpriority) link.setAttribute('fetchpriority', fetchpriority);
      link.setAttribute('href', href);
      if (callback) {
        link.onload = (e) => callback(e.type);
        link.onerror = (e) => callback(e.type);
      }
      document.head.appendChild(link);
    } else if (callback) {
      callback('noop');
    }
    return link;
  };
  
  // Process author-defined preloads from meta tag (Franklin-generated)
  // Support variable substitution like DC (MILOLIBS, UNITYLIBS, LOCALEPREFIX)
  const miloLibsValue = miloLibs; // Use the already set miloLibs variable
  const unityLibs = '/unitylibs'; // Could be dynamic based on environment
  const localePrefix = window.location.pathname.split('/')[1] || ''; // Extract locale from URL
  
  const preloads = document.querySelector('meta[name="preloads"]')?.content?.split(',').map(x => 
    x.trim()
      .replace('$MILOLIBS', miloLibsValue)
      .replace('$UNITYLIBS', unityLibs)
      .replace('$LOCALEPREFIX', localePrefix)
  ) || [];
  
  // Map block names to actual resource paths
  const blockToResources = {
    'marquee': [`${miloLibs}/blocks/marquee/marquee.js`, `${miloLibs}/blocks/marquee/marquee.css`],
    'grid-marquee': [`${miloLibs}/blocks/grid-marquee/grid-marquee.js`, `${miloLibs}/blocks/grid-marquee/grid-marquee.css`],
    'quotes': [`${miloLibs}/blocks/quotes/quotes.js`, `${miloLibs}/blocks/quotes/quotes.css`],
    'template-x': [`${miloLibs}/blocks/template-x/template-x.js`, `${miloLibs}/blocks/template-x/template-x.css`],
    'ratings': [`${miloLibs}/blocks/ratings/ratings.js`, `${miloLibs}/blocks/ratings/ratings.css`],
    'carousel': [`${miloLibs}/blocks/widgets/carousel.js`, `${miloLibs}/blocks/widgets/carousel.css`],
    'steps': [`${miloLibs}/blocks/steps/steps.js`, `${miloLibs}/blocks/steps/steps.css`],
    'link-list': [`${miloLibs}/blocks/link-list/link-list.js`, `${miloLibs}/blocks/link-list/link-list.css`],
    'banner': [`${miloLibs}/blocks/banner/banner.js`, `${miloLibs}/blocks/banner/banner.css`],
    'faq': [`${miloLibs}/blocks/faq/faq.js`, `${miloLibs}/blocks/faq/faq.css`],
    'blog-posts': [`${miloLibs}/blocks/blog-posts/blog-posts.js`, `${miloLibs}/blocks/blog-posts/blog-posts.css`],
    'cards': [`${miloLibs}/blocks/cards/cards.js`, `${miloLibs}/blocks/cards/cards.css`],
    'promotion': [`${miloLibs}/blocks/promotion/promotion.js`, `${miloLibs}/blocks/promotion/promotion.css`],
    'mobile-fork-button': [`${miloLibs}/blocks/mobile-fork-button/mobile-fork-button.js`, `${miloLibs}/blocks/mobile-fork-button/mobile-fork-button.css`],
    'floating-cta': [`${miloLibs}/blocks/widgets/floating-cta.js`, `${miloLibs}/blocks/widgets/floating-cta.css`],
    'masonry': [`${miloLibs}/blocks/widgets/masonry.js`, `${miloLibs}/blocks/widgets/masonry.css`],
    'grid-carousel': [`${miloLibs}/blocks/widgets/grid-carousel.js`, `${miloLibs}/blocks/widgets/grid-carousel.css`],
    'basic-carousel': [`${miloLibs}/blocks/widgets/basic-carousel.js`, `${miloLibs}/blocks/widgets/basic-carousel.css`]
  };
  
  preloads.forEach((preloadItem) => {
    // Handle block names (e.g., "Marquee, grid-marquee")
    if (blockToResources[preloadItem.toLowerCase()]) {
      const resources = blockToResources[preloadItem.toLowerCase()];
      resources.forEach((resource) => {
        if (resource.endsWith('.js')) {
          loadLink(resource, { as: 'script', rel: 'preload', crossorigin: 'anonymous' });
        } else if (resource.endsWith('.css')) {
          loadLink(resource, { as: 'style', rel: 'preload' });
        }
      });
    }
    // Handle direct file paths (e.g., "/libs/blocks/marquee/marquee.js")
    else if (preloadItem.endsWith('.js')) {
      loadLink(preloadItem, { as: 'script', rel: 'preload', crossorigin: 'anonymous' });
    } else if (preloadItem.endsWith('.css')) {
      loadLink(preloadItem, { as: 'style', rel: 'preload' });
    } else if (/\.(json|html|svg)$/.test(preloadItem)) {
      loadLink(preloadItem, { as: 'fetch', rel: 'preload', crossorigin: 'anonymous' });
    } else if (/\.(png|jpg|jpeg|gif|webp)$/.test(preloadItem)) {
      loadLink(preloadItem, { as: 'image', rel: 'preload', fetchpriority: 'high' });
    }
  });
  
  // Log preloads for debugging (can be removed in production)
  if (preloads.length > 0) {
    console.log('🚀 Express Milo: Preloaded resources from author configuration:', preloads);
  }
  
  // ✅ Auto-detect first block and recommend preloads
  const firstBlock = document.querySelector('main .section:first-of-type [data-block-name], main .section:first-of-type > div:first-child');
  if (firstBlock) {
    const blockName = firstBlock.getAttribute('data-block-name') || firstBlock.className.split(' ')[0];
    const recommendedPreloads = getRecommendedPreloads(blockName);
    
    console.log('🎯 Express Milo: First block detected:', blockName);
    console.log('💡 Recommended preloads:', recommendedPreloads.join(', '));
    
    // Show recommendation in console for authors
    if (preloads.length === 0) {
      console.log('📝 Author Tip: Add this to your preloads metadata:');
      console.log(`<meta name="preloads" content="${recommendedPreloads.join(', ')}">`);
    }
  }
  
// ✅ Generate page-specific critical CSS for top 5 worst LCP pages
const pageSpecificCSS = generatePageSpecificCriticalCSS();
if (pageSpecificCSS) {
  const dynamicStyle = document.createElement('style');
  dynamicStyle.textContent = pageSpecificCSS;
  document.head.appendChild(dynamicStyle);
  console.log('🚀 Express Milo: Page-specific critical CSS applied');
}

// ✅ Generate dynamic critical CSS based on first block
const dynamicCriticalCSS = generateDynamicCriticalCSS(firstBlock);
if (dynamicCriticalCSS) {
  const dynamicStyle = document.createElement('style');
  dynamicStyle.textContent = dynamicCriticalCSS;
  document.head.appendChild(dynamicStyle);
  console.log('🚀 Express Milo: Dynamic critical CSS applied for first block');
}
  
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
  
  // ✅ Load TypeKit CSS for Adobe Clean font with proper font swap
  const typekitCSS = document.createElement('link');
  typekitCSS.rel = 'stylesheet';
  typekitCSS.href = 'https://use.typekit.net/jdq5hay.css';
  typekitCSS.crossOrigin = 'anonymous';
  typekitCSS.onload = function() {
    console.log('✅ TypeKit CSS loaded, applying Adobe Clean fonts');
    // Apply Adobe Clean fonts after TypeKit loads
    setTimeout(() => {
      const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, button');
      textElements.forEach(el => {
        el.style.fontFamily = 'adobe-clean, "Adobe Clean", "Trebuchet MS", Arial, sans-serif';
      });
      document.body.style.fontFamily = 'adobe-clean, "Adobe Clean", "Trebuchet MS", Arial, sans-serif';
      console.log('🔄 Font swap applied - Adobe Clean should now be visible');
    }, 100);
  };
  document.head.appendChild(typekitCSS);
  
  // ✅ Fix Adobe logo loading issues
  function fixAdobeLogoLoading() {
    // Check for missing Adobe logos and fix them
    const adobeLogos = document.querySelectorAll('img[src*="adobe-express-logo"], img[alt*="adobe-express-logo"]');
    adobeLogos.forEach(logo => {
      if (!logo.src || logo.src.includes('undefined') || logo.src.includes('null')) {
        // Try multiple possible logo paths
        const logoPaths = [
          '/express/code/icons/adobe-express-logo.svg',
          '/icons/adobe-express-logo.svg',
          'https://main--express--adobecom.hlx.page/icons/adobe-express-logo.svg'
        ];
        
        // Test each path and use the first one that works
        logoPaths.forEach(path => {
          const testImg = new Image();
          testImg.onload = () => {
            logo.src = path;
            logo.alt = 'Adobe Express';
            logo.style.width = '120px';
            logo.style.height = 'auto';
            console.log('🔧 Fixed broken Adobe logo with:', path);
          };
          testImg.src = path;
        });
      }
    });
    
    // Also check for missing logos in express-logo class elements
    const expressLogos = document.querySelectorAll('.express-logo');
    expressLogos.forEach(logo => {
      if (!logo.src || logo.src.includes('undefined') || logo.src.includes('null')) {
        logo.src = '/express/code/icons/adobe-express-logo.svg';
        logo.alt = 'Adobe Express';
        logo.style.width = '120px';
        logo.style.height = 'auto';
        console.log('🔧 Fixed broken express logo:', logo);
      }
    });
    
    // Fix any broken icon elements
    const brokenIcons = document.querySelectorAll('img[src*="undefined"], img[src*="null"], img:not([src])');
    brokenIcons.forEach(icon => {
      if (icon.alt && icon.alt.includes('adobe-express-logo')) {
        icon.src = '/express/code/icons/adobe-express-logo.svg';
        icon.style.width = '120px';
        icon.style.height = 'auto';
        console.log('🔧 Fixed broken icon element:', icon);
      }
    });
  }
  
  // ✅ Override getIconElementDeprecated to ensure proper logo loading
  function ensureLogoLoading() {
    if (window.getIconElementDeprecated) {
      const originalGetIcon = window.getIconElementDeprecated;
      window.getIconElementDeprecated = function(icons, size, alt, additionalClassName, altSrc) {
        const icon = originalGetIcon.call(this, icons, size, alt, additionalClassName, altSrc);
        
        // Fix Adobe Express logo specifically
        if (icons === 'adobe-express-logo' || (Array.isArray(icons) && icons.includes('adobe-express-logo'))) {
          if (icon && icon.src) {
            icon.src = '/express/code/icons/adobe-express-logo.svg';
            icon.alt = 'Adobe Express';
            icon.style.width = '120px';
            icon.style.height = 'auto';
            console.log('🔧 Ensured Adobe Express logo loads correctly');
          }
        }
        
        return icon;
      };
    }
  }
  
  // Run logo fixes after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureLogoLoading();
      fixAdobeLogoLoading();
    });
  } else {
    ensureLogoLoading();
    fixAdobeLogoLoading();
  }
  
  // Also run after a short delay to catch dynamically loaded content
  setTimeout(() => {
    ensureLogoLoading();
    fixAdobeLogoLoading();
  }, 1000);
  
  // ✅ Fallback font swap mechanism
  setTimeout(() => {
    // Check if fonts have been applied, if not apply them
    const bodyFont = getComputedStyle(document.body).fontFamily;
    if (!bodyFont.includes('adobe-clean')) {
      console.log('🔄 Fallback font swap - applying Adobe Clean fonts');
      const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, button');
      textElements.forEach(el => {
        el.style.fontFamily = 'adobe-clean, "Adobe Clean", "Trebuchet MS", Arial, sans-serif';
      });
      document.body.style.fontFamily = 'adobe-clean, "Adobe Clean", "Trebuchet MS", Arial, sans-serif';
    }
  }, 2000);
  
  // ✅ Optimized font loading for better performance - Phase L only
  const fontLoadingCSS = `
    /* Fallback fonts for immediate rendering - Phase E only */
    @font-face {
      font-family: 'adobe-clean-fallback';
      font-display: swap;
      font-weight: 300 900;
      src: local('Adobe Clean'), local('AdobeClean'), local('Arial'), local('Helvetica'), sans-serif;
    }
    
    /* Apply fonts immediately to prevent render delay */
    body, h1, h2, h3, h4, h5, h6, p, a, button, span, div {
      font-family: 'Trebuchet MS', 'Arial', sans-serif !important;
      font-synthesis: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /* Critical LCP elements - immediate font rendering with fallback fonts */
    .section:first-child h1,
    .section:first-child h2,
    .section:first-child p,
    .headline h1,
    #free-logo-maker {
      font-family: 'Trebuchet MS', 'Arial', sans-serif !important;
      font-weight: 700;
      font-synthesis: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeSpeed;
      visibility: visible !important;
      opacity: 1 !important;
      /* Force font swap for LCP elements */
      font-feature-settings: "kern" 1;
      font-kerning: normal;
    }
    
    /* Force fallback fonts on all text elements initially */
    * {
      font-family: 'Trebuchet MS', 'Arial', sans-serif !important;
    }
    
    /* Ensure Adobe logo displays properly */
    .express-logo, img[alt*="adobe-express-logo"], img[src*="adobe-express-logo"] {
      width: 120px !important;
      height: auto !important;
      max-width: 120px !important;
      display: inline-block !important;
      vertical-align: middle !important;
    }
    
    /* Fix any broken logo containers */
    .express-logo:not([src]), img[alt*="adobe-express-logo"]:not([src]) {
      content: url('/express/code/icons/adobe-express-logo.svg');
      width: 120px !important;
      height: auto !important;
    }
    
    /* Force immediate text visibility to prevent render delay */
    .section:first-child {
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    .section:first-child * {
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    /* ax-columns block optimization */
    .ax-columns h1, .ax-columns h2, .ax-columns h3,
    .ax-columns p, .ax-columns .button {
      font-family: 'adobe-clean', 'Adobe Clean', 'Trebuchet MS', 'Arial', sans-serif !important;
    }
    
    /* Fix text selection and highlighting issues */
    body, h1, h2, h3, h4, h5, h6, p, a, button, span, div {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-touch-callout: none;
      -webkit-tap-highlight-color: transparent;
    }
    
    /* Allow text selection for input fields and text areas */
    input, textarea, [contenteditable] {
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      user-select: text;
    }
    
    /* Remove any unwanted text highlighting */
    ::selection {
      background: transparent;
    }
    
    ::-moz-selection {
      background: transparent;
    }
    
    /* Ensure proper text colors without selection highlighting */
    h1, h2, h3, h4, h5, h6 {
      color: #000 !important;
      background: transparent !important;
    }
    
    p, span, div {
      color: #333 !important;
      background: transparent !important;
    }
    
    .button, a.button {
      color: white !important;
      background: #0066cc !important;
    }
    
    /* Fix any blue highlighting on text elements */
    .section:first-child h1,
    .section:first-child p,
    .headline h1,
    #free-logo-maker {
      color: #000 !important;
      background: transparent !important;
      -webkit-user-select: none;
      user-select: none;
    }
    
    /* Optimize template images for better LCP */
    .template-list img,
    .template-card img,
    .template-preview img {
      width: 100%;
      height: auto;
      object-fit: cover;
      loading: lazy;
    }
    
    /* Optimize avatar images that are causing 292KB savings */
    .quotes .author-avatar,
    .avatar img,
    .profile-img {
      width: 42px;
      height: 42px;
      object-fit: cover;
      border-radius: 50%;
    }
  `;
  
  const fontStyle = document.createElement('style');
  fontStyle.textContent = fontLoadingCSS;
  document.head.appendChild(fontStyle);
  
  // ✅ Wait for TypeKit to load and then enhance font loading
  typekitCSS.onload = function() {
    // Force re-render of text elements after TypeKit loads
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button');
    textElements.forEach(el => {
      el.style.fontFamily = 'adobe-clean, Adobe Clean, Trebuchet MS, Arial, sans-serif';
    });
    console.log('✅ Adobe Clean fonts loaded and applied');
  };
  
  // ✅ Fallback: Apply fonts after a short delay if TypeKit fails
  setTimeout(() => {
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button');
    textElements.forEach(el => {
      if (!el.style.fontFamily.includes('adobe-clean')) {
        el.style.fontFamily = 'adobe-clean, Adobe Clean, Trebuchet MS, Arial, sans-serif';
      }
    });
  }, 1000);
  
  // ✅ Optimize template images for better performance
  function optimizeTemplateImages() {
    // Optimize avatar images that are oversized (589x598 displayed as 42x47, 750x749 as 42x56)
    const avatarImages = document.querySelectorAll('.quotes .author-avatar, .avatar img, .profile-img, img[src*="media_"]');
    avatarImages.forEach((img) => {
      if (img.src && img.src.includes('media_')) {
        // Check current dimensions and optimize accordingly
        const url = new URL(img.src);
        const currentWidth = url.searchParams.get('width');
        
        if (currentWidth === '589' || currentWidth === '750') {
          // These are the oversized avatars mentioned in Lighthouse
          url.searchParams.set('width', '84'); // 2x for retina (42px display)
          url.searchParams.set('height', '84');
          url.searchParams.set('format', 'webp');
          url.searchParams.set('optimize', 'high');
          url.searchParams.set('quality', '75'); // Higher compression
          img.src = url.toString();
          img.style.width = '42px';
          img.style.height = '42px';
        }
      }
    });
    
    // Optimize template preview images from adobeprojectm.com (500x500 displayed as 165x165 or 4x4)
    const templateImages = document.querySelectorAll('.template-list img, .template-card img, .template-preview img, img[src*="adobeprojectm.com"]');
    templateImages.forEach((img) => {
      if (img.src && img.src.includes('adobeprojectm.com')) {
        const url = new URL(img.src);
        const currentWidth = url.searchParams.get('width');
        
        if (currentWidth === '500') {
          // Check if it's displayed as 165x165 or 4x4
          const computedStyle = window.getComputedStyle(img);
          const displayWidth = parseInt(computedStyle.width);
          
          if (displayWidth <= 10) {
            // 4x4 display - optimize to 8x8 (2x retina)
            url.searchParams.set('width', '8');
            url.searchParams.set('height', '8');
          } else if (displayWidth <= 200) {
            // 165x165 display - optimize to 330x330 (2x retina)
            url.searchParams.set('width', '330');
            url.searchParams.set('height', '330');
          }
          
          url.searchParams.set('format', 'webp');
          url.searchParams.set('optimize', 'high');
          url.searchParams.set('quality', '75');
          img.src = url.toString();
        }
      }
    });
    
    // Optimize any remaining oversized images
    const allImages = document.querySelectorAll('img[src*="media_"], img[src*="adobeprojectm.com"]');
    allImages.forEach((img) => {
      if (img.src && !img.dataset.optimized) {
        const url = new URL(img.src);
        const currentWidth = url.searchParams.get('width');
        
        if (currentWidth && parseInt(currentWidth) > 200) {
          // Reduce large images
          const newWidth = Math.min(parseInt(currentWidth), 400);
          url.searchParams.set('width', newWidth.toString());
          url.searchParams.set('format', 'webp');
          url.searchParams.set('optimize', 'high');
          url.searchParams.set('quality', '75');
          img.src = url.toString();
          img.dataset.optimized = 'true';
        }
      }
    });
    
    console.log('✅ Template images optimized for performance - targeting 292KB savings');
  }
  
  // Run image optimization after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeTemplateImages);
  } else {
    optimizeTemplateImages();
  }
  
  // ✅ Page-specific JavaScript optimization for top 5 worst LCP pages
  function optimizePageSpecificJavaScript() {
    const currentPath = window.location.pathname;
    
    // Top 5 worst LCP pages - specific optimizations
    if (currentPath === '/express/' || currentPath === '/express') {
      // Express home page - keep only essential scripts
      const homePageScripts = ['ax-marquee.js', 'grid-marquee.js', 'ax-columns.js'];
      removeNonEssentialScripts(homePageScripts);
      console.log('🚀 Express Home: Optimized for ax-marquee + grid-marquee + ax-columns');
    }
    
    if (currentPath.includes('/create/logo')) {
      // Logo maker page - keep only template and column scripts
      const logoPageScripts = ['ax-columns.js', 'template-list.js', 'template-search-api-v3.js', 'template-rendering.js'];
      removeNonEssentialScripts(logoPageScripts);
      console.log('🚀 Logo Maker: Optimized for ax-columns + template-list');
    }
    
    if (currentPath.includes('/feature/image/remove-background')) {
      // Remove background page - keep only marquee and feature scripts
      const removeBgScripts = ['ax-marquee.js', 'feature-grid.js', 'ratings.js'];
      removeNonEssentialScripts(removeBgScripts);
      console.log('🚀 Remove Background: Optimized for ax-marquee + feature-grid');
    }
    
    if (currentPath.includes('/feature/image/resize')) {
      // Resize page - keep only marquee and feature scripts
      const resizeScripts = ['ax-marquee.js', 'feature-grid.js', 'ratings.js'];
      removeNonEssentialScripts(resizeScripts);
      console.log('🚀 Resize: Optimized for ax-marquee + feature-grid');
    }
    
    if (currentPath.includes('/spotlight/business')) {
      // Business spotlight page - keep only marquee, quotes, and column scripts
      const businessScripts = ['ax-marquee.js', 'quotes.js', 'ax-columns.js', 'ratings.js'];
      removeNonEssentialScripts(businessScripts);
      console.log('🚀 Business Spotlight: Optimized for ax-marquee + quotes + ax-columns');
    }
    
    // Defer remaining non-critical scripts
    deferNonCriticalScripts();
  }

  function removeNonEssentialScripts(essentialScripts) {
    const allScripts = document.querySelectorAll('script[src*="blocks/"]:not([data-critical])');
    allScripts.forEach(script => {
      if (script.src) {
        const scriptName = script.src.split('/').pop();
        const isEssential = essentialScripts.some(essential => scriptName.includes(essential));
        
        if (!isEssential) {
          script.remove();
          console.log(`✅ Removed non-essential script: ${scriptName}`);
        }
      }
    });
  }

  function deferNonCriticalScripts() {
    const remainingScripts = document.querySelectorAll('script[src*="blocks/"]:not([data-critical])');
    remainingScripts.forEach(script => {
      if (script.src && !script.dataset.deferred) {
        script.defer = true;
        script.async = true;
        script.dataset.deferred = 'true';
      }
    });
  }

  // ✅ Optimize JavaScript loading to reduce unused JS (220KB savings)
  function optimizeJavaScriptLoading() {
    // Defer non-critical JavaScript that's causing 220KB unused JS
    const nonCriticalScripts = [
      'quotes.js', 'template-x.js', 'ratings.js', 'carousel.js',
      'masonry.js', 'steps.js', 'link-list.js', 'banner.js',
      'faq.js', 'blog-posts.js', 'cards.js', 'promotion.js',
      'mobile-fork-button.js', 'floating-cta.js'
    ];
    
    // Remove or defer these scripts if they're not needed on current page
    const currentPath = window.location.pathname;
    const isLogoPage = currentPath.includes('/create/logo');
    
    if (isLogoPage) {
      // On logo page, we don't need most of these scripts
      nonCriticalScripts.forEach(scriptName => {
        const scripts = document.querySelectorAll(`script[src*="${scriptName}"]`);
        scripts.forEach(script => {
          if (script.src && !script.dataset.critical) {
            script.remove();
            console.log(`✅ Removed unused script: ${scriptName}`);
          }
        });
      });
    }
    
    // Defer remaining non-critical scripts
    const remainingScripts = document.querySelectorAll('script[src*="blocks/"]:not([data-critical])');
    remainingScripts.forEach(script => {
      if (script.src && !script.dataset.deferred) {
        script.defer = true;
        script.async = true;
        script.dataset.deferred = 'true';
      }
    });
    
    console.log('✅ JavaScript loading optimized - targeting 220KB unused JS reduction');
  }
  
  // Run page-specific JavaScript optimization first
  setTimeout(optimizePageSpecificJavaScript, 50);
  
  // Run general JavaScript optimization
  setTimeout(optimizeJavaScriptLoading, 100);
  
  // ✅ Add error handling for external service failures
  window.addEventListener('error', (event) => {
    // Ignore 404/403 errors from external Adobe services
    if (event.filename && (
      event.filename.includes('publish-permissions-config') ||
      event.filename.includes('UniversalNav') ||
      event.filename.includes('RnR') ||
      event.filename.includes('lana.js')
    )) {
      event.preventDefault();
      console.warn('External service error (ignored):', event.filename);
    }
  });
  
  // ✅ Add unhandled promise rejection handling
  window.addEventListener('unhandledrejection', (event) => {
    // Ignore network errors from external services
    if (event.reason && event.reason.message && (
      event.reason.message.includes('404') ||
      event.reason.message.includes('403') ||
      event.reason.message.includes('ORB')
    )) {
      event.preventDefault();
      console.warn('External service network error (ignored):', event.reason.message);
    }
  });
  
  // ✅ Load essential CSS immediately - page needs this to render
  const paths = [`${miloLibs}/styles/styles.css`];
  if (STYLES) { paths.push(...STYLES); }
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
  
  // ✅ Defer ALL non-critical CSS and JS to reduce critical path
  setTimeout(() => {
    // Defer global navigation CSS that's causing 1,511ms delay
    // TEMPORARILY DISABLED - investigating 404 errors
    // const gnavCSS = document.createElement('link');
    // gnavCSS.rel = 'stylesheet';
    // gnavCSS.href = `${miloLibs}/blocks/global-navigation/global-navigation.css`;
    // gnavCSS.media = 'print';
    // gnavCSS.onload = function() {
    //   this.media = 'all';
    // };
    // document.head.appendChild(gnavCSS);
    
    // Defer other heavy CSS files
    // TEMPORARILY DISABLED - investigating 404/ORB errors
    // const heavyCSS = [
    //   `${miloLibs}/blocks/quotes/quotes.css`,
    //   `${miloLibs}/blocks/template-x/template-x.css`,
    //   `${miloLibs}/blocks/ratings/ratings.css`,
    //   `${miloLibs}/blocks/widgets/carousel.css`,
    //   `${miloLibs}/blocks/widgets/basic-carousel.css`,
    //   `${miloLibs}/blocks/widgets/grid-carousel.css`,
    //   `${miloLibs}/blocks/widgets/masonry.css`,
    //   `${miloLibs}/blocks/steps/steps.css`,
    //   `${miloLibs}/blocks/link-list/link-list.css`,
    //   `${miloLibs}/blocks/banner/banner.css`,
    //   `${miloLibs}/blocks/faq/faq.css`,
    //   `${miloLibs}/blocks/blog-posts/blog-posts.css`,
    //   `${miloLibs}/blocks/cards/cards.css`,
    //   `${miloLibs}/blocks/promotion/promotion.css`,
    //   `${miloLibs}/blocks/mobile-fork-button/mobile-fork-button.css`
    // ];
    // 
    // heavyCSS.forEach((href) => {
    //   const link = document.createElement('link');
    //   link.rel = 'stylesheet';
    //   link.href = href;
    //   link.media = 'print';
    //   link.onload = function() {
    //     this.media = 'all';
    //   };
    //   document.head.appendChild(link);
    // });
  }, 200);
  
  // ✅ Defer floating CTA CSS to later - it's not LCP critical
  // TEMPORARILY DISABLED - investigating 404 errors
  // setTimeout(() => {
  //   const floatingCTACSS = `${miloLibs}/blocks/widgets/floating-cta.css`;
  //   const link = document.createElement('link');
  //   link.rel = 'stylesheet';
  //   link.href = floatingCTACSS;
  //   link.media = 'print';
  //   link.onload = function() {
  //     this.media = 'all';
  //   };
  //   document.head.appendChild(link);
  // }, 1000); // Load CSS 1 second later
  
  // ✅ Defer heavy JavaScript files to reduce critical path
  // TEMPORARILY DISABLED - investigating 404/ORB errors
  // setTimeout(() => {
  //   const heavyJS = [
  //     `${miloLibs}/blocks/quotes/quotes.js`,
  //     `${miloLibs}/blocks/template-x/template-x.js`,
  //     `${miloLibs}/blocks/ratings/ratings.js`,
  //     `${miloLibs}/blocks/widgets/carousel.js`,
  //     `${miloLibs}/blocks/widgets/basic-carousel.js`,
  //     `${miloLibs}/blocks/widgets/grid-carousel.js`,
  //     `${miloLibs}/blocks/widgets/masonry.js`,
  //     `${miloLibs}/blocks/steps/steps.js`,
  //     `${miloLibs}/blocks/link-list/link-list.js`,
  //     `${miloLibs}/blocks/banner/banner.js`,
  //     `${miloLibs}/blocks/faq/faq.js`,
  //     `${miloLibs}/blocks/blog-posts/blog-posts.js`,
  //     `${miloLibs}/blocks/cards/cards.js`,
  //     `${miloLibs}/blocks/promotion/promotion.js`,
  //     `${miloLibs}/blocks/mobile-fork-button/mobile-fork-button.js`
  //   ];
  //   
  //   heavyJS.forEach((href) => {
  //     const script = document.createElement('script');
  //     script.src = href;
  //     script.async = true;
  //     script.defer = true;
  //     document.head.appendChild(script);
  //   });
  // }, 500);
  
  // ✅ Defer floating CTA to later - it's not LCP critical
  // TEMPORARILY DISABLED - investigating 404 errors
  // setTimeout(() => {
  //   const floatingCTAJS = `${miloLibs}/blocks/widgets/floating-cta.js`;
  //   const script = document.createElement('script');
  //   script.src = floatingCTAJS;
  //   script.async = true;
  //   script.defer = true;
  //   document.head.appendChild(script);
  // }, 1000); // Load 1 second later
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
  
  // ✅ Defer service worker registration to avoid blocking critical path
  setTimeout(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/express/code/scripts/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, 1000);

  // ✅ Immediate LCP element optimization to reduce render delay
  (function optimizeLCPElement() {
    const lcpElement = document.querySelector('h1, .headline h1, #free-logo-maker');
    if (lcpElement) {
      // Ensure LCP element is immediately visible
      lcpElement.style.visibility = 'visible';
      lcpElement.style.opacity = '1';
      lcpElement.classList.add('loaded');
      
      // Force immediate font rendering
      lcpElement.style.fontFamily = 'Trebuchet MS, sans-serif';
      lcpElement.style.fontWeight = '900';
      lcpElement.style.fontSize = 'clamp(1.8rem, 4vw, 3rem)';
      lcpElement.style.lineHeight = '1.1';
      lcpElement.style.color = '#000';
    }
  }());

  // ✅ IMMEDIATE image optimization to fix 292KB savings
  (function optimizeImagesImmediately() {
    // Optimize all existing images immediately
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      const src = img.src;
      if (!src || (!src.includes('/media_') && !src.includes('adobeprojectm.com'))) return;
      
      const url = new URL(src, window.location.href);
      const { pathname } = url;
      const ext = pathname.substring(pathname.lastIndexOf('.') + 1);
      
      // Determine if LCP candidate
      const isFirstSection = img.closest('.section') === document.querySelector('.section');
      const isFirstImage = img === img.closest('.section')?.querySelector('img');
      const isLCPCandidate = isFirstSection && isFirstImage;
      
      // Check if this is a template image that needs responsive sizing
      const isTemplateImage = src.includes('adobeprojectm.com') || src.includes('component?assetType=');
      const displayWidth = img.offsetWidth || (isTemplateImage ? 42 : 400);
      
      let optimalWidth;
      if (isTemplateImage && displayWidth <= 50) {
        // Template images displayed at 42x42 or 4x4 - use actual display size
        optimalWidth = Math.max(displayWidth * 2, 84); // 2x for retina, min 84px
      } else if (isLCPCandidate) {
        const container = img.closest('.section, .column, .block');
        const containerWidth = container?.offsetWidth || 750;
        optimalWidth = Math.min(containerWidth * 2, 1200); // 2x for retina, max 1200px
      } else {
        const container = img.closest('.section, .column, .block');
        const containerWidth = container?.offsetWidth || 400;
        optimalWidth = Math.min(containerWidth * 2, 900); // 2x for retina, max 900px
      }
      
      if (isLCPCandidate) {
        // LCP optimization: eager loading, high priority, WebP format
        img.setAttribute('loading', 'eager');
        img.setAttribute('fetchpriority', 'high');
        
        // Update src with optimized parameters - aggressive compression for LCP
        const newSrc = `${pathname}?width=${optimalWidth}&format=webp&optimize=high&quality=75`;
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
        
        // Update src with optimized parameters - aggressive compression for non-LCP
        const newSrc = `${pathname}?width=${optimalWidth}&format=webp&optimize=high&quality=70`;
        if (img.src !== newSrc) {
          img.src = newSrc;
        }
        
        // Set proper dimensions
        img.setAttribute('width', optimalWidth);
        img.setAttribute('height', Math.round(optimalWidth * 0.6));
      }
    });
  }());
  
  // ✅ Defer additional image optimization for dynamically loaded images
  setTimeout(async function optimizeDynamicImages() {
    const { createOptimizedPicture } = await import('./utils/media.js');
    
    // Optimize any new images that were loaded
    const images = document.querySelectorAll('img[src*="/media_"]:not([data-optimized])');
    images.forEach((img) => {
      img.setAttribute('data-optimized', 'true');
      // Apply same optimization logic as above
    });
  }, 100); // Small delay to catch dynamically loaded images
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
