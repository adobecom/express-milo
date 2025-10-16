import { getLibs } from '../../../scripts/utils.js';
import { fetchAPIData } from '../fetchData/fetchProductDetails.js';
import { formatPriceZazzle, formatDeliveryEstimateDateRange } from '../utilities/utility-functions.js';

let createTag;

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

function calculateAdjustedPrices(productPriceAPIResponse) {
  const quantity = productPriceAPIResponse.discountProductItems[0].applyToQuantity || 1;
  const originalPrice = productPriceAPIResponse.discountProductItems[0].price;
  const { priceAdjusted } = productPriceAPIResponse.discountProductItems[0];
  const productPrice = priceAdjusted * quantity;
  const strikethroughPrice = originalPrice * quantity;
  return { productPrice, strikethroughPrice };
}

async function updateAllDynamicElements(productId) {
  const form = document.querySelector('#pdpx-customization-inputs-form');
  const formData = new FormData(form);
  const formDataObject = Object.fromEntries(formData.entries());
  const parameters = formatProductOptionsToAPIParameters(formDataObject);
  const productPriceAPIResponse = await fetchAPIData(productId, parameters, 'getproductpricing');
  if (productPriceAPIResponse.discountProductItems.length > 0) {
    const { discountString } = productPriceAPIResponse.discountProductItems[0];
    const { productPrice, strikethroughPrice } = calculateAdjustedPrices(productPriceAPIResponse);
    document.getElementById('pdpx-price-label').innerHTML = formatPriceZazzle(productPrice);
    document.getElementById('pdpx-compare-price-label').innerHTML = formatPriceZazzle(strikethroughPrice);
    document.getElementById('pdpx-savings-text').innerHTML = discountString;
  } else {
    const productPrice = productPriceAPIResponse.unitPrice;
    document.getElementById('pdpx-price-label').innerHTML = formatPriceZazzle(productPrice);
  }
  const renditions = await fetchAPIData(productId, parameters, 'getproductrenditions');
  const heroImg = document.getElementById('pdpx-product-hero-image');
  heroImg.src = renditions.realviewUrls[heroImg.dataset.imageType];
  const carouselImages = document.getElementsByClassName('pdpx-image-thumbnail-carousel-item-image');
  for (let i = 0; i < carouselImages.length; i += 1) {
    carouselImages[i].src = renditions.realviewUrls[carouselImages[i].dataset.imageType];
  }
  const shippingEstimates = await fetchAPIData(productId, parameters, 'getshippingestimates');
  document.getElementById('pdpx-delivery-estimate-pill-date').innerHTML = formatDeliveryEstimateDateRange(shippingEstimates.estimates[0].minDeliveryDate, shippingEstimates.estimates[0].maxDeliveryDate);
  console.log(formatDeliveryEstimateDateRange(shippingEstimates.estimates[0].minDeliveryDate, shippingEstimates.estimates[0].maxDeliveryDate));
}

function createStandardSelector(customizationOptions, labelText, hiddenSelectInputName, productId) {
  debugger;
  const standardSelectorContainer = createTag('div', { class: 'pdpx-standard-selector-container' });
  const standardSelectorLabel = createTag('label', { class: 'pdpx-standard-selector-label' }, labelText);
  standardSelectorContainer.appendChild(standardSelectorLabel);
  const standardSelectorInput = createTag('select', { class: 'pdpx-standard-selector', name: hiddenSelectInputName });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const optionLabel = customizationOptions[i].title;
    const standardOption = createTag('option', { value: customizationOptions[i].name, class: 'pdpx-standard-selector-option' }, optionLabel);
    standardSelectorInput.appendChild(standardOption);
  }
  standardSelectorInput.addEventListener('change', (element) => {
    updateAllDynamicElements(productId);
  });
  standardSelectorContainer.appendChild(standardSelectorInput);
  return standardSelectorContainer;
}

