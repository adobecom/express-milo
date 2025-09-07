import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';
import { fetchResults } from '../../scripts/template-utils.js';
import { isValidTemplate } from '../../scripts/template-search-api-v3.js';
import { getTrackingAppendedURL } from '../../scripts/branchlinks.js';

// ============================================
// PURE FUNCTIONS - DATA TRANSFORMATION
// ============================================

// Pure function: Calculate tooltip positioning logic
function calculateTooltipPosition(tooltipRect, windowWidth) {
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

// Pure function: Generate share action data
function generateShareActionData(branchUrl, text, tooltipPosition) {
  return {
    url: branchUrl,
    text,
    tooltipClasses: tooltipPosition.shouldFlip
      ? ['display-tooltip', 'flipped']
      : ['display-tooltip'],
    timeoutDuration: 2500,
  };
}

// Pure function: Create share wrapper configuration
function createShareWrapperConfig(metadata) {
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

// Pure function: Build share wrapper DOM structure (returns configuration for DOM creation)
function buildShareWrapperStructure(metadata) {
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

// Share function - now uses pure functions for logic, side effects isolated
async function share(branchUrl, tooltip, timeoutId, liveRegion, text) {
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

// Global utilities (loaded dynamically)
let { createTag } = window; // Try to get it from window first
let { getConfig } = window;
let { replaceKey } = window;

// ============================================
// PURE FUNCTIONS - DATA TRANSFORMATION
// ============================================

/**
 * Extracts recipe string from DOM element (pure function)
 */
const extractRecipeFromElement = (block) => {
  const recipeElement = block.querySelector('[id^=recipe], h4');
  return recipeElement?.parentElement?.nextElementSibling?.textContent || null;
};

/**
 * Cleans up recipe DOM (side effect isolated)
 */
const cleanupRecipeDOM = (block) => {
  const recipeElement = block.querySelector('[id^=recipe], h4');
  if (recipeElement?.parentElement) {
    const recipeContainer = recipeElement.parentElement.parentElement;
    recipeContainer?.remove();
  }
};

/**
 * Fixes image URL format (pure function) - EXACTLY matches original behavior
 */
const fixImageUrl = (imageUrl) => {
  if (typeof imageUrl !== 'string') return null;
  return imageUrl; // Don't modify URLs - let original logic handle it
};

/**
 * Extracts template metadata (pure function)
 */
const extractTemplateMetadata = (templateData) => ({
  editUrl: templateData.customLinks?.branchUrl || templateData.branchUrl || '#',
  imageUrl: fixImageUrl(
    templateData.thumbnail?.url || templateData.thumbnail
    || templateData._links?.['http://ns.adobe.com/adobecloud/rel/rendition']?.href, // eslint-disable-line no-underscore-dangle
  ),
  title: templateData['dc:title']?.['i-default'] || (typeof templateData.title === 'string' ? templateData.title : templateData.title?.['i-default']) || '',
  isFree: templateData.licensingCategory === 'free',
  isPremium: templateData.licensingCategory !== 'free',
});

// ============================================
// ATOMIC DOM BUILDERS - PURE FUNCTIONS
// ============================================

// ============================================
// EVENT HANDLERS - FUNCTIONAL STYLE
// ============================================

/**
 * Creates hover state manager (pure function)
 */
const createHoverStateManager = () => {
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
};

/**
 * Creates mouse enter handler (pure function)
 */
const createMouseEnterHandler = (hoverManager, targetElement) => (e) => {
  e.preventDefault();
  e.stopPropagation();
  hoverManager.setHovered(targetElement);
  document.activeElement.blur();
};

/**
 * Creates mouse leave handler (pure function)
 */
const createMouseLeaveHandler = (hoverManager) => () => {
  hoverManager.clearHovered();
};

/**
 * Creates focus handler (pure function)
 */
const createFocusHandler = (hoverManager) => (e) => {
  e.preventDefault();
  e.stopPropagation();
  const templateElement = e.target.closest('.template');
  hoverManager.setHovered(templateElement);
};

/**
 * Creates click handler (pure function)
 */
const createClickHandler = (hoverManager, templateElement, analyticsHandler) => (ev) => {
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

/**
 * Creates image error handler (pure function)
 */
const createImageErrorHandler = () => function imageErrorHandler() {
  // Fallback: show a placeholder
  const img = this;
  img.style.backgroundColor = '#e0e0e0';
  img.style.minHeight = '200px';
  img.alt = 'Image failed to load';
};

/**
 * Creates an image element (pure function)
 */
const createImageElement = ({ src, alt, loading = 'lazy' }) => createTag('img', { src, alt, loading });

/**
 * Creates a wrapper div with class (pure function)
 */
const createWrapper = (className) => createTag('div', { class: className });

/**
 * Creates a free tag element (pure function)
 */
const createFreeTag = () => {
  const freeTag = createTag('span', { class: 'free-tag' });
  freeTag.textContent = 'Free';
  return freeTag;
};

/**
 * Creates a premium icon element (pure function)
 */
const createPremiumIcon = () => {
  const premiumIcon = getIconElementDeprecated('premium');
  if (premiumIcon) {
    premiumIcon.classList.add('icon', 'icon-premium');
    return premiumIcon;
  }
  // Fallback div with CSS class
  return createTag('div', { class: 'icon premium-fallback' });
};

/**
 * Creates a button element (pure function)
 */
const createButtonElement = (type, { href, text, title, ariaLabel }) => {
  const classes = type === 'edit' ? 'button accent small' : 'cta-link';

  const button = createTag('a', {
    href,
    class: classes,
    title: type === 'edit' ? 'Edit this template' : title,
    'aria-label': ariaLabel,
    target: '_self',
  });

  if (type === 'cta') {
    button.setAttribute('tabindex', '-1');
  }

  if (type === 'edit') {
    button.textContent = text;
  }

  return button;
};

/**
 * Extracts recipe parameters from DOM element (composed function)
 */
function extractApiParamsFromRecipe(block) {
  const recipeString = extractRecipeFromElement(block);
  cleanupRecipeDOM(block);
  return recipeString;
}

/**
 * Fetches templates from API
 */
async function fetchDirectFromApiUrl(recipe) {
  const data = await fetchResults(recipe);

  if (!data || !data.items || !Array.isArray(data.items)) {
    throw new Error('Invalid API response format');
  }

  const filtered = data.items.filter((item) => isValidTemplate(item));

  return { templates: filtered };
}

/**
 * Handles one-up template display
 */
async function handleOneUpFromApiData(block, templateData) {
  const parent = block.parentElement;
  parent.classList.add('one-up');
  block.innerHTML = '';

  // Extract metadata using our pure function
  const metadata = extractTemplateMetadata(templateData);

  // Get and clean image URL (original logic)
  let { imageUrl } = metadata;
  if (imageUrl && imageUrl.includes('{&')) {
    imageUrl = imageUrl.replace('{&page,size,type,fragment}', '');
  }

  if (!imageUrl || imageUrl.includes('{') || imageUrl.includes('undefined')) {
    throw new Error('Invalid template image URL');
  }

  // Create image with wrapper using our atomic functions
  const img = createImageElement({
    src: imageUrl,
    alt: metadata.title,
    loading: 'lazy',
  });

  const imgWrapper = createWrapper('image-wrapper');
  imgWrapper.append(img);

  // Note: No plan icon needed for API-driven templates
  // The API already provides the template type information

  block.append(imgWrapper);

  // Create edit button with localized text using our atomic function
  const editThisTemplate = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
  const editTemplateButton = createButtonElement('edit', {
    href: metadata.editUrl,
    text: editThisTemplate,
    title: `${editThisTemplate} ${metadata.title}`,
    ariaLabel: `${editThisTemplate} ${metadata.title}`,
  });

  const buttonContainer = createTag('section', { class: 'button-container' });
  buttonContainer.append(editTemplateButton);

  parent.append(buttonContainer);
}

/**
 * Attaches hover listeners to a template element (for cloned elements)
 */
function attachHoverListeners(templateEl) {
  const buttonContainer = templateEl.querySelector('.button-container');
  if (!buttonContainer) return;

  // Create hover state manager
  const hoverManager = createHoverStateManager();

  // Create event handlers using our functional approach
  const enterHandler = createMouseEnterHandler(hoverManager, buttonContainer);
  const leaveHandler = createMouseLeaveHandler(hoverManager);

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
      let timeoutId = null;
      const text = 'Copied to clipboard';

      // Remove any existing listeners first
      shareIcon.replaceWith(shareIcon.cloneNode(true));
      const newShareIcon = shareWrapper.querySelector('.icon-share-arrow');

      newShareIcon.addEventListener('click', async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        timeoutId = await share(shareIcon.getAttribute('data-edit-url') || '#', sharedTooltip, timeoutId, srOnly, text);
      });

      newShareIcon.addEventListener('keypress', async (e) => {
        if (e.key !== 'Enter') return;
        timeoutId = await share(shareIcon.getAttribute('data-edit-url') || '#', sharedTooltip, timeoutId, srOnly, text);
      });
    }
  });
}

/**
 * Creates a template element with hover overlay from template data
 */
async function createTemplateElement(templateData) {
  // Extract metadata using our pure function
  const metadata = extractTemplateMetadata(templateData);

  // Create main template container
  const templateEl = createWrapper('template');

  // Create still wrapper (like template-x)
  const stillWrapper = createWrapper('still-wrapper');

  // Create image wrapper with the actual image (visible by default)
  const imageWrapper = createWrapper('image-wrapper');

  // Fix image URL by replacing the template parameters (original logic)
  let { imageUrl } = metadata;
  if (imageUrl && imageUrl.includes('{&page,size,type,fragment}')) {
    // Try different image parameters - sometimes webp doesn't work
    imageUrl = imageUrl.replace('{&page,size,type,fragment}', '&page=0&size=512&type=image/jpeg');
  }

  // Create the actual image element using our atomic function
  const img = createImageElement({
    src: imageUrl,
    alt: metadata.title,
    loading: 'lazy',
  });

  // Add error handling for failed image loads using our functional approach
  img.addEventListener('error', createImageErrorHandler());

  imageWrapper.append(img);

  // Add free/premium tag to image wrapper using our atomic functions
  if (metadata.isFree) {
    const freeTag = createFreeTag();
    imageWrapper.append(freeTag);
  } else if (metadata.isPremium) {
    const premiumIcon = createPremiumIcon();
    imageWrapper.append(premiumIcon);
  }

  stillWrapper.append(imageWrapper);

  // Create button container (following exact template-x pattern)
  const buttonContainer = createWrapper('button-container');

  // Edit button (CTA) using our atomic function
  const editButtonText = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';

  const editButton = createButtonElement('edit', {
    href: metadata.editUrl,
    text: editButtonText,
    title: editButtonText,
    ariaLabel: `${editButtonText} ${metadata.title}`,
  });

  // CTA Link (covers the media area) using our atomic function
  const ctaLink = createButtonElement('cta', {
    href: metadata.editUrl,
    text: '',
    title: `${editButtonText}: ${metadata.title}`,
    ariaLabel: `${editButtonText}: ${metadata.title}`,
  });

  // Media wrapper (contains a COPY of the image for hover state)
  const mediaWrapper = createWrapper('media-wrapper');

  // Create a copy of the SAME image for the hover state using our atomic function
  const hoverImg = createImageElement({
    src: imageUrl, // Use the processed URL
    alt: metadata.title,
    loading: 'lazy',
  });

  mediaWrapper.append(hoverImg);

  // Pure: Generate share wrapper structure configuration
  const shareStructure = buildShareWrapperStructure(metadata);

  // Side effects: Create DOM elements from pure configuration
  const shareWrapper = createWrapper(shareStructure.wrapper.className);

  // Screen reader only element
  const srOnly = createTag(shareStructure.srOnly.tag, {
    class: shareStructure.srOnly.className,
    ...shareStructure.srOnly.attributes,
  });
  shareWrapper.append(srOnly);

  // Shared tooltip - create first so it's available for click handlers
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
    // Apply configuration from pure function
    shareIcon.classList.add(...shareStructure.shareIcon.className.split(' '));
    Object.entries(shareStructure.shareIcon.attributes).forEach(([key, value]) => {
      shareIcon.setAttribute(key, value);
    });
    shareWrapper.append(shareIcon);

    // Add click and keypress handlers for share icon (exactly like template-x)
    let timeoutId = null;
    const text = 'Copied to clipboard';

    shareIcon.addEventListener('click', async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      timeoutId = await share(metadata.editUrl, sharedTooltip, timeoutId, srOnly, text);
    });

    shareIcon.addEventListener('keypress', async (e) => {
      if (e.key !== 'Enter') return;
      timeoutId = await share(metadata.editUrl, sharedTooltip, timeoutId, srOnly, text);
    });
  }

  // Add media wrapper to cta link
  ctaLink.append(mediaWrapper);

  // Button container structure: ctaLink (image), editButton, shareWrapper (proper DOM order)
  buttonContainer.append(ctaLink, editButton, shareWrapper);

  // Assemble template (following template-x pattern)
  templateEl.append(stillWrapper, buttonContainer);

  // Add hover behavior using our functional approach
  const hoverManager = createHoverStateManager();

  // Create event handlers
  const enterHandler = createMouseEnterHandler(hoverManager, buttonContainer);
  const leaveHandler = createMouseLeaveHandler(hoverManager);
  const focusHandler = createFocusHandler(hoverManager);

  // Fix: Add mouseenter to the template element (visible), then apply to button-container
  templateEl.addEventListener('mouseenter', () => {
    // Simulate the event target being the button-container for template-x compatibility
    const fakeEvent = {
      target: buttonContainer,
      preventDefault: () => {},
      stopPropagation: () => {},
    };
    enterHandler(fakeEvent);
  });

  templateEl.addEventListener('mouseleave', leaveHandler);

  // Focus handling for accessibility
  editButton.addEventListener('focusin', focusHandler);

  // Click handlers using our functional approach
  const ctaClickHandler = () => {
    // Add analytics tracking here if needed
  };

  const combinedClickHandler = createClickHandler(hoverManager, templateEl, ctaClickHandler);

  editButton.addEventListener('click', combinedClickHandler);
  ctaLink.addEventListener('click', combinedClickHandler);

  return templateEl;
}

