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

function createSideQuantitySelector() {
  const mockAPIData = {
    sideQuantityptions: [
      {
        thumbnail: 'https://placehold.co/54',
        name: 'Double-sided',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/54',
        name: 'Single-sided',
        priceAdjustment: '-US$5.95',
      },
    ],
  };
  // Investigate whether these options should be dynamic / API driven
  const pillSelectorLabelText = 'Choose the page(s) you want to print';
  const pillSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const pillSelectorContainerLabel = createTag('span', { class: 'pdpx-pill-selector-label' }, pillSelectorLabelText);
  pillSelectorContainer.appendChild(pillSelectorContainerLabel);
  const pillSelectorOptionsContainer = createTag('div', { class: 'pdpx-pill-selector-options-container' });
  for (let i = 0; i < mockAPIData.sideQuantityptions.length; i += 1) {
    const pillContainer = createTag('button', { class: 'pdpx-pill-container' });
    const inputPillImageContainer = createTag('div', { class: 'pdpx-pill-image-container' });
    const inputPillImage = createTag('img', { class: 'pdpx-pill-image', src: mockAPIData.sideQuantityptions[i].thumbnail });
    inputPillImageContainer.appendChild(inputPillImage);
    const inputPillTextContainer = createTag('div', { class: 'pdpx-pill-text-container' });
    const inputPillOptionName = createTag('span', { class: 'pdpx-pill-text-name' }, mockAPIData.sideQuantityptions[i].name);
    const inputPillOptionPrice = createTag('span', { class: 'pdpx-pill-text-price' }, mockAPIData.sideQuantityptions[i].priceAdjustment);
    inputPillTextContainer.appendChild(inputPillOptionName);
    inputPillTextContainer.appendChild(inputPillOptionPrice);
    pillContainer.appendChild(inputPillImageContainer);
    pillContainer.appendChild(inputPillTextContainer);
    pillSelectorOptionsContainer.appendChild(pillContainer);
  }

  pillSelectorContainer.appendChild(pillSelectorOptionsContainer);

  return pillSelectorContainer;
}

const createPaperTypeSelector = () => {
  const mockAPIData = {
    paperTypeOptions: [
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Standard Matte',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Standard Gloss',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Paper Type 3',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Paper Type 4',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Paper Type 5',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Paper Type 6',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Paper Type 7',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Paper Type 8',
        priceAdjustment: '+$0.00',
      },
      {
        thumbnail: 'https://placehold.co/48',
        name: 'Paper Type 9',
        priceAdjustment: '+$0.00',
      },
    ],
  };
  const selectedPaperType = mockAPIData.paperTypeOptions[0].name;
  const paperTypeSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const paperTypeSelectorLabelContainer = createTag('div', { class: 'pdpx-pill-selector-label-container' });
  const paperTypeSelectorLabelNameContainer = createTag('div', { class: 'pdpx-pill-selector-label-name-container' });
  const paperTypeSelectorLabel = createTag('span', { class: 'pdpx-pill-selector-label-label' }, 'Paper Type: ');
  const paperTypeSelectorLabeLName = createTag('span', { class: 'pdpx-pill-selector-label-name' }, selectedPaperType);
  const paperTypeSelectorLabelCompareLink = createTag('a', { class: 'pdpx-pill-selector-label-compare-link' }, 'Compare Paper Types');
  paperTypeSelectorLabelNameContainer.appendChild(paperTypeSelectorLabel);
  paperTypeSelectorLabelNameContainer.appendChild(paperTypeSelectorLabeLName);
  paperTypeSelectorLabelContainer.appendChild(paperTypeSelectorLabelNameContainer);
  paperTypeSelectorLabelContainer.appendChild(paperTypeSelectorLabelCompareLink);
  paperTypeSelectorContainer.appendChild(paperTypeSelectorLabelContainer);
  const paperTypeSelectorOptionsContainer = createTag('div', { class: 'pdpx-pill-selector-options-container' });
  for (let i = 0; i < mockAPIData.paperTypeOptions.length; i += 1) {
    const paperTypeOption = createTag('div', { class: 'pdpx-mini-pill-container' });
    const paperTypeOptionImageContainer = createTag('div', { class: 'pdpx-mini-pill-image-container' });
    const paperTypeOptionImage = createTag('img', { class: 'pdpx-mini-pill-image', src: mockAPIData.paperTypeOptions[i].thumbnail });
    paperTypeOptionImageContainer.appendChild(paperTypeOptionImage);
    const paperTypeOptionTextContainer = createTag('div', { class: 'pdpx-mini-pill-text-container' });
    const paperTypeOptionPrice = createTag('span', { class: 'pdpx-mini-pill-price' }, mockAPIData.paperTypeOptions[i].priceAdjustment);
    paperTypeOptionTextContainer.appendChild(paperTypeOptionPrice);
    paperTypeOption.appendChild(paperTypeOptionImageContainer);
    paperTypeOption.appendChild(paperTypeOptionTextContainer);
    paperTypeSelectorOptionsContainer.appendChild(paperTypeOption);
  }
  paperTypeSelectorContainer.appendChild(paperTypeSelectorOptionsContainer);
  return paperTypeSelectorContainer;
};

function createBusinessCardInputs(container) {
  const pillSelectorContainer = createSideQuantitySelector();
  const paperTypeSelectorContainer = createPaperTypeSelector();
  container.appendChild(pillSelectorContainer);
  container.appendChild(paperTypeSelectorContainer);
}

export default async function createCustomizationInputs(productDetails) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const customizationInputsContainer = createTag('div', { class: 'pdpx-customization-inputs-container' });
  // create a Map object that maps the product type to the function that creates the inputs
  const productTypeToInputsMap = new Map([
    ['zazzle_businesscard', createBusinessCardInputs],
  ]);
  const createInputsFunction = productTypeToInputsMap.get(productDetails.productType);
  createInputsFunction(customizationInputsContainer);

  return customizationInputsContainer;
}
