import { getLibs, addTempWrapperDeprecated } from '../../scripts/utils.js';

let createTag;

function decorateHeading(block) {
  // Find the header element
  const headerDiv = block.querySelector('h1, h2, h3, h4, h5, h6');
  if (!headerDiv) return;

  // Create header section
  const headerSection = createTag('div', { class: 'discover-more-cards-header' });
  headerSection.append(headerDiv);

  // Move header to top of block
  block.prepend(headerSection);

  // Remove the original empty div container
  const emptyHeaderContainer = block.querySelector('div > div > h1, div > div > h2')?.closest('div[class=""]')?.parentElement;
  if (emptyHeaderContainer) {
    emptyHeaderContainer.remove();
  }
}

export default async function decorate(block) {
  console.log('block', block);
  try {
    ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  } catch (error) {
    window.lana?.log('discover-more-cards.js - error loading createTag utility:', error);
    return;
  }

  if (block) {
    addTempWrapperDeprecated(block, 'discover-more-cards');
    const cardsWrapper = createTag('div', { class: 'discover-more-cards-wrapper' });
    console.log('cardsWrapper', cardsWrapper);

    // Handle header first
    decorateHeading(block);

    block.append(cardsWrapper);
  }
}
