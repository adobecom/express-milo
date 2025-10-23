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

function createAccordionItem(container, { title, content }) {
  const itemContainer = createTag('div', { class: 'ax-accordion-item-container collapsed' });
  const itemTitleContainer = createTag('span', { class: 'ax-accordion-item-title-container' });
  const itemTitle = createTag('span', { class: 'ax-accordion-item-title' }, title);
  const itemIcon = createTag('div', { class: 'ax-accordion-item-icon' });
  const itemDescription = createTag('span', { class: 'ax-accordion-item-description' });

  // Wrap content in a div for CSS Grid animation
  const contentWrapper = createTag('div');
  contentWrapper.innerHTML = content;
  itemDescription.appendChild(contentWrapper);

  itemTitleContainer.appendChild(itemTitle);
  itemTitleContainer.appendChild(itemIcon);
  itemContainer.appendChild(itemTitleContainer);
  itemContainer.appendChild(itemDescription);

  // Toggle on click
  itemContainer.addEventListener('click', () => {
    // Close all others first
    const allItems = container.querySelectorAll('.ax-accordion-item-container');
    allItems.forEach((item) => {
      if (item !== itemContainer && item.classList.contains('expanded')) {
        item.classList.remove('expanded');
        item.classList.add('collapsed');
        item.setAttribute('aria-expanded', 'false');
      }
    });

    // Toggle current
    const isExpanded = itemContainer.classList.contains('expanded');
    if (isExpanded) {
      itemContainer.classList.remove('expanded');
      itemContainer.classList.add('collapsed');
      itemContainer.setAttribute('aria-expanded', 'false');
    } else {
      itemContainer.classList.remove('collapsed');
      itemContainer.classList.add('expanded');
      itemContainer.setAttribute('aria-expanded', 'true');

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

  // Keyboard support
  itemContainer.setAttribute('tabindex', '0');
  itemContainer.setAttribute('role', 'button');
  itemContainer.setAttribute('aria-expanded', 'false');

  itemContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      itemContainer.click();
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
    .find((item) => item.getAttribute('aria-expanded') === 'true')
    ?.querySelector('.ax-accordion-item-title')?.textContent?.trim();

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
      if (item.getAttribute('aria-expanded') === 'true') {
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
      // Use double rAF to ensure CSS Grid has computed the collapsed state first
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          accordionItem.classList.remove('collapsed');
          accordionItem.classList.add('expanded');
          accordionItem.setAttribute('aria-expanded', 'true');
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
    hasExpandedItem = block.querySelectorAll('.ax-accordion-item-container.expanded').length > 0;
  };

  block.addEventListener('click', checkExpandedState);

  // Collapse all when scrolling back up past the block
  window.addEventListener('scroll', () => {
    if (!hasExpandedItem) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const blockRect = block.getBoundingClientRect();
    const isScrollingUp = scrollTop < lastScrollTop;

    // User scrolled up past the top of the accordion block
    if (isScrollingUp && blockRect.top > 100) {
      const allItems = block.querySelectorAll('.ax-accordion-item-container.expanded');
      if (allItems.length > 0) {
        allItems.forEach((item) => {
          item.classList.remove('expanded');
          item.classList.add('collapsed');
          item.setAttribute('aria-expanded', 'false');
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
