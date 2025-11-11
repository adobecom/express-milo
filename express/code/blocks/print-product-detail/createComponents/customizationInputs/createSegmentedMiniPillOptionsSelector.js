import { getLibs } from '../../../../scripts/utils.js';
import updateAllDynamicElements from '../../utilities/event-handlers.js';
import openDrawer from '../drawerContent/openDrawer.js';

let createTag;

export default async function createSegmentedMiniPillOptionsSelector(
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
  const labelContainer = createTag('div', { class: 'pdpx-pill-selector-label-container' });
  const labelNameContainer = createTag('div', { class: 'pdpx-pill-selector-label-name-container' });
  const miniPillSelectorLabel = createTag('span', { class: 'pdpx-pill-selector-label-label' }, `${labelText}: `);
  const labelName = createTag('span', { class: 'pdpx-pill-selector-label-name' }, defaultValueOption.title);
  labelNameContainer.append(miniPillSelectorLabel, labelName);
  labelContainer.appendChild(labelNameContainer);
  const optionsContainerWrapper = createTag('div', { class: 'pdpx-mini-pill-selector-options-container-wrapper', role: 'radiogroup', 'aria-label': labelText });
  const classicOptions = customizationOptions.filter((option) => option.printingProcess === 'classic');
  const vividOptions = customizationOptions.filter((option) => option.printingProcess === 'vivid');
  let optionsContainerClassic;
  let optionsContainerVivid;
  if (classicOptions.length > 0) {
    const optionsSectionContainerClassic = createTag('div', { class: 'pdpx-mini-pill-options-section-container' });
    optionsContainerClassic = createTag('div', { class: 'pdpx-mini-pill-selector-options-container', id: 'classic-selector-options-container' });
    optionsSectionContainerClassic.appendChild(
      createTag('span', { class: 'pdpx-pill-selector-section-label', 'aria-label': 'Classic Printing: No Underbase' }, 'Classic Printing: No Underbase'),
    );
    optionsSectionContainerClassic.append(optionsContainerClassic);
    optionsContainerWrapper.append(optionsSectionContainerClassic);
  }
  if (vividOptions.length > 0) {
    const optionsSectionContainerVivid = createTag('div', { class: 'pdpx-mini-pill-options-section-container' });
    optionsContainerVivid = createTag('div', { class: 'pdpx-mini-pill-selector-options-container', id: 'vivid-selector-options-container' });
    optionsSectionContainerVivid.appendChild(
      createTag('span', { class: 'pdpx-pill-selector-section-label', 'aria-label': 'Vivid Printing: White Underbase' }, 'Vivid Printing: White Underbase'),
    );
    optionsSectionContainerVivid.append(optionsContainerVivid);
    optionsContainerWrapper.append(optionsSectionContainerVivid);
  }
  const hiddenSelectInput = createTag('select', {
    class: 'pdpx-hidden-select-input',
    name: hiddenSelectInputName,
    id: `pdpx-hidden-input-${hiddenSelectInputName}`,
    value: defaultValue,
    'aria-hidden': 'true',
  });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const optionsContainer = customizationOptions[i].printingProcess === 'classic' ? optionsContainerClassic : optionsContainerVivid;
    const option = createTag('option', { value: customizationOptions[i].name }, customizationOptions[i].title);
    hiddenSelectInput.appendChild(option);
    const miniPillOption = createTag('div', { class: 'pdpx-mini-pill-container' });
    const miniPillOptionImageContainer = createTag('button', {
      class: `pdpx-mini-pill-image-container ${customizationOptions[i].name === defaultValue ? 'selected' : ''}`,
      type: 'button',
      role: 'radio',
      'data-name': customizationOptions[i].name,
      'data-title': customizationOptions[i].title,
      'aria-label': customizationOptions[i].title,
      'aria-checked': customizationOptions[i].name === defaultValue ? 'true' : 'false',
    });
    const miniPillOptionImage = createTag('img', {
      class: 'pdpx-mini-pill-image',
      alt: `${customizationOptions[i].title}`,
      src: customizationOptions[i].thumbnail,
      width: '46',
      height: '46',
      'aria-hidden': 'true',
      decoding: 'async',
    });
    miniPillOptionImageContainer.appendChild(miniPillOptionImage);
    const miniPillOptionTextContainer = createTag('div', { class: 'pdpx-mini-pill-text-container' });
    const miniPillOptionPrice = createTag('span', { class: 'pdpx-mini-pill-price' }, customizationOptions[i].priceAdjustment);
    miniPillOptionTextContainer.appendChild(miniPillOptionPrice);
    miniPillOptionImageContainer.addEventListener('click', async (element) => {
      document.querySelector(`[name=${hiddenSelectInputName}]`).value = element.currentTarget.getAttribute('data-name');
      updateAllDynamicElements(productDetails.id);
    });
    miniPillOption.append(miniPillOptionImageContainer, miniPillOptionTextContainer);
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
    labelContainer.appendChild(drawerLink);
  }
  miniPillSelectorContainer.append(labelContainer, optionsContainerWrapper, hiddenSelectInput);
  return miniPillSelectorContainer;
}
