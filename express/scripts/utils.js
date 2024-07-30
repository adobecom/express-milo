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



/**
 * The decision engine for where to get Milo's libs from.
 */
export const [setLibs, getLibs] = (() => {
  let libs;
  return [
    (prodLibs, location) => {
      libs = (() => {
        const { hostname, search } = location || window.location;
        if (!(hostname.includes('.hlx.') || hostname.includes('local'))) return prodLibs;
        const branch = new URLSearchParams(search).get('milolibs') || 'main';
        if (branch === 'local') return 'http://localhost:6456/libs';
        return branch.includes('--') ? `https://${branch}.hlx.live/libs` : `https://${branch}--milo--adobecom.hlx.live/libs`;
      })();
      return libs;
    }, () => libs,
  ];
})();

/*
 * ------------------------------------------------------------
 * Edit above at your own risk.
 *
 * Note: This file should have no self-invoking functions.
 * ------------------------------------------------------------
 */

const cachedMetadata = [];
const getMetadata = (name, doc = document) => {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = doc.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
};
export function getCachedMetadata(name) {
  if (cachedMetadata[name] === undefined) cachedMetadata[name] = getMetadata(name);
  return cachedMetadata[name];
}

export const yieldToMain = () => new Promise((resolve) => { setTimeout(resolve, 0); });

function createTag(tag, attributes, html, options = {}) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement
      || html instanceof SVGElement
      || html instanceof DocumentFragment) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  options.parent?.append(el);
  return el;
}

export function toClassName(name) {
  return name && typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
}

export function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope>div').forEach(($row) => {
    if ($row.children) {
      const $cols = [...$row.children];
      if ($cols[1]) {
        const $value = $cols[1];
        const name = toClassName($cols[0].textContent.trim());
        let value;
        if ($value.querySelector('a')) {
          const $as = [...$value.querySelectorAll('a')];
          if ($as.length === 1) {
            value = $as[0].href;
          } else {
            value = $as.map(($a) => $a.href);
          }
        } else if ($value.querySelector('p')) {
          const $ps = [...$value.querySelectorAll('p')];
          if ($ps.length === 1) {
            value = $ps[0].textContent.trim();
          } else {
            value = $ps.map(($p) => $p.textContent.trim());
          }
        } else value = $row.children[1].textContent.trim();
        config[name] = value;
      }
    }
  });
  return config;
}

function hideQuickActionsOnDevices() {
  if (getMetadata('fqa-off') || !!getMetadata('fqa-on')) return;
  const { userAgent } = navigator;
  document.body.dataset.device = userAgent.includes('Mobile') ? 'mobile' : 'desktop';
  const fqaMeta = document.createElement('meta');
  fqaMeta.setAttribute('content', 'on');
  if (document.body.dataset.device === 'mobile'
    || (/Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS|Edg|OPR|Opera|OPiOS|Vivaldi|YaBrowser|Avast|VivoBrowser|GSA/.test(userAgent))) {
    fqaMeta.setAttribute('name', 'fqa-off');
  } else {
    fqaMeta.setAttribute('name', 'fqa-on');
  }
  document.head.append(fqaMeta);
}

