import { getLibs } from '../../scripts/utils.js';
import fetchAPIData from './fetchData/fetchProductDetails.js';
import extractProductDescriptionsFromBlock from './utilities/data-formatting.js';
import { extractProductId, normalizeProductDetailObject } from './utilities/utility-functions.js';
import createProductInfoHeadingSection from './createComponents/createProductInfoHeadingSection.js';
import createProductImagesContainer from './createComponents/createProductImagesContainer.js';
import createCustomizationInputs from './createComponents/createCustomizationInputs.js';
import createProductDetailsSection, { createCheckoutButton } from './createComponents/createProductDetailsSection.js';
import { createDrawer, toggleDrawer } from './createComponents/createSideDrawer.js';

let createTag;

async function createProductInfoContainer(productDetails, productDescriptions) {
  const productInfoSectionWrapper = createTag('div', { class: 'pdpx-product-info-section-wrapper' });
  const productInfoContainer = createTag('div', { class: 'pdpx-product-info-container' });
  const productInfoHeadingSection = await createProductInfoHeadingSection(productDetails);
  productInfoContainer.appendChild(productInfoHeadingSection);
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
  // const productInfoHeadingSection = await createProductInfoHeadingSection(productDetails);
  globalContainer.appendChild(productImagesContainer);
  globalContainer.appendChild(productInfoSectionWrapper);
  // globalContainer.appendChild(productInfoHeadingSection);
  block.appendChild(globalContainer);
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productId = extractProductId(block);
  const productDetails = await fetchAPIData(productId, null, 'getproduct');
  const productPrice = await fetchAPIData(productId, null, 'getproductpricing');
  const productReviews = await fetchAPIData(productId, null, 'getreviews');
  const sampleShippingParameters = {
    zip: '94065',
    qty: 1,
  };
  const productShippingEstimates = await fetchAPIData(productId, sampleShippingParameters, 'getshippingestimates');
  const productDetailsFormatted = await normalizeProductDetailObject(productDetails, productPrice, productReviews, productShippingEstimates);
  const productDescriptions = await extractProductDescriptionsFromBlock(block);
  console.log('productDetails');
  console.log(productDetails);
  block.innerHTML = '';
  await createGlobalContainer(block, productDetailsFormatted, productDescriptions);

  await toggleDrawer(block);
}
