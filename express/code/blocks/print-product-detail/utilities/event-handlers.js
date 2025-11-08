import fetchAPIData, { fetchUIStrings } from '../fetchData/fetchProductDetails.js';
import { formatDeliveryEstimateDateRange } from './utility-functions.js';
import { normalizeProductDetailObject } from './data-formatting.js';
import createCustomizationInputs from '../createComponents/customizationInputs/createCustomizationInputs.js';
import BlockMediator from '../../../scripts/block-mediator.min.js';
import createDrawerContentPaperType from '../createComponents/drawerContent/createDrawerContentPaperType.js';
import { createCheckoutButtonHref } from '../createComponents/createProductDetailsSection.js';
import { createPriceLockup } from '../createComponents/createProductInfoHeadingSection.js';

function formatProductOptionsToAPIParameters(formDataObject) {
  const parameters = {};
  for (const [key, value] of Object.entries(formDataObject)) {
    if (key !== 'qty') {
      parameters[key] = value;
    }
  }
  parameters.productOptions = Object.entries(parameters).map(([key, value]) => `${key}=${value}`).join('&');
  parameters.qty = formDataObject.qty;
  const finalParameters = {};
  finalParameters.productOptions = encodeURIComponent(parameters.productOptions);
  finalParameters.qty = parameters.qty;
  return finalParameters;
}

async function updateProductPrice(productDetails) {
  const priceInfoContainer = document.getElementById('pdpx-price-info-container');
  const newPriceLockup = await createPriceLockup(productDetails);
  priceInfoContainer.replaceWith(newPriceLockup);
}

async function updateProductImages(productDetails) {
  const heroImg = document.getElementById('pdpx-product-hero-image');
  const firstImageType = Object.keys(productDetails.realViews)[0];
  let imageType;
  if (productDetails.realViews[heroImg.dataset.imageType]) {
    imageType = heroImg.dataset.imageType;
  } else {
    imageType = firstImageType;
  }
  const newHeroImgSrc = productDetails.realViews[imageType];
  
  heroImg.src = newHeroImgSrc;
  heroImg.dataset.imageType = imageType;
  
  const thumbnailButtons = document.querySelectorAll('.pdpx-image-thumbnail-carousel-item');
  thumbnailButtons.forEach((button) => {
    const btnImageType = button.dataset.imageType;
    if (productDetails.realViews[btnImageType]) {
      const img = button.querySelector('.pdpx-image-thumbnail-carousel-item-image');
      if (img) {
        img.src = productDetails.realViews[btnImageType];
      }
      button.removeAttribute('data-skeleton');
    }
  });
}

async function updateProductDeliveryEstimate(productDetails) {
  document.getElementById('pdpx-delivery-estimate-pill-date').innerHTML = formatDeliveryEstimateDateRange(productDetails.deliveryEstimateMinDate, productDetails.deliveryEstimateMaxDate);
}

async function updateCustomizationOptions(productDetails, formDataObject) {
  const newCustomizationInputs = await createCustomizationInputs(productDetails, formDataObject);
  document.getElementById('pdpx-customization-inputs-container').replaceWith(newCustomizationInputs);
}

async function updatePillTextValues(productDetails) {
  const pillButtons = document.querySelectorAll('.pdpx-pill-container[data-name], .pdpx-mini-pill-container .pdpx-mini-pill-image-container[data-name]');
  
  pillButtons.forEach((pill) => {
    const pillName = pill.dataset.name;
    
    for (const [attrKey, options] of Object.entries(productDetails.attributes || {})) {
      const matchingOption = options.find((opt) => opt.name === pillName);
      if (matchingOption) {
        const nameSpan = pill.querySelector('.pdpx-pill-text-name');
        const priceSpan = pill.querySelector('.pdpx-pill-text-price, .pdpx-mini-pill-price');
        const imgElement = pill.querySelector('.pdpx-pill-image, .pdpx-mini-pill-image');
        
        if (nameSpan) nameSpan.textContent = matchingOption.title || matchingOption.name;
        if (priceSpan) priceSpan.textContent = matchingOption.priceAdjustment || '+US$0.00';
        if (imgElement && matchingOption.thumbnail) imgElement.src = matchingOption.thumbnail;
        break;
      }
    }
  });
}

async function updateCheckoutButton(productDetails, formDataObject) {
  const checkoutButton = document.getElementById('pdpx-checkout-button');
  const url = createCheckoutButtonHref(
    productDetails.templateId,
    formDataObject,
    productDetails.productType,
  );
  checkoutButton.href = url;
}