function createPillOptionsSelector(customizationOptions, labelText, hiddenSelectInputName, productId) {
  const pillSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const pillSelectorContainerLabel = createTag('span', { class: 'pdpx-pill-selector-label' }, labelText);
  pillSelectorContainer.appendChild(pillSelectorContainerLabel);
  const pillSelectorOptionsContainer = createTag('div', { class: 'pdpx-pill-selector-options-container' });
  const hiddenSelectInput = createTag('select', { class: 'pdpx-hidden-select-input', name: hiddenSelectInputName, id: hiddenSelectInputName });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const option = createTag('option', { value: customizationOptions[i].name }, customizationOptions[i].title);
    hiddenSelectInput.appendChild(option);
    const pillContainer = createTag('button', { class: i === 0 ? 'pdpx-pill-container selected' : 'pdpx-pill-container', type: 'button', 'data-name': customizationOptions[i].name });
    const inputPillImageContainer = createTag('div', { class: 'pdpx-pill-image-container' });
    const inputPillImage = createTag('img', { class: 'pdpx-pill-image', src: customizationOptions[i].thumbnail });
    inputPillImageContainer.appendChild(inputPillImage);
    const inputPillTextContainer = createTag('div', { class: 'pdpx-pill-text-container' });
    const inputPillOptionName = createTag('span', { class: 'pdpx-pill-text-name' }, customizationOptions[i].title);
    const inputPillOptionPrice = createTag('span', { class: 'pdpx-pill-text-price' }, customizationOptions[i].priceAdjustment);
    inputPillTextContainer.appendChild(inputPillOptionName);
    inputPillTextContainer.appendChild(inputPillOptionPrice);
    pillContainer.appendChild(inputPillImageContainer);
    pillContainer.appendChild(inputPillTextContainer);
    pillSelectorOptionsContainer.appendChild(pillContainer);
    // We'll eventually need to add other events such as tab and others for accessibility
    // Ideally selected state is controlled by the hidden select input
    pillContainer.addEventListener('click', async (element) => {
      pillSelectorOptionsContainer.querySelectorAll('.pdpx-pill-container').forEach((pill) => {
        pill.classList.remove('selected');
      });
      element.currentTarget.classList.toggle('selected');
      document.getElementById(hiddenSelectInputName).value = element.currentTarget.getAttribute('data-name');
      updateAllDynamicElements(productId);
    });
  }
  hiddenSelectInput.value = customizationOptions[0].name;
  pillSelectorContainer.appendChild(pillSelectorOptionsContainer);
  pillSelectorContainer.appendChild(hiddenSelectInput);
  return pillSelectorContainer;
}

const createMiniPillOptionsSelector = (customizationOptions, labelText, hiddenSelectInputName, CTALinkText, productId) => {
  const selectedMiniPillOption = customizationOptions[0].name;
  const miniPillSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const miniPillSelectorLabelContainer = createTag('div', { class: 'pdpx-pill-selector-label-container' });
  const miniPillSelectorLabelNameContainer = createTag('div', { class: 'pdpx-pill-selector-label-name-container' });
  const miniPillSelectorLabel = createTag('span', { class: 'pdpx-pill-selector-label-label' }, labelText);
  const miniPillSelectorLabeLName = createTag('span', { class: 'pdpx-pill-selector-label-name' }, selectedMiniPillOption);
  miniPillSelectorLabelNameContainer.appendChild(miniPillSelectorLabel);
  miniPillSelectorLabelNameContainer.appendChild(miniPillSelectorLabeLName);
  miniPillSelectorLabelContainer.appendChild(miniPillSelectorLabelNameContainer);
  if (CTALinkText) {
    const miniPillSelectorLabelCompareLink = createTag('a', { class: 'pdpx-pill-selector-label-compare-link' }, CTALinkText);
    miniPillSelectorLabelContainer.appendChild(miniPillSelectorLabelCompareLink);
  }
  miniPillSelectorContainer.appendChild(miniPillSelectorLabelContainer);
  const miniPillSelectorOptionsContainer = createTag('div', { class: 'pdpx-mini-pill-selector-options-container' });
  const hiddenSelectInput = createTag('select', { class: 'pdpx-hidden-select-input', name: hiddenSelectInputName, id: hiddenSelectInputName });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const option = createTag('option', { value: customizationOptions[i].name }, customizationOptions[i].title);
    hiddenSelectInput.appendChild(option);
    const miniPillOption = createTag('div', { class: 'pdpx-mini-pill-container' });
    const miniPillOptionImageContainer = createTag('button', { class: i === 0 ? 'pdpx-mini-pill-image-container selected' : 'pdpx-mini-pill-image-container', type: 'button', 'data-name': customizationOptions[i].name, 'data-title': customizationOptions[i].title });
    const miniPillOptionImage = createTag('img', { class: 'pdpx-mini-pill-image', src: customizationOptions[i].thumbnail });
    miniPillOptionImageContainer.appendChild(miniPillOptionImage);
    const miniPillOptionTextContainer = createTag('div', { class: 'pdpx-mini-pill-text-container' });
    const miniPillOptionPrice = createTag('span', { class: 'pdpx-mini-pill-price' }, customizationOptions[i].priceAdjustment);
    // We'll eventually need to add other events such as tab and others for accessibility
    // Ideally selected state is controlled by the hidden select input
    miniPillOptionImageContainer.addEventListener('click', async (element) => {
      miniPillSelectorOptionsContainer.querySelectorAll('.pdpx-mini-pill-image-container').forEach((pill) => {
        pill.classList.remove('selected');
      });
      element.currentTarget.classList.toggle('selected');
      miniPillSelectorLabeLName.innerHTML = element.currentTarget.getAttribute('data-title');
      document.getElementById(hiddenSelectInputName).value = element.currentTarget.getAttribute('data-name');
      updateAllDynamicElements(productId);
    });
    hiddenSelectInput.value = customizationOptions[0].name;
    miniPillOptionTextContainer.appendChild(miniPillOptionPrice);
    miniPillOption.appendChild(miniPillOptionImageContainer);
    miniPillOption.appendChild(miniPillOptionTextContainer);
    miniPillSelectorOptionsContainer.appendChild(miniPillOption);
  }
  miniPillSelectorContainer.appendChild(miniPillSelectorOptionsContainer);
  miniPillSelectorContainer.appendChild(hiddenSelectInput);
  return miniPillSelectorContainer;
};

