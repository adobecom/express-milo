import { getLibs } from '../../scripts/utils.js';
import { fetchProductDetails, fetchProductPrice, fetchProductShippingEstimates } from './fetchData/fetchProductDetails.js';
import { extractProductId, normalizeProductDetailObject } from './utilities/utility-functions.js';
import createProductInfoHeadingSection, { createDeliveryEstimatePill } from './createComponents/createProductInfoHeadingSection.js';
import createProductImagesContainer from './createComponents/createProductImagesContainer.js';
import createCustomizationInputs from './createComponents/createCustomizationInputs.js';
import createProductDetailsSection from './createComponents/createProductDetailsSection.js';

let createTag;

async function createProductInfoContainer(productDetails) {
  const productInfoContainer = createTag('div', { class: 'pdpx-product-info-container' });
  const productInfoHeadingSection = createProductInfoHeadingSection(productDetails);
  productInfoContainer.appendChild(productInfoHeadingSection);
  const deliveryEstimatePill = createDeliveryEstimatePill(productDetails);
  productInfoContainer.appendChild(deliveryEstimatePill);
  const customizationInputs = await createCustomizationInputs(productDetails);
  productInfoContainer.appendChild(customizationInputs);
  const productDetailsSection = await createProductDetailsSection(productDetails);
  productInfoContainer.appendChild(productDetailsSection);
  return productInfoContainer;
}

async function createGlobalContainer(container, productDetails) {
  const globalContainer = createTag('div', { class: 'pdpx-global-container' });
  const productImagesContainer = await createProductImagesContainer(productDetails);
  const productInfoContainer = await createProductInfoContainer(productDetails);
  globalContainer.appendChild(productImagesContainer);
  globalContainer.appendChild(productInfoContainer);
  container.appendChild(globalContainer);
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productId = extractProductId(block);
  const productDetails = await fetchProductDetails(productId);
  const productPrice = await fetchProductPrice(productId);
  const productShippingEstimates = await fetchProductShippingEstimates(productId, '94065', 100);
  const productDetailsFormatted = normalizeProductDetailObject(productDetails, productPrice, productShippingEstimates);

  console.log('productDetails');
  console.log(productDetails);
  block.innerHTML = '';
  await createGlobalContainer(block, productDetailsFormatted);

  // extract productId from block
  // use productId to fetch product details from api
}
