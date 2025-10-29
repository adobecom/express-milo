import { getLibs } from '../../scripts/utils.js';
import fetchAPIData, { fetchProductDetails, fetchUIStrings } from './fetchData/fetchProductDetails.js';
import {
  createEmptyDataObject,
  updateDataObjectProductDetails,
  updateDataObjectProductPrice,
  updateDataObjectProductShippingEstimates,
  updateDataObjectProductReviews,
  updateDataObjectProductRenditions,
  updateDataObjectUIStrings,
} from './utilities/data-formatting.js';
import createProductInfoHeadingSection from './createComponents/createProductInfoHeadingSection.js';
import createProductImagesContainer, {
  createProductThumbnailCarousel,
} from './createComponents/createProductImagesContainer.js';
import createCustomizationInputs from './createComponents/createCustomizationInputs.js';
import createProductDetailsSection, {
  createCheckoutButton,
} from './createComponents/createProductDetailsSection.js';
import createDrawer from './createComponents/createDrawer.js';
import {
  addPrefetchLinks,
  formatDeliveryEstimateDateRange,
  formatLargeNumberToK,
  formatPriceZazzle,
  buildRealViewImageUrl,
} from './utilities/utility-functions.js';

let createTag;

// Size chart data (hardcoded since API doesn't provide it)
const SIZE_CHART_DATA = {
  triblend_shortsleeve3413: {
    productName: 'Bella+Canvas Tri-blend T-Shirt',
    fit: 'Standard',
    sizes: {
      IN: [
        {
          name: 'Adult S',
          body: { chest: '34-37', waist: '30-32' },
          garment: { width: '18', length: '28' },
        },
        {
          name: 'Adult M',
          body: { chest: '38-41', waist: '32-34' },
          garment: { width: '20', length: '29' },
        },
        {
          name: 'Adult L',
          body: { chest: '42-45', waist: '34-36' },
          garment: { width: '22', length: '30' },
        },
        {
          name: 'Adult XL',
          body: { chest: '46-49', waist: '36-38' },
          garment: { width: '24', length: '31' },
        },
        {
          name: 'Adult 2XL',
          body: { chest: '50-53', waist: '38-40' },
          garment: { width: '26', length: '32' },
        },
      ],
      CM: [
        {
          name: 'Adult S',
          body: { chest: '86.4-94', waist: '76.2-81.3' },
          garment: { width: '45.7', length: '71.1' },
        },
        {
          name: 'Adult M',
          body: { chest: '96.5-104.1', waist: '81.3-86.4' },
          garment: { width: '50.8', length: '73.7' },
        },
        {
          name: 'Adult L',
          body: { chest: '106.7-114.3', waist: '86.4-91.4' },
          garment: { width: '55.9', length: '76.2' },
        },
        {
          name: 'Adult XL',
          body: { chest: '116.8-124.5', waist: '91.4-96.5' },
          garment: { width: '61', length: '78.7' },
        },
        {
          name: 'Adult 2XL',
          body: { chest: '127-134.6', waist: '96.5-101.6' },
          garment: { width: '66', length: '81.3' },
        },
      ],
    },
  },
};

