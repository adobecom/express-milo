import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';
import buildCarousel from '../../scripts/widgets/carousel.js';
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

async function handleMultipleUpCarousel(block, templates) {
  const parent = block.parentElement;
  parent.classList.add('multiple-up');
  // Make it behave like template-x for proper CSS inheritance
  block.classList.add('horizontal', 'three', 'template-x');
  
  // Create template-x-inner-wrapper like template-x
  const innerWrapper = createTag('div', { class: 'template-x-inner-wrapper' });
  
  // Import renderTemplate like template-x does
  try {
    const renderTemplateModule = await import('../template-x/template-rendering.js');
    const renderTemplate = renderTemplateModule.default;
    
    if (!renderTemplate) {
      throw new Error('renderTemplate is null or undefined');
    }
    
    // Use renderTemplate to create proper template elements with all the right structure
    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      const renderedTemplate = await renderTemplate(template);
      renderedTemplate.classList.add('template');
      innerWrapper.append(renderedTemplate);
    }
  } catch (e) {
    // Fallback if renderTemplate fails
    block.textContent = `Error loading templates: ${e.message}`;
    return;
  }
  
  block.innerHTML = '';
  block.append(innerWrapper);
  
      // Keep it simple - use the working infinite scroll carousel
    try {
      await buildCarousel(':scope > .template', innerWrapper, { 
        infinityScrollEnabled: true 
      });
    
    // Create gallery-control buttons that work with the existing carousel
    const carouselContainer = block.querySelector('.carousel-container');
    const carouselPlatform = block.querySelector('.carousel-platform');
    
    console.log('🔍 Carousel elements found:', { carouselContainer, carouselPlatform });
    
    if (carouselContainer && carouselPlatform) {
      // Create gallery-control structure
      const galleryControl = createTag('div', { class: 'gallery-control' });
      console.log('🎯 Created gallery-control:', galleryControl);
      
      const prevSVGHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Slider Button - Arrow - Left">
          <circle id="Ellipse 24477" cx="16" cy="16" r="16" transform="matrix(-1 0 0 1 32 0)" fill="#FFFFFF"/>
          <path id="chevron-right" d="M17.3984 21.1996L12.5984 16.3996L17.3984 11.5996" stroke="#292929" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      </svg>`;
      
      const nextSVGHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Slider Button - Arrow - Right">
          <circle id="Ellipse 24477" cx="16" cy="16" r="16" fill="#FFFFFF"/>
          <path id="chevron-right" d="M14.6016 21.1996L19.4016 16.3996L14.6016 11.5996" stroke="#292929" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      </svg>`;
      
      const prevButton = createTag('button', { 
        class: 'prev', 
        'aria-label': 'Previous' 
      });
      prevButton.innerHTML = prevSVGHTML;
      
      const nextButton = createTag('button', { 
        class: 'next', 
        'aria-label': 'Next' 
      });
      nextButton.innerHTML = nextSVGHTML;
      
      galleryControl.append(prevButton, nextButton);
      carouselContainer.append(galleryControl);
      
      console.log('✅ Gallery control appended to carousel container');
      console.log('🔍 Gallery control in DOM:', block.querySelector('.gallery-control'));
      
      // Hook into existing carousel scroll functionality
      prevButton.addEventListener('click', () => {
        const increment = Math.max((carouselPlatform.offsetWidth / 4) * 3, 300);
        carouselPlatform.scrollLeft -= increment;
      });
      
      nextButton.addEventListener('click', () => {
        const increment = Math.max((carouselPlatform.offsetWidth / 4) * 3, 300);
        carouselPlatform.scrollLeft += increment;
      });
    }
    
    // Fix hover behavior - add proper mouseleave handling for each template
    const templates = block.querySelectorAll('.template');
    templates.forEach(template => {
      template.addEventListener('mouseleave', () => {
        const buttonContainer = template.querySelector('.button-container.singleton-hover');
        if (buttonContainer) {
          buttonContainer.classList.remove('singleton-hover');
        }
      });
    });
  } catch (error) {
    console.error('Error initializing carousel:', error);
    // Fallback: just show templates without carousel
  }
  
  // Fix mobile hover behavior - remove singleton-hover when tapping elsewhere
  const clearAllHoverStates = () => {
    const hoveredContainers = block.querySelectorAll('.button-container.singleton-hover');
    hoveredContainers.forEach(container => {
      container.classList.remove('singleton-hover');
    });
  };
  
  // Add document-level click/touch handler to clear hover states on mobile
  const handleDocumentClick = (e) => {
    // Only handle on mobile width (768px or less) - works in both real mobile and responsive mode
    if (window.innerWidth > 768) return;
    
    // Check if click/touch is outside our carousel
    const isInsideCarousel = e.target.closest('.ax-template-x-promo.multiple-up');
    const isNavigationButton = e.target.closest('.carousel-fader-left, .carousel-fader-right');
    
    if (!isInsideCarousel || isNavigationButton) {
      clearAllHoverStates();
    }
  };
  
  document.addEventListener('click', handleDocumentClick, { passive: true });
  document.addEventListener('touchstart', handleDocumentClick, { passive: true });
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
    await handleMultipleUpCarousel(block, templates);
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
