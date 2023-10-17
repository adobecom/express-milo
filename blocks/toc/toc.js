/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-disable import/named, import/extensions */
import { getLibs } from '../../scripts/utils.js';

export default async function init(block) {
  const { createTag } = await import(`${getLibs()}/utils/utils.js`);

  const elKey = block.querySelector(':scope > div > div:first-child');
  const elValue = elKey?.nextElementSibling;

  const level = elValue.textContent || 1;

  const t = createTag('div', { class: 'table-of-contents' });
  t.textContent = 'Table of Contents ' + elValue.textContent;

  const $headings = document.querySelectorAll('main h2, main h3, main h4, main .toc');
  let skip = true;
  const $toc = document.createElement('div');
  $toc.classList.add('toc');
  $headings.forEach(($h) => {
    if (!skip && $h.tagName.startsWith('H')) {
      const hLevel = +$h.tagName.substring(1);
      if (hLevel <= +level + 1) {
        const $entry = document.createElement('div');
        $entry.setAttribute('class', `toc-entry toc-level-h${hLevel}`);
        $entry.innerHTML = `<a href="#${$h.id}">${$h.innerHTML}</a>`;
        $toc.appendChild($entry);
      }
    }
    if ($h === block) skip = false;
  });
  block.innerHTML = '';
  block.classList.add('table-of-contents');
  block.classList.add('content');
  block.appendChild($toc);
}