// Helper function to extract specs from descriptionBrief
function extractSpecs(descriptionBrief) {
  if (!descriptionBrief) return [];
  const text = descriptionBrief.replace(/<[^>]*>/g, ' ').trim();
  return text.split(/\n|<br>|\//).map((s) => s.trim()).filter((s) => s.length > 0);
}

async function updatePageWithPaperDrawer(productDetails, rawProductDetails) {
  if (productDetails.productType !== 'zazzle_businesscard') {
    return;
  }

  if (!productDetails.attributes?.media || productDetails.attributes.media.length === 0) {
    return;
  }

  const rawMediaAttribute = rawProductDetails.product.attributes.media;
  const rawMediaValues = rawMediaAttribute.values;

  const selectedPaper = productDetails.attributes.media[0];
  const selectedRawPaper = rawMediaValues[0];

  const heroImageUrl = buildRealViewImageUrl(
    selectedRawPaper.firstProductRealviewParams,
    644,
  );

  const paperData = {
    selectedPaper: {
      name: selectedPaper.name,
      heroImage: heroImageUrl,
      recommended: selectedRawPaper.isBestValue || false,
      specs: extractSpecs(selectedRawPaper.descriptionBrief),
      typeName: selectedPaper.title,
      description: selectedRawPaper.description || '',
      imgSrc: selectedPaper.thumbnail,
      price: selectedPaper.priceAdjustment,
    },
    papers: productDetails.attributes.media.map((paper, index) => {
      const rawPaper = rawMediaValues[index];
      const heroUrl = buildRealViewImageUrl(rawPaper.firstProductRealviewParams, 644);
      return {
        name: paper.name,
        title: paper.title,
        thumbnail: paper.thumbnail,
        heroImage: heroUrl,
        priceAdjustment: paper.priceAdjustment,
        description: rawPaper.description || '',
        specs: extractSpecs(rawPaper.descriptionBrief),
        recommended: rawPaper.isBestValue || false,
      };
    }),
  };

  const paperDrawer = await createDrawer({
    drawerLabel: 'Select paper type',
    template: 'paper-selection',
    data: paperData,
  });

  const globalContainer = document.querySelector('.pdpx-global-container');
  if (globalContainer && paperDrawer) {
    globalContainer.appendChild(paperDrawer.curtain);
    globalContainer.appendChild(paperDrawer.drawer);
  }

  const compareLink = document.querySelector(
    '.pdpx-pill-selector-label-compare-link[data-drawer-type="paper"]',
  );
  if (compareLink) {
    compareLink.drawerRef = paperDrawer;
  }
  
  return paperDrawer;
}

async function updatePageWithComparisonDrawer(productDetails) {
  if (productDetails.productType !== 'zazzle_shirt') {
    return;
  }

  // Create comparison drawer if either:
  // 1. Product has printingprocess attribute with multiple options, OR
  // 2. Product has a "Learn More" help link for color attribute
  const hasPrintingProcess = productDetails.attributes?.printingprocess
    && productDetails.attributes.printingprocess.length >= 2;
  const hasColorHelpLink = productDetails.attributeHelpLinks?.color;

  if (!hasPrintingProcess && !hasColorHelpLink) {
    return;
  }

  const baseUrl = 'https://asset.zcache.com/assets/graphics/pd/productAttributeHelp/underbasePrintProcess';

  const drawerData = {
    title: 'Classic vs. Vivid Printing',
    left: {
      title: 'Classic Printing: No Underbase',
      colorCount: '4 Color',
      imageUrl: `${baseUrl}/Classic.jpg`,
      description: 'No white base layer is printed on the fabric, any white used in the design will come across as transparent allowing the color of the fabric to show through.',
    },
    right: {
      title: 'Vivid Printing: White Underbase',
      colorCount: '5 Color',
      imageUrl: `${baseUrl}/Vivid.jpg`,
      description: 'Fabric is treated with a white base layer under the design, allowing the design to be more vibrant. Extra production step may require a surcharge.',
    },
  };

  const comparisonDrawer = await createDrawer({
    drawerLabel: 'Select printing process',
    template: 'comparison',
    data: drawerData,
  });

  const globalContainer = document.querySelector('.pdpx-global-container');
  if (globalContainer && comparisonDrawer) {
    globalContainer.appendChild(comparisonDrawer.curtain);
    globalContainer.appendChild(comparisonDrawer.drawer);
  }
  
  return comparisonDrawer;
}

async function updatePageWithSizeChartDrawer(productDetails) {
  if (productDetails.productType !== 'zazzle_shirt') {
    return;
  }

  const styleName = productDetails.attributes?.style?.[0]?.name;
  if (!styleName || !SIZE_CHART_DATA[styleName]) {
    return;
  }

  const sizeChartDrawer = await createDrawer({
    drawerLabel: 'Size Chart',
    template: 'size-chart',
    data: SIZE_CHART_DATA[styleName],
  });

  const globalContainer = document.querySelector('.pdpx-global-container');
  if (globalContainer && sizeChartDrawer) {
    globalContainer.appendChild(sizeChartDrawer.curtain);
    globalContainer.appendChild(sizeChartDrawer.drawer);
  }
  
  return sizeChartDrawer;
}

async function createProductInfoContainer(productDetails, drawer) {
  const productInfoSectionWrapperContainer = createTag('div', {
    class: 'pdpx-product-info-section-wrapper-container',
  });
  const productInfoSectionWrapper = createTag('div', {
    class: 'pdpx-product-info-section-wrapper',
  });
  const productInfoContainer = createTag('div', {
    class: 'pdpx-product-info-container',
    id: 'pdpx-product-info-container',
  });
  const productInfoHeadingSection = await createProductInfoHeadingSection(productDetails);
  productInfoContainer.appendChild(productInfoHeadingSection);
  productInfoSectionWrapper.appendChild(productInfoContainer);
  const checkoutButton = await createCheckoutButton(productDetails);
  productInfoSectionWrapper.appendChild(checkoutButton);
  productInfoSectionWrapper.appendChild(drawer);
  productInfoSectionWrapperContainer.appendChild(productInfoHeadingSection);
  productInfoSectionWrapperContainer.appendChild(productInfoSectionWrapper);
  return productInfoSectionWrapperContainer;
}

async function createGlobalContainer(productDetails) {
  const globalContainer = createTag('div', {
    class: 'pdpx-global-container',
    'data-template-id': productDetails.templateId,
  });
  const { curtain, drawer } = await createDrawer(productDetails);
  const productImagesContainer = await createProductImagesContainer(
    productDetails.realViews,
    productDetails.heroImage,
  );
  const productInfoSectionWrapper = await createProductInfoContainer(
    productDetails,
    drawer,
  );
  globalContainer.appendChild(productImagesContainer);
  globalContainer.appendChild(productInfoSectionWrapper);
  document.body.append(curtain);
  return globalContainer;
}

function createCheckoutButtonParameters(formDataObject) {
  const parameters = {};
  const productSettingsString = Object.entries(formDataObject)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  parameters.productSettings = productSettingsString;
  parameters.action = 'print-null-now';
  parameters.loadPrintAddon = 'true';
  parameters.mv = '1';
  parameters.referrer = 'a.com-print-and-deliver-seo';
  parameters.sdid = 'MH16S6M4';
  return parameters;
}

function createCheckoutButtonHref(templateId, parameters) {
  const parametersString = Object.entries(parameters)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const encodedParametersString = encodeURIComponent(parametersString);
  const baseUrl = 'https://new.express.adobe.com/design/template';
  const checkoutButtonHref = `${baseUrl}/${templateId}?${encodedParametersString}`;
  return checkoutButtonHref;
}

async function updatePageWithProductDetails(productDetails, rawProductDetails) {
  const productTitle = document.getElementById('pdpx-product-title');
  productTitle.textContent = productDetails.productTitle;
  productTitle.removeAttribute('data-skeleton');
  const productHeroImage = document.getElementById('pdpx-product-hero-image');
  productHeroImage.src = productDetails.heroImage;
  productHeroImage.removeAttribute('data-skeleton');
  
  // Create drawers FIRST so they can be passed to customization inputs
  const [paperDrawerResult, comparisonDrawerResult, sizeChartDrawerResult] = await Promise.all([
    updatePageWithPaperDrawer(productDetails, rawProductDetails),
    updatePageWithComparisonDrawer(productDetails),
    updatePageWithSizeChartDrawer(productDetails),
  ]).catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Drawer creation failed:', err);
    return [null, null, null];
  });
  
  const productInfoContainer = document.getElementById('pdpx-product-info-container');
  const customizationInputs = await createCustomizationInputs(
    productDetails,
    {},
    comparisonDrawerResult,
    sizeChartDrawerResult,
    paperDrawerResult,
  );
  productInfoContainer.appendChild(customizationInputs);
  const productDetailsSection = await createProductDetailsSection(
    productDetails.productDescriptions,
  );
  productInfoContainer.appendChild(productDetailsSection);
  const form = document.getElementById('pdpx-customization-inputs-form');
  const formData = new FormData(form);
  const formDataObject = Object.fromEntries(formData.entries());
  const checkoutButton = document.getElementById('pdpx-checkout-button');
  const checkoutButtonParameters = createCheckoutButtonParameters(
    formDataObject,
  );
  const checkoutButtonHref = createCheckoutButtonHref(
    productDetails.templateId,
    checkoutButtonParameters,
  );
  checkoutButton.href = checkoutButtonHref;

  const returnObject = { checkoutButtonParameters };
  return returnObject;
}

