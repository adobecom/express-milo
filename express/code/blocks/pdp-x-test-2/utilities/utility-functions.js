import fetchAPIData, { formatUrlForEnvironment } from '../fetchData/fetchProductDetails.js';

export async function extractProductId(block) {
  const templateId = block.children[0].children[1].textContent;

  const url = `https://www.zazzle.com/svc/partner/adobeexpress/v1/getproductfromtemplate?templateID=${templateId}`;
  const productIdAPICall = await fetch(formatUrlForEnvironment(url));
  const productIdAPICallJSON = await productIdAPICall.json();

  const productId = productIdAPICallJSON.data.product.id;

  // FOR DEVELOPMENT PURPOSES ONLY, REMOVE IN PRODUCTION
  const urlParams = new URLSearchParams(window.location.search);
  const productIdURL = urlParams.get('productId');
  const productIdFinal = productIdURL || productId;
  return productIdFinal;
}

export function formatDeliveryEstimateDateRange(minDate, maxDate) {
  const options = { month: 'short', day: 'numeric' };
  const minFormatted = new Date(minDate).toLocaleDateString('en-US', options);
  const maxFormatted = new Date(maxDate).toLocaleDateString('en-US', options);
  return `${minFormatted} - ${maxFormatted}`;
}

export function buildRealViewImageUrl(realviewParams, maxDim = 644) {
  const params = new URLSearchParams();
  Object.entries(realviewParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.set(key, value);
    }
  });
  params.set('max_dim', maxDim);
  return `https://rlv.zcache.com/svc/view?${params.toString()}`;
}

export function formatLargeNumberToK(totalReviews) {
  if (totalReviews > 1000) {
    const hundreds = Math.round((totalReviews % 1000) / 100);
    if (hundreds === 0) {
      return `${Math.round(totalReviews / 1000)}k`;
    }
    return `${Math.round(totalReviews / 1000)}.${Math.round((totalReviews % 1000) / 100)}k`;
  }
  return totalReviews;
}

export function formatPriceZazzle(price, differential = false, short = false) {
  let countryCode;
  let currencyCode;
  let priceDifferentialOperator;
  const urlParams = new URLSearchParams(window.location.search);
  const region = urlParams.get('region');
  if (region === 'uk') {
    countryCode = 'en-GB';
    currencyCode = 'GBP';
  } else {
    countryCode = 'en-US';
    currencyCode = 'USD';
  }
  const localizedPrice = new Intl.NumberFormat(countryCode, { style: 'currency', currency: currencyCode }).format(price);
  if (differential) {
    priceDifferentialOperator = price >= 0 ? '+' : '';
  } else {
    priceDifferentialOperator = '';
  }
  const formattedPrice = priceDifferentialOperator + localizedPrice;
  return formattedPrice;
}

export function formatStringSnakeCase(string) {
  const normalizedString = string.replace(/[^a-zA-Z0-9\s]/g, '_');
  const formattedString = normalizedString.trim().toLowerCase().replace(/ /g, '_');
  return formattedString;
}
