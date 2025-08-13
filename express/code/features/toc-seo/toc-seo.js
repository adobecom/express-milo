/* eslint-disable import/named, import/extensions */
import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  breakpoints: {
    mobile: 768,
    desktop: 1200,
  },
  positioning: {
    fixedTopDistance: 200,
    offset: 40,
    mobileNavHeight: 40, // Default fallback
  },
  selectors: {
    section: 'main .section',
    toc: '.toc-container',
    linkListWrapper: '.section:has(.link-list-wrapper)',
    headers: 'main h2, main h3, main h4',
  },
  socialIcons: ['x', 'facebook', 'linkedin', 'link'],
  aria: {
    navigation: 'Table of Contents',
    region: 'Table of Contents Navigation',
  },
};

// ============================================================================
// UTILITIES
// ============================================================================

let createTag;
let getMetadata;

/**
 * Throttle function using requestAnimationFrame for smooth performance
 * @param {Function} func - Function to throttle
 * @returns {Function} Throttled function
 */
function throttleRAF(func) {
  let ticking = false;
  return function executedFunction(...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        func(...args);
        ticking = false;
      });
      ticking = true;
    }
  };
}

/**
 * Checks if current viewport is mobile
 * @returns {boolean} True if mobile viewport
 */
function isMobileViewport() {
  return window.innerWidth < CONFIG.breakpoints.mobile;
}

/**
 * Checks if current viewport is desktop
 * @returns {boolean} True if desktop viewport
 */
function isDesktopViewport() {
  return window.innerWidth >= CONFIG.breakpoints.desktop;
}

// ============================================================================
// METADATA HANDLING
// ============================================================================

/**
 * Builds configuration object from metadata
 * @returns {Object} Configuration object with title, ariaLabel, and contents
 */
function buildMetadataConfig() {
  const title = getMetadata('toc-title');
  const ariaLabel = getMetadata('toc-aria-label');
  const showContentNumbers = getMetadata('toc-content-numbers');
  const contents = [];

  let i = 1;
  let content = getMetadata(`content-${i}`);

  while (content) {
    const abbreviatedContent = getMetadata(`content-${i}-short`);
    if (abbreviatedContent) {
      contents.push({ [`content-${i}-short`]: abbreviatedContent });
    }
    contents.push({ [`content-${i}`]: content });
    i += 1;
    content = getMetadata(`content-${i}`);
  }

  return contents.reduce((acc, el) => ({
    ...acc,
    ...el,
  }), { title, ariaLabel, 'toc-content-numbers': showContentNumbers });
}

// ============================================================================
// SCROLLING AND POSITIONING
// ============================================================================

/**
 * Scrolls to target header with proper offset
 * @param {string} headerText - Text content of target header
 * @param {HTMLElement} toc - TOC container element
 */
function scrollToHeader(headerText, toc) {
  const headers = document.querySelectorAll(CONFIG.selectors.headers);
  const targetHeader = Array.from(headers).find((h) => h.textContent.trim().includes(headerText.replace('...', '').trim()));

  if (targetHeader) {
    const tocHeight = toc.offsetHeight;
    const stickyOffset = isMobileViewport() ? CONFIG.positioning.mobileNavHeight : -120;
    const headerRect = targetHeader.getBoundingClientRect();
    const scrollTop = window.pageYOffset + headerRect.top - tocHeight - stickyOffset - 20;

    window.scrollTo({
      top: scrollTop,
      behavior: 'smooth',
    });

    // Close TOC after clicking on mobile
    if (isMobileViewport()) {
      toc.classList.remove('open');
    }
  }
}

/**
 * Calculates the initial position for the TOC based on section position
 * @param {HTMLElement} sectionElement - The first section element
 * @returns {number} Initial top position in pixels
 */
function calculateInitialPosition(sectionElement) {
  const firstSectionBottom = sectionElement.offsetTop + sectionElement.offsetHeight;
  const scrollTop = window.pageYOffset;
  return firstSectionBottom - scrollTop + CONFIG.positioning.offset;
}

/**
 * Ensures the TOC doesn't go above the minimum fixed distance
 * @param {number} position - Current position
 * @returns {number} Adjusted position
 */
function applyMinimumDistance(position) {
  return Math.max(position, CONFIG.positioning.fixedTopDistance);
}

