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

import { setLibs } from './utils.js';

// Add project-wide style path here.
const STYLES = '';

// Use 'https://milo.adobe.com/libs' if you cannot map '/libs' to milo's origin.
const LIBS = '/libs';

// Add any config options.
const CONFIG = {
  // codeRoot: '',
  // contentRoot: '',
  // imsClientId: 'college',
  // geoRouting: 'off',
  // fallbackRouting: 'off',
  locales: {
    '': { ietf: 'en-US', tk: 'hah7vzn.css' },
    'us': { ietf: 'en-US', tk: 'hah7vzn.css' },
    de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
    kr: { ietf: 'ko-KR', tk: 'zfo3ouc' },
    fr: { ietf: 'fr-FR', tk: 'vrk5vyv.css' },
    in: { ietf: 'en-GB', tk: 'pps7abe.css' },
    it: { ietf: 'it-IT', tk: 'bbf5pok.css' },
    dk: { ietf: 'da-DK', tk: 'aaz7dvd.css' },
    es: { ietf: 'es-ES', tk: 'oln4yqj.css' },
    fi: { ietf: 'fi-FI', tk: 'aaz7dvd.css' },
    jp: { ietf: 'ja-JP', tk: 'dvg6awq' },
    nl: { ietf: 'nl-NL', tk: 'cya6bri.css' },
    no: { ietf: 'no-NO', tk: 'aaz7dvd.css' },
    br: { ietf: 'pt-BR', tk: 'inq1xob.css' },
    se: { ietf: 'sv-SE', tk: 'fpk1pcd.css' },
    th_en: { ietf: 'en', tk: 'pps7abe.css' },
    th_th: { ietf: 'th', tk: 'aaz7dvd.css' },
    tw: { ietf: 'zh-TW', tk: 'jay0ecd' },
    cn: { ietf: 'zh-CN', tk: 'puu3xkp' },
  },
};

// Load LCP image immediately
(function loadLCPImage() {
  const lcpImg = document.querySelector('img');
  lcpImg?.removeAttribute('loading');
}());

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
  const { loadArea, setConfig } = await import(`${miloLibs}/utils/utils.js`);

  setConfig({ ...CONFIG, miloLibs });
  await loadArea();
}());
