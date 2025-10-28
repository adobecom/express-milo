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
  const productTitle = productDetails.product.title;
  const { productType } = productDetails.product;
  const productId = productDetails.product.id;
  const heroImage = buildRealViewImageUrl(
    productDetails.product.attributes.media.values[0].firstProductRealviewParams,
  );
  // Convert realViews array to object with viewName as key and viewUrl as value
  const realViews = {};
  productDetails.product.attributes.media.values.forEach((view) => {
    realViews[view.title] = buildRealViewImageUrl(view.firstProductRealviewParams);
  });
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
  updatedDataObject.heroImage = heroImage;
  updatedDataObject.realViews = realViews;
  updatedDataObject.productDescriptions = productDescriptions;
  updatedDataObject.attributes = attributes;
  return updatedDataObject;
}

export function updateDataObjectProductPrice(dataObject, productPrice) {
  const updatedDataObject = { ...dataObject };
  updatedDataObject.productPrice = productPrice.price;
  updatedDataObject.strikethroughPrice = productPrice.compareAtPrice;
  const discountPercentage = Math.round(
    ((productPrice.compareAtPrice - productPrice.price) / productPrice.compareAtPrice) * 100,
  );
  updatedDataObject.discountString = `Save ${discountPercentage}%`;
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
  updatedDataObject.averageRating = productReviews.averageRating;
  updatedDataObject.totalReviews = productReviews.totalReviews;
  return updatedDataObject;
}

export function updateDataObjectProductRenditions(dataObject, productRenditions) {
  const updatedDataObject = { ...dataObject };
  if (productRenditions?.renditions) {
    // Convert renditions array to object with viewName as key and url as value
    const realViews = {};
    productRenditions.renditions.forEach((rendition) => {
      realViews[rendition.viewName] = rendition.url;
    });
    updatedDataObject.realViews = realViews;
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
}) {
  const productTitle = productDetails.product.title;
  const { productType } = productDetails.product;
  const productId = productDetails.product.id;
  const heroImage = buildRealViewImageUrl(
    productDetails.product.attributes.media.values[0].firstProductRealviewParams,
  );
  const realViews = productRenditions.renditions.map((rendition) => ({
    viewName: rendition.viewName,
    viewUrl: rendition.url,
  }));
  const productPriceFormatted = await formatPriceZazzle(productPrice.price);
  const strikethroughPrice = await formatPriceZazzle(productPrice.compareAtPrice);
  const discountPercentage = Math.round(
    ((productPrice.compareAtPrice - productPrice.price) / productPrice.compareAtPrice) * 100,
  );
  const discountString = `Save ${discountPercentage}%`;
  const { averageRating } = productReviews;
  const { totalReviews } = productReviews;
  const deliveryEstimateMinDate = productShippingEstimates.shippingEstimates[0].minDate;
  const deliveryEstimateMaxDate = productShippingEstimates.shippingEstimates[0].maxDate;
  const productDescriptions = formatProductDescriptions(productDetails, changeOptions);

  const media = productDetails.product.attributes.media.values.map((paper) => ({
    name: paper.name,
    title: paper.title,
    thumbnail: paper.thumbnailUrl,
    priceAdjustment: paper.priceAdjustment,
  }));

  const style = productDetails.product.attributes.style?.values.map((size) => ({
    name: size.name,
    title: size.title,
    priceAdjustment: size.priceAdjustment,
  }));

  const printingProcessOptions = productDetails.product.attributes.printingprocess?.values.map(
    (process) => ({
      name: process.name,
      title: process.title,
      priceAdjustment: process.priceAdjustment,
    }),
  );

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
    media,
    style,
    printingProcessOptions,
  };
}
