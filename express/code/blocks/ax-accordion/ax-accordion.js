import { getLibs, createTag } from '../../scripts/utils.js';

/**
 * AX Accordion Block
 * Clean, accessible accordion component with WAI-ARIA support
 * Primary use: Programmatic data injection for PDP
 * Optional: Can be authored if needed
 *
 * @example Programmatic Usage:
 * const accordion = document.querySelector('.ax-accordion');
 * accordion.accordionData = [
 *   { title: 'Section 1', content: '<p>Content here</p>' },
 *   { title: 'Section 2', content: '<p>More content</p>' }
 * ];
 * await axAccordionDecorate(accordion);
 *
 * @example Update accordion:
 * accordion.updateAccordion(newData, 'Section 1'); // Force expand Section 1
 */

// Animation constants - keep in sync with CSS
const ANIMATION_DURATION = 250; // ms - matches CSS grid-template-rows transition
const ANIMATION_BUFFER = 10; // ms - buffer for animation completion
const SCROLL_THRESHOLD = 100; // px - distance from top to trigger auto-collapse
const SCROLL_THROTTLE = 100; // ms - throttle scroll events for performance

let loadStyle;
let getConfig;
let accordionInstanceCounter = 0; // Unique ID generator

// WeakMap to store event handlers for cleanup (avoids underscore-dangle lint issues)
const eventHandlers = new WeakMap();

// WeakMap to cache button references per accordion
const buttonCache = new WeakMap();

/**
 * Throttle function to limit execution rate
 * @param {Function} func - Function to throttle
 * @param {number} wait - Minimum time between executions (ms)
 * @returns {Function} Throttled function
 */
