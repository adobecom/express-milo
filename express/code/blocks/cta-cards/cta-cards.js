import { getLibs } from '../../scripts/utils.js';
import buildGallery from '../../scripts/widgets/gallery/gallery.js';

export default async function init(el) {
  const { createTag } = await import(`${getLibs()}/utils/utils.js`);
  const [headingRow, ...cards] = el.children;
  headingRow.classList.add('heading-container');
  cards.forEach((card) => {
    card.classList.add('card');
    const [media, textContainer] = card.children;
    media.classList.add('media');
    textContainer.classList.add('text-container');
    const cardText = card.querySelector('strong').textContent;
    [...textContainer.querySelectorAll('a')].forEach((a) => {
      a.classList.add('button', 'primary', 'reverse');
      cardText && a.setAttribute('aria-label', `${cardText}-${a.textContent}`);
      const parent = a.parentElement;
      if (parent.tagName === 'P' && parent.firstChild === parent.lastChild) {
        parent.replaceWith(a);
      }
    });
  });
  const cardsContainer = createTag('div', { class: 'cards-container centered' }, cards);
  const { control } = await buildGallery(cards, cardsContainer);
  el.append(cardsContainer, control);
}
