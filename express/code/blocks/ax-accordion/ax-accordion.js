import { getLibs, createTag } from '../../scripts/utils.js';
import { throttle } from '../../scripts/utils/hofs.js';

const ANIMATION_DURATION = 250;
const ANIMATION_BUFFER = 10;
const SCROLL_THRESHOLD = 100;
const SCROLL_THROTTLE = 100;

let loadStyle;
let getConfig;
let accordionInstanceCounter = 0;

const eventHandlers = new WeakMap();
const buttonCache = new WeakMap();

async function initUtils() {
  if (!loadStyle) {
    const utils = await import(`${getLibs()}/utils/utils.js`);
    ({ loadStyle, getConfig } = utils);
  }
}

function createAccordionItem(container, { title, content }, index) {
  const itemContainer = createTag('div', { class: 'ax-accordion-item-container' });

  const instanceId = accordionInstanceCounter;
  accordionInstanceCounter += 1;
  const buttonId = `ax-accordion-button-${instanceId}-${index}`;
  const panelId = `ax-accordion-panel-${instanceId}-${index}`;

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

  const itemDescription = createTag('div', {
    class: 'ax-accordion-item-description',
    id: panelId,
    role: 'region',
    'aria-labelledby': buttonId,
  });

  const contentWrapper = createTag('div');
  contentWrapper.innerHTML = content;
  itemDescription.appendChild(contentWrapper);

  itemContainer.appendChild(itemButton);
  itemContainer.appendChild(itemDescription);

  itemButton.addEventListener('click', () => {
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

    const isExpanded = itemButton.getAttribute('aria-expanded') === 'true';
    itemButton.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');

    if (!isExpanded) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          const rect = itemContainer.getBoundingClientRect();
          const needsScroll = rect.top < 0 || rect.bottom > window.innerHeight;

          if (needsScroll) {
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
  const existingItems = block.querySelectorAll('.ax-accordion-item-container');

  const existingTitles = Array.from(existingItems).map((item) => {
    const titleElement = item.querySelector('.ax-accordion-item-title');
    return titleElement?.textContent?.trim();
  });
  const newTitles = items.map((item) => item.title);
  const isSameStructure = existingTitles.length === newTitles.length
    && existingTitles.every((title, index) => title === newTitles[index]);

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
    existingItems.forEach((existingItem, index) => {
      const descriptionElement = existingItem.querySelector('.ax-accordion-item-description > *');
      if (descriptionElement && items[index]) {
        const newContent = items[index].content;
        const currentContent = descriptionElement.innerHTML;
        if (currentContent !== newContent) {
          descriptionElement.innerHTML = newContent;
        }
      }
    });
    return;
  }

  let expandedTitle = forceExpandTitle;
  if (!expandedTitle) {
    existingItems.forEach((item) => {
      const button = item.querySelector('.ax-accordion-item-title-container');
      if (button?.getAttribute('aria-expanded') === 'true') {
        const titleElement = item.querySelector('.ax-accordion-item-title');
        expandedTitle = titleElement?.textContent?.trim();
      }
    });
  }

  existingItems.forEach((item) => item.remove());
  buttonCache.delete(block);

  items.forEach((item, index) => {
    const accordionItem = createAccordionItem(block, item, index);
    block.appendChild(accordionItem);

    if (expandedTitle && item.title === expandedTitle) {
      const button = accordionItem.querySelector('.ax-accordion-item-title-container');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          button.setAttribute('aria-expanded', 'true');
        });
      });
    }
  });
}

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

function setupAutoCollapse(block) {
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let hasExpandedItem = false;
  let isBlockVisible = false;

  const checkExpandedState = () => {
    const expandedButtons = block.querySelectorAll('.ax-accordion-item-title-container[aria-expanded="true"]');
    hasExpandedItem = expandedButtons.length > 0;
  };

  const clickHandler = () => {
    checkExpandedState();
  };

  const scrollHandler = throttle(() => {
    if (!hasExpandedItem || !isBlockVisible) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isScrollingUp = scrollTop < lastScrollTop;

    if (isScrollingUp) {
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

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isBlockVisible = entry.isIntersecting;
        if (!isBlockVisible) {
          hasExpandedItem = false;
        }
      });
    },
    { threshold: 0.1 },
  );

  observer.observe(block);

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

  eventHandlers.set(block, { clickHandler, scrollHandler, observer });

  block.addEventListener('click', clickHandler);
  window.addEventListener('scroll', scrollHandler, { passive: true });
}

export default async function decorate(block) {
  await initUtils();

  const config = getConfig();
  await new Promise((resolve) => {
    loadStyle(`${config.codeRoot}/blocks/ax-accordion/ax-accordion.css`, resolve);
  });

  let items;

  if (block.accordionData && Array.isArray(block.accordionData)) {
    items = block.accordionData;
  } else {
    items = extractItemsFromBlock(block);
  }

  buildAccordion(block, items);
  setupAutoCollapse(block);

  block.updateAccordion = (newItems, forceExpandTitle = null) => {
    buildAccordion(block, newItems, forceExpandTitle);
  };

  block.destroyAccordion = () => {
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
    buttonCache.delete(block);
    block.innerHTML = '';
    delete block.updateAccordion;
    delete block.destroyAccordion;
    delete block.accordionData;
  };
}