// Height management now uses API thumbnail dimensions for fast, accurate calculations

/**
 * Creates our custom carousel using the functional carousel module
 */
export async function createCustomCarousel(block, templates) {
  // Template analysis complete - API data loaded

  const parent = block.parentElement;
  parent.classList.add('multiple-up');

  // Add specific layout class based on template count
  const templateCount = templates.length;
  if (templateCount === 2) {
    parent.classList.add('two-up');
  } else if (templateCount === 3) {
    parent.classList.add('three-up');
  } else if (templateCount >= 4) {
    parent.classList.add('four-up');
  }

  block.classList.add('custom-promo-carousel');

  try {
    // Create all template elements
    const templateElements = await Promise.all(
      templates.map((template) => createTemplateElement(template)),
    );

    // Create carousel structure (back to original working implementation)
    const carouselWrapper = createTag('div', {
      class: 'promo-carousel-wrapper',
      role: 'region',
      'aria-label': 'Template carousel',
      tabindex: '0',
    });
    const carouselTrack = createTag('div', { class: 'promo-carousel-track' });
    const carouselViewport = createTag('div', {
      class: 'promo-carousel-viewport',
      'aria-live': 'polite',
      'aria-atomic': 'false',
    });

    // Add templates to track
    templateElements.forEach((template) => {
      attachHoverListeners(template);
      carouselTrack.append(template);
    });

    carouselViewport.append(carouselTrack);
    carouselWrapper.append(carouselViewport);

    // Create navigation buttons
    const navContainer = createTag('div', { class: 'promo-nav-controls' });

    const prevButton = createTag('button', {
      class: 'promo-nav-btn promo-prev-btn',
      'aria-label': 'View previous templates',
      'aria-describedby': 'carousel-status',
    });
    prevButton.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#FFFFFF"/>
        <path d="M17.3984 21.1996L12.5984 16.3996L17.3984 11.5996" stroke="#292929" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    const nextButton = createTag('button', {
      class: 'promo-nav-btn promo-next-btn',
      'aria-label': 'View next templates',
      'aria-describedby': 'carousel-status',
    });
    nextButton.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#FFFFFF"/>
        <path d="M14.6016 21.1996L19.4016 16.3996L14.6016 11.5996" stroke="#292929" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    // Initialize carousel state variables first
    let currentIndex = 0;
    const elementsCount = templateElements.length;

    // Add carousel status for screen readers
    const statusElement = createTag('div', {
      id: 'carousel-status',
      class: 'sr-only',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    });
    statusElement.textContent = `Showing template ${currentIndex + 1} of ${elementsCount}`;

    navContainer.append(prevButton, nextButton);
    carouselWrapper.append(navContainer, statusElement);

    // Measure actual rendered heights after DOM is built
    let FIXED_CONTAINER_HEIGHT = null;
    let heightCalculated = false; // Flag to prevent recalculation

    // Measure actual template heights after they're rendered
    const measureActualHeights = () => {
      if (heightCalculated) return; // Only measure once

      // Wait for images to load and measure actual heights
      const measureHeights = () => {
        const renderedTemplates = carouselTrack.querySelectorAll('.template');
        if (renderedTemplates.length === 0) return;

        const actualHeights = Array.from(renderedTemplates).map((template) => {
          // Get the actual rendered height of the template
          const rect = template.getBoundingClientRect();
          return rect.height;
        });

        // Use the tallest actual height
        const maxHeight = Math.max(...actualHeights);

        // Apply reasonable limits
        const finalHeight = Math.min(maxHeight, 600); // Cap at 600px
        FIXED_CONTAINER_HEIGHT = Math.max(finalHeight, 200); // Minimum 200px

        // Set viewport height for mobile carousel
        const viewport = carouselWrapper.querySelector('.promo-carousel-viewport');
        if (viewport) {
          viewport.style.setProperty('height', `${FIXED_CONTAINER_HEIGHT}px`, 'important');
          viewport.style.setProperty('min-height', `${FIXED_CONTAINER_HEIGHT}px`, 'important');
        }

        heightCalculated = true;
      };

      // Try multiple times to ensure images are loaded
      setTimeout(measureHeights, 100);
      setTimeout(measureHeights, 300);
      setTimeout(measureHeights, 500);
    };

    // Start measuring after DOM is ready
    measureActualHeights();

    const updateCarouselDisplay = () => {
      // Only update content - height remains fixed
      carouselTrack.innerHTML = '';

      if (window.innerWidth < 768) {
        // Restore height for mobile mode if it was calculated
        if (heightCalculated && FIXED_CONTAINER_HEIGHT !== null) {
          const viewport = carouselWrapper.querySelector('.promo-carousel-viewport');
          if (viewport) {
            viewport.style.setProperty('height', `${FIXED_CONTAINER_HEIGHT}px`, 'important');
            viewport.style.setProperty('min-height', `${FIXED_CONTAINER_HEIGHT}px`, 'important');
          }
        }
        // Mobile: Show prev-CURRENT-next with carousel behavior
        const prevIndex = (currentIndex - 1 + elementsCount) % elementsCount;
        const nextIndex = (currentIndex + 1) % elementsCount;

        // Add prev template
        const prevTemplate = templateElements[prevIndex].cloneNode(true);
        prevTemplate.classList.add('prev-template');
        attachHoverListeners(prevTemplate); // Re-attach events!
        carouselTrack.append(prevTemplate);

        // Add current template (center)
        const currentTemplate = templateElements[currentIndex].cloneNode(true);
        currentTemplate.classList.add('current-template');
        attachHoverListeners(currentTemplate); // Re-attach events!
        carouselTrack.append(currentTemplate);

        // Add next template
        const nextTemplate = templateElements[nextIndex].cloneNode(true);
        nextTemplate.classList.add('next-template');
        attachHoverListeners(nextTemplate); // Re-attach events!
        carouselTrack.append(nextTemplate);
      } else {
        // Desktop: Clear fixed height and show all templates equally
        const viewport = carouselWrapper.querySelector('.promo-carousel-viewport');
        if (viewport) {
          viewport.style.removeProperty('height');
          viewport.style.removeProperty('min-height');
        }

        // Desktop: Show all templates equally, no carousel behavior
        templateElements.forEach((template) => {
          const templateClone = template.cloneNode(true);
          // Remove any carousel-specific classes
          templateClone.classList.remove('prev-template', 'current-template', 'next-template');
          attachHoverListeners(templateClone); // Re-attach events!
          carouselTrack.append(templateClone);
        });
      }

      // Height already calculated and applied before DOM manipulation - no need to recalculate!
    };

    const moveNext = () => {
      currentIndex = (currentIndex + 1) % templateCount;
      updateCarouselDisplay();

      // Update status for screen readers
      statusElement.textContent = `Showing template ${currentIndex + 1} of ${templateCount}`;

      // Note: Height is now fixed and should never change
    };

    const movePrev = () => {
      currentIndex = (currentIndex - 1 + templateCount) % templateCount;
      updateCarouselDisplay();

      // Update status for screen readers
      statusElement.textContent = `Showing template ${currentIndex + 1} of ${templateCount}`;

      // Note: Height is now fixed and should never change
    };

    // Add event listeners
    nextButton.addEventListener('click', moveNext);
    prevButton.addEventListener('click', movePrev);

    // Keyboard navigation support
    carouselWrapper.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveNext();
          break;
        case 'Home':
          e.preventDefault();
          currentIndex = 0;
          updateCarouselDisplay();
          statusElement.textContent = `Showing template ${currentIndex + 1} of ${templateCount}`;
          break;
        case 'End':
          e.preventDefault();
          currentIndex = templateCount - 1;
          updateCarouselDisplay();
          statusElement.textContent = `Showing template ${currentIndex + 1} of ${templateCount}`;
          break;
        default:
          // No action needed for other keys
          break;
      }
    });

    // Touch/swipe support
    let startX = 0;
    let isDragging = false;

    carouselViewport.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    carouselViewport.addEventListener('touchmove', (e) => {
      e.preventDefault();
    });

    carouselViewport.addEventListener('touchend', (e) => {
      if (!isDragging) return;

      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      if (Math.abs(diffX) > 50) { // Minimum swipe distance
        if (diffX > 0) {
          moveNext();
        } else {
          movePrev();
        }
      }

      isDragging = false;
    });

    // Clear document click handler for mobile hover clearing
    const clearAllHovers = () => {
      document.querySelectorAll('.template.hover-active').forEach((t) => {
        t.classList.remove('hover-active');
      });
    };

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-promo-carousel') && window.innerWidth <= 768) {
        clearAllHovers();
      }
    });

    // Initialize carousel
    block.innerHTML = '';
    block.append(carouselWrapper);

    // Handle resize events to switch between mobile/desktop layouts
    let resizeTimeout;
    let currentMode = window.innerWidth < 768 ? 'mobile' : 'desktop';

    const handleResize = () => {
      // Debounce resize events to prevent infinite loops
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newMode = window.innerWidth < 768 ? 'mobile' : 'desktop';
        // Only update if mode actually changed
        if (newMode !== currentMode) {
          currentMode = newMode;
          updateCarouselDisplay();
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    // Initialize the display
    updateCarouselDisplay();

    // Production ready - test code removed
  } catch (e) {
    block.textContent = `Error loading templates: ${e.message}`;
  }
}

