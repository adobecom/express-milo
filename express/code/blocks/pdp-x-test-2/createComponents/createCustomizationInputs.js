import { getLibs } from '../../../scripts/utils.js';

let createTag;

function createQuantitySelector() {
  const quantitySelector = createTag('div', { class: 'pdpx-quantity-selector' });
  const quantitySelectorLabel = createTag('label', { class: 'pdpx-quantity-selector-label' }, 'Quantity');
  quantitySelector.appendChild(quantitySelectorLabel);
  const quantitySelectorInput = createTag('input', { class: 'pdpx-quantity-selector-input', type: 'number' });
  quantitySelector.appendChild(quantitySelectorInput);
  return quantitySelector;
}

function createPillOptionsSelector(customizationOptions, labelText) {
  const pillSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const pillSelectorContainerLabel = createTag('span', { class: 'pdpx-pill-selector-label' }, labelText);
  pillSelectorContainer.appendChild(pillSelectorContainerLabel);
  const pillSelectorOptionsContainer = createTag('div', { class: 'pdpx-pill-selector-options-container' });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const pillContainer = createTag('button', { class: 'pdpx-pill-container' });
    const inputPillImageContainer = createTag('div', { class: 'pdpx-pill-image-container' });
    const inputPillImage = createTag('img', { class: 'pdpx-pill-image', src: customizationOptions[i].thumbnail });
    inputPillImageContainer.appendChild(inputPillImage);
    const inputPillTextContainer = createTag('div', { class: 'pdpx-pill-text-container' });
    const inputPillOptionName = createTag('span', { class: 'pdpx-pill-text-name' }, customizationOptions[i].name);
    const inputPillOptionPrice = createTag('span', { class: 'pdpx-pill-text-price' }, customizationOptions[i].priceAdjustment);
    inputPillTextContainer.appendChild(inputPillOptionName);
    inputPillTextContainer.appendChild(inputPillOptionPrice);
    pillContainer.appendChild(inputPillImageContainer);
    pillContainer.appendChild(inputPillTextContainer);
    pillSelectorOptionsContainer.appendChild(pillContainer);
  }
  pillSelectorContainer.appendChild(pillSelectorOptionsContainer);
  return pillSelectorContainer;
}

const createPaperTypeSelector = (customizationOptions, labelText) => {
  const selectedPaperType = customizationOptions[0].name;
  const paperTypeSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const paperTypeSelectorLabelContainer = createTag('div', { class: 'pdpx-pill-selector-label-container' });
  const paperTypeSelectorLabelNameContainer = createTag('div', { class: 'pdpx-pill-selector-label-name-container' });
  const paperTypeSelectorLabel = createTag('span', { class: 'pdpx-pill-selector-label-label' }, labelText);
  const paperTypeSelectorLabeLName = createTag('span', { class: 'pdpx-pill-selector-label-name' }, selectedPaperType);
  const paperTypeSelectorLabelCompareLink = createTag('a', { class: 'pdpx-pill-selector-label-compare-link' }, 'Compare Paper Types');
  paperTypeSelectorLabelNameContainer.appendChild(paperTypeSelectorLabel);
  paperTypeSelectorLabelNameContainer.appendChild(paperTypeSelectorLabeLName);
  paperTypeSelectorLabelContainer.appendChild(paperTypeSelectorLabelNameContainer);
  paperTypeSelectorLabelContainer.appendChild(paperTypeSelectorLabelCompareLink);
  paperTypeSelectorContainer.appendChild(paperTypeSelectorLabelContainer);
  const paperTypeSelectorOptionsContainer = createTag('div', { class: 'pdpx-pill-selector-options-container' });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const paperTypeOption = createTag('div', { class: 'pdpx-mini-pill-container' });
    const paperTypeOptionImageContainer = createTag('div', { class: 'pdpx-mini-pill-image-container' });
    const paperTypeOptionImage = createTag('img', { class: 'pdpx-mini-pill-image', src: customizationOptions[i].thumbnail });
    paperTypeOptionImageContainer.appendChild(paperTypeOptionImage);
    const paperTypeOptionTextContainer = createTag('div', { class: 'pdpx-mini-pill-text-container' });
    const paperTypeOptionPrice = createTag('span', { class: 'pdpx-mini-pill-price' }, customizationOptions[i].priceAdjustment);
    paperTypeOptionTextContainer.appendChild(paperTypeOptionPrice);
    paperTypeOption.appendChild(paperTypeOptionImageContainer);
    paperTypeOption.appendChild(paperTypeOptionTextContainer);
    paperTypeSelectorOptionsContainer.appendChild(paperTypeOption);
  }
  paperTypeSelectorContainer.appendChild(paperTypeSelectorOptionsContainer);
  return paperTypeSelectorContainer;
};

function createBusinessCardInputs(container, productDetails) {
  const sideQuantityLabelText = 'Choose the page(s) you want to print';
  const paperTypeLabelText = 'Paper Type: ';
  const cornerStyleLabelText = 'Corner style';
  const sizeLabelText = 'Resize business card';
  const sideQuantitySelectorContainer = createPillOptionsSelector(productDetails.sideQuantityptions, sideQuantityLabelText);
  const paperTypeSelectorContainer = createPaperTypeSelector(productDetails.paperTypeOptions, paperTypeLabelText);
  const cornerStyleSelectorContainer = createPillOptionsSelector(productDetails.cornerStyleOptions, cornerStyleLabelText);
  const sizeSelectorContainer = createPillOptionsSelector(productDetails.sizeOptions, sizeLabelText);
  const quantitySelectorContainer = createQuantitySelector();
  container.appendChild(sideQuantitySelectorContainer);
  container.appendChild(paperTypeSelectorContainer);
  container.appendChild(cornerStyleSelectorContainer);
  container.appendChild(sizeSelectorContainer);
  container.appendChild(quantitySelectorContainer);
}

export default async function createCustomizationInputs(productDetails) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const customizationInputsContainer = createTag('div', { class: 'pdpx-customization-inputs-container' });
  // create a Map object that maps the product type to the function that creates the inputs
  const productTypeToInputsMap = new Map([
    ['zazzle_businesscard', createBusinessCardInputs],
  ]);
  const createInputsFunction = productTypeToInputsMap.get(productDetails.productType);
  createInputsFunction(customizationInputsContainer, productDetails);

  return customizationInputsContainer;
}
