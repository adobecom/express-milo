import { getLibs, addTempWrapperDeprecated } from '../../scripts/utils.js';

let createTag;

function decorateBlock(block, cardsWrapper) {
  // Find the header element
  const headerDiv = block.querySelector('h1, h2, h3, h4, h5, h6');
  if (!headerDiv) return;

  // Create header section
  const headerSection = createTag('div', { class: 'discover-more-cards-header' });
  headerSection.append(headerDiv);

  // Move header to top of block
  block.prepend(headerSection);

  // Find and handle background image
  const firstPicture = block.querySelector('div > div > picture');
  if (firstPicture) {
    const bgImage = firstPicture.querySelector('img')?.src;
    if (bgImage) {
      cardsWrapper.style.setProperty('--bg-image', `url(${bgImage})`);
      // Remove the background image container
      firstPicture.closest('div[class=""]')?.parentElement?.remove();
    }
  }

  // Remove the original empty div container for header
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

    // Handle header and background image
    decorateBlock(block, cardsWrapper);

    block.append(cardsWrapper);
  }
}
