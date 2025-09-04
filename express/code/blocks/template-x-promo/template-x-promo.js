import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';
import { fetchResults } from '../../scripts/template-utils.js';
import { isValidTemplate } from '../../scripts/template-search-api-v3.js';

// Global utilities (loaded dynamically)
let { createTag } = window; // Try to get it from window first
let { getConfig } = window;
let { replaceKey } = window;

// Global height cache to survive DOM changes
window.templateXPromoHeightCache = window.templateXPromoHeightCache || {};

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

// ✅ REMOVED: Old setCarouselHeight function - using API dimensions now
// The old function had complex image loading, timeouts, and Promise.all logic
// Now we calculate heights directly from API thumbnail dimensions
/*
function setCarouselHeight(carouselWrapper, templateElements, block) {
  const cacheKey = `${window.location.pathname}-${block.parentElement.className}-${templateElements.length}`;

  // eslint-disable-next-line no-console
  console.log('🔍 setCarouselHeight called for:', cacheKey, 'with templates:', templateElements.length);

  // Use cached height only if it's from real measurements (not timeouts)
  if (carouselWrapper.dataset.cachedHeight
      && carouselWrapper.style.minHeight !== '200px'
      && carouselWrapper.style.minHeight !== ''
      && carouselWrapper.dataset.realMeasurement === 'true') {
    // eslint-disable-next-line no-console
    console.log('✅ Using cached real measurement:', carouselWrapper.dataset.cachedHeight);
    return; // Height already set from real measurement, don't recalculate
  }

  // Debug: Check why four-up might be exiting early
  // eslint-disable-next-line no-console
  console.log('🔍 Early return check:', {
    cachedHeight: carouselWrapper.dataset.cachedHeight,
    minHeight: carouselWrapper.style.minHeight,
    shouldExit: carouselWrapper.dataset.cachedHeight && carouselWrapper.style.minHeight !== '200px' && carouselWrapper.style.minHeight !== '',
  });

  // If we have a cached height and current is corrupted, restore from cache
  if (carouselWrapper.dataset.cachedHeight && carouselWrapper.style.minHeight === '200px') {
    // eslint-disable-next-line no-console
    console.log('🔧 Restoring from cache:', carouselWrapper.dataset.cachedHeight);
    carouselWrapper.style.setProperty('min-height', carouselWrapper.dataset.cachedHeight, 'important');

    // Also restore viewport and track
    const viewport = carouselWrapper.querySelector('.promo-carousel-viewport');
    if (viewport) {
      viewport.style.setProperty('min-height', carouselWrapper.dataset.cachedHeight, 'important');
    }
    const track = carouselWrapper.querySelector('.promo-carousel-track');
    if (track) {
      track.style.setProperty('min-height', carouselWrapper.dataset.cachedHeight, 'important');
    }
    return;
  }

  // Debug when we detect corruption
  if (carouselWrapper.style.minHeight === '200px') {
    // eslint-disable-next-line no-console
    console.log('🚨 200px corruption detected! Recalculating container height...');
    // eslint-disable-next-line no-console
    console.trace('🔍 Stack trace for 200px corruption:');
  }

  // Wait for images to load and get the maximum height
  // eslint-disable-next-line no-console
  console.log('🔍 Starting image load promises for:', cacheKey, 'templates:', templateElements.length);

  const imageLoadPromises = templateElements.map((template, index) => {
    const img = template.querySelector('img');
    if (!img) {
      // eslint-disable-next-line no-console
      console.log(`🔍 No image found in template ${index} for:`, cacheKey);
      return Promise.resolve(0);
    }

    // eslint-disable-next-line no-console
    console.log(`🔍 Processing image ${index} for:`, cacheKey, 'src:', img.src, 'complete:', img.complete, 'naturalWidth:', img.naturalWidth, 'naturalHeight:', img.naturalHeight, 'offsetHeight:', img.offsetHeight);

    return new Promise((resolve) => {
      // Add timeout to prevent hanging promises
      const timeout = setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log(`⏰ Image ${index} timeout for:`, cacheKey, 'final state - complete:', img.complete, 'naturalWidth:', img.naturalWidth, 'naturalHeight:', img.naturalHeight, 'offsetHeight:', img.offsetHeight);

        // Try to use natural dimensions even on timeout if available
        const height = img.naturalHeight || img.offsetHeight || 200;
        resolve(height);
      }, 5000); // 5 second timeout

      // Check if image has natural dimensions (loaded)
      if (img.complete && img.naturalWidth > 0) {
        clearTimeout(timeout);
        // Use natural height if available, fallback to offset height
        const height = img.naturalHeight || img.offsetHeight || 200;
        // eslint-disable-next-line no-console
        console.log(`✅ Image ${index} already complete for:`, cacheKey, 'naturalHeight:', img.naturalHeight, 'offsetHeight:', img.offsetHeight, 'using:', height);
        resolve(height);
      } else {
        // eslint-disable-next-line no-console
        console.log(`⏳ Image ${index} waiting to load for:`, cacheKey, 'setting up listeners...');

        // Wait for image to load
        const loadHandler = () => {
          clearTimeout(timeout);
          // Prefer natural height for more accurate dimensions
          const height = img.naturalHeight || img.offsetHeight || 200;
          // eslint-disable-next-line no-console
          console.log(`✅ Image ${index} loaded via event for:`, cacheKey, 'naturalHeight:', img.naturalHeight, 'offsetHeight:', img.offsetHeight, 'using:', height);
          resolve(height);
        };

        const errorHandler = () => {
          clearTimeout(timeout);
          // eslint-disable-next-line no-console
          console.log(`❌ Image ${index} error for:`, cacheKey, 'falling back to 200px');
          resolve(200);
        };

        img.addEventListener('load', loadHandler, { once: true });
        img.addEventListener('error', errorHandler, { once: true });

        // Also check periodically in case events don't fire
        const checkInterval = setInterval(() => {
          if (img.complete && img.naturalWidth > 0) {
            clearTimeout(timeout);
            clearInterval(checkInterval);
            const height = img.naturalHeight || img.offsetHeight || 200;
            // eslint-disable-next-line no-console
            console.log(`✅ Image ${index} detected via polling for:`, cacheKey, 'naturalHeight:', img.naturalHeight, 'offsetHeight:', img.offsetHeight, 'using:', height);
            resolve(height);
          }
        }, 100); // Check every 100ms
      }
    });
  });

  Promise.all(imageLoadPromises).then((heights) => {
    // eslint-disable-next-line no-console
    console.log('🔍 Promise.all resolved for:', cacheKey, 'with heights:', heights);

    // Check if any images failed or timed out (200px fallback)
    const validHeights = heights.filter((h) => h > 200);
    const hasTimeouts = heights.some((h) => h === 200);

    if (hasTimeouts && validHeights.length === 0) {
      // eslint-disable-next-line no-console
      console.log('⚠️ All images timed out for:', cacheKey, 'skipping height management - let carousel size naturally');

      // Don't cache timeouts, don't apply any heights - just let it size naturally
      // This prevents constant retries while allowing natural sizing
      return;
    }

    // Define max-height limits for mobile vs desktop
    const isMobile = window.innerWidth < 768;
    const maxHeightLimit = isMobile ? 400 : 500; // Mobile: 400px, Desktop: 500px

    // Calculate actual container height (min of tallest image vs limit)
    const tallestImageHeight = Math.max(...heights, 200);
    const containerHeight = Math.min(tallestImageHeight, maxHeightLimit);

    // Debug: Log height calculation details
    // eslint-disable-next-line no-console
    console.log('🔍 Height calculation:', {
      heights,
      tallestImageHeight,
      maxHeightLimit,
      containerHeight,
      isMobile,
      templateCount: templateElements.length,
      imageDetails: templateElements.map((t) => {
        const img = t.querySelector('img');
        return img ? `${img.offsetHeight}px (${img.complete ? 'loaded' : 'loading'})` : 'no-img';
      }),
    });

    // Set container height to prevent jumping
    carouselWrapper.style.setProperty('min-height', `${containerHeight}px`, 'important');

    // Cache the calculated height globally (survives DOM changes)
    window.templateXPromoHeightCache[cacheKey] = `${containerHeight}px`;
    carouselWrapper.dataset.heightCalculated = 'true';
    carouselWrapper.dataset.cachedHeight = `${containerHeight}px`;
    carouselWrapper.dataset.realMeasurement = 'true'; // Mark as real measurement
    carouselWrapper.dataset.cacheKey = cacheKey;

    // eslint-disable-next-line no-console
    console.log('💾 Global cache set:', cacheKey, '=', window.templateXPromoHeightCache[cacheKey]);

    // Set max-height on images to crop very tall ones
    templateElements.forEach((template) => {
      const img = template.querySelector('img');
      if (img) {
        img.style.setProperty('max-height', `${maxHeightLimit}px`, 'important');
        img.style.setProperty('object-fit', 'cover', 'important');
      }
    });

    // Also apply to viewport and track for consistency
    const viewport = carouselWrapper.querySelector('.promo-carousel-viewport');
    if (viewport) {
      viewport.style.setProperty('min-height', `${containerHeight}px`, 'important');
    }

    const track = carouselWrapper.querySelector('.promo-carousel-track');
    if (track) {
      track.style.setProperty('min-height', `${containerHeight}px`, 'important');
    }

    carouselWrapper.dataset.heightCalculated = 'true'; // Mark as calculated
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('🚨 Promise.all failed for:', cacheKey, 'error:', error);
  });

  // Also handle ResizeObserver for responsive scenarios
  if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(() => {
      // Recalculate on resize
      const currentHeights = templateElements.map((template) => {
        const img = template.querySelector('img');
        return img ? img.offsetHeight : 200;
      });

      const isMobile = window.innerWidth < 768;
      const maxHeightLimit = isMobile ? 400 : 500;
      const tallestImageHeight = Math.max(...currentHeights, 200);
      const containerHeight = Math.min(tallestImageHeight, maxHeightLimit);

      // Update container heights
      carouselWrapper.style.setProperty('min-height', `${containerHeight}px`, 'important');

      const viewport = carouselWrapper.querySelector('.promo-carousel-viewport');
      if (viewport) {
        viewport.style.setProperty('min-height', `${containerHeight}px`, 'important');
      }

      const track = carouselWrapper.querySelector('.promo-carousel-track');
      if (track) {
        track.style.setProperty('min-height', `${containerHeight}px`, 'important');
      }

      // Update image max-heights
      templateElements.forEach((template) => {
        const img = template.querySelector('img');
        if (img) {
          img.style.setProperty('max-height', `${maxHeightLimit}px`, 'important');
          img.style.setProperty('object-fit', 'cover', 'important');
        }
      });
    });

    templateElements.forEach((template) => {
      const img = template.querySelector('img');
      if (img) resizeObserver.observe(img);
    });
  }
}
*/

