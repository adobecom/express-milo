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
            const isNotInFloatingCta = !a.closest('.section > div')?.classList.contains('floating-button');
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
 * Call `addHeaderSizing` on default content blocks in all section blocks
 * in all Japanese pages except blog pages.
 */
function addJapaneseSectionHeaderSizing(area) {
  import(`${getLibs()}/utils/utils.js`).then((mod) => {
    if (mod.getConfig().locale.ietf === 'ja-JP' && mod.getMetadata('template') !== 'blog') {
      const headings = area === document ? area.querySelectorAll('main > div > h1, main > div > h2') : area.querySelectorAll(':scope > div > h1, :scope > div > h2');
      if (headings.length) import('./utils/location-utils.js').then((locMod) => locMod.addHeaderSizing(headings, null));
    }
  });
}

export function decorateArea(area = document) {
  if (area !== document) {
    removeIrrelevantSections(area);
    // LCP image decoration
    (function decorateLCPImage() {
      const lcpImg = area.querySelector('img');
      lcpImg?.removeAttribute('loading');
    }());
  }

  const links = area === document ? area.querySelectorAll('main a[href*="adobesparkpost.app.link"]') : area.querySelectorAll(':scope a[href*="adobesparkpost.app.link"]');
  if (links.length) {
    // eslint-disable-next-line import/no-cycle
    import('./branchlinks.js').then((mod) => mod.default(links));
  }

  // transpile conflicting blocks
  transpileMarquee(area);
  overrideMiloColumns(area);
  addJapaneseSectionHeaderSizing(area);
}