export function removeIrrelevantSections(area) {
  if (!area) return;
  const selector = area === document ? 'body > main > div' : ':scope > div';
  area.querySelectorAll(selector).forEach((section) => {
    const sectionMetaBlock = section.querySelector('div.section-metadata');
    if (sectionMetaBlock) {
      const sectionMeta = readBlockConfig(sectionMetaBlock);

      // section meant for different device
      let sectionRemove = !!(sectionMeta.audience
        && sectionMeta.audience.toLowerCase() !== document.body.dataset?.device);

      // section visibility steered over metadata
      if (!sectionRemove && sectionMeta.showwith !== undefined) {
        let showWithSearchParam = null;
        if (!['www.adobe.com'].includes(window.location.hostname)) {
          const urlParams = new URLSearchParams(window.location.search);
          showWithSearchParam = urlParams.get(`${sectionMeta.showwith.toLowerCase()}`)
            || urlParams.get(`${sectionMeta.showwith}`);
        }
        const showwith = sectionMeta.showwith.toLowerCase();
        if ((showwith === 'fqa-off' || showwith === 'fqa-on')) hideQuickActionsOnDevices();
        sectionRemove = showWithSearchParam !== null ? showWithSearchParam !== 'on' : getMetadata(showwith) !== 'on';
      }
      if (sectionRemove) section.remove();
    }
  });

  // floating CTA vs page CTA with same text or link logics
  if (['yes', 'y', 'true', 'on'].includes(getMetadata('show-floating-cta')?.toLowerCase())) {
    const { device } = document.body.dataset;
    const textToTarget = getMetadata(`${device}-floating-cta-text`)?.trim() || getMetadata('main-cta-text')?.trim();
    const linkToTarget = getMetadata(`${device}-floating-cta-link`)?.trim() || getMetadata('main-cta-link')?.trim();
    if (textToTarget || linkToTarget) {
      const linkToTargetURL = new URL(linkToTarget);
      const sameUrlCTAs = Array.from(area.querySelectorAll('a:any-link'))
        .filter((a) => {
          try {
            const currURL = new URL(a.href);
            const sameText = a.textContent.trim() === textToTarget;
            const samePathname = currURL.pathname === linkToTargetURL?.pathname;
            const sameHash = currURL.hash === linkToTargetURL?.hash;
            const isNotInFloatingCta = !a.closest('.block')?.classList.contains('floating-button');
            const notFloatingCtaIgnore = !a.classList.contains('floating-cta-ignore');

            return (sameText || (samePathname && sameHash))
              && isNotInFloatingCta && notFloatingCtaIgnore;
          } catch (err) {
            window.lana?.log(err);
            return false;
          }
        });

      sameUrlCTAs.forEach((cta) => {
        cta.classList.add('same-as-floating-button-CTA');
      });
    }
  }
}

function overrideMiloColumns(area) {
  const replaceColumnBlock = (section) => {
    const columnBlock = section.querySelectorAll('div.columns');
    columnBlock.forEach((column) => {
      if (column.classList[0] !== 'columns') return;
      column.classList.remove('columns');
      column.className = `ax-columns ${column.className}`;
    });
  };

  const replaceTableOfContentBlock = (section) => {
    const tableOfContentBlock = section.querySelectorAll('div.table-of-contents');
    tableOfContentBlock.forEach((tableOfContent) => {
      if (tableOfContent.classList[0] !== 'table-of-contents') return;

      const config = readBlockConfig(tableOfContent);
      if (config.levels === undefined) return;

      tableOfContent.classList.remove('table-of-contents');
      tableOfContent.className = `ax-table-of-contents ${tableOfContent.className}`;
    });
  };

  if (!area) return;
  area.querySelectorAll('main > div').forEach((section) => {
    replaceColumnBlock(section);
    replaceTableOfContentBlock(section);
  });
}

// Get lottie animation HTML - remember to lazyLoadLottiePlayer() to see it.
export function getLottie(name, src, loop = true, autoplay = true, control = false, hover = false) {
  return (`<lottie-player class="lottie lottie-${name}" src="${src}" background="transparent" speed="1" ${(loop) ? 'loop ' : ''}${(autoplay) ? 'autoplay ' : ''}${(control) ? 'controls ' : ''}${(hover) ? 'hover ' : ''}></lottie-player>`);
}

