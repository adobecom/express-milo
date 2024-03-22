import { getLibs } from '../../scripts/utils.js';
import {
  normalizeHeadings,
  decorateButtonsDeprecated,
  addTempWrapperDeprecated,
} from '../../scripts/utils/decorate.js';
import { fixIcons } from '../../scripts/utils/icons.js';
import { createOptimizedPicture } from '../../scripts/utils/media.js';

const { createTag, getConfig } = await import(`${getLibs()}/utils/utils.js`);

const PROMOTION_FOLDER = 'express/promotions';

export function toClassName(name) {
  return name && typeof name === 'string'
    ? name.trim().toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
}

async function fetchPromotion(name) {
  const { prefix } = getConfig().locale;
  const promoURL = `${prefix}/${PROMOTION_FOLDER}/${toClassName(name)}.plain.html`;
  const resp = await fetch(promoURL);
  if (resp.ok) {
    const html = await resp.text();
    return html;
  }
  return null;
}

export default async function decorate($block) {
  addTempWrapperDeprecated($block, 'promotion');

  const name = $block.textContent.trim();
  if (!name) return;

  const html = await fetchPromotion(name);
  if (html) {
    const div = createTag('div');
    div.innerHTML = html;

    normalizeHeadings(div, ['h2', 'h3']);

    const h2 = div.querySelector('h2');

    const containerDiv = createTag('div', { class: 'promotion-wrapper' });

    containerDiv.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    const heroPicture = div.querySelector('picture');
    if (heroPicture) {
      const img = heroPicture.querySelector('img');
      const newPicture = createOptimizedPicture(img.src, img.alt, false);
      const p = heroPicture.parentNode;
      p.replaceChild(newPicture, heroPicture);

      const heroDiv = createTag('div', { class: 'promotion-hero' });
      heroDiv.append(newPicture);

      containerDiv.append(heroDiv);
      p.remove();
    }

    const contentDiv = createTag('div', { class: 'promotion-content' });
    contentDiv.append(div.firstElementChild);

    containerDiv.append(contentDiv);

    $block.innerHTML = '';
    if (h2) $block.append(h2);
    $block.append(containerDiv);

    decorateButtonsDeprecated($block);
    fixIcons($block);

    // apply primary light button styles
    $block.querySelectorAll('.button.accent').forEach((b) => {
      b.classList.remove('accent');
      b.classList.add('primary');
      b.classList.add('light');
    });
  } else {
    $block.innerHTML = '';
  }

  const $links = $block.querySelectorAll('a');

  if ($links) {
    const linksPopulated = new CustomEvent('linkspopulated', { detail: $links });
    document.dispatchEvent(linksPopulated);
  }
  $block.setAttribute('data-block-status', 'loaded');
}
