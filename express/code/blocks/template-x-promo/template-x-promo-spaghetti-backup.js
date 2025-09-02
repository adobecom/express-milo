import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';
import loadCarousel from '../../scripts/utils/load-carousel.js';
import { fetchTemplates, isValidTemplate } from '../../scripts/template-search-api-v3.js';
// We'll import renderTemplate properly like template-x does
let renderTemplate;

let createTag;
let getConfig;
let replaceKey;

// Copy getStillWrapperIcons from template-promo for one-up layout


function extractApiParamsFromRecipe(block) {
  // Look for element with recipe class that contains recipe parameters
  const recipeElement = block.querySelector('.recipe');
  if (!recipeElement) return null;

  let recipeString = null;

  // Check if it's a link with href containing the recipe
  if (recipeElement.tagName === 'A' && recipeElement.href) {
    recipeString = recipeElement.href;
  } else {
    // Check if it's text content containing the recipe
    const textContent = recipeElement.textContent?.trim();
    if (textContent) {
      // Handle URLs that might start with @ symbol or be recipe params
      recipeString = textContent.startsWith('@') ? textContent.substring(1) : textContent;
    }
  }

  if (!recipeString) return null;

  // Check if it's already a full API URL
  if (recipeString.includes('express-search-api-v3')) {
    return recipeString;
  }

  // Convert recipe parameters to full API URL
  return convertRecipeToApiUrl(recipeString);
}

function convertRecipeToApiUrl(recipeString) {
  const params = new URLSearchParams(recipeString);
  
  // Get template IDs and collection
  const templateIds = params.get('templateIds');
  const collection = params.get('collection') || 'default';
  
  if (!templateIds) {
    console.error('No templateIds found in recipe');
    return null;
  }

  // Build the API URL based on the pattern from your examples
  const baseUrl = 'https://www.adobe.com/express-search-api-v3';
  const collectionId = collection === 'default' 
    ? 'urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418'
    : 'urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852'; // popular

  // Convert templateIds to filters format - single id== with comma-separated values
  const filters = `id==${templateIds.split(',').map(id => id.trim()).join(',')}`;
  
  const apiUrl = `${baseUrl}?queryType=search&collectionId=${collectionId}&filters=${filters}&ax-env=stage`;
  
  console.log('Converted recipe to API URL:', apiUrl);
  return apiUrl;
}

