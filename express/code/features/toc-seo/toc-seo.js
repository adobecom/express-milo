/* eslint-disable import/named, import/extensions */
import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  breakpoints: {
    mobile: 768,
    desktop: 1440,
  },
  positioning: {
    fixedTopDistance: 200,
    offset: 40,
    mobileNavHeight: 40, // Default fallback
  },
  selectors: {
    section: 'main .section',
    highlight: '.section div.highlight',
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
    // Calculate proper offset based on viewport
    let stickyOffset;
    if (isMobileViewport()) {
      stickyOffset = CONFIG.positioning.mobileNavHeight;
    } else if (isDesktopViewport()) {
      // For desktop, account for the fixed TOC position and some padding
      stickyOffset = CONFIG.positioning.fixedTopDistance + 40;
    } else {
      // For tablet, use a moderate offset
      stickyOffset = 80;
    }

    const headerRect = targetHeader.getBoundingClientRect();
    const scrollTop = window.pageYOffset + headerRect.top - stickyOffset;

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
 * Calculates the initial position for the TOC based on anchor element position
 * @param {HTMLElement} anchorElement - The anchor element (highlight or section)
 * @returns {number} Initial top position in pixels
 */
function calculateInitialPosition(anchorElement) {
  const anchorRect = anchorElement.getBoundingClientRect();
  return anchorRect.bottom + 20; // Position 20px below the highlight blade
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
 * Stops TOC scroll when reaching the blog posts container on desktop
 * @param {number} position - Current position
 * @param {HTMLElement} tocElement - TOC element
 * @returns {number} Adjusted position
 */
function preventScrollPastBlogPosts(position, tocElement) {
  if (!isDesktopViewport()) {
    return position;
  }

  const blogPostsContainer = document.querySelector('.ax-blog-posts-container');
  if (!blogPostsContainer) return position;

  const blogPostsTop = blogPostsContainer.offsetTop - window.pageYOffset;
  const tocHeight = tocElement.offsetHeight;
  const maxTopPosition = blogPostsTop - tocHeight;

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
  if (!isDesktopViewport()) {
    return;
  }

  let anchorElement = document.querySelector(CONFIG.selectors.highlight);

  // Fallback to section element if highlight element is not found
  if (!anchorElement) {
    anchorElement = document.querySelector(CONFIG.selectors.section);
  }

  if (!anchorElement || !tocElement) {
    return;
  }

  // Calculate and apply positioning constraints
  let position = calculateInitialPosition(anchorElement);
  position = applyMinimumDistance(position);
  position = preventOverlapWithFooter(position, tocElement);
  position = preventScrollPastBlogPosts(position, tocElement);

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

/**
 * Updates the active TOC link based on current scroll position
 * @param {HTMLElement} toc - TOC container element
 */
function updateActiveTOCLink(toc) {
  const headers = document.querySelectorAll(CONFIG.selectors.headers);
  const tocLinks = toc.querySelectorAll('.toc-content a');

  if (!headers.length || !tocLinks.length) return;

  const offset = 100; // Offset to trigger active state

  let activeHeader = null;
  let minDistance = Infinity;

  headers.forEach((header) => {
    const rect = header.getBoundingClientRect();
    const distance = Math.abs(rect.top - offset);

    if (rect.top <= offset && distance < minDistance) {
      minDistance = distance;
      activeHeader = header;
    }
  });

  // Remove active class from all links
  tocLinks.forEach((link) => {
    link.classList.remove('active');
  });

  // Add active class to corresponding link
  if (activeHeader) {
    const headerText = activeHeader.textContent.trim();
    const activeLink = Array.from(tocLinks).find((link) => link.textContent.trim().includes(headerText.replace('...', '').trim()));

    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
}

/**
 * Sets up scroll event handler for active link tracking
 * @param {HTMLElement} toc - TOC container element
 */
function setupScrollTracking(toc) {
  const throttledUpdate = throttleRAF(() => updateActiveTOCLink(toc));
  window.addEventListener('scroll', throttledUpdate);

  // Initial update
  updateActiveTOCLink(toc);
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

      // Check if there's a short version available and use it
      const shortKey = `${key}-short`;
      const displayText = config[shortKey] || config[key];
      link.textContent = displayText;

      link.addEventListener('mousedown', (e) => {
        // Prevent focus on mousedown to avoid the outline
        e.preventDefault();
      });

      link.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToHeader(config[key], toc);
        // Remove focus to prevent the focus outline from persisting
        link.blur();
      });

      tocContent.appendChild(link);
    }
  });

  return tocContent;
}

