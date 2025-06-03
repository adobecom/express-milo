import { getLibs, toClassName, fixIcons, decorateButtonsDeprecated } from '../../scripts/utils.js';
import {
  normalizeHeadings,
} from '../../scripts/utils/decorate.js';
import { createOptimizedPicture } from '../../scripts/utils/media.js';

let createTag; let getConfig;

const PROMOTION_FOLDER = 'express/promotions';

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
  ({ createTag, getConfig } = await import(`${getLibs()}/utils/utils.js`));
  const name = $block.textContent.trim();

  if (!name) return;

  const html = await fetchPromotion(name);
  if (html) {
    const div = createTag('div');
    div.innerHTML = html;

    /** Add text content to link title if not provided
     * We are
     */
    const link = div.querySelector('a');
    const titleFromH3 = div.querySelector('h3')?.textContent || '';
    const [linkText, linkContext] = link.textContent.split('|');
    if (linkContext) link.title = `${linkText} || ${titleFromH3.toLowerCase()}`;

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

    await Promise.all([decorateButtonsDeprecated($block), fixIcons($block)]);

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
}
