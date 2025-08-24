import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';
import templatePromoCarousel from '../template-promo-carousel/template-promo-carousel.js';

let createTag;
let getConfig;
let replaceKey;

function getStillWrapperIcons(templateType) {
  let planIcon = null;
  if (templateType === 'free') {
    planIcon = createTag('span', { 
      class: 'free-tag',
      'aria-label': 'Free template',
      role: 'status',
      'aria-live': 'polite'
    });
    planIcon.append('Free');
  } else {
    planIcon = getIconElementDeprecated('premium');
    if (planIcon) {
      planIcon.setAttribute('aria-label', 'Premium template');
      planIcon.setAttribute('role', 'status');
      planIcon.setAttribute('aria-live', 'polite');
    }
  }
  return { planIcon };
}

function createSkipLink(templateCount, currentIndex) {
  const skipLink = createTag('a', {
    href: `#template-${currentIndex + 1}`,
    class: 'skip-link',
    'aria-label': `Skip to template ${currentIndex + 1} of ${templateCount}`,
    tabindex: '0'
  });
  skipLink.textContent = `Skip to template ${currentIndex + 1}`;
  return skipLink;
}

function enhanceImageAccessibility(img, templateType, templateName) {
  if (!img.alt || img.alt.trim() === '') {
    img.alt = `${templateType} template: ${templateName}`;
  }
  
  img.setAttribute('role', 'img');
  img.setAttribute('aria-label', img.alt);
  
  img.setAttribute('aria-busy', 'true');
  img.addEventListener('load', () => {
    img.setAttribute('aria-busy', 'false');
  });
  
  img.addEventListener('error', () => {
    img.setAttribute('aria-busy', 'false');
    img.setAttribute('aria-label', `${img.alt} (image failed to load)`);
  });
}

function createFocusableContainer(element, templateIndex) {
  // Make the container focusable for keyboard navigation
  element.setAttribute('tabindex', '0');
  element.setAttribute('role', 'article');
  element.setAttribute('aria-labelledby', `template-title-${templateIndex}`);
  element.setAttribute('id', `template-${templateIndex + 1}`);
  
  // Add keyboard event listeners for better navigation
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const link = element.querySelector('a[href]');
      if (link) {
        link.click();
      }
    }
  });
  
  return element;
}

async function handleOneUp(blockElement, { imageElements, templateLinks, premiumTagsElements }) {
  const parent = blockElement.parentElement;
  parent.classList.add('one-up');
  
  // Add main landmark role
  parent.setAttribute('role', 'main');
  parent.setAttribute('aria-label', 'Template showcase');
  
  const img = imageElements[0];
  const templateType = premiumTagsElements[0]?.textContent?.trim().toLowerCase();
  const templateName = img?.alt || 'Template';

  // Create image wrapper following the same pattern as template rendering
  const imgWrapper = createTag('div', { 
    class: 'image-wrapper',
    role: 'img',
    'aria-label': `${templateName} preview`
  });

  if (img && img.parentElement) {
    img.parentElement.insertBefore(imgWrapper, img);
    imgWrapper.append(img);
    
    enhanceImageAccessibility(img, templateType, templateName);
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
    'aria-describedby': `template-description-${templateType}`,
    role: 'button'
  });

  editTemplateButton.textContent = editThisTemplate;
  
  // Add focus management
  editTemplateButton.addEventListener('focus', () => {
    editTemplateButton.setAttribute('aria-pressed', 'false');
  });
  
  editTemplateButton.addEventListener('click', () => {
    editTemplateButton.setAttribute('aria-pressed', 'true');
    // Reset after a short delay
    setTimeout(() => {
      editTemplateButton.setAttribute('aria-pressed', 'false');
    }, 100);
  });

  const buttonContainer = createTag('section', { 
    class: 'button-container',
    role: 'group',
    'aria-label': 'Template actions'
  });
  buttonContainer.append(editTemplateButton);

  // Create template description for screen readers
  const templateDescription = createTag('div', {
    id: `template-description-${templateType}`,
    class: 'sr-only',
    'aria-live': 'polite'
  });
  templateDescription.textContent = `This is a ${templateType} template. Click the button above to start editing.`;
  
  parent.append(buttonContainer);
  parent.append(templateDescription);
  
  // Add skip link for keyboard users
  const skipLink = createSkipLink(1, 0);
  parent.insertBefore(skipLink, parent.firstChild);
}

export default async function decorate(block) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]).then(([utils, placeholders]) => {
    const { createTag: createTagUtil, getConfig: getConfigUtil } = utils;
    const { replaceKey: replaceKeyUtil } = placeholders;
    createTag = createTagUtil;
    getConfig = getConfigUtil;
    replaceKey = replaceKeyUtil;
  });

  block.parentElement.classList.add('ax-template-promo');

  const templateLinks = [...(block?.querySelectorAll('a') || [])];
  const imageElements = [...(block?.querySelectorAll('picture > img') || [])];
  const premiumTagsElements = [...(block?.querySelectorAll('h4') || [])];
  
  // Enhance premium tags with better accessibility
  premiumTagsElements.forEach((tag, index) => {
    tag.style.display = 'none';
    tag.id = `template-title-${index}`;
    tag.setAttribute('aria-hidden', 'true');
  });
  
  const isOneUp = imageElements.length === 1;
  const variantsData = { imageElements, templateLinks, premiumTagsElements };

  // Add live region for dynamic content
  const liveRegion = createTag('div', {
    'aria-live': 'polite',
    'aria-atomic': 'true',
    class: 'sr-only',
    id: 'template-promo-live-region'
  });
  block.appendChild(liveRegion);

  // Enhance each template container
  imageElements.forEach((img, index) => {
    const container = img.closest('.template-promo') || img.parentElement;
    if (container) {
      createFocusableContainer(container, index);
    }
  });

  // INIT LOGIC
  if (isOneUp) {
    handleOneUp(block, variantsData);
    // Announce single template mode
    liveRegion.textContent = 'Single template view loaded. Use Tab to navigate to the edit button.';
  } else {
    // Enhance multi-template accessibility
    block.setAttribute('role', 'region');
    block.setAttribute('aria-label', `Template gallery with ${imageElements.length} templates`);
    
    // Add navigation instructions for screen readers
    const navInstructions = createTag('div', {
      class: 'sr-only',
      'aria-live': 'polite'
    });
    navInstructions.textContent = `Template gallery with ${imageElements.length} templates. Use arrow keys or Tab to navigate between templates.`;
    block.insertBefore(navInstructions, block.firstChild);
    
    // Create skip links for multiple templates
    imageElements.forEach((_, index) => {
      const skipLink = createSkipLink(imageElements.length, index);
      block.appendChild(skipLink);
    });
    
    templatePromoCarousel(block, variantsData);
    
    // Announce carousel mode
    liveRegion.textContent = `Template carousel loaded with ${imageElements.length} templates. Use Tab to navigate between templates and Enter or Space to select.`;
  }
  
  // Add keyboard navigation support for the entire block
  block.addEventListener('keydown', (e) => {
    const focusableElements = block.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
    
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex]?.focus();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
        focusableElements[prevIndex]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        focusableElements[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        focusableElements[focusableElements.length - 1]?.focus();
        break;
    }
  });
}
