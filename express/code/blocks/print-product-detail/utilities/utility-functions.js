import { createTag } from '../../../scripts/utils.js';
import { formatUrlForEnvironment } from '../fetchData/fetchProductDetails.js';

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

export function getRegion() {
  let region;
  const urlParams = new URLSearchParams(window.location.search);
  const htmlElement = document.querySelector('html');
  const regionURL = urlParams.get('region');
  if (regionURL) {
    region = regionURL;
  } else {
    region = htmlElement.lang;
  }
  return region;
}

export function exchangeRegionForTopLevelDomain(region) {
  if (region === 'en-GB') {
    return 'co.uk';
  }
  return 'com';
}
export function exchangeRegionForCurrencyCode(region) {
  let countryCode;
  let currencyCode;
  if (region === 'en-GB') {
    countryCode = 'en-GB';
    currencyCode = 'GBP';
  } else {
    countryCode = 'en-US';
    currencyCode = 'USD';
  }
  return { countryCode, currencyCode };
}

export function formatPriceZazzle(price, differential = false) {
  let priceDifferentialOperator;
  const region = getRegion();
  const { countryCode, currencyCode } = exchangeRegionForCurrencyCode(region);
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

export function addPrefetchLinks() {
  const region = getRegion();
  const topLevelDomain = exchangeRegionForTopLevelDomain(region);
  const prefetchLink1 = createTag('link', {
    rel: 'dns-prefetch',
    href: `https://www.zazzle.${topLevelDomain}`,
  });
  const prefetchLink2 = createTag('link', {
    rel: 'dns-prefetch',
    href: `https://rlv.zcache.${topLevelDomain}`,
  });

  const preconnectLink1 = createTag('link', {
    rel: 'preconnect',
    href: `https://www.zazzle.${topLevelDomain}`,
  });
  const preconnectLink2 = createTag('link', {
    rel: 'preconnect',
    href: `https://www.zazzle.${topLevelDomain}`,
  });
  document.head.appendChild(prefetchLink1);
  document.head.appendChild(prefetchLink2);
  document.head.appendChild(preconnectLink1);
  document.head.appendChild(preconnectLink2);
}
