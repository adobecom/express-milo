import { getLibs, createTag } from '../../scripts/utils.js';

/**
 * AX Accordion Block
 * Clean, accessible accordion component
 * Primary use: Programmatic data injection for PDP
 * Optional: Can be authored if needed
 */

let loadStyle;
let getConfig;

// Initialize milo utils
async function initUtils() {
  if (!loadStyle) {
    const utils = await import(`${getLibs()}/utils/utils.js`);
    ({ loadStyle, getConfig } = utils);
  }
}

function createAccordionItem(container, { title, content }, index) {
  const itemContainer = createTag('div', { class: 'ax-accordion-item-container' });

  // Generate unique IDs for ARIA relationship
  const buttonId = `ax-accordion-button-${Date.now()}-${index}`;
  const panelId = `ax-accordion-panel-${Date.now()}-${index}`;

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
    const allButtons = container.querySelectorAll('.ax-accordion-item-title-container');
    allButtons.forEach((btn) => {
      if (btn !== itemButton && btn.getAttribute('aria-expanded') === 'true') {
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Toggle current
    const isExpanded = itemButton.getAttribute('aria-expanded') === 'true';
    itemButton.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');

    if (!isExpanded) {
      // Smooth scroll into view after content expands
      setTimeout(() => {
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
      }, 260); // Wait for expand animation (250ms + 10ms buffer)
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
 */
function setupAutoCollapse(block) {
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let hasExpandedItem = false;

  // Track if any item is expanded
  const checkExpandedState = () => {
    const expandedButtons = block.querySelectorAll('.ax-accordion-item-title-container[aria-expanded="true"]');
    hasExpandedItem = expandedButtons.length > 0;
  };

  // Use setTimeout to run after click handler completes
  block.addEventListener('click', () => {
    setTimeout(checkExpandedState, 0);
  });

  // Collapse all when scrolling back up past the block
  window.addEventListener('scroll', () => {
    if (!hasExpandedItem) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const blockRect = block.getBoundingClientRect();
    const isScrollingUp = scrollTop < lastScrollTop;

    // User scrolled up past the top of the accordion block
    if (isScrollingUp && blockRect.top > 100) {
      const expandedButtons = block.querySelectorAll('.ax-accordion-item-title-container[aria-expanded="true"]');
      if (expandedButtons.length > 0) {
        expandedButtons.forEach((button) => {
          button.setAttribute('aria-expanded', 'false');
        });
        hasExpandedItem = false;
      }
    }

    lastScrollTop = scrollTop;
  });
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
}
