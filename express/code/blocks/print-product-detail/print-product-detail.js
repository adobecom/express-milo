import { getLibs } from '../../scripts/utils.js';
import fetchAPIData, { formatProductDescriptions } from './fetchData/fetchProductDetails.js';
import { normalizeProductDetailObject } from './utilities/data-formatting.js';
import { extractProductId } from './utilities/utility-functions.js';
import createProductInfoHeadingSection from './createComponents/createProductInfoHeadingSection.js';
import createProductImagesContainer from './createComponents/createProductImagesContainer.js';
import createCustomizationInputs from './createComponents/createCustomizationInputs.js';
import createProductDetailsSection, { createCheckoutButton } from './createComponents/createProductDetailsSection.js';
import createDrawer from './createComponents/createDrawer.js';
import createComparisonDrawer from './createComponents/createComparisonDrawer.js';

let createTag;

async function setupComparisonDrawer(productDetails) {
  const printingProcessAttr = productDetails?.product?.attributes?.printingprocess;
  if (!printingProcessAttr || !printingProcessAttr.values) {
    // eslint-disable-next-line no-console
    console.log('[Drawer Debug] No printingprocess attribute found');
    return null;
  }

  const classicValue = printingProcessAttr.values.find((v) => v.name === 'classic');
  const vividValue = printingProcessAttr.values.find((v) => v.name === 'vivid');

  if (!classicValue || !vividValue) {
    // eslint-disable-next-line no-console
    console.log('[Drawer Debug] Missing classic or vivid value', { classicValue, vividValue });
    return null;
  }

  const baseUrl = 'https://asset.zcache.com/assets/graphics/pd/productAttributeHelp/underbasePrintProcess';

  const drawerData = {
    title: 'Classic vs. Vivid Printing',
    left: {
      title: classicValue.title || 'Classic Printing: No Underbase',
      colorCount: '4 Color',
      imageUrl: `${baseUrl}/Classic.jpg`,
      description: classicValue.description
        || 'No white base layer is printed on the fabric, any white used in the design will come across as transparent allowing the color of the fabric to show through.',
    },
    right: {
      title: vividValue.title || 'Vivid Printing: White Underbase',
      colorCount: '5 Color',
      imageUrl: `${baseUrl}/Vivid.jpg`,
      description: vividValue.description
        || 'Fabric is treated with a white base layer under the design, allowing the design to be more vibrant. Extra production step may require a surcharge.',
    },
  };

  const drawer = await createComparisonDrawer(drawerData);
  // eslint-disable-next-line no-console
  console.log('[Drawer Debug] Comparison drawer created:', drawer);
  return drawer;
}

async function createProductInfoContainer(
  productDetails,
  productDescriptions,
  drawer,
  rawProductDetails,
  comparisonDrawer,
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
  );
  productInfoContainer.appendChild(customizationInputs);
  const productDetailsSection = await createProductDetailsSection(productDescriptions);
  productInfoContainer.appendChild(productDetailsSection);
  productInfoSectionWrapper.appendChild(productInfoContainer);
  const checkoutButton = createCheckoutButton();
  productInfoSectionWrapper.appendChild(checkoutButton);
  productInfoSectionWrapper.appendChild(drawer);
  productInfoSectionWrapperContainer.appendChild(productInfoHeadingSection);
  productInfoSectionWrapperContainer.appendChild(productInfoSectionWrapper);

  if (comparisonDrawer) {
    document.body.appendChild(comparisonDrawer.curtain);
    document.body.appendChild(comparisonDrawer.drawer);
  }

  return productInfoSectionWrapperContainer;
}

async function createGlobalContainer(
  block,
  productDetails,
  productDescriptions,
  rawProductDetails,
) {
  const globalContainer = createTag('div', { class: 'pdpx-global-container' });

  // Create drawer with printing process comparison data for t-shirts
  let drawerConfig = block;
  if (productDetails.productType === 'zazzle_shirt' && productDetails.printingProcessOptions?.length >= 2) {
    const baseUrl = 'https://asset.zcache.com/assets/graphics/pd/productAttributeHelp/underbasePrintProcess';
    drawerConfig = {
      drawerLabel: 'Classic vs. Vivid Printing',
      template: 'comparison',
      data: {
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
      },
    };
  }

  const { curtain, drawer } = await createDrawer(drawerConfig);
  const comparisonDrawer = await setupComparisonDrawer(rawProductDetails);
  const productImagesContainer = await createProductImagesContainer(
    productDetails.realViews,
    productDetails.heroImage,
  );
  const productInfoSectionWrapper = await createProductInfoContainer(
    productDetails,
    productDescriptions,
    drawer,
    rawProductDetails,
    comparisonDrawer,
  );
  globalContainer.appendChild(productImagesContainer);
  globalContainer.appendChild(productInfoSectionWrapper);
  block.appendChild(globalContainer);
  document.body.append(curtain);
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