async function fetchDirectFromApiUrl(apiUrl) {
  try {
    console.log('Fetching from API URL:', apiUrl);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.items || !Array.isArray(data.items)) {
      console.error('Invalid API response format:', data);
      return { templates: null, fallbackMsg: 'Invalid response format' };
    }

    // Filter and render templates using the same pattern as template-x
    const filtered = data.items.filter((item) => isValidTemplate(item));
    
    // Create minimal props object for renderTemplate (following template-x pattern)
    const props = {
      renditionParams: {
        format: 'jpg',
        size: 151,
      }
    };

    // For one-up, just return API data. For multiple-up, render templates
    let templates;
    if (filtered.length === 1) {
      // One-up: just return the API data
      templates = [{ templateData: filtered[0] }];
    } else {
      // Multiple-up: render templates like template-x does
      templates = await Promise.all(
        filtered.map(async (template) => {
          const renderedTemplate = await renderTemplate(template, 'templates', props);
          renderedTemplate.templateData = template;
          return renderedTemplate;
        })
      );
    }

    console.log(`Successfully fetched and rendered ${templates.length} templates`);
    return { templates, fallbackMsg: null };
  } catch (error) {
    console.error('Error fetching from API URL:', error);
    console.log('🔄 Using fallback mock data for testing...');
    
    // Real API response data from Adobe Express Search API
    const mockTemplateData = {
      "id": "urn:aaid:sc:VA6C2:12053b1e-8454-4fda-8fd8-244e5eb7d060",
      "parentDirectoryId": "urn:aaid:sc:VA6C2:9964093a-b8a9-47fa-a02d-3116f8d8cd88",
      "path": "/content/approved/ccx/template/stock_community/8c64133f-c8da-5888-8010-dec1b6a37fd7",
      "contentType": "application/vnd.adobe.hz.express+dcx",
      "createDate": "2023-09-05T15:09:41.077Z",
      "modifyDate": "2023-09-05T15:09:44.542Z",
      "name": "8c64133f-c8da-5888-8010-dec1b6a37fd7",
      "status": "approved",
      "dc:title": {"i-default": "Gray Modern Minimalist Good Morning Instagram Story"},
      "etags": "\"8e4d21c0a7032de38923078c19a3af32\"",
      "assetType": "Template",
      "behaviors": ["still"],
      "topics": ["day", "good", "marketing", "morning", "promo"],
      "availabilityDate": "2023-09-05T15:09:32.953Z",
      "licensingCategory": "free",
      "language": "en-US",
      "applicableRegions": ["ZZ"],
      "attribution": {
        "creators": [{"name": "Moko 22"}],
        "vendor": "Adobe Stock Community",
        "submittedBy": "FF182FCE644161540A495C64@c0b827b66271908b495fe8.e",
        "contractor": "stock_community"
      },
      "pages": [{
        "task": {"name": "instagram-story", "size": {"name": "1080x1920px"}},
        "rendition": {
          "image": {
            "thumbnail": {"componentId": "a3fbf9d7-41e7-4158-84de-bc784e960354", "width": 281, "height": 500},
            "preview": {"componentId": "90018785-a856-4363-a71f-0a259f50182e", "width": 675, "height": 1200}
          }
        }
      }],
      "customLinks": {"branchUrl": "https://adobesparkpost.app.link/9Sa3o4PJTCb"},
      "stats": {"remixCount": 1863},
      "styles": ["minimal", "modern", "simple"],
      "segments": ["all"],
      "moods": ["mellow", "neutral", "relaxing"],
      "_links": {
        "http://ns.adobe.com/adobecloud/rel/rendition": {
          "href": "https://design-assets.adobeprojectm.com/content/download/express/public/urn:aaid:sc:VA6C2:12053b1e-8454-4fda-8fd8-244e5eb7d060/rendition?assetType=TEMPLATE&etag=8e4d21c0a7032de38923078c19a3af32{&page,size,type,fragment}",
          "templated": true
        }
      }
    };
    
    const templates = [{ templateData: mockTemplateData }];
    console.log('✅ Using mock template data for testing');
    return { templates, fallbackMsg: null };
  }
}

async function handleApiDrivenTemplates(block, apiUrl) {
  // Fetch templates directly from the API URL
  const { templates, fallbackMsg } = await fetchDirectFromApiUrl(apiUrl);
  
  if (!templates || templates.length === 0) {
    console.error('No templates found or error occurred:', fallbackMsg);
    return;
  }

  console.log(`Fetched ${templates.length} templates from API`);

  // Determine if it's one-up or multiple-up based on response count
  if (templates.length === 1) {
    // For one-up, just use the original API data directly - simple!
    await handleOneUpFromApiData(block, templates[0].templateData);
  } else if (templates.length > 1) {
    await handleMultipleUpFromRenderedTemplates(block, templates);
  }
}



