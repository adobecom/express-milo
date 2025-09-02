import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';
import { fetchResults } from '../../scripts/template-utils.js';
import { isValidTemplate } from '../../scripts/template-search-api-v3.js';

// Global utilities (loaded dynamically)
let createTag;
let getConfig;
let replaceKey;
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
 * Creates a template element with hover overlay from template data
 */
async function createTemplateElement(templateData) {
  // Create main template container
  const templateEl = createTag('div', { class: 'promo-template' });
  
  // Create image wrapper with still image
  const imageWrapper = createTag('div', { class: 'promo-image-wrapper' });
  
  // Fix image URL by replacing the template parameters
  let imageUrl = templateData.thumbnail || templateData._links?.['http://ns.adobe.com/adobecloud/rel/rendition']?.href;
  if (imageUrl && imageUrl.includes('{&page,size,type,fragment}')) {
    // Try different image parameters - sometimes webp doesn't work
    imageUrl = imageUrl.replace('{&page,size,type,fragment}', '&page=0&size=512&type=image/jpeg');
  }
  
  console.log('🖼️ Template image URL:', imageUrl);
  
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
  
  // Add free/premium tag
  const isFreePlan = templateData.licensingCategory === 'free';
  if (isFreePlan) {
    const freeTag = createTag('span', { class: 'promo-plan-tag' });
    freeTag.textContent = 'Free';
    imageWrapper.append(freeTag);
  } else {
    const premiumIcon = getIconElementDeprecated('premium');
    if (premiumIcon) {
      premiumIcon.classList.add('promo-premium-icon');
      imageWrapper.append(premiumIcon);
    }
  }
  
  // Create hover overlay with buttons
  const hoverOverlay = createTag('div', { class: 'promo-hover-overlay' });
  
  // Edit button
  const editButton = createTag('a', {
    href: templateData.customLinks?.branchUrl || '#',
    class: 'promo-edit-button',
    target: '_self'
  });
  editButton.textContent = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
  
  // Share button
  const shareButton = createTag('button', { class: 'promo-share-button' });
  const shareIcon = getIconElementDeprecated('share-arrow');
  if (shareIcon) shareButton.append(shareIcon);
  
  hoverOverlay.append(editButton, shareButton);
  
  // Assemble template
  templateEl.append(imageWrapper, hoverOverlay);
  
  // Add hover behavior
  let isHovered = false;
  
  const showOverlay = () => {
    if (!isHovered) {
      // Clear other overlays first
      document.querySelectorAll('.promo-template.hover-active').forEach(t => {
        t.classList.remove('hover-active');
      });
      templateEl.classList.add('hover-active');
      isHovered = true;
    }
  };
  
  const hideOverlay = () => {
    templateEl.classList.remove('hover-active');
    isHovered = false;
  };
  
  // Desktop hover
  templateEl.addEventListener('mouseenter', showOverlay);
  templateEl.addEventListener('mouseleave', hideOverlay);
  
  // Mobile tap behavior
  templateEl.addEventListener('click', (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      if (!isHovered) {
        e.preventDefault();
        e.stopPropagation();
        showOverlay();
        return false;
      }
      // Second tap - allow navigation
    }
  });
  
  return templateEl;
}

/**
 * Creates our custom carousel with prev/next navigation
 */
async function createCustomCarousel(block, templates) {
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
    
    // Carousel logic
    let currentPosition = 0;
    const templateCount = templateElements.length;
    const templatesPerView = window.innerWidth <= 768 ? 1 : 3;
    
    const updateCarouselPosition = () => {
      // Each template is 255px wide + 20px gap = 275px total
      const templateTotalWidth = 275; // 255px + 20px gap
      const translateX = -(currentPosition * templateTotalWidth);
      carouselTrack.style.transform = `translateX(${translateX}px)`;
      
      console.log(`📍 Carousel position: ${currentPosition}, translateX: ${translateX}px`);
      
      // Update button states (no disabled states for infinite loop)
      prevButton.disabled = false;
      nextButton.disabled = false;
    };
    
    const moveNext = () => {
      if (currentPosition < templateCount - templatesPerView) {
        currentPosition++;
      } else {
        // Loop to beginning
        currentPosition = 0;
      }
      updateCarouselPosition();
    };
    
    const movePrev = () => {
      if (currentPosition > 0) {
        currentPosition--;
      } else {
        // Loop to end
        currentPosition = templateCount - templatesPerView;
      }
      updateCarouselPosition();
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
      document.querySelectorAll('.promo-template.hover-active').forEach(t => {
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
    updateCarouselPosition();
    
    console.log('✅ Custom carousel created successfully');
    console.log('🔍 Final DOM structure:', block.outerHTML.substring(0, 500) + '...');
    console.log('🔍 Templates in track:', carouselTrack.children.length);
    console.log('🔍 Track children:', Array.from(carouselTrack.children).map(child => child.className));
    
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

  // Initialize carousel
  // buildBasicCarousel(':scope > .template', newBlock);
  // loadCarousel(null, block, {});
  loadCarousel('.basic-carousel-platform', block, {});
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
    // Fallback implementations
    createTag = (tag, attrs) => {
      const el = document.createElement(tag);
      if (attrs) {
        Object.keys(attrs).forEach((key) => {
          if (key === 'class') el.className = attrs[key];
          else el.setAttribute(key, attrs[key]);
        });
      }
      return el;
    };
    getConfig = () => ({});
    replaceKey = async () => null;
    renderTemplate = null;
  }

  block.parentElement.classList.add('ax-template-x-promo');

  // Get API URL from recipe
  const apiUrl = extractApiParamsFromRecipe(block);

  if (apiUrl) {
    await handleApiDrivenTemplates(block, apiUrl);
  }
}
