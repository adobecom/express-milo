import { getLibs } from '../../../scripts/utils.js';
import { buildRealViewImageUrl } from '../utilities/utility-functions.js';

let createTag;

export default async function createProductImagesContainer(productDetails) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productImagesContainer = createTag('div', { class: 'pdpx-product-images-container' });
  const productHeroImageContainer = createTag('div', { class: 'pdpx-product-hero-image-container' });
  const productHeroImage = createTag('img', { class: 'pdpx-product-hero-image', src: productDetails.heroImage });
  const imageThumbnailCarouselContainer = createTag('div', { class: 'pdpx-image-thumbnail-carousel-container' });
  const productThumbnails = productDetails.realviews.filter((realview) => realview.type === 'Product' && realview.canBePreferred);
  for (let i = 0; i < productThumbnails.length; i += 1) {
    const imageThumbnailCarouselItem = createTag('button', { class: 'pdpx-image-thumbnail-carousel-item' });
    const imageURL = buildRealViewImageUrl(productThumbnails[i].realviewParams);
    const imageThumbnailCarouselItemImage = createTag('img', { class: 'pdpx-image-thumbnail-carousel-item-image', src: imageURL });
    imageThumbnailCarouselItem.addEventListener('click', () => {
      productHeroImage.src = imageURL;
    });
    imageThumbnailCarouselItem.appendChild(imageThumbnailCarouselItemImage);
    imageThumbnailCarouselContainer.appendChild(imageThumbnailCarouselItem);
  }
  productHeroImageContainer.appendChild(productHeroImage);
  productImagesContainer.appendChild(productHeroImageContainer);
  productImagesContainer.appendChild(imageThumbnailCarouselContainer);

  return productImagesContainer;
}
