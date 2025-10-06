import { getLibs } from '../../scripts/utils.js';
import fetchProductDetails from './fetchData/fetchProductDetails.js';
import extractProductId from './utilities/extractProductId.js';

let createTag;

function createProductImagesContainer(productDetails) {
  const productImagesContainer = createTag('div', { class: 'pdpx-product-images-container' });
  const productHeroImageContainer = createTag('div', { class: 'pdpx-product-hero-image-container' });
  const productHeroImage = createTag('img', { src: productDetails.heroImage });
  productImagesContainer.appendChild(productHeroImageContainer);
  productHeroImageContainer.appendChild(productHeroImage);
  return productImagesContainer;
}

function createDeliveryEstimatePill(productDetails) {
  const deliveryEstimatePillContainer = createTag('div', { class: 'pdpx-delivery-estimate-pill' });
  const deliveryEstimatePillIcon = createTag('img', { src: '/express/code/icons/delivery-truck.svg' });
}

function createProductInfoContainer(productDetails) {
  const productInfoContainer = createTag('div', { class: 'pdpx-product-info-container' });
  const deliveryEstimatePill = createDeliveryEstimatePill(productDetails);
  return productInfoContainer;
}

function createGlobalContainer(container, productDetails) {
  const globalContainer = createTag('div', { class: 'pdpx-global-container' });
  const productImagesContainer = createProductImagesContainer(productDetails);
  const productInfoContainer = createProductInfoContainer(productDetails);
  globalContainer.appendChild(productImagesContainer);
  globalContainer.appendChild(productInfoContainer);
  container.appendChild(globalContainer);
}

function normalizeProductDetailObject(APIResponse) {
  const normalizedProductDetails = {
    heroImage: APIResponse.product.initialPrettyPreferredViewUrl,
  };
  return normalizedProductDetails;
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productId = extractProductId(block);
  const APIResponse = await fetchProductDetails(productId);
  const productDetails = normalizeProductDetailObject(APIResponse);
  console.log(productDetails);
  // debugger;
  block.innerHTML = '';
  createGlobalContainer(block, productDetails);

  // extract productId from block
  // use productId to fetch product details from api
}
