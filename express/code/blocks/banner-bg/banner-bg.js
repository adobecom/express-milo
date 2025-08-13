import { getLibs, decorateButtonsDeprecated, fixIcons, getIconElementDeprecated, readBlockConfig } from '../../scripts/utils.js';
import { normalizeHeadings } from '../../scripts/utils/decorate.js';
import { formatSalesPhoneNumber } from '../../scripts/utils/location-utils.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  background: {
    variants: {
      'light-bg': '/express/code/blocks/banner-bg/img/light-bg.jpg',
      'blue-green-pink-bg': '/express/code/blocks/banner-bg/img/blue-green-pink-bg.jpg',
      'blue-bg': '/express/code/blocks/banner-bg/img/blue-bg.jpg',
      'blue-pink-orange-bg': '/express/code/blocks/banner-bg/img/blue-pink-orange-bg.jpg',
      'green-blue-red-bg': '/express/code/blocks/banner-bg/img/green-blue-red-bg.jpg',
      'blue-purple-gray-bg': '/express/code/blocks/banner-bg/img/blue-purple-gray-bg.jpg',
      'yellow-pink-blue-bg': '/express/code/blocks/banner-bg/img/yellow-pink-blue-bg.jpg',
    },
    get variantClasses() {
      return Object.keys(this.variants);
    },
  },
  buttons: {
    base: ['accent', 'dark'],
    multiButton: ['reverse'],
    background: ['bg-banner-button'],
    backgroundSecondary: ['bg-banner-button-secondary'],
    remove: ['primary', 'secondary'],
  },
  headings: ['h2', 'h3', 'h4'],
  logo: {
    icon: 'adobe-express-logo',
    class: 'express-logo',
    target: 'H2',
  },
  phoneNumber: {
    selector: 'a[title="{{business-sales-numbers}}"]',
  },
};

// ============================================================================
// UTILITIES
// ============================================================================

let createTag;

/**
 * Safely applies multiple CSS classes to an element
 * @param {HTMLElement} element - The target element
 * @param {string[]} classes - Array of class names to add
 */
function addClasses(element, classes) {
  classes.forEach((className) => element.classList.add(className));
}

/**
 * Safely removes multiple CSS classes from an element
 * @param {HTMLElement} element - The target element
 * @param {string[]} classes - Array of class names to remove
 */
function removeClasses(element, classes) {
  classes.forEach((className) => element.classList.remove(className));
}

// ============================================================================
// BACKGROUND HANDLING
// ============================================================================

/**
 * Detects background variant class on the block
 * @param {HTMLElement} block - The banner block element
 * @returns {string|null} Background variant class name or null
 */
function detectBackgroundVariant(block) {
  return CONFIG.background.variantClasses.find(
    (className) => block.classList.contains(className),
  ) || null;
}

/**
 * Preloads background image for performance
 * @param {string} imagePath - Path to the background image
 */
function preloadBackgroundImage(imagePath) {
  if (!imagePath || document.querySelector(`link[href="${imagePath}"]`)) {
    return;
  }

  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'image';
  preloadLink.href = imagePath;
  document.head.appendChild(preloadLink);
}

/**
 * Creates background container and restructures DOM
 * @param {HTMLElement} block - The banner-bg block element
 */
function createBackgroundContainer(block) {
  const container = createTag('div', { class: 'background-container' });

  // Move all content into container
  while (block.firstChild) {
    container.appendChild(block.firstChild);
  }

  block.appendChild(container);
  normalizeHeadings(block, CONFIG.headings);
}

// ============================================================================
// CONTENT ENHANCEMENT
// ============================================================================

/**
 * Injects Adobe Express logo if configured
 * @param {HTMLElement} block - The banner block element
 * @param {HTMLElement} section - The parent section element
 */
function injectLogo(block, section) {
  const metadata = section?.querySelector('.section-metadata');
  if (!metadata) return;

  const config = readBlockConfig(metadata);
  const shouldInject = ['on', 'yes'].includes(config['inject-logo']?.toLowerCase());

  if (shouldInject) {
    const logo = getIconElementDeprecated(CONFIG.logo.icon);
    logo.classList.add(CONFIG.logo.class);
    block.querySelector(CONFIG.logo.target)?.parentElement?.prepend(logo);
  }
}

/**
 * Applies comprehensive button styling
 * @param {HTMLElement} block - The banner block element
 * @param {string|null} variantClass - Background variant class
 */
function styleButtons(block, variantClass) {
  const buttons = Array.from(block.querySelectorAll('a.button'));
  if (buttons.length === 0) return;

  // Add multi-button class to block if needed
  if (buttons.length > 1) {
    block.classList.add('multi-button');
  }

  buttons.forEach((button, index) => {
    // Remove default classes
    removeClasses(button, CONFIG.buttons.remove);

    // Add base classes
    addClasses(button, CONFIG.buttons.base);

    // Handle background variant styling
    if (variantClass) {
      addClasses(button, CONFIG.buttons.background);

      // Style secondary button for multi-button backgrounds
      if (block.classList.contains('multi-button') && index === 1) {
        addClasses(button, CONFIG.buttons.backgroundSecondary);
      }
    }

    // Add multi-button specific classes
    if (block.classList.contains('multi-button')) {
      addClasses(button, CONFIG.buttons.multiButton);
    }
  });
}

/**
 * Formats sales phone numbers
 * @param {HTMLElement} block - The banner block element
 */
async function formatPhoneNumbers(block) {
  const phoneTags = block.querySelectorAll(CONFIG.phoneNumber.selector);
  if (phoneTags.length === 0) return;

  try {
    await formatSalesPhoneNumber(phoneTags);
  } catch (error) {
    window.lana?.log('banner-bg.js - error formatting phone numbers:', error.message);
  }
}

// ============================================================================
// MAIN DECORATOR
// ============================================================================

/**
 * Main decorator function for banner-bg blocks
 * @param {HTMLElement} block - The banner block element to decorate
 */
export default async function decorate(block) {
  // Phase 1: Initialize dependencies
  const [utils] = await Promise.all([
    import(`${getLibs()}/utils/utils.js`),
    decorateButtonsDeprecated(block),
  ]);
  ({ createTag } = utils);

  // Phase 2: Detect and setup background
  const variantClass = detectBackgroundVariant(block);
  const hasBackground = variantClass !== null;

  if (hasBackground) {
    const imagePath = CONFIG.background.variants[variantClass];
    preloadBackgroundImage(imagePath);
    createBackgroundContainer(block);
  }

  // Phase 3: Handle section inheritance
  const section = block.closest('.section');
  if (section?.style?.background) {
    block.style.background = section.style.background;
  }

  // Phase 4: Enhance content
  injectLogo(block, section);
  styleButtons(block, variantClass);
  await formatPhoneNumbers(block);
  fixIcons(block);
}
