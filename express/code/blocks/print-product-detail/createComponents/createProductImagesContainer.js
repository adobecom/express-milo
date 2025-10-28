import { getLibs } from '../../../scripts/utils.js';
// import { buildRealViewImageUrl } from '../utilities/utility-functions.js';

let createTag;

export default async function createProductImagesContainer(realViews, heroImage, heroImageType = 'Front') {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productImagesContainer = createTag('div', { class: 'pdpx-product-images-container', id: 'pdpx-product-images-container' });
  const { productHeroImage, productHeroImageContainer } = createproductHeroImage(heroImage, heroImageType);
  const imageThumbnailCarouselContainer = createProductThumbnailCarousel(realViews, heroImageType, productHeroImage);
  productImagesContainer.append(productHeroImageContainer, imageThumbnailCarouselContainer);
  return productImagesContainer;
}

export function createproductHeroImage(heroImage, heroImageType) {
  const productHeroImageContainer = createTag('div', { class: 'pdpx-product-hero-image-container', 'data-skeleton': 'true' });
  const productHeroImage = createTag('img', { class: 'pdpx-product-hero-image', id: 'pdpx-product-hero-image', 'data-image-type': heroImageType, fetchpriority: 'high', decoding: 'async', loading: 'eager', alt: 'Product Hero Image', src: heroImage });
  productHeroImageContainer.appendChild(productHeroImage);
  return { productHeroImage, productHeroImageContainer };
}
export function createProductThumbnailCarousel(realViews, heroImageType, productHeroImage) {
  const imageThumbnailCarouselContainer = createTag('div', { class: 'pdpx-image-thumbnail-carousel-container', id: 'pdpx-image-thumbnail-carousel-container', 'data-skeleton': 'true' });
  for (let i = 0; i < Object.keys(realViews).length; i += 1) {
    const imageThumbnailCarouselItem = createTag('button', { class: 'pdpx-image-thumbnail-carousel-item', 'data-image-type': Object.keys(realViews)[i] });
    if (heroImageType === Object.keys(realViews)[i]) {
      imageThumbnailCarouselItem.classList.add('selected');
    }
    const imageURL = realViews[Object.keys(realViews)[i]];
    const imageThumbnailCarouselItemImage = createTag('img', { class: 'pdpx-image-thumbnail-carousel-item-image', 'data-image-type': Object.keys(realViews)[i], src: imageURL });
    imageThumbnailCarouselItem.addEventListener('click', (element) => {
      imageThumbnailCarouselItem.classList.add('selected');
      imageThumbnailCarouselContainer.querySelectorAll('.pdpx-image-thumbnail-carousel-item').forEach((item) => {
        if (item !== element.currentTarget) {
          item.classList.remove('selected');
        }
      });
      productHeroImage.src = element.currentTarget.querySelector('img').src;
      productHeroImage.dataset.imageType = element.currentTarget.dataset.imageType;
    });
    imageThumbnailCarouselItem.appendChild(imageThumbnailCarouselItemImage);
    imageThumbnailCarouselContainer.appendChild(imageThumbnailCarouselItem);
  }
  return imageThumbnailCarouselContainer;
}
