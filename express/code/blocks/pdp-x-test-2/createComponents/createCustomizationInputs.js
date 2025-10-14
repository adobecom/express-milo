import { getLibs } from '../../../scripts/utils.js';
import { formatStringSnakeCase } from '../utilities/utility-functions.js';

let createTag;

function createStandardSelector(customizationOptions, labelText, hiddenSelectInputName) {
  const standardSelectorContainer = createTag('div', { class: 'pdpx-standard-selector-container' });
  const standardSelectorLabel = createTag('label', { class: 'pdpx-standard-selector-label' }, labelText);
  standardSelectorContainer.appendChild(standardSelectorLabel);
  const standardSelectorInput = createTag('select', { class: 'pdpx-standard-selector', name: hiddenSelectInputName });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const optionLabel = customizationOptions[i].title;
    const standardOption = createTag('option', { value: customizationOptions[i].name, class: 'pdpx-standard-selector-option' }, optionLabel);
    standardSelectorInput.appendChild(standardOption);
  }
  standardSelectorContainer.appendChild(standardSelectorInput);
  return standardSelectorContainer;
}

function createPillOptionsSelector(customizationOptions, labelText, hiddenSelectInputName) {
  const pillSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const pillSelectorContainerLabel = createTag('span', { class: 'pdpx-pill-selector-label' }, labelText);
  pillSelectorContainer.appendChild(pillSelectorContainerLabel);
  const pillSelectorOptionsContainer = createTag('div', { class: 'pdpx-pill-selector-options-container' });
  const hiddenSelectInput = createTag('select', { class: 'pdpx-hidden-select-input', name: hiddenSelectInputName });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const option = createTag('option', { value: customizationOptions[i].name }, customizationOptions[i].title);
    hiddenSelectInput.appendChild(option);
    const pillContainer = createTag('button', { class: 'pdpx-pill-container' });
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
  }
  pillSelectorContainer.appendChild(pillSelectorOptionsContainer);
  pillSelectorContainer.appendChild(hiddenSelectInput);
  return pillSelectorContainer;
}

const createMiniPillOptionsSelector = (customizationOptions, labelText, hiddenSelectInputName, CTALinkText) => {
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
  const hiddenSelectInput = createTag('select', { class: 'pdpx-hidden-select-input', name: hiddenSelectInputName });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const option = createTag('option', { value: customizationOptions[i].name }, customizationOptions[i].title);
    hiddenSelectInput.appendChild(option);
    const miniPillOption = createTag('div', { class: 'pdpx-mini-pill-container' });
    const miniPillOptionImageContainer = createTag('div', { class: 'pdpx-mini-pill-image-container', 'data-name': customizationOptions[i].name, 'data-title': customizationOptions[i].title });
    const miniPillOptionImage = createTag('img', { class: 'pdpx-mini-pill-image', src: customizationOptions[i].thumbnail });
    miniPillOptionImageContainer.appendChild(miniPillOptionImage);
    const miniPillOptionTextContainer = createTag('div', { class: 'pdpx-mini-pill-text-container' });
    const miniPillOptionPrice = createTag('span', { class: 'pdpx-mini-pill-price' }, customizationOptions[i].priceAdjustment);
    miniPillOptionImageContainer.addEventListener('click', (element) => {
      element.currentTarget.classList.add('selected');
      miniPillSelectorLabeLName.innerHTML = element.currentTarget.getAttribute('data-title');
    });
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
  const paperTypeSelectorContainer = createMiniPillOptionsSelector(productDetails.media, 'Paper Type: ', 'paper_type', 'Compare Paper Types');
  const cornerStyleSelectorContainer = createPillOptionsSelector(productDetails.cornerstyle, 'Corner style', 'corner_style');
  const sizeSelectorContainer = createPillOptionsSelector(productDetails.style, 'Resize business card', 'size');
  const quantitySelectorContainer = createStandardSelector(productDetails.quantities, 'Quantity', 'quantity');
  container.appendChild(paperTypeSelectorContainer);
  container.appendChild(cornerStyleSelectorContainer);
  container.appendChild(sizeSelectorContainer);
  container.appendChild(quantitySelectorContainer);
}

function createTShirtInputs(container, productDetails) {
  const styleSelectorContainer = createPillOptionsSelector(productDetails.style, 'T-Shirt', 'style');
  const quantitySelectorContainer = createStandardSelector(productDetails, 'Quantity', 'quantity');
  container.appendChild(styleSelectorContainer);
  container.appendChild(quantitySelectorContainer);
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