// Lazy-load lottie player if you scroll to the block.
export function lazyLoadLottiePlayer($block = null) {
  const usp = new URLSearchParams(window.location.search);
  const lottie = usp.get('lottie');
  if (lottie !== 'off') {
    const loadLottiePlayer = () => {
      if (window['lottie-player']) return;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = '/express/scripts/lottie-player.1.5.6.js';
      document.head.appendChild(script);
      window['lottie-player'] = true;
    };
    if ($block) {
      const addIntersectionObserver = (block) => {
        const observer = (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            if (entry.intersectionRatio >= 0.25) {
              loadLottiePlayer();
            }
          }
        };
        const options = {
          root: null,
          rootMargin: '0px',
          threshold: [0.0, 0.25],
        };
        const intersectionObserver = new IntersectionObserver(observer, options);
        intersectionObserver.observe(block);
      };
      if (document.readyState === 'complete') {
        addIntersectionObserver($block);
      } else {
        window.addEventListener('load', () => {
          addIntersectionObserver($block);
        });
      }
    } else if (document.readyState === 'complete') {
      loadLottiePlayer();
    } else {
      window.addEventListener('load', () => {
        loadLottiePlayer();
      });
    }
  }
}

// TODO we might be able to remove this before migrating
async function loadAEMGnav() {
  const miloLibs = getLibs();
  const { loadScript } = await import(`${miloLibs}/utils/utils.js`);
  const header = document.querySelector('header');

  if (header) {
    header.addEventListener('click', (event) => {
      if (event.target.id === 'feds-topnav') {
        const root = window.location.href.split('/express/')[0];
        window.location.href = `${root}/express/`;
      }
    });
    header.innerHTML = '<div id="feds-header"></div>';
  }
  const footer = document.querySelector('footer');
  if (footer) {
    footer.innerHTML = `
      <div id="feds-footer"></div>
    `;
    footer.setAttribute('data-status', 'loading');
  }

  const usp = new URLSearchParams(window.location.search);
  const gnav = usp.get('gnav') || getMetadata('gnav');

  const gnavUrl = '/express/scripts/gnav.js';
  if (!(gnav === 'off' || document.querySelector(`head script[src="${gnavUrl}"]`))) {
    loadScript(gnavUrl, 'module');
  }
}

// TODO we might be able to remove this before migrating
export function listenMiloEvents() {
  const lcpLoadedHandler = async () => {
    await loadAEMGnav();
  };
  const postSectionLoadingHandler = async () => {
    const footer = document.querySelector('footer');
    delete footer.dataset.status;
  };
  window.addEventListener('milo:LCP:loaded', lcpLoadedHandler);
  window.addEventListener('milo:postSection:loading', postSectionLoadingHandler);
}

