import { formatProductDescriptions } from '../fetchData/fetchProductDetails.js';
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
  
  // Null check for productDetails
  if (!productDetails || !productDetails.product) {
    console.error('[updateDataObjectProductDetails] Invalid productDetails:', productDetails);
    return updatedDataObject;
  }
  
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

  // Extract help links from pbjOverrides (for "Learn More" links)
  const attributeHelpLinks = {};
  if (productDetails.product.pbjOverrides?.attributeGroups) {
    productDetails.product.pbjOverrides.attributeGroups.forEach((group) => {
      group.attributes?.forEach((attr) => {
        if (attr.helpLink && attr.name) {
          attributeHelpLinks[attr.name] = {
            type: attr.helpLink.type,
            label: attr.helpLink.label,
            dialogType: attr.helpLink.dialogType,
            helpSlug: attr.helpLink.helpSlug,
          };
        }
      });
    });
  }

  updatedDataObject.productTitle = productTitle;
  updatedDataObject.productType = productType;
  updatedDataObject.id = productId;
  // heroImage will be set when renditions API loads
  // realViews will be set when renditions API loads
  updatedDataObject.productDescriptions = productDescriptions;
  updatedDataObject.attributes = attributes;
  updatedDataObject.attributeHelpLinks = attributeHelpLinks;
  updatedDataObject.pbjOverrides = productDetails.product.pbjOverrides || {};
  updatedDataObject.dbStrings = productDetails.entities?.dbStrings || {};
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

export async function normalizeProductDetailObject({
  productDetails,
  productPrice,
  productReviews,
  productRenditions,
  productShippingEstimates,
  changeOptions = {},
  templateId,
  quantity = 1,
}) {
  const productTitle = productDetails.product.title;
  const { productType } = productDetails.product;
  const productId = productDetails.product.id;
  const heroImage = productDetails.product.attributes?.media?.values?.[0]?.firstProductRealviewParams
    ? buildRealViewImageUrl(productDetails.product.attributes.media.values[0].firstProductRealviewParams)
    : productDetails.product.initialPrettyPreferredViewUrl || '';
  const realViews = productRenditions?.realviewUrls || {};
  
  // Handle productPrice structure (unitPrice and discountProductItems)
  const basePrice = productPrice?.unitPrice || 0;
  const discountItem = productPrice?.discountProductItems?.[0];
  let productPriceFormatted = '';
  let strikethroughPrice = '';
  let discountString = '';
  
  if (discountItem) {
    // Use discounted price and original price
    const adjustedPrice = discountItem.priceAdjusted || discountItem.price || basePrice;
    const originalPrice = discountItem.price || basePrice;
    productPriceFormatted = await formatPriceZazzle(adjustedPrice * quantity);
    strikethroughPrice = await formatPriceZazzle(originalPrice * quantity);
    discountString = discountItem.discountString || '';
  } else if (basePrice > 0) {
    // No discount available
    productPriceFormatted = await formatPriceZazzle(basePrice * quantity);
    strikethroughPrice = await formatPriceZazzle(basePrice * quantity);
  }
  const { averageRating = 0 } = productReviews || {};
  const { totalReviews = 0 } = productReviews || {};
  const deliveryEstimateMinDate = productShippingEstimates?.shippingEstimates?.[0]?.minDate || '';
  const deliveryEstimateMaxDate = productShippingEstimates?.shippingEstimates?.[0]?.maxDate || '';
  const productDescriptions = formatProductDescriptions(productDetails, changeOptions);

  // Extract attributes in the same format as formatInitialProductDetailObject
  const attributes = {};
  Object.entries(productDetails.product.attributes || {}).forEach(([key, attribute]) => {
    if (attribute.values && Array.isArray(attribute.values)) {
      attributes[key] = attribute.values.map((value) => {
        // Generate thumbnail from realview params if not provided
        let thumbnail = value.thumbnailUrl || value.helpImageUrl || value.thumbnail || '';
        if (!thumbnail && value.firstProductRealviewParams) {
          thumbnail = buildRealViewImageUrl(value.firstProductRealviewParams, 120);
        }

        return {
          name: value.name || value.value || String(value),
          title: value.title || value.name || String(value),
          thumbnail,
          priceAdjustment: value.priceAdjustment || '',
          description: value.description || '',
          descriptionBrief: value.descriptionBrief || '',
          firstProductRealviewParams: value.firstProductRealviewParams || null,
          isBestValue: value.isBestValue || false,
        };
      });
    }
  });

  // Add quantities from product.quantities array
  if (productDetails.product.quantities && Array.isArray(productDetails.product.quantities)) {
    attributes.quantities = productDetails.product.quantities.map((qty) => ({
      name: String(qty),
      title: String(qty),
      thumbnail: '',
      priceAdjustment: '',
      description: '',
      descriptionBrief: '',
      firstProductRealviewParams: null,
      isBestValue: false,
    }));
  }

  return {
    templateId,
    productType,
    id: productId,
    productTitle,
    heroImage,
    realViews,
    productPrice: productPriceFormatted,
    strikethroughPrice,
    discountString,
    averageRating,
    totalReviews,
    deliveryEstimateMinDate,
    deliveryEstimateMaxDate,
    productDescriptions,
    attributes,
  };
}
