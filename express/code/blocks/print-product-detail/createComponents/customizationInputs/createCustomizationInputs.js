import { getLibs } from '../../../../scripts/utils.js';
import updateAllDynamicElements from '../../utilities/event-handlers.js';
import openDrawer from '../drawerContent/openDrawer.js';
import createSegmentedMiniPillOptionsSelector from './createSegmentedMiniPillOptionsSelector.js';
import createMiniPillOptionsSelector from './createMiniPillOptionsSelector.js';

let createTag;

function createStandardSelector(
  customizationOptions,
  labelText,
  hiddenSelectInputName,
  productDetails,
  formDataObject,
  CTAText,
) {
  const defaultValue = formDataObject[hiddenSelectInputName];
  const standardSelectorContainer = createTag('div', { class: 'pdpx-standard-selector-container' });
  standardSelectorContainer.appendChild(
    createTag('label', { class: 'pdpx-standard-selector-label', for: `pdpx-standard-selector-${hiddenSelectInputName}` }, labelText),
  );
  const standardSelectorInputContainer = createTag('div', { class: 'pdpx-standard-selector-input-container' });
  const standardSelectorInput = createTag('select', {
    class: 'pdpx-standard-selector',
    name: hiddenSelectInputName,
    id: `pdpx-standard-selector-${hiddenSelectInputName}`,
  });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const optionLabel = customizationOptions[i].title;
    const standardOption = createTag('option', { value: customizationOptions[i].name, class: 'pdpx-standard-selector-option' }, optionLabel);
    standardSelectorInput.appendChild(standardOption);
  }
  standardSelectorInput.value = defaultValue;
  standardSelectorInput.addEventListener('change', () => {
    updateAllDynamicElements(productDetails.id);
  });
  standardSelectorInputContainer.appendChild(standardSelectorInput);
  standardSelectorContainer.appendChild(standardSelectorInputContainer);
  let isTriBlend = false;
  if (productDetails.productType === 'zazzle_shirt') {
    isTriBlend = formDataObject.style === 'triblend_shortsleeve3413';
  }
  if (CTAText && isTriBlend) {
    const standardSelectorCTA = createTag('button', { class: 'pdpx-standard-selector-cta', type: 'button' }, CTAText);
    standardSelectorCTA.addEventListener('click', async () => {
      await openDrawer(customizationOptions, labelText, hiddenSelectInputName, productDetails, defaultValue, 'sizeChart');
    });
    standardSelectorInputContainer.appendChild(standardSelectorCTA);
  }
  return standardSelectorContainer;
}

function createPillOptionsSelector(
  customizationOptions,
  labelText,
  hiddenSelectInputName,
  productId,
  defaultValue,
) {
  const hiddenSelectInputId = `pdpx-hidden-input-${hiddenSelectInputName}`;
  const selectedPillOption = defaultValue || customizationOptions[0].name;
  const pillSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const pillSelectorContainerLabel = createTag('span', { class: 'pdpx-pill-selector-label' }, labelText);
  pillSelectorContainer.appendChild(pillSelectorContainerLabel);
  const pillSelectorOptionsContainer = createTag('div', { class: 'pdpx-pill-selector-options-container' });
  const hiddenSelectInput = createTag('select', { class: 'pdpx-hidden-select-input', name: hiddenSelectInputName, id: hiddenSelectInputId });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const option = createTag('option', { value: customizationOptions[i].name }, customizationOptions[i].title);
    const isSelected = customizationOptions[i].name === selectedPillOption;
    hiddenSelectInput.appendChild(option);
    const pillContainer = createTag('button', { class: isSelected ? 'pdpx-pill-container selected' : 'pdpx-pill-container', type: 'button', 'data-name': customizationOptions[i].name });
    const inputPillImageContainer = createTag('div', { class: 'pdpx-pill-image-container' });
    const inputPillImage = createTag('img', { class: 'pdpx-pill-image', src: customizationOptions[i].thumbnail });
    inputPillImageContainer.appendChild(inputPillImage);
    const inputPillTextContainer = createTag('div', { class: 'pdpx-pill-text-container' });
    inputPillTextContainer.append(
      createTag('span', { class: 'pdpx-pill-text-name' }, customizationOptions[i].title),
      createTag('span', { class: 'pdpx-pill-text-price' }, customizationOptions[i].priceAdjustment),
    );
    pillContainer.append(inputPillImageContainer, inputPillTextContainer);
    pillSelectorOptionsContainer.appendChild(pillContainer);
    pillContainer.addEventListener('click', async (element) => {
      pillSelectorOptionsContainer.querySelectorAll('.pdpx-pill-container').forEach((pill) => {
        pill.classList.remove('selected');
      });
      element.currentTarget.classList.toggle('selected');
      hiddenSelectInput.value = element.currentTarget.getAttribute('data-name');
      updateAllDynamicElements(productId);
    });
  }
  hiddenSelectInput.value = selectedPillOption;
  pillSelectorContainer.append(pillSelectorOptionsContainer, hiddenSelectInput);
  return pillSelectorContainer;
}