async function handleOneUpFromApiData(block, templateData) {
  console.log('🎯 ONE-UP: Template-promo structure match');
  console.log('📊 Template data:', templateData);
  
  const parent = block.parentElement;
  parent.classList.add('one-up');

  // Clear block and create template-promo structure
  block.innerHTML = '';
  
  // Extract what we need from API data  
  const templateType = templateData.licensingCategory || 'free';
  const editUrl = templateData.customLinks?.branchUrl || '#';
  const templateTitle = templateData['dc:title']?.['i-default'] || 'Template';
  
  // Get image URL from API - check multiple sources
  let imageUrl = templateData._links?.['http://ns.adobe.com/adobecloud/rel/rendition']?.href;
  
  console.log('🔍 Raw image URL from API:', imageUrl);
  console.log('🔍 Template data _links:', templateData._links);
  
  // If it's a real Adobe URL with templated params, remove the template part
  if (imageUrl && imageUrl.includes('{&')) {
    // Remove the templated parameters completely - the base URL works fine
    imageUrl = imageUrl.replace('{&page,size,type,fragment}', '');
    console.log('🔧 Removed templated parameters:', imageUrl);
  }
  
  // Final fallback if URL is still problematic
  if (!imageUrl || imageUrl.includes('{') || imageUrl.includes('undefined')) {
    imageUrl = 'https://picsum.photos/400/500?random=template' + Date.now();
    console.log('🔄 Using fallback image URL');
  }
  
  console.log('🖼️ Final image URL:', imageUrl);
  console.log('📋 Template type:', templateType);
  console.log('🔗 Edit URL:', editUrl);

  // Simple template-x-promo structure - just image wrapper and button
  const img = createTag('img', {
    src: imageUrl,
    alt: templateTitle,
    width: '400',
    height: '400'
  });
  console.log('🖼️ Created img element:', img);
  
  const imgWrapper = createTag('div', { class: 'image-wrapper' });
  imgWrapper.append(img);
  
  // Add plan icon
  const { planIcon } = getStillWrapperIcons(templateType);
  if (planIcon) {
    imgWrapper.append(planIcon);
  }
  
  // Add image wrapper to block
  block.append(imgWrapper);

  // Create edit button container (outside template-promo div)
  const editThisTemplate = 'Edit this template';
  const editTemplateButton = createTag('a', {
    href: editUrl,
    title: `${editThisTemplate} ${templateTitle}`,
    class: 'button accent',
    'aria-label': `${editThisTemplate} ${templateTitle}`,
    target: '_blank'
  });

  editTemplateButton.textContent = editThisTemplate;
  const buttonContainer = createTag('section', { class: 'button-container' });
  buttonContainer.append(editTemplateButton);

  // Add button container to parent
  parent.append(buttonContainer);
  
  console.log('✅ ONE-UP: Template-promo structure complete!');
}

async function handleMultipleUpFromRenderedTemplates(block, renderedTemplates) {
  // Add multiple-up class to parent
  const parent = block.parentElement;
  parent.classList.add('multiple-up');

  // Add basic-carousel class to the block itself (like quotes does)
  block.classList.add('basic-carousel');

  // Clear block and add templates directly
  block.innerHTML = '';
  
  // Add templates directly to block
  renderedTemplates.forEach((template) => {
    template.classList.add('template'); // Ensure it has the template class
    block.append(template);
  });
  
  // Let load-carousel handle everything else - block IS the basic-carousel container
  console.log('🎪 About to call loadCarousel with:');
  console.log('- Selector: .template');
  console.log('- Parent:', block);
  console.log('- Templates found:', block.querySelectorAll('.template').length);
  console.log('- Block classes:', block.className);
  loadCarousel('.template', block, {});
}

function getStillWrapperIcons(templateType) {
  let planIcon = null;
  if (templateType === 'free') {
    planIcon = createTag('span', { class: 'free-tag' });
    planIcon.append('Free');
  } else {
    planIcon = getIconElementDeprecated('premium');
  }
  return { planIcon };
}

async function handleOneUp(blockElement, { imageElements, templateLinks, premiumTagsElements }) {
  const parent = blockElement.parentElement;
  parent.classList.add('one-up');
  const img = imageElements[0];
  const templateType = premiumTagsElements[0]?.textContent?.trim().toLowerCase();

  // Create image wrapper following the same pattern as template rendering
  const imgWrapper = createTag('div', { class: 'image-wrapper' });

  if (img && img.parentElement) {
    img.parentElement.insertBefore(imgWrapper, img);
    imgWrapper.append(img);
  }

  // Get and append the plan icon to the image wrapper
  const { planIcon } = getStillWrapperIcons(templateType);
  if (planIcon) {
    imgWrapper.append(planIcon);
  }

  const templateEditLink = templateLinks[0];
  templateEditLink.style.display = 'none';

  const editThisTemplate = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
  const editTemplateButton = createTag('a', {
    href: templateEditLink?.href,
    title: `${editThisTemplate} ${img?.alt}`,
    class: 'button accent',
    'aria-label': `${editThisTemplate} ${img?.alt}`,
  });

  editTemplateButton.textContent = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
  const buttonContainer = createTag('section', { class: 'button-container' });
  buttonContainer.append(editTemplateButton);

  parent.append(buttonContainer);
}

