import { getLibs } from '../../scripts/utils.js';
import buildGallery from '../../scripts/widgets/gallery/gallery.js';

export default async function init(el) {
  const { createTag } = await import(`${getLibs()}/utils/utils.js`);
  const [headingRow, hoverContainer, ...cards] = el.children;
  const pic = hoverContainer.querySelector('picture');
  hoverContainer.remove();
  headingRow.classList.add('heading-container');
  cards.forEach((card) => {
    card.classList.add('card');
    card.prepend(pic.cloneNode(true));
    const [bgPic, media, cta] = card.children;
    bgPic.classList.add('bg-pic');
    media.classList.add('media');
    cta.classList.add('cta');
    const cardText = card.querySelector('p').textContent;
    [...cta.querySelectorAll('a')].forEach((a) => {
      a.classList.add('button', 'primary');
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
