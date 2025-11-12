import fetchAPIData, { fetchUIStrings } from '../fetchData/fetchProductDetails.js';
import { formatDeliveryEstimateDateRange, convertImageSize, createHeroImageSrcset } from './utility-functions.js';
import { normalizeProductDetailObject } from './data-formatting.js';
import createCustomizationInputs from '../createComponents/customizationInputs/createCustomizationInputs.js';
import BlockMediator from '../../../scripts/block-mediator.min.js';
import { createCheckoutButtonHref } from '../createComponents/createProductDetailsSection.js';
import { createPriceLockup } from '../createComponents/createProductInfoHeadingSection.js';

function formatProductOptionsToAPIParameters(formDataObject) {
  const parameters = {};
  for (const [key, value] of Object.entries(formDataObject)) {
    if (key !== 'qty') {
      parameters[key] = value;
    }
  }
  parameters.productOptions = Object.entries(parameters).map(([key, value]) => `${key}=${value}`).join('&');
  parameters.qty = formDataObject.qty;
  const finalParameters = {};
  finalParameters.productOptions = encodeURIComponent(parameters.productOptions);
  finalParameters.qty = parameters.qty;
  return finalParameters;
}

async function updateProductPrice(productDetails) {
  const priceInfoContainer = document.getElementById('pdpx-price-info-container');
  const newPriceLockup = await createPriceLockup(productDetails);
  priceInfoContainer.replaceWith(newPriceLockup);
}

async function updateProductImages(productDetails) {
  if (!productDetails?.realViews || Object.keys(productDetails.realViews).length === 0) {
    return;
  }

  const heroImg = document.getElementById('pdpx-product-hero-image');
  if (!heroImg) return;

  const firstImageType = Object.keys(productDetails.realViews)[0];
  let imageType;
  if (productDetails.realViews[heroImg.dataset.imageType]) {
    imageType = heroImg.dataset.imageType;
  } else {
    imageType = firstImageType;
  }
  const newHeroImgSrc = productDetails.realViews[imageType];

  if (newHeroImgSrc) {
    const currentSrc = heroImg.src;
    const newSrc = convertImageSize(newHeroImgSrc, '500');
    const newSrcset = createHeroImageSrcset(newHeroImgSrc);

    // Only update if the image URL has changed
    if (currentSrc !== newSrc || heroImg.srcset !== newSrcset) {
      heroImg.srcset = newSrcset;
      heroImg.src = newSrc;
      heroImg.dataset.imageType = imageType;
    }
  }

  // Update all thumbnails with new data
  const thumbnailButtons = document.querySelectorAll('.pdpx-image-thumbnail-carousel-item');
  thumbnailButtons.forEach((button) => {
    const btnImageType = button.dataset.imageType;
    if (productDetails.realViews[btnImageType]) {
      const img = button.querySelector('.pdpx-image-thumbnail-carousel-item-image');
      if (img) {
        const newThumbnailSrc = convertImageSize(productDetails.realViews[btnImageType], '100');
        // Only update if the image URL has changed
        if (img.src !== newThumbnailSrc) {
          img.src = newThumbnailSrc;
        }
      }
      button.removeAttribute('data-skeleton');
    }
  });
}

async function updateProductDeliveryEstimate(productDetails) {
  const dateElement = document.getElementById('pdpx-delivery-estimate-pill-date');
  if (dateElement) {
    dateElement.textContent = formatDeliveryEstimateDateRange(
      productDetails.deliveryEstimateMinDate,
      productDetails.deliveryEstimateMaxDate,
    );
  }
}

async function updateCustomizationOptions(productDetails, formDataObject) {
  const newCustomizationInputs = await createCustomizationInputs(productDetails, formDataObject);
  document.getElementById('pdpx-customization-inputs-container').replaceWith(newCustomizationInputs);
}

