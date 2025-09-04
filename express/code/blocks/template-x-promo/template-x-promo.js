import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';
import { fetchResults } from '../../scripts/template-utils.js';
import { isValidTemplate } from '../../scripts/template-search-api-v3.js';

// Global utilities (loaded dynamically)
let { createTag } = window; // Try to get it from window first
let { getConfig } = window;
let { replaceKey } = window;

// Removed unused getStillWrapperIcons function

/**
 * Extracts recipe parameters from DOM element
 */
function extractApiParamsFromRecipe(block) {
  const recipeElement = block.querySelector('[id^=recipe], h4');
  const recipeString = recipeElement?.parentElement?.nextElementSibling?.textContent;

  // Clean up the recipe DOM after extraction
  if (recipeElement && recipeElement.parentElement) {
    const recipeContainer = recipeElement.parentElement.parentElement; // Get the outer div
    if (recipeContainer) {
      recipeContainer.remove(); // Remove the entire recipe container
    }
  }

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

  // Extract template data
  const editUrl = templateData.customLinks?.branchUrl || '#';
  const templateTitle = templateData['dc:title']?.['i-default'] || 'Template';

  // Get and clean image URL
  // eslint-disable-next-line no-underscore-dangle
  let imageUrl = templateData._links?.['http://ns.adobe.com/adobecloud/rel/rendition']?.href;

  if (imageUrl && imageUrl.includes('{&')) {
    imageUrl = imageUrl.replace('{&page,size,type,fragment}', '');
  }

  if (!imageUrl || imageUrl.includes('{') || imageUrl.includes('undefined')) {
    throw new Error('Invalid template image URL');
  }

  // Create image with wrapper
  const img = createTag('img', {
    src: imageUrl,
    alt: templateTitle,
    loading: 'lazy',
  });

  const imgWrapper = createTag('div', { class: 'image-wrapper' });
  imgWrapper.append(img);

  // Note: No plan icon needed for API-driven templates
  // The API already provides the template type information

  block.append(imgWrapper);

  // Create edit button with localized text
  const editThisTemplate = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
  const editTemplateButton = createTag('a', {
    href: editUrl,
    title: `${editThisTemplate} ${templateTitle}`,
    class: 'button accent',
    'aria-label': `${editThisTemplate} ${templateTitle}`,
    target: '_blank',
  });

  editTemplateButton.textContent = editThisTemplate;
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

  let currentHoveredElement;

  const enterHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Follow template-x pattern exactly
    if (currentHoveredElement) {
      currentHoveredElement.classList.remove('singleton-hover');
    }
    currentHoveredElement = buttonContainer; // Target the button-container
    if (currentHoveredElement) {
      currentHoveredElement.classList.add('singleton-hover');
    }
    document.activeElement.blur();
  };

  const leaveHandler = () => {
    if (currentHoveredElement) {
      currentHoveredElement.classList.remove('singleton-hover');
      currentHoveredElement = null;
    }
  };

  // Add events to template (visible element)
  templateEl.addEventListener('mouseenter', enterHandler);
  templateEl.addEventListener('mouseleave', leaveHandler);
}

/**
 * Creates a template element with hover overlay from template data
 */
