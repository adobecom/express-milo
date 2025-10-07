import { getLibs } from '../../../scripts/utils.js';

let createTag;

export default async function createProductImagesContainer(productDetails) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productImagesContainer = createTag('div', { class: 'pdpx-product-images-container' });
  const productHeroImageContainer = createTag('div', { class: 'pdpx-product-hero-image-container' });
  const productHeroImage = createTag('img', { class: 'pdpx-product-hero-image', src: productDetails.heroImage });
  productImagesContainer.appendChild(productHeroImageContainer);
  productHeroImageContainer.appendChild(productHeroImage);
  return productImagesContainer;
}