/**
 * Opens social media sharing in popup windows
 * @param {Event} e - Click event
 */
function openPopup(e) {
  const target = e.target.closest('a');
  const href = target.getAttribute('data-href');
  const type = target.getAttribute('data-type');
  window.open(
    href,
    type,
    'popup,top=233,left=233,width=700,height=467',
  );
}

/**
 * Copies current URL to clipboard with visual feedback
 * @param {HTMLElement} button - Copy button element
 * @param {string} copyTxt - Text to show when copied
 */
async function copyToClipboard(button, copyTxt) {
  try {
    await navigator.clipboard.writeText(window.location.href);
    button.setAttribute('title', copyTxt);
    button.setAttribute('aria-label', copyTxt);

    const tooltip = createTag('div', {
      role: 'status',
      'aria-live': 'polite',
      class: 'copied-to-clipboard',
    }, copyTxt);
    button.append(tooltip);

    setTimeout(() => {
      tooltip.remove();
    }, 3000);
    button.classList.remove('copy-failure');
    button.classList.add('copy-success');
  } catch (e) {
    button.classList.add('copy-failure');
    button.classList.remove('copy-success');
  }
}

/**
 * Updates share text with localized labels
 * @param {HTMLElement} shareBlock - Social icons container
 */
async function updateShareText(shareBlock) {
  // Use static labels for now - can be enhanced with localization later
  const labels = [
    'Share on Twitter',
    'Share on LinkedIn',
    'Share on Facebook',
    'Copy to clipboard',
  ];
  const shareLinks = shareBlock.querySelectorAll('a');
  [...shareLinks].forEach((el, index) => el.setAttribute('aria-label', labels[index]));
  return 'Copied to clipboard';
}

/**
 * Creates social icons section with sharing functionality
 * @returns {HTMLElement} Social icons container
 */
