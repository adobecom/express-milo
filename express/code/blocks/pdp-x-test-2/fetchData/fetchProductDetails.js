import { extractProductDescriptionsFromBlock } from '../utilities/utility-functions.js';

export async function fetchProductDetails(productId) {
  let productDetailsFetch;
  productDetailsFetch = await fetch(`https://www.zazzle.com/svc/partner/adobeexpress/v1/getproduct?productId=${productId}`);
  /*
  try {
    productDetailsFetch = await fetch(`https://www.zazzle.com/svc/partner/adobeexpress/v1/getproduct?productId=${productId}`);
  } catch (error) {
    debugger;
    productDetailsFetch = await fetch('/express/code/blocks/pdp-x-test-2/sample_data/getProduct22.json');
  }
  */
  const productDetailsJSON = await productDetailsFetch.json();
  const productDetails = productDetailsJSON.data;
  return productDetails;
}

export async function fetchProductDetailsChangeOptions(productId) {
  let productDetailsFetch;
  try {
    productDetailsFetch = await fetch(`https://www.zazzle.com/svc/partner/adobeexpress/v1/changeoptions?productId=${productId}`);
  } catch (error) {
    productDetailsFetch = await fetch('/express/code/blocks/pdp-x-test-2/sample_data/getProduct.json');
  }
  const productDetailsJSON = await productDetailsFetch.json();
  const productDetails = productDetailsJSON.data;
  return productDetails;
}

export async function fetchProductPrice(productId) {
  let productPriceFetch;
  try {
    productPriceFetch = await fetch(`https://www.zazzle.com/svc/partner/adobeexpress/v1/getproductpricepricing?productId=${productId}`);
  } catch (error) {
    productPriceFetch = await fetch('/express/code/blocks/pdp-x-test-2/sample_data/getProductPrice.json');
  }
  const productPriceJSON = await productPriceFetch.json();
  const productPrice = productPriceJSON.data;
  return productPrice;
}

export async function fetchProductReviews(productId) {
  let productPriceFetch;
  try {
    productPriceFetch = await fetch(`https://www.zazzle.com/svc/partner/adobeexpress/v1/getreviews?productId=${productId}`);
  } catch (error) {
    productPriceFetch = await fetch('/express/code/blocks/pdp-x-test-2/sample_data/getReviews.json');
  }
  const productPriceJSON = await productPriceFetch.json();
  const productPrice = productPriceJSON.data;
  return productPrice;
}

export async function fetchProductShippingEstimates(productId, zip, qty) {
  let productShippingEstimatesFetch;
  try {
    productShippingEstimatesFetch = await fetch(`https://www.zazzle.com/svc/partner/adobeexpress/v1/getshippingestimates?productId=${productId}&zip=${zip}&qty=${qty}`);
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
