import { createTag } from '../../scripts/utils.js';

/**
 * AX Accordion Block
 * Clean, accessible accordion component
 * Primary use: Programmatic data injection for PDP
 * Optional: Can be authored if needed
 */

function createAccordionItem(container, { title, content }) {
  const itemContainer = createTag('div', { class: 'ax-accordion-item-container collapsed' });
  const itemTitleContainer = createTag('span', { class: 'ax-accordion-item-title-container' });
  const itemTitle = createTag('span', { class: 'ax-accordion-item-title' }, title);
  const itemIcon = createTag('div', { class: 'ax-accordion-item-icon' });
  const itemDescription = createTag('span', { class: 'ax-accordion-item-description' });

  // Set content as HTML
  itemDescription.innerHTML = content;

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
      }, 260); // Wait for animation to complete (250ms + 10ms buffer)
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

function buildAccordion(block, items) {
  // Clear existing accordion items (but keep title if it exists)
  const existingItems = block.querySelectorAll('.ax-accordion-item-container');
  existingItems.forEach((item) => item.remove());

  // Add items
  items.forEach((item, index) => {
    const accordionItem = createAccordionItem(block, item, index);
    block.appendChild(accordionItem);
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
 * Main decorate function
 */
export default async function decorate(block) {
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

  // Add update method for programmatic use
  block.updateAccordion = (newItems) => {
    buildAccordion(block, newItems);
  };
}
