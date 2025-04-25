import { getLibs, readBlockConfig, addTempWrapperDeprecated } from '../../scripts/utils.js';
import { trackButtonClick } from '../../scripts/instrument.js';
import { handleChevron } from '../link-blade/link-blade.js';
import createCarousel from '../../scripts/widgets/carousel.js';

let createTag;

function getDefatultToggleIndex($block) {
  const $enclosingMain = $block.closest('main');
  const toggleDefaultOption = $enclosingMain.querySelector('[data-toggle-default]');
  const defaultValue = toggleDefaultOption?.dataset.toggleDefault || toggleDefaultOption?.getAttribute('data-toggle-default');
  const parsedIndex = parseInt(defaultValue, 10);
  const defaultIndex = !defaultValue || Number.isNaN(parsedIndex) ? 0 : parsedIndex - 1;
  return defaultIndex;
}

function initButton($block, $buttons, $sections, index) {
  let currentResizeObserver = null;

  const updateBackgroundSize = (activeIndex) => {
    requestAnimationFrame(() => {
      const activeButton = $buttons[activeIndex];
      if (activeButton.getBoundingClientRect().width === 0) {
        requestAnimationFrame(() => updateBackgroundSize(activeIndex));
        return;
      }
      const buttonWidth = activeButton.getBoundingClientRect().width + 5;
      let leftOffset = activeIndex * 10;

      for (let i = 0; i < activeIndex; i += 1) {
        leftOffset += $buttons[i].getBoundingClientRect().width;
      }
    });
  };

  const setActiveButton = (newIndex) => {
    if (currentResizeObserver) {
      currentResizeObserver.disconnect();
    }

    currentResizeObserver = new ResizeObserver(() => {
      updateBackgroundSize(newIndex);
    });
    currentResizeObserver.observe($buttons[newIndex]);

    $buttons.forEach(($btn) => $btn.classList.remove('active'));
    $buttons[newIndex].classList.add('active');
    console.log($buttons[newIndex]);
    updateBackgroundSize(newIndex);
  };

  const handleSectionChange = () => {
    const $activeButton = $block.querySelector('.content-toggle-button.carousel-element.active');
    const blockPosition = $block.getBoundingClientRect().top;
    const offsetPosition = blockPosition + window.scrollY - 80;

    if ($activeButton !== $buttons[index]) {
      setActiveButton(index);
      $sections.forEach(($section) => {
        if ($buttons[index].innerText.toLowerCase() === $section.dataset.toggle.toLowerCase()) {
          $section.style.display = 'block';
          $section.style.height = 'auto';
        } else {
          $section.style.display = 'none';
          $section.style.height = '0px';
        }
      });
      if (!(window.scrollY < offsetPosition + 1 && window.scrollY > offsetPosition - 1)) {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  if (index === getDefatultToggleIndex($block)) {
    setActiveButton(index);
    handleSectionChange();
  }

  $buttons[index].addEventListener('click', () => {
    handleSectionChange();
  });

  $buttons[index].addEventListener('keydown', (e) => {
    if (e.target === $buttons[index]) {
      if (e.key === 'Enter' || e.key === ' ') {
        handleSectionChange();
      }
    }
  });
}

function decorateSectionMetadata(section) {
  const metadataDiv = section.querySelector(':scope > .section-metadata');

  if (metadataDiv) {
    const meta = readBlockConfig(metadataDiv);
    const keys = Object.keys(meta);
    keys.forEach((key) => {
      if (!['style', 'anchor', 'background'].includes(key)) {
        section.setAttribute(`data-${key}`, meta[key]);
      }
    });
  }
}

function decorteSectionsMetadata() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(decorateSectionMetadata);
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  addTempWrapperDeprecated(block, 'content-toggle');
  decorteSectionsMetadata();

  const $enclosingMain = block.closest('main');
  if ($enclosingMain) {
    const row = block.querySelector('div');
    const items = block.querySelector('ul');

    items.classList.add('content-toggle-carousel-container');

    // First create the carousel with li elements

    // Now transform the li elements into button elements
    const toggles = row.querySelectorAll('li');
    toggles.forEach(($toggle) => {
      // Create a new button element
      const $button = document.createElement('button');

      // Copy content and classes
      $button.innerHTML = $toggle.innerHTML;
      $button.className = `${$toggle.className} content-toggle-button`;

      // Copy any attributes (except for tag-specific ones)
      Array.from($toggle.attributes).forEach((attr) => {
        if (attr.name !== 'class') { // Skip class as we've already handled it
          $button.setAttribute(attr.name, attr.value);
        }
      });

      // Replace the li with the button
      $toggle.parentNode.replaceChild($button, $toggle);
    });

    createCarousel('button', items);
    const $sections = $enclosingMain.querySelectorAll('[data-toggle]');
    const buttons = row.querySelectorAll('.content-toggle-button');

    for (let i = 0; i < buttons.length; i += 1) {
      initButton(block, buttons, $sections, i);
    }
  }
}