async function createSocialIcons() {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.querySelector('h1')?.textContent || '');
  const description = encodeURIComponent(getMetadata('description') || '');

  const platformMap = {
    x: {
      'data-href': `https://www.twitter.com/share?&url=${url}&text=${title}`,
      'aria-label': 'share twitter',
      tabindex: '0',
    },
    linkedin: {
      'data-type': 'LinkedIn',
      'data-href': `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${description}`,
      'aria-label': 'share linkedin',
      tabindex: '0',
    },
    facebook: {
      'data-type': 'Facebook',
      'data-href': `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      'aria-label': 'share facebook',
      tabindex: '0',
    },
    link: {
      id: 'copy-to-clipboard',
      'aria-label': 'copy to clipboard',
      tabindex: '0',
    },
  };

  const platforms = Object.keys(platformMap);
  const socialIcons = createTag('div', { class: 'toc-social-icons' });

  // Create social media links
  platforms.forEach((platform) => {
    const platformProperties = platformMap[platform];
    if (platformProperties) {
      const icon = getIconElementDeprecated(platform);
      const link = createTag('a', platformProperties);
      link.appendChild(icon);
      socialIcons.appendChild(link);
    }
  });

  // Add event listeners for sharing functionality
  socialIcons.querySelectorAll('[data-href]').forEach((link) => {
    link.addEventListener('click', openPopup);
  });

  const copyButton = socialIcons.querySelector('#copy-to-clipboard');
  if (copyButton) {
    // Remove any existing event listeners to avoid duplicates
    copyButton.replaceWith(copyButton.cloneNode(true));
    const newCopyButton = socialIcons.querySelector('#copy-to-clipboard');
    newCopyButton.addEventListener('click', () => copyToClipboard(newCopyButton, 'Copied to clipboard'));
  }

  // Update share text with localized labels
  setTimeout(async () => {
    const copyText = await updateShareText(socialIcons);
    const updatedCopyButton = socialIcons.querySelector('#copy-to-clipboard');
    if (updatedCopyButton) {
      // Remove existing listener and add new one with updated text
      updatedCopyButton.replaceWith(updatedCopyButton.cloneNode(true));
      const finalCopyButton = socialIcons.querySelector('#copy-to-clipboard');
      finalCopyButton.addEventListener('click', () => copyToClipboard(finalCopyButton, copyText));
    }
  }, 100);

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
 * Handles mobile sticky positioning when TOC is after highlight element
 * @param {HTMLElement} tocElement - TOC element to position
 */
function handleMobileSticky(tocElement) {
  const highlightElement = document.querySelector('.section div.highlight');
  if (!highlightElement) return; // Only apply when TOC is after highlight

  // Get the highlight element's position relative to viewport
  const { bottom } = highlightElement.getBoundingClientRect();
  const { mobileNavHeight } = CONFIG.positioning;

  // When highlight is scrolled out of view, make TOC sticky
  if (bottom <= mobileNavHeight) {
    // Create placeholder if it doesn't exist
    if (!tocElement.nextElementSibling || !tocElement.nextElementSibling.classList.contains('toc-placeholder')) {
      const placeholder = document.createElement('div');
      placeholder.className = 'toc-placeholder';
      placeholder.style.height = `${tocElement.offsetHeight}px`;
      tocElement.insertAdjacentElement('afterend', placeholder);
    }

    tocElement.classList.add('toc-mobile-fixed');
    tocElement.style.setProperty('--mobile-nav-height', `${mobileNavHeight}px`);
  } else {
    // Return to normal flow when highlight is visible
    tocElement.classList.remove('toc-mobile-fixed');

    // Remove placeholder
    const placeholder = tocElement.nextElementSibling;
    if (placeholder && placeholder.classList.contains('toc-placeholder')) {
      placeholder.remove();
    }
  }
}

/**
 * Sets up scroll and resize event handlers
 * @param {HTMLElement} tocElement - TOC element to position
 */
function setupEventHandlers(tocElement) {
  const throttledHandleDesktopPositioning = throttleRAF(() => handleDesktopPositioning(tocElement));
  const throttledHandleMobileSticky = throttleRAF(() => handleMobileSticky(tocElement));

  // Single scroll handler with viewport check
  const handleScroll = () => {
    if (window.innerWidth >= 1440) {
      throttledHandleDesktopPositioning();
    } else if (window.innerWidth < 768) {
      // Mobile sticky behavior (below 768px)
      throttledHandleMobileSticky();
    }
    // Tablet (768px-1439px) - no scroll behavior, stays static
  };

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', () => {
    // Reset mobile sticky positioning when transitioning to tablet/desktop
    if (window.innerWidth >= 768) {
      if (window.innerWidth < 1440) {
        tocElement.classList.remove('toc-mobile-fixed');
      } else {
        tocElement.classList.add('toc-desktop-fixed');
      }

      // Remove placeholder if it exists
      const placeholder = tocElement.nextElementSibling;
      if (placeholder && placeholder.classList.contains('toc-placeholder')) {
        placeholder.remove();
      }
    }

    // Handle desktop positioning and cleanup
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
 * @returns {Promise<Object>} Object containing all TOC elements
 */
async function createTOCStructure(config) {
  const toc = createTOCContainer();
  const title = createTOCTitle(config.title);
  const tocContent = createNavigationLinks(config, toc);
  const socialIcons = await createSocialIcons();

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
  setupScrollTracking(toc);
}

/**
 * Inserts the TOC into the DOM at the correct location
 * @param {HTMLElement} toc - TOC container element
 */
function insertTOCIntoDOM(toc) {
  const highlightElement = document.querySelector(CONFIG.selectors.highlight);
  if (highlightElement) {
    highlightElement.insertAdjacentElement('afterend', toc);
  } else {
    // Fallback to original behavior if highlight element is not found
    const firstSection = document.querySelector(CONFIG.selectors.section);
    if (firstSection) {
      firstSection.insertAdjacentElement('afterend', toc);
    }
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
    const elements = await createTOCStructure(config);

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
