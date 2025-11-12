import { getLibs } from '../../../../scripts/utils.js';
import updateAllDynamicElements from '../../utilities/event-handlers.js';
import openDrawer from '../drawerContent/openDrawer.js';
import createSimpleCarousel from '../../../../scripts/widgets/simple-carousel.js';

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
  const productId = productDetails.id;
  const hiddenSelectInputId = `pdpx-hidden-input-${hiddenSelectInputName}`;
  let selectedValue = false;
  const classicOptions = customizationOptions.filter((option) => option.printingProcess === 'classic');
  const vividOptions = customizationOptions.filter((option) => option.printingProcess === 'vivid');

  const miniPillSelectorContainer = createTag('div', { class: 'pdpx-pill-selector-container' });
  const miniPillSelectorLabelContainer = createTag('div', { class: 'pdpx-pill-selector-label-container' });
  const miniPillSelectorLabelNameContainer = createTag('div', { class: 'pdpx-pill-selector-label-name-container' });
  const miniPillSelectorLabel = createTag('span', { class: 'pdpx-pill-selector-label-label' }, `${labelText}: `);
  miniPillSelectorLabelNameContainer.appendChild(miniPillSelectorLabel);
  miniPillSelectorLabelContainer.appendChild(miniPillSelectorLabelNameContainer);

  miniPillSelectorContainer.appendChild(miniPillSelectorLabelContainer);
  const miniPillSelectorOptionsContainerWrapper = createTag('div', { class: 'pdpx-mini-pill-selector-options-container-wrapper' });
  const miniPillOptionsSectionContainerClassic = createTag('div', { class: 'pdpx-mini-pill-options-section-container' });
  const miniPillOptionsSectionContainerVivid = createTag('div', { class: 'pdpx-mini-pill-options-section-container' });
  const miniPillSelectorOptionsWrapperClassic = createTag('div', { class: 'pdpx-mini-pill-selector-options-wrapper' });
  if (classicOptions.length > 0) {
    miniPillOptionsSectionContainerClassic.appendChild(
      createTag('span', { class: 'pdpx-pill-selector-section-label' }, 'Classic Printing: No Underbase'),
    );
  }
  const miniPillSelectorOptionsWrapperVivid = createTag('div', { class: 'pdpx-mini-pill-selector-options-wrapper' });
  if (vividOptions.length > 0) {
    miniPillOptionsSectionContainerVivid.appendChild(
      createTag('span', { class: 'pdpx-pill-selector-section-label' }, 'Vivid Printing: White Underbase'),
    );
  }
  miniPillOptionsSectionContainerClassic.append(miniPillSelectorOptionsWrapperClassic);
  miniPillOptionsSectionContainerVivid.append(miniPillSelectorOptionsWrapperVivid);
  miniPillSelectorOptionsContainerWrapper.append(
    miniPillOptionsSectionContainerClassic,
    miniPillOptionsSectionContainerVivid,
  );
  const hiddenSelectInput = createTag('select', { class: 'pdpx-hidden-select-input', name: hiddenSelectInputName, id: hiddenSelectInputId });
  for (let i = 0; i < customizationOptions.length; i += 1) {
    const miniPillSelectorOptionsWrapper = customizationOptions[i].printingProcess === 'classic' ? miniPillSelectorOptionsWrapperClassic : miniPillSelectorOptionsWrapperVivid;
    const option = createTag('option', { value: customizationOptions[i].name }, customizationOptions[i].title);
    if (customizationOptions[i].name === defaultValue) {
      selectedValue = customizationOptions[i].name;
    }
    hiddenSelectInput.appendChild(option);
    const miniPillOption = createTag('div', { class: 'pdpx-mini-pill-container', 'data-tooltip': customizationOptions[i].title });
    const miniPillOptionImageContainer = createTag('button', { class: 'pdpx-mini-pill-image-container', type: 'button', 'data-name': customizationOptions[i].name, 'data-title': customizationOptions[i].title });
    const altTextMiniPill = `${labelText} Option Image Thumbnail: ${customizationOptions[i].title}`;
    const miniPillOptionImage = createTag('img', { class: 'pdpx-mini-pill-image', alt: altTextMiniPill, src: customizationOptions[i].thumbnail });
    miniPillOptionImageContainer.appendChild(miniPillOptionImage);
    const miniPillOptionTextContainer = createTag('div', { class: 'pdpx-mini-pill-text-container' });
    const miniPillOptionPrice = createTag('span', { class: 'pdpx-mini-pill-price' }, customizationOptions[i].priceAdjustment);
    miniPillOptionImageContainer.addEventListener('click', async (element) => {
      miniPillSelectorOptionsContainerWrapper.querySelectorAll('.pdpx-mini-pill-image-container').forEach((pill) => {
        pill.classList.remove('selected');
      });
      element.currentTarget.classList.toggle('selected');
      const allInputs = document.querySelectorAll(`[name=${hiddenSelectInputName}]`);
      allInputs.forEach((input) => {
        input.value = element.currentTarget.getAttribute('data-name');
      });
      updateAllDynamicElements(productId);
    });
    // Smart tooltip edge detection - check against container edges, not viewport
    miniPillOptionImageContainer.addEventListener('mouseenter', (e) => {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const container = btn.closest('.pdpx-customization-inputs-container') || document.body;
      const containerRect = container.getBoundingClientRect();
      const threshold = 150;
      btn.classList.remove('tooltip-left-edge', 'tooltip-right-edge');
      if (rect.left - containerRect.left < threshold) {
        btn.classList.add('tooltip-left-edge');
      } else if (containerRect.right - rect.right < threshold) {
        btn.classList.add('tooltip-right-edge');
      }
    });
    miniPillOptionTextContainer.appendChild(miniPillOptionPrice);
    miniPillOption.append(miniPillOptionImageContainer, miniPillOptionTextContainer);
    miniPillSelectorOptionsWrapper.appendChild(miniPillOption);
  }
  hiddenSelectInput.value = selectedValue || customizationOptions[0].name;
  const selectedMiniPillOptionImageContainer = miniPillSelectorOptionsContainerWrapper.querySelector(`.pdpx-mini-pill-image-container[data-name="${hiddenSelectInput.value}"]`);
  selectedMiniPillOptionImageContainer.classList.add('selected');
  const miniPillSelectorLabelName = createTag('span', { class: 'pdpx-pill-selector-label-name' }, selectedMiniPillOptionImageContainer.dataset.title);
  if (CTALinkText) {
    const miniPillSelectorLabelCompareLink = createTag('button', { class: 'pdpx-pill-selector-label-compare-link', type: 'button', 'data-drawer-type': drawerType }, CTALinkText);
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
  miniPillSelectorLabelNameContainer.appendChild(miniPillSelectorLabelName);

  let isClassicCarouselActive = false;
  let isVividCarouselActive = false;
  const mediaQuery = window.matchMedia('(max-width: 767px)');

  const initCarousels = async () => {
    if (classicOptions.length > 0
      && miniPillSelectorOptionsWrapperClassic.children.length > 0
      && !isClassicCarouselActive) {
      await createSimpleCarousel('.pdpx-mini-pill-container', miniPillSelectorOptionsWrapperClassic, {
        ariaLabel: 'Classic printing color options',
        centerActive: true,
        activeClass: 'selected',
      });
      // Force overflow-y visible for tooltips
      const platformClassic = miniPillSelectorOptionsWrapperClassic.querySelector('.simple-carousel-platform');
      if (platformClassic) {
        platformClassic.style.overflowY = 'visible';
      }
      isClassicCarouselActive = true;
    }

    if (vividOptions.length > 0
      && miniPillSelectorOptionsWrapperVivid.children.length > 0
      && !isVividCarouselActive) {
      await createSimpleCarousel('.pdpx-mini-pill-container', miniPillSelectorOptionsWrapperVivid, {
        ariaLabel: 'Vivid printing color options',
        centerActive: true,
        activeClass: 'selected',
      });
      // Force overflow-y visible for tooltips
      const platformVivid = miniPillSelectorOptionsWrapperVivid.querySelector('.simple-carousel-platform');
      if (platformVivid) {
        platformVivid.style.overflowY = 'visible';
      }
      isVividCarouselActive = true;
    }
  };

  const destroyCarousel = (wrapper, isActive) => {
    if (isActive) {
      const carouselContainer = wrapper.querySelector('.simple-carousel-container');
      const faderLeft = wrapper.querySelector('.simple-carousel-fader-left');
      const faderRight = wrapper.querySelector('.simple-carousel-fader-right');

      if (carouselContainer) {
        const platform = carouselContainer.querySelector('.simple-carousel-platform');
        if (platform) {
          const pills = Array.from(platform.querySelectorAll('.pdpx-mini-pill-container'));
          pills.forEach((pill) => {
            pill.classList.remove('simple-carousel-item');
            pill.removeAttribute('tabindex');
            pill.removeAttribute('role');
            pill.removeAttribute('aria-label');
            wrapper.appendChild(pill);
          });
        }
        carouselContainer.remove();
      }
      if (faderLeft) faderLeft.remove();
      if (faderRight) faderRight.remove();
    }
    return false;
  };

  const destroyCarousels = () => {
    isClassicCarouselActive = destroyCarousel(
      miniPillSelectorOptionsWrapperClassic,
      isClassicCarouselActive,
    );
    isVividCarouselActive = destroyCarousel(
      miniPillSelectorOptionsWrapperVivid,
      isVividCarouselActive,
    );
  };

  const handleResize = async () => {
    if (mediaQuery.matches && !isClassicCarouselActive && !isVividCarouselActive) {
      await initCarousels();
    } else if (!mediaQuery.matches && (isClassicCarouselActive || isVividCarouselActive)) {
      destroyCarousels();
    }
  };

  if (mediaQuery.matches) {
    await initCarousels();
  }

  mediaQuery.addEventListener('change', handleResize);
  window.addEventListener('orientationchange', handleResize);

  miniPillSelectorContainer._cleanupCarousel = () => {
    mediaQuery.removeEventListener('change', handleResize);
    window.removeEventListener('orientationchange', handleResize);
    destroyCarousels();
  };

  miniPillSelectorContainer.append(miniPillSelectorOptionsContainerWrapper, hiddenSelectInput);
  return miniPillSelectorContainer;
}
