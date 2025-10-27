import { getRegion, exchangeRegionForTopLevelDomain } from '../utilities/utility-functions.js';

export function formatProductDescriptions(productDetails, selectedOptions = {}) {
  const productDescriptions = [];

  const attributes = productDetails.product?.attributes;

  if (!attributes) {
    return productDescriptions;
  }

  Object.values(attributes).forEach((attribute) => {
    const { title } = attribute;
    const attributeName = attribute.name;

    let selectedValue = null;

    if (selectedOptions[attributeName] && attribute.values) {
      selectedValue = attribute.values.find((v) => v.name === selectedOptions[attributeName]);
    }
    if (!selectedValue && attribute.value && attribute.values) {
      selectedValue = attribute.values.find((v) => v.name === attribute.value);
    }
    if (!selectedValue && attribute.bestValue && attribute.values) {
      selectedValue = attribute.values.find((v) => v.name === attribute.bestValue);
    }
    if (!selectedValue && attribute.values) {
      [selectedValue] = attribute.values;
    }

    if (!title || !selectedValue) {
      return;
    }

    let description = selectedValue.descriptionShort
      || selectedValue.description
      || selectedValue.descriptionBrief
      || selectedValue.title
      || selectedValue.titleLong
      || '';

    if (description && description.includes('<')) {
      description = description
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, '')
        .replace(/<ul>/g, '<ul class="pdpx-details-list">')
        .replace(/<li>/g, '<li class="pdpx-details-list-item">')
        .replace(/\r\n/g, '')
        .trim();
    }

    if (title && description) {
      productDescriptions.push({ title, description });
    }
  });

  return productDescriptions;
}

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
    // eslint-disable-next-line no-console
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
