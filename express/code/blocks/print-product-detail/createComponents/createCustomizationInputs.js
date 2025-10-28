import { getLibs } from '../../../scripts/utils.js';
import updateAllDynamicElements from '../utilities/event-handlers.js';
import { updatePaperSelectionUI } from './createDrawer.js';

let createTag;

function createStandardSelector(
  customizationOptions,
  labelText,
  hiddenSelectInputName,
  productId,
  defaultValue,
) {
  const selectedOption = defaultValue || customizationOptions[0].name;
  const standardSelectorContainer = createTag('div', { class: 'pdpx-standard-selector-container' });
  const standardSelectorLabel = createTag('label', { class: 'pdpx-standard-selector-label' }, labelText);
  standardSelectorContainer.appendChild(standardSelectorLabel);
  const standardSelectorInput = createTag('select', { class: 'pdpx-standard-selector', name: hiddenSelectInputName });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const optionLabel = customizationOptions[i].title;
    const standardOption = createTag('option', { value: customizationOptions[i].name, class: 'pdpx-standard-selector-option' }, optionLabel);
    standardSelectorInput.appendChild(standardOption);
  }
  standardSelectorInput.addEventListener('change', () => {
    updateAllDynamicElements(productId);
  });
  standardSelectorInput.value = selectedOption;
  standardSelectorContainer.appendChild(standardSelectorInput);
  return standardSelectorContainer;
}

function createPillOptionsSelector(
  customizationOptions,
  labelText,
  hiddenSelectInputName,
  productId,
  defaultValue,
  comparisonDrawer = null,
) {
  const selectedPillOption = defaultValue || customizationOptions[0].name;
  const pillSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const pillSelectorLabelContainer = createTag('div', { class: 'pdpx-pill-selector-label-container' });
  const pillSelectorContainerLabel = createTag('span', { class: 'pdpx-pill-selector-label' }, labelText);
  pillSelectorLabelContainer.appendChild(pillSelectorContainerLabel);

  if (hiddenSelectInputName === 'printingprocess') {
    const learnMoreLink = createTag('button', {
      class: 'pdpx-pill-selector-label-compare-link',
      type: 'button',
    }, 'Learn more');
    learnMoreLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (comparisonDrawer) {
        comparisonDrawer.drawer.classList.remove('hidden');
        comparisonDrawer.curtain.classList.remove('hidden');
        document.body.classList.add('disable-scroll');
      }
    });
    pillSelectorLabelContainer.appendChild(learnMoreLink);
  }

  pillSelectorContainer.appendChild(pillSelectorLabelContainer);
  const pillSelectorOptionsContainer = createTag('div', { class: 'pdpx-pill-selector-options-container' });
  const hiddenSelectInput = createTag('select', { class: 'pdpx-hidden-select-input', name: hiddenSelectInputName, id: hiddenSelectInputName });
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
      document.getElementById(hiddenSelectInputName).value = element.currentTarget.getAttribute('data-name');
      updateAllDynamicElements(productId);
    });
  }
  hiddenSelectInput.value = selectedPillOption;
  pillSelectorContainer.appendChild(pillSelectorOptionsContainer);
  pillSelectorContainer.appendChild(hiddenSelectInput);
  return pillSelectorContainer;
}

