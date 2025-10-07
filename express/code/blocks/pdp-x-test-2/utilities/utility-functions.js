export function extractProductId(block) {
  return block.children[0].children[1].textContent;
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

export function normalizeProductDetailObject(productDetails, productPrice, productShippingEstimates) {
  const normalizedProductDetails = {
    heroImage: productDetails.product.initialPrettyPreferredViewUrl,
    productTitle: productDetails.product.title,
    price: productPrice.unitPrice,
    deliveryEstimateStringText: 'Order today and get it by',
    deliveryEstimateMinDate: productShippingEstimates.estimates[0].minDeliveryDate,
    deliveryEstimateMaxDate: productShippingEstimates.estimates[0].maxDeliveryDate,
    realviews: productDetails.product.realviews,
  };
  return normalizedProductDetails;
}
