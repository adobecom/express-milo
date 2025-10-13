import { getLibs } from '../../scripts/utils.js';
import { fetchProductDetails, fetchProductPrice, fetchProductReviews, fetchProductShippingEstimates, fetchProductDetailsChangeOptions, formatProductDescriptions } from './fetchData/fetchProductDetails.js';
import { extractProductId, normalizeProductDetailObject } from './utilities/utility-functions.js';
import createProductInfoHeadingSection, { createDeliveryEstimatePill } from './createComponents/createProductInfoHeadingSection.js';
import createProductImagesContainer from './createComponents/createProductImagesContainer.js';
import createCustomizationInputs from './createComponents/createCustomizationInputs.js';
import createProductDetailsSection, { createCheckoutButton } from './createComponents/createProductDetailsSection.js';

let createTag;

async function createProductInfoContainer(productDetails, productDescriptions) {
  const productInfoSectionWrapper = createTag('div', { class: 'pdpx-product-info-section-wrapper' });
  const productInfoContainer = createTag('div', { class: 'pdpx-product-info-container' });

  const productInfoHeadingSection = createProductInfoHeadingSection(productDetails);
  productInfoContainer.appendChild(productInfoHeadingSection);
  const deliveryEstimatePill = createDeliveryEstimatePill(productDetails);
  productInfoContainer.appendChild(deliveryEstimatePill);
  const customizationInputs = await createCustomizationInputs(productDetails);
  productInfoContainer.appendChild(customizationInputs);
  const productDetailsSection = await createProductDetailsSection(productDescriptions);
  productInfoContainer.appendChild(productDetailsSection);
  productInfoSectionWrapper.appendChild(productInfoContainer);
  const checkoutButton = createCheckoutButton();
  productInfoSectionWrapper.appendChild(checkoutButton);
  return productInfoSectionWrapper;
}

async function createGlobalContainer(block, productDetails, productDescriptions) {
  const globalContainer = createTag('div', { class: 'pdpx-global-container' });
  const productImagesContainer = await createProductImagesContainer(productDetails);
  const productInfoSectionWrapper = await createProductInfoContainer(productDetails, productDescriptions);
  globalContainer.appendChild(productImagesContainer);
  globalContainer.appendChild(productInfoSectionWrapper);
  block.appendChild(globalContainer);
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productId = extractProductId(block);
  const productDetails = await fetchProductDetails(productId);
  const productPrice = await fetchProductPrice(productId);
  const productReviews = await fetchProductReviews(productId);
  const productShippingEstimates = await fetchProductShippingEstimates(productId, '94065', 100);
  const productDetailsChangeOptions = await fetchProductDetailsChangeOptions(productId);
  const productDetailsFormatted = normalizeProductDetailObject(productDetails, productPrice, productReviews, productShippingEstimates);
  const productDescriptions = await formatProductDescriptions(block);
  console.log('productDetails');
  console.log(productDetails);
  block.innerHTML = '';
  await createGlobalContainer(block, productDetailsFormatted, productDescriptions);

  // extract productId from block
  // use productId to fetch product details from api
}