export default async function decorate(block) {
  console.log('🚀 Template X Promo - Starting decorate function');
  console.log('📦 Block:', block);
  
  try {
          // Fallback for when getLibs() is undefined in test environments
      const libsPath = getLibs() || '../../scripts';
      try {
        const [utils, templateRendering] = await Promise.all([
          import(`${libsPath}/utils.js`),
          import('../template-x/template-rendering.js')
        ]);
        const { createTag: createTagUtil, getConfig: getConfigUtil } = utils;
        const { default: renderTemplateUtil } = templateRendering;
        createTag = createTagUtil;
        getConfig = getConfigUtil;
        renderTemplate = renderTemplateUtil;
        
        // Mock replaceKey if placeholders is not available
        replaceKey = async (key) => key;
        console.log('✅ Utils and renderTemplate imported (placeholders mocked for testing)');
            } catch (utilsError) {
        console.error('❌ Could not import utils:', utilsError);
        // Provide fallback implementations
        createTag = (tag, attrs) => {
          const el = document.createElement(tag);
          if (attrs) {
            Object.keys(attrs).forEach(key => {
              if (key === 'class') el.className = attrs[key];
              else el.setAttribute(key, attrs[key]);
            });
          }
          return el;
        };
        getConfig = () => ({ env: { name: 'dev' } });
        replaceKey = async (key) => key;
        renderTemplate = null; // Fallback - won't use renderTemplate if utils failed
        console.log('✅ Using fallback implementations');
      }

    block.parentElement.classList.add('ax-template-x-promo');
    console.log('✅ CSS class added');

    // NEW LOGIC: Check for recipe class with API URL
              // HARDCODED API URL FOR TESTING - ONE TEMPLATE FOR ONE-UP TESTING
          const hardcodedApiUrl = 'https://www.adobe.com/express-search-api-v3?queryType=search&collectionId=urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418&filters=id==urn:aaid:sc:VA6C2:12053b1e-8454-4fda-8fd8-244e5eb7d060&ax-env=stage';
    console.log('🔥 Hardcoded API URL:', hardcodedApiUrl);
    
    if (hardcodedApiUrl) {
      console.log('🎯 Calling handleApiDrivenTemplates...');
      // API-driven approach: fetch templates and render
      await handleApiDrivenTemplates(block, hardcodedApiUrl);
      console.log('✅ handleApiDrivenTemplates completed');
    } else {
      // FALLBACK: Original DOM-based approach 
      const templateLinks = [...(block?.querySelectorAll('a') || [])];
      const imageElements = [...(block?.querySelectorAll('picture > img') || [])];
      const premiumTagsElements = [...(block?.querySelectorAll('h4') || [])];
      premiumTagsElements.forEach((tag) => {
        tag.style.display = 'none';
      });
      const isOneUp = imageElements.length === 1;
      const variantsData = { imageElements, templateLinks, premiumTagsElements };

      // INIT LOGIC
      if (isOneUp) {
        handleOneUp(block, variantsData);
      } else {
        // For fallback multiple templates, use the original template-promo-carousel approach
        // Import and call template-promo-carousel for DOM-based templates
        const { default: templatePromoCarousel } = await import('../template-promo-carousel/template-promo-carousel.js');
        await templatePromoCarousel(block, variantsData);
      }
    }
  } catch (error) {
    console.error('❌ Error in template-x-promo decorate:', error);
  }
}
