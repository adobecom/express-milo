export function extractProductId(block) {
  const productIdBlock = block.children[0].children[1].textContent;
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
  console.log('realviewParams', realviewParams);
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

export function extractProductDescriptionsFromBlock(block) {
  const productDescriptions = [];
  const childDivs = Array.from(block.children);
  let startIndex = -1;
  let endIndex = -1;
  // Find the start marker (div with child div containing 'productDetails')
  for (let i = 0; i < childDivs.length; i += 1) {
    const firstChild = childDivs[i].firstElementChild;
    if (firstChild && firstChild.textContent.trim() === 'productDetails') {
      startIndex = i;
      break;
    }
  }
  // Find the end marker (div with child div containing 'endProductDetails')
  for (let i = 0; i < childDivs.length; i += 1) {
    const firstChild = childDivs[i].firstElementChild;
    if (firstChild && firstChild.textContent.trim() === 'endProductDetails') {
      endIndex = i;
      break;
    }
  }
  // Extract all divs between the markers
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    for (let i = startIndex + 1; i < endIndex; i += 1) {
      const div = childDivs[i];
      const children = Array.from(div.children);

      if (children.length >= 2) {
        const title = children[0].textContent.trim();
        const description = children[1].textContent.trim();
        productDescriptions.push({
          title,
          description,
          element: div,
        });
      }
    }
  }
  return productDescriptions;
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

function formatPriceAdjustment(priceAdjustment, short = false) {
  const priceAdjustmentOperator = priceAdjustment >= 0 ? '+' : '-';
  const currencySymbol = short ? '$' : 'US$';
  const priceAdjustmentFormatted = priceAdjustmentOperator + currencySymbol + priceAdjustment.toFixed(2);
  return priceAdjustmentFormatted;
}

export function formatStringSnakeCase(string) {
  const normalizedString = string.replace(/[^a-zA-Z0-9\s]/g, '');
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
      priceAdjustment: formatPriceAdjustment(option.priceDifferential),
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

export function normalizeProductDetailObject(productDetails, productPrice, productReviews, productShippingEstimates) {
  const normalizedProductDetails = {
    heroImage: productDetails.product.initialPrettyPreferredViewUrl,
    productTitle: productDetails.product.title,
    price: productPrice.unitPrice,
    deliveryEstimateStringText: 'Order today and get it by',
    deliveryEstimateMinDate: productShippingEstimates.estimates[0].minDeliveryDate,
    deliveryEstimateMaxDate: productShippingEstimates.estimates[0].maxDeliveryDate,
    realviews: productDetails.product.realviews,
    productType: productDetails.product.productType,
    quantities: productDetails.product.quantities,
    pluralUnitLabel: productDetails.product.pluralUnitLabel,
    averageRating: productReviews.reviews.stats.averageRating,
    totaltReviews: productReviews.reviews.stats.totalReviews,
  };
  for (const attribute of Object.values(productDetails.product.attributes)) {
    normalizedProductDetails[attribute.name] = convertAttributeToOptionsObject(attribute);
  }
  const quantitiesOptions = formatQuantityOptionsObject(productDetails.product.quantities, productDetails.product.pluralUnitLabel);
  normalizedProductDetails.quantities = quantitiesOptions;
  return normalizedProductDetails;
}
