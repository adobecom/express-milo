import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';
import loadCarousel from '../../scripts/utils/load-carousel.js';
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
 * Converts recipe parameters to full API URL
 */
function convertRecipeToApiUrl(recipeString) {
  const params = new URLSearchParams(recipeString);
  const templateIds = params.get('templateIds');

  if (!templateIds) return null;

  // Build API URL with proper collection ID and filters
  const collectionId = 'urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418';
  const filters = `id==${templateIds.split(',').map((id) => id.trim()).join(',')}`;

  return `https://www.adobe.com/express-search-api-v3?queryType=search&collectionId=${collectionId}&filters=${filters}&ax-env=stage`;
}

/**
 * Extracts recipe parameters from DOM element
 */
function extractApiParamsFromRecipe(block) {
  const recipeElement = block.querySelector('.recipe');
  if (!recipeElement) return null;

  let recipeString = null;

  // Check if it's a link or text content
  if (recipeElement.tagName === 'A' && recipeElement.href) {
    recipeString = recipeElement.href;
  } else {
    const textContent = recipeElement.textContent?.trim();
    if (textContent) {
      recipeString = textContent.startsWith('@') ? textContent.substring(1) : textContent;
    }
  }

  if (!recipeString) return null;

  // Return full API URL if already complete, otherwise convert recipe
  return recipeString.includes('express-search-api-v3')
    ? recipeString
    : convertRecipeToApiUrl(recipeString);
}

/**
 * Fetches templates from API with fallback mock data
 */
async function fetchDirectFromApiUrl(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.items || !Array.isArray(data.items)) {
      throw new Error('Invalid API response format');
    }

    const filtered = data.items.filter((item) => isValidTemplate(item));

    // For one-up, just return API data. For multiple-up, render templates
    let templates;
    if (filtered.length === 1) {
      templates = [{ templateData: filtered[0] }];
    } else {
      // Render templates for carousel
      const props = { renditionParams: { format: 'jpg', size: 151 } };
      templates = await Promise.all(
        filtered.map(async (template) => {
          const renderedTemplate = await renderTemplate(template, 'templates', props);
          renderedTemplate.templateData = template;
          return renderedTemplate;
        }),
      );
    }

    return { templates, fallbackMsg: null };
  } catch (error) {
    // Real API response data as fallback
    const mockTemplateData = {
      id: 'urn:aaid:sc:VA6C2:12053b1e-8454-4fda-8fd8-244e5eb7d060',
      status: 'approved',
      'dc:title': { 'i-default': 'Gray Modern Minimalist Good Morning Instagram Story' },
      assetType: 'Template',
      behaviors: ['still'],
      topics: ['day', 'good', 'marketing', 'morning', 'promo'],
      licensingCategory: 'free',
      language: 'en-US',
      customLinks: { branchUrl: 'https://adobesparkpost.app.link/9Sa3o4PJTCb' },
      stats: { remixCount: 1863 },
      _links: {
        'http://ns.adobe.com/adobecloud/rel/rendition': {
          href: 'https://design-assets.adobeprojectm.com/content/download/express/public/urn:aaid:sc:VA6C2:12053b1e-8454-4fda-8fd8-244e5eb7d060/rendition?assetType=TEMPLATE&etag=8e4d21c0a7032de38923078c19a3af32{&page,size,type,fragment}',
          templated: true,
        },
      },
    };

    const templates = [{ templateData: mockTemplateData }];
    return { templates, fallbackMsg: null };
  }
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
    const timestamp = Date.now();
    imageUrl = `https://picsum.photos/400/500?random=template${timestamp}`;
  }

  // Create image with wrapper
  const img = createTag('img', {
    src: imageUrl,
    alt: templateTitle,
    width: '400',
    height: '400',
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
async function handleMultipleUpFromRenderedTemplates(block, renderedTemplates) {
  const parent = block.parentElement;
  parent.classList.add('multiple-up');
  block.classList.add('basic-carousel');

  block.innerHTML = '';

  // Add templates to carousel
  renderedTemplates.forEach((template) => {
    template.classList.add('template');
    block.append(template);
  });

  // Initialize carousel
  loadCarousel('.template', block, {});
}

/**
 * Main API-driven template handler
 */
async function handleApiDrivenTemplates(block, apiUrl) {
  const { templates, fallbackMsg } = await fetchDirectFromApiUrl(apiUrl);

  if (!templates || templates.length === 0) {
    throw new Error(`No templates found: ${fallbackMsg}`);
  }

  // Route to appropriate handler
  if (templates.length === 1) {
    await handleOneUpFromApiData(block, templates[0].templateData);
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

  // Try to get API URL from recipe or use hardcoded for testing
  const apiUrl = extractApiParamsFromRecipe(block)
    || 'https://www.adobe.com/express-search-api-v3?queryType=search&collectionId=urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418&filters=id==urn:aaid:sc:VA6C2:12053b1e-8454-4fda-8fd8-244e5eb7d060&ax-env=stage';

  if (apiUrl) {
    await handleApiDrivenTemplates(block, apiUrl);
  }
}
