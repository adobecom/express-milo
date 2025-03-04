import { getLibs, addTempWrapperDeprecated } from '../../scripts/utils.js';

export default async function decorate(block) {
  const { createTag } = await import(`${getLibs()}/utils/utils.js`);
  addTempWrapperDeprecated(block, 'discover-more-cards');

  const cardsWrapper = createTag('div', { class: 'discover-more-cards-wrapper' });
  const rows = [...block.children];

  if (rows[0]?.querySelector('img')?.src) {
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
}
