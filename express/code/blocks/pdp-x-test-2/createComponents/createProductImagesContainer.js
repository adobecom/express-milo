import { getLibs } from '../../../scripts/utils.js';

let createTag;

function createImageThumbnailCarouselContainer(productDetails) {
  const imageThumbnailCarouselContainer = createTag('div', { class: 'pdpx-image-thumbnail-carousel-container' });
  return imageThumbnailCarouselContainer;
}

export default async function createProductImagesContainer(productDetails) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productImagesContainer = createTag('div', { class: 'pdpx-product-images-container' });
  const productHeroImageContainer = createTag('div', { class: 'pdpx-product-hero-image-container' });
  const productHeroImage = createTag('img', { class: 'pdpx-product-hero-image', src: productDetails.heroImage });
  const imageThumbnailCarouselContainer = createImageThumbnailCarouselContainer(productDetails);
  productHeroImageContainer.appendChild(productHeroImage);
  productImagesContainer.appendChild(productHeroImageContainer);
  productImagesContainer.appendChild(imageThumbnailCarouselContainer);

  return productImagesContainer;
}
