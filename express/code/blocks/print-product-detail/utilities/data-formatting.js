import { formatProductDescriptions } from '../fetchData/fetchProductDetails.js';
import { formatPriceZazzle, formatPaperThickness, formatPaperWeight } from './utility-functions.js';

function buildImageUrl(realviewParams) {
  const params = new URLSearchParams();
  Object.entries(realviewParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.set(key, value);
    }
  });
  return `https://rlv.zcache.com/svc/view?${params.toString()}`;
}

async function convertAttributeToOptionsObject(productType, attribute) {
  const options = attribute.values;
  const optionsArray = [];
  for (let i = 0; i < options.length; i += 1) {
    let imageUrl;
    const option = options[i];
    if (productType === 'zazzle_businesscard' && attribute.name === 'media') {
      option.swatchParams.max_dim = '100';
      imageUrl = buildImageUrl(option.swatchParams);
    } else {
      option.firstProductRealviewParams.max_dim = '100';
      imageUrl = buildImageUrl(option.firstProductRealviewParams);
    }
    optionsArray.push({
      thumbnail: imageUrl,
      title: option.title,
      name: option.name,
      priceAdjustment: await formatPriceZazzle(option.priceDifferential, true),
      description: option.description,
    });
    if (productType === 'zazzle_businesscard' && attribute.name === 'media') {
      optionsArray[i].thickness = formatPaperThickness(option.properties.thickness);
      const { weight, gsm } = formatPaperWeight(option.properties.weight);
      optionsArray[i].weight = weight;
      optionsArray[i].gsm = gsm;
    }
    if (productType === 'zazzle_shirt' && attribute.name === 'color') {
      optionsArray[i].printingProcess = option.properties.tags?.includes('showswhite') ? 'vivid' : 'classic';
    }
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

export async function normalizeProductDetailObject({ productDetails, productPrice, productReviews, productRenditions, productShippingEstimates, quantity, templateId }) {
  const applicableDiscount = productPrice?.discountProductItems[1] || productPrice?.discountProductItems[0];
  const discountAvailable = !!applicableDiscount;
  const calculatedProductPrice = applicableDiscount?.priceAdjusted * quantity || productPrice?.unitPrice * quantity;
  const normalizedProductDetails = {
    id: productDetails.product.id,
    templateId,
    heroImage: productDetails.product.initialPrettyPreferredViewUrl,
    productTitle: productDetails.product.title,
    unitPrice: productPrice?.unitPrice,
    productPrice: calculatedProductPrice,
    strikethroughPrice: productPrice?.unitPrice * quantity,
    discountAvailable,
    discountString: applicableDiscount?.discountString,
    deliveryEstimateMinDate: productShippingEstimates.estimates[0].minDeliveryDate,
    deliveryEstimateMaxDate: productShippingEstimates.estimates[0].maxDeliveryDate,
    realViews: productRenditions.realviewUrls,
    productType: productDetails.product.productType,
    pluralUnitLabel: productDetails.product.pluralUnitLabel,
    averageRating: productReviews.reviews.stats.averageRating,
    totalReviews: productReviews.reviews.stats.totalReviews,
    productDescriptions: [],
    attributes: { quantities: productDetails.product.quantities },
  };
  for (const attribute of Object.values(productDetails.product.attributes)) {
    normalizedProductDetails.attributes[attribute.name] = await convertAttributeToOptionsObject(productDetails.product.productType, attribute);
  }
  const quantitiesOptions = formatQuantityOptionsObject(productDetails.product.quantities, productDetails.product.pluralUnitLabel);
  normalizedProductDetails.attributes.quantities = quantitiesOptions;
  return normalizedProductDetails;
}

export function createEmptyDataObject(templateId) {
  const emptyDataObject = {
    id: '',
    templateId,
    heroImage: '',
    productTitle: '',
    unitPrice: '',
    productPrice: '',
    strikethroughPrice: '',
    discountAvailable: '',
    discountString: '',
    deliveryEstimateStringText: '',
    deliveryEstimateMinDate: '',
    deliveryEstimateMaxDate: '',
    realViews: {},
    productType: 'default',
    pluralUnitLabel: '',
    averageRating: '',
    totalReviews: '',
    tooltipTitle: '',
    tooltipDescription1: '',
    tooltipDescription2: '',
    attributes: { quantities: [] },
    compareValueTooltipTitle: '',
    compareValueTooltipDescription1: '',
    compareValueTooltipDescription2: '',
    productDescriptions: [],
  };
  return emptyDataObject;
}

export async function updateDataObjectProductDetails(dataObject, productDetails) {
  dataObject.id = productDetails.product.id;
  dataObject.heroImage = productDetails.product.initialPrettyPreferredViewUrl;
  dataObject.productTitle = productDetails.product.title;
  dataObject.productType = productDetails.product.productType;
  const attributeOptions = productDetails.product.attributes;
  for (const attribute of Object.values(attributeOptions)) {
    dataObject.attributes[attribute.name] = await convertAttributeToOptionsObject(productDetails.product.productType, attribute);
  }
  const quantitiesOptions = formatQuantityOptionsObject(productDetails.product.quantities, productDetails.product.pluralUnitLabel);
  dataObject.attributes.quantities = quantitiesOptions;
  dataObject.productDescriptions = formatProductDescriptions(productDetails);
  return dataObject;
}

export function updateDataObjectProductPrice(dataObject, productPrice, quantity) {
  const applicableDiscount = productPrice?.discountProductItems[1] || productPrice?.discountProductItems[0];
  const discountAvailable = !!applicableDiscount;
  const calculatedProductPrice = applicableDiscount?.priceAdjusted * quantity || productPrice?.unitPrice * quantity;
  dataObject.productPrice = calculatedProductPrice;
  dataObject.strikethroughPrice = productPrice?.unitPrice * quantity;
  dataObject.discountAvailable = discountAvailable;
  dataObject.discountString = applicableDiscount?.discountString;
  return dataObject;
}

export function updateDataObjectProductShippingEstimates(dataObject, productShippingEstimates) {
  dataObject.deliveryEstimateMinDate = productShippingEstimates.estimates[0].minDeliveryDate;
  dataObject.deliveryEstimateMaxDate = productShippingEstimates.estimates[0].maxDeliveryDate;
  return dataObject;
}

export function updateDataObjectProductReviews(dataObject, productReviews) {
  dataObject.averageRating = productReviews.reviews.stats.averageRating;
  dataObject.totalReviews = productReviews.reviews.stats.totalReviews;
  return dataObject;
}

export function updateDataObjectProductRenditions(dataObject, productRenditions) {
  dataObject.realViews = productRenditions.realviewUrls;
  return dataObject;
}

export function updateDataObjectUIStrings(dataObject, UIStrings) {
  dataObject.compareValueTooltipTitle = UIStrings.adobe_compareValueTooltipTitle;
  dataObject.compareValueTooltipDescription1 = UIStrings.zi_product_Price_CompValueTooltip1Adobe;
  dataObject.compareValueTooltipDescription2 = UIStrings.zi_product_Price_CompValueTooltip2Adobe;
  dataObject.deliveryEstimateStringText = UIStrings.adobe_deliveryEstimateStringText;
  dataObject.compareValueInfoIconLabel = UIStrings.zi_product_Price_CompValue;
  return dataObject;
}
