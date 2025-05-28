import { getLibs } from '../../scripts/utils.js';
import buildGallery from '../../scripts/widgets/gallery/gallery.js';

export default async function init(el) {
  const { createTag } = await import(`${getLibs()}/utils/utils.js`);
  const [headlineRow, hoverContainer, ...cards] = el.children;
  const pic = hoverContainer.querySelector('picture');
  const hoverImgSrc = pic?.querySelector('img')?.src;
  hoverContainer.remove();
  headlineRow.classList.add('headline-container');
  cards.forEach((card) => {
    card.classList.add('card');
    hoverImgSrc && card.style.setProperty('--hover-img', `url(${hoverImgSrc})`);
    const [media, cta] = card.children;
    media.classList.add('media');
    cta.classList.add('cta');
    [...cta.querySelectorAll('a')].forEach((a) => {
      a.classList.add('button', 'primary');
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
