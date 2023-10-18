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

import { getLibs } from '../../scripts/utils.js';
const {
  createTag,
  getMetadata,
  getLocale,
  getConfig,
} = await import(`${getLibs()}/utils/utils.js`);

function toClassName(name) {
  return name && typeof name === 'string'
    ? name.trim().toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
}

async function fetchAuthorImage($image, author) {
  const resp = await fetch(`/learn/blog/authors/${toClassName(author)}.plain.html`);
  const main = await resp.text();
  if (resp.status === 200) {
    const $div = createTag('div');
    $div.innerHTML = main;
    const $img = $div.querySelector('img');
    $image.replaceWith($img);
  }
}

function copyToClipboard(copyButton) {
  navigator.clipboard.writeText(window.location.href).then(() => {
    copyButton.classList.add('copy-success');
  }, () => {
    copyButton.classList.add('copy-failure');
  });
}

export default async function init(block) {
  // document.body.classList.add('blog-article');

  const config = await getConfig();

  const heading = block.querySelector(':scope h1');

  const blogHeader = createTag('div', { class: 'blog-header' });
  heading.before(blogHeader);
  blogHeader.append(heading);

  //eyebrow
  const eyebrow = createTag('div', { class: 'eyebrow' });
  const locale = getLocale(config.locales);
  const urlPrefix = locale === 'us' ? '' : `/${locale}`;
  eyebrow.innerHTML = `<a href="${urlPrefix}/express/learn/blog/tags/${toClassName(getMetadata('category'))}">${getMetadata('category')}</a>`;
  blogHeader.prepend(eyebrow);

  // sub heading
  const subheading = getMetadata('subheading');
  if (subheading) {
    const $subheading = createTag('p', { class: 'subheading' });
    $subheading.innerHTML = subheading;
    blogHeader.append($subheading);
  }

  const author = getMetadata('author');
  if (author) {
    const date = getMetadata('publication-date');
    const publicationDate = new Date(date);
    const language = getConfig().locale?.ietf || 'en-US';
    const dateString = publicationDate.toLocaleDateString(language, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    });
    const $author = createTag('div', { class: 'author' });
    const url = encodeURIComponent(window.location.href);
    $author.innerHTML = `<div class="image"><img src="/express/gnav-placeholder/adobe-logo.svg"/></div>
    <div>
      <div class="name">${author}</div>
      <div class="date">${dateString}</div>
    </div>
    <div class="author-social">
      <span>
        <a target="_blank" href="http://twitter.com/share?&url=${url}">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-twitter">
          <use href="/img/icons/ccx-sheet_22.svg#twitter22"></use>
        </svg>
        </a>
      </span>
      <span>
        <a target="_blank" href="https://www.linkedin.com/sharing/share-offsite/?url=${url}">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-linkedin">
          <use href="/img/icons/ccx-sheet_22.svg#linkedin22"></use>
        </svg>
        </a>
      </span>
      <span>
      <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=${url}">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-facebook">
          <use href="/img/icons/ccx-sheet_22.svg#facebook22"></use>
        </svg>
        </a>
      </span>
      <span>
      <a>
        <svg id="copy-to-clipboard" xmlns="http://www.w3.org/2000/svg" class="icon icon-link">
          <use href="/img/icons/ccx-sheet_22.svg#link22"></use>
        </svg>
        </a>
      </span>
    </div>`;
    fetchAuthorImage($author.querySelector('img'), author);
    blogHeader.append($author);
    const copyButton = document.getElementById('copy-to-clipboard');
    copyButton.addEventListener('click', () => {
      copyToClipboard(copyButton);
    });
  }
}
