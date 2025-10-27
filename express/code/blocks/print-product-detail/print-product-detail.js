import { getLibs } from '../../scripts/utils.js';
import fetchAPIData, { formatProductDescriptions } from './fetchData/fetchProductDetails.js';
import { normalizeProductDetailObject } from './utilities/data-formatting.js';
import { extractProductId, buildRealViewImageUrl } from './utilities/utility-functions.js';
import createProductInfoHeadingSection from './createComponents/createProductInfoHeadingSection.js';
import createProductImagesContainer from './createComponents/createProductImagesContainer.js';
import createCustomizationInputs from './createComponents/createCustomizationInputs.js';
import createProductDetailsSection, { createCheckoutButton } from './createComponents/createProductDetailsSection.js';
import createDrawer from './createComponents/createDrawer.js';

let createTag;

// Size chart data (hardcoded since API doesn't provide it)
const SIZE_CHART_DATA = {
  triblend_shortsleeve3413: {
    productName: 'Bella+Canvas Tri-blend T-Shirt',
    fit: 'Standard',
    sizes: {
      IN: [
        { name: 'Adult S', body: { chest: '34-37', waist: '30-32' }, garment: { width: '18', length: '28' } },
        { name: 'Adult M', body: { chest: '38-41', waist: '32-34' }, garment: { width: '20', length: '29' } },
        { name: 'Adult L', body: { chest: '42-45', waist: '34-36' }, garment: { width: '22', length: '30' } },
        { name: 'Adult XL', body: { chest: '46-49', waist: '36-38' }, garment: { width: '24', length: '31' } },
        { name: 'Adult 2XL', body: { chest: '50-53', waist: '38-40' }, garment: { width: '26', length: '32' } },
      ],
      CM: [
        { name: 'Adult S', body: { chest: '86.4-94', waist: '76.2-81.3' }, garment: { width: '45.7', length: '71.1' } },
        { name: 'Adult M', body: { chest: '96.5-104.1', waist: '81.3-86.4' }, garment: { width: '50.8', length: '73.7' } },
        { name: 'Adult L', body: { chest: '106.7-114.3', waist: '86.4-91.4' }, garment: { width: '55.9', length: '76.2' } },
        { name: 'Adult XL', body: { chest: '116.8-124.5', waist: '91.4-96.5' }, garment: { width: '61', length: '78.7' } },
        { name: 'Adult 2XL', body: { chest: '127-134.6', waist: '96.5-101.6' }, garment: { width: '66', length: '81.3' } },
      ],
    },
  },
};

async function setupPaperSelectionDrawer(productDetails, productDescriptions, rawProductDetails) {
  if (productDetails.productType !== 'zazzle_businesscard') {
    return null;
  }

  if (!productDetails.media || productDetails.media.length === 0) {
    return null;
  }

  // Get raw media data from API to access firstProductRealviewParams
  const rawMediaAttribute = rawProductDetails.product.attributes.media;
  const rawMediaValues = rawMediaAttribute.values;

  // Find the selected paper (first one by default)
  const selectedPaper = productDetails.media[0];
  const selectedRawPaper = rawMediaValues[0];

  // Find the paper description from accordion data
  const paperDescription = productDescriptions.find((desc) => desc.title === 'Paper');

  // Build hero image URL with larger max_dim
  const heroImageUrl = buildRealViewImageUrl(selectedRawPaper.firstProductRealviewParams, 644);

  const paperData = {
    selectedPaper: {
      name: selectedPaper.title,
      heroImage: heroImageUrl,
      recommended: true, // First paper is recommended
      specs: ['17.5pt thickness', '120lb weight', '324 GSM'], // TODO: Extract from API
      typeName: selectedPaper.title,
      description: selectedRawPaper.description || '',
      imgSrc: selectedPaper.thumbnail,
      price: selectedPaper.priceAdjustment,
    },
    papers: productDetails.media.map((paper, index) => {
      const rawPaper = rawMediaValues[index];
      const heroUrl = buildRealViewImageUrl(rawPaper.firstProductRealviewParams, 644);
      return {
        name: paper.name,
        title: paper.title,
        thumbnail: paper.thumbnail,
        heroImage: heroUrl,
        priceAdjustment: paper.priceAdjustment,
        description: rawPaper.description || '',
      };
    }),
  };

  const paperDrawer = await createDrawer({
    drawerLabel: 'Select paper type',
    template: 'paper-selection',
    data: paperData,
  });

  return paperDrawer;
}