async function updatePillTextValues(productDetails) {
  const form = document.querySelector('#pdpx-customization-inputs-form');
  const formData = new FormData(form);
  const formDataObject = Object.fromEntries(formData.entries());
  const pillButtons = document.querySelectorAll(
    '.pdpx-pill-container[data-name], .pdpx-mini-pill-container .pdpx-mini-pill-image-container[data-name]',
  );

  const pillSelectorContainers = new Set();
  pillButtons.forEach((pill) => {
    const pillSelectorContainer = pill.closest('.pdpx-pill-selector-container');
    if (pillSelectorContainer) {
      pillSelectorContainers.add(pillSelectorContainer);
    }
  });

  pillSelectorContainers.forEach((pillSelectorContainer) => {
    const hiddenSelectInput = pillSelectorContainer.querySelector('.pdpx-hidden-select-input');
    if (!hiddenSelectInput) return;
    const inputName = hiddenSelectInput.name;
    const selectedValue = formDataObject[inputName] || hiddenSelectInput.value;
    const pillContainer = pillSelectorContainer.querySelector('.pdpx-pill-selector-options-container');

    if (pillContainer && selectedValue) {
      pillContainer.querySelectorAll('.pdpx-pill-container, .pdpx-mini-pill-image-container').forEach((p) => {
        p.classList.remove('selected');
        p.removeAttribute('aria-current');
        p.setAttribute('aria-checked', 'false');
      });

      const selectedPill = pillContainer.querySelector(`[data-name="${selectedValue}"]`);
      if (selectedPill) {
        selectedPill.classList.add('selected');
        selectedPill.setAttribute('aria-current', 'true');
        selectedPill.setAttribute('aria-checked', 'true');
      }
    }
  });

  pillButtons.forEach((pill) => {
    const pillName = pill.dataset.name;

    for (const options of Object.values(productDetails.attributes || {})) {
      const matchingOption = options.find((opt) => opt.name === pillName);
      if (matchingOption) {
        const nameSpan = pill.querySelector('.pdpx-pill-text-name');
        const priceSpan = pill.querySelector('.pdpx-pill-text-price, .pdpx-mini-pill-price');
        const imgElement = pill.querySelector('.pdpx-pill-image, .pdpx-mini-pill-image');

        if (nameSpan) nameSpan.textContent = matchingOption.title || matchingOption.name;
        if (priceSpan) priceSpan.textContent = matchingOption.priceAdjustment || '+US$0.00';
        if (imgElement && matchingOption.thumbnail) imgElement.src = matchingOption.thumbnail;
        break;
      }
    }
  });

  const selectedPills = document.querySelectorAll('.pdpx-pill-container.selected[data-name], .pdpx-mini-pill-image-container.selected[data-name]');
  selectedPills.forEach((selectedPill) => {
    const { title: pillTitle } = selectedPill.dataset;

    const pillSelectorContainer = selectedPill.closest('.pdpx-pill-selector-container');
    if (pillSelectorContainer) {
      const labelNameElement = pillSelectorContainer.querySelector('.pdpx-pill-selector-label-name');
      if (labelNameElement && pillTitle) {
        labelNameElement.textContent = pillTitle;
      }
    }
  });
}

async function updateCheckoutButton(productDetails, formDataObject) {
  const checkoutButton = document.getElementById('pdpx-checkout-button');
  const url = createCheckoutButtonHref(
    productDetails.templateId,
    formDataObject,
    productDetails.productType,
  );
  checkoutButton.href = url;
}

