import { getLibs } from '../../scripts/utils.js';
import { fetchAPIData, formatProductDescriptions } from './fetchData/fetchProductDetails.js';
import { extractProductId } from './utilities/utility-functions.js';
import { normalizeProductDetailObject } from './utilities/data-formatting.js';
import createProductInfoHeadingSection from './createComponents/createProductInfoHeadingSection.js';
import createProductImagesContainer from './createComponents/createProductImagesContainer.js';
import createCustomizationInputs from './createComponents/createCustomizationInputs.js';
import createProductDetailsSection, { createCheckoutButton } from './createComponents/createProductDetailsSection.js';
import createDrawer from './createComponents/createDrawer.js';

let createTag;

async function createProductInfoContainer(productDetails, productDescriptions, drawer) {
  const productInfoSectionWrapperContainer = createTag('div', { class: 'pdpx-product-info-section-wrapper-container' });
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
  productInfoSectionWrapper.appendChild(drawer);
  productInfoSectionWrapperContainer.appendChild(productInfoHeadingSection);
  productInfoSectionWrapperContainer.appendChild(productInfoSectionWrapper);
  return productInfoSectionWrapperContainer;
}

async function createGlobalContainer(block, productDetails, productDescriptions) {
  const globalContainer = createTag('div', { class: 'pdpx-global-container' });
  const { curtain, drawer } = await createDrawer(block);
  const productImagesContainer = await createProductImagesContainer(
    productDetails.realViews,
    productDetails.heroImage,
  );
  const productInfoSectionWrapper = await createProductInfoContainer(
    productDetails,
    productDescriptions,
    drawer,
  );
  globalContainer.appendChild(productImagesContainer);
  globalContainer.appendChild(productInfoSectionWrapper);
  block.appendChild(globalContainer);
  document.body.append(curtain);
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productId = extractProductId(block);

  // Fetch all API data in parallel
  const sampleShippingParameters = {
    zip: '94065',
    qty: 1,
  };

  const [
    productDetails,
    productPrice,
    productReviews,
    productRenditions,
    productShippingEstimates,
  ] = await Promise.all([
    fetchAPIData(productId, null, 'getproduct'),
    fetchAPIData(productId, null, 'getproductpricing'),
    fetchAPIData(productId, null, 'getreviews'),
    fetchAPIData(productId, null, 'getproductrenditions'),
    fetchAPIData(productId, sampleShippingParameters, 'getshippingestimates'),
  ]);

  // Process the data
  const productDetailsFormatted = await normalizeProductDetailObject(
    productDetails,
    productPrice,
    productReviews,
    productRenditions,
    productShippingEstimates,
    1,
  );
  const productDescriptions = formatProductDescriptions(productDetails);

  block.innerHTML = '';
  await createGlobalContainer(block, productDetailsFormatted, productDescriptions);
}
