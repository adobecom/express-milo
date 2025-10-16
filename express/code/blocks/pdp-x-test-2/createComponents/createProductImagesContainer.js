import { getLibs } from '../../../scripts/utils.js';
import { buildRealViewImageUrl } from '../utilities/utility-functions.js';

let createTag;

export default async function createProductImagesContainer(productDetails) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productImagesContainer = createTag('div', { class: 'pdpx-product-images-container' });
  const productHeroImageContainer = createTag('div', { class: 'pdpx-product-hero-image-container' });
  const productHeroImage = createTag('img', { class: 'pdpx-product-hero-image', id: 'pdpx-product-hero-image', 'data-image-type': 'front', src: productDetails.heroImage });
  const imageThumbnailCarouselContainer = createTag('div', { class: 'pdpx-image-thumbnail-carousel-container' });
  const productThumbnails = productDetails.realviews.filter((realview) => realview.type === 'Product' && realview.canBePreferred);
  for (let i = 0; i < productThumbnails.length; i += 1) {
    const imageThumbnailCarouselItem = createTag('button', { class: 'pdpx-image-thumbnail-carousel-item', 'data-image-type': productThumbnails[i].title });
    const imageURL = buildRealViewImageUrl(productThumbnails[i].realviewParams);
    const imageThumbnailCarouselItemImage = createTag('img', { class: 'pdpx-image-thumbnail-carousel-item-image', 'data-image-type': productThumbnails[i].title, src: imageURL });
    imageThumbnailCarouselItem.addEventListener('click', (element) => {
      productHeroImage.src = imageURL;
      productHeroImage.dataset.imageType = element.currentTarget.dataset.imageType;
      // productHeroImage.setAttribute('data-image-type', productThumbnails[i].title);
    });
    imageThumbnailCarouselItem.appendChild(imageThumbnailCarouselItemImage);
    imageThumbnailCarouselContainer.appendChild(imageThumbnailCarouselItem);
  }
  productHeroImageContainer.appendChild(productHeroImage);
  productImagesContainer.appendChild(productHeroImageContainer);
  productImagesContainer.appendChild(imageThumbnailCarouselContainer);
  return productImagesContainer;
}
