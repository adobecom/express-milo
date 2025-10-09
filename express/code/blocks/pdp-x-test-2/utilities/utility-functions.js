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
    productType: productDetails.product.productType,
    quantities: productDetails.product.quantities,
    pluralUnitLabel: productDetails.product.pluralUnitLabel,
    sideQuantityptions: [
      {
        thumbnail: 'https://placehold.co/54',
        name: 'Double-sided',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/54',
        name: 'Single-sided',
        priceAdjustment: '-US$5.95',
      },
    ],
    cornerStyleOptions: [
      {
        thumbnail: 'https://placehold.co/54',
        name: 'Squared',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/54',
        name: 'Rounded',
        priceAdjustment: '+US$0.00',
      },
    ],
    sizeOptions: [
      {
        thumbnail: 'https://placehold.co/54',
        name: '3.5"x2"',
      },
      {
        thumbnail: 'https://placehold.co/54',
        name: '2"x3.5"',
      },
      {
        thumbnail: 'https://placehold.co/54',
        name: '2.5"x2.5"',
      },
    ],
    paperTypeOptions: [
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Standard Matte',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Standard Gloss',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Paper Type 3',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Paper Type 4',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Paper Type 5',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Paper Type 6',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Paper Type 7',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Paper Type 8',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Paper Type 9',
        priceAdjustment: '+$0.00',
      },
    ],
  };
  return normalizedProductDetails;
}