function transpileMarquee(area) {
  const handleSubCTAText = (oldContainer, newContainer) => {
    const elAfterBtn = oldContainer.nextElementSibling;
    if (!elAfterBtn || elAfterBtn?.tagName !== 'BLOCKQUOTE') return;

    const subText = elAfterBtn.querySelector('p');

    if (subText) {
      const subTextEl = createTag('span', { class: 'cta-sub-text' }, subText.innerHTML);
      newContainer.append(subTextEl);
    }
    elAfterBtn.remove();
  };

  const needsTranspile = (block) => {
    const firstRow = block.querySelector(':scope > div:first-of-type');
    return firstRow.children.length > 1 && ['default', 'mobile', 'desktop', 'hd'].includes(firstRow.querySelector(':scope > div')?.textContent?.trim().toLowerCase());
  };

  const isVideoLink = (url) => {
    if (!url) return null;
    return url.includes('youtube.com/watch')
      || url.includes('youtu.be/')
      || url.includes('vimeo')
      || /.*\/media_.*(mp4|webm|m3u8)$/.test(new URL(url).pathname);
  };

  const transpile = (block) => {
    const assetArea = createTag('div');

    block.classList.add('transpiled', 'xxl-button');

    if (block.classList.contains('short')) {
      block.classList.remove('short');
      block.classList.add('small');
    }

    if (!block.classList.contains('dark')) {
      block.classList.add('light');
    }

    const rows = block.querySelectorAll(':scope > div');

    if (rows.length) {
      rows.forEach((r, i, arr) => {
        if (i < arr.length - 1) {
          r.querySelector(':scope > div:first-of-type')?.remove();

          if (document.body.dataset.device === 'mobile') {
            const valCol = r.querySelector(':scope > div:last-of-type');
            assetArea.innerHTML = valCol.innerHTML;
            if (block.classList.contains('dark')) valCol.innerHTML = '#000000';
            if (block.classList.contains('light')) valCol.innerHTML = '#ffffff00';
          }

          if (i > 0) {
            r.remove();
          }
        }

        if (i === arr.length - 1) {
          const aTags = r.querySelectorAll('p > a');
          const btnContainers = [];
          const elsToAppend = [];
          const actionArea = createTag('p', { class: 'action-area' });

          aTags.forEach((a) => {
            if (!btnContainers.includes(a.parentElement)) {
              btnContainers.push(a.parentElement);
            }

            if (isVideoLink(a.href) && !a.querySelector('span.icon.icon-play')) {
              const playIcon = createTag('span', { class: 'icon icon-play' });
              a.prepend(playIcon);
            }
            a.textContent = `${a.textContent}`;
          });

          const isInlineButtons = btnContainers.length === 1;

          aTags.forEach((a) => {
            const buttonContainer = a.parentElement;

            if (buttonContainer?.childNodes.length === 1) {
              const buttonWrapper = createTag('span');
              buttonWrapper.append(a);
              handleSubCTAText(buttonContainer, buttonWrapper);
              buttonContainer.remove();

              elsToAppend.push(buttonWrapper);
            }
          });

          elsToAppend.forEach((e, index) => {
            actionArea.append(e);
            const link = e.querySelector('a');

            if (!link) return;
            if (index === 0) {
              const strong = createTag('strong');
              e.prepend(strong);
              strong.append(link);
            }
            if (index === 1) {
              if (!isInlineButtons) {
                const em = createTag('em');
                e.prepend(em);
                em.append(link);
              }
            }
          });

          const lastPInFirstDiv = r.querySelector(':scope > div > p:last-of-type');
          lastPInFirstDiv?.after(actionArea);
          r.append(assetArea);
        }
      });
    }
  };

  const marquees = [...area.querySelectorAll('div.marquee')].filter((m) => m.classList[0] === 'marquee');
  marquees.forEach((block) => {
    if (needsTranspile(block)) transpile(block);
  });
}

export function buildAutoBlocks() {
  if (['yes', 'y', 'true', 'on'].includes(getMetadata('show-floating-cta')?.toLowerCase())) {
    const lastDiv = document.querySelector('main > div:last-of-type');
    const validButtonVersion = ['floating-button', 'multifunction-button', 'bubble-ui-button', 'floating-panel'];
    const device = document.body.dataset?.device;
    const blockName = getMetadata(`${device}-floating-cta`);

    if (blockName && validButtonVersion.includes(blockName) && lastDiv) {
      const button = createTag('div', { class: blockName });
      const colEl = createTag('div', {}, device);
      button.appendChild(colEl);
      button.classList.add('metadata-powered');
      lastDiv.append(button);
      import('./block-mediator.min.js').then((mod) => {
        mod.default.set('floatingCtasLoaded', true);
      });
    }
  }
}

/**
 * Returns a picture element with webp and fallbacks
 * @param {string} src The image URL
 * @param {string} alt The alt text of the image
 * @param {boolean} eager load image eager
 * @param {Array} breakpoints breakpoints and corresponding params (eg. width)
 */

export function createOptimizedPicture(src, alt = '', eager = false, breakpoints = [{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }]) {
  const url = new URL(src, window.location.href);
  const picture = document.createElement('picture');
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  // webp
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', `${pathname}?width=${br.width}&format=webply&optimize=medium`);
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('srcset', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      picture.appendChild(img);
      img.setAttribute('src', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
    }
  });

  return picture;
}

function decoratePictures(main) {
  main.querySelectorAll('img[src*="/media_"]').forEach((img, i) => {
    const newPicture = createOptimizedPicture(img.src, img.alt, !i);
    const picture = img.closest('picture');
    if (picture) picture.parentElement.replaceChild(newPicture, picture);
  });
}