async function updateDrawerContent(productDetails, formDataObject) {
  const drawer = document.querySelector('#pdpx-drawer');
  if (drawer.classList.contains('hidden')) {
    return;
  }
  if (productDetails.productType === 'zazzle_businesscard') {
    const mediaValue = productDetails.attributes.media.find((v) => v.name === formDataObject.media);
    drawer.innerHTML = '';
    await createDrawerContentPaperType(productDetails.attributes.media, 'Paper Type', 'media', productDetails, mediaValue.name, 'paperType', drawer);
  }
}

function createUpdatedSelectedValuesObject(updatedConfigurationOptions, formDataObject, quantity) {
  const selectedValuesObject = {};
  for (const [key, value] of Object.entries(updatedConfigurationOptions.product.attributes)) {
    const valueName = value.values.find((v) => v.name === formDataObject[key]);
    if (valueName) {
      selectedValuesObject[key] = valueName.name;
    } else {
      selectedValuesObject[key] = value.values[0].name;
    }
  }
  selectedValuesObject.qty = quantity;
  return selectedValuesObject;
}

export default async function updateAllDynamicElements(productId) {
  const { templateId } = document.querySelector('.pdpx-global-container').dataset;
  const form = document.querySelector('#pdpx-customization-inputs-form');
  const formData = new FormData(form);
  const formDataObject = Object.fromEntries(formData.entries());
  const quantity = formDataObject.qty;
  const parameters = formatProductOptionsToAPIParameters(formDataObject);
  const updatedConfigurationOptions = await fetchAPIData(productId, parameters, 'changeoptions');
  const updatedSelectedValuesObject = createUpdatedSelectedValuesObject(
    updatedConfigurationOptions,
    formDataObject,
    quantity,
  );
  const updatedParameters = formatProductOptionsToAPIParameters(updatedSelectedValuesObject);
  const [
    productDetails,
    productPrice,
    productReviews,
    productRenditions,
    productShippingEstimates,
    UIStrings,
  ] = await Promise.all([
    fetchAPIData(productId, updatedParameters, 'getproduct'),
    fetchAPIData(productId, updatedParameters, 'getproductpricing'),
    fetchAPIData(productId, null, 'getreviews'),
    fetchAPIData(productId, updatedParameters, 'getproductrenditions'),
    fetchAPIData(productId, updatedParameters, 'getshippingestimates'),
    fetchUIStrings(),
  ]);
  const normalizeProductDetailsParametersObject = {
    productDetails: updatedConfigurationOptions,
    productPrice,
    productReviews,
    productRenditions,
    productShippingEstimates,
    quantity,
    templateId,
    UIStrings,
  };

  const normalizedProductDetails = await normalizeProductDetailObject(
    normalizeProductDetailsParametersObject,
  );
  for (const [key, value] of Object.entries(formDataObject)) {
    if (normalizedProductDetails.attributes[key]) {
      const valueExists = normalizedProductDetails.attributes[key].some(
        (v) => String(v.name) === String(value) || v.name === value,
      );

      if (!valueExists) {
        // eslint-disable-next-line no-console
        console.warn(`Value "${value}" for "${key}" not found in options, resetting to first option`);
        formDataObject[key] = normalizedProductDetails.attributes[key][0].name;
      }
    }
  }
  await updateCheckoutButton(normalizedProductDetails, formDataObject);
  await updateProductImages(normalizedProductDetails);
  
  const currentAttributeKeys = Object.keys(normalizedProductDetails.attributes || {}).sort().join(',');
  const existingForm = document.querySelector('#pdpx-customization-inputs-form');
  const existingAttributeKeys = existingForm ? existingForm.dataset.attributeKeys || '' : '';
  
  if (currentAttributeKeys !== existingAttributeKeys) {
    await updateCustomizationOptions(normalizedProductDetails, formDataObject);
  } else {
    await updatePillTextValues(normalizedProductDetails);
  }
  
  await updateProductPrice(normalizedProductDetails);
  await updateProductDeliveryEstimate(normalizedProductDetails);
  await updateDrawerContent(normalizedProductDetails, formDataObject);
  // Publish to BlockMediator to trigger accordion updates
  BlockMediator.set('product:updated', {
    productDetails,
    formData: formDataObject,
  });
}