/**
 * Ensures the TOC doesn't overlap with the footer
 * @param {number} position - Current position
 * @param {HTMLElement} tocElement - TOC element
 * @returns {number} Adjusted position
 */
function preventOverlapWithFooter(position, tocElement) {
  const footer = document.querySelector('footer');
  if (!footer) return position;

  const footerTop = footer.offsetTop - window.pageYOffset;
  const tocHeight = tocElement.offsetHeight;
  const maxTopPosition = footerTop - tocHeight;

  return Math.min(position, maxTopPosition);
}

/**
 * Applies the calculated position to the TOC element
 * @param {HTMLElement} tocElement - TOC element to position
 * @param {number} topPosition - Calculated top position
 */
function applyPositionToElement(tocElement, topPosition) {
  tocElement.style.setProperty('--toc-top-position', `${topPosition}px`);
  tocElement.classList.add('toc-desktop-fixed');
}

/**
 * Handles desktop positioning logic
 * @param {HTMLElement} tocElement - TOC element to position
 */
function handleDesktopPositioning(tocElement) {
  if (!isDesktopViewport()) return;

  const sectionElement = document.querySelector(CONFIG.selectors.section);

  if (!sectionElement || !tocElement) return;

  // Calculate and apply positioning constraints
  let position = calculateInitialPosition(sectionElement);
  position = applyMinimumDistance(position);
  position = preventOverlapWithFooter(position, tocElement);

  applyPositionToElement(tocElement, position);
}

/**
 * Cleans up desktop positioning when transitioning away from desktop
 * @param {HTMLElement} tocElement - TOC element to clean up
 */
function cleanupDesktopPositioning(tocElement) {
  if (!isDesktopViewport() && tocElement) {
    tocElement.classList.remove('toc-desktop-fixed');
    tocElement.style.removeProperty('--toc-top-position');
  }
}

// ============================================================================
// DOM CREATION
// ============================================================================

/**
 * Creates the main TOC container
 * @returns {HTMLElement} TOC container element
 */
function createTOCContainer() {
  return createTag('div', {
    class: 'toc toc-container ax-grid-col-12',
    role: 'navigation',
    'aria-label': CONFIG.aria.navigation,
  });
}

/**
 * Creates the TOC title button
 * @param {string} titleText - Title text content
 * @returns {HTMLElement} Title button element
 */
function createTOCTitle(titleText) {
  const title = createTag('button', {
    class: 'toc-title',
    'aria-expanded': 'false',
    'aria-controls': 'toc-content',
  });
  title.textContent = titleText;
  return title;
}

/**
 * Creates the TOC content container
 * @param {string} ariaLabel - ARIA label for the content region
 * @returns {HTMLElement} TOC content container
 */
function createTOCContent(ariaLabel) {
  return createTag('div', {
    class: 'toc-content',
    id: 'toc-content',
    role: 'region',
    'aria-label': ariaLabel,
  });
}

/**
 * Creates navigation links from configuration
 * @param {Object} config - Configuration object
 * @param {HTMLElement} toc - TOC container element
 * @returns {HTMLElement} TOC content with links
 */
function createNavigationLinks(config, toc) {
  const tocContent = createTOCContent(config.ariaLabel);

  Object.keys(config).forEach((key) => {
    if (key.startsWith('content-') && !key.endsWith('-short')) {
      const link = createTag('a', { href: `#${key}` });
      link.textContent = config[key];

      link.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToHeader(config[key], toc);
      });

      tocContent.appendChild(link);
    }
  });

  return tocContent;
}

/**
 * Creates social icons section
 * @returns {HTMLElement} Social icons container
 */
