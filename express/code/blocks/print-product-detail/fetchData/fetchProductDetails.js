import { getRegion, exchangeRegionForTopLevelDomain } from '../utilities/utility-functions.js';

export function formatUrlForEnvironment(url) {
  if (window.location.hostname === 'localhost') {
    return `http://localhost:3001?url=${url}`;
  }
  const URLFormatted = url;
  return URLFormatted;
}

export async function fetchProductDetails(templateId) {
  const region = getRegion();
  const topLevelDomain = exchangeRegionForTopLevelDomain(region);
  const url = `https://www.zazzle.${topLevelDomain}/svc/partner/adobeexpress/v1/getproductfromtemplate?templateId=${templateId}`;
  const productIdAPICall = await fetch(formatUrlForEnvironment(url));
  const productIdAPICallJSON = await productIdAPICall.json();
  const productDetails = productIdAPICallJSON.data;
  return productDetails;
}

export default async function fetchAPIData(productId, parameters, endpoint) {
  let apiDataFetch;
  let parametersString;
  const region = getRegion();
  const topLevelDomain = exchangeRegionForTopLevelDomain(region);
  if (parameters) {
    parametersString = Object.entries(parameters).map(([key, value]) => `${key}=${value}`).join('&');
  } else {
    parametersString = '';
  }
  const url = `https://www.zazzle.${topLevelDomain}/svc/partner/adobeexpress/v1/${endpoint}?productId=${productId}&${parametersString}`;
  try {
    apiDataFetch = await fetch(formatUrlForEnvironment(url));
  } catch (error) {
    console.info(error);
  }
  const apiDataJSON = await apiDataFetch.json();
  const apiData = apiDataJSON.data;
  return apiData;
}
export async function fetchUIStrings() {
  const apiDataFetch = await fetch('/express/code/blocks/print-product-detail/sample_data/UIStrings.json');
  const apiDataJSON = await apiDataFetch.json();
  return apiDataJSON;
}
