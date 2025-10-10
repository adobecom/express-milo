import { getLibs } from '../../../scripts/utils.js';

let createTag;

export default async function createProductDetailsSection(productDescriptions) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productDetailsSectionContainer = createTag('div', { class: 'pdpx-product-details-section-container' });
  const productDetailsSectionTitleContainer = createTag('div', { class: 'pdpx-product-details-section-title-container' });
  const productDetailsSectionTitle = createTag('span', { class: 'pdpx-product-details-section-title' }, 'Product Details');
  productDetailsSectionTitleContainer.appendChild(productDetailsSectionTitle);
  productDetailsSectionContainer.appendChild(productDetailsSectionTitleContainer);
  for (let i = 0; i < productDescriptions.length; i += 1) {
    const productDetailsSectionItemContainer = createTag('div', { class: 'pdpx-product-details-section-item-container collapsed' });
    const productDetailsSectionItemTitleContainer = createTag('span', { class: 'pdpx-product-details-section-item-title-container' });
    const productDetailsSectionItemTitle = createTag('span', { class: 'pdpx-product-details-section-item-title' }, productDescriptions[i].title);
    const productDetailsSectionItemIcon = createTag('div', { class: 'pdpx-product-details-section-item-icon' });
    const productDetailsSectionItemDescription = createTag('span', { class: 'pdpx-product-details-section-item-description' }, productDescriptions[i].description);
    productDetailsSectionItemTitleContainer.appendChild(productDetailsSectionItemTitle);
    productDetailsSectionItemTitleContainer.appendChild(productDetailsSectionItemIcon);
    productDetailsSectionItemContainer.appendChild(productDetailsSectionItemTitleContainer);
    productDetailsSectionItemContainer.appendChild(productDetailsSectionItemDescription);
    productDetailsSectionContainer.appendChild(productDetailsSectionItemContainer);
    productDetailsSectionItemContainer.addEventListener('click', () => {
      console.log('clicked');
      // add a class to the productDetailsSectionItemContentContainer
      productDetailsSectionItemContainer.classList.toggle('collapsed');
      productDetailsSectionItemContainer.classList.toggle('expanded');
    });
  }

  return productDetailsSectionContainer;
}
