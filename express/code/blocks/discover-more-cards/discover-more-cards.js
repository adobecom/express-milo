import { getLibs, addTempWrapperDeprecated } from '../../scripts/utils.js';

let createTag;

function decorateHeading(block, header) {
  if (!header) return;

  const headerSection = createTag('div', { class: 'discover-more-cards-header' });
  headerSection.append(header);
  block.prepend(headerSection);
}

function decorateCards(block, cardsWrapper, cards) {
  if (!cards?.length) return;

  const cardsContainer = createTag('div', { class: 'discover-more-cards-container' });

  cards.forEach((card) => {
    const cardEl = createTag('div', { class: 'discover-more-card' });

    const cardFront = createTag('div', { class: 'card-face card-front' });
    const imgWrapper = createTag('div', { class: 'discover-more-card-img' });
    if (card.img) {
      const img = createTag('img', { src: card.img, alt: card.cardTitle });
      imgWrapper.append(img);
    }
    const titleEl = createTag('p', { class: 'discover-more-card-title' });
    titleEl.textContent = card.cardTitle;
    cardFront.append(imgWrapper, titleEl);

    const cardBack = createTag('div', { class: 'card-face card-back' });
    const detailsEl = createTag('p', { class: 'discover-more-card-details' });
    detailsEl.textContent = card.cardDetails;
    cardBack.append(detailsEl);

    cardEl.addEventListener('click', () => {
      cardEl.classList.toggle('is-flipped');
    });

    cardEl.append(cardFront, cardBack);
    cardsContainer.append(cardEl);
  });

  cardsWrapper.append(cardsContainer);
  block.append(cardsWrapper);
}

function constructPayload(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  const bgImage = rows[0]?.querySelector('img')?.src;
  if (bgImage) rows.shift();

  const header = rows[0]?.querySelector('h1, h2, h3, h4, h5, h6');
  if (header) rows.shift();

  const cards = rows.map((row) => ({
    img: row.querySelector('img')?.src ?? null,
    cardTitle: row.children[1]?.innerText?.trim() ?? '',
    cardDetails: row.children[2]?.innerText?.trim() ?? '',
  }));

  return { bgImage, header, cards };
}

export default async function decorate(block) {
  try {
    ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  } catch (error) {
    window.lana?.log('discover-more-cards.js - error loading createTag utility:', error);
    return;
  }

  if (block) {
    addTempWrapperDeprecated(block, 'discover-more-cards');
    const cardsWrapper = createTag('div', { class: 'discover-more-cards-wrapper' });

    const { bgImage, header, cards } = constructPayload(block);

    if (bgImage) {
      cardsWrapper.style.setProperty('--bg-image', `url(${bgImage})`);
    }

    decorateHeading(block, header);
    decorateCards(block, cardsWrapper, cards);
  }
}