/**
 * Creates our custom carousel using the functional carousel module
 */
export async function createCustomCarousel(block, templates) {
  // 🔍 DEBUG: Log all template thumbnail data from API
  // eslint-disable-next-line no-console
  console.log('🔍 API Template Data Analysis:', templates.map((template, index) => ({
    index,
    id: template.id?.substring(template.id.lastIndexOf(':') + 1) || 'no-id',
    title: template['dc:title']?.['i-default'] || 'no-title',
    thumbnailData: template.pages?.[0]?.rendition?.image?.thumbnail || 'NO THUMBNAIL DATA',
    taskSize: template.pages?.[0]?.task?.size?.name || 'NO TASK SIZE',
    // Full pages structure for debugging
    pagesStructure: template.pages?.map((page) => ({
      task: page.task,
      rendition: page.rendition?.image?.thumbnail,
    })) || 'NO PAGES',
  })));

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

    // Height management now handled in updateCarouselDisplay using API data

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
    // Mobile: 3-up carousel logic, Desktop: static all templates
    let currentIndex = 0;
    const elementsCount = templateElements.length;

    // 🔒 CALCULATE HEIGHT ONCE - NEVER CHANGE IT!
    const calculateFixedHeight = () => {
      const templateHeights = templates.map((template) => {
        // Get height from API data (thumbnail dimensions)
        const thumbnailHeight = template.pages?.[0]?.rendition?.image?.thumbnail?.height;
        const thumbnailWidth = template.pages?.[0]?.rendition?.image?.thumbnail?.width;

        if (thumbnailHeight && thumbnailWidth) {
          // Scale to our actual container width based on aspect ratio
          const aspectRatio = thumbnailHeight / thumbnailWidth;
          // Real container widths based on CSS and template count
          const isMobile = window.innerWidth < 768;
          const templateCount = templates.length;

          let containerWidth;
          if (isMobile) {
            // Mobile: 50% width with gaps, but constrained by viewport
            containerWidth = templateCount >= 4 ? 120 : templateCount === 3 ? 140 : 160;
          } else {
            // Desktop: divided evenly with gaps
            containerWidth = templateCount >= 4 ? 180 : templateCount === 3 ? 240 : 320;
          }

          const calculatedHeight = Math.round(containerWidth * aspectRatio);
          // Apply reasonable limits to prevent extreme heights
          const maxHeight = isMobile ? 400 : 500;
          return Math.min(calculatedHeight, maxHeight);
        }

        // Fallback: use task size if available
        const taskSize = template.pages?.[0]?.task?.size?.name;
        if (taskSize) {
          const [width, height] = taskSize.match(/(\d+)x(\d+)px/)?.slice(1, 3) || [];
          if (width && height) {
            const aspectRatio = parseInt(height) / parseInt(width);
            const isMobile = window.innerWidth < 768;
            const templateCount = templates.length;

            let containerWidth;
            if (isMobile) {
              containerWidth = templateCount >= 4 ? 120 : templateCount === 3 ? 140 : 160;
            } else {
              containerWidth = templateCount >= 4 ? 180 : templateCount === 3 ? 240 : 320;
            }

            const calculatedHeight = Math.round(containerWidth * aspectRatio);
            const maxHeight = isMobile ? 400 : 500;
            return Math.min(calculatedHeight, maxHeight);
          }
        }

        // Ultimate fallback: reasonable height based on layout
        const isMobile = window.innerWidth < 768;
        const templateCount = templates.length;
        return isMobile
          ? (templateCount >= 4 ? 240 : templateCount === 3 ? 280 : 320)
          : (templateCount >= 4 ? 180 : templateCount === 3 ? 240 : 320);
      });

      // Use the tallest template height OR max limit - NEVER EXCEED 400px!
      const isMobile = window.innerWidth < 768;
      const maxAllowed = isMobile ? 400 : 500;
      const calculatedMax = Math.max(...templateHeights);
      const finalHeight = Math.min(calculatedMax, maxAllowed);

      // eslint-disable-next-line no-console
      console.log('🔒 FIXED HEIGHT CALCULATED ONCE:', {
        templateHeights,
        calculatedMax,
        maxAllowed,
        finalHeight,
        isMobile,
        message: 'This height will NEVER change during navigation!',
        // Debug the individual template calculations
        templateDebug: templates.map((template, index) => {
          const thumbnailHeight = template.pages?.[0]?.rendition?.image?.thumbnail?.height;
          const thumbnailWidth = template.pages?.[0]?.rendition?.image?.thumbnail?.width;
          return {
            index,
            thumbnailHeight,
            thumbnailWidth,
            calculatedHeight: templateHeights[index],
          };
        }),
      });

      return finalHeight;
    };

    // Calculate the fixed height ONCE using ACTUAL rendered heights
    let FIXED_CONTAINER_HEIGHT = calculateFixedHeight();

    // 🎯 BETTER: Wait for images to render, then use their ACTUAL heights
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('⏰ Timeout fired - checking actual heights...');

      // Debug: Check what's actually in the carousel track
      // eslint-disable-next-line no-console
      console.log('🔍 DEBUG: carouselTrack HTML structure:', carouselTrack.innerHTML.substring(0, 500));

      // Try multiple selectors to find images
      const selectors = [
        '.template .promo-image-wrapper img',
        '.template img',
        'img',
        '.image-wrapper img',
        '.still-wrapper img',
      ];

      let renderedImages = [];
      for (const selector of selectors) {
        renderedImages = carouselTrack.querySelectorAll(selector);
        // eslint-disable-next-line no-console
        console.log(`🔍 Selector "${selector}" found:`, renderedImages.length, 'images');
        if (renderedImages.length > 0) break;
      }

      // Filter to only main template images (exclude icons)
      const mainImages = Array.from(renderedImages).filter((img) => {
        const src = img.src || '';
        return src.includes('design-assets.adobeprojectm.com')
               && !src.includes('.svg')
               && !src.includes('premium')
               && !src.includes('share-arrow')
               && !src.includes('checkmark');
      });

      const actualHeights = mainImages.map((img, index) => {
        const height = img.offsetHeight;
        // eslint-disable-next-line no-console
        console.log(`🔍 Main template image ${index} height:`, height, 'src:', img?.src?.substring(img.src.lastIndexOf('/') + 1) || 'no-src');
        return height;
      });

      // eslint-disable-next-line no-console
      console.log('📊 All actual heights:', actualHeights);

      if (actualHeights.some((h) => h > 0)) {
        const tallestActualHeight = Math.max(...actualHeights);

        // eslint-disable-next-line no-console
        console.log('📏 ACTUAL vs CALCULATED heights:', {
          calculated: FIXED_CONTAINER_HEIGHT,
          actualHeights,
          tallestActual: tallestActualHeight,
          shouldUseActual: tallestActualHeight > FIXED_CONTAINER_HEIGHT,
        });

        // If actual height is taller, use that instead
        if (tallestActualHeight > FIXED_CONTAINER_HEIGHT) {
          FIXED_CONTAINER_HEIGHT = tallestActualHeight;

          const viewport = carouselWrapper.querySelector('.promo-carousel-viewport');
          if (viewport) {
            viewport.style.setProperty('height', `${FIXED_CONTAINER_HEIGHT}px`, 'important');
            viewport.style.setProperty('min-height', `${FIXED_CONTAINER_HEIGHT}px`, 'important');
            // eslint-disable-next-line no-console
            console.log('🔄 VIEWPORT HEIGHT UPDATED to actual:', FIXED_CONTAINER_HEIGHT, 'px');
          }
        }
      }
    }, 200);

    // 🔒 SET VIEWPORT HEIGHT ONCE - NEVER TOUCH AGAIN!
    const viewport = carouselWrapper.querySelector('.promo-carousel-viewport');
    if (viewport) {
      // eslint-disable-next-line no-console
      console.log('🔍 BEFORE setting viewport - wrapper natural height:', carouselWrapper.offsetHeight, 'px');

      viewport.style.setProperty('height', `${FIXED_CONTAINER_HEIGHT}px`, 'important');
      viewport.style.setProperty('min-height', `${FIXED_CONTAINER_HEIGHT}px`, 'important');

      // eslint-disable-next-line no-console
      console.log('🔒 VIEWPORT HEIGHT SET ONCE:', FIXED_CONTAINER_HEIGHT, 'px - will NEVER be touched again!');

      // Double-check what actually got set
      // eslint-disable-next-line no-console
      console.log('🔍 VERIFY: viewport.style.height =', viewport.style.height);

      // Also check wrapper height after viewport is set
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log('🔍 AFTER timeout - wrapper height:', carouselWrapper.offsetHeight, 'viewport height:', viewport.offsetHeight);
      }, 100);
    }

    const updateCarouselDisplay = () => {
      // 🚫 DO NOT TOUCH HEIGHT! Only update content!

      // eslint-disable-next-line no-console
      console.log('📋 Navigation update - HEIGHT NOT TOUCHED, only content updated');

      // Clear track and update content (NO HEIGHT MANIPULATION!)
      carouselTrack.innerHTML = '';

      if (window.innerWidth < 768) {
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

      // Height already calculated and applied before DOM manipulation - no need to recalculate!
    };

    const moveNext = () => {
      currentIndex = (currentIndex + 1) % templateCount;
      updateCarouselDisplay();

      // Immediate fix for 200px corruption
      setTimeout(() => {
        if (carouselWrapper.style.minHeight === '200px') {
          // eslint-disable-next-line no-console
          console.log('🔧 Emergency fix: 200px detected after moveNext, forcing recalculation');
          carouselWrapper.dataset.heightCalculated = ''; // Force recalculation
          // Height already managed in updateCarouselDisplay
        }
      }, 10);
    };

    const movePrev = () => {
      currentIndex = (currentIndex - 1 + templateCount) % templateCount;
      updateCarouselDisplay();

      // Immediate fix for 200px corruption
      setTimeout(() => {
        if (carouselWrapper.style.minHeight === '200px') {
          // eslint-disable-next-line no-console
          console.log('🔧 Emergency fix: 200px detected after movePrev, forcing recalculation');
          carouselWrapper.dataset.heightCalculated = ''; // Force recalculation
          // Height already managed in updateCarouselDisplay
        }
      }, 10);
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
