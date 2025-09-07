/**
 * Pure utility functions for template-x-promo
 * These functions have no side effects and can be easily tested and reused
 */

// ============================================
// PURE FUNCTIONS - DATA TRANSFORMATION
// ============================================

/**
 * Calculate tooltip positioning logic (pure function)
 * @param {DOMRect} tooltipRect - The tooltip's bounding rectangle
 * @param {number} windowWidth - The window's inner width
 * @returns {Object} Position data with shouldFlip flag and position info
 */
export function calculateTooltipPosition(tooltipRect, windowWidth) {
  const tooltipRightEdgePos = tooltipRect.left + tooltipRect.width;
  return {
    shouldFlip: tooltipRightEdgePos > windowWidth,
    position: {
      left: tooltipRect.left,
      right: tooltipRect.right,
      width: tooltipRect.width,
    },
  };
}

/**
 * Generate share action data (pure function)
 * @param {string} branchUrl - The URL to share
 * @param {string} text - The text to display
 * @param {Object} tooltipPosition - Position data from calculateTooltipPosition
 * @returns {Object} Share action configuration
 */
export function generateShareActionData(branchUrl, text, tooltipPosition) {
  return {
    url: branchUrl,
    text,
    tooltipClasses: tooltipPosition.shouldFlip
      ? ['display-tooltip', 'flipped']
      : ['display-tooltip'],
    timeoutDuration: 2500,
  };
}

/**
 * Create share wrapper configuration (pure function)
 * @param {Object} metadata - Template metadata
 * @returns {Object} Share wrapper configuration
 */
export function createShareWrapperConfig(metadata) {
  return {
    className: 'share-icon-wrapper',
    srOnly: {
      className: 'sr-only',
      attributes: { 'aria-live': 'polite' },
    },
    tooltip: {
      className: 'shared-tooltip',
      attributes: {
        'aria-label': 'Copied to clipboard',
        role: 'tooltip',
        tabindex: '-1',
      },
      text: 'Copied to clipboard',
    },
    shareIcon: {
      className: 'icon icon-share-arrow',
      attributes: {
        tabindex: '0',
        role: 'button',
        'aria-label': `Share ${metadata.title}`,
        'data-edit-url': metadata.editUrl,
      },
    },
  };
}

/**
 * Build share wrapper DOM structure (pure function)
 * Returns configuration for DOM creation
 * @param {Object} metadata - Template metadata
 * @returns {Object} Complete DOM structure configuration
 */
export function buildShareWrapperStructure(metadata) {
  const config = createShareWrapperConfig(metadata);

  return {
    wrapper: {
      tag: 'div',
      className: config.className,
    },
    srOnly: {
      tag: 'div',
      className: config.srOnly.className,
      attributes: config.srOnly.attributes,
    },
    tooltip: {
      tag: 'div',
      className: config.tooltip.className,
      attributes: config.tooltip.attributes,
      children: [
        {
          tag: 'img',
          className: 'icon icon-checkmark-green',
          attributes: {
            src: '/express/code/icons/checkmark-green.svg',
            alt: 'checkmark-green',
          },
        },
        {
          tag: 'span',
          className: 'text',
          textContent: config.tooltip.text,
        },
      ],
    },
    shareIcon: {
      tag: 'img',
      className: config.shareIcon.className,
      attributes: {
        ...config.shareIcon.attributes,
        src: '/express/code/icons/share-arrow.svg',
        alt: 'share-arrow',
      },
    },
  };
}

/**
 * Extract recipe string from DOM element (pure function)
 * @param {HTMLElement} element - The DOM element to extract recipe from
 * @returns {string|null} The recipe string or null if not found
 */
export function extractRecipeFromElement(element) {
  const recipeElement = element.querySelector('[id^=recipe], h4');
  return recipeElement?.parentElement?.nextElementSibling?.textContent || null;
}

/**
 * Clean recipe string by extracting URL from text (pure function)
 * @param {string} recipeString - The raw recipe string
 * @returns {string|null} The cleaned URL or null if not found
 */
export function cleanRecipeString(recipeString) {
  if (!recipeString) return null;
  const match = recipeString.match(/@(https?:\/\/[^\s]+)/);
  return match ? match[1] : null;
}

/**
 * Extract API URL from recipe string (pure function)
 * @param {string} recipeString - The recipe string
 * @returns {string|null} The API URL or null if not found
 */
export function extractApiUrl(recipeString) {
  if (!recipeString) return null;
  return recipeString.replace('@', '');
}

/**
 * Create template metadata from API data (pure function)
 * @param {Object} template - Template data from API
 * @param {number} index - Template index
 * @returns {Object} Normalized template metadata
 */