function createMiniPillOptionsSelector(
  customizationOptions,
  labelText,
  hiddenSelectInputName,
  CTALinkText,
  productId,
  defaultValue,
) {
  let selectedValueExists = false;
  const miniPillSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const miniPillSelectorLabelContainer = createTag('div', { class: 'pdpx-pill-selector-label-container' });
  const miniPillSelectorLabelNameContainer = createTag('div', { class: 'pdpx-pill-selector-label-name-container' });
  const miniPillSelectorLabel = createTag('span', { class: 'pdpx-pill-selector-label-label' }, labelText);
  miniPillSelectorLabelNameContainer.appendChild(miniPillSelectorLabel);
  miniPillSelectorLabelContainer.appendChild(miniPillSelectorLabelNameContainer);
  miniPillSelectorContainer.appendChild(miniPillSelectorLabelContainer);
  const miniPillSelectorOptionsContainer = createTag('div', { class: 'pdpx-mini-pill-selector-options-container' });
  const hiddenSelectInput = createTag('select', { class: 'pdpx-hidden-select-input', name: hiddenSelectInputName, id: hiddenSelectInputName });

  if (CTALinkText && hiddenSelectInputName === 'media') {
    const miniPillSelectorLabelCompareLink = createTag('button', {
      class: 'pdpx-pill-selector-label-compare-link',
      type: 'button',
      'data-drawer-type': 'paper',
    }, CTALinkText);
    // Store drawer reference on the element for later use
    miniPillSelectorLabelCompareLink.drawerRef = null;
    miniPillSelectorLabelCompareLink.addEventListener('click', () => {
      // Use stored drawer reference if available
      if (miniPillSelectorLabelCompareLink.drawerRef) {
        // Sync drawer state with current form value before opening
        const currentMediaValue = hiddenSelectInput.value;
        const { drawer } = miniPillSelectorLabelCompareLink.drawerRef;
        const drawerBody = drawer.querySelector('.drawer-body--paper-selection');

        if (drawerBody && currentMediaValue) {
          // Find the paper data to update UI
          const selector = `.paper-selection-thumb[data-paper-name="${currentMediaValue}"]`;
          const selectedThumb = drawerBody.querySelector(selector);

          if (selectedThumb) {
            // Build cached elements object for the shared update function
            const cachedElements = {
              heroImage: drawerBody.querySelector('.paper-selection-hero'),
              paperName: drawerBody.querySelector('.paper-selection-name'),
              paperTypeLabel: drawerBody.querySelector('.paper-selection-type-label'),
              description: drawerBody.querySelector('.paper-selection-description'),
              specsRow: drawerBody.querySelector('.paper-selection-specs'),
              titleRow: drawerBody.querySelector('.paper-selection-title-row'),
            };

            // Build footer elements object
            const footerElements = {
              image: drawer.querySelector('.drawer-foot img'),
              name: drawer.querySelector('.info-name'),
              price: drawer.querySelector('.info-price'),
            };

            // Use shared update function with error handling
            updatePaperSelectionUI(drawerBody, selectedThumb, cachedElements, footerElements);
          }
        }

        miniPillSelectorLabelCompareLink.drawerRef.drawer.classList.remove('hidden');
        miniPillSelectorLabelCompareLink.drawerRef.curtain.classList.remove('hidden');
        document.body.classList.add('disable-scroll');
      }
    });
    miniPillSelectorLabelContainer.appendChild(miniPillSelectorLabelCompareLink);
  }

  for (let i = 0; i < customizationOptions.length; i += 1) {
    const option = createTag('option', { value: customizationOptions[i].name }, customizationOptions[i].title);
    if (customizationOptions[i].name === defaultValue) {
      selectedValueExists = customizationOptions[i].name;
    }
    hiddenSelectInput.appendChild(option);
    const miniPillOption = createTag('div', { class: 'pdpx-mini-pill-container' });
    const miniPillOptionImageContainer = createTag('button', { class: 'pdpx-mini-pill-image-container', type: 'button', 'data-name': customizationOptions[i].name, 'data-title': customizationOptions[i].title });
    const miniPillOptionImage = createTag('img', { class: 'pdpx-mini-pill-image', src: customizationOptions[i].thumbnail });
    miniPillOptionImageContainer.appendChild(miniPillOptionImage);
    const miniPillOptionTextContainer = createTag('div', { class: 'pdpx-mini-pill-text-container' });
    const miniPillOptionPrice = createTag('span', { class: 'pdpx-mini-pill-price' }, customizationOptions[i].priceAdjustment);
    miniPillOptionImageContainer.addEventListener('click', async (e) => {
      miniPillSelectorOptionsContainer.querySelectorAll('.pdpx-mini-pill-image-container').forEach((pill) => {
        pill.classList.remove('selected');
      });
      e.currentTarget.classList.toggle('selected');
      const labelNameSpan = miniPillSelectorLabelNameContainer.querySelector('.pdpx-pill-selector-label-name');
      labelNameSpan.innerHTML = e.currentTarget.getAttribute('data-title');
      document.getElementById(hiddenSelectInputName).value = e.currentTarget.getAttribute('data-name');
      updateAllDynamicElements(productId);
    });
    miniPillOptionTextContainer.appendChild(miniPillOptionPrice);
    miniPillOption.appendChild(miniPillOptionImageContainer);
    miniPillOption.appendChild(miniPillOptionTextContainer);
    miniPillSelectorOptionsContainer.appendChild(miniPillOption);
  }
  hiddenSelectInput.value = selectedValueExists || customizationOptions[0].name;
  const selector = `.pdpx-mini-pill-image-container[data-name="${hiddenSelectInput.value}"]`;
  const selectedMiniPillOptionImageContainer = miniPillSelectorOptionsContainer
    .querySelector(selector);
  selectedMiniPillOptionImageContainer.classList.add('selected');
  const miniPillSelectorLabeLName = createTag(
    'span',
    { class: 'pdpx-pill-selector-label-name' },
    selectedMiniPillOptionImageContainer.dataset.title,
  );
  miniPillSelectorLabelNameContainer.appendChild(miniPillSelectorLabeLName);
  miniPillSelectorContainer.appendChild(miniPillSelectorOptionsContainer);
  miniPillSelectorContainer.appendChild(hiddenSelectInput);
  return miniPillSelectorContainer;
}