function updatePageWithProductImages(productDetails) {
  // Don't update if realViews is empty
  if (!productDetails.realViews || Object.keys(productDetails.realViews).length === 0) {
    return;
  }
  
  const imageThumbnailCarouselContainer = document.getElementById(
    'pdpx-image-thumbnail-carousel-container',
  );
  const heroProductImage = document.getElementById('pdpx-product-hero-image');
  
  // Clear existing content and create new carousel
  imageThumbnailCarouselContainer.innerHTML = '';
  
  // Update hero image to first view from realViews
  const firstViewKey = Object.keys(productDetails.realViews)[0];
  if (firstViewKey) {
    heroProductImage.src = productDetails.realViews[firstViewKey];
    heroProductImage.dataset.imageType = firstViewKey;
    heroProductImage.parentElement.removeAttribute('data-skeleton');
  }
  
  // Create and populate thumbnail carousel
  const newImageThumbnailCarouselContainer = createProductThumbnailCarousel(
    productDetails.realViews,
    firstViewKey || 'Front',
    heroProductImage,
  );
  
  // Replace the carousel items directly (not nested)
  Array.from(newImageThumbnailCarouselContainer.children).forEach((child) => {
    imageThumbnailCarouselContainer.appendChild(child);
  });
  
  imageThumbnailCarouselContainer.removeAttribute('data-skeleton');
  return imageThumbnailCarouselContainer;
}