export function createTemplateMetadata(template, index) {
  return {
    id: template.id || `template-${index}`,
    title: template.title || 'Untitled Template',
    editUrl: template.editUrl || '#',
    imageUrl: template.imageUrl || '',
    isFree: template.isFree || false,
    isPremium: template.isPremium || false,
    index,
  };
}

/**
 * Determine template layout class (pure function)
 * @param {number} templateCount - Number of templates
 * @returns {string} CSS class for layout
 */
export function getTemplateLayoutClass(templateCount) {
  if (templateCount === 1) return 'one-up';
  if (templateCount === 2) return 'two-up';
  if (templateCount === 3) return 'three-up';
  if (templateCount === 4) return 'four-up';
  return 'multiple-up';
}

/**
 * Calculate carousel height for mobile (pure function)
 * @param {number} templateCount - Number of templates
 * @param {number} baseHeight - Base height per template
 * @returns {number} Calculated height
 */
export function calculateMobileHeight(templateCount, baseHeight = 200) {
  return Math.min(templateCount, 2) * baseHeight;
}

/**
 * Generate carousel status text (pure function)
 * @param {number} currentIndex - Current template index (0-based)
 * @param {number} totalTemplates - Total number of templates
 * @returns {string} Status text for screen readers
 */
export function generateCarouselStatusText(currentIndex, totalTemplates) {
  return `Showing template ${currentIndex + 1} of ${totalTemplates}`;
}

/**
 * Create navigation button configuration (pure function)
 * @param {string} direction - 'prev' or 'next'
 * @param {boolean} isDisabled - Whether the button should be disabled
 * @returns {Object} Button configuration
 */
export function createNavButtonConfig(direction, isDisabled = false) {
  return {
    className: `promo-nav-btn promo-${direction}-btn`,
    attributes: {
      'aria-label': `View ${direction === 'prev' ? 'previous' : 'next'} templates`,
      'aria-describedby': 'carousel-status',
      disabled: isDisabled,
    },
    svg: {
      width: '32',
      height: '32',
      viewBox: '0 0 32 32',
      path: direction === 'prev'
        ? 'M17.3984 21.1996L12.5984 16.3996L17.3984 11.5996'
        : 'M14.6016 21.1996L19.4016 16.3996L14.6016 11.5996',
    },
  };
}

// ============================================
// DOM ELEMENT CREATORS - PURE FUNCTIONS
// ============================================

/**
 * Fix image URL format (pure function)
 * @param {string} imageUrl - The image URL to validate
 * @returns {string|null} The validated URL or null if invalid
 */
export function fixImageUrl(imageUrl) {
  if (typeof imageUrl !== 'string') return null;
  return imageUrl; // Don't modify URLs - let original logic handle it
}

/**
 * Create image element configuration (pure function)
 * @param {Object} options - Image options
 * @param {string} options.src - Image source URL
 * @param {string} options.alt - Image alt text
 * @param {string} options.loading - Loading attribute
 * @returns {Object} Image element configuration
 */
export function createImageElementConfig({ src, alt, loading = 'lazy' }) {
  return {
    tag: 'img',
    attributes: { src, alt, loading },
  };
}

/**
 * Create wrapper element configuration (pure function)
 * @param {string} className - CSS class name
 * @returns {Object} Wrapper element configuration
 */
export function createWrapperConfig(className) {
  return {
    tag: 'div',
    attributes: { class: className },
  };
}

/**
 * Create free tag element configuration (pure function)
 * @returns {Object} Free tag element configuration
 */
export function createFreeTagConfig() {
  return {
    tag: 'span',
    attributes: { class: 'free-tag' },
    textContent: 'Free',
  };
}

/**
 * Create button element configuration (pure function)
 * @param {string} type - Button type ('edit' or 'cta')
 * @param {Object} options - Button options
 * @param {string} options.href - Button href
 * @param {string} options.text - Button text
 * @param {string} options.title - Button title
 * @param {string} options.ariaLabel - Button aria-label
 * @returns {Object} Button element configuration
 */
export function createButtonElementConfig(type, { href, text, title, ariaLabel }) {
  const classes = type === 'edit' ? 'button accent small' : 'cta-link';
  const tag = type === 'edit' ? 'a' : 'a';

  return {
    tag,
    attributes: {
      href,
      class: classes,
      title,
      'aria-label': ariaLabel,
      target: '_self',
    },
    textContent: text,
  };
}

// ============================================
// DATA PROCESSING - PURE FUNCTIONS
// ============================================