function createSocialIcons() {
  const socialIcons = createTag('div', { class: 'toc-social-icons' });

  CONFIG.socialIcons.forEach((iconName) => {
    const icon = getIconElementDeprecated(iconName);
    socialIcons.appendChild(icon);
  });

  return socialIcons;
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Sets up title click and keyboard handlers
 * @param {HTMLElement} title - Title button element
 * @param {HTMLElement} toc - TOC container element
 * @param {HTMLElement} tocContent - TOC content element
 */
function setupTitleHandlers(title, toc, tocContent) {
  const toggleTOC = () => {
    if (isMobileViewport()) {
      toc.classList.toggle('open');
      const isExpanded = toc.classList.contains('open');
      title.setAttribute('aria-expanded', isExpanded.toString());

      // Focus first link when opening
      if (isExpanded) {
        const firstLink = tocContent.querySelector('a');
        if (firstLink) {
          firstLink.focus();
        }
      }
    }
  };

  title.addEventListener('click', toggleTOC);

  title.addEventListener('keydown', (e) => {
    if (isMobileViewport() && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggleTOC();
    }
  });
}

/**
 * Sets up keyboard navigation for TOC links
 * @param {HTMLElement} tocContent - TOC content element
 */
function setupKeyboardNavigation(tocContent) {
  tocContent.addEventListener('keydown', (e) => {
    const links = Array.from(tocContent.querySelectorAll('a'));
    const currentIndex = links.indexOf(document.activeElement);

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % links.length;
        links[nextIndex].focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prevIndex = currentIndex <= 0 ? links.length - 1 : currentIndex - 1;
        links[prevIndex].focus();
        break;
      }
      case 'Home': {
        e.preventDefault();
        links[0].focus();
        break;
      }
      case 'End': {
        e.preventDefault();
        links[links.length - 1].focus();
        break;
      }
      default:
        // No action needed for other keys
        break;
    }
  });
}

/**
 * Sets up scroll and resize event handlers
 * @param {HTMLElement} tocElement - TOC element to position
 */
function setupEventHandlers(tocElement) {
  const throttledHandleDesktopPositioning = throttleRAF(() => handleDesktopPositioning(tocElement));

  window.addEventListener('scroll', throttledHandleDesktopPositioning);
  window.addEventListener('resize', () => {
    handleDesktopPositioning(tocElement);
    cleanupDesktopPositioning(tocElement);
  });

  // Initial positioning
  handleDesktopPositioning(tocElement);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initializes required utilities and dependencies
 * @returns {Promise<Object>} Object containing createTag and getMetadata functions
 */
async function initializeDependencies() {
  try {
    const utils = await import(`${getLibs()}/utils/utils.js`);
    return {
      createTag: utils.createTag,
      getMetadata: utils.getMetadata,
    };
  } catch (error) {
    window.lana?.log('Failed to initialize TOC dependencies:', error);
    throw new Error('Failed to load required utilities');
  }
}

/**
 * Creates the complete TOC structure
 * @param {Object} config - Configuration object
 * @returns {Object} Object containing all TOC elements
 */
function createTOCStructure(config) {
  const toc = createTOCContainer();
  const title = createTOCTitle(config.title);
  const tocContent = createNavigationLinks(config, toc);
  const socialIcons = createSocialIcons();

  return { toc, title, tocContent, socialIcons };
}

/**
 * Assembles the TOC structure by appending all elements
 * @param {Object} elements - Object containing TOC elements
 * @returns {HTMLElement} Assembled TOC container
 */
function assembleTOC(elements) {
  const { toc, title, tocContent, socialIcons } = elements;

  toc.appendChild(title);
  toc.appendChild(tocContent);
  toc.appendChild(socialIcons);

  return toc;
}

/**
 * Sets up all event handlers for the TOC
 * @param {Object} elements - Object containing TOC elements
 */
function setupAllEventHandlers(elements) {
  const { toc, title, tocContent } = elements;

  setupTitleHandlers(title, toc, tocContent);
  setupKeyboardNavigation(tocContent);
  setupEventHandlers(toc);
}

/**
 * Inserts the TOC into the DOM at the correct location
 * @param {HTMLElement} toc - TOC container element
 */
function insertTOCIntoDOM(toc) {
  const firstSection = document.querySelector(CONFIG.selectors.section);
  if (firstSection) {
    firstSection.insertAdjacentElement('afterend', toc);
  }
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Main function to set up Table of Contents with SEO features
 */
export default async function setTOCSEO() {
  try {
    // Phase 1: Initialize dependencies
    const utils = await initializeDependencies();
    createTag = utils.createTag;
    getMetadata = utils.getMetadata;

    // Phase 2: Build configuration
    const config = buildMetadataConfig();

    // Phase 3: Create TOC structure
    const elements = createTOCStructure(config);

    // Phase 4: Assemble TOC
    const toc = assembleTOC(elements);

    // Phase 5: Setup event handlers
    setupAllEventHandlers(elements);

    // Phase 6: Insert into DOM
    insertTOCIntoDOM(toc);
  } catch (error) {
    window.lana?.log('Error setting up TOC SEO:', error);
  }
}