async function updatePageWithProductPrice(productDetails) {
  const priceLabel = document.getElementById('pdpx-price-label');
  const comparePriceLabel = document.getElementById('pdpx-compare-price-label');
  const savingsText = document.getElementById('pdpx-savings-text');
  
  // Only format if price is a valid number, otherwise use placeholder
  if (typeof productDetails.productPrice === 'number' && productDetails.productPrice > 0) {
    priceLabel.textContent = await formatPriceZazzle(productDetails.productPrice);
  } else {
    priceLabel.textContent = productDetails.productPrice || '—';
  }
  
  if (typeof productDetails.strikethroughPrice === 'number' && productDetails.strikethroughPrice > 0) {
    comparePriceLabel.textContent = await formatPriceZazzle(productDetails.strikethroughPrice);
  } else {
    comparePriceLabel.textContent = productDetails.strikethroughPrice || '—';
  }
  
  savingsText.textContent = productDetails.discountString || '';
}

function updatePageWithProductReviews(productDetails) {
  const ratingsNumber = document.getElementById('pdpx-ratings-number');
  const roundedRating = Math.round(productDetails.averageRating * 10) / 10;
  ratingsNumber.textContent = roundedRating;
  const ratingsAmount = document.getElementById('pdpx-ratings-amount');
  ratingsAmount.textContent = formatLargeNumberToK(
    productDetails.totalReviews,
  );
}

