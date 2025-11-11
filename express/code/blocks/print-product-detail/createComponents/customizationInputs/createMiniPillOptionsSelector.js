import { getLibs } from '../../../../scripts/utils.js';
import updateAllDynamicElements from '../../utilities/event-handlers.js';
import openDrawer from '../drawerContent/openDrawer.js';

let createTag;

export default async function createMiniPillOptionsSelector(
  customizationOptions,
  labelText,
  hiddenSelectInputName,
  CTALinkText,
  productDetails,
  defaultValue,
  drawerType,
) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const defaultValueOption = customizationOptions.find((option) => option.name === defaultValue);
  const miniPillSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const labelAndCTAContainer = createTag('div', { class: 'pdpx-pill-selector-label-container' });
  const labelTextContainer = createTag('span', { class: 'pdpx-pill-selector-label-label' }, `${labelText}: `);
  const labelContainer = createTag('div', { class: 'pdpx-pill-selector-label-name-container' });
  const labelName = createTag('span', { class: 'pdpx-pill-selector-label-name' }, defaultValueOption.title);
  labelContainer.append(labelTextContainer, labelName);
  labelAndCTAContainer.appendChild(labelContainer);
  const optionsContainer = createTag('div', { class: 'pdpx-mini-pill-selector-options-container', role: 'radiogroup', 'aria-label': labelText });
  const hiddenSelectInput = createTag('select', {
    class: 'pdpx-hidden-select-input',
    name: hiddenSelectInputName,
    id: `pdpx-hidden-input-${hiddenSelectInputName}`,
    value: defaultValue,
    'aria-hidden': 'true',
  });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const option = createTag('option', { value: customizationOptions[i].name }, customizationOptions[i].title);
    hiddenSelectInput.appendChild(option);
    const miniPillOption = createTag('div', { class: 'pdpx-mini-pill-container' });
    const optionButton = createTag('button', {
      class: `pdpx-mini-pill-image-container ${customizationOptions[i].name === defaultValue ? 'selected' : ''}`,
      type: 'button',
      'data-name': customizationOptions[i].name,
      'data-title': customizationOptions[i].title,
      role: 'radio',
      'aria-label': customizationOptions[i].title,
      'aria-checked': customizationOptions[i].name === defaultValue ? 'true' : 'false',
    });
    const optionImage = createTag('img', {
      class: 'pdpx-mini-pill-image',
      alt: `${customizationOptions[i].title}`,
      src: customizationOptions[i].thumbnail,
      width: '48',
      height: '48',
      'aria-hidden': 'true',
      decoding: 'async',
    });
    optionButton.appendChild(optionImage);
    optionButton.addEventListener('click', async (element) => {
      const allInputs = document.querySelectorAll(`[name=${hiddenSelectInputName}]`);
      allInputs.forEach((input) => {
        input.value = element.currentTarget.getAttribute('data-name');
      });
      updateAllDynamicElements(productDetails.id);
    });
    const optionPriceContainer = createTag('div', { class: 'pdpx-mini-pill-text-container' });
    const optionPrice = createTag('span', { class: 'pdpx-mini-pill-price' }, customizationOptions[i].priceAdjustment);
    optionPriceContainer.appendChild(optionPrice);
    miniPillOption.append(optionButton, optionPriceContainer);
    optionsContainer.appendChild(miniPillOption);
  }
  if (CTALinkText) {
    const drawerLink = createTag('button', { class: 'pdpx-pill-selector-label-compare-link', type: 'button' }, CTALinkText);
    drawerLink.addEventListener('click', async () => {
      await openDrawer(
        customizationOptions,
        labelText,
        hiddenSelectInputName,
        productDetails,
        defaultValue,
        drawerType,
      );
    });
    labelAndCTAContainer.appendChild(drawerLink);
  }
  miniPillSelectorContainer.append(labelAndCTAContainer, optionsContainer, hiddenSelectInput);
  return miniPillSelectorContainer;
}
