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
      window.express.miloLibs = libs;
      return libs;
    }, () => libs,
  ];
})();

export function toClassName(name) {
  return name && typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
}

/*
 * ------------------------------------------------------------
 * Edit above at your own risk.
 *
 * Note: This file should have no self-invoking functions.
 * ------------------------------------------------------------
 */
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

export async function removeIrrelevantSections(area) {
  if (!area) return;
  const miloLibs = getLibs();
  const { getMetadata } = await import(`${miloLibs}/utils/utils.js`);
  area.querySelectorAll(':scope > div').forEach((section) => {
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
        sectionRemove = showWithSearchParam !== null ? showWithSearchParam !== 'on' : getMetadata(sectionMeta.showwith.toLowerCase()) !== 'on';
      }
      if (sectionRemove) section.remove();
    }
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

async function loadAEMGnav() {
  const miloLibs = getLibs();
  const { getMetadata, loadScript } = await import(`${miloLibs}/utils/utils.js`);
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

export function decorateArea(area = document) {
  removeIrrelevantSections(area);
  // LCP image decoration
  (function decorateLCPImage() {
    const lcpImg = area.querySelector('img');
    lcpImg?.removeAttribute('loading');
  }());
}

export function getHelixEnv() {
  let envName = sessionStorage.getItem('helix-env');
  if (!envName) {
    envName = 'stage';
    if (window.spark?.hostname === 'www.adobe.com') envName = 'prod';
  }
  const envs = {
    stage: {
      commerce: 'commerce-stg.adobe.com',
      adminconsole: 'stage.adminconsole.adobe.com',
      spark: 'stage.projectx.corp.adobe.com',
    },
    prod: {
      commerce: 'commerce.adobe.com',
      spark: 'express.adobe.com',
      adminconsole: 'adminconsole.adobe.com',
    },
  };
  const env = envs[envName];

  const overrideItem = sessionStorage.getItem('helix-env-overrides');
  if (overrideItem) {
    const overrides = JSON.parse(overrideItem);
    const keys = Object.keys(overrides);
    env.overrides = keys;

    for (const a of keys) {
      env[a] = overrides[a];
    }
  }

  if (env) {
    env.name = envName;
  }
  return env;
}