async function createTemplateElement(templateData) {
  // Create main template container
  const templateEl = createTag('div', { class: 'template' });

  // Create still wrapper (like template-x)
  const stillWrapper = createTag('div', { class: 'still-wrapper' });

  // Create image wrapper with the actual image (visible by default)
  const imageWrapper = createTag('div', { class: 'image-wrapper' });

  // Fix image URL by replacing the template parameters
  // eslint-disable-next-line no-underscore-dangle
  let imageUrl = templateData.thumbnail || templateData._links?.['http://ns.adobe.com/adobecloud/rel/rendition']?.href;
  if (imageUrl && imageUrl.includes('{&page,size,type,fragment}')) {
    // Try different image parameters - sometimes webp doesn't work
    imageUrl = imageUrl.replace('{&page,size,type,fragment}', '&page=0&size=512&type=image/jpeg');
  }

  // Create the actual image element (visible by default)
  const img = createTag('img', {
    src: imageUrl,
    alt: templateData['dc:title']?.['i-default'] || templateData.title?.['i-default'] || '',
    loading: 'lazy',
  });

  // Add error handling and success logging
  img.addEventListener('load', () => {
  });

  img.addEventListener('error', () => {
    // Fallback: show a placeholder
    img.style.backgroundColor = '#e0e0e0';
    img.style.minHeight = '200px';
    img.alt = 'Image failed to load';
  });

  imageWrapper.append(img);

  // Add free/premium tag to image wrapper
  const isFreePlan = templateData.licensingCategory === 'free';
  if (isFreePlan) {
    const freeTag = createTag('span', { class: 'free-tag' });
    freeTag.textContent = 'Free';
    imageWrapper.append(freeTag);
  } else {
    const premiumIcon = getIconElementDeprecated('premium');
    if (premiumIcon) {
      premiumIcon.classList.add('icon', 'icon-premium');
      imageWrapper.append(premiumIcon);
    }
  }

  stillWrapper.append(imageWrapper);

  // Create button container (following exact template-x pattern)
  const buttonContainer = createTag('div', { class: 'button-container' });

  // Edit button (CTA)
  const editButtonText = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
  const templateTitle = templateData['dc:title']?.['i-default'] || '';

  const editButton = createTag('a', {
    href: templateData.customLinks?.branchUrl || '#',
    class: 'button accent small',
    title: editButtonText,
    'aria-label': `${editButtonText} ${templateTitle}`,
    target: '_self',
  });
  editButton.textContent = editButtonText;

  // CTA Link (covers the media area) - NO IMAGE NEEDED, dark overlay shows original
  const ctaLink = createTag('a', {
    href: templateData.customLinks?.branchUrl || '#',
    class: 'cta-link',
    tabindex: '-1',
    'aria-label': `${editButtonText}: ${templateTitle}`,
    target: '_self',
  });

  // Media wrapper (contains a COPY of the image for hover state)
  const mediaWrapper = createTag('div', { class: 'media-wrapper' });

  // Create a copy of the SAME image for the hover state (use same URL)
  const hoverImageUrl = imageUrl; // Ensure we use the exact same URL
  const hoverImg = createTag('img', {
    src: hoverImageUrl,
    alt: templateData['dc:title']?.['i-default'] || templateData.title?.['i-default'] || '',
    loading: 'lazy',
    class: '',
  });

  mediaWrapper.append(hoverImg);

  // Share wrapper (goes inside media-wrapper like template-x)
  const shareWrapper = createTag('div', { class: 'share-icon-wrapper' });

  // Screen reader only element for accessibility
  const srOnly = createTag('div', {
    class: 'sr-only',
    'aria-live': 'polite',
  });
  shareWrapper.append(srOnly);

  // Share icon
  const shareIcon = getIconElementDeprecated('share-arrow');
  if (shareIcon) {
    shareIcon.classList.add('icon', 'icon-share-arrow');
    shareIcon.setAttribute('tabindex', '0');
    shareIcon.setAttribute('role', 'button');
    shareIcon.setAttribute('aria-label', `Share ${templateTitle}`);
    shareWrapper.append(shareIcon);
  }

  // Shared tooltip (like template-x)
  const sharedTooltip = createTag('div', {
    class: 'shared-tooltip',
    'aria-label': 'Copied to clipboard',
    role: 'tooltip',
    tabindex: '-1',
  });

  const checkmarkIcon = getIconElementDeprecated('checkmark-green');
  if (checkmarkIcon) {
    checkmarkIcon.classList.add('icon', 'icon-checkmark-green');
    sharedTooltip.append(checkmarkIcon);
  }

  const tooltipText = createTag('span', { class: 'text' });
  tooltipText.textContent = 'Copied to clipboard';
  sharedTooltip.append(tooltipText);

  shareWrapper.append(sharedTooltip);

  // Add media wrapper to cta link
  ctaLink.append(mediaWrapper);

  // Button container structure: ctaLink (image), editButton, shareWrapper (proper DOM order)
  buttonContainer.append(ctaLink, editButton, shareWrapper);

  // Assemble template (following template-x pattern)
  templateEl.append(stillWrapper, buttonContainer);

  // Add hover behavior exactly like template-x
  let currentHoveredElement;

  const enterHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Follow template-x pattern exactly
    if (currentHoveredElement) {
      currentHoveredElement.classList.remove('singleton-hover');
    }
    currentHoveredElement = e.target; // Use e.target directly like template-x
    if (currentHoveredElement) {
      currentHoveredElement.classList.add('singleton-hover');
    }
    document.activeElement.blur();
  };

  const leaveHandler = () => {
    if (currentHoveredElement) {
      currentHoveredElement.classList.remove('singleton-hover');
      currentHoveredElement = null;
    }
  };

  const focusHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentHoveredElement) {
      currentHoveredElement.classList.remove('singleton-hover');
    }
    currentHoveredElement = e.target.closest('.template');
    if (currentHoveredElement) {
      currentHoveredElement.classList.add('singleton-hover');
    }
  };

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

  templateEl.addEventListener('mouseleave', () => {
    leaveHandler();
  });

  // Focus handling for accessibility
  editButton.addEventListener('focusin', focusHandler);

  // Click handlers (matching template-x exactly)
  const ctaClickHandler = () => {
    // Add analytics tracking here if needed
  };

  // Combine the handlers properly
  const combinedClickHandler = (ev) => {
    // Touch device logic first
    if (window.matchMedia('(pointer: coarse)').matches) {
      if (!templateEl.classList.contains('singleton-hover')) {
        ev.preventDefault();
        ev.stopPropagation();
        enterHandler(ev);
        return false;
      }
    }

    // Regular click tracking
    ctaClickHandler();
    return true;
  };

  editButton.addEventListener('click', combinedClickHandler);
  ctaLink.addEventListener('click', combinedClickHandler);

  return templateEl;
}

