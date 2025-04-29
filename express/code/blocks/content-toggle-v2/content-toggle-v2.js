import { readBlockConfig, addTempWrapperDeprecated } from '../../scripts/utils.js';
import createCarousel from '../../scripts/widgets/carousel.js';

/**
 * Determines the default toggle index based on data attributes or falls back to 0
 * @param {HTMLElement} block - The content toggle block element
 * @returns {number} The index of the default toggle option (0-based)
 */
function getDefatultToggleIndex(block) {
  const enclosingMain = block.closest('main');
  const toggleDefaultOption = enclosingMain.querySelector('[data-toggle-default]');
  const defaultValue = toggleDefaultOption?.dataset.toggleDefault || toggleDefaultOption?.getAttribute('data-toggle-default');
  const parsedIndex = parseInt(defaultValue, 10);
  const defaultIndex = !defaultValue || Number.isNaN(parsedIndex) ? 0 : parsedIndex - 1;
  return defaultIndex;
}

/**
 * Initializes a toggle button with click and keyboard event handlers
 * @param {HTMLElement} block - The content toggle block element
 * @param {Array<HTMLElement>} buttons - Array of all toggle buttons
 * @param {Array<HTMLElement>} sections - Array of all toggleable sections
 * @param {number} index - The index of the current button being initialized
 */
function initButton(block, buttons, sections, index) {
  /**
   * Updates the active state of buttons
   * @param {number} newIndex - The index of the button to activate
   */
  const setActiveButton = (newIndex) => {
    buttons.forEach((btn) => btn.classList.remove('active'));
    buttons[newIndex].classList.add('active');
  };

  /**
   * Handles section visibility changes and smooth scrolling
   */
  const handleSectionChange = () => {
    const activeButton = block.querySelector('.content-toggle-button.carousel-element.active');
    const blockPosition = block.getBoundingClientRect().top;
    const offsetPosition = blockPosition + window.scrollY - 80;

    if (activeButton !== buttons[index]) {
      setActiveButton(index);
      sections.forEach((section) => {
        if (buttons[index].innerText.toLowerCase() === section.dataset.toggle.toLowerCase()) {
          section.style.display = 'block';
          section.style.height = 'auto';
        } else {
          section.style.display = 'none';
          section.style.height = '0px';
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

  // Initialize default state if this is the default button
  if (index === getDefatultToggleIndex(block)) {
    setActiveButton(index);
    handleSectionChange();
  }

  // Add click event handler
  buttons[index].addEventListener('click', () => {
    handleSectionChange();
  });

  // Add keyboard event handler for accessibility
  buttons[index].addEventListener('keydown', (e) => {
    if (e.target === buttons[index]) {
      if (e.key === 'Enter' || e.key === ' ') {
        handleSectionChange();
      }
    }
  });
}

/**
 * Decorates section metadata by transferring data attributes from metadata div
 * @param {HTMLElement} section - The section element to decorate
 */
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

/**
 * Decorates metadata for all sections in the document
 */
function decorteSectionsMetadata() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(decorateSectionMetadata);
}

/**
 * Main decorator function for the content toggle block
 * @param {HTMLElement} block - The content toggle block element
 */
export default async function decorate(block) {
  // Add wrapper and decorate section metadata
  addTempWrapperDeprecated(block, 'content-toggle');
  decorteSectionsMetadata();

  const enclosingMain = block.closest('main');
  if (enclosingMain) {
    // Get and prepare the row and items container
    const row = block.querySelector('div');
    const items = block.querySelector('ul');
    items.classList.add('content-toggle-carousel-container');

    // Convert list items to buttons
    const toggles = row.querySelectorAll('li');
    toggles.forEach((toggle) => {
      const button = document.createElement('button');
      button.innerHTML = toggle.innerHTML;
      button.className = `${toggle.className} content-toggle-button`;
      toggle.parentNode.replaceChild(button, toggle);
    });

    // Initialize carousel and get sections
    createCarousel('button', items);
    const sections = enclosingMain.querySelectorAll('[data-toggle]');
    const buttons = row.querySelectorAll('.content-toggle-button');

    // Initialize each button
    for (let i = 0; i < buttons.length; i += 1) {
      initButton(block, buttons, sections, i);
    }
  }
}
