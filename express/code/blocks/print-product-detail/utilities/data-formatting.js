import { fetchUIStrings, formatProductDescriptions } from '../fetchData/fetchProductDetails.js';
import { formatPriceZazzle, buildRealViewImageUrl } from './utility-functions.js';

export default function extractProductDescriptionsFromBlock(block) {
  const productDescriptions = [];
  const rows = block.querySelectorAll(':scope > div');
  rows.forEach((row) => {
    const columns = row.querySelectorAll(':scope > div');
    if (columns.length >= 2) {
      const title = columns[0].textContent.trim();
      const description = columns[1].innerHTML.trim();
      productDescriptions.push({ title, description });
    }
  });
  return productDescriptions;
}

export function createEmptyDataObject(templateId) {
  return {
    templateId,
    productTitle: '',
    productType: '',
    id: '',
    heroImage: '',
    productPrice: '—',
    strikethroughPrice: '—',
    discountString: '—',
    averageRating: 0,
    totalReviews: 0,
    deliveryEstimateMinDate: '',
    deliveryEstimateMaxDate: '',
    deliveryEstimateStringText: '',
    compareValueTooltipTitle: '',
    compareValueTooltipDescription1: '',
    compareValueTooltipDescription2: '',
    realViews: {},
    productDescriptions: [],
    attributes: {},
  };
}

export async function updateDataObjectProductDetails(dataObject, productDetails) {
  const updatedDataObject = { ...dataObject };
  const productTitle = productDetails.product.title;
  const { productType } = productDetails.product;
  const productId = productDetails.product.id;
  // Don't set heroImage here - it will be set when renditions API loads
  // Don't populate realViews here - that comes from the renditions API
  const productDescriptions = formatProductDescriptions(productDetails);

  // Extract attributes for customization inputs
  const attributes = {};
  Object.entries(productDetails.product.attributes).forEach(([key, attribute]) => {
    // Handle attributes with values array
    if (attribute.values && Array.isArray(attribute.values)) {
      attributes[key] = attribute.values.map((value) => {
        // Handle different value structures (some attributes have simpler structures)
        if (typeof value === 'object' && value !== null) {
          // Format price adjustment - check multiple possible sources
          let priceAdjustment = '';
          if (value.priceDifferential !== undefined && value.priceDifferential !== 0) {
            // Use priceDifferential if available and non-zero
            priceAdjustment = value.priceDifferential > 0 ? `+$${value.priceDifferential.toFixed(2)}` : `$${value.priceDifferential.toFixed(2)}`;
          } else if (value.price !== undefined && value.price !== 0) {
            // Use price if available and non-zero
            priceAdjustment = value.price > 0 ? `+$${value.price.toFixed(2)}` : `$${value.price.toFixed(2)}`;
          } else if (value.properties?.price !== undefined) {
            // Check properties.price as fallback
            const priceValue = parseFloat(value.properties.price);
            if (!isNaN(priceValue) && priceValue !== 0) {
              priceAdjustment = priceValue > 0 ? `+$${priceValue.toFixed(2)}` : `$${priceValue.toFixed(2)}`;
            }
          }

          // Generate thumbnail from realview params if available
          let thumbnail = value.thumbnailUrl || value.helpImageUrl || value.thumbnail || '';
          if (!thumbnail && value.firstProductRealviewParams) {
            // Generate thumbnail URL from realview params (smaller size for thumbnails)
            thumbnail = buildRealViewImageUrl(value.firstProductRealviewParams, 120);
          }

          const extracted = {
            name: value.name || value.value || String(value),
            title: value.title || value.titleLong || value.name || value.value || String(value),
            thumbnail,
            priceAdjustment,
            description: value.description || value.descriptionBrief || '',
            descriptionBrief: value.descriptionBrief || '',
            firstProductRealviewParams: value.firstProductRealviewParams || null,
            isBestValue: value.isBestValue || false,
          };
          return extracted;
        }
        // Handle primitive values (like numbers for quantities)
        return {
          name: String(value),
          title: String(value),
          thumbnail: '',
          priceAdjustment: '',
          description: '',
          descriptionBrief: '',
          firstProductRealviewParams: null,
          isBestValue: false,
        };
      });
    } else if (attribute.value !== undefined) {
      // Handle attributes with a single value property (not an array)
      // This might be for quantities or other single-value attributes
      const singleValue = attribute.value;
      if (Array.isArray(singleValue)) {
        attributes[key] = singleValue.map((val) => ({
          name: String(val),
          title: String(val),
          thumbnail: '',
          priceAdjustment: '',
          description: '',
          descriptionBrief: '',
          firstProductRealviewParams: null,
          isBestValue: false,
        }));
      } else {
        attributes[key] = [{
          name: String(singleValue),
          title: String(singleValue),
          thumbnail: '',
          priceAdjustment: '',
          description: '',
          descriptionBrief: '',
          firstProductRealviewParams: null,
          isBestValue: false,
        }];
      }
    }
  });

  // Add default quantities if not present in API
  if (!attributes.quantities) {
    attributes.quantities = [
      { name: '50', title: '50', thumbnail: '', priceAdjustment: '', description: '', descriptionBrief: '', firstProductRealviewParams: null, isBestValue: false },
      { name: '100', title: '100', thumbnail: '', priceAdjustment: '', description: '', descriptionBrief: '', firstProductRealviewParams: null, isBestValue: false },
      { name: '250', title: '250', thumbnail: '', priceAdjustment: '', description: '', descriptionBrief: '', firstProductRealviewParams: null, isBestValue: false },
      { name: '500', title: '500', thumbnail: '', priceAdjustment: '', description: '', descriptionBrief: '', firstProductRealviewParams: null, isBestValue: false },
    ];
  }

  updatedDataObject.productTitle = productTitle;
  updatedDataObject.productType = productType;
  updatedDataObject.id = productId;
  // heroImage will be set when renditions API loads
  // realViews will be set when renditions API loads
  updatedDataObject.productDescriptions = productDescriptions;
  updatedDataObject.attributes = attributes;
  return updatedDataObject;
}