/**
 * Creates our custom carousel using the functional carousel module
 */
export async function createCustomCarousel(block, templates) {
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
    const carouselWrapper = createTag('div', { class: 'promo-carousel-wrapper' });
    const carouselTrack = createTag('div', { class: 'promo-carousel-track' });
    const carouselViewport = createTag('div', { class: 'promo-carousel-viewport' });

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
      'aria-label': 'Previous templates',
    });
    prevButton.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#FFFFFF"/>
        <path d="M17.3984 21.1996L12.5984 16.3996L17.3984 11.5996" stroke="#292929" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    const nextButton = createTag('button', {
      class: 'promo-nav-btn promo-next-btn',
      'aria-label': 'Next templates',
    });
    nextButton.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#FFFFFF"/>
        <path d="M14.6016 21.1996L19.4016 16.3996L14.6016 11.5996" stroke="#292929" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    navContainer.append(prevButton, nextButton);
    carouselWrapper.append(navContainer);

    // Check if we're on mobile
    const isMobile = () => window.innerWidth < 768;

    // Mobile: 3-up carousel logic, Desktop: static all templates
    let currentIndex = 0;
    const elementsCount = templateElements.length;

    const updateCarouselDisplay = () => {
      // Clear track
      carouselTrack.innerHTML = '';

      if (isMobile()) {
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
        // Desktop: Show all templates equally, no carousel behavior
        templateElements.forEach((template) => {
          const templateClone = template.cloneNode(true);
          // Remove any carousel-specific classes
          templateClone.classList.remove('prev-template', 'current-template', 'next-template');
          attachHoverListeners(templateClone); // Re-attach events!
          carouselTrack.append(templateClone);
        });
      }
    };

    const moveNext = () => {
      currentIndex = (currentIndex + 1) % templateCount;
      updateCarouselDisplay();
    };

    const movePrev = () => {
      currentIndex = (currentIndex - 1 + templateCount) % templateCount;
      updateCarouselDisplay();
    };

    // Add event listeners
    nextButton.addEventListener('click', moveNext);
    prevButton.addEventListener('click', movePrev);

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
    const handleResize = () => {
      // Debounce resize events to prevent infinite loops
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateCarouselDisplay();
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

/**
 * Main API-driven template handler
 */
async function handleApiDrivenTemplates(block, apiUrl) {
  const { templates } = await fetchDirectFromApiUrl(apiUrl);

  if (!templates || templates.length === 0) {
    throw new Error('No valid templates found');
  }

  // Route to appropriate handler
  if (templates.length === 1) {
    await handleOneUpFromApiData(block, templates[0]);
  } else if (templates.length > 1) {
    await createCustomCarousel(block, templates);
  }
}

/**
 * Main block decorator
 */
export default async function decorate(block) {
  // Initialize utilities
  const libsPath = getLibs() || '../../scripts';
  try {
    const [utils, placeholders] = await Promise.all([
      import(`${libsPath}/utils.js`),
      import(`${libsPath}/features/placeholders.js`),
    ]);

    createTag = utils.createTag;
    getConfig = utils.getConfig;
    replaceKey = placeholders.replaceKey;
  } catch (utilsError) {
    // Fallback implementations - try window.createTag first
    createTag = window.createTag || ((tag, attrs) => {
      const el = document.createElement(tag);
      if (attrs) {
        Object.keys(attrs).forEach((key) => {
          if (key === 'class') el.className = attrs[key];
          else el.setAttribute(key, attrs[key]);
        });
      }
      return el;
    });
    getConfig = window.getConfig || (() => ({}));
    replaceKey = window.replaceKey || (async () => null);
  }

  block.parentElement.classList.add('ax-template-x-promo');

  // Get API URL from recipe
  const apiUrl = extractApiParamsFromRecipe(block);

  if (apiUrl) {
    await handleApiDrivenTemplates(block, apiUrl);
  }
}
