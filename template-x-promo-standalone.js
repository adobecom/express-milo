// Standalone version for testing - hardcoded paths
console.log('🚀 Standalone template-x-promo starting...');

let createTag;
let getConfig;
let replaceKey;

// Mock implementations for testing
createTag = (tag, attributes, options) => {
  const element = document.createElement(tag);
  if (attributes) {
    Object.keys(attributes).forEach(key => {
      if (key === 'class') {
        element.className = attributes[key];
      } else {
        element.setAttribute(key, attributes[key]);
      }
    });
  }
  return element;
};

getConfig = () => ({ env: { name: 'dev' } });
replaceKey = async (key) => key;

// Simple loadCarousel mock
const loadCarousel = (selector, parent, options) => {
  console.log('🎪 loadCarousel called:', selector, parent, options);
  parent.style.border = '3px solid red';
  parent.style.padding = '10px';
  const note = createTag('div', { class: 'carousel-note' });
  note.textContent = '🎪 CAROUSEL WOULD BE HERE';
  parent.appendChild(note);
};

async function handleMultipleUpFromRenderedTemplates(block, renderedTemplates) {
  console.log('🎪 handleMultipleUpFromRenderedTemplates called with', renderedTemplates.length, 'templates');
  
  // Add multiple-up and basic-carousel classes
  const parent = block.parentElement;
  parent.classList.add('multiple-up');
  block.classList.add('basic-carousel');

  // Clear block and add templates
  block.innerHTML = '';
  
  // Add each template as template element
  renderedTemplates.forEach((template, index) => {
    const templateDiv = createTag('div', { class: 'template' });
    templateDiv.innerHTML = `<h3>Template ${index + 1}</h3><p>This would be a real template</p>`;
    templateDiv.style.border = '1px solid blue';
    templateDiv.style.margin = '10px';
    templateDiv.style.padding = '10px';
    block.append(templateDiv);
  });

  // Let load-carousel create the structure and handle everything
  loadCarousel('.template', block, {});
}

async function handleApiDrivenTemplates(block, apiUrl) {
  console.log('📡 handleApiDrivenTemplates called with:', apiUrl);
  
  try {
    console.log('🔥 Making API call...');
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ API Response received:', data);
    
    if (!data || !data.items || !Array.isArray(data.items)) {
      console.error('Invalid API response format:', data);
      return;
    }

    // Create mock templates for testing
    const mockTemplates = data.items.map((item, index) => {
      const template = createTag('div', { class: 'mock-template' });
      template.innerHTML = `<h3>${item['dc:title']?.['i-default'] || 'Template'}</h3>`;
      return template;
    });

    console.log(`✅ Created ${mockTemplates.length} mock templates`);

    if (mockTemplates.length === 1) {
      console.log('👤 Single template - one-up layout');
      block.innerHTML = '<h2>ONE-UP LAYOUT</h2>';
      block.append(mockTemplates[0]);
    } else if (mockTemplates.length > 1) {
      console.log('🎪 Multiple templates - carousel layout');
      await handleMultipleUpFromRenderedTemplates(block, mockTemplates);
    }

  } catch (error) {
    console.error('❌ Error in handleApiDrivenTemplates:', error);
  }
}

export default async function decorate(block) {
  console.log('🚀 Standalone Template X Promo - Starting decorate function');
  console.log('📦 Block:', block);
  
  try {
    block.parentElement.classList.add('ax-template-x-promo');
    console.log('✅ CSS class added');

    // HARDCODED API URL FOR TESTING
    const hardcodedApiUrl = 'https://www.adobe.com/express-search-api-v3?queryType=search&collectionId=urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418&filters=id==urn:aaid:sc:VA6C2:12053b1e-8454-4fda-8fd8-244e5eb7d060,urn:aaid:sc:VA6C2:e2797332-b3ba-40cf-8ea1-23d3a1c87791,urn:aaid:sc:VA6C2:3c674431-f00a-5500-962b-75b847af95d5&ax-env=stage';
    console.log('🔥 Hardcoded API URL:', hardcodedApiUrl);
    
    if (hardcodedApiUrl) {
      console.log('🎯 Calling handleApiDrivenTemplates...');
      await handleApiDrivenTemplates(block, hardcodedApiUrl);
      console.log('✅ handleApiDrivenTemplates completed');
    }
  } catch (error) {
    console.error('❌ Error in template-x-promo decorate:', error);
  }
}
