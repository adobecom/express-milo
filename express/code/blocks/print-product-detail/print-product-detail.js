import { getLibs } from '../../scripts/utils.js';
import fetchAPIData, { fetchProductDetails, fetchUIStrings } from './fetchData/fetchProductDetails.js';
import { createEmptyDataObject, updateDataObjectProductDetails, updateDataObjectProductPrice, updateDataObjectProductShippingEstimates, updateDataObjectProductReviews, updateDataObjectProductRenditions, updateDataObjectUIStrings } from './utilities/data-formatting.js';
import createProductInfoHeadingSection from './createComponents/createProductInfoHeadingSection.js';
import createProductImagesContainer, { createProductThumbnailCarousel } from './createComponents/createProductImagesContainer.js';
import createCustomizationInputs from './createComponents/customizationInputs/createCustomizationInputs.js';
import createProductDetailsSection, { createCheckoutButton } from './createComponents/createProductDetailsSection.js';
import createDrawer from './createComponents/createDrawer.js';
import { addPrefetchLinks, formatDeliveryEstimateDateRange, formatLargeNumberToK, formatPriceZazzle, extractTemplateId } from './utilities/utility-functions.js';

let createTag;

async function createProductInfoContainer(productDetails, drawer) {
  const productInfoSectionContainer = createTag('div', { class: 'pdpx-product-info-section-container' });
  const productInfoSection = createTag('div', { class: 'pdpx-product-info-section', id: 'pdpx-product-info-section' });
  const productInfoHeadingSection = await createProductInfoHeadingSection(productDetails);
  const checkoutButton = await createCheckoutButton(productDetails);
  productInfoSectionContainer.appendChild(drawer);
  productInfoSectionContainer.appendChild(productInfoHeadingSection);
  productInfoSectionContainer.appendChild(productInfoSection);
  productInfoSectionContainer.appendChild(checkoutButton);
  return productInfoSectionContainer;
}

async function createGlobalContainer(productDetails) {
  const globalContainer = createTag('div', { class: 'pdpx-global-container', 'data-template-id': productDetails.templateId });
  const { curtain, drawer } = await createDrawer(productDetails);
  const productImagesContainer = await createProductImagesContainer(productDetails.realViews, productDetails.heroImage);
  const productInfoSection = await createProductInfoContainer(productDetails, drawer);
  globalContainer.appendChild(productImagesContainer);
  globalContainer.appendChild(productInfoSection);
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
  const productInfoSection = document.getElementById('pdpx-product-info-section');
  const customizationInputs = await createCustomizationInputs(productDetails);
  productInfoSection.appendChild(customizationInputs);
  const productDetailsSection = await createProductDetailsSection(productDetails.productDescriptions);
  productInfoSection.appendChild(productDetailsSection);
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
  const newImageThumbnailCarouselContainer = createProductThumbnailCarousel(productDetails.realViews, 'Front', heroProductImage);
  imageThumbnailCarouselContainer.appendChild(newImageThumbnailCarouselContainer);
  imageThumbnailCarouselContainer.removeAttribute('data-skeleton');
  newImageThumbnailCarouselContainer.removeAttribute('data-skeleton');
  return imageThumbnailCarouselContainer;
}

async function updatePageWithProductPrice(productDetails) {
  const priceLabel = document.getElementById('pdpx-price-label');
  const comparePriceLabel = document.getElementById('pdpx-compare-price-label');
  const savingsText = document.getElementById('pdpx-savings-text');
  priceLabel.textContent = await formatPriceZazzle(productDetails.productPrice);
  comparePriceLabel.textContent = await formatPriceZazzle(productDetails.strikethroughPrice);
  savingsText.textContent = productDetails.discountString;
}

function updatePageWithProductReviews(productDetails) {
  const ratingsNumber = document.getElementById('pdpx-ratings-number');
  ratingsNumber.textContent = Math.round(productDetails.averageRating * 10) / 10;
  const ratingsAmount = document.getElementById('pdpx-ratings-amount');
  ratingsAmount.textContent = formatLargeNumberToK(productDetails.totalReviews);
}

function updatePageWithProductShippingEstimates(productDetails) {
  const deliveryEstimateDateRange = formatDeliveryEstimateDateRange(productDetails.deliveryEstimateMinDate, productDetails.deliveryEstimateMaxDate);
  const deliveryEstimatePillDate = document.getElementById('pdpx-delivery-estimate-pill-date');
  deliveryEstimatePillDate.textContent = deliveryEstimateDateRange;
}

function updatePageWithUIStrings(productDetails) {
  const deliveryEstimatePillText = document.getElementById('pdpx-delivery-estimate-pill-text');
  deliveryEstimatePillText.textContent = productDetails.deliveryEstimateStringText;
  const compareValueTooltipTitle = document.getElementById('pdpx-info-tooltip-content-title');
  compareValueTooltipTitle.textContent = productDetails.compareValueTooltipTitle;
  const compareValueTooltipDescription1 = document.getElementById('pdpx-info-tooltip-content-description-1');
  compareValueTooltipDescription1.textContent = productDetails.compareValueTooltipDescription1;
  const compareValueTooltipDescription2 = document.getElementById('pdpx-info-tooltip-content-description-2');
  compareValueTooltipDescription2.textContent = productDetails.compareValueTooltipDescription2;
  document.getElementById('pdpx-compare-price-info-label').textContent = productDetails.compareValueInfoIconLabel;
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  addPrefetchLinks();
  const templateId = extractTemplateId(block);
  let productId;
  let dataObject = createEmptyDataObject(templateId);
  block.innerHTML = '';
  const globalContainer = await createGlobalContainer(dataObject);
  block.appendChild(globalContainer);
  const productDetails = fetchProductDetails(templateId);
  productDetails.then(async (productDetailsResponse) => {
    dataObject = await updateDataObjectProductDetails(dataObject, productDetailsResponse);
    updatePageWithProductDetails(dataObject);
    productId = productDetailsResponse.product.id;
    const productRenditions = fetchAPIData(productId, null, 'getproductrenditions');
    productRenditions.then((productRenditionsResponse) => {
      dataObject = updateDataObjectProductRenditions(dataObject, productRenditionsResponse);
      updatePageWithProductImages(dataObject);
    });
    const quantity = 1;
    const productPrice = fetchAPIData(productId, null, 'getproductpricing');
    productPrice.then(async (productPriceResponse) => {
      dataObject = updateDataObjectProductPrice(dataObject, productPriceResponse, quantity);
      await updatePageWithProductPrice(dataObject);
    });
    const productReviews = fetchAPIData(productId, null, 'getreviews');
    productReviews.then((productReviewsResponse) => {
      dataObject = updateDataObjectProductReviews(dataObject, productReviewsResponse);
      updatePageWithProductReviews(dataObject);
    });

    const sampleShippingParameters = { qty: quantity };
    const productShippingEstimates = fetchAPIData(productId, sampleShippingParameters, 'getshippingestimates');
    productShippingEstimates.then((productShippingEstimatesResponse) => {
      dataObject = updateDataObjectProductShippingEstimates(dataObject, productShippingEstimatesResponse);
      updatePageWithProductShippingEstimates(dataObject);
    });

    const UIStrings = fetchUIStrings();
    UIStrings.then((UIStringsResponse) => {
      dataObject = updateDataObjectUIStrings(dataObject, UIStringsResponse);
      updatePageWithUIStrings(dataObject);
    });
  });
}
