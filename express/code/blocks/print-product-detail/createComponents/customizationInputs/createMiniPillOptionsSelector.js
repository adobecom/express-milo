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
  const productId = productDetails.id;
  let selectedValue = false;
  const hiddenSelectInputId = `pdpx-hidden-input-${hiddenSelectInputName}`;
  const miniPillSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const labelContainer = createTag('div', { class: 'pdpx-pill-selector-label-container' });
  const labelNameContainer = createTag('div', { class: 'pdpx-pill-selector-label-name-container' });
  const miniPillSelectorLabel = createTag('span', { class: 'pdpx-pill-selector-label-label' }, `${labelText}: `);
  labelNameContainer.appendChild(miniPillSelectorLabel);
  labelContainer.appendChild(labelNameContainer);
  if (CTALinkText) {
    const miniPillSelectorLabelCompareLink = createTag('button', { class: 'pdpx-pill-selector-label-compare-link', type: 'button' }, CTALinkText);
    miniPillSelectorLabelCompareLink.addEventListener('click', async () => {
      await openDrawer(
        customizationOptions,
        labelText,
        hiddenSelectInputName,
        productDetails,
        defaultValue,
        drawerType,
      );
    });
    labelContainer.appendChild(miniPillSelectorLabelCompareLink);
  }
  miniPillSelectorContainer.appendChild(labelContainer);
  const optionsContainer = createTag('div', { class: 'pdpx-mini-pill-selector-options-container', role: 'radiogroup', 'aria-label': labelText });
  const hiddenSelectInput = createTag('select', { class: 'pdpx-hidden-select-input', name: hiddenSelectInputName, id: hiddenSelectInputId, 'aria-hidden': 'true' });
  const labelName = createTag('span', { class: 'pdpx-pill-selector-label-name' });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const option = createTag('option', { value: customizationOptions[i].name }, customizationOptions[i].title);
    if (customizationOptions[i].name === defaultValue) {
      selectedValue = customizationOptions[i].name;
    }
    hiddenSelectInput.appendChild(option);
    const miniPillOption = createTag('div', { class: 'pdpx-mini-pill-container' });
    const optionImageContainer = createTag('button', { class: 'pdpx-mini-pill-image-container',
      type: 'button',
      'data-name': customizationOptions[i].name,
      'data-title': customizationOptions[i].title,
      role: 'radio',
      'aria-label': customizationOptions[i].title,
      'aria-checked': false,
    });
    const altTextMiniPill = `${customizationOptions[i].title}`;
    const optionImage = createTag('img', {
      class: 'pdpx-mini-pill-image',
      alt: altTextMiniPill,
      src: customizationOptions[i].thumbnail,
      width: '48',
      height: '48',
      'aria-hidden': 'true',
      decoding: 'async',
    });
    optionImageContainer.appendChild(optionImage);
    const miniPillOptionTextContainer = createTag('div', { class: 'pdpx-mini-pill-text-container' });
    const miniPillOptionPrice = createTag('span', { class: 'pdpx-mini-pill-price' }, customizationOptions[i].priceAdjustment);
    optionImageContainer.addEventListener('click', async (element) => {
      optionsContainer.querySelectorAll('.pdpx-mini-pill-image-container').forEach((pill) => {
        pill.classList.remove('selected');
        pill.setAttribute('aria-checked', 'false');
      });
      element.currentTarget.classList.add('selected');
      element.currentTarget.setAttribute('aria-checked', 'true');
      labelName.textContent = element.currentTarget.getAttribute('data-title');
      const allInputs = document.querySelectorAll(`[name=${hiddenSelectInputName}]`);
      allInputs.forEach((input) => {
        input.value = element.currentTarget.getAttribute('data-name');
      });
      updateAllDynamicElements(productId);
    });
    miniPillOptionTextContainer.appendChild(miniPillOptionPrice);
    miniPillOption.append(optionImageContainer, miniPillOptionTextContainer);
    optionsContainer.appendChild(miniPillOption);
  }

  hiddenSelectInput.value = selectedValue || customizationOptions[0].name;

  const selectedPill = optionsContainer.querySelector(`.pdpx-mini-pill-image-container[data-name="${hiddenSelectInput.value}"]`);
  selectedPill.classList.add('selected');
  selectedPill.setAttribute('aria-checked', 'true');
  labelName.textContent = selectedPill.dataset.title;
  labelNameContainer.appendChild(labelName);
  miniPillSelectorContainer.append(optionsContainer, hiddenSelectInput);
  return miniPillSelectorContainer;
}
