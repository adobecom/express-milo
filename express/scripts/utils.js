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
export const expressObj = {};

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

export async function getRedirectUri() {
  const BlockMediator = await import('./block-mediator.min.js');
  return BlockMediator.get('primaryCtaUrl')
      || document.querySelector('a.button.xlarge.same-fcta, a.primaryCTA')?.href;
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
        cta.classList.add('same-fcta');
      });
    }
  }
}

function renameConflictingBlocks(area) {
  const replaceColumnBlock = (section) => {
    const columnBlock = section.querySelectorAll('div.columns');
    columnBlock.forEach((column) => {
      if (column.classList[0] !== 'columns') return;
      column.classList.replace('columns', 'ax-columns');
    });
  };

  const replaceTableOfContentBlock = (section) => {
    const tableOfContentBlock = section.querySelectorAll('div.table-of-contents');
    tableOfContentBlock.forEach((tableOfContent) => {
      if (tableOfContent.classList[0] !== 'table-of-contents') return;

      const config = readBlockConfig(tableOfContent);
      if (config.levels === undefined) return;
      tableOfContent.classList.replace('table-of-contents', 'ax-table-of-contents');
    });
  };

  const replaceMarqueeBlock = (section) => {
    const marquees = section.querySelectorAll('div.marquee');
    marquees.forEach((marquee) => {
      const firstRow = marquee.querySelector(':scope > div:first-of-type');
      const isExpressMarquee = firstRow.children.length > 1
        && ['default', 'mobile', 'desktop', 'hd'].includes(firstRow.querySelector(':scope > div')?.textContent?.trim().toLowerCase());
      if (isExpressMarquee) {
        marquee.classList.replace('marquee', 'ax-marquee');
        const links = marquee.querySelectorAll(':scope a');
        links.forEach((link) => {
          link.textContent = link.textContent.replace('{{business-sales-numbers}}', '((business-sales-numbers))');
          link.textContent = link.textContent.replace('{{pricing}}', '((pricing))');
        });
      }
    });
  };

  if (!area) return;
  area.querySelectorAll('main > div').forEach((section) => {
    replaceColumnBlock(section);
    replaceTableOfContentBlock(section);
    replaceMarqueeBlock(section);
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

function fragmentBlocksToLinks(area) {
  area.querySelectorAll('div.fragment').forEach((blk) => {
    const fragLink = blk.querySelector('a');
    if (fragLink) {
      const p = document.createElement('p');
      p.append(fragLink);
      blk.replaceWith(p);
    }
  });
}

function cleanupBrackets(area) {
  const elements = area.querySelectorAll('*');
  elements.forEach((element) => {
    if (element.children.length === 0) {
      element.innerHTML = element.innerHTML.replace(/\{\{(.*?)\}\}/g, '(($1))');
    }
  });
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

  cleanupBrackets(area);
  area.querySelectorAll('a[href^="https://spark.adobe.com/"]').forEach((a) => { a.href = 'https://new.express.adobe.com'; });

  fragmentBlocksToLinks(area);
  renameConflictingBlocks(area);
}
