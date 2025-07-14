import { getLibs } from '../../../utils.js';
import buildGallery from '../../../widgets/gallery/gallery.js';

export default async function init(el) {
  const { createTag } = await import(`${getLibs()}/utils/utils.js`);

  if (el.classList.contains('split')) {
    const [leftContent, rightContent] = el.children;
    leftContent.classList.add('left-content');
    const media = leftContent.querySelector('div');
    media.classList.add('media-wrapper');
    rightContent.classList.add('right-content');
    const section = rightContent.querySelector('div');
    const [h2, body, cta, subText] = section.children;
    h2.classList.add('heading-l');
    body.classList.add('body-s');
    cta.classList.add('cta');
    subText.classList.add('cta-sub-text');
    const cardText = section.querySelector('p')?.textContent;
    if (!cta) return;
    [...cta.querySelectorAll('a')].forEach((a, i) => {
      if (i === 0) a.classList.add('button', 'primary');
      if (el.classList.contains('gradient')) a.classList.add('gradient');
      else a.classList.add('link-block');
      cardText && a.setAttribute('aria-label', `${cardText}-${a.textContent}`);
      const parent = a.parentElement;
      if (parent.tagName === 'P' && parent.firstChild === parent.lastChild) {
        parent.replaceWith(a);
      }
    });
  } else {
    const [headingRow, hoverContainer, ...cards] = el.children;
    const pic = hoverContainer.querySelector('picture');
    hoverContainer.remove();
    headingRow.classList.add('heading-container');
    cards.forEach((card) => {
      card.classList.add('card');
      card.prepend(pic?.cloneNode(true));
      const [bgPic, media, cta] = card.children;
      bgPic.classList.add('bg-pic');
      media.classList.add('media');
      cta.classList.add('cta');
      const cardText = card.querySelector('p')?.textContent;
      if (!cta) return;
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
}