/**
 * Extract template metadata from API data (pure function)
 * @param {Object} templateData - Raw template data from API
 * @returns {Object} Normalized template metadata
 */
export function extractTemplateMetadata(templateData) {
  return {
    editUrl: templateData.customLinks?.branchUrl || templateData.branchUrl || '#',
    imageUrl: fixImageUrl(
      templateData.thumbnail?.url || templateData.thumbnail
      || templateData._links?.['http://ns.adobe.com/adobecloud/rel/rendition']?.href, // eslint-disable-line no-underscore-dangle
    ),
    title: templateData['dc:title']?.['i-default'] || (typeof templateData.title === 'string' ? templateData.title : templateData.title?.['i-default']) || '',
    isFree: templateData.licensingCategory === 'free',
    isPremium: templateData.licensingCategory !== 'free',
  };
}

/**
 * Clean up recipe DOM elements (pure function - returns cleanup instructions)
 * @param {HTMLElement} block - The block element
 * @returns {Object} Cleanup instructions
 */
export function getRecipeCleanupInstructions(block) {
  const recipeElement = block.querySelector('[id^=recipe], h4');
  return {
    shouldCleanup: !!recipeElement?.parentElement,
    elementToRemove: recipeElement?.parentElement,
  };
}

/**
 * Extract API parameters from recipe (pure function)
 * @param {HTMLElement} block - The block element
 * @returns {string|null} The recipe string or null
 */
export function extractApiParamsFromRecipe(block) {
  const recipeString = extractRecipeFromElement(block);
  return recipeString;
}

// ============================================
// STATE MANAGEMENT - PURE FUNCTIONS
// ============================================

/**
 * Create hover state manager configuration (pure function)
 * @returns {Object} Hover state manager configuration
 */
export function createHoverStateManagerConfig() {
  return {
    currentHoveredElement: null,
    singletonClass: 'singleton-hover',
  };
}

/**
 * Create image error handler configuration (pure function)
 * @returns {Object} Image error handler configuration
 */
export function createImageErrorHandlerConfig() {
  return {
    fallbackSrc: '/express/code/icons/fallback.svg',
    fallbackAlt: 'Image failed to load',
    errorClass: 'image-error',
  };
}

// ============================================
// STYLING UTILITIES - PURE FUNCTIONS
// ============================================

/**
 * Get block styling configuration (pure function)
 * @param {HTMLElement} block - The block element
 * @returns {Object} Styling configuration
 */
export function getBlockStylingConfig(block) {
  return {
    parentClasses: ['ax-template-x-promo'],
    shouldApply: !!block?.parentElement,
  };
}

/**
 * Get responsive layout classes (pure function)
 * @param {number} templateCount - Number of templates
 * @param {boolean} isMobile - Whether it's mobile view
 * @returns {Object} Layout class configuration
 */
export function getResponsiveLayoutConfig(templateCount, isMobile) {
  const baseClass = getTemplateLayoutClass(templateCount);
  const mobileClass = isMobile ? 'mobile' : 'desktop';

  return {
    base: baseClass,
    responsive: mobileClass,
    combined: `${baseClass} ${mobileClass}`,
  };
}

// ============================================
// STATE MANAGEMENT - PURE FUNCTIONS
// ============================================

/**
 * Create hover state manager (pure function)
 * @returns {Object} Hover state manager with methods
 */
export function createHoverStateManager() {
  let currentHoveredElement = null;

  return {
    setHovered: (element) => {
      if (currentHoveredElement) {
        currentHoveredElement.classList.remove('singleton-hover');
      }
      currentHoveredElement = element;
      if (currentHoveredElement) {
        currentHoveredElement.classList.add('singleton-hover');
      }
    },
    clearHovered: () => {
      if (currentHoveredElement) {
        currentHoveredElement.classList.remove('singleton-hover');
        currentHoveredElement = null;
      }
    },
    getCurrent: () => currentHoveredElement,
  };
}

// ============================================
// ROUTING LOGIC - PURE FUNCTIONS
// ============================================

/**
 * Determines template routing strategy (pure function)
 * @param {Array} templates - Array of templates
 * @returns {Object} Routing decision with handler type and data
 */
export function determineTemplateRouting(templates) {
  if (!templates || templates.length === 0) {
    return {
      strategy: 'none',
      reason: 'No templates available',
    };
  }

  if (templates.length === 1) {
    return {
      strategy: 'one-up',
      template: templates[0],
      reason: 'Single template display',
    };
  }

  return {
    strategy: 'carousel',
    templates,
    reason: 'Multiple templates - carousel display',
  };
}

// ============================================
// SHARING LOGIC - PURE FUNCTIONS
// ============================================