export async function createBusinessCardInputs(container, productDetails, formDataObject = {}) {
  const paperTypeSelectorContainer = await createMiniPillOptionsSelector(productDetails.attributes.media, 'Paper Type', 'media', 'Compare Paper Types', productDetails, formDataObject?.media, 'paperType');
  const cornerStyleSelectorContainer = createPillOptionsSelector(productDetails.attributes.cornerstyle, 'Corner style', 'cornerstyle', productDetails.id, formDataObject?.cornerstyle);
  const sizeSelectorContainer = createPillOptionsSelector(productDetails.attributes.style, 'Resize business card', 'style', productDetails.id, formDataObject?.style);
  const quantitySelectorContainer = createStandardSelector(productDetails.attributes.qty, 'Quantity', 'qty', productDetails, formDataObject, null);
  container.append(
    paperTypeSelectorContainer,
    cornerStyleSelectorContainer,
    sizeSelectorContainer,
    quantitySelectorContainer,
  );
}

export async function createTShirtInputs(container, productDetails, formDataObject = {}) {
  const styleSelectorContainer = createPillOptionsSelector(productDetails.attributes.style, 'T-Shirt', 'style', productDetails.id, formDataObject?.style);
  const colorSelectorContainer = await createSegmentedMiniPillOptionsSelector(productDetails.attributes.color, 'Shirt color', 'color', 'Learn More', productDetails, formDataObject?.color, 'printingProcess');
  const quantitySelectorContainer = createStandardSelector(productDetails.attributes.qty, 'Quantity', 'qty', productDetails, formDataObject, null);
  const sizeSelectorContainer = createStandardSelector(productDetails.attributes.size, 'Size', 'size', productDetails, formDataObject, 'Size chart');
  container.append(
    styleSelectorContainer,
    colorSelectorContainer,
    quantitySelectorContainer,
    sizeSelectorContainer,
  );
}
function createDefaultInputs(container) {
  return container;
}

export default async function createCustomizationInputs(productDetails, formDataObject = {}) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  if (Object.keys(formDataObject).length === 0) {
    for (const [key, values] of Object.entries(productDetails.attributes)) {
      formDataObject[key] = values[0].name;
    }
  }
  const customizationInputsContainer = createTag('div', { class: 'pdpx-customization-inputs-container', id: 'pdpx-customization-inputs-container' });
  const customizationInputsForm = createTag('form', { class: 'pdpx-customization-inputs-form', id: 'pdpx-customization-inputs-form' });
  customizationInputsContainer.appendChild(customizationInputsForm);
  const productTypeToInputsMap = new Map([
    ['default', createDefaultInputs],
    ['zazzle_businesscard', createBusinessCardInputs],
    ['zazzle_shirt', createTShirtInputs],
  ]);
  const createInputsFunction = productTypeToInputsMap.get(productDetails.productType);
  await createInputsFunction(customizationInputsForm, productDetails, formDataObject);
  return customizationInputsContainer;
}
