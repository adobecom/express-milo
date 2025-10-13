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

function addCornerStyleOptionsObject(productDetails, normalizedProductDetails) {
  const cornerStyleOptions = productDetails.product.attributes.cornerstyle.values;
  const newCornerStyleOptionsArray = [];
  for (let i = 0; i < cornerStyleOptions.length; i += 1) {
    const cornerStyleOption = cornerStyleOptions[i];
    const imageUrl = buildImageUrl(cornerStyleOption.firstProductRealviewParams);
    newCornerStyleOptionsArray.push({
      thumbnail: imageUrl,
      title: cornerStyleOption.title,
      name: cornerStyleOption.name,
      priceAdjustment: formatPriceAdjustment(cornerStyleOption.priceDifferential),
    });
  }
  normalizedProductDetails.cornerStyleOptions = newCornerStyleOptionsArray;
}

function addSizeOptionsObject(productDetails, normalizedProductDetails) {
  const sizeOptions = productDetails.product.attributes.style.values;
  const newSizeOptionsArray = [];
  for (let i = 0; i < sizeOptions.length; i += 1) {
    const sizeOption = sizeOptions[i];
    const imageUrl = buildImageUrl(sizeOption.firstProductRealviewParams);
    newSizeOptionsArray.push({
      thumbnail: imageUrl,
      title: sizeOption.title,
      name: sizeOption.name,
      priceAdjustment: formatPriceAdjustment(sizeOption.priceDifferential),
    });
  }
  normalizedProductDetails.sizeOptions = newSizeOptionsArray;
}

function addPaperTypeOptionsObject(productDetails, normalizedProductDetails) {
  const paperTypeOptions = productDetails.product.attributes.media.values;
  const newPaperTypeOptionsArray = [];
  for (let i = 0; i < paperTypeOptions.length; i += 1) {
    const paperTypeOption = paperTypeOptions[i];
    const imageUrl = buildImageUrl(paperTypeOption.firstProductRealviewParams);
    newPaperTypeOptionsArray.push({
      thumbnail: imageUrl,
      title: paperTypeOption.title,
      name: paperTypeOption.name,
      priceAdjustment: formatPriceAdjustment(paperTypeOption.priceDifferential, true),
    });
  }
  normalizedProductDetails.paperTypeOptions = newPaperTypeOptionsArray;
}

export function formatStringSnakeCase(string) {
  // remove special characters except for spaces
  string = string.replace(/[^a-zA-Z0-9\s]/g, '');
  return string.trim().toLowerCase().replace(/ /g, '_');
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
    sideQuantityptions: [
      {
        thumbnail: 'https://placehold.co/54',
        title: 'Double-sided',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/54',
        title: 'Single-sided',
        priceAdjustment: '-US$5.95',
      },
    ],
    paperTypeOptions: [
      {
        thumbnail: 'https://placehold.co/48',
        title: 'Standard Matte',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        title: 'Standard Gloss',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        title: 'Paper Type 3',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        title: 'Paper Type 4',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        title: 'Paper Type 5',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        title: 'Paper Type 6',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        title: 'Paper Type 7',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        title: 'Paper Type 8',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        title: 'Paper Type 9',
        priceAdjustment: '+$0.00',
      },
    ],
  };
  addCornerStyleOptionsObject(productDetails, normalizedProductDetails);
  addSizeOptionsObject(productDetails, normalizedProductDetails);
  addPaperTypeOptionsObject(productDetails, normalizedProductDetails);
  return normalizedProductDetails;
}
