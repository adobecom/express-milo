import { getLibs } from '../../../scripts/utils.js';
import { fetchAPIData } from '../fetchData/fetchProductDetails.js';
import { formatPriceZazzle, formatStringSnakeCase } from '../utilities/utility-functions.js';
import BlockMediator from '../utilities/BlockMediator.js';
import { toggleDrawer } from '../utilities/event-handlers.js';

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
  const quantity = productPriceAPIResponse.discountProductItems[0].applyToQuantity;
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
  
  // Fetch updated product data
  const [productPriceAPIResponse, shippingEstimates, renditions, productDetails] = await Promise.all([
    fetchAPIData(productId, parameters, 'getproductpricing'),
    fetchAPIData(productId, parameters, 'getshippingestimates'),
    fetchAPIData(productId, parameters, 'getproductrenditions'),
    fetchAPIData(productId, parameters, 'getproduct'),
  ]);
  
  // Update price
  if (productPriceAPIResponse.discountProductItems.length > 0) {
    const { discountString } = productPriceAPIResponse.discountProductItems[0];
    const { productPrice, strikethroughPrice } = calculateAdjustedPrices(productPriceAPIResponse);
    document.getElementById('pdpx-compare-price-label').innerHTML = formatPriceZazzle(strikethroughPrice);
    document.getElementById('pdpx-savings-text').innerHTML = discountString;
    document.getElementById('pdpx-price-label').innerHTML = formatPriceZazzle(productPrice);
  } else {
    const productPrice = productPriceAPIResponse.unitPrice;
    document.getElementById('pdpx-price-label').innerHTML = formatPriceZazzle(productPrice);
  }
  
  // Update images
  document.getElementById('pdpx-product-hero-image').src = renditions.realviewUrls.Front;
  const carouselImages = document.getElementsByClassName('pdpx-image-thumbnail-carousel-item-image');
  for (let i = 0; i < carouselImages.length; i += 1) {
    carouselImages[i].src = renditions.realviewUrls[carouselImages[i].dataset.imageType];
  }
  
  // Publish event with updated product details
  BlockMediator.publish('product:updated', {
    productDetails,
    formData: formDataObject,
    shippingEstimates,
  });
}

function createStandardSelector(customizationOptions, labelText, hiddenSelectInputName, productId, defaultValue) {
  const selectedOption = defaultValue || customizationOptions[0].name;
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
  standardSelectorInput.value = selectedOption;
  standardSelectorContainer.appendChild(standardSelectorInput);
  return standardSelectorContainer;
}

function createPillOptionsSelector(customizationOptions, labelText, hiddenSelectInputName, productId, defaultValue) {
  const selectedPillOption = defaultValue || customizationOptions[0].name;
  const pillSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const pillSelectorContainerLabel = createTag('span', { class: 'pdpx-pill-selector-label' }, labelText);
  pillSelectorContainer.appendChild(pillSelectorContainerLabel);
  const pillSelectorOptionsContainer = createTag('div', { class: 'pdpx-pill-selector-options-container' });
  const hiddenSelectInput = createTag('select', { class: 'pdpx-hidden-select-input', name: hiddenSelectInputName, id: hiddenSelectInputName });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const option = createTag('option', { value: customizationOptions[i].name }, customizationOptions[i].title);
    const isSelected = customizationOptions[i].name === selectedPillOption;
    hiddenSelectInput.appendChild(option);
    const pillContainer = createTag('button', { class: isSelected ? 'pdpx-pill-container selected' : 'pdpx-pill-container', type: 'button', 'data-name': customizationOptions[i].name });
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
    pillContainer.addEventListener('click', async (element) => {
      pillSelectorOptionsContainer.querySelectorAll('.pdpx-pill-container').forEach((pill) => {
        pill.classList.remove('selected');
      });
      element.currentTarget.classList.toggle('selected');
      document.getElementById(hiddenSelectInputName).value = element.currentTarget.getAttribute('data-name');
      updateAllDynamicElements(productId);
    });
  }
  hiddenSelectInput.value = selectedPillOption;
  pillSelectorContainer.appendChild(pillSelectorOptionsContainer);
  pillSelectorContainer.appendChild(hiddenSelectInput);
  return pillSelectorContainer;
}