function createBusinessCardInputs(
  container,
  productDetails,
  formDataObject = {},
  paperDrawer = null,
) {
  const paperTypeSelectorContainer = createMiniPillOptionsSelector(
    productDetails.attributes.media,
    'Paper Type: ',
    'media',
    'Compare Paper Types',
    productDetails.id,
    formDataObject?.media,
  );

  // Set drawer reference on the "Compare Paper Types" link
  if (paperDrawer) {
    const compareLink = paperTypeSelectorContainer.querySelector('.pdpx-pill-selector-label-compare-link');
    if (compareLink) {
      compareLink.drawerRef = paperDrawer;
    }
  }
  const cornerStyleSelectorContainer = createPillOptionsSelector(
    productDetails.attributes.cornerstyle,
    'Corner style',
    'cornerstyle',
    productDetails.id,
    formDataObject?.cornerstyle,
    null,
  );
  const sizeSelectorContainer = createPillOptionsSelector(
    productDetails.attributes.style,
    'Resize business card',
    'style',
    productDetails.id,
    formDataObject?.style,
    null,
  );
  const quantitySelectorContainer = createStandardSelector(
    productDetails.attributes.quantities,
    'Quantity',
    'qty',
    productDetails.id,
    formDataObject?.qty,
  );
  container.appendChild(paperTypeSelectorContainer);
  container.appendChild(cornerStyleSelectorContainer);
  container.appendChild(sizeSelectorContainer);
  container.appendChild(quantitySelectorContainer);
}

function createTShirtInputs(
  container,
  productDetails,
  formDataObject = {},
  comparisonDrawer = null,
  sizeChartDrawer = null,
) {
  const printingProcessSelectorContainer = createPillOptionsSelector(
    productDetails.attributes.printingprocess,
    'Printing Process',
    'printingprocess',
    productDetails.id,
    formDataObject?.printingprocess,
    comparisonDrawer,
  );
  const styleSelectorContainer = createPillOptionsSelector(
    productDetails.attributes.style,
    'T-Shirt',
    'style',
    productDetails.id,
    formDataObject?.style,
    comparisonDrawer,
  );
  const colorSelectorContainer = createMiniPillOptionsSelector(
    productDetails.attributes.color,
    'Shirt color: ',
    'color',
    '',
    productDetails.id,
    formDataObject?.color,
  );
  const quantitySelectorContainer = createStandardSelector(
    productDetails.attributes.quantities,
    'Quantity',
    'qty',
    productDetails.id,
    formDataObject?.qty,
  );
  const sizeSelectorContainer = createStandardSelector(
    productDetails.attributes.size,
    'Size',
    'size',
    productDetails.id,
    formDataObject?.size,
  );

  container.appendChild(printingProcessSelectorContainer);
  container.appendChild(styleSelectorContainer);
  container.appendChild(colorSelectorContainer);
  container.appendChild(quantitySelectorContainer);
  container.appendChild(sizeSelectorContainer);

  // Add Size Chart link as a sibling if drawer is available
  if (sizeChartDrawer) {
    const sizeChartLink = createTag('button', {
      class: 'pdpx-size-chart-link',
      type: 'button',
    }, 'Size Chart');

    sizeChartLink.addEventListener('click', () => {
      sizeChartDrawer.drawer.classList.remove('hidden');
      sizeChartDrawer.curtain.classList.remove('hidden');
      document.body.classList.add('disable-scroll');
    });

    container.appendChild(sizeChartLink);
  }
}

export default async function createCustomizationInputs(
  productDetails,
  formDataObject = {},
  comparisonDrawer = null,
  sizeChartDrawer = null,
  paperDrawer = null,
) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const customizationInputsContainer = createTag('div', {
    class: 'pdpx-customization-inputs-container',
    id: 'pdpx-customization-inputs-container',
  });
  const customizationInputsForm = createTag('form', {
    class: 'pdpx-customization-inputs-form',
    id: 'pdpx-customization-inputs-form',
  });
  customizationInputsContainer.appendChild(customizationInputsForm);
  const productTypeToInputsMap = new Map([
    ['zazzle_businesscard', (c, pd, fd, papDrawer) => createBusinessCardInputs(c, pd, fd, papDrawer)],
    ['zazzle_shirt', (c, pd, fd, cd, scd) => createTShirtInputs(c, pd, fd, cd, scd)],
  ]);
  const createInputsFunction = productTypeToInputsMap.get(productDetails.productType);

  if (createInputsFunction) {
    if (productDetails.productType === 'zazzle_businesscard') {
      createInputsFunction(
        customizationInputsForm,
        productDetails,
        formDataObject,
        paperDrawer,
      );
    } else {
      createInputsFunction(
        customizationInputsForm,
        productDetails,
        formDataObject,
        comparisonDrawer,
        sizeChartDrawer,
      );
    }
  }
  return customizationInputsContainer;
}
