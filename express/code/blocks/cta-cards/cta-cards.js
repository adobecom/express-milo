import { getLibs } from '../../scripts/utils.js';

export default async function init(el) {
  const { createTag } = await import(`${getLibs()}/utils/utils.js`);
  const [headlineRow, ...cards] = el.children;
  headlineRow.classList.add('headline-container');
  const cardsContainer = createTag('div', { class: 'cards-container' }, cards);
  const scrollContainer = createTag('div', { class: 'scroll-container' }, cardsContainer);
  el.append(scrollContainer);
  cards.forEach((card) => {
    card.classList.add('card');
    const [media, textContainer] = card.children;
    media.classList.add('media');
    textContainer.classList.add('text-container');
    [...textContainer.querySelectorAll('a')].forEach((a) => {
      a.classList.add('button', 'primary', 'reverse');
      const parent = a.parentElement;
      if (parent.tagName === 'P' && parent.firstChild === parent.lastChild) {
        parent.replaceWith(a);
      }
    });
  });
}
