import { getLibs } from '../../../scripts/utils.js';
import updateAllDynamicElements, { toggleDrawer } from '../utilities/event-handlers.js';

let createTag;

export default async function createSegmentedMiniPillOptionsSelector(customizationOptions, labelText, hiddenSelectInputName, CTALinkText, productId, defaultValue, drawerType) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  let selectedValueExists = false;
  const miniPillSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const miniPillSelectorLabelContainer = createTag('div', { class: 'pdpx-pill-selector-label-container' });
  const miniPillSelectorLabelNameContainer = createTag('div', { class: 'pdpx-pill-selector-label-name-container' });
  const miniPillSelectorLabel = createTag('span', { class: 'pdpx-pill-selector-label-label' }, `${labelText}: `);
  miniPillSelectorLabelNameContainer.appendChild(miniPillSelectorLabel);
  miniPillSelectorLabelContainer.appendChild(miniPillSelectorLabelNameContainer);
  if (CTALinkText) {
    const miniPillSelectorLabelCompareLink = createTag('button', { class: 'pdpx-pill-selector-label-compare-link', type: 'button', 'data-drawer-type': drawerType }, CTALinkText);
    miniPillSelectorLabelCompareLink.addEventListener('click', async () => {
      await toggleDrawer(drawerType);
    });
    miniPillSelectorLabelContainer.appendChild(miniPillSelectorLabelCompareLink);
  }
  miniPillSelectorContainer.appendChild(miniPillSelectorLabelContainer);
  const miniPillSelectorOptionsContainerWrapper = createTag('div', { class: 'pdpx-mini-pill-selector-options-container-wrapper' });
  const miniPillOptionsSectionContainerClassic = createTag('div', { class: 'pdpx-mini-pill-options-section-container' });
  const miniPillOptionsSectionContainerVivid = createTag('div', { class: 'pdpx-mini-pill-options-section-container' });
  const miniPillSelectorOptionsContainerClassic = createTag('div', { class: 'pdpx-mini-pill-selector-options-container', id: 'classic-selector-options-container' });
  const miniPillSelectorLabelNameClassic = createTag('span', { class: 'pdpx-pill-selector-section-label' }, 'Classic Printing: No Underbase');
  miniPillOptionsSectionContainerClassic.appendChild(miniPillSelectorLabelNameClassic);
  const miniPillSelectorOptionsContainerVivid = createTag('div', { class: 'pdpx-mini-pill-selector-options-container', id: 'vivid-selector-options-container' });
  const miniPillSelectorLabelNameVivid = createTag('span', { class: 'pdpx-pill-selector-section-label' }, 'Vivid Printing: White Underbase');
  miniPillOptionsSectionContainerVivid.appendChild(miniPillSelectorLabelNameVivid);
  miniPillOptionsSectionContainerClassic.append(miniPillSelectorOptionsContainerClassic);
  miniPillOptionsSectionContainerVivid.append(miniPillSelectorOptionsContainerVivid);
  miniPillSelectorOptionsContainerWrapper.append(miniPillOptionsSectionContainerClassic, miniPillOptionsSectionContainerVivid);
  const hiddenSelectInput = createTag('select', { class: 'pdpx-hidden-select-input', name: hiddenSelectInputName, id: hiddenSelectInputName });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const miniPillSelectorOptionsContainer = customizationOptions[i].printingProcess === 'classic' ? miniPillSelectorOptionsContainerClassic : miniPillSelectorOptionsContainerVivid;
    const option = createTag('option', { value: customizationOptions[i].name }, customizationOptions[i].title);
    if (customizationOptions[i].name === defaultValue) {
      selectedValueExists = customizationOptions[i].name;
    }
    hiddenSelectInput.appendChild(option);
    const miniPillOption = createTag('div', { class: 'pdpx-mini-pill-container' });
    const miniPillOptionImageContainer = createTag('button', { class: 'pdpx-mini-pill-image-container', type: 'button', 'data-name': customizationOptions[i].name, 'data-title': customizationOptions[i].title });
    const altTextMiniPill = `${labelText} Option Image Thumbnail: ${customizationOptions[i].title}`;
    const miniPillOptionImage = createTag('img', { class: 'pdpx-mini-pill-image', alt: altTextMiniPill, src: customizationOptions[i].thumbnail });
    miniPillOptionImageContainer.appendChild(miniPillOptionImage);
    const miniPillOptionTextContainer = createTag('div', { class: 'pdpx-mini-pill-text-container' });
    const miniPillOptionPrice = createTag('span', { class: 'pdpx-mini-pill-price' }, customizationOptions[i].priceAdjustment);
    miniPillOptionImageContainer.addEventListener('click', async (element) => {
      miniPillSelectorOptionsContainer.querySelectorAll('.pdpx-mini-pill-image-container').forEach((pill) => {
        pill.classList.remove('selected');
      });
      element.currentTarget.classList.toggle('selected');
      miniPillSelectorLabelName.innerHTML = element.currentTarget.getAttribute('data-title');
      document.getElementById(hiddenSelectInputName).value = element.currentTarget.getAttribute('data-name');
      updateAllDynamicElements(productId);
    });
    miniPillOptionTextContainer.appendChild(miniPillOptionPrice);
    miniPillOption.appendChild(miniPillOptionImageContainer);
    miniPillOption.appendChild(miniPillOptionTextContainer);
    miniPillSelectorOptionsContainer.appendChild(miniPillOption);
  }
  hiddenSelectInput.value = selectedValueExists || customizationOptions[0].name;
  const selectedMiniPillOptionImageContainer = miniPillSelectorOptionsContainerWrapper.querySelector(`.pdpx-mini-pill-image-container[data-name="${hiddenSelectInput.value}"]`);
  selectedMiniPillOptionImageContainer.classList.add('selected');
  const miniPillSelectorLabelName = createTag('span', { class: 'pdpx-pill-selector-label-name' }, selectedMiniPillOptionImageContainer.dataset.title);
  miniPillSelectorLabelNameContainer.appendChild(miniPillSelectorLabelName);
  miniPillSelectorContainer.appendChild(miniPillSelectorOptionsContainerWrapper);
  miniPillSelectorContainer.appendChild(hiddenSelectInput);
  return miniPillSelectorContainer;
}