async function setupComparisonDrawer(productDetails) {
  if (productDetails.productType !== 'zazzle_shirt') {
    return null;
  }

  if (!productDetails.printingProcessOptions || productDetails.printingProcessOptions.length < 2) {
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

  return comparisonDrawer;
}

async function setupSizeChartDrawer(productDetails) {
  if (productDetails.productType !== 'zazzle_shirt') {
    return null;
  }

  const styleName = productDetails.style?.[0]?.name;
  if (!styleName || !SIZE_CHART_DATA[styleName]) {
    return null;
  }

  const sizeChartDrawer = await createDrawer({
    drawerLabel: 'Size Chart',
    template: 'size-chart',
    data: SIZE_CHART_DATA[styleName],
  });

  return sizeChartDrawer;
}

async function createProductInfoContainer(
  productDetails,
  productDescriptions,
  drawer,
  rawProductDetails,
  comparisonDrawer,
  sizeChartDrawer,
) {
  const productInfoSectionWrapperContainer = createTag('div', {
    class: 'pdpx-product-info-section-wrapper-container',
  });
  const productInfoSectionWrapper = createTag('div', { class: 'pdpx-product-info-section-wrapper' });
  const productInfoContainer = createTag('div', { class: 'pdpx-product-info-container' });
  const productInfoHeadingSection = await createProductInfoHeadingSection(productDetails);
  productInfoContainer.appendChild(productInfoHeadingSection);

  const customizationInputs = await createCustomizationInputs(
    productDetails,
    null,
    comparisonDrawer,
    sizeChartDrawer,
    drawer,
  );
  productInfoContainer.appendChild(customizationInputs);
  const productDetailsSection = await createProductDetailsSection(productDescriptions);
  productInfoContainer.appendChild(productDetailsSection);
  productInfoSectionWrapper.appendChild(productInfoContainer);
  const checkoutButton = createCheckoutButton();
  productInfoSectionWrapper.appendChild(checkoutButton);

  productInfoSectionWrapperContainer.appendChild(productInfoHeadingSection);
  productInfoSectionWrapperContainer.appendChild(productInfoSectionWrapper);

  return productInfoSectionWrapperContainer;
}

async function createGlobalContainer(
  block,
  productDetails,
  productDescriptions,
  rawProductDetails,
) {
  const globalContainer = createTag('div', { class: 'pdpx-global-container' });
  globalContainer.dataset.productId = productDetails.id;

  const paperDrawer = await setupPaperSelectionDrawer(productDetails, productDescriptions, rawProductDetails);
  const comparisonDrawer = await setupComparisonDrawer(productDetails);
  const sizeChartDrawer = await setupSizeChartDrawer(productDetails);
  const productImagesContainer = await createProductImagesContainer(
    productDetails.realViews,
    productDetails.heroImage,
  );
  const productInfoSectionWrapper = await createProductInfoContainer(
    productDetails,
    productDescriptions,
    paperDrawer,
    rawProductDetails,
    comparisonDrawer,
    sizeChartDrawer,
  );
  globalContainer.appendChild(productImagesContainer);
  globalContainer.appendChild(productInfoSectionWrapper);

  // Append paper drawer to global container (for business cards)
  if (paperDrawer) {
    globalContainer.appendChild(paperDrawer.curtain);
    globalContainer.appendChild(paperDrawer.drawer);
  }

  // Append comparison and size chart drawers to global container (for t-shirts)
  if (comparisonDrawer) {
    globalContainer.appendChild(comparisonDrawer.curtain);
    globalContainer.appendChild(comparisonDrawer.drawer);
  }

  if (sizeChartDrawer) {
    globalContainer.appendChild(sizeChartDrawer.curtain);
    globalContainer.appendChild(sizeChartDrawer.drawer);
  }

  block.appendChild(globalContainer);
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productId = await extractProductId(block);
  const productDetails = await fetchAPIData(productId, null, 'getproduct');
  const productRenditions = await fetchAPIData(productId, null, 'getproductrenditions');
  const productPrice = await fetchAPIData(productId, null, 'getproductpricing');
  const productReviews = await fetchAPIData(productId, null, 'getreviews');
  const quantity = 1;
  const sampleShippingParameters = {
    qty: quantity,
  };
  const productShippingEstimates = await fetchAPIData(productId, sampleShippingParameters, 'getshippingestimates');
  const productDetailsFormatted = await normalizeProductDetailObject(
    productDetails,
    productPrice,
    productReviews,
    productRenditions,
    productShippingEstimates,
    quantity,
  );
  const productDescriptions = formatProductDescriptions(productDetails);
  block.innerHTML = '';
  await createGlobalContainer(block, productDetailsFormatted, productDescriptions, productDetails);
}
