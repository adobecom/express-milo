import { getLibs, addTempWrapperDeprecated } from '../../scripts/utils.js';
// import buildCarousel from '../../scripts/widgets/carousel.js';

export default async function decorate(block) {
  const { createTag } = await import(`${getLibs()}/utils/utils.js`);
  addTempWrapperDeprecated(block, 'discover-more-cards');

  const cardsWrapper = createTag('div', { class: 'discover-more-cards-wrapper' });
  const rows = [...block.children];

  if (rows[0]?.querySelector('img')?.src) {
    cardsWrapper.style.backgroundImage = `url(${rows[0].querySelector('img').src})`;
    rows.shift();
  }

  const header = rows[0]?.querySelector('h1, h2, h3, h4, h5, h6');
  if (header) {
    const headerSection = createTag('div', { class: 'discover-more-cards-header' });
    headerSection.append(header);
    block.prepend(headerSection);
    rows.shift();
  }

  rows.forEach((row) => {
    row.classList.add('discover-more-card');
    cardsWrapper.append(row);
  });

  block.append(cardsWrapper);
}
