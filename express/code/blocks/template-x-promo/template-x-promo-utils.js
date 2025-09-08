/**
 * Pure utility functions for template-x-promo
 * These functions have no side effects and can be easily tested and reused
 */

// Static imports for better performance and tree-shaking
import { createTag as createTagUtil, getIconElementDeprecated as getIconElementDeprecatedUtil } from '../../scripts/utils.js';
import { getTrackingAppendedURL as getTrackingAppendedURLUtil } from '../../scripts/branchlinks.js';
import { fetchResults as fetchResultsUtil } from '../../scripts/template-utils.js';
import { isValidTemplate as isValidTemplateUtil } from '../../scripts/template-search-api-v3.js';

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
    clearTooltips: () => {
      if (currentHoveredElement) {
        const tooltips = currentHoveredElement.querySelectorAll('.shared-tooltip.display-tooltip');
        tooltips.forEach((tooltip) => {
          tooltip.classList.remove('display-tooltip');
          tooltip.classList.remove('flipped');
        });
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
  if (tooltip) {
    tooltip.classList.add(...shareData.tooltipClasses);
  }

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
    // Clear any visible tooltips when leaving the template
    hoverManager.clearTooltips();

    // Clear hover state
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

// ============================================
// API DATA FETCHING - PURE FUNCTIONS
// ============================================

/**
 * Fetches templates from API (pure function)
 * @param {string} recipe - API recipe parameter
 * @param {Function} [fetchResults] - Function to fetch API results (optional)
 * @param {Function} [isValidTemplate] - Function to validate templates (optional)
 * @returns {Promise<Object>} API response with templates
 */
export async function fetchDirectFromApiUrl(recipe, fetchResults, isValidTemplate) {
  // Use provided functions or fall back to static imports
  const fetchResultsFn = fetchResults || fetchResultsUtil;
  const isValidTemplateFn = isValidTemplate || isValidTemplateUtil;

  const data = await fetchResultsFn(recipe);

  if (!data || !data.items || !Array.isArray(data.items)) {
    throw new Error('Invalid API response format');
  }

  const filtered = data.items.filter((item) => isValidTemplateFn(item));

  return { templates: filtered };
}

// ============================================
// EVENT HANDLING - PURE FUNCTIONS
// ============================================

/**
 * Attaches hover listeners to template element (pure function)
 * @param {HTMLElement} templateEl - Template element
 * @param {Function} [createHoverStateManagerFn] - Function to create hover state manager (optional)
 * @param {Function} [createMouseEnterHandlerFn] - Function to create mouse enter handler (optional)
 * @param {Function} [createMouseLeaveHandlerFn] - Function to create mouse leave handler (optional)
 * @param {Function} [shareFn] - Function to handle sharing (optional)
 * @param {Function} [getTrackingAppendedURLFn] - Function to get tracking URL (optional)
 */
export function attachHoverListeners(
  templateEl,
  createHoverStateManagerFn,
  createMouseEnterHandlerFn,
  createMouseLeaveHandlerFn,
  shareFn,
  getTrackingAppendedURLFn,
) {
  // Use default functions if not provided
  const createHoverStateManagerDefault = createHoverStateManagerFn || createHoverStateManager;
  const createMouseEnterHandlerDefault = createMouseEnterHandlerFn || createMouseEnterHandler;
  const createMouseLeaveHandlerDefault = createMouseLeaveHandlerFn || createMouseLeaveHandler;
  const shareDefault = shareFn || share;
  const getTrackingAppendedURLDefault = getTrackingAppendedURLFn || getTrackingAppendedURLUtil;
  const buttonContainer = templateEl.querySelector('.button-container');
  if (!buttonContainer) return;

  // Create hover state manager
  const hoverManager = createHoverStateManagerDefault();

  // Create event handlers using our functional approach
  const enterHandler = createMouseEnterHandlerDefault(hoverManager, buttonContainer);
  const leaveHandler = createMouseLeaveHandlerDefault(hoverManager);

  // Add events to template (visible element)
  templateEl.addEventListener('mouseenter', enterHandler);
  templateEl.addEventListener('mouseleave', leaveHandler);

  // Re-attach share icon click handlers to cloned elements
  const shareIcons = templateEl.querySelectorAll('.share-icon-wrapper .icon-share-arrow');
  shareIcons.forEach((shareIcon) => {
    const shareWrapper = shareIcon.closest('.share-icon-wrapper');
    const sharedTooltip = shareWrapper?.querySelector('.shared-tooltip');
    const srOnly = shareWrapper?.querySelector('.sr-only');

    if (shareIcon && sharedTooltip && srOnly) {
      // For cloned templates in carousel, we need to re-attach event listeners
      // even if they have the data-events-attached attribute, because cloneNode
      // doesn't copy event listeners

      let timeoutId = null;
      const text = 'Copied to clipboard';

      // Mark this share icon as having event listeners attached
      shareIcon.setAttribute('data-events-attached', 'true');

      // Remove any existing event listeners first to prevent duplicates
      const newShareIcon = shareIcon.cloneNode(true);
      shareIcon.parentNode.replaceChild(newShareIcon, shareIcon);

      // Re-find the tooltip elements after cloning to ensure we have the right references
      const newShareWrapper = newShareIcon.closest('.share-icon-wrapper');
      const newSharedTooltip = newShareWrapper?.querySelector('.shared-tooltip');
      const newSrOnly = newShareWrapper?.querySelector('.sr-only');

      newShareIcon.addEventListener('click', async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        try {
          const getTrackingAppendedURL = await getTrackingAppendedURLDefault();
          timeoutId = await shareDefault(
            newShareIcon.getAttribute('data-edit-url') || '#',
            newSharedTooltip,
            timeoutId,
            newSrOnly,
            text,
            getTrackingAppendedURL,
          );
        } catch (error) {
          console.error('Share error:', error);
        }
      });

      newShareIcon.addEventListener('keypress', async (e) => {
        if (e.key !== 'Enter') return;
        try {
          const getTrackingAppendedURL = await getTrackingAppendedURLDefault();
          timeoutId = await shareDefault(
            newShareIcon.getAttribute('data-edit-url') || '#',
            newSharedTooltip,
            timeoutId,
            newSrOnly,
            text,
            getTrackingAppendedURL,
          );
        } catch (error) {
          console.error('Share error:', error);
        }
      });
    }
  });
}

// ============================================
// TEMPLATE ELEMENT CREATION - PURE FUNCTIONS
// ============================================

/**
 * Creates image section configuration (pure function)
 * @param {Object} metadata - Template metadata
 * @param {Function} createTag - Function to create DOM elements
 * @param {Function} getIconElementDeprecated - Function to get icon element
 * @returns {Object} Image section configuration
 */
export function createImageSectionConfig(metadata, createTag, getIconElementDeprecated) {
  // Fix image URL by replacing template parameters
  let { imageUrl } = metadata;
  if (imageUrl && imageUrl.includes('{&page,size,type,fragment}')) {
    imageUrl = imageUrl.replace('{&page,size,type,fragment}', '&page=0&size=512&type=image/jpeg');
  }

  const img = createTag('img', {
    src: imageUrl,
    alt: metadata.title ? `${metadata.title} template preview` : 'Template preview image',
    loading: 'lazy',
  });

  const imageWrapper = createTag('div', { class: 'image-wrapper' });
  imageWrapper.append(img);

  // Add free/premium tag

  if (metadata.isFree) {
    const freeTag = createTag('span', { class: 'free-tag' });
    freeTag.textContent = 'Free';
    imageWrapper.append(freeTag);
  } else if (metadata.isPremium) {
    const premiumIcon = createPremiumIcon(getIconElementDeprecated, createTag);
    imageWrapper.append(premiumIcon);
  }

  const stillWrapper = createTag('div', { class: 'still-wrapper' });
  stillWrapper.append(imageWrapper);

  return {
    stillWrapper,
    imageWrapper,
    img,
    imageUrl,
  };
}

/**
 * Creates button section configuration (pure function)
 * @param {Object} metadata - Template metadata
 * @param {string} editButtonText - Localized edit button text
 * @param {string} processedImageUrl - Processed image URL from image section
 * @param {Function} createTag - Function to create DOM elements
 * @returns {Object} Button section configuration
 */
export function createButtonSectionConfig(metadata, editButtonText, processedImageUrl, createTag) {
  const editButton = createTag('a', {
    href: metadata.editUrl,
    class: 'button accent small',
    title: editButtonText,
    'aria-label': `${editButtonText} ${metadata.title}`,
    target: '_self',
  });
  editButton.textContent = editButtonText;

  const ctaLink = createTag('a', {
    href: metadata.editUrl,
    class: 'cta-link',
    title: `${editButtonText}: ${metadata.title}`,
    'aria-label': `${editButtonText}: ${metadata.title}`,
    target: '_self',
    tabindex: '-1',
  });

  const mediaWrapper = createTag('div', { class: 'media-wrapper' });
  const hoverImg = createTag('img', {
    src: processedImageUrl,
    alt: metadata.title ? `${metadata.title} template preview` : 'Template preview image',
    loading: 'lazy',
  });
  mediaWrapper.append(hoverImg);
  ctaLink.append(mediaWrapper);

  const buttonContainer = createTag('div', { class: 'button-container' });
  buttonContainer.append(ctaLink, editButton);

  return {
    buttonContainer,
    editButton,
    ctaLink,
    mediaWrapper,
  };
}

/**
 * Creates share section configuration (pure function)
 * @param {Object} metadata - Template metadata
 * @param {Function} createTag - Function to create DOM elements
 * @param {Function} getIconElementDeprecated - Function to get icon element
 * @returns {Object} Share section configuration
 */
export function createShareSectionConfig(metadata, createTag, getIconElementDeprecated) {
  const shareStructure = buildShareWrapperStructure(metadata);

  const shareWrapper = createTag(shareStructure.wrapper.tag, {
    class: shareStructure.wrapper.className,
  });

  const srOnly = createTag(shareStructure.srOnly.tag, {
    class: shareStructure.srOnly.className,
    ...shareStructure.srOnly.attributes,
  });
  shareWrapper.append(srOnly);

  const sharedTooltip = createTag(shareStructure.tooltip.tag, {
    class: shareStructure.tooltip.className,
    ...shareStructure.tooltip.attributes,
  });

  // Create checkmark icon
  const checkmarkIcon = getIconElementDeprecated('checkmark-green');
  if (checkmarkIcon) {
    checkmarkIcon.classList.add('icon', 'icon-checkmark-green');
    sharedTooltip.append(checkmarkIcon);
  }

  // Create tooltip text
  const tooltipText = createTag(shareStructure.tooltip.children[1].tag, {
    class: shareStructure.tooltip.children[1].className,
  });
  tooltipText.textContent = shareStructure.tooltip.children[1].textContent;
  sharedTooltip.append(tooltipText);

  shareWrapper.append(sharedTooltip);

  // Share icon
  const shareIcon = getIconElementDeprecated('share-arrow');
  if (shareIcon) {
    shareIcon.classList.add(...shareStructure.shareIcon.className.split(' '));
    Object.entries(shareStructure.shareIcon.attributes).forEach(([key, value]) => {
      shareIcon.setAttribute(key, value);
    });
    shareWrapper.append(shareIcon);
  }

  return {
    shareWrapper,
    shareIcon,
    sharedTooltip,
    srOnly,
  };
}

/**
 * Creates image section for template element (pure function)
 * @param {Object} metadata - Template metadata
 * @param {Function} [createTag] - Function to create DOM elements (optional)
 * @param {Function} [getIconElementDeprecated] - Function to get icon element (optional)
 * @param {Function} [createImageErrorHandler] - Function to create image error handler (optional)
 * @returns {Object} Image section configuration
 */
export async function createImageSection(
  metadata,
  createTag,
  getIconElementDeprecated,
  createImageErrorHandlerFn,
) {
  // Use provided functions or fall back to static imports
  const createTagFn = createTag || createTagUtil;
  const getIconElementDeprecatedFn = getIconElementDeprecated || getIconElementDeprecatedUtil;
  const createImageErrorHandlerDefault = createImageErrorHandlerFn || createImageErrorHandler;

  const imageConfig = createImageSectionConfig(
    metadata,
    createTagFn,
    getIconElementDeprecatedFn,
  );

  // Add error handling for failed image loads
  imageConfig.img.addEventListener('error', createImageErrorHandlerDefault());

  return imageConfig;
}

/**
 * Creates share section for template element (pure function)
 * @param {Object} metadata - Template metadata
 * @param {Function} [createTag] - Function to create DOM elements (optional)
 * @param {Function} [getIconElementDeprecated] - Function to get icon element (optional)
 * @param {Function} [share] - Function to handle sharing (optional)
 * @param {Function} [getTrackingAppendedURL] - Function to get tracking URL (optional)
 * @returns {Object} Share section configuration
 */
export async function createShareSection(
  metadata,
  createTag,
  getIconElementDeprecated,
  shareFn,
  getTrackingAppendedURLFn,
) {
  // Use provided functions or fall back to static imports
  const createTagFn = createTag || createTagUtil;
  const getIconElementDeprecatedFn = getIconElementDeprecated || getIconElementDeprecatedUtil;
  const shareDefault = shareFn || share;
  const getTrackingAppendedURLFnResolved = getTrackingAppendedURLFn || getTrackingAppendedURLUtil;

  const shareConfig = createShareSectionConfig(
    metadata,
    createTagFn,
    getIconElementDeprecatedFn,
  );

  // Add share icon event handlers
  if (shareConfig.shareIcon) {
    let timeoutId = null;
    const text = 'Copied to clipboard';

    // Mark this share icon as having event listeners attached
    shareConfig.shareIcon.setAttribute('data-events-attached', 'true');

    shareConfig.shareIcon.addEventListener('click', async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      try {
        timeoutId = await shareDefault(
          metadata.editUrl,
          shareConfig.sharedTooltip,
          timeoutId,
          shareConfig.srOnly,
          text,
          getTrackingAppendedURLFnResolved,
        );
      } catch (error) {
        console.error('Share error:', error);
      }
    });

    shareConfig.shareIcon.addEventListener('keypress', async (e) => {
      if (e.key !== 'Enter') return;
      try {
        timeoutId = await shareDefault(
          metadata.editUrl,
          shareConfig.sharedTooltip,
          timeoutId,
          shareConfig.srOnly,
          text,
          getTrackingAppendedURLFnResolved,
        );
      } catch (error) {
        console.error('Share error:', error);
      }
    });
  }

  return shareConfig;
}
