import { getLibs } from '../../scripts/utils.js';

let createTag;

export default async function init(el) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const [headlineRow, ...cards] = el.children;
  headlineRow.classList.add('headline-container');
  const cardsContainer = createTag('div', { class: 'cards-container' }, cards);
  el.append(cardsContainer);
  cards.forEach((card) => {
    card.classList.add('card');
    const [media, cta] = card.children;
    media.classList.add('media');
    cta.classList.add('cta');
  });
}
