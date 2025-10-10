import { getLibs } from '../../../scripts/utils.js';

let createTag;

export default async function createProductDetailsSection(productDescriptions) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productDetailsSectionContainer = createTag('div', { class: 'pdpx-product-details-section-container' });
  const productDetailsSectionTitle = createTag('span', { class: 'pdpx-product-details-section-title' }, 'Product Details');
  const productDetailsSectionTitleUnderline = createTag('hr', { class: 'pdpx-product-details-section-underline' });
  productDetailsSectionContainer.appendChild(productDetailsSectionTitle);
  productDetailsSectionContainer.appendChild(productDetailsSectionTitleUnderline);
  for (let i = 0; i < productDescriptions.length; i += 1) {
    const productDetailsSectionItemContainer = createTag('div', { class: 'pdpx-product-details-section-item-container' });
    const productDetailsSectionItemTitleContainer = createTag('div', { class: 'pdpx-product-details-section-item-title-container' });
    const productDetailsSectionItemTitle = createTag('span', { class: 'pdpx-product-details-section-item-title' }, productDescriptions[i].title);
    const productDetailsSectionItemIcon = createTag('img', { class: 'pdpx-product-details-section-item-icon', src: '/express/code/icons/plus-sign.svg' });
    const productDetailsSectionItemDescription = createTag('span', { class: 'pdpx-product-details-section-item-description' }, productDescriptions[i].description);
    const productDetailsSectionItemUnderline = createTag('hr', { class: 'pdpx-product-details-section-underline' });
    productDetailsSectionItemTitleContainer.appendChild(productDetailsSectionItemTitle);
    productDetailsSectionItemTitleContainer.appendChild(productDetailsSectionItemIcon);
    productDetailsSectionItemContainer.appendChild(productDetailsSectionItemTitleContainer);
    productDetailsSectionItemContainer.appendChild(productDetailsSectionItemDescription);
    // productDetailsSectionItemContainer.appendChild(productDetailsSectionItemUnderline);
    productDetailsSectionContainer.appendChild(productDetailsSectionItemContainer);
  }

  return productDetailsSectionContainer;
}