/**
 * fetches the string variables.
 * @returns {object} localized variables
 */

export async function fetchPlaceholders() {
  const requestPlaceholders = async (url) => {
    const resp = await fetch(url);
    if (resp.ok) {
      const json = await resp.json();
      window.placeholders = {};
      json.data.forEach((placeholder) => {
        if (placeholder.value) window.placeholders[placeholder.key] = placeholder.value;
        else if (placeholder.Text) window.placeholders[placeholder.Key] = placeholder.Text;
      });
    }
  };
  if (!window.placeholders) {
    try {
      const { getConfig } = await import(`${getLibs()}/utils/utils.js`);
      const { prefix } = getConfig().locale;
      await requestPlaceholders(`${prefix}/express/placeholders.json`);
    } catch {
      await requestPlaceholders('/express/placeholders.json');
    }
  }
  return window.placeholders;
}

function sanitizeInput(input) {
  if (Number.isInteger(input)) return input;
  return input.replace(/[^a-zA-Z0-9-_]/g, ''); // Simple regex to strip out potentially dangerous characters
}

function createSVGWrapper(icon, sheetSize, alt, altSrc) {
  const svgWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgWrapper.classList.add('icon');
  svgWrapper.classList.add(`icon-${icon}`);
  svgWrapper.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/1999/xlink');
  if (alt) {
    svgWrapper.appendChild(createTag('title', { innerText: alt }));
  }
  const u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  if (altSrc) {
    u.setAttribute('href', altSrc);
  } else {
    u.setAttribute('href', `/express/icons/ccx-sheet_${sanitizeInput(sheetSize)}.svg#${
      sanitizeInput(icon)}${sanitizeInput(sheetSize)}`);
  }
  svgWrapper.appendChild(u);
  return svgWrapper;
}

function getIcon(icons, alt, size, altSrc = 44) {
  // eslint-disable-next-line no-param-reassign
  icons = Array.isArray(icons) ? icons : [icons];
  const [defaultIcon, mobileIcon] = icons;
  const icon = (mobileIcon && window.innerWidth < 600) ? mobileIcon : defaultIcon;
  const symbols = [
    'adobefonts',
    'adobe-stock',
    'android',
    'animation',
    'blank',
    'brand',
    'brand-libraries',
    'brandswitch',
    'calendar',
    'certified',
    'color-how-to-icon',
    'changespeed',
    'check',
    'chevron',
    'cloud-storage',
    'crop-image',
    'crop-video',
    'convert',
    'convert-png-jpg',
    'cursor-browser',
    'desktop',
    'desktop-round',
    'download',
    'elements',
    'facebook',
    'globe',
    'incredibly-easy',
    'instagram',
    'image',
    'ios',
    'libraries',
    'library',
    'linkedin',
    'magicwand',
    'mergevideo',
    'mobile-round',
    'muteaudio',
    'palette',
    'photos',
    'photoeffects',
    'pinterest',
    'play',
    'premium-templates',
    'pricingfree',
    'pricingpremium',
    'privacy',
    'qr-code',
    'remove-background',
    'resize',
    'resize-video',
    'reversevideo',
    'rush',
    'snapchat',
    'sparkpage',
    'sparkvideo',
    'stickers',
    'templates',
    'text',
    'tiktok',
    'trim-video',
    'twitter',
    'up-download',
    'upload',
    'users',
    'webmobile',
    'youtube',
    'star',
    'star-half',
    'star-empty',
    'pricing-gen-ai',
    'pricing-features',
    'pricing-import',
    'pricing-motion',
    'pricing-stock',
    'pricing-one-click',
    'pricing-collaborate',
    'pricing-premium-plan',
    'pricing-sync',
    'pricing-brand',
    'pricing-calendar',
    'pricing-fonts',
    'pricing-libraries',
    'pricing-cloud',
    'pricing-support',
    'pricing-sharing',
    'pricing-history',
    'pricing-corporate',
    'pricing-admin',
  ];

  const size22Icons = [
    'chevron',
    'pricingfree',
    'pricingpremium',
  ];

  if (symbols.includes(icon) || altSrc) {
    let sheetSize = size;
    if (size22Icons.includes(icon)) sheetSize = 22;
    return createSVGWrapper(icon, sheetSize, alt, altSrc);
  }
  return createTag('img', {
    class: `icon icon-${icon}`,
    src: altSrc || `/express/icons/${icon}.svg`,
    alt: `${alt || icon}`,
  });
}

