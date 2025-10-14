import { extractProductDescriptionsFromBlock } from '../utilities/utility-functions.js';

function formatUrlForEnvironment(url) {
  if (window.location.hostname === 'localhost') {
    return `http://localhost:3001?url=${url}`;
  }
  return url;
}
export async function fetchProductDetails(productId) {
  let productDetailsFetch;
  const url = `https://www.zazzle.com/svc/partner/adobeexpress/v1/getproduct?productId=${productId}`;
  try {
    productDetailsFetch = await fetch(formatUrlForEnvironment(url));
  } catch (error) {
    productDetailsFetch = await fetch('/express/code/blocks/pdp-x-test-2/sample_data/getProduct.json');
  }
  const productDetailsJSON = await productDetailsFetch.json();
  const productDetails = productDetailsJSON.data;
  return productDetails;
}

export async function fetchProductDetailsChangeOptions(productId, parameters) {
  let productDetailsFetch;
  let parametersString;
  if (parameters) {
    parametersString = Object.entries(parameters).map(([key, value]) => `${key}=${value}`).join('&');
  } else {
    parametersString = '';
  }
  const url = `https://www.zazzle.com/svc/partner/adobeexpress/v1/changeoptions?productId=${productId}&${parametersString}`;
  try {
    productDetailsFetch = await fetch(formatUrlForEnvironment(url));
  } catch (error) {
    productDetailsFetch = await fetch('/express/code/blocks/pdp-x-test-2/sample_data/getProduct.json');
  }
  const productDetailsJSON = await productDetailsFetch.json();
  const productDetails = productDetailsJSON.data;
  return productDetails;
}

export async function fetchProductPrice(productId, parameters) {
  let productPriceFetch;
  let parametersString;
  if (parameters) {
    parametersString = Object.entries(parameters).map(([key, value]) => `${key}=${value}`).join('&');
  } else {
    parametersString = '';
  }
  const url = `https://www.zazzle.com/svc/partner/adobeexpress/v1/getproductpricing?productId=${productId}&${parametersString}`;
  try {
    productPriceFetch = await fetch(formatUrlForEnvironment(url));
  } catch (error) {
    productPriceFetch = await fetch('/express/code/blocks/pdp-x-test-2/sample_data/getProductPrice.json');
  }
  const productPriceJSON = await productPriceFetch.json();
  const productPrice = productPriceJSON.data;
  return productPrice;
}

export async function fetchProductReviews(productId, parameters) {
  let productPriceFetch;
  let parametersString;
  if (parameters) {
    parametersString = Object.entries(parameters).map(([key, value]) => `${key}=${value}`).join('&');
  } else {
    parametersString = '';
  }

  const url = `https://www.zazzle.com/svc/partner/adobeexpress/v1/getreviews?productId=${productId}&${parametersString}`;
  try {
    productPriceFetch = await fetch(formatUrlForEnvironment(url));
  } catch (error) {
    productPriceFetch = await fetch('/express/code/blocks/pdp-x-test-2/sample_data/getReviews.json');
  }
  const productPriceJSON = await productPriceFetch.json();
  const productPrice = productPriceJSON.data;
  return productPrice;
}

export async function fetchProductShippingEstimates(productId, parameters) {
  let productShippingEstimatesFetch;
  let parametersString;
  if (parameters) {
    parametersString = Object.entries(parameters).map(([key, value]) => `${key}=${value}`).join('&');
  } else {
    parametersString = '';
  }
  const url = `https://www.zazzle.com/svc/partner/adobeexpress/v1/getshippingestimates?productId=${productId}&${parametersString}`;
  try {
    productShippingEstimatesFetch = await fetch(formatUrlForEnvironment(url));
  } catch (error) {
    productShippingEstimatesFetch = await fetch('/express/code/blocks/pdp-x-test-2/sample_data/getShippingEstimate.json');
  }
  const productShippingEstimatesJSON = await productShippingEstimatesFetch.json();
  const productShippingEstimates = productShippingEstimatesJSON.data;
  return productShippingEstimates;
}

export async function formatProductDescriptions(block) {
  const productDescriptions = extractProductDescriptionsFromBlock(block);
  return productDescriptions;
}
