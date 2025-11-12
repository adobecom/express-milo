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
    const miniPillOption = createTag('div', { class: 'pdpx-mini-pill-container', 'data-tooltip': customizationOptions[i].title });
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
    miniPillOption.appendChild(miniPillOptionImageContainer, miniPillOptionTextContainer);
    miniPillSelectorOptionsContainer.appendChild(miniPillOption);
  }
  hiddenSelectInput.value = selectedValueExists || customizationOptions[0].name;
  const selectedMiniPillOptionImageContainer = miniPillSelectorOptionsContainer.querySelector(`.pdpx-mini-pill-image-container[data-name="${hiddenSelectInput.value}"]`);
  selectedMiniPillOptionImageContainer.classList.add('selected');
  miniPillSelectorLabelName.textContent = selectedMiniPillOptionImageContainer.dataset.title;
  miniPillSelectorLabelNameContainer.appendChild(miniPillSelectorLabelName);
  miniPillSelectorOptionsWrapper.appendChild(miniPillSelectorOptionsContainer);

  let isCarouselActive = false;
  const mediaQuery = window.matchMedia('(max-width: 767px)');

  const initCarousel = async () => {
    if (miniPillSelectorOptionsContainer.children.length > 0 && !isCarouselActive) {
      await createSimpleCarousel('.pdpx-mini-pill-container', miniPillSelectorOptionsWrapper, {
        ariaLabel: `${labelText} options`,
        centerActive: true,
        activeClass: 'selected',
      });
      const platform = miniPillSelectorOptionsWrapper.querySelector('.simple-carousel-platform');
      if (platform) {
        platform.style.overflowY = 'visible';
      }
      isCarouselActive = true;
    }
  };

  const destroyCarousel = () => {
    if (isCarouselActive) {
      const carouselContainer = miniPillSelectorOptionsWrapper.querySelector('.simple-carousel-container');
      const faderLeft = miniPillSelectorOptionsWrapper.querySelector('.simple-carousel-fader-left');
      const faderRight = miniPillSelectorOptionsWrapper.querySelector('.simple-carousel-fader-right');

      if (carouselContainer) {
        const platform = carouselContainer.querySelector('.simple-carousel-platform');
        if (platform) {
          const pills = Array.from(platform.querySelectorAll('.pdpx-mini-pill-container'));
          pills.forEach((pill) => {
            pill.classList.remove('simple-carousel-item');
            pill.removeAttribute('tabindex');
            pill.removeAttribute('role');
            pill.removeAttribute('aria-label');
            miniPillSelectorOptionsContainer.appendChild(pill);
          });
        }
        carouselContainer.remove();
      }
      if (faderLeft) faderLeft.remove();
      if (faderRight) faderRight.remove();
      isCarouselActive = false;
    }
  };

  const handleResize = async () => {
    if (mediaQuery.matches && !isCarouselActive) {
      await initCarousel();
    } else if (!mediaQuery.matches && isCarouselActive) {
      destroyCarousel();
    }
  };

  if (mediaQuery.matches) {
    await initCarousel();
  }

  mediaQuery.addEventListener('change', handleResize);
  window.addEventListener('orientationchange', handleResize);

  miniPillSelectorContainer._cleanupCarousel = () => {
    mediaQuery.removeEventListener('change', handleResize);
    window.removeEventListener('orientationchange', handleResize);
    destroyCarousel();
  };

  miniPillSelectorContainer.append(miniPillSelectorOptionsWrapper, hiddenSelectInput);
  return miniPillSelectorContainer;
}