export function updateDataObjectProductPrice(dataObject, productPrice) {
  const updatedDataObject = { ...dataObject };
  
  // API returns unitPrice and discountProductItems array
  const basePrice = productPrice.unitPrice || 0;
  const discountItem = productPrice.discountProductItems?.[0];
  
  if (discountItem) {
    // Use discounted price and original price
    updatedDataObject.productPrice = discountItem.priceAdjusted || discountItem.price || basePrice;
    updatedDataObject.strikethroughPrice = discountItem.price || basePrice;
    updatedDataObject.discountString = discountItem.discountString || '';
  } else {
    // No discount available
    updatedDataObject.productPrice = basePrice;
    updatedDataObject.strikethroughPrice = basePrice;
    updatedDataObject.discountString = '';
  }
  
  return updatedDataObject;
}

export function updateDataObjectProductShippingEstimates(dataObject, productShippingEstimates) {
  const updatedDataObject = { ...dataObject };
  if (productShippingEstimates?.shippingEstimates?.[0]) {
    const estimate = productShippingEstimates.shippingEstimates[0];
    updatedDataObject.deliveryEstimateMinDate = estimate.minDate;
    updatedDataObject.deliveryEstimateMaxDate = estimate.maxDate;
  }
  return updatedDataObject;
}

export function updateDataObjectProductReviews(dataObject, productReviews) {
  const updatedDataObject = { ...dataObject };
  updatedDataObject.averageRating = productReviews?.averageRating || 0;
  updatedDataObject.totalReviews = productReviews?.totalReviews || 0;
  return updatedDataObject;
}

export function updateDataObjectProductRenditions(dataObject, productRenditions) {
  const updatedDataObject = { ...dataObject };
  // API returns realviewUrls object, not renditions array
  if (productRenditions?.realviewUrls) {
    const realViews = productRenditions.realviewUrls;
    updatedDataObject.realViews = realViews;
    
    // Set heroImage to Front view, or first available view
    updatedDataObject.heroImage = realViews.Front || Object.values(realViews)[0] || '';
  }
  return updatedDataObject;
}

export function updateDataObjectUIStrings(dataObject, UIStrings) {
  const updatedDataObject = { ...dataObject };
  updatedDataObject.deliveryEstimateStringText = UIStrings.deliveryEstimateStringText;
  updatedDataObject.compareValueTooltipTitle = UIStrings.compareValueTooltipTitle;
  updatedDataObject.compareValueTooltipDescription1 = UIStrings.compareValueTooltipDescription1;
  updatedDataObject.compareValueTooltipDescription2 = UIStrings.compareValueTooltipDescription2;
  return updatedDataObject;
}

// OLD FUNCTION - Still used by event handlers
function buildImageUrl(realviewParams) {
  const params = new URLSearchParams();
  Object.entries(realviewParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.set(key, value);
    }
  });
  return `https://rlv.zcache.com/svc/view?${params.toString()}`;
}

async function convertAttributeToOptionsObject(attribute) {
  const options = attribute.values;
  const optionsArray = [];
  for (let i = 0; i < options.length; i += 1) {
    const option = options[i];
    const imageUrl = buildImageUrl(option.firstProductRealviewParams);
    optionsArray.push({
      thumbnail: imageUrl,
      title: option.title,
      name: option.name,
      priceAdjustment: await formatPriceZazzle(option.priceDifferential, true),
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

export async function normalizeProductDetailObject({ productDetails, productPrice, productReviews, productRenditions, productShippingEstimates, quantity, changeOptions = {}, templateId }) {
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
    realViews: productRenditions.realviewUrls || {},
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
    productDescriptions: formatProductDescriptions(productDetails, changeOptions),
    attributes: { quantities: productDetails.product.quantities },
  };
  for (const attribute of Object.values(attributeOptions)) {
    normalizedProductDetails.attributes[attribute.name] = await convertAttributeToOptionsObject(attribute);
  }
  const quantitiesOptions = formatQuantityOptionsObject(productDetails.product.quantities, productDetails.product.pluralUnitLabel);
  normalizedProductDetails.attributes.quantities = quantitiesOptions;
  return normalizedProductDetails;
}
