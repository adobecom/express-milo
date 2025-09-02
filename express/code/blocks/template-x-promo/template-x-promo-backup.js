import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';
import buildBasicCarousel from '../../scripts/widgets/basic-carousel.js';
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

  // For one-up, just return API data. For multiple-up, render templates
  let templates;
  if (filtered.length === 1) {
    templates = [{ templateData: filtered[0] }];
  } else {
    // Render templates for carousel using the existing renderTemplate function
    if (renderTemplate) {
      const props = { renditionParams: { format: 'jpg', size: 151 } };
      templates = await Promise.all(
        filtered.map(async (template, index) => {
          const renderedTemplate = await renderTemplate(template, 'templates', props);
          return renderedTemplate; // This should be a proper DOM element
        }), 
      );
    } else {
      // Fallback: create proper template structure like renderTemplate
      templates = filtered.map((template, index) => {
        const templateEl = createTag('div', { class: 'template' });
        
        // Create still-wrapper (image container)
        const stillWrapper = createTag('div', { class: 'still-wrapper' });
        const imgWrapper = createTag('div', { class: 'image-wrapper' });
        
        // Get template info
        const title = template['dc:title']?.['i-default'] || `Template ${index + 1}`;
        
        // Get image URL
        // eslint-disable-next-line no-underscore-dangle
        let imageUrl = template._links?.['http://ns.adobe.com/adobecloud/rel/rendition']?.href;
        if (imageUrl && imageUrl.includes('{&')) {
          imageUrl = imageUrl.replace('{&page,size,type,fragment}', '');
        }
        if (!imageUrl || imageUrl.includes('{') || imageUrl.includes('undefined')) {
          imageUrl = `https://picsum.photos/240/320?random=template${index}`;
        }
        
        const img = createTag('img', {
          src: imageUrl, 
          alt: title, 
          loading: 'lazy',
        });
        imgWrapper.append(img);
        
        // Add free badge if applicable
        const templateType = template.licensingCategory || 'free';
        if (templateType === 'free') {
          const planIcon = createTag('div', { class: 'icon icon-free-badge' });
          planIcon.textContent = 'Free';
          imgWrapper.append(planIcon);
        }

        stillWrapper.append(imgWrapper);

        // Create hover-wrapper (button container) - match renderHoverWrapper pattern
        const btnContainer = createTag('div', { class: 'button-container' });

        const editUrl = template.customLinks?.branchUrl || '#';
        const editBtn = createTag('a', {
          href: editUrl, 
          class: 'button accent', 
          target: '_blank', 
          'aria-label': `Edit this template ${title}`,
        });
        editBtn.textContent = 'Edit this template';
        
        const editBtnLink = createTag('a', {
          href: editUrl, 
          target: '_blank', 
          class: 'cta-link',
        });
        editBtnLink.append(stillWrapper);
        
        btnContainer.append(editBtn);
        btnContainer.append(editBtnLink);
        
        // Add hover event handlers like renderHoverWrapper
        const enterHandler = () => {
          btnContainer.classList.add('singleton-hover', 'hovering');
        };
        const leaveHandler = () => {
          btnContainer.classList.remove('singleton-hover', 'hovering');
        };
        
        btnContainer.addEventListener('mouseenter', enterHandler);
        btnContainer.addEventListener('mouseleave', leaveHandler);

        templateEl.append(btnContainer);
        return templateEl;
      });
    }
  }

  return { templates };
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
async function handleMultipleUpFromRenderedTemplates(block, renderedTemplates) {
  const parent = block.parentElement;
  parent.classList.add('multiple-up');
  block.classList.add('basic-carousel');

  block.innerHTML = '';

  // Add templates to carousel FIRST
  renderedTemplates.forEach((template, index) => {
    
    // Check if it's a DOM element or needs to be created
    let templateElement;
    if (template && template.classList) {
      // It's already a DOM element
      templateElement = template;
    } else {
      return; // Skip invalid templates
    }
    
    templateElement.classList.add('template');
    block.append(templateElement);
  });
  
  console.log('🔥 Block children after appending:', block.children.length);

  // THEN initialize carousel (after templates are in DOM)
  await buildBasicCarousel('.template', block, {});
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
    // For one-up, pass the template data directly
    const templateData = templates[0].templateData || templates[0];
    await handleOneUpFromApiData(block, templateData);
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
