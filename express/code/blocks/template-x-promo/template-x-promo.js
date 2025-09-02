import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';
import loadCarousel from '../../scripts/utils/load-carousel.js';
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
  console.log('🔥 templates:', templates);

  if (!templates || templates.length === 0) {
    throw new Error('No valid templates found');
  }

  // Route to appropriate handler
  if (templates.length === 1) {
    await handleOneUpFromApiData(block, templates[0]);
  } else if (templates.length > 1) {
    await handleMultipleUpFromRenderedTemplates(block, templates);
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
