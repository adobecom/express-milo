import fetchAPIData from '../fetchData/fetchProductDetails.js';
import { formatPriceZazzle, formatDeliveryEstimateDateRange } from './utility-functions.js';
import { normalizeProductDetailObject } from './data-formatting.js';
import createProductImagesContainer from '../createComponents/createProductImagesContainer.js';
import createCustomizationInputs from '../createComponents/createCustomizationInputs.js';
import BlockMediator from '../../../scripts/block-mediator.min.js';

export function toggleDrawer() {
  const curtain = document.querySelector('.pdp-curtain');
  const drawer = document.querySelector('.drawer');
  document.body.classList.toggle('disable-scroll');
  curtain.classList.toggle('hidden');
  drawer.classList.toggle('hidden');
}

function formatProductOptionsToAPIParameters(formDataObject) {
  const parameters = {};
  for (const [key, value] of Object.entries(formDataObject)) {
    if (key !== 'qty' && key !== 'printingprocess') {
      parameters[key] = value;
    }
  }
  parameters.productOptions = Object.entries(parameters).map(([key, value]) => `${key}=${value}`).join('&');
  parameters.qty = formDataObject.qty;
  parameters.zip = '94065';
  const finalParameters = {};
  finalParameters.productOptions = encodeURIComponent(parameters.productOptions);
  finalParameters.qty = parameters.qty;
  return finalParameters;
}

async function updateProductPrice(productDetails) {
  if (productDetails.discountAvailable) {
    document.getElementById('pdpx-price-label').innerHTML = formatPriceZazzle(productDetails.productPrice);
    document.getElementById('pdpx-compare-price-label').innerHTML = formatPriceZazzle(productDetails.strikethroughPrice);
    document.getElementById('pdpx-savings-text').innerHTML = productDetails.discountString;
  } else {
    const productPrice = productDetails.unitPrice;
    document.getElementById('pdpx-price-label').innerHTML = formatPriceZazzle(productPrice);
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
}

async function updateProductDeliveryEstimate(productDetails) {
  document.getElementById('pdpx-delivery-estimate-pill-date').innerHTML = formatDeliveryEstimateDateRange(productDetails.deliveryEstimateMinDate, productDetails.deliveryEstimateMaxDate);
}

async function updateCustomizationOptions(productDetails, formDataObject) {
  // Retrieve existing drawer references before replacing the form
  const existingCompareLink = document.querySelector('.pdpx-pill-selector-label-compare-link');
  const comparisonDrawer = existingCompareLink?.drawerRef || null;
  const existingSizeChartLink = document.querySelector('.pdpx-size-chart-link');
  const sizeChartDrawer = existingSizeChartLink?.drawerRef || null;

  // For paper drawer, check if it exists in the DOM
  const existingPaperLink = document.querySelector('.pdpx-pill-selector-label-compare-link[data-drawer-type="paper"]');
  let paperDrawer = existingPaperLink?.drawerRef || null;

  // If not found via link, try to find the drawer directly in the DOM
  if (!paperDrawer) {
    const paperDrawerElement = document.querySelector('.drawer-body--paper-selection')?.parentElement;
    const paperCurtain = document.querySelector('.pdp-curtain');
    if (paperDrawerElement && paperCurtain) {
      paperDrawer = { drawer: paperDrawerElement, curtain: paperCurtain };
    }
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

export default async function updateAllDynamicElements(productId) {
  const form = document.querySelector('#pdpx-customization-inputs-form');
  const formData = new FormData(form);
  const formDataObject = Object.fromEntries(formData.entries());
  const parameters = formatProductOptionsToAPIParameters(formDataObject);
  const productDetails = await fetchAPIData(productId, parameters, 'getproduct');
  const productPrice = await fetchAPIData(productId, parameters, 'getproductpricing');
  const productReviews = await fetchAPIData(productId, null, 'getreviews');
  const productRenditions = await fetchAPIData(productId, parameters, 'getproductrenditions');
  const productShippingEstimates = await fetchAPIData(productId, parameters, 'getshippingestimates');
  const updatedConfigurationOptions = await fetchAPIData(productId, parameters, 'changeoptions');
  const normalizedProductDetails = await normalizeProductDetailObject(
    productDetails,
    productPrice,
    productReviews,
    productRenditions,
    productShippingEstimates,
    formDataObject.qty,
    updatedConfigurationOptions,
    formDataObject.printingprocess,
  );
  await updateProductPrice(normalizedProductDetails);
  await updateProductImages(normalizedProductDetails);
  await updateProductDeliveryEstimate(normalizedProductDetails);
  await updateCustomizationOptions(normalizedProductDetails, formDataObject);

  // Publish to BlockMediator to trigger accordion updates
  BlockMediator.set('product:updated', {
    productDetails,
    formData: formDataObject,
  });
}
