/* eslint-disable import/named, import/extensions */
import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  breakpoints: {
    desktop: 1024,
  },
  selectors: {
    highlight: '.section div.highlight',
    section: 'main .section',
    headers: 'main .section.long-form .content h2, main .section.long-form .content h3, main .section.long-form .content h4',
  },
  scrollOffset: {
    mobile: 140,
    tablet: 140,
  },
  aria: {
    navigation: 'Table of Contents',
  },
};

// ============================================================================
// UTILITIES
// ============================================================================

let createTag;
let getMetadata;

/**
 * Checks if current viewport is desktop
 * @returns {boolean} True if desktop viewport (≥ 1024px)
 */
function isDesktop() {
  return window.innerWidth >= CONFIG.breakpoints.desktop;
}

// ============================================================================
// DATA LAYER
// ============================================================================

/**
 * Builds configuration object from block HTML structure
 * @param {HTMLElement} block - The block element
 * @returns {Object} Configuration object with title, ariaLabel, and contents
 */
function buildBlockConfig(block) {
  const config = {};
  const rows = Array.from(block.children);

  // Read all rows to build the configuration
  rows.forEach((row) => {
    const cells = Array.from(row.children);

    if (cells.length > 0) {
      const key = cells[0]?.textContent?.trim();
      const value = cells.length > 1
        ? Array.from(cells.slice(1))
          .map((cell) => cell?.textContent?.trim())
          .filter((text) => text !== undefined)
          .join(' ')
        : '';

      if (key) {
        config[key] = value;
      }
    }
  });

  // Validate and set defaults
  const title = config['toc-title'] || 'Table of Contents';
  const ariaLabel = config['toc-aria-label'] || 'Table of Contents Navigation';
  const contents = [];

  // Build content array with validation
  let i = 1;
  let content = config[`content-${i}`];
  const MAX_ITERATIONS = 25; // Safety limit

  while (content && i <= MAX_ITERATIONS) {
    const abbreviatedContent = config[`content-${i}-short`];
    if (abbreviatedContent) {
      contents.push({ [`content-${i}-short`]: abbreviatedContent });
    }
    contents.push({ [`content-${i}`]: content });
    i += 1;
    content = config[`content-${i}`];
  }

  return contents.reduce((acc, el) => ({
    ...acc,
    ...el,
  }), { title, ariaLabel });
}

// ============================================================================
// DOM CREATION
// ============================================================================

/**
 * Creates the main TOC container
 * @param {string} ariaLabel - ARIA label for navigation
 * @returns {HTMLElement} TOC container element
 */
function createContainer(ariaLabel) {
  return createTag('div', {
    class: 'toc-v2-container open',
    role: 'navigation',
    'aria-label': ariaLabel,
  });
}

/**
 * Creates the TOC title button with chevron icon
 * @param {string} titleText - Title text content
 * @returns {HTMLElement} Title button element
 */
function createTitleBar(titleText) {
  const titleBar = createTag('button', {
    class: 'toc-v2-title',
    'aria-expanded': 'true',
    'aria-controls': 'toc-v2-content',
  });

  const titleSpan = createTag('span', { class: 'toc-v2-title-text' });
  titleSpan.textContent = titleText;

  const chevron = getIconElementDeprecated('chevron');
  chevron.classList.add('toc-v2-chevron');

  titleBar.appendChild(titleSpan);
  titleBar.appendChild(chevron);

  return titleBar;
}

/**
 * Creates the TOC content container with navigation links
 * @param {Object} config - Configuration object with contents
 * @returns {HTMLElement} TOC content element
 */
function createContentList(config) {
  const content = createTag('div', {
    class: 'toc-v2-content',
    id: 'toc-v2-content',
    role: 'region',
    'aria-label': config.ariaLabel,
    'aria-hidden': 'false',
  });

  // Create navigation links
  Object.keys(config).forEach((key) => {
    if (key.startsWith('content-') && !key.endsWith('-short')) {
      const link = createTag('a', {
        href: `#${key}`,
        class: 'toc-v2-link',
      });

      // Use short version if available
      const shortKey = `${key}-short`;
      const displayText = config[shortKey] || config[key];
      link.textContent = displayText;

      // Store full text for matching during scroll
      link.dataset.fullText = config[key];

      content.appendChild(link);
    }
  });

  return content;
}

/**
 * Creates social sharing icons section
 * @returns {HTMLElement} Social icons container
 */
