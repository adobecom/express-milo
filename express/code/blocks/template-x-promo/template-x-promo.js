import { getLibs } from '../../scripts/utils.js';
import {
  extractTemplateMetadata,
  extractApiParamsFromRecipe,
  getBlockStylingConfig,
  createHoverStateManager,
  determineTemplateRouting,
  createMouseEnterHandler,
  createMouseLeaveHandler,
  createFocusHandler,
  createClickHandler,
  createButtonSectionConfig,
  fetchDirectFromApiUrl,
  createImageSection,
  createShareSection,
} from './template-x-promo-utils.js';

// Global utilities (loaded dynamically)
let { createTag } = window; // Try to get it from window first
let { getConfig } = window;
let { replaceKey } = window;

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
  const img = createTag('img', {
    src: imageUrl,
    alt: metadata.title,
    loading: 'lazy',
  });

  const imgWrapper = createTag('div', { class: 'image-wrapper' });
  imgWrapper.append(img);

  block.append(imgWrapper);

  // Create edit button with localized text using our atomic function
  const editThisTemplate = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
  const editTemplateButton = createTag('a', {
    href: metadata.editUrl,
    class: 'button accent small',
    title: `${editThisTemplate} ${metadata.title}`,
    'aria-label': `${editThisTemplate} ${metadata.title}`,
    target: '_self',
  });
  editTemplateButton.textContent = editThisTemplate;

  const buttonContainer = createTag('section', { class: 'button-container' });
  buttonContainer.append(editTemplateButton);

  parent.append(buttonContainer);
}
/**
 * Creates button section for template element
 */
async function createButtonSection(metadata, processedImageUrl) {
  const editButtonText = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
  const buttonConfig = createButtonSectionConfig(
    metadata,
    editButtonText,
    processedImageUrl,
    createTag,
  );

  return buttonConfig;
}
/**
 * Attaches event handlers to template element
 */
function attachTemplateEvents(templateEl, buttonContainer, editButton, ctaLink, hoverManager) {
  // Create event handlers
  const enterHandler = createMouseEnterHandler(hoverManager, buttonContainer);
  const leaveHandler = createMouseLeaveHandler(hoverManager);
  const focusHandler = createFocusHandler(hoverManager);

  // Mouse events
  templateEl.addEventListener('mouseenter', () => {
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

  // Click handlers
  const ctaClickHandler = () => {
    // Add analytics tracking here if needed
  };

  const combinedClickHandler = createClickHandler(hoverManager, templateEl, ctaClickHandler);
  editButton.addEventListener('click', combinedClickHandler);
  ctaLink.addEventListener('click', combinedClickHandler);
}
/**
 * Creates a template element with hover overlay from template data
 */
async function createTemplateElement(templateData) {
  // Extract metadata using our pure function
  const metadata = extractTemplateMetadata(templateData);

  // Create main template container
  const templateEl = createTag('div', { class: 'template' });

  // Create sections using our functional approach
  const imageSection = await createImageSection(metadata);
  const buttonSection = await createButtonSection(metadata, imageSection.imageUrl);
  const shareSection = await createShareSection(metadata);

  // Assemble template structure
  templateEl.append(imageSection.stillWrapper, buttonSection.buttonContainer);
  buttonSection.buttonContainer.append(shareSection.shareWrapper);

  // Add hover behavior
  const hoverManager = createHoverStateManager();
  attachTemplateEvents(
    templateEl,
    buttonSection.buttonContainer,
    buttonSection.editButton,
    buttonSection.ctaLink,
    hoverManager,
  );

  return templateEl;
}
/**
 * Creates our custom carousel using the carousel factory
 */
export async function createCustomCarousel(block, templates) {
  try {
    // Create all template elements
    const templateElements = await Promise.all(
      templates.map((template) => createTemplateElement(template)),
    );

    // Add specific layout class based on template count
    const parent = block.parentElement;
    parent.classList.add('multiple-up');

    const templateCount = templates.length;
    if (templateCount === 2) {
      parent.classList.add('two-up');
    } else if (templateCount === 3) {
      parent.classList.add('three-up');
    } else if (templateCount >= 4) {
      parent.classList.add('four-up');
    }

    // Add templates directly to the parent section - this is what the CSS expects
    templateElements.forEach((template) => {
      parent.append(template);
    });

    // Return simple object - no custom carousel behavior
    return {
      currentIndex: () => 0,
      templateCount: () => templateElements.length,
      destroy: () => {
        // No cleanup needed
      },
    };
  } catch (e) {
    block.textContent = `Error loading templates: ${e.message}`;
    return null; // Return null on error
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
 * Routes templates to appropriate handler (side effects function)
 */
const routeTemplates = async (block, templates) => {
  const routingDecision = determineTemplateRouting(templates);

  switch (routingDecision.strategy) {
    case 'none':
      return; // Graceful degradation - no templates available
    case 'one-up':
      await handleOneUpFromApiData(block, routingDecision.template);
      break;
    case 'carousel':
      await createCustomCarousel(block, routingDecision.templates);
      break;
    default:
      // Unknown routing strategy - graceful degradation
  }
};
/**
 * Handles API-driven templates with error handling (composed function)
 */
const handleApiDrivenTemplates = async (block, apiUrl) => {
  try {
    const { templates } = await fetchDirectFromApiUrl(apiUrl);
    // Clear the original block content before creating carousel
    block.innerHTML = '';
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
  const stylingConfig = getBlockStylingConfig(block);
  if (stylingConfig.shouldApply) {
    block.parentElement.classList.add(...stylingConfig.parentClasses);
  }
  // Get API URL and handle templates
  const apiUrl = extractApiParamsFromRecipe(block);
  if (apiUrl) {
    await handleApiDrivenTemplates(block, apiUrl);
  }
}
