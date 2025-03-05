import { getLibs, addTempWrapperDeprecated } from '../../scripts/utils.js';

let createTag;

const constructPayload = (content) => {
  if (!content?.length) return [];

  return content.map(({ children }) => {
    if (children.length < 3) return null;
    const [imgDiv, titleDiv, detailsDiv] = children;

    return {
      img: imgDiv?.querySelector('img')?.src ?? null,
      cardTitle: titleDiv?.innerText?.trim() ?? '',
      cardDetails: detailsDiv?.innerText?.trim() ?? '',
    };
  }).filter(Boolean);
};

const handleBackgroundImage = (rows, wrapper) => {
  if (!rows.length) return false;
  const imgSrc = rows[0].querySelector('img')?.src;
  if (!imgSrc) return false;

  wrapper.style.setProperty('--bg-image', `url(${imgSrc})`);
  rows.shift();
  return true;
};

const handleHeader = (rows, block) => {
  if (!rows.length) return;
  const header = rows[0].querySelector('h1, h2, h3, h4, h5, h6');
  if (!header) return;

  const headerSection = createTag('div', { class: 'discover-more-cards-header' });
  const { parentElement: parent } = header;

  headerSection.append(header);
  block.prepend(headerSection);
  rows.shift();

  if (parent?.children.length === 0) {
    const { parentElement: grandparent } = parent;
    parent.remove();
    grandparent?.children.length === 0 && grandparent.remove();
  }
};

const getContentDivs = (block, isBgImage) => Array.from(block.children)
  .slice(isBgImage ? 2 : 1)
  .filter((child) => child.tagName === 'DIV');

async function decorateCards(block, cardsWrapper, payload) {
  console.log('block', block);
  console.log('payload', payload);
  payload.forEach((card) => {
    const cardEl = createTag('div', { class: 'discover-more-cards-card' });
    cardEl.append(card.img, card.cardTitle, card.cardDetails);
    cardsWrapper.append(cardEl);
  });
}

export default async function decorate(block) {
  try {
    ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  } catch (error) {
    window.lana?.log('discover-more-cards.js - error loading createTag utility:', error);
    return [];
  }

  addTempWrapperDeprecated(block, 'discover-more-cards');
  const cardsWrapper = createTag('div', { class: 'discover-more-cards-wrapper' });
  const rows = [...block.children];

  const isBgImage = handleBackgroundImage(rows, cardsWrapper);
  handleHeader(rows, block);

  const payload = constructPayload(getContentDivs(block, isBgImage));
  await decorateCards(block, cardsWrapper, payload);
  return [];
}