function createSocialIcons() {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.querySelector('h1')?.textContent || '');
  const description = encodeURIComponent(getMetadata('description') || '');

  const platformMap = {
    x: {
      'data-href': `https://www.twitter.com/share?&url=${url}&text=${title}`,
      'aria-label': 'Share on Twitter',
      tabindex: '0',
    },
    linkedin: {
      'data-type': 'LinkedIn',
      'data-href': `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${description}`,
      'aria-label': 'Share on LinkedIn',
      tabindex: '0',
    },
    facebook: {
      'data-type': 'Facebook',
      'data-href': `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      'aria-label': 'Share on Facebook',
      tabindex: '0',
    },
    link: {
      id: 'toc-v2-copy-link',
      'aria-label': 'Copy link to clipboard',
      tabindex: '0',
    },
  };

  const socialContainer = createTag('div', { class: 'toc-v2-social-icons' });

  Object.entries(platformMap).forEach(([platform, attrs]) => {
    const icon = getIconElementDeprecated(platform);
    const link = createTag('a', attrs);
    link.appendChild(icon);
    socialContainer.appendChild(link);
  });

  return socialContainer;
}

// ============================================================================
// MOBILE/TABLET BEHAVIOR (< 1024px)
// ============================================================================

/**
 * Scrolls to target header with proper offset for mobile/tablet
 * @param {string} fullText - Full text content of target header
 */
function scrollToHeader(fullText) {
  const headers = document.querySelectorAll(CONFIG.selectors.headers);
  const targetHeader = Array.from(headers).find((h) => {
    const headerContent = h.textContent.trim();
    const searchText = fullText.replace('...', '').trim();
    return headerContent.includes(searchText);
  });

  if (targetHeader) {
    const headerRect = targetHeader.getBoundingClientRect();
    const offset = CONFIG.scrollOffset.mobile;
    const scrollDistance = headerRect.top + window.pageYOffset - offset;

    window.scrollTo({
      top: Math.max(0, scrollDistance),
      behavior: 'smooth',
    });
  }
}

/**
 * Sets up toggle behavior for mobile/tablet
 * @param {HTMLElement} container - TOC container
 * @param {HTMLElement} titleBar - Title button element
 * @param {HTMLElement} content - Content element
 */
function setupToggle(container, titleBar, content) {
  const toggle = () => {
    const isOpen = container.classList.toggle('open');
    titleBar.setAttribute('aria-expanded', isOpen.toString());
    content.setAttribute('aria-hidden', (!isOpen).toString());
  };

  // Click handler
  titleBar.addEventListener('click', toggle);

  // Keyboard accessibility
  titleBar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
}

/**
 * Sets up navigation behavior for links
 * @param {HTMLElement} content - Content element with links
 */
function setupNavigation(content) {
  const links = content.querySelectorAll('.toc-v2-link');

  links.forEach((link) => {
    // Prevent focus outline on mouse click
    link.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });

    // Handle click
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const { fullText } = link.dataset;
      scrollToHeader(fullText);
      // Remove focus after navigation
      link.blur();
    });
  });
}

/**
 * Opens social media sharing in popup windows
 * @param {Event} e - Click event
 */
function openSocialPopup(e) {
  const target = e.target.closest('a');
  if (!target) return;

  const href = target.getAttribute('data-href');
  const type = target.getAttribute('data-type');
  const ariaLabel = target.getAttribute('aria-label');

  const popup = window.open(
    href,
    type,
    'popup,top=233,left=233,width=700,height=467',
  );

  // Announce to screen readers
  const announcement = createTag('div', {
    role: 'status',
    'aria-live': 'polite',
    class: 'sr-only',
    style: 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;',
  }, `${ariaLabel} window opened`);

  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);

  if (popup && !popup.closed) {
    popup.focus();
  }
}

/**
 * Copies current URL to clipboard
 * @param {HTMLElement} button - Copy button element
 */
async function copyToClipboard(button) {
  try {
    await navigator.clipboard.writeText(window.location.href);
    const copyText = 'Copied to clipboard';
    button.setAttribute('aria-label', copyText);

    const tooltip = createTag('div', {
      role: 'status',
      'aria-live': 'polite',
      class: 'toc-v2-copied-tooltip',
    }, copyText);

    button.appendChild(tooltip);
    button.classList.add('copy-success');

    setTimeout(() => {
      tooltip.remove();
      button.classList.remove('copy-success');
    }, 3000);
  } catch (err) {
    button.classList.add('copy-failure');
    setTimeout(() => button.classList.remove('copy-failure'), 2000);
  }
}

/**
 * Sets up social sharing functionality
 * @param {HTMLElement} socialContainer - Social icons container
 */
function setupSocialSharing(socialContainer) {
  // Share links
  socialContainer.querySelectorAll('[data-href]').forEach((link) => {
    link.addEventListener('click', openSocialPopup);
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        openSocialPopup(e);
      }
    });
  });

  // Copy link button
  const copyButton = socialContainer.querySelector('#toc-v2-copy-link');
  if (copyButton) {
    copyButton.addEventListener('click', () => copyToClipboard(copyButton));
    copyButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        copyToClipboard(copyButton);
      }
    });
  }
}

// ============================================================================
// DESKTOP BEHAVIOR (≥ 1024px)
// ============================================================================

// TODO: Phase 2 - Desktop sticky positioning and active link tracking
// Will be added after mobile/tablet implementation is tested and approved

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
    window.lana?.log('TOC-V2: Failed to initialize dependencies:', error);
    throw new Error('Failed to load required utilities');
  }
}

/**
 * Main decoration function
 * @param {HTMLElement} block - The block element to decorate
 */
export default async function decorate(block) {
  try {
    // Phase 1: Initialize dependencies
    const utils = await initializeDependencies();
    createTag = utils.createTag;
    getMetadata = utils.getMetadata;

    // Phase 2: Extract configuration from block
    const config = buildBlockConfig(block);

    // Phase 3: Create DOM structure
    const container = createContainer(config.ariaLabel);
    const titleBar = createTitleBar(config.title);
    const content = createContentList(config);
    const socialIcons = createSocialIcons();

    // Phase 4: Assemble TOC
    container.appendChild(titleBar);
    container.appendChild(content);
    container.appendChild(socialIcons);

    // Phase 5: Setup behaviors (mobile/tablet only for now)
    if (!isDesktop()) {
      setupToggle(container, titleBar, content);
    }
    setupNavigation(content);
    setupSocialSharing(socialIcons);

    // Phase 6: Insert TOC after highlight element
    const highlightElement = document.querySelector(CONFIG.selectors.highlight);
    if (highlightElement) {
      highlightElement.insertAdjacentElement('afterend', container);
    } else {
      window.lana?.log('TOC-V2: No highlight element found');
    }

    // Hide original block
    block.style.display = 'none';
  } catch (error) {
    window.lana?.log('TOC-V2: Error during decoration:', error);
    block.style.display = 'none';
  }
}