// ============================================
// FUNCTIONAL COMPOSITION - MAIN FLOW
// ============================================

/**
 * Initializes utilities with fallbacks (pure function)
 */
const initializeUtilities = async () => {
  const libsPath = getLibs() || '../../scripts';
  try {
    const [utils, placeholders] = await Promise.all([
      import(`${libsPath}/utils.js`),
      import(`${libsPath}/features/placeholders.js`),
    ]);

    return {
      createTag: utils.createTag,
      getConfig: utils.getConfig,
      replaceKey: placeholders.replaceKey,
    };
  } catch (utilsError) {
    // Fallback implementations
    return {
      createTag: window.createTag || ((tag, attrs) => {
        const el = document.createElement(tag);
        if (attrs) {
          Object.keys(attrs).forEach((key) => {
            if (key === 'class') el.className = attrs[key];
            else el.setAttribute(key, attrs[key]);
          });
        }
        return el;
      }),
      getConfig: window.getConfig || (() => ({})),
      replaceKey: window.replaceKey || (async () => null),
    };
  }
};

/**
 * Applies block styling (side effect function)
 */
const applyBlockStyling = (block) => {
  block.parentElement.classList.add('ax-template-x-promo');
};

/**
 * Routes templates to appropriate handler (pure function)
 */
const routeTemplates = async (block, templates) => {
  if (!templates || templates.length === 0) {
    return; // Graceful degradation - no templates available
  }

  if (templates.length === 1) {
    await handleOneUpFromApiData(block, templates[0]);
  } else if (templates.length > 1) {
    await createCustomCarousel(block, templates);
  }
};

/**
 * Handles API-driven templates with error handling (composed function)
 */
const handleApiDrivenTemplates = async (block, apiUrl) => {
  try {
    const { templates } = await fetchDirectFromApiUrl(apiUrl);
    await routeTemplates(block, templates);
  } catch (error) {
    // Graceful degradation - API error occurred
    // Silently fail to avoid breaking the page
  }
};

/**
 * Main block decorator using functional composition
 */
export default async function decorate(block) {
  // Initialize utilities
  const utilities = await initializeUtilities();

  // Apply utilities to global scope
  createTag = utilities.createTag;
  getConfig = utilities.getConfig;
  replaceKey = utilities.replaceKey;

  // Apply block styling
  applyBlockStyling(block);

  // Get API URL and handle templates
  const apiUrl = extractApiParamsFromRecipe(block);
  if (apiUrl) {
    await handleApiDrivenTemplates(block, apiUrl);
  }
}