async function updateDrawerContent(productDetails, formDataObject) {
  const drawer = document.querySelector('#pdpx-drawer');
  if (drawer.classList.contains('hidden')) {
    return;
  }
  if (productDetails.productType === 'zazzle_businesscard') {
    const mediaValue = productDetails.attributes.media.find((v) => v.name === formDataObject.media);
    const mediaOptions = productDetails.attributes.media;

    if (!mediaValue) return;

    const {
      thumbnail,
      title,
      name,
      description: descText,
      priceAdjustment,
      thickness,
      weight,
      gsm,
    } = mediaValue;

    const heroImage = drawer.querySelector('.pdpx-drawer-hero-image');
    const drawerTitle = drawer.querySelector('.pdpx-drawer-title');
    const pillsContainer = drawer.querySelector('.pdpx-drawer-pills-container');
    const description = drawer.querySelector('.pdpx-drawer-description');
    const footInfoName = drawer.querySelector('.pdpx-drawer-foot-info-name'); // eslint-disable-line prefer-destructuring
    const footInfoPrice = drawer.querySelector('.pdpx-drawer-foot-info-price');
    const footInfoImage = drawer.querySelector('.pdpx-drawer-foot-info-container img');
    const paperTypeSelector = drawer.querySelector('.pdpx-pill-selector-container');

    if (heroImage) {
      const defaultValueImageSrc = new URL(thumbnail);
      defaultValueImageSrc.searchParams.set('max_dim', '1000');
      heroImage.src = defaultValueImageSrc.toString();
      heroImage.alt = title;
    }

    if (drawerTitle) {
      drawerTitle.textContent = title;
      const titleRow = drawerTitle.parentElement;
      const existingBadge = titleRow.querySelector('.pdpx-recommended-badge');
      if (name === '175ptmatte' && !existingBadge) {
        const { getLibs } = await import('../../../scripts/utils.js');
        const { createTag } = await import(`${getLibs()}/utils/utils.js`);
        titleRow.appendChild(createTag('span', { class: 'pdpx-recommended-badge' }, 'Recommended'));
      } else if (name !== '175ptmatte' && existingBadge) {
        existingBadge.remove();
      }
    }

    if (pillsContainer) {
      pillsContainer.innerHTML = '';
      const specs = [thickness, weight, gsm].filter(Boolean);
      const { getLibs, getIconElementDeprecated } = await import('../../../scripts/utils.js');
      const { createTag } = await import(`${getLibs()}/utils/utils.js`);
      specs.forEach((spec) => {
        const pill = createTag('div', { class: 'pdpx-drawer-pill' });
        pill.append(
          getIconElementDeprecated('circle-check-mark'),
          createTag('span', { class: 'pdpx-drawer-pill-text' }, spec),
        );
        pillsContainer.appendChild(pill);
      });
    }

    if (description) {
      description.textContent = descText;
    }

    if (footInfoName) {
      footInfoName.textContent = title;
    }

    if (footInfoPrice) {
      footInfoPrice.textContent = priceAdjustment;
    }

    if (footInfoImage) {
      footInfoImage.src = thumbnail;
      footInfoImage.alt = title;
    }

    if (paperTypeSelector) {
      const pillContainers = paperTypeSelector.querySelectorAll('.pdpx-mini-pill-container');
      const hiddenSelect = paperTypeSelector.querySelector('.pdpx-hidden-select-input');

      if (hiddenSelect) {
        hiddenSelect.value = name;
      }

      pillContainers.forEach((pillContainer) => {
        const pillButton = pillContainer.querySelector('.pdpx-mini-pill-image-container');
        const pillImage = pillContainer.querySelector('.pdpx-mini-pill-image');
        const pillPrice = pillContainer.querySelector('.pdpx-mini-pill-price');

        if (pillButton && pillButton.dataset.name === name) {
          pillButton.classList.add('selected');
          const labelName = paperTypeSelector.querySelector('.pdpx-pill-selector-label-name');
          if (labelName) {
            labelName.textContent = title;
          }
        } else if (pillButton) {
          pillButton.classList.remove('selected');
        }

        const matchingOption = mediaOptions.find((opt) => opt.name === pillButton?.dataset.name);
        if (matchingOption) {
          if (pillImage && pillImage.src !== matchingOption.thumbnail) {
            pillImage.src = matchingOption.thumbnail;
            pillImage.alt = `${matchingOption.title} Option Image Thumbnail`;
          }
          if (pillPrice && pillPrice.textContent !== matchingOption.priceAdjustment) {
            pillPrice.textContent = matchingOption.priceAdjustment;
          }
          if (pillButton && pillButton.dataset.title !== matchingOption.title) {
            pillButton.dataset.title = matchingOption.title;
            pillButton.setAttribute('data-title', matchingOption.title);
          }
        }
      });
    }
  }
}

