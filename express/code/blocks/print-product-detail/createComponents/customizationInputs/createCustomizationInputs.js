import { getLibs } from '../../../../scripts/utils.js';
import updateAllDynamicElements from '../../utilities/event-handlers.js';
import openDrawer from '../drawerContent/openDrawer.js';
import createSegmentedMiniPillOptionsSelector from './createSegmentedMiniPillOptionsSelector.js';
import createMiniPillOptionsSelector from './createMiniPillOptionsSelector.js';
import { createPicker } from '../../../../scripts/widgets/picker.js';

let createTag;

async function createStandardSelector(
  customizationOptions,
  labelText,
  hiddenSelectInputName,
  productDetails,
  formDataObject,
  CTAText,
) {
  let defaultValue = formDataObject[hiddenSelectInputName];
  const isDefaultValueAnOptionName = customizationOptions
    .some((option) => option.name === defaultValue);
  if (isDefaultValueAnOptionName) {
    defaultValue = customizationOptions.find((option) => option.name === defaultValue).name;
  }
  const selectedOption = defaultValue || customizationOptions[0].name;
  const productId = productDetails.id;

  const options = customizationOptions.map((option) => ({
    value: option.name,
    text: option.title,
  }));

  const pickerContainer = await createPicker({
    id: `pdpx-standard-selector-${hiddenSelectInputName}`,
    name: hiddenSelectInputName,
    label: labelText,
    labelPosition: 'side',
    options,
    defaultValue: selectedOption,
    onChange: () => {
      updateAllDynamicElements(productId);
    },
  });

  let isTriBlend = false;
  if (productDetails.productType === 'zazzle_shirt') {
    isTriBlend = formDataObject.style === 'triblend_shortsleeve3413';
  }
  if (CTAText && isTriBlend) {
    const wrapper = createTag('div', { class: 'picker-with-link' });
    wrapper.appendChild(pickerContainer);

    const standardSelectorCTA = createTag('button', { class: 'picker-link', type: 'button' }, CTAText);
    standardSelectorCTA.addEventListener('click', async () => {
      await openDrawer(customizationOptions, labelText, hiddenSelectInputName, productDetails, defaultValue, 'sizeChart');
    });
    wrapper.appendChild(standardSelectorCTA);

    return wrapper;
  }
  return pickerContainer;
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
      hiddenSelectInput.value = element.currentTarget.getAttribute('data-name');
      updateAllDynamicElements(productId);
    });
  }
  hiddenSelectInput.value = selectedPillOption;
  pillSelectorContainer.appendChild(pillSelectorOptionsContainer);
  pillSelectorContainer.appendChild(hiddenSelectInput);
  return pillSelectorContainer;
}

export async function createBusinessCardInputs(container, productDetails, formDataObject = {}) {
  const paperTypeSelectorContainer = await createMiniPillOptionsSelector(productDetails.attributes.media, 'Paper Type', 'media', 'Compare Paper Types', productDetails, formDataObject?.media, 'paperType');
  const cornerStyleSelectorContainer = createPillOptionsSelector(productDetails.attributes.cornerstyle, 'Corner style', 'cornerstyle', productDetails.id, formDataObject?.cornerstyle);
  const sizeSelectorContainer = createPillOptionsSelector(productDetails.attributes.style, 'Resize business card', 'style', productDetails.id, formDataObject?.style);
  const quantitySelectorContainer = await createStandardSelector(productDetails.attributes.qty, 'Quantity', 'qty', productDetails, formDataObject, null);
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
  const quantitySelectorContainer = await createStandardSelector(productDetails.attributes.qty, 'Quantity', 'qty', productDetails, formDataObject, null);
  const sizeSelectorContainer = await createStandardSelector(productDetails.attributes.size, 'Size', 'size', productDetails, formDataObject, 'Size chart');

  const pickerGroup = createTag('div', { class: 'picker-group' });
  pickerGroup.append(quantitySelectorContainer, sizeSelectorContainer);

  container.append(
    styleSelectorContainer,
    colorSelectorContainer,
    pickerGroup,
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