export function getIconElement(icons, size, alt, additionalClassName, altSrc) {
  // const icon = getIcon(icons, alt, altSrc, size);
  // if (additionalClassName) icon.classList.add(additionalClassName);
  return 'icon';
}

const PAGE_URL = new URL(window.location.href);
const ENVS = {
  stage: {
    name: 'stage',
    ims: 'stg1',
    adobeIO: 'cc-collab-stage.adobe.io',
    adminconsole: 'stage.adminconsole.adobe.com',
    account: 'stage.account.adobe.com',
    edgeConfigId: '8d2805dd-85bf-4748-82eb-f99fdad117a6',
    pdfViewerClientId: '600a4521c23d4c7eb9c7b039bee534a0',
  },
  prod: {
    name: 'prod',
    ims: 'prod',
    adobeIO: 'cc-collab.adobe.io',
    adminconsole: 'adminconsole.adobe.com',
    account: 'account.adobe.com',
    edgeConfigId: '2cba807b-7430-41ae-9aac-db2b0da742d5',
    pdfViewerClientId: '3c0a5ddf2cc04d3198d9e48efc390fa9',
  },
};
ENVS.local = {
  ...ENVS.stage,
  name: 'local',
};

function getEnv(conf) {
  const { host } = window.location;
  const query = PAGE_URL.searchParams.get('env');

  if (query) return { ...ENVS[query], consumer: conf[query] };
  if (host.includes('localhost')) return { ...ENVS.local, consumer: conf.local };
  /* c8 ignore start */
  if (host.includes('hlx.page')
    || host.includes('hlx.live')
    || host.includes('stage.adobe')
    || host.includes('corp.adobe')) {
    return { ...ENVS.stage, consumer: conf.stage };
  }
  return { ...ENVS.prod, consumer: conf.prod };
  /* c8 ignore stop */
}
const LANGSTORE = 'langstore';

export function getLocale(locales, pathname = window.location.pathname) {
  if (!locales) {
    return { ietf: 'en-US', tk: 'hah7vzn.css', prefix: '' };
  }
  const split = pathname.split('/');
  const localeString = split[1];
  const locale = locales[localeString] || locales[''];
  if (localeString === LANGSTORE) {
    locale.prefix = `/${localeString}/${split[2]}`;
    if (
      Object.values(locales)
        .find((loc) => loc.ietf?.startsWith(split[2]))?.dir === 'rtl'
    ) locale.dir = 'rtl';
    return locale;
  }
  const isUS = locale.ietf === 'en-US';
  locale.prefix = isUS ? '' : `/${localeString}`;
  locale.region = isUS ? 'us' : localeString.split('_')[0];
  return locale;
}

const AUTO_BLOCKS = [
  { faas: '/tools/faas' },
  { fragment: '/express/fragments/' },
];

const DO_NOT_INLINE = [
  'accordion',
  'columns',
  'z-pattern',
];

