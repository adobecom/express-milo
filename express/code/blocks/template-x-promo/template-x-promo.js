import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';
import { fetchResults } from '../../scripts/template-utils.js';
import { isValidTemplate } from '../../scripts/template-search-api-v3.js';

// Global utilities (loaded dynamically)
let createTag = window.createTag; // Try to get it from window first
let getConfig = window.getConfig;
let replaceKey = window.replaceKey;
let renderTemplate;

/**
 * Creates plan icons for templates (free/premium)
 */
function getStillWrapperIcons(templateType) {
  let planIcon = null;
  if (templateType === 'free') {
    planIcon = createTag('span', { class: 'free-tag' });
    planIcon.textContent = 'Free';
  } else {
    planIcon = getIconElementDeprecated('premium');
  }
  return { planIcon };
}

/**
 * Extracts recipe parameters from DOM element
 */
function extractApiParamsFromRecipe(block) {
  const recipeString = block.querySelector('[id^=recipe], h4')?.parentElement?.nextElementSibling?.textContent;
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
  const templateType = templateData.licensingCategory || 'free';
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

  // Add plan icon
  const { planIcon } = getStillWrapperIcons(templateType);
  if (planIcon) {
    imgWrapper.append(planIcon);
  }

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
    console.log('🎯 CLONED TEMPLATE MOUSEENTER triggered!', e.target);
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
    
    console.log('✅ Singleton-hover applied to cloned template:', currentHoveredElement);
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
  
  console.log('🔧 Attached hover listeners to cloned template:', templateEl);
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
  let imageUrl = templateData.thumbnail || templateData._links?.['http://ns.adobe.com/adobecloud/rel/rendition']?.href;
  if (imageUrl && imageUrl.includes('{&page,size,type,fragment}')) {
    // Try different image parameters - sometimes webp doesn't work
    imageUrl = imageUrl.replace('{&page,size,type,fragment}', '&page=0&size=512&type=image/jpeg');
  }
  
  console.log('🖼️ Template image URL (main):', imageUrl);
  console.log('📊 Template data:', templateData['dc:title']?.['i-default'] || 'No title');
  
  // Create the actual image element (visible by default)
  const img = createTag('img', {
    src: imageUrl,
    alt: templateData['dc:title']?.['i-default'] || templateData.title?.['i-default'] || '',
    loading: 'lazy'
  });
  
  // Add error handling and success logging
  img.addEventListener('load', () => {
    console.log('✅ Image loaded successfully:', imageUrl.substring(0, 100) + '...');
  });
  
  img.addEventListener('error', (e) => {
    console.error('❌ Image failed to load:', imageUrl.substring(0, 100) + '...', e);
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
    target: '_self'
  });
  editButton.textContent = editButtonText;
  
  // CTA Link (covers the media area) - NO IMAGE NEEDED, dark overlay shows original
  const ctaLink = createTag('a', {
    href: templateData.customLinks?.branchUrl || '#',
    class: 'cta-link',
    tabindex: '-1',
    'aria-label': `${editButtonText}: ${templateTitle}`,
    target: '_self'
  });
  
  // Media wrapper (contains a COPY of the image for hover state)
  const mediaWrapper = createTag('div', { class: 'media-wrapper' });
  
  // Create a copy of the SAME image for the hover state (use same URL)
  const hoverImageUrl = imageUrl; // Ensure we use the exact same URL
  console.log('🖼️ Template image URL (hover):', hoverImageUrl);
  console.log('🔍 URLs match:', imageUrl === hoverImageUrl);
  const hoverImg = createTag('img', {
    src: hoverImageUrl,
    alt: templateData['dc:title']?.['i-default'] || templateData.title?.['i-default'] || '',
    loading: 'lazy',
    class: ''
  });
  
  mediaWrapper.append(hoverImg);
  
  // Share wrapper (goes inside media-wrapper like template-x)
  const shareWrapper = createTag('div', { class: 'share-icon-wrapper' });
  
  // Screen reader only element for accessibility
  const srOnly = createTag('div', { 
    class: 'sr-only',
    'aria-live': 'polite'
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
    tabindex: '-1'
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
  
  // Button container structure: editButton, ctaLink, shareWrapper (as siblings)
  buttonContainer.append(editButton, ctaLink, shareWrapper);
  
  // Assemble template (following template-x pattern)
  templateEl.append(stillWrapper, buttonContainer);
  
  // Add hover behavior exactly like template-x
  let currentHoveredElement;
  
  const enterHandler = async (e) => {
    console.log('🎯 ENTER HANDLER triggered:', e.type, e.target);
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
    
    console.log('✅ Singleton-hover applied to:', currentHoveredElement);
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
  console.log('🔧 Adding mouseenter to TEMPLATE element (visible) like template-x:', templateEl);
  
  templateEl.addEventListener('mouseenter', (e) => {
    console.log('🎯 TEMPLATE MOUSEENTER triggered!', e.target);
    // Simulate the event target being the button-container for template-x compatibility
    const fakeEvent = {
      target: buttonContainer,
      preventDefault: () => {},
      stopPropagation: () => {}
    };
    enterHandler(fakeEvent);
  });
  
  templateEl.addEventListener('mouseleave', (e) => {
    console.log('🎯 TEMPLATE MOUSELEAVE triggered!', e.target);
    leaveHandler();
  });
  
  // Focus handling for accessibility
  editButton.addEventListener('focusin', focusHandler);
  
  // Click handlers (matching template-x exactly)
  const ctaClickHandler = () => {
    // Add analytics tracking here if needed
    console.log('Template clicked:', templateData['dc:title']?.['i-default']);
  };
  
  // Combine the handlers properly
  const combinedClickHandler = (ev) => {
    console.log('🖱️ CLICK HANDLER triggered:', ev.type, ev.target);
    
    // Touch device logic first
    if (window.matchMedia('(pointer: coarse)').matches) {
      if (!templateEl.classList.contains('singleton-hover')) {
        console.log('🚫 Preventing navigation - showing hover first');
        ev.preventDefault();
        ev.stopPropagation();
        enterHandler(ev);
        return false;
      } else {
        console.log('✅ Second tap - allowing navigation');
      }
    }
    
    // Regular click tracking
    ctaClickHandler();
  };
  
  editButton.addEventListener('click', combinedClickHandler);
  ctaLink.addEventListener('click', combinedClickHandler);
  
  return templateEl;
}

/**
 * Creates our custom carousel with prev/next navigation
 */
export async function createCustomCarousel(block, templates) {
  const parent = block.parentElement;
  parent.classList.add('multiple-up');
  block.classList.add('custom-promo-carousel');
  
  try {
    console.log(`🏗️ Creating ${templates.length} template elements`);
    
    // Create all template elements
    const templateElements = await Promise.all(
      templates.map((template, index) => {
        console.log(`🏗️ Processing template ${index + 1}:`, template['dc:title']?.['i-default']);
        return createTemplateElement(template);
      })
    );
    
    console.log(`✅ Created ${templateElements.length} template elements`);
    
    // Create carousel structure
    const carouselWrapper = createTag('div', { class: 'promo-carousel-wrapper' });
    const carouselTrack = createTag('div', { class: 'promo-carousel-track' });
    const carouselViewport = createTag('div', { class: 'promo-carousel-viewport' });
    
    console.log('🏗️ Created carousel structure elements');
    
    // Add templates to track
    templateElements.forEach((template, index) => {
      console.log(`📝 Appending template ${index + 1} to track`);
      carouselTrack.append(template);
    });
    
    console.log('📝 All templates appended to track');
    
    carouselViewport.append(carouselTrack);
    carouselWrapper.append(carouselViewport);
    
    // Create navigation buttons
    const navContainer = createTag('div', { class: 'promo-nav-controls' });
    
    const prevButton = createTag('button', { 
      class: 'promo-nav-btn promo-prev-btn',
      'aria-label': 'Previous templates'
    });
    prevButton.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#FFFFFF"/>
        <path d="M17.3984 21.1996L12.5984 16.3996L17.3984 11.5996" stroke="#292929" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    
    const nextButton = createTag('button', { 
      class: 'promo-nav-btn promo-next-btn',
      'aria-label': 'Next templates'
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
    const templateCount = templateElements.length;
    
    const updateCarouselDisplay = () => {
      console.log(`📍 Current index: ${currentIndex} of ${templateCount}, Mobile: ${isMobile()}`);
      
      // Clear track
      carouselTrack.innerHTML = '';
      
      if (isMobile()) {
        // Mobile: Show prev-CURRENT-next with carousel behavior
        const prevIndex = (currentIndex - 1 + templateCount) % templateCount;
        const nextIndex = (currentIndex + 1) % templateCount;
        
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
        
        console.log(`📱 Mobile: prev(${prevIndex}) -> current(${currentIndex}) -> next(${nextIndex})`);
      } else {
        // Desktop: Show all templates equally, no carousel behavior
        templateElements.forEach((template, index) => {
          const templateClone = template.cloneNode(true);
          // Remove any carousel-specific classes
          templateClone.classList.remove('prev-template', 'current-template', 'next-template');
          attachHoverListeners(templateClone); // Re-attach events!
          carouselTrack.append(templateClone);
        });
        
        console.log(`🖥️ Desktop: Showing all ${templateCount} templates statically`);
      }
    };
    
    const moveNext = () => {
      currentIndex = (currentIndex + 1) % templateCount;
      updateCarouselDisplay();
      console.log(`➡️ Moved next to index: ${currentIndex}`);
    };
    
    const movePrev = () => {
      currentIndex = (currentIndex - 1 + templateCount) % templateCount;
      updateCarouselDisplay();
      console.log(`⬅️ Moved prev to index: ${currentIndex}`);
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
      document.querySelectorAll('.template.hover-active').forEach(t => {
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
        console.log('🔄 Window resized, updating carousel display');
        updateCarouselDisplay();
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initialize the display
    updateCarouselDisplay();
    
    console.log('✅ Custom carousel created successfully');
    console.log('🔍 Final DOM structure:', block.outerHTML.substring(0, 500) + '...');
    console.log('🔍 Templates in track:', carouselTrack.children.length);
    console.log('🔍 Track children:', Array.from(carouselTrack.children).map(child => child.className));
    
    // Add testing controls to window for easy testing
    window.testTemplateCarousel = {
      show4Templates: () => {
        console.log('🧪 Testing with 4 templates');
        createCustomCarousel();
      },
      show3Templates: () => {
        console.log('🧪 Testing with 3 templates');
        createCustomCarousel();
      },
      show2Templates: () => {
        console.log('🧪 Testing with 2 templates');
        createCustomCarousel();
      },
      getCurrentInfo: () => {
        console.log(`📊 Current: ${isMobile() ? 'Mobile' : 'Desktop'}, Templates: ${templateElements.length}, Index: ${currentIndex}`);
      }
    };
    
    // Create multiple carousels for visual testing
    window.createMultipleCarousels = async () => {
      console.log('🎠 Creating multiple carousel tests...');
      
      // Clear existing content
      const section = block.closest('.section');
      section.innerHTML = `
        <h2 style="text-align: center; margin: 40px 0 20px; font-size: 24px;">🎠 Carousel Testing with Different Template Counts</h2>
        <div style="background: #f0f0f0; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <strong>Instructions:</strong> Resize window to test mobile vs desktop behavior on each carousel below
        </div>
      `;
      
      // Test with 4 templates
      const section4 = document.createElement('div');
      section4.style.cssText = 'margin: 40px 0; padding: 20px; border: 2px solid #007acc; border-radius: 8px;';
      section4.innerHTML = '<h3 style="margin: 0 0 20px; color: #007acc;">4 Templates</h3>';
      const block4 = document.createElement('div');
      block4.className = 'template-x-promo horizontal three template-x custom-promo-carousel';
      section4.appendChild(block4);
      section.appendChild(section4);
      
      // Test with 3 templates  
      const section3 = document.createElement('div');
      section3.style.cssText = 'margin: 40px 0; padding: 20px; border: 2px solid #28a745; border-radius: 8px;';
      section3.innerHTML = '<h3 style="margin: 0 0 20px; color: #28a745;">3 Templates</h3>';
      const block3 = document.createElement('div');
      block3.className = 'template-x-promo horizontal three template-x custom-promo-carousel';
      section3.appendChild(block3);
      section.appendChild(section3);
      
      // Test with 2 templates
      const section2 = document.createElement('div');
      section2.style.cssText = 'margin: 40px 0; padding: 20px; border: 2px solid #ffc107; border-radius: 8px;';
      section2.innerHTML = '<h3 style="margin: 0 0 20px; color: #ffc107;">2 Templates</h3>';
      const block2 = document.createElement('div');
      block2.className = 'template-x-promo horizontal three template-x custom-promo-carousel';
      section2.appendChild(block2);
      section.appendChild(section2);
      
      // Create carousels with different template counts
      await createCustomCarousel(block4, templateElements.slice(0, 4));
      await createCustomCarousel(block3, templateElements.slice(0, 3));
      await createCustomCarousel(block2, templateElements.slice(0, 2));
      
      console.log('✅ Multiple carousel test setup complete!');
    };
    
    console.log('🧪 Test controls available: window.testTemplateCarousel');
    console.log('   - show4Templates(), show3Templates(), show2Templates()');
    console.log('   - getCurrentInfo()');
    console.log('📱 Resize window to test mobile vs desktop behavior');
    
  } catch (e) {
    console.error('Error creating custom carousel:', e);
    block.textContent = `Error loading templates: ${e.message}`;
  }
}

/**
 * Handles multiple templates with carousel
 */
async function handleMultipleUpFromRenderedTemplates(block) {
  const parent = block.parentElement;
  parent.classList.add('multiple-up');
  block.classList.add('basic-carousel');

  block.innerHTML = '';

  // Add templates to carousel
  // renderedTemplates.forEach((template) => {
  //   template.classList.add('template');
  //   block.append(template);
  // });

  // Our custom carousel is initialized in handleApiDrivenTemplates
  // No need for external carousel libraries
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
    const [utils, placeholders, templateRendering] = await Promise.all([
      import(`${libsPath}/utils.js`),
      import(`${libsPath}/features/placeholders.js`),
      import('../template-x/template-rendering.js'),
    ]);

    ({ createTag, getConfig } = utils);
    ({ replaceKey } = placeholders);
    ({ default: renderTemplate } = templateRendering);
  } catch (utilsError) {
    console.log('⚠️ Utils failed to load, using fallback implementations');
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
    renderTemplate = null;
  }

  block.parentElement.classList.add('ax-template-x-promo');

  // Get API URL from recipe
  const apiUrl = extractApiParamsFromRecipe(block);

  if (apiUrl) {
    await handleApiDrivenTemplates(block, apiUrl);
  }
}
