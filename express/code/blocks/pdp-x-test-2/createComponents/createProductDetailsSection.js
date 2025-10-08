import { getLibs } from '../../../scripts/utils.js';

let createTag;

export default async function createProductDetailsSection(productDetails) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productDetailsSection = createTag('div', { class: 'pdpx-product-details-section' });
  const productDetailsSectionTitle = createTag('span', { class: 'pdpx-product-details-section-title' }, 'Product Details');
  productDetailsSection.appendChild(productDetailsSectionTitle);
  return productDetailsSection;
}