function createMiniPillOptionsSelector(customizationOptions, labelText, hiddenSelectInputName, CTALinkText, productId, defaultValue) {
  let selectedValueExists = false;
  const miniPillSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const miniPillSelectorLabelContainer = createTag('div', { class: 'pdpx-pill-selector-label-container' });
  const miniPillSelectorLabelNameContainer = createTag('div', { class: 'pdpx-pill-selector-label-name-container' });
  const miniPillSelectorLabel = createTag('span', { class: 'pdpx-pill-selector-label-label' }, labelText);
  miniPillSelectorLabelNameContainer.appendChild(miniPillSelectorLabel);
  miniPillSelectorLabelContainer.appendChild(miniPillSelectorLabelNameContainer);
  if (CTALinkText) {
    const miniPillSelectorLabelCompareLink = createTag('button', { class: 'pdpx-pill-selector-label-compare-link', type: 'button' }, CTALinkText);
    miniPillSelectorLabelCompareLink.addEventListener('click', toggleDrawer);
    miniPillSelectorLabelContainer.appendChild(miniPillSelectorLabelCompareLink);
  }
  miniPillSelectorContainer.appendChild(miniPillSelectorLabelContainer);
  const miniPillSelectorOptionsContainer = createTag('div', { class: 'pdpx-mini-pill-selector-options-container' });
  const hiddenSelectInput = createTag('select', { class: 'pdpx-hidden-select-input', name: hiddenSelectInputName, id: hiddenSelectInputName });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const option = createTag('option', { value: customizationOptions[i].name }, customizationOptions[i].title);
    if (customizationOptions[i].name === defaultValue) {
      selectedValueExists = customizationOptions[i].name;
    }
    hiddenSelectInput.appendChild(option);
    const miniPillOption = createTag('div', { class: 'pdpx-mini-pill-container' });
    const miniPillOptionImageContainer = createTag('button', { class: 'pdpx-mini-pill-image-container', type: 'button', 'data-name': customizationOptions[i].name, 'data-title': customizationOptions[i].title });
    const miniPillOptionImage = createTag('img', { class: 'pdpx-mini-pill-image', src: customizationOptions[i].thumbnail });
    miniPillOptionImageContainer.appendChild(miniPillOptionImage);
    const miniPillOptionTextContainer = createTag('div', { class: 'pdpx-mini-pill-text-container' });
    const miniPillOptionPrice = createTag('span', { class: 'pdpx-mini-pill-price' }, customizationOptions[i].priceAdjustment || '');
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
    miniPillOptionTextContainer.appendChild(miniPillOptionPrice);
    miniPillOption.appendChild(miniPillOptionImageContainer);
    miniPillOption.appendChild(miniPillOptionTextContainer);
    miniPillSelectorOptionsContainer.appendChild(miniPillOption);
  }
  hiddenSelectInput.value = selectedValueExists || customizationOptions[0].name;
  const selectedMiniPillOptionImageContainer = miniPillSelectorOptionsContainer.querySelector(`.pdpx-mini-pill-image-container[data-name="${hiddenSelectInput.value}"]`);
  selectedMiniPillOptionImageContainer.classList.add('selected');
  const miniPillSelectorLabeLName = createTag('span', { class: 'pdpx-pill-selector-label-name' }, selectedMiniPillOptionImageContainer.dataset.title);
  miniPillSelectorLabelNameContainer.appendChild(miniPillSelectorLabeLName);
  miniPillSelectorContainer.appendChild(miniPillSelectorOptionsContainer);
  miniPillSelectorContainer.appendChild(hiddenSelectInput);
  return miniPillSelectorContainer;
}

function createBusinessCardInputs(container, productDetails, formDataObject = {}) {
  const sideQuantitySelectorContainer = createPillOptionsSelector(productDetails.sideQuantityOptions, 'Choose the page(s) you want to print', 'sidequantity', productDetails.id, formDataObject?.sidequantity);
  const paperTypeSelectorContainer = createMiniPillOptionsSelector(productDetails.media, 'Paper Type: ', 'media', 'Compare Paper Types', productDetails.id, formDataObject?.media);
  const cornerStyleSelectorContainer = createPillOptionsSelector(productDetails.cornerstyle, 'Corner style', 'cornerstyle', productDetails.id, formDataObject?.cornerstyle);
  const sizeSelectorContainer = createPillOptionsSelector(productDetails.style, 'Resize business card', 'style', productDetails.id, formDataObject?.style);
  const quantitySelectorContainer = createStandardSelector(productDetails.quantities, 'Quantity', 'qty', productDetails.id, formDataObject?.qty);
  // container.appendChild(sideQuantitySelectorContainer);
  container.appendChild(paperTypeSelectorContainer);
  container.appendChild(cornerStyleSelectorContainer);
  container.appendChild(sizeSelectorContainer);
  container.appendChild(quantitySelectorContainer);
}

function createTShirtInputs(container, productDetails, formDataObject = {}) {
  const printingProcessSelectorContainer = createPillOptionsSelector(productDetails.printingProcessOptions, 'Printing Process', 'printingprocess', productDetails.id, formDataObject?.printingprocess);
  const styleSelectorContainer = createPillOptionsSelector(productDetails.style, 'T-Shirt', 'style', productDetails.id, formDataObject?.style);
  const colorSelectorContainer = createMiniPillOptionsSelector(productDetails.color, 'Shirt color: ', 'color', '', productDetails.id, formDataObject?.color);
  const quantitySelectorContainer = createStandardSelector(productDetails.quantities, 'Quantity', 'qty', productDetails.id, formDataObject?.qty);
  const sizeSelectorContainer = createStandardSelector(productDetails.size, 'Size', 'size', productDetails.id, formDataObject?.size);

  container.appendChild(printingProcessSelectorContainer);
  container.appendChild(styleSelectorContainer);
  container.appendChild(colorSelectorContainer);
  container.appendChild(quantitySelectorContainer);
  container.appendChild(sizeSelectorContainer);
}

export default async function createCustomizationInputs(productDetails, formDataObject = {}) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const customizationInputsContainer = createTag('div', { class: 'pdpx-customization-inputs-container', id: 'pdpx-customization-inputs-container' });
  const customizationInputsForm = createTag('form', { class: 'pdpx-customization-inputs-form', id: 'pdpx-customization-inputs-form' });
  customizationInputsContainer.appendChild(customizationInputsForm);
  const productTypeToInputsMap = new Map([
    ['zazzle_businesscard', createBusinessCardInputs],
    ['zazzle_shirt', createTShirtInputs],
  ]);
  const createInputsFunction = productTypeToInputsMap.get(productDetails.productType);
  createInputsFunction(customizationInputsForm, productDetails, formDataObject);
  return customizationInputsContainer;
}
