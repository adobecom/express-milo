import { getLibs } from '../../../scripts/utils.js';
// import { buildRealViewImageUrl } from '../utilities/utility-functions.js';

let createTag;

export default async function createProductImagesContainer(realViews, heroImage, heroImageType = 'Front') {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productImagesContainer = createTag('div', { class: 'pdpx-product-images-container', id: 'pdpx-product-images-container' });
  const productHeroImageContainer = createTag('div', { class: 'pdpx-product-hero-image-container' });
  const productHeroImage = createTag('img', { class: 'pdpx-product-hero-image', id: 'pdpx-product-hero-image', 'data-image-type': heroImageType, src: heroImage });
  const imageThumbnailCarouselContainer = createTag('div', { class: 'pdpx-image-thumbnail-carousel-container' });
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
  productHeroImageContainer.appendChild(productHeroImage);
  productImagesContainer.appendChild(productHeroImageContainer);
  productImagesContainer.appendChild(imageThumbnailCarouselContainer);
  return productImagesContainer;
}
