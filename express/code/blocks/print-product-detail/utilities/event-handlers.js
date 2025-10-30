import fetchAPIData from '../fetchData/fetchProductDetails.js';
import { formatPriceZazzle, formatDeliveryEstimateDateRange } from './utility-functions.js';
import { normalizeProductDetailObject } from './data-formatting.js';
import createProductImagesContainer from '../createComponents/createProductImagesContainer.js';
import createCustomizationInputs from '../createComponents/createCustomizationInputs.js';
import BlockMediator from '../../../scripts/block-mediator.min.js';
import createDrawerContentSizeChart, { createDrawerContentPrintingProcess } from '../createComponents/createDrawerContent.js';

export async function toggleDrawer(drawerType) {
  const curtain = document.querySelector('.pdp-curtain');
  const drawer = document.querySelector('.drawer');
  if (drawerType === 'sizeChart') {
    const sizeChartContent = await createDrawerContentSizeChart();
    drawer.appendChild(sizeChartContent);
  } else if (drawerType === 'printingProcess') {
    const printingProcessContent = await createDrawerContentPrintingProcess();
    drawer.appendChild(printingProcessContent);
  }
  document.body.classList.toggle('disable-scroll');
  curtain.classList.toggle('hidden');
  drawer.classList.toggle('hidden');
}

function formatProductOptionsToAPIParameters(formDataObject) {
  const parameters = {};
  for (const [key, value] of Object.entries(formDataObject)) {
    if (key !== 'qty') {
      parameters[key] = value;
    }
  }
  parameters.productOptions = Object.entries(parameters).map(([key, value]) => `${key}=${value}`).join('&');
  parameters.qty = formDataObject.qty;
  const finalParameters = {};
  finalParameters.productOptions = encodeURIComponent(parameters.productOptions);
  finalParameters.qty = parameters.qty;
  return finalParameters;
}

async function updateProductPrice(productDetails) {
  if (productDetails.discountAvailable) {
    document.getElementById('pdpx-price-label').innerHTML = await formatPriceZazzle(productDetails.productPrice);
    document.getElementById('pdpx-compare-price-label').innerHTML = await formatPriceZazzle(productDetails.strikethroughPrice);
    document.getElementById('pdpx-savings-text').innerHTML = productDetails.discountString;
  } else {
    const productPrice = productDetails.unitPrice;
    document.getElementById('pdpx-price-label').innerHTML = await formatPriceZazzle(productPrice);
  }
}

async function updateProductImages(productDetails) {
  const heroImg = document.getElementById('pdpx-product-hero-image');
  const firstImageType = Object.keys(productDetails.realViews)[0];
  let imageType;
  if (productDetails.realViews[heroImg.dataset.imageType]) {
    imageType = heroImg.dataset.imageType;
  } else {
    imageType = firstImageType;
  }
  const newHeroImgSrc = productDetails.realViews[imageType];
  const newProductImagesContainer = await createProductImagesContainer(
    productDetails.realViews,
    newHeroImgSrc,
    imageType,
  );
  document.getElementById('pdpx-product-images-container').replaceWith(newProductImagesContainer);
  newProductImagesContainer.querySelector('#pdpx-image-thumbnail-carousel-container').dataset.skeleton = 'false';
}

async function updateProductDeliveryEstimate(productDetails) {
  document.getElementById('pdpx-delivery-estimate-pill-date').innerHTML = formatDeliveryEstimateDateRange(productDetails.deliveryEstimateMinDate, productDetails.deliveryEstimateMaxDate);
}

async function updateCustomizationOptions(productDetails, formDataObject) {
  // Retrieve drawer references from global container
  const globalContainer = document.querySelector('.pdpx-global-container');
  const comparisonDrawer = globalContainer?.comparisonDrawer || null;
  const sizeChartDrawer = globalContainer?.sizeChartDrawer || null;
  const paperDrawer = globalContainer?.paperDrawer || null;

  // Restore pbjOverrides and dbStrings if they're missing from the API response
  if (!productDetails.pbjOverrides && globalContainer?.pbjOverrides) {
    productDetails.pbjOverrides = globalContainer.pbjOverrides;
  }
  if (!productDetails.dbStrings && globalContainer?.dbStrings) {
    productDetails.dbStrings = globalContainer.dbStrings;
  }

  const newCustomizationInputs = await createCustomizationInputs(
    productDetails,
    formDataObject,
    comparisonDrawer,
    sizeChartDrawer,
    paperDrawer,
  );
  document.getElementById('pdpx-customization-inputs-container').replaceWith(newCustomizationInputs);
}

async function updateCheckoutButton(productDetails) {
  const checkoutButton = document.getElementById('pdpx-checkout-button');
  const urlbase = 'https://new.express.adobe.com/design/template/';
  checkoutButton.href = `${urlbase}${productDetails.templateId}`;
}

function createUpdatedSelectedValuesObject(updatedConfigurationOptions, formDataObject, quantity) {
  const selectedValuesObject = {};
  for (const [key, value] of Object.entries(updatedConfigurationOptions.product.attributes)) {
    const valueName = value.values.find((v) => v.name === formDataObject[key]);
    if (valueName) {
      selectedValuesObject[key] = valueName.name;
    } else {
      selectedValuesObject[key] = value.values[0].name;
    }
  }
  selectedValuesObject.qty = quantity;
  return selectedValuesObject;
}

export default async function updateAllDynamicElements(productId) {
  const { templateId } = document.querySelector('.pdpx-global-container').dataset;
  const form = document.querySelector('#pdpx-customization-inputs-form');
  const formData = new FormData(form);
  const formDataObject = Object.fromEntries(formData.entries());
  const quantity = formDataObject.qty;
  const parameters = formatProductOptionsToAPIParameters(formDataObject);
  const updatedConfigurationOptions = await fetchAPIData(
    productId,
    parameters,
    'changeoptions',
  );
  const updatedSelectedValuesObject = createUpdatedSelectedValuesObject(
    updatedConfigurationOptions,
    formDataObject,
    quantity,
  );
  const updatedParameters = formatProductOptionsToAPIParameters(updatedSelectedValuesObject);
  const [productDetails, productPrice, productReviews, productRenditions, productShippingEstimates] = await Promise.all([
    fetchAPIData(productId, updatedParameters, 'getproduct'),
    fetchAPIData(productId, updatedParameters, 'getproductpricing'),
    fetchAPIData(productId, null, 'getreviews'),
    fetchAPIData(productId, updatedParameters, 'getproductrenditions'),
    fetchAPIData(productId, updatedParameters, 'getshippingestimates'),
  ]);
  const normalizeProductDetailsParametersObject = {
    productDetails: updatedConfigurationOptions,
    productPrice,
    productReviews,
    productRenditions,
    productShippingEstimates,
    quantity,
    templateId,
  };
  const normalizedProductDetails = await normalizeProductDetailObject(normalizeProductDetailsParametersObject);
  await updateCheckoutButton(normalizedProductDetails);
  await updateProductImages(normalizedProductDetails);
  await updateCustomizationOptions(normalizedProductDetails, formDataObject);
  await updateProductPrice(normalizedProductDetails);
  await updateProductDeliveryEstimate(normalizedProductDetails);
  // Publish to BlockMediator to trigger accordion updates
  BlockMediator.set('product:updated', {
    productDetails,
    formData: formDataObject,
  });
}