function createBusinessCardInputs(container, productDetails) {
  const sideQuantitySelectorContainer = createPillOptionsSelector(productDetails.sideQuantityOptions, 'Choose the page(s) you want to print', 'sidequantity', productDetails.id);
  const paperTypeSelectorContainer = createMiniPillOptionsSelector(productDetails.media, 'Paper Type: ', 'media', 'Compare Paper Types', productDetails.id);
  const cornerStyleSelectorContainer = createPillOptionsSelector(productDetails.cornerstyle, 'Corner style', 'cornerstyle', productDetails.id);
  const sizeSelectorContainer = createPillOptionsSelector(productDetails.style, 'Resize business card', 'style', productDetails.id);
  const quantitySelectorContainer = createStandardSelector(productDetails.quantities, 'Quantity', 'qty', productDetails.id);
  // container.appendChild(sideQuantitySelectorContainer);
  container.appendChild(paperTypeSelectorContainer);
  container.appendChild(cornerStyleSelectorContainer);
  container.appendChild(sizeSelectorContainer);
  container.appendChild(quantitySelectorContainer);
}

function createTShirtInputs(container, productDetails) {
  const styleSelectorContainer = createPillOptionsSelector(productDetails.style, 'T-Shirt', 'style', productDetails.id);
  const colorSelectorContainer = createMiniPillOptionsSelector(productDetails.color, 'Shirt color: ', 'color', '', productDetails.id);
  const quantitySelectorContainer = createStandardSelector(productDetails.quantities, 'Quantity', 'qty', productDetails.id);
  const sizeSelectorContainer = createStandardSelector(productDetails.size, 'Size', 'size', productDetails.id);
  container.appendChild(styleSelectorContainer);
  container.appendChild(colorSelectorContainer);
  container.appendChild(quantitySelectorContainer);
  container.appendChild(sizeSelectorContainer);
}

export default async function createCustomizationInputs(productDetails) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const customizationInputsContainer = createTag('div', { class: 'pdpx-customization-inputs-container' });
  const customizationInputsForm = createTag('form', { class: 'pdpx-customization-inputs-form', id: 'pdpx-customization-inputs-form' });
  customizationInputsContainer.appendChild(customizationInputsForm);
  const productTypeToInputsMap = new Map([
    ['zazzle_businesscard', createBusinessCardInputs],
    ['zazzle_shirt', createTShirtInputs],
  ]);
  const createInputsFunction = productTypeToInputsMap.get(productDetails.productType);
  createInputsFunction(customizationInputsForm, productDetails);

  return customizationInputsContainer;
}
