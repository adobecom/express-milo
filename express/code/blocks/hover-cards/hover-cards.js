import { getLibs } from '../../scripts/utils.js';

export default async function init(el) {
  const { createTag } = await import(`${getLibs()}/utils/utils.js`);
  const [headlineRow, hoverContainer, ...cards] = el.children;
  const pic = hoverContainer.querySelector('picture');
  const hoverImgSrc = pic?.querySelector('img')?.src;
  hoverContainer.remove();
  headlineRow.classList.add('headline-container');
  const cardsContainer = createTag('div', { class: 'cards-container' }, cards);
  const scrollContainer = createTag('div', { class: 'scroll-container' }, cardsContainer);
  el.append(scrollContainer);
  cards.forEach((card) => {
    card.classList.add('card');
    hoverImgSrc && card.style.setProperty('--hover-img', `url(${hoverImgSrc})`);
    const [media, cta] = card.children;
    media.classList.add('media');
    cta.classList.add('cta');
    [...cta.querySelectorAll('a')].forEach((a) => {
      a.classList.add('button', 'primary');
    });
  });
}