function createUpdatedSelectedValuesObject(updatedConfigurationOptions, formDataObject, quantity) {
  const selectedValuesObject = {};
  for (const [key, value] of Object.entries(updatedConfigurationOptions.product.attributes)) {
    const valueName = value.values.find((v) => v.name === formDataObject[key]);
    if (valueName) {
      selectedValuesObject[key] = valueName.name;
    } else {
      selectedValuesObject[key] = value.values[0].name;
    }
  }
  selectedValuesObject.qty = quantity;
  return selectedValuesObject;
}

export default async function updateAllDynamicElements(productId) {
  const { templateId } = document.querySelector('.pdpx-global-container').dataset;
  const form = document.querySelector('#pdpx-customization-inputs-form');
  const formData = new FormData(form);
  const formDataObject = Object.fromEntries(formData.entries());
  const quantity = formDataObject.qty;
  const parameters = formatProductOptionsToAPIParameters(formDataObject);
  const updatedConfigurationOptions = await fetchAPIData(productId, parameters, 'changeoptions');
  const updatedSelectedValuesObject = createUpdatedSelectedValuesObject(
    updatedConfigurationOptions,
    formDataObject,
    quantity,
  );
  const updatedParameters = formatProductOptionsToAPIParameters(updatedSelectedValuesObject);
  const [
    productDetails,
    productPrice,
    productReviews,
    productRenditions,
    productShippingEstimates,
    UIStrings,
  ] = await Promise.all([
    fetchAPIData(productId, updatedParameters, 'getproduct'),
    fetchAPIData(productId, updatedParameters, 'getproductpricing'),
    fetchAPIData(productId, null, 'getreviews'),
    fetchAPIData(productId, updatedParameters, 'getproductrenditions'),
    fetchAPIData(productId, updatedParameters, 'getshippingestimates'),
    fetchUIStrings(),
  ]);
  const normalizeProductDetailsParametersObject = {
    productDetails: updatedConfigurationOptions,
    productPrice,
    productReviews,
    productRenditions,
    productShippingEstimates,
    quantity,
    templateId,
    UIStrings,
  };

  const normalizedProductDetails = await normalizeProductDetailObject(
    normalizeProductDetailsParametersObject,
  );
  for (const [key, value] of Object.entries(formDataObject)) {
    if (normalizedProductDetails.attributes[key]) {
      const valueExists = normalizedProductDetails.attributes[key].some(
        (v) => String(v.name) === String(value) || v.name === value,
      );

      if (!valueExists) {
        // eslint-disable-next-line no-console
        console.warn(`Value "${value}" for "${key}" not found in options, resetting to first option`);
        formDataObject[key] = normalizedProductDetails.attributes[key][0].name;
      }
    }
  }
  await updateCheckoutButton(normalizedProductDetails, formDataObject);
  await updateProductImages(normalizedProductDetails);

  const currentAttributeKeys = Object.keys(normalizedProductDetails.attributes || {}).sort().join(',');
  const existingForm = document.querySelector('#pdpx-customization-inputs-form');
  const existingAttributeKeys = existingForm ? existingForm.dataset.attributeKeys || '' : '';

  if (currentAttributeKeys !== existingAttributeKeys) {
    await updateCustomizationOptions(normalizedProductDetails, formDataObject);
  } else {
    await updatePillTextValues(normalizedProductDetails);
  }

  await updateProductPrice(normalizedProductDetails);
  await updateProductDeliveryEstimate(normalizedProductDetails);
  await updateDrawerContent(normalizedProductDetails, formDataObject);
  // Publish to BlockMediator to trigger accordion updates
  BlockMediator.set('product:updated', {
    attributes: productDetails.product.attributes,
    formData: formDataObject,
  });
}
