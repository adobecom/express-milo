import { fetchUIStrings, formatProductDescriptions } from '../fetchData/fetchProductDetails.js';
import { formatPriceZazzle } from './utility-functions.js';

function buildImageUrl(realviewParams) {
  const params = new URLSearchParams();
  Object.entries(realviewParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.set(key, value);
    }
  });
  return `https://rlv.zcache.com/svc/view?${params.toString()}`;
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

export async function normalizeProductDetailObject(productDetails, productPrice, productReviews, productRenditions, productShippingEstimates, quantity, changeOptions = {}, templateId) {
  const UIStrings = await fetchUIStrings();
  const attributeOptions = changeOptions?.product?.attributes || productDetails.product.attributes;
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
    tooltipTitle: UIStrings.adobe_comp_value_tooltip_title,
    tooltipDescription1: UIStrings.zi_product_Price_CompValueTooltip1Adobe,
    tooltipDescription2: UIStrings.zi_product_Price_CompValueTooltip2Adobe,
    compareValueTooltipTitle: UIStrings.adobe_compareValueTooltipTitle,
    compareValueTooltipDescription1: UIStrings.zi_product_Price_CompValueTooltip1Adobe,
    compareValueTooltipDescription2: UIStrings.zi_product_Price_CompValueTooltip2Adobe,
    deliveryEstimateStringText: UIStrings.adobe_deliveryEstimateStringText,
    productDescriptions: [],
    attributes: { quantities: productDetails.product.quantities },
  };
  for (const attribute of Object.values(attributeOptions)) {
    normalizedProductDetails.attributes[attribute.name] = convertAttributeToOptionsObject(attribute);
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

export function updateDataObjectProductDetails(dataObject, productDetails) {
  dataObject.id = productDetails.product.id;
  dataObject.heroImage = productDetails.product.initialPrettyPreferredViewUrl;
  dataObject.productTitle = productDetails.product.title;
  dataObject.productType = productDetails.product.productType;
  const attributeOptions = productDetails.product.attributes;
  for (const attribute of Object.values(attributeOptions)) {
    dataObject.attributes[attribute.name] = convertAttributeToOptionsObject(attribute);
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
  return dataObject;
}
