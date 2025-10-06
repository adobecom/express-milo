import { getLibs } from '../../scripts/utils.js';
import fetchProductDetails from './fetchData/fetchProductDetails.js';
import { extractProductId, normalizeProductDetailObject } from './utilities/utility-functions.js';
import createProductInfoHeadingSection, { createDeliveryEstimatePill } from './createComponents/createProductInfoHeadingSection.js';

let createTag;

function createProductImagesContainer(productDetails) {
  const productImagesContainer = createTag('div', { class: 'pdpx-product-images-container' });
  const productHeroImageContainer = createTag('div', { class: 'pdpx-product-hero-image-container' });
  const productHeroImage = createTag('img', { src: productDetails.heroImage });
  productImagesContainer.appendChild(productHeroImageContainer);
  productHeroImageContainer.appendChild(productHeroImage);
  return productImagesContainer;
}

function createProductInfoContainer(productDetails) {
  const productInfoContainer = createTag('div', { class: 'pdpx-product-info-container' });
  const productInfoHeadingSection = createProductInfoHeadingSection(productDetails);
  productInfoContainer.appendChild(productInfoHeadingSection);
  const deliveryEstimatePill = createDeliveryEstimatePill(productDetails);
  productInfoContainer.appendChild(deliveryEstimatePill);
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

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productId = extractProductId(block);
  const APIResponse = await fetchProductDetails(productId);
  const productDetails = normalizeProductDetailObject(APIResponse);
  console.log('APIResponse');
  console.log(APIResponse);
  // debugger;
  block.innerHTML = '';
  createGlobalContainer(block, productDetails);

  // extract productId from block
  // use productId to fetch product details from api
}
