import { getLibs, addTempWrapperDeprecated } from '../../scripts/utils.js';

let createTag;
function constructPayload(content) {
  const payload = {
    cardTitle: '',
    cardDetails: '',
    img: null,
  };
  const cards = content.map((item) => {
    const cardImg = item.children[0].querySelector('img');
    const cardTitleText = item.children[1].innerText;
    const cardDetailsText = item.children[2].innerText;

    const cardTitle = createTag('p', { class: 'discover-more-cards-title' });
    cardTitle.textContent = cardTitleText;

    const cardDetails = createTag('p', { class: 'discover-more-cards-details' });
    cardDetails.textContent = cardDetailsText;

    payload.cardTitle = cardTitleText;
    payload.cardDetails = cardDetailsText;
    payload.img = cardImg?.src;
    return payload;
  });
  return cards;
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  addTempWrapperDeprecated(block, 'discover-more-cards');

  const cardsWrapper = createTag('div', { class: 'discover-more-cards-wrapper' });
  const rows = [...block.children];
  const isBgImage = rows[0]?.querySelector('img')?.src;

  if (isBgImage) {
    cardsWrapper.style.setProperty('--bg-image', `url(${rows[0].querySelector('img').src})`);
    rows.shift();
  }

  const header = rows[0]?.querySelector('h1, h2, h3, h4, h5, h6');
  if (header) {
    const parent = header.parentElement;
    const headerSection = createTag('div', { class: 'discover-more-cards-header' });
    headerSection.append(header);
    block.prepend(headerSection);
    rows.shift();

    if (parent) {
      const grandparent = parent.parentElement;
      parent.remove();

      if (grandparent && grandparent.children.length === 0) {
        grandparent.remove();
      }
    }
  }

  const content = [...block.children].filter((child) => child.tagName === 'DIV');
  if (isBgImage) {
    content.splice(0, 2);
  } else {
    content.splice(0, 1);
  }

  const payload = constructPayload(content);
  console.log('payload', payload);
}
