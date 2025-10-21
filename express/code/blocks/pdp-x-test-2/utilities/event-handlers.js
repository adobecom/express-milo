import fetchAPIData from '../fetchData/fetchProductDetails.js';
import { formatPriceZazzle, formatDeliveryEstimateDateRange, normalizeProductDetailObject } from './utility-functions.js';
import createProductImagesContainer from '../createComponents/createProductImagesContainer.js';
import createCustomizationInputs from '../createComponents/createCustomizationInputs.js';

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
    if (key !== 'qty') {
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

function calculateAdjustedPrices(productDetails) {
  const productPrice = productDetails?.priceAdjusted * productDetails?.applyToQuantity;
  const strikethroughPrice = productDetails?.unitPrice * productDetails?.applyToQuantity;

  return { productPrice, strikethroughPrice };
}

async function updateProductPrice(productDetails) {
  if (productDetails.discountAvailable) {
    const { productPrice, strikethroughPrice } = calculateAdjustedPrices(productDetails);
    document.getElementById('pdpx-price-label').innerHTML = formatPriceZazzle(productPrice);
    document.getElementById('pdpx-compare-price-label').innerHTML = formatPriceZazzle(strikethroughPrice);
    document.getElementById('pdpx-savings-text').innerHTML = productDetails.discountString;
  } else {
    const productPrice = productDetails.unitPrice;
    document.getElementById('pdpx-price-label').innerHTML = formatPriceZazzle(productPrice);
  }
}

async function updateProductImages(productDetails) {
  const heroImg = document.getElementById('pdpx-product-hero-image');
  const newHeroImgSrc = productDetails[heroImg.dataset.imageType] || productDetails?.Front || Object.keys(productDetails)[0];
  const newProductImagesContainer = await createProductImagesContainer(productDetails, newHeroImgSrc, heroImg.dataset.imageType);
  document.getElementById('pdpx-product-images-container').replaceWith(newProductImagesContainer);
}

async function updateCustomizationOptions(productId, parameters) {
  const options = await fetchAPIData(productId, parameters, 'getproduct');
  const newCustomizationInputs = await createCustomizationInputs(options);
  document.getElementById('pdpx-customization-inputs-container').replaceWith(newCustomizationInputs);
}

async function updateProductDeliveryEstimate(productId, parameters) {
  const shippingEstimates = await fetchAPIData(productId, parameters, 'getshippingestimates');
  document.getElementById('pdpx-delivery-estimate-pill-date').innerHTML = formatDeliveryEstimateDateRange(shippingEstimates.estimates[0].minDeliveryDate, shippingEstimates.estimates[0].maxDeliveryDate);
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
  const normalizedProductDetails = await normalizeProductDetailObject(productDetails, productPrice, productReviews, productRenditions, productShippingEstimates);
  await updateProductPrice(normalizedProductDetails);
  // await updateProductImages(normalizedProductDetails);
  // await updateProductDeliveryEstimate(normalizedProductDetails);
  // await updateCustomizationOptions(normalizedProductDetails);
}