/**
 * Share function - orchestrates sharing logic (pure function)
 * @param {string} branchUrl - URL to share
 * @param {HTMLElement} tooltip - Tooltip element
 * @param {number} timeoutId - Current timeout ID
 * @param {HTMLElement} liveRegion - ARIA live region
 * @param {string} text - Text to display
 * @param {Function} getTrackingAppendedURL - Function to get tracking URL
 * @returns {Promise<number>} New timeout ID
 */
export async function share(
  branchUrl,
  tooltip,
  timeoutId,
  liveRegion,
  text,
  getTrackingAppendedURL,
) {
  // Pure: Generate tracking URL
  const urlWithTracking = await getTrackingAppendedURL(branchUrl, {
    placement: 'template-x',
    isSearchOverride: true,
  });

  // Pure: Calculate tooltip positioning
  const tooltipRect = tooltip.getBoundingClientRect();
  const tooltipPosition = calculateTooltipPosition(tooltipRect, window.innerWidth);

  // Pure: Generate share action data
  const shareData = generateShareActionData(branchUrl, text, tooltipPosition);

  // Side effects: Execute the share action
  await navigator.clipboard.writeText(urlWithTracking);

  // Apply tooltip classes based on pure calculation
  tooltip.classList.add(...shareData.tooltipClasses);

  // Update ARIA-live region
  liveRegion.textContent = shareData.text;

  // Clear existing timeout
  clearTimeout(timeoutId);

  // Return new timeout for cleanup
  return setTimeout(() => {
    tooltip.classList.remove('display-tooltip');
    tooltip.classList.remove('flipped');
  }, shareData.timeoutDuration);
}

// ============================================
// EVENT HANDLERS - PURE FUNCTIONS
// ============================================

/**
 * Creates mouse enter handler (pure function)
 * @param {Object} hoverManager - Hover state manager
 * @param {HTMLElement} targetElement - Target element to hover
 * @returns {Function} Event handler function
 */
export function createMouseEnterHandler(hoverManager, targetElement) {
  return (e) => {
    e.preventDefault();
    e.stopPropagation();
    hoverManager.setHovered(targetElement);
    document.activeElement.blur();
  };
}

/**
 * Creates mouse leave handler (pure function)
 * @param {Object} hoverManager - Hover state manager
 * @returns {Function} Event handler function
 */
export function createMouseLeaveHandler(hoverManager) {
  return () => {
    hoverManager.clearHovered();
  };
}

/**
 * Creates focus handler (pure function)
 * @param {Object} hoverManager - Hover state manager
 * @returns {Function} Event handler function
 */
export function createFocusHandler(hoverManager) {
  return (e) => {
    e.preventDefault();
    e.stopPropagation();
    const templateElement = e.target.closest('.template');
    hoverManager.setHovered(templateElement);
  };
}

/**
 * Creates click handler (pure function)
 * @param {Object} hoverManager - Hover state manager
 * @param {HTMLElement} templateElement - Template element
 * @param {Function} analyticsHandler - Analytics handler function
 * @returns {Function} Event handler function
 */
export function createClickHandler(hoverManager, templateElement, analyticsHandler) {
  return (ev) => {
    // Touch device logic first
    if (window.matchMedia('(pointer: coarse)').matches) {
      if (!templateElement.classList.contains('singleton-hover')) {
        ev.preventDefault();
        ev.stopPropagation();
        hoverManager.setHovered(templateElement);
        return false;
      }
    }

    // Regular click tracking
    if (analyticsHandler) {
      analyticsHandler();
    }
    return true;
  };
}

// ============================================
// ICON CREATION - PURE FUNCTIONS
// ============================================

/**
 * Creates premium icon element (pure function)
 * @param {Function} getIconElementDeprecated - Function to get icon element
 * @param {Function} createTag - Function to create DOM elements
 * @returns {HTMLElement} Premium icon element
 */
export function createPremiumIcon(getIconElementDeprecated, createTag) {
  const premiumIcon = getIconElementDeprecated('premium');
  if (premiumIcon) {
    premiumIcon.classList.add('icon', 'icon-premium');
    return premiumIcon;
  }
  // Fallback div with CSS class
  return createTag('div', { class: 'icon premium-fallback' });
}

/**
 * Creates image error handler (pure function)
 * @returns {Function} Image error handler function
 */
export function createImageErrorHandler() {
  return function imageErrorHandler() {
    // Fallback: show a placeholder
    const img = this;
    img.style.backgroundColor = '#e0e0e0';
    img.style.minHeight = '200px';
    img.alt = 'Image failed to load';
  };
}