function throttle(func, wait) {
  let timeout = null;
  let previous = 0;

  return function throttled(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

// Initialize milo utils
async function initUtils() {
  if (!loadStyle) {
    const utils = await import(`${getLibs()}/utils/utils.js`);
    ({ loadStyle, getConfig } = utils);
  }
}

function createAccordionItem(container, { title, content }, index) {
  const itemContainer = createTag('div', { class: 'ax-accordion-item-container' });

  // Generate unique IDs for ARIA relationship using instance counter
  const instanceId = accordionInstanceCounter;
  accordionInstanceCounter += 1;
  const buttonId = `ax-accordion-button-${instanceId}-${index}`;
  const panelId = `ax-accordion-panel-${instanceId}-${index}`;

  // Header button (proper semantic HTML)
  const itemButton = createTag('button', {
    class: 'ax-accordion-item-title-container',
    'aria-expanded': 'false',
    'aria-controls': panelId,
    id: buttonId,
  });

  const itemTitle = createTag('span', { class: 'ax-accordion-item-title' }, title);
  const itemIcon = createTag('div', { class: 'ax-accordion-item-icon' });

  itemButton.appendChild(itemTitle);
  itemButton.appendChild(itemIcon);

  // Content panel (sibling of button, not child)
  const itemDescription = createTag('div', {
    class: 'ax-accordion-item-description',
    id: panelId,
    role: 'region',
    'aria-labelledby': buttonId,
  });

  // Wrap content in a div for CSS Grid animation
  const contentWrapper = createTag('div');
  contentWrapper.innerHTML = content;
  itemDescription.appendChild(contentWrapper);

  itemContainer.appendChild(itemButton);
  itemContainer.appendChild(itemDescription);

  // Toggle on button click
  itemButton.addEventListener('click', () => {
    // Close all others first (single-expand pattern)
    // Use cached button references for better performance
    let cachedButtons = buttonCache.get(container);
    if (!cachedButtons || cachedButtons.length === 0) {
      cachedButtons = Array.from(container.querySelectorAll('.ax-accordion-item-title-container'));
      buttonCache.set(container, cachedButtons);
    }

    cachedButtons.forEach((btn) => {
      if (btn !== itemButton && btn.getAttribute('aria-expanded') === 'true') {
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Toggle current
    const isExpanded = itemButton.getAttribute('aria-expanded') === 'true';
    itemButton.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');

    if (!isExpanded) {
      // Smooth scroll into view after content expands
      // Use requestAnimationFrame for better performance
      setTimeout(() => {
        requestAnimationFrame(() => {
          const rect = itemContainer.getBoundingClientRect();
          // Scroll if: top is above viewport OR bottom extends below viewport
          const needsScroll = rect.top < 0 || rect.bottom > window.innerHeight;

          if (needsScroll) {
            // Scroll the top of the accordion into view
            itemContainer.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest',
            });
          }
        });
      }, ANIMATION_DURATION + ANIMATION_BUFFER);
    }
  });

  return itemContainer;
}

function buildAccordion(block, items, forceExpandTitle = null) {
  // Get existing items
  const existingItems = block.querySelectorAll('.ax-accordion-item-container');

  // Check if we can just update content (same number of items, same titles)
  const existingTitles = Array.from(existingItems).map((item) => {
    const titleElement = item.querySelector('.ax-accordion-item-title');
    return titleElement?.textContent?.trim();
  });
  const newTitles = items.map((item) => item.title);
  const isSameStructure = existingTitles.length === newTitles.length
    && existingTitles.every((title, index) => title === newTitles[index]);

  // Check if forceExpandTitle is already expanded
  const currentlyExpandedTitle = Array.from(existingItems)
    .map((item) => {
      const button = item.querySelector('.ax-accordion-item-title-container');
      const titleElement = item.querySelector('.ax-accordion-item-title');
      return button?.getAttribute('aria-expanded') === 'true'
        ? titleElement?.textContent?.trim()
        : null;
    })
    .find((title) => title !== null);

  const isForceExpandAlreadyExpanded = forceExpandTitle
    && forceExpandTitle === currentlyExpandedTitle;

  if (isSameStructure && (!forceExpandTitle || isForceExpandAlreadyExpanded)) {
    // Just update content that changed - preserves all states
    existingItems.forEach((existingItem, index) => {
      const descriptionElement = existingItem.querySelector('.ax-accordion-item-description > *');
      if (descriptionElement && items[index]) {
        const newContent = items[index].content;
        const currentContent = descriptionElement.innerHTML;
        // Only update if content actually changed
        if (currentContent !== newContent) {
          descriptionElement.innerHTML = newContent;
        }
      }
    });
    return; // Skip rebuild
  }

  // Need to rebuild - remember which item was expanded
  let expandedTitle = forceExpandTitle; // Force expand takes priority
  if (!expandedTitle) {
    existingItems.forEach((item) => {
      const button = item.querySelector('.ax-accordion-item-title-container');
      if (button?.getAttribute('aria-expanded') === 'true') {
        const titleElement = item.querySelector('.ax-accordion-item-title');
        expandedTitle = titleElement?.textContent?.trim();
      }
    });
  }

  // Clear existing accordion items
  existingItems.forEach((item) => item.remove());

  // Clear button cache when rebuilding
  buttonCache.delete(block);

  // Add items and restore expanded state if title matches
  items.forEach((item, index) => {
    const accordionItem = createAccordionItem(block, item, index);
    block.appendChild(accordionItem);

    // Restore expanded state AFTER adding to DOM so CSS can properly apply
    if (expandedTitle && item.title === expandedTitle) {
      const button = accordionItem.querySelector('.ax-accordion-item-title-container');
      // Use double rAF to ensure CSS Grid has computed the collapsed state first
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          button.setAttribute('aria-expanded', 'true');
        });
      });
    }
  });
}

/**
 * Extract items from authored content
 * Expected structure: 2-column table (title | content)
 */
function extractItemsFromBlock(block) {
  const items = [];
  const rows = Array.from(block.children);

  rows.forEach((row) => {
    const cells = Array.from(row.children);
    if (cells.length >= 2) {
      items.push({
        title: cells[0].textContent.trim(),
        content: cells[1].innerHTML,
      });
    }
  });

  return items;
}

/**
 * Auto-collapse all accordions when user scrolls back up past the block
 * Optimized with Intersection Observer and throttled scroll events
 * @param {HTMLElement} block - The accordion block element
 */
