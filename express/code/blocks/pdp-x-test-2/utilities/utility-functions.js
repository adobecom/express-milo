import fetchAPIData from '../fetchData/fetchProductDetails.js';

export function extractProductId(block) {
  const productIdBlock = block.children[0].children[1].textContent;
  // FOR DEVELOPMENT PURPOSES ONLY, REMOVE IN PRODUCTION
  const urlParams = new URLSearchParams(window.location.search);
  const productIdURL = urlParams.get('productId');
  const productId = productIdURL || productIdBlock;
  return productId;
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
  // Override max_dim if specified
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

function buildImageUrl(realviewParams) {
  const params = new URLSearchParams();
  Object.entries(realviewParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.set(key, value);
    }
  });
  return `https://rlv.zcache.com/svc/view?${params.toString()}`;
}

export function formatPriceZazzle(price, differential = false, short = false) {
  const region = 'en-US';
  let priceDifferentialOperator;
  const priceNumberFormatted = parseFloat(price).toLocaleString(region, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (differential) {
    priceDifferentialOperator = price >= 0 ? '+' : '-';
  } else {
    priceDifferentialOperator = '';
  }
  const currencySymbol = short ? '$' : 'US$';
  const priceFormatted = priceDifferentialOperator + currencySymbol + priceNumberFormatted;
  return priceFormatted;
}

export function formatStringSnakeCase(string) {
  const normalizedString = string.replace(/[^a-zA-Z0-9\s]/g, '_');
  const formattedString = normalizedString.trim().toLowerCase().replace(/ /g, '_');
  return formattedString;
}

function convertAttributeToOptionsObject(attribute) {
  const options = attribute.values;
  const optionsArray = [];
  for (let i = 0; i < options.length; i += 1) {
    const option = options[i];
    const imageUrl = buildImageUrl(option.firstProductRealviewParams);
    optionsArray.push({
      thumbnail: imageUrl,
      title: option.title,
      name: option.name,
      priceAdjustment: formatPriceZazzle(option.priceDifferential, true),
    });
  }
  return optionsArray;
}
function formatQuantityOptionsObject(quantities, pluralUnitLabel) {
  const optionsArray = [];
  for (let i = 0; i < quantities.length; i += 1) {
    const option = quantities[i];
    optionsArray.push({
      title: `${option} ${pluralUnitLabel}`,
      name: option,
    });
  }
  return optionsArray;
}

async function addSideQuantityOptions(productDetails) {
  const sideQuantityOptions = [];
  // get renditions for product thumbnails
  // check the product type, add different options for each product type
  const productRenditions = await fetchAPIData(productDetails.product.id, {}, 'getproductrenditions');
  if (productDetails.product.productType === 'zazzle_businesscard') {
    sideQuantityOptions.push({
      title: 'Double-sided',
      name: 'double-sided',
      thumbnail: productRenditions.realviewUrls['Front/Back'],
      priceAdjustment: formatPriceZazzle('5.95', true),
    });
    sideQuantityOptions.push({
      title: 'Single-sided',
      name: 'single-sided',
      thumbnail: productRenditions.realviewUrls.Front,
      priceAdjustment: formatPriceZazzle('0', true),
    });
  }
  return sideQuantityOptions;
}

export async function normalizeProductDetailObject(productDetails, productPrice, productReviews, productShippingEstimates) {
  const normalizedProductDetails = {
    id: productDetails.product.id,
    heroImage: productDetails.product.initialPrettyPreferredViewUrl,
    productTitle: productDetails.product.title,
    price: productPrice.discountProductItems[0] ? productPrice.discountProductItems[0].priceAdjusted : productPrice.unitPrice,
    strikethroughPrice: productPrice.discountProductItems[0] ? productPrice.discountProductItems[0].price : 0,
    discountString: productPrice.discountProductItems[0] ? productPrice.discountProductItems[0].discountString : 0,
    deliveryEstimateStringText: 'Order today and get it by',
    deliveryEstimateMinDate: productShippingEstimates.estimates[0].minDeliveryDate,
    deliveryEstimateMaxDate: productShippingEstimates.estimates[0].maxDeliveryDate,
    realviews: productDetails.product.realviews,
    productType: productDetails.product.productType,
    quantities: productDetails.product.quantities,
    pluralUnitLabel: productDetails.product.pluralUnitLabel,
    averageRating: productReviews.reviews.stats.averageRating,
    totalReviews: productReviews.reviews.stats.totalReviews,
  };
  for (const attribute of Object.values(productDetails.product.attributes)) {
    normalizedProductDetails[attribute.name] = convertAttributeToOptionsObject(attribute);
  }
  const quantitiesOptions = formatQuantityOptionsObject(productDetails.product.quantities, productDetails.product.pluralUnitLabel);
  normalizedProductDetails.quantities = quantitiesOptions;
  const sideQuantityOptions = await addSideQuantityOptions(productDetails);
  normalizedProductDetails.sideQuantityOptions = sideQuantityOptions;
  console.log('normalizedProductDetails');
  console.log(normalizedProductDetails);
  return normalizedProductDetails;
}
