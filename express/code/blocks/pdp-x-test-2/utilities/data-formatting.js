import { fetchAPIData, fetchUIStrings } from '../fetchData/fetchProductDetails.js';
import { formatPriceZazzle } from './utility-functions.js';

export default function extractProductDescriptionsFromBlock(block) {
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

function buildImageUrl(realviewParams) {
  const params = new URLSearchParams();
  Object.entries(realviewParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.set(key, value);
    }
  });
  return `https://rlv.zcache.com/svc/view?${params.toString()}`;
}

function convertAttributeToOptionsObject(attribute, printingprocess) {
  if (attribute.title === 'Color & Print Process') {
    if (printingprocess === 'classic') {
      attribute.values = attribute.values.filter((value) => !value.properties.tags?.includes('showswhite'));
    } else if (printingprocess === 'vivid') {
      attribute.values = attribute.values.filter((value) => value.properties.tags?.includes('showswhite'));
    }
  }
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

async function addSideQuantityOptions(productRenditions) {
  const sideQuantityOptions = [];
  sideQuantityOptions.push({
    title: 'Double-sided',
    name: 'double-sided',
    thumbnail: productRenditions.realviewUrls['Front/Back'],
    priceAdjustment: formatPriceZazzle('5.95', true),
  });
  sideQuantityOptions.push({
    title: 'Single-sided',
    name: 'single-sided',
    thumbnail: productRenditions.realviewUrls.Front,
    priceAdjustment: formatPriceZazzle('0', true),
  });
  return sideQuantityOptions;
}

async function addPrintingProcessOptions(attributeOptions, productRenditions) {
  const printingProcessOptions = [];
  let vividPrintingAvailable = false;
  let fourColorPrintingAvailable = false;
  const colorOptions = attributeOptions.color.values;
  for (const colorOption of colorOptions) {
    if (colorOption.properties.tags?.includes('showswhite')) {
      vividPrintingAvailable = true;
    }
    if (!colorOption.properties.tags?.includes('showswhite')) {
      fourColorPrintingAvailable = true;
    }
  }
  if (fourColorPrintingAvailable) {
    printingProcessOptions.push({
      title: 'Classic 4-Color printing',
      name: 'classic',
      thumbnail: productRenditions.realviewUrls.Front,
      priceAdjustment: formatPriceZazzle('0', true),
    });
  }
  if (vividPrintingAvailable) {
    printingProcessOptions.push({
      title: 'Vivid 5-Color printing',
      name: 'vivid',
      thumbnail: productRenditions.realviewUrls.Front,
      priceAdjustment: formatPriceZazzle('0', true),
    });
  }
  return printingProcessOptions;
}

export async function normalizeProductDetailObject(productDetails, productPrice, productReviews, productRenditions, productShippingEstimates, quantity, changeOptions = {}, printingprocess = 'classic') {
  const UIStrings = await fetchUIStrings();
  const attributeOptions = changeOptions?.product?.attributes || productDetails.product.attributes;
  const applicableDiscount = productPrice?.discountProductItems[1] || productPrice?.discountProductItems[0];
  const discountAvailable = !!applicableDiscount;
  const calculatedProductPrice = applicableDiscount?.priceAdjusted * quantity || productPrice?.unitPrice * quantity;
  const normalizedProductDetails = {
    id: productDetails.product.id,
    heroImage: productDetails.product.initialPrettyPreferredViewUrl,
    productTitle: productDetails.product.title,
    unitPrice: productPrice?.unitPrice,
    productPrice: calculatedProductPrice,
    strikethroughPrice: productPrice?.unitPrice * quantity,
    discountAvailable,
    discountString: applicableDiscount?.discountString,
    deliveryEstimateStringText: 'Order today and get it by',
    deliveryEstimateMinDate: productShippingEstimates.estimates[0].minDeliveryDate,
    deliveryEstimateMaxDate: productShippingEstimates.estimates[0].maxDeliveryDate,
    realViews: productRenditions.realviewUrls,
    productType: productDetails.product.productType,
    quantities: productDetails.product.quantities,
    pluralUnitLabel: productDetails.product.pluralUnitLabel,
    averageRating: productReviews.reviews.stats.averageRating,
    totalReviews: productReviews.reviews.stats.totalReviews,
    tooltipTitle: UIStrings.adobe_comp_value_tooltip_title,
    tooltipDescription1: UIStrings.zi_product_Price_CompValueTooltip1Adobe,
    tooltipDescription2: UIStrings.zi_product_Price_CompValueTooltip2Adobe,
  };
  if (productDetails.product.productType === 'zazzle_shirt') {
    const printingProcessOptions = await addPrintingProcessOptions(attributeOptions, productRenditions);
    normalizedProductDetails.printingProcessOptions = printingProcessOptions;
  }
  for (const attribute of Object.values(attributeOptions)) {
    normalizedProductDetails[attribute.name] = convertAttributeToOptionsObject(attribute, printingprocess);
  }
  const quantitiesOptions = formatQuantityOptionsObject(productDetails.product.quantities, productDetails.product.pluralUnitLabel);
  normalizedProductDetails.quantities = quantitiesOptions;
  if (productDetails.product.productType === 'zazzle_businesscard') {
    const sideQuantityOptions = await addSideQuantityOptions(productRenditions);
    normalizedProductDetails.sideQuantityOptions = sideQuantityOptions;
  }

  return normalizedProductDetails;
}
