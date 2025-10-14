import { extractProductDescriptionsFromBlock } from '../utilities/utility-functions.js';

function formatUrlForEnvironment(url) {
  if (url.startsWith('/')) {
    return url;
  }
  if (window.location.hostname === 'localhost') {
    return `http://localhost:3001?url=${url}`;
  }
  return url;
}

export async function formatProductDescriptions(block) {
  const productDescriptions = extractProductDescriptionsFromBlock(block);
  return productDescriptions;
}

export async function fetchAPIData(productId, parameters, endpoint) {
  let apiDataFetch;
  let parametersString;
  let url;
  if (parameters) {
    parametersString = Object.entries(parameters).map(([key, value]) => `${key}=${value}`).join('&');
  } else {
    parametersString = '';
  }
  url = `https://www.zazzle.com/svc/partner/adobeexpress/v1/${endpoint}?productId=${productId}&${parametersString}`;
  if (endpoint === 'getshippingestimates') {
    url = '/express/code/blocks/pdp-x-test-2/sample_data/getShippingEstimate.json';
  }
  try {
    apiDataFetch = await fetch(formatUrlForEnvironment(url));
  } catch (error) {
    console.info(error);
  }
  const apiDataJSON = await apiDataFetch.json();
  const apiData = apiDataJSON.data;
  return apiData;
}
