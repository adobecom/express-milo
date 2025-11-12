import { getLibs } from '../../../../scripts/utils.js';
import updateAllDynamicElements from '../../utilities/event-handlers.js';
import openDrawer from '../drawerContent/openDrawer.js';
import createSimpleCarousel from '../../../../scripts/widgets/simple-carousel.js';

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
  let selectedValueExists = false;
  const hiddenSelectInputId = `pdpx-hidden-input-${hiddenSelectInputName}`;
  const miniPillSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const miniPillSelectorLabelContainer = createTag('div', { class: 'pdpx-pill-selector-label-container' });
  const miniPillSelectorLabelNameContainer = createTag('div', { class: 'pdpx-pill-selector-label-name-container' });
  const miniPillSelectorLabel = createTag('span', { class: 'pdpx-pill-selector-label-label' }, `${labelText}: `);
  miniPillSelectorLabelNameContainer.appendChild(miniPillSelectorLabel);
  miniPillSelectorLabelContainer.appendChild(miniPillSelectorLabelNameContainer);
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
    miniPillSelectorLabelContainer.appendChild(miniPillSelectorLabelCompareLink);
  }
  miniPillSelectorContainer.appendChild(miniPillSelectorLabelContainer);
  const miniPillSelectorOptionsWrapper = createTag('div', { class: 'pdpx-mini-pill-selector-options-wrapper' });
  const miniPillSelectorOptionsContainer = createTag('div', { class: 'pdpx-mini-pill-selector-options-container' });
  const hiddenSelectInput = createTag('select', { class: 'pdpx-hidden-select-input', name: hiddenSelectInputName, id: hiddenSelectInputId });
  const miniPillSelectorLabelName = createTag('span', { class: 'pdpx-pill-selector-label-name' });
  for (let i = 0; i < customizationOptions.length; i += 1) {
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
      miniPillSelectorOptionsWrapper.querySelectorAll('.pdpx-mini-pill-image-container').forEach((pill) => {
        pill.classList.remove('selected');
      });
      element.currentTarget.classList.toggle('selected');
      miniPillSelectorLabelName.innerHTML = element.currentTarget.getAttribute('data-title');
      const allInputs = document.querySelectorAll(`[name=${hiddenSelectInputName}]`);
      allInputs.forEach((input) => {
        input.value = element.currentTarget.getAttribute('data-name');
      });
      updateAllDynamicElements(productId);
    });
    miniPillOptionTextContainer.appendChild(miniPillOptionPrice);
    miniPillOption.appendChild(miniPillOptionImageContainer, miniPillOptionTextContainer);
    miniPillSelectorOptionsContainer.appendChild(miniPillOption);
  }
  hiddenSelectInput.value = selectedValueExists || customizationOptions[0].name;
  const selectedMiniPillOptionImageContainer = miniPillSelectorOptionsContainer.querySelector(`.pdpx-mini-pill-image-container[data-name="${hiddenSelectInput.value}"]`);
  selectedMiniPillOptionImageContainer.classList.add('selected');
  miniPillSelectorLabelName.textContent = selectedMiniPillOptionImageContainer.dataset.title;
  miniPillSelectorLabelNameContainer.appendChild(miniPillSelectorLabelName);
  miniPillSelectorOptionsWrapper.appendChild(miniPillSelectorOptionsContainer);

  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  if (isMobile) {
    await createSimpleCarousel('.pdpx-mini-pill-container', miniPillSelectorOptionsWrapper, {
      ariaLabel: `${labelText} options`,
      centerActive: false,
      activeClass: 'selected',
    });
  }

  miniPillSelectorContainer.append(miniPillSelectorOptionsWrapper, hiddenSelectInput);
  return miniPillSelectorContainer;
}
