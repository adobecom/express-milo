import { getLibs } from '../../scripts/utils.js';
import buildGallery from '../../scripts/widgets/gallery/gallery.js';

export default async function init(el) {
  const { createTag } = await import(`${getLibs()}/utils/utils.js`);
  const [headlineRow, ...cards] = el.children;
  headlineRow.classList.add('headline-container');
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
  const cardsContainer = createTag('div', { class: 'cards-container centered' }, cards);
  const { control } = await buildGallery(cards, cardsContainer);
  el.append(cardsContainer, control);
}
