import { getLibs } from '../../scripts/utils.js';
import fetchAPIData, { fetchProductDetails } from './fetchData/fetchProductDetails.js';
import extractProductDescriptionsFromBlock, { normalizeProductDetailObject, createEmptyDataObject, updateDataObjectProductDetails } from './utilities/data-formatting.js';
import createProductInfoHeadingSection from './createComponents/createProductInfoHeadingSection.js';
import createProductImagesContainer, { createProductThumbnailCarousel } from './createComponents/createProductImagesContainer.js';
import createCustomizationInputs, { createBusinessCardInputs, createTShirtInputs } from './createComponents/createCustomizationInputs.js';
import createProductDetailsSection, { createCheckoutButton } from './createComponents/createProductDetailsSection.js';
import createDrawer from './createComponents/createDrawer.js';
import { addPrefetchLinks } from './utilities/utility-functions.js';

let createTag;

async function createProductInfoContainer(productDetails, drawer) {
  const productInfoSectionWrapperContainer = createTag('div', { class: 'pdpx-product-info-section-wrapper-container' });
  const productInfoSectionWrapper = createTag('div', { class: 'pdpx-product-info-section-wrapper' });
  const productInfoContainer = createTag('div', { class: 'pdpx-product-info-container', id: 'pdpx-product-info-container' });
  const productInfoHeadingSection = await createProductInfoHeadingSection(productDetails);
  productInfoContainer.appendChild(productInfoHeadingSection);
  // const customizationInputs = await createCustomizationInputs(productDetails);
  // productInfoContainer.appendChild(customizationInputs);
  // const productDetailsSection = await createProductDetailsSection(productDescriptions);
  // productInfoContainer.appendChild(productDetailsSection);
  productInfoSectionWrapper.appendChild(productInfoContainer);
  const checkoutButton = await createCheckoutButton(productDetails);
  productInfoSectionWrapper.appendChild(checkoutButton);
  productInfoSectionWrapper.appendChild(drawer);
  productInfoSectionWrapperContainer.appendChild(productInfoHeadingSection);
  productInfoSectionWrapperContainer.appendChild(productInfoSectionWrapper);
  return productInfoSectionWrapperContainer;
}

async function createGlobalContainer(productDetails) {
  const globalContainer = createTag('div', { class: 'pdpx-global-container', 'data-template-id': productDetails.templateId });
  const { curtain, drawer } = await createDrawer(productDetails);
  const productImagesContainer = await createProductImagesContainer(productDetails.realViews, productDetails.heroImage);
  const productInfoSectionWrapper = await createProductInfoContainer(productDetails, drawer);
  globalContainer.appendChild(productImagesContainer);
  globalContainer.appendChild(productInfoSectionWrapper);
  document.body.append(curtain);
  return globalContainer;
}

function createCheckoutButtonParameters(formDataObject) {
  const parameters = {};
  const productSettingsString = Object.entries(formDataObject).map(([key, value]) => `${key}=${value}`).join('&');
  // productSettingsString = encodeURIComponent(productSettingsString);
  parameters.productSettings = productSettingsString;
  parameters.action = 'print-null-now';
  parameters.loadPrintAddon = 'true';
  parameters.mv = '1';
  parameters.referrer = 'a.com-print-and-deliver-seo';
  parameters.sdid = 'MH16S6M4';
  return parameters;
}

function createCheckoutButtonHref(templateId, parameters) {
  const parametersString = Object.entries(parameters).map(([key, value]) => `${key}=${value}`).join('&');
  const encodedParametersString = encodeURIComponent(parametersString);
  const checkoutButtonHref = `https://new.express.adobe.com/design/template/${templateId}?${encodedParametersString}`;
  return checkoutButtonHref;
}

async function updatePageWithProductDetails(productDetails) {
  const productTitle = document.getElementById('pdpx-product-title');
  productTitle.textContent = productDetails.productTitle;
  productTitle.removeAttribute('data-skeleton');
  const productHeroImage = document.getElementById('pdpx-product-hero-image');
  productHeroImage.src = productDetails.heroImage;
  productHeroImage.removeAttribute('data-skeleton');
  const customizationInputs = await createCustomizationInputs(productDetails);
  const productInfoContainer = document.getElementById('pdpx-product-info-container');
  productInfoContainer.appendChild(customizationInputs);
  const form = document.getElementById('pdpx-customization-inputs-form');
  const formData = new FormData(form);
  const formDataObject = Object.fromEntries(formData.entries());
  const checkoutButton = document.getElementById('pdpx-checkout-button');
  const checkoutButtonParameters = createCheckoutButtonParameters(formDataObject);
  const checkoutButtonHref = createCheckoutButtonHref(productDetails.templateId, checkoutButtonParameters);
  checkoutButton.href = checkoutButtonHref;
  const returnObject = { checkoutButtonParameters };
  return returnObject;
}

function updatePageWithProductImages(productDetails) {
  const imageThumbnailCarouselContainer = document.getElementById('pdpx-image-thumbnail-carousel-container');
  const heroProductImage = document.getElementById('pdpx-product-hero-image');
  imageThumbnailCarouselContainer.removeAttribute('data-skeleton');
  const newImageThumbnailCarouselContainer = createProductThumbnailCarousel(productDetails.realViews, 'Front', heroProductImage);
  imageThumbnailCarouselContainer.appendChild(newImageThumbnailCarouselContainer);
  return imageThumbnailCarouselContainer;
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  addPrefetchLinks();
  const templateId = block.children[0].children[1].textContent;
  let productId;
  let dataObject = createEmptyDataObject(templateId);
  block.innerHTML = '';
  const globalContainer = await createGlobalContainer(dataObject);
  block.appendChild(globalContainer);
  const productDetails = fetchProductDetails(templateId);
  productDetails.then((productDetailsResponse) => {
    dataObject = updateDataObjectProductDetails(dataObject, productDetailsResponse);
    const updatedPageResponse = updatePageWithProductDetails(dataObject);
    productId = productDetailsResponse.product.id;

    const productRenditions = fetchAPIData(productId, null, 'getproductrenditions');
    productRenditions.then((productRenditionsResponse) => {
      dataObject.realViews = productRenditionsResponse.realviewUrls;
      updatePageWithProductImages(dataObject);
    });
    const productPrice = fetchAPIData(productId, null, 'getproductpricing');
    const productReviews = fetchAPIData(productId, null, 'getreviews');
    const quantity = 1;
    // const sampleShippingParameters = { qty: quantity };
    const sampleShippingParameters = updatedPageResponse.checkoutButtonParameters;

    const productShippingEstimates = fetchAPIData(productId, sampleShippingParameters, 'getshippingestimates');
  });
}
