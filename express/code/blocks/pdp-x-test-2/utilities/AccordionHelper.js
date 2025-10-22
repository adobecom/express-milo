/**
 * Reusable accordion functionality for any block
 * Based on FAQ/FAQv2 patterns
 */

/**
 * Creates an accordion item with full a11y support
 * @param {Object} config - Configuration from getConfig()
 * @param {Function} createTag - createTag function from utils
 * @param {Object} options - Accordion options
 * @param {string} options.title - Accordion title
 * @param {string} options.content - Accordion content (HTML string)
 * @param {number} options.index - Item index
 * @param {string} options.containerClass - CSS class for container
 * @param {string} options.headerClass - CSS class for header
 * @param {string} options.contentClass - CSS class for content
 * @param {string} options.iconClass - CSS class for icon
 * @param {boolean} options.autoClose - Close other items when opening (default: true)
 * @param {HTMLElement} options.parentContainer - Parent container for auto-close
 * @returns {HTMLElement} Accordion item element
 */
export function createAccordionItem(config, createTag, options) {
  const {
    title,
    content,
    index,
    containerClass = 'accordion-item-container',
    headerClass = 'accordion-header',
    contentClass = 'accordion-content',
    iconClass = 'accordion-icon',
    autoClose = true,
    parentContainer = null,
  } = options;

  const itemContainer = createTag('div', { class: containerClass });
  
  // Header with icon
  const titleContainer = createTag('div', { 
    class: `${headerClass}-container`,
    role: 'button',
    tabindex: '0',
    'aria-expanded': 'false',
    'aria-controls': `accordion-content-${index}`,
  });
  
  const titleSpan = createTag('span', { class: headerClass }, title);
  titleContainer.appendChild(titleSpan);
  
  const icon = createTag('img', {
    class: iconClass,
    src: `${config.codeRoot}/icons/plus-heavy.svg`,
    alt: '',
    'aria-hidden': 'true',
  });
  titleContainer.appendChild(icon);
  
  itemContainer.appendChild(titleContainer);
  
  // Content
  const contentSpan = createTag('div', { 
    class: contentClass,
    id: `accordion-content-${index}`,
    'aria-hidden': 'true',
  });
  contentSpan.innerHTML = content;
  itemContainer.appendChild(contentSpan);
  
  // Toggle function
  const toggleAccordion = () => {
    const isOpen = itemContainer.classList.contains('expanded');
    
    // Auto-close other items if enabled
    if (autoClose && parentContainer) {
      const allItems = parentContainer.querySelectorAll(`.${containerClass}`);
      const allHeaders = parentContainer.querySelectorAll(`.${headerClass}-container`);
      const allContents = parentContainer.querySelectorAll(`.${contentClass}`);
      const allIcons = parentContainer.querySelectorAll(`.${iconClass}`);
      
      allItems.forEach((item, idx) => {
        if (item !== itemContainer && item.classList.contains('expanded')) {
          item.classList.remove('expanded');
          item.classList.add('collapsed');
          allHeaders[idx].setAttribute('aria-expanded', 'false');
          allContents[idx].setAttribute('aria-hidden', 'true');
          allIcons[idx].src = `${config.codeRoot}/icons/plus-heavy.svg`;
        }
      });
    }
    
    // Toggle current item
    if (!isOpen) {
      itemContainer.classList.remove('collapsed');
      itemContainer.classList.add('expanded');
      titleContainer.setAttribute('aria-expanded', 'true');
      contentSpan.setAttribute('aria-hidden', 'false');
      icon.src = `${config.codeRoot}/icons/minus-heavy.svg`;
    } else {
      itemContainer.classList.remove('expanded');
      itemContainer.classList.add('collapsed');
      titleContainer.setAttribute('aria-expanded', 'false');
      contentSpan.setAttribute('aria-hidden', 'true');
      icon.src = `${config.codeRoot}/icons/plus-heavy.svg`;
    }
  };
  
  // Click event
  titleContainer.addEventListener('click', toggleAccordion);
  
  // Keyboard support (Enter or Space)
  titleContainer.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleAccordion();
    }
  });
  
  // Set initial state as collapsed
  itemContainer.classList.add('collapsed');
  
  return itemContainer;
}

/**
 * Creates multiple accordion items at once
 * @param {Object} config - Configuration from getConfig()
 * @param {Function} createTag - createTag function from utils
 * @param {Array} items - Array of {title, content} objects
 * @param {Object} options - Accordion options (same as createAccordionItem)
 * @returns {Array<HTMLElement>} Array of accordion item elements
 */
export function createAccordionGroup(config, createTag, items, options = {}) {
  const parentContainer = options.parentContainer || document.createElement('div');
  
  return items.map((item, index) => createAccordionItem(config, createTag, {
    ...options,
    title: item.title,
    content: item.content || item.description,
    index,
    parentContainer,
  }));
}