function updatePageWithProductShippingEstimates(productDetails) {
  const deliveryEstimateDateRange = formatDeliveryEstimateDateRange(
    productDetails.deliveryEstimateMinDate,
    productDetails.deliveryEstimateMaxDate,
  );
  const deliveryEstimatePillDate = document.getElementById(
    'pdpx-delivery-estimate-pill-date',
  );
  deliveryEstimatePillDate.textContent = deliveryEstimateDateRange;
}

function updatePageWithUIStrings(productDetails) {
  const deliveryEstimatePillText = document.getElementById(
    'pdpx-delivery-estimate-pill-text',
  );
  deliveryEstimatePillText.textContent = productDetails.deliveryEstimateStringText;
  const compareValueTooltipTitle = document.getElementById(
    'pdpx-info-tooltip-content-title',
  );
  compareValueTooltipTitle.textContent = productDetails.compareValueTooltipTitle;
  const compareValueTooltipDescription1 = document.getElementById(
    'pdpx-info-tooltip-content-description-1',
  );
  compareValueTooltipDescription1.textContent = productDetails.compareValueTooltipDescription1;
  const compareValueTooltipDescription2 = document.getElementById(
    'pdpx-info-tooltip-content-description-2',
  );
  compareValueTooltipDescription2.textContent = productDetails.compareValueTooltipDescription2;
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  addPrefetchLinks();

  // Get template ID from block content
  const templateId = block.children[0].children[1].textContent.trim();
  let productId;
  let dataObject = createEmptyDataObject(templateId);

  block.innerHTML = '';
  const globalContainer = await createGlobalContainer(dataObject);
  block.appendChild(globalContainer);

  // Always use getproductfromtemplate to get full customization options
  const productDetails = fetchProductDetails(templateId);
    
  productDetails.then(async (productDetailsResponse) => {
    // Check if API call succeeded
    if (!productDetailsResponse || !productDetailsResponse.product) {
      console.error('[PDP] Failed to fetch product details. Response:', productDetailsResponse);
      console.error('[PDP] Template ID:', templateId);
      return;
    }
    
    const rawProductDetails = productDetailsResponse;
    dataObject = await updateDataObjectProductDetails(dataObject, productDetailsResponse);
    await updatePageWithProductDetails(dataObject, rawProductDetails);
    productId = productDetailsResponse.product.id;

    const productRenditions = fetchAPIData(productId, null, 'getproductrenditions');
    productRenditions.then((productRenditionsResponse) => {
      dataObject = updateDataObjectProductRenditions(
        dataObject,
        productRenditionsResponse,
      );
      updatePageWithProductImages(dataObject);
    });

    const quantity = 1;
    const productPrice = fetchAPIData(productId, null, 'getproductpricing');
    productPrice.then(async (productPriceResponse) => {
      dataObject = updateDataObjectProductPrice(dataObject, productPriceResponse);
      await updatePageWithProductPrice(dataObject);
    });

    const productReviews = fetchAPIData(productId, null, 'getreviews');
    productReviews.then((productReviewsResponse) => {
      dataObject = updateDataObjectProductReviews(dataObject, productReviewsResponse);
      updatePageWithProductReviews(dataObject);
    });

    const sampleShippingParameters = { qty: quantity };
    const productShippingEstimates = fetchAPIData(
      productId,
      sampleShippingParameters,
      'getshippingestimates',
    );
    productShippingEstimates.then((productShippingEstimatesResponse) => {
      dataObject = updateDataObjectProductShippingEstimates(
        dataObject,
        productShippingEstimatesResponse,
      );
      updatePageWithProductShippingEstimates(dataObject);
    });

    const UIStrings = fetchUIStrings();
    UIStrings.then((UIStringsResponse) => {
      dataObject = updateDataObjectUIStrings(dataObject, UIStringsResponse);
      updatePageWithUIStrings(dataObject);
    });
  });
}