function setupAutoCollapse(block) {
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let hasExpandedItem = false;
  let isBlockVisible = false;

  // Track if any item is expanded (direct flag update, no setTimeout)
  const checkExpandedState = () => {
    const expandedButtons = block.querySelectorAll('.ax-accordion-item-title-container[aria-expanded="true"]');
    hasExpandedItem = expandedButtons.length > 0;
  };

  // Click handler to track expanded state
  const clickHandler = () => {
    checkExpandedState();
  };

  // Throttled scroll handler for auto-collapse (reduces from 60fps to ~10fps)
  const scrollHandler = throttle(() => {
    // Skip if no expanded items or block not visible
    if (!hasExpandedItem || !isBlockVisible) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isScrollingUp = scrollTop < lastScrollTop;

    // User scrolled up past the top of the accordion block
    if (isScrollingUp) {
      // Only query DOM once to check position
      const blockRect = block.getBoundingClientRect();
      if (blockRect.top > SCROLL_THRESHOLD) {
        const expandedButtons = block.querySelectorAll('.ax-accordion-item-title-container[aria-expanded="true"]');
        if (expandedButtons.length > 0) {
          expandedButtons.forEach((button) => {
            button.setAttribute('aria-expanded', 'false');
          });
          hasExpandedItem = false;
        }
      }
    }

    lastScrollTop = scrollTop;
  }, SCROLL_THROTTLE);

  // Use Intersection Observer to track visibility (performance optimization)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isBlockVisible = entry.isIntersecting;
        // If block scrolls out of view, disable scroll handler
        if (!isBlockVisible) {
          hasExpandedItem = false;
        }
      });
    },
    { threshold: 0.1 }, // Trigger when 10% visible
  );

  observer.observe(block);

  // Clean up previous listeners if they exist
  const existingHandlers = eventHandlers.get(block);
  if (existingHandlers) {
    if (existingHandlers.clickHandler) {
      block.removeEventListener('click', existingHandlers.clickHandler);
    }
    if (existingHandlers.scrollHandler) {
      window.removeEventListener('scroll', existingHandlers.scrollHandler);
    }
    if (existingHandlers.observer) {
      existingHandlers.observer.disconnect();
    }
  }

  // Store handlers in WeakMap for cleanup
  eventHandlers.set(block, { clickHandler, scrollHandler, observer });

  // Attach new listeners with passive flag for better scroll performance
  block.addEventListener('click', clickHandler);
  window.addEventListener('scroll', scrollHandler, { passive: true });
}

/**
 * Main decorate function
 */
export default async function decorate(block) {
  // Initialize utils
  await initUtils();

  // Load CSS
  const config = getConfig();
  await new Promise((resolve) => {
    loadStyle(`${config.codeRoot}/blocks/ax-accordion/ax-accordion.css`, resolve);
  });

  let items;

  // Check for programmatic data (primary use case)
  if (block.accordionData && Array.isArray(block.accordionData)) {
    items = block.accordionData;
  } else {
    // Extract from authored content (optional use case)
    items = extractItemsFromBlock(block);
  }

  // Build accordion
  buildAccordion(block, items);

  // Setup auto-collapse on scroll to top
  setupAutoCollapse(block);

  // Add update method for programmatic use
  block.updateAccordion = (newItems, forceExpandTitle = null) => {
    buildAccordion(block, newItems, forceExpandTitle);
  };

  // Add destroy method for cleanup
  block.destroyAccordion = () => {
    // Remove event listeners
    const handlers = eventHandlers.get(block);
    if (handlers) {
      if (handlers.clickHandler) {
        block.removeEventListener('click', handlers.clickHandler);
      }
      if (handlers.scrollHandler) {
        window.removeEventListener('scroll', handlers.scrollHandler);
      }
      if (handlers.observer) {
        handlers.observer.disconnect();
      }
      eventHandlers.delete(block);
    }
    // Clear caches
    buttonCache.delete(block);
    // Clear content
    block.innerHTML = '';
    // Remove methods
    delete block.updateAccordion;
    delete block.destroyAccordion;
    delete block.accordionData;
  };
}
