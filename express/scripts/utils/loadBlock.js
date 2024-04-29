import { getLibs } from '../utils.js';

const { createTag, getConfig } = await import(`${getLibs()}/utils/utils.js`);

// eslint-disable-next-line import/prefer-default-export
export async function fetchBlockFragDeprecated(url, blockName) {
  const location = new URL(window.location);
  const { prefix } = getConfig().locale;
  const fragmentUrl = `${location.origin}${prefix}${url}`;

  const path = new URL(fragmentUrl).pathname.split('.')[0];
  const resp = await fetch(`${path}.plain.html`);
  if (resp.status === 404) {
    return null;
  }

  const html = await resp.text();
  const section = createTag('div');
  section.innerHTML = html;
  section.className = `section section-wrapper ${blockName}-container`;
  const block = section.querySelector(`.${blockName}`);
  block.dataset.blockName = blockName;
  block.parentElement.className = `${blockName}-wrapper`;
  block.classList.add('block');
  const img = section.querySelector('img');
  if (img) {
    img.setAttribute('loading', 'lazy');
  }
  return section;
}