// export const [setConfig, updateConfig, getConfig] = (() => {
//   let config = {};
//   return [
//     (conf) => {
//       const origin = conf.origin || window.location.origin;
//       const pathname = conf.pathname || window.location.pathname;
//       config = { env: getEnv(conf), ...conf };
//       config.codeRoot = conf.codeRoot ? `${origin}${conf.codeRoot}` : origin;
//       config.base = config.miloLibs || config.codeRoot;
//       config.locale = pathname ? getLocale(conf.locales, pathname) : getLocale(conf.locales);
//       config.autoBlocks = conf.autoBlocks ? [...AUTO_BLOCKS, ...conf.autoBlocks] : AUTO_BLOCKS;
//       config.doNotInline = conf.doNotInline
//         ? [...DO_NOT_INLINE, ...conf.doNotInline]
//         : DO_NOT_INLINE;
//       const lang = getMetadata('content-language') || config.locale.ietf;
//       document.documentElement.setAttribute('lang', lang);
//       try {
//         const dir = getMetadata('content-direction')
//           || config.locale.dir
//           || (config.locale.ietf && (new Intl.Locale(config.locale.ietf)?.textInfo?.direction))
//           || 'ltr';
//         document.documentElement.setAttribute('dir', dir);
//       } catch (e) {
//         // eslint-disable-next-line no-console
//         console.log('Invalid or missing locale:', e);
//       }
//       config.locale.contentRoot = `${origin}${config.locale.prefix}${config.contentRoot ?? ''}`;
//       config.useDotHtml = !PAGE_URL.origin.includes('.hlx.')
//         && (conf.useDotHtml ?? PAGE_URL.pathname.endsWith('.html'));
//       return config;
//     },
//     // eslint-disable-next-line no-return-assign
//     (conf) => (config = conf),
//     () => config,
//   ];
// })();

export function titleCase(str) {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i += 1) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}

export function transformLinkToAnimation($a, $videoLooping = true) {
  if (!$a || !$a.href.endsWith('.mp4')) {
    return null;
  }
  const params = new URL($a.href).searchParams;
  const attribs = {};
  const dataAttr = $videoLooping ? ['playsinline', 'autoplay', 'loop', 'muted'] : ['playsinline', 'autoplay', 'muted'];
  dataAttr.forEach((p) => {
    if (params.get(p) !== 'false') attribs[p] = '';
  });
  // use closest picture as poster
  const $poster = $a.closest('div').querySelector('picture source');
  if ($poster) {
    attribs.poster = $poster.srcset;
    $poster.parentNode.remove();
  }
  // replace anchor with video element
  const videoUrl = new URL($a.href);

  const isLegacy = videoUrl.hostname.includes('hlx.blob.core') || videoUrl.pathname.includes('media_');
  const $video = createTag('video', attribs);
  if (isLegacy) {
    const helixId = videoUrl.hostname.includes('hlx.blob.core') ? videoUrl.pathname.split('/')[2] : videoUrl.pathname.split('media_')[1].split('.')[0];
    const videoHref = `./media_${helixId}.mp4`;
    $video.innerHTML = `<source src="${videoHref}" type="video/mp4">`;
  } else {
    $video.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
  }

  const $innerDiv = $a.closest('div');
  $innerDiv.prepend($video);
  $innerDiv.classList.add('hero-animation-overlay');
  $video.setAttribute('tabindex', 0);
  $a.replaceWith($video);
  // autoplay animation
  $video.addEventListener('canplay', () => {
    $video.muted = true;
    const playPromise = $video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // ignore
      });
    }
  });
  return $video;
}

export function decorateArea(area = document) {
  document.body.dataset.device = navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop';
  removeIrrelevantSections(area);
  // LCP image decoration
  (function decorateLCPImage() {
    const lcpImg = area.querySelector('img');
    lcpImg?.removeAttribute('loading');
  }());
  const links = area === Document ? area.querySelectorAll('main a[href*="adobesparkpost.app.link"]') : area.querySelectorAll(':scope a[href*="adobesparkpost.app.link"]');
  if (links.length) {
    // eslint-disable-next-line import/no-cycle
    import('./branchlinks.js').then((mod) => mod.default(links));
  }

  // transpile conflicting blocks
  transpileMarquee(area);
  overrideMiloColumns(area);
}
