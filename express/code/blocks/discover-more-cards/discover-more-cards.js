import { getLibs, addTempWrapperDeprecated } from '../../scripts/utils.js';

let createTag;

const constructPayload = (content) => content.map(
  ({ children: [imgDiv, titleDiv, detailsDiv] }) => ({
    img: imgDiv?.querySelector('img')?.src ?? null,
    cardTitle: titleDiv?.innerText?.trim() ?? '',
    cardDetails: detailsDiv?.innerText?.trim() ?? '',
  }),
);

const handleBackgroundImage = (rows, wrapper) => {
  if (!rows.length) return false;

  const imgSrc = rows[0].querySelector('img')?.src;
  if (!imgSrc) return false;

  wrapper.style.setProperty('--bg-image', `url(${imgSrc})`);
  rows.shift();
  return true;
};

const handleHeader = (rows, block) => {
  const header = rows[0]?.querySelector('h1, h2, h3, h4, h5, h6');
  if (header) {
    const headerSection = createTag('div', { class: 'discover-more-cards-header' });
    const parent = header.parentElement;
    const grandparent = parent?.parentElement;

    headerSection.append(header);
    block.prepend(headerSection);
    rows.shift();

    parent?.remove();
    grandparent?.children.length === 0 && grandparent.remove();
  }
};

const getContentDivs = (block, isBgImage) => [...block.children]
  .filter((child) => child.tagName === 'DIV')
  .slice(isBgImage ? 2 : 1);

export default async function decorate(block) {
  try {
    ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  } catch (error) {
    window.lana?.log('discover-more-cards.js - error loading createTag utility:', error);
  }

  addTempWrapperDeprecated(block, 'discover-more-cards');

  const cardsWrapper = createTag('div', { class: 'discover-more-cards-wrapper' });
  const rows = [...block.children];

  const isBgImage = handleBackgroundImage(rows, cardsWrapper);
  handleHeader(rows, block);
  const content = getContentDivs(block, isBgImage);

  const payload = constructPayload(content);
  console.log(payload);
  return payload;
}
