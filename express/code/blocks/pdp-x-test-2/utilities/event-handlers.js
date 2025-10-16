import { fetchAPIData } from '../fetchData/fetchProductDetails.js';
import { formatPriceZazzle, formatDeliveryEstimateDateRange } from './utility-functions.js';

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

function calculateAdjustedPrices(productPriceAPIResponse) {
  const quantity = productPriceAPIResponse.discountProductItems[0].applyToQuantity || 1;
  const originalPrice = productPriceAPIResponse.discountProductItems[0].price;
  const { priceAdjusted } = productPriceAPIResponse.discountProductItems[0];
  const productPrice = priceAdjusted * quantity;
  const strikethroughPrice = originalPrice * quantity;
  return { productPrice, strikethroughPrice };
}

async function updateProductPrice(productId, parameters) {
  const productPriceAPIResponse = await fetchAPIData(productId, parameters, 'getproductpricing');
  if (productPriceAPIResponse.discountProductItems.length > 0) {
    const { discountString } = productPriceAPIResponse.discountProductItems[0];
    const { productPrice, strikethroughPrice } = calculateAdjustedPrices(productPriceAPIResponse);
    document.getElementById('pdpx-price-label').innerHTML = formatPriceZazzle(productPrice);
    document.getElementById('pdpx-compare-price-label').innerHTML = formatPriceZazzle(strikethroughPrice);
    document.getElementById('pdpx-savings-text').innerHTML = discountString;
  } else {
    const productPrice = productPriceAPIResponse.unitPrice;
    document.getElementById('pdpx-price-label').innerHTML = formatPriceZazzle(productPrice);
  }
}

async function updateProductImages(productId, parameters) {
  const renditions = await fetchAPIData(productId, parameters, 'getproductrenditions');
  const heroImg = document.getElementById('pdpx-product-hero-image');
  heroImg.src = renditions.realviewUrls[heroImg.dataset.imageType];
  const carouselImages = document.getElementsByClassName('pdpx-image-thumbnail-carousel-item-image');
  for (let i = 0; i < carouselImages.length; i += 1) {
    carouselImages[i].src = renditions.realviewUrls[carouselImages[i].dataset.imageType];
  }
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
  await updateProductPrice(productId, parameters);
  await updateProductImages(productId, parameters);
  await updateProductDeliveryEstimate(productId, parameters);
}
