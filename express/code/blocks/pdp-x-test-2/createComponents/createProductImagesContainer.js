import { getLibs } from '../../../scripts/utils.js';
import { buildRealViewImageUrl } from '../utilities/utility-functions.js';

let createTag;

function createImageThumbnailCarouselContainer(productDetails) {
  const imageThumbnailCarouselContainer = createTag('div', { class: 'pdpx-image-thumbnail-carousel-container' });
  for (let i = 0; i < productDetails.realviews.length; i += 1) {
    const imageThumbnailCarouselItem = createTag('div', { class: 'pdpx-image-thumbnail-carousel-item' });
    const imageURL0 = 'https://placehold.co/250x250';
    const imageURL = buildRealViewImageUrl(productDetails.realviews[i].realviewParams);
    const imageThumbnailCarouselItemImage = createTag('img', { class: 'pdpx-image-thumbnail-carousel-item-image', src: imageURL });
    imageThumbnailCarouselItem.appendChild(imageThumbnailCarouselItemImage);
    imageThumbnailCarouselContainer.appendChild(imageThumbnailCarouselItem);
  }
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
