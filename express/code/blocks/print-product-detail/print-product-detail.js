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
  extractTemplateId,
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

function extractSpecs(descriptionBrief) {
  if (!descriptionBrief) return [];
  const text = descriptionBrief.replace(/<[^>]*>/g, ' ').trim();
  return text.split(/\n|<br>|\//).map((s) => s.trim()).filter((s) => s.length > 0);
}

async function updatePageWithPaperDrawer(productDetails, rawProductDetails) {
  if (productDetails.productType !== 'zazzle_businesscard') {
    return null;
  }

  if (!productDetails.attributes?.media || productDetails.attributes.media.length === 0) {
    return null;
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
  if (compareLink && paperDrawer) {
    compareLink.drawerRef = paperDrawer;
  }

  return paperDrawer;
}

async function updatePageWithComparisonDrawer(productDetails) {
  if (productDetails.productType !== 'zazzle_shirt') {
    return null;
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
    return null;
  }

  const styleValue = productDetails.attributes.style?.[0]?.name;
  const sizeChartData = SIZE_CHART_DATA[styleValue];

  if (!sizeChartData) {
    return null;
  }

  const sizeChartDrawer = await createDrawer({
    template: 'size-chart',
    drawerLabel: 'Size Chart',
    productId: productDetails.id,
    data: sizeChartData,
  });

  const globalContainer = document.querySelector('.pdpx-global-container');
  if (globalContainer && sizeChartDrawer) {
    globalContainer.appendChild(sizeChartDrawer.curtain);
    globalContainer.appendChild(sizeChartDrawer.drawer);
  }
  
  return sizeChartDrawer;
}

async function createProductInfoContainer(productDetails, drawer) {
  const productInfoSectionContainer = createTag('div', { class: 'pdpx-product-info-section-container' });
  const productInfoSection = createTag('div', { class: 'pdpx-product-info-section', id: 'pdpx-product-info-section' });
  const productInfoHeadingSection = await createProductInfoHeadingSection(productDetails);
  const checkoutButton = await createCheckoutButton(productDetails);
  productInfoSectionContainer.appendChild(drawer);
  productInfoSectionContainer.appendChild(productInfoHeadingSection);
  productInfoSectionContainer.appendChild(productInfoSection);
  productInfoSectionContainer.appendChild(checkoutButton);
  return productInfoSectionContainer;
}

async function createGlobalContainer(productDetails) {
  const globalContainer = createTag('div', {
    class: 'pdpx-global-container',
    'data-template-id': productDetails.templateId,
  });
  const { curtain, drawer } = await createDrawer(productDetails);
  const productImagesContainer = await createProductImagesContainer(productDetails.realViews, productDetails.heroImage);
  const productInfoSection = await createProductInfoContainer(productDetails, drawer);
  globalContainer.appendChild(productImagesContainer);
  globalContainer.appendChild(productInfoSection);
  document.body.append(curtain);
  return globalContainer;
}

function createCheckoutButtonParameters(formDataObject) {
  const parameters = {};
  const productSettingsString = Object.entries(formDataObject)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  parameters.productSettings = productSettingsString;
  return parameters;
}

function createCheckoutButtonHref(templateId, checkoutButtonParameters) {
  const newExpressBaseURL = 'https://new.express.adobe.com/design/template/';
  const href = `${newExpressBaseURL}${templateId}?${checkoutButtonParameters.productSettings}`;
  return href;
}

async function updatePageWithProductDetails(productDetails, rawProductDetails) {
  const productTitle = document.getElementById('pdpx-product-title');
  productTitle.textContent = productDetails.productTitle;
  productTitle.removeAttribute('data-skeleton');
  const productHeroImage = document.getElementById('pdpx-product-hero-image');
  productHeroImage.src = productDetails.heroImage;
  productHeroImage.removeAttribute('data-skeleton');

  const [paperDrawerResult, comparisonDrawerResult, sizeChartDrawerResult] = await Promise.all([
    updatePageWithPaperDrawer(productDetails, rawProductDetails),
    updatePageWithComparisonDrawer(productDetails),
    updatePageWithSizeChartDrawer(productDetails),
  ]).catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Drawer creation failed:', err);
    return [null, null, null];
  });

  const globalContainer = document.querySelector('.pdpx-global-container');
  if (globalContainer) {
    globalContainer._comparisonDrawer = comparisonDrawerResult;
    globalContainer._sizeChartDrawer = sizeChartDrawerResult;
    globalContainer._paperDrawer = paperDrawerResult;
    globalContainer._pbjOverrides = productDetails.pbjOverrides;
    globalContainer._dbStrings = productDetails.dbStrings;
  }

  const productInfoSection = document.getElementById('pdpx-product-info-section');
  const customizationInputs = await createCustomizationInputs(
    productDetails,
    {},
    comparisonDrawerResult,
    sizeChartDrawerResult,
    paperDrawerResult,
  );
  productInfoSection.appendChild(customizationInputs);
  const productDetailsSection = await createProductDetailsSection(productDetails.productDescriptions);
  productInfoSection.appendChild(productDetailsSection);
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

async function updatePageWithProductImages(productDetails) {
  const productHeroImage = document.getElementById('pdpx-product-hero-image');
  productHeroImage.src = productDetails.heroImage;
  const imageThumbnailCarouselContainer = document.getElementById(
    'pdpx-image-thumbnail-carousel-container',
  );
  imageThumbnailCarouselContainer.replaceChildren();
  const updatedImageThumbnailCarouselContainer = createProductThumbnailCarousel(
    productDetails.realViews,
    'Front',
    productHeroImage,
  );
  imageThumbnailCarouselContainer.replaceWith(
    updatedImageThumbnailCarouselContainer,
  );
}

async function updatePageWithProductPrice(productDetails) {
  const productPrice = document.getElementById('pdpx-price-label');
  productPrice.textContent = await formatPriceZazzle(productDetails.productPrice);
  productPrice.removeAttribute('data-skeleton');
  const comparePrice = document.getElementById('pdpx-compare-price-label');
  comparePrice.textContent = await formatPriceZazzle(productDetails.strikethroughPrice);
  comparePrice.removeAttribute('data-skeleton');
  const savingsText = document.getElementById('pdpx-savings-text');
  savingsText.textContent = productDetails.discountString;
  savingsText.removeAttribute('data-skeleton');
}

function updatePageWithProductReviews(productDetails) {
  const ratingsNumber = document.getElementById('pdpx-ratings-number');
  ratingsNumber.textContent = Math.round(productDetails.averageRating * 10) / 10;
  ratingsNumber.removeAttribute('data-skeleton');
  const ratingsAmount = document.getElementById('pdpx-ratings-amount');
  ratingsAmount.textContent = formatLargeNumberToK(productDetails.totalReviews);
  ratingsAmount.removeAttribute('data-skeleton');
}

function updatePageWithProductShippingEstimates(productDetails) {
  const deliveryEstimateDate = document.getElementById('pdpx-delivery-estimate-pill-date');
  deliveryEstimateDate.textContent = formatDeliveryEstimateDateRange(
    productDetails.deliveryEstimateMinDate,
    productDetails.deliveryEstimateMaxDate,
  );
  deliveryEstimateDate.removeAttribute('data-skeleton');
}

function updatePageWithUIStrings(productDetails) {
  const deliveryEstimateStringText = document.getElementById('pdpx-delivery-estimate-pill-text');
  if (deliveryEstimateStringText) {
    deliveryEstimateStringText.textContent = productDetails.deliveryEstimateStringText;
  }
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  addPrefetchLinks();
  const templateId = extractTemplateId(block);
  let productId;
  let dataObject = createEmptyDataObject(templateId);

  block.innerHTML = '';
  const globalContainer = await createGlobalContainer(dataObject);
  block.appendChild(globalContainer);

  const productDetails = fetchProductDetails(templateId);
    
  productDetails.then(async (productDetailsResponse) => {
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
      dataObject = updateDataObjectProductPrice(dataObject, productPriceResponse, quantity);
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
