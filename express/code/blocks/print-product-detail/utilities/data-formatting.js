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
    heroImage: '',
    productPrice: 0,
    strikethroughPrice: 0,
    discountString: '',
    averageRating: 0,
    totalReviews: 0,
    deliveryEstimateMinDate: '',
    deliveryEstimateMaxDate: '',
    deliveryEstimateStringText: '',
    compareValueTooltipTitle: '',
    compareValueTooltipDescription1: '',
    compareValueTooltipDescription2: '',
    realViews: [],
    productDescriptions: [],
  };
}

export async function updateDataObjectProductDetails(dataObject, productDetails) {
  const updatedDataObject = { ...dataObject };
  const productTitle = productDetails.product.title;
  const heroImage = buildRealViewImageUrl(
    productDetails.product.attributes.media.values[0].firstProductRealviewParams,
  );
  const realViews = productDetails.product.attributes.media.values.map((view) => ({
    viewName: view.title,
    viewUrl: buildRealViewImageUrl(view.firstProductRealviewParams),
  }));
  const productDescriptions = formatProductDescriptions(productDetails);
  updatedDataObject.productTitle = productTitle;
  updatedDataObject.heroImage = heroImage;
  updatedDataObject.realViews = realViews;
  updatedDataObject.productDescriptions = productDescriptions;
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
    const realViews = productRenditions.renditions.map((rendition) => ({
      viewName: rendition.viewName,
      viewUrl: rendition.url,
    }));
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
