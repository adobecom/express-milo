import { getLibs, addTempWrapperDeprecated, decorateButtonsDeprecated, getIconElementDeprecated } from '../../scripts/utils.js';
import {
  fetchPlanOnePlans,
  formatDynamicCartLink,
} from '../../scripts/utils/pricing.js';
import { debounce } from '../../scripts/utils/hofs.js';
import handleImageTooltip, { adjustImageTooltipPosition } from '../../scripts/widgets/image-tooltip.js';
import handleTooltip, { adjustElementPosition } from '../../scripts/widgets/tooltip.js';

// Module-level variables initialized during init
let createTag = null;
let getConfig = null;
let replaceKeyArray = null;
let formatSalesPhoneNumber = null;

// Token constants
const SALES_NUMBERS = '((business-sales-numbers))';
const PRICE_TOKEN = '((pricing))';
const YEAR_2_PRICING_TOKEN = '((year-2-pricing-token))';

// UI constants
const DESKTOP_BREAKPOINT = 1200;
const LONG_PRICE_LENGTH = 6;
const RESIZE_DEBOUNCE_MS = 100;

// Lightweight helpers to improve structure and error handling
async function safeFetchPricing(url) {
  try {
    const data = await fetchPlanOnePlans(url);
    if (!data) return { ok: false, message: 'Empty response from pricing API' };
    return { ok: true, data };
  } catch (e) {
    return { ok: false, message: e.message || 'Pricing fetch error' };
  }
}

function renderPricingFallback(
  pricingArea,
  priceRow,
  priceEl,
  pricingSuffixTextElem,
  options = {},
) {
  const { priceText = 'Price unavailable', suffixText = 'Please try again later' } = options;
  const price = createTag('span', { class: 'pricing-price' });
  const priceSuffix = createTag('div', { class: 'pricing-row-suf' });
  price.textContent = priceText;
  priceSuffix.textContent = suffixText;
  priceRow.append(price, priceSuffix);
  pricingArea.prepend(priceRow);
  priceEl?.parentNode?.remove();
  pricingSuffixTextElem?.remove();
}

function cleanupEmptyParagraphs(root) {
  try {
    root.querySelectorAll('p').forEach((p) => {
      if (p.textContent.trim() === '' && p.children.length === 0) p.remove();
    });
  } catch (e) {
    window.lana?.log('Error during paragraph cleanup:', e);
  }
}

function getHeightWithoutPadding(element) {
  const styles = window.getComputedStyle(element);
  const paddingTop = parseFloat(styles.paddingTop);
  const paddingBottom = parseFloat(styles.paddingBottom);
  return element.clientHeight - paddingTop - paddingBottom;
}

function equalizeHeights(el) {
  const classNames = ['.card-header', '.plan-text', '.plan-explanation', '.pricing-area'];
  const cardCount = el.querySelectorAll('.simplified-pricing-cards-v2 .card').length;
  if (cardCount === 1) return;
  for (const className of classNames) {
    const headers = el.querySelectorAll(className);
    let maxHeight = 0;
    headers.forEach((placeholder) => {
      placeholder.style.height = 'unset';
    });
    if (window.screen.width > DESKTOP_BREAKPOINT) {
      headers.forEach((header) => {
        if (header.checkVisibility()) {
          const height = getHeightWithoutPadding(header);
          maxHeight = Math.max(maxHeight, height);
        }
      });
      headers.forEach((placeholder) => {
        if (maxHeight > 0) {
          placeholder.style.height = `${maxHeight}px`;
        }
      });
    }
  }
}

async function getPriceElementSuffix(placeholderArr, response) {
  try {
    if (!placeholderArr || !Array.isArray(placeholderArr) || !response) {
      window.lana?.log('Invalid parameters passed to getPriceElementSuffix');
      return '';
    }

    const cleanPlaceholderArr = placeholderArr.map((placeholder) => placeholder.replace('((', '').replace('))', ''));
    const placeholdersResponse = await replaceKeyArray(cleanPlaceholderArr, getConfig());

    if (!placeholdersResponse || !Array.isArray(placeholdersResponse)) {
      window.lana?.log('Failed to get placeholders response');
      return '';
    }

    return cleanPlaceholderArr.map((key, i) => (key.includes('vat') && !response.showVat && placeholdersResponse[i].replaceAll(' ', '') !== key.replaceAll('-', '')
      ? ''
      : ((placeholdersResponse[i].replaceAll(' ', '') !== key.replaceAll('-', '') ? placeholdersResponse[i] : '') || ''))).join(' ');
  } catch (error) {
    window.lana?.log('Error in getPriceElementSuffix:', error);
    return '';
  }
}

function handleYear2PricingToken(pricingArea, y2p, priceSuffix) {
  try {
    const elements = pricingArea.querySelectorAll('p');
    const year2PricingToken = Array.from(elements).find(
      (p) => p.textContent.includes(YEAR_2_PRICING_TOKEN),
    );
    if (!year2PricingToken) return;
    if (y2p) {
      year2PricingToken.innerHTML = year2PricingToken.innerHTML.replace(
        YEAR_2_PRICING_TOKEN,
        `${y2p} ${priceSuffix}`,
      );
    } else {
      year2PricingToken.remove();
    }
  } catch (e) {
    window.lana?.log(e);
  }
}

function handlePriceSuffix(priceEl, priceSuffix, priceSuffixTextContent) {
  const parentP = priceEl.parentElement;
  if (parentP.children.length > 1) {
    Array.from(parentP.childNodes).forEach((node) => {
      if (node === priceEl) return;

      if (node.nodeName === '#text') {
        priceSuffix.append(node);
      } else {
        priceSuffix.before(node);
      }
    });
  } else {
    priceSuffix.textContent = priceSuffixTextContent;
    priceEl.append(priceSuffix);
  }
}

async function handleRawPrice(price, basePrice, response, priceSuffix, priceRow) {
  const [priceReduced, priceWas, priceNow] = await replaceKeyArray([
    'price-reduced',
    'price-was',
    'price-now',
  ], getConfig());
  price.innerHTML = response.formatted;
  basePrice.innerHTML = response.formattedBP || '';
  if (response.price?.length > LONG_PRICE_LENGTH) {
    price.classList.add('long-price');
    basePrice.classList.add('long-price');
  }
  if (basePrice.innerHTML !== '') {
    price.classList.add('price-active');

    const priceReducedElement = createTag('p');

    const reducedText = createTag('span', { class: 'visually-hidden' });
    reducedText.textContent = priceReduced;
    priceReducedElement.appendChild(reducedText);

    const del = createTag('del');
    const wasText = createTag('span', { class: 'visually-hidden' });
    wasText.textContent = priceWas;
    priceReducedElement.appendChild(wasText);
    del.appendChild(basePrice.cloneNode(true));
    priceReducedElement.appendChild(del);

    const ins = createTag('ins');
    const nowText = createTag('span', { class: 'visually-hidden' });
    nowText.textContent = priceNow;
    priceReducedElement.appendChild(nowText);
    ins.appendChild(price.cloneNode(true));
    priceReducedElement.appendChild(ins);
    priceRow.append(priceReducedElement, priceSuffix);
  } else {
    price.classList.remove('price-active');
    priceRow.append(basePrice, price, priceSuffix);
  }
}

async function createPricingSection(
  header,
  pricingArea,
  ctaGroup,
) {
  try {
    if (!pricingArea || !ctaGroup) {
      window.lana?.log('Missing required parameters for createPricingSection');
      return;
    }

    pricingArea.classList.add('pricing-area');
    const priceEl = [...pricingArea.querySelectorAll('a')].filter((link) => link.textContent.includes(PRICE_TOKEN))[0];
    if (!priceEl) {
      cleanupEmptyParagraphs(pricingArea);
      return;
    }

    const pricingSuffixTextElem = priceEl.closest('p')?.nextElementSibling;
    const placeholderArr = pricingSuffixTextElem?.textContent?.split(' ') || [];

    const priceRow = createTag('div', { class: 'pricing-row' });
    const price = createTag('span', { class: 'pricing-price' });
    const basePrice = createTag('span', { class: 'pricing-base-price' });
    const priceSuffix = createTag('div', { class: 'pricing-row-suf' });

    const fetchRes = await safeFetchPricing(priceEl?.href);
    if (!fetchRes.ok) {
      window.lana?.log('Simplified pricing API failure', { href: priceEl?.href, error: fetchRes.message });
      renderPricingFallback(pricingArea, priceRow, priceEl, pricingSuffixTextElem);
      cleanupEmptyParagraphs(pricingArea);
      return;
    }

    try {
      const priceSuffixTextContent = await getPriceElementSuffix(placeholderArr, fetchRes.data);
      handlePriceSuffix(priceEl, priceSuffix, priceSuffixTextContent);
      await handleRawPrice(price, basePrice, fetchRes.data, priceSuffix, priceRow);

      handleTooltip(pricingArea);
      handleYear2PricingToken(pricingArea, fetchRes.data.y2p, priceSuffixTextContent);
      pricingArea.prepend(priceRow);
      priceEl?.parentNode?.remove();
      pricingSuffixTextElem?.remove();
    } catch (processingError) {
      window.lana?.log('Simplified pricing processing error', { error: processingError.message });
      renderPricingFallback(pricingArea, priceRow, priceEl, pricingSuffixTextElem, { priceText: 'Price processing error', suffixText: '' });
    }

    cleanupEmptyParagraphs(pricingArea);

    // Process CTA group with error handling
    try {
      ctaGroup.classList.add('card-cta-group');
      ctaGroup.querySelectorAll('a').forEach((a, i) => {
        try {
          a.classList.add('large');
          if (i === 1) a.classList.add('secondary');
          if (a.parentNode.tagName.toLowerCase() === 'strong') {
            a.classList.add('button', 'primary');
          }
          formatDynamicCartLink(a);
          if (a.textContent.includes(SALES_NUMBERS)) {
            formatSalesPhoneNumber([a], SALES_NUMBERS);
          }
          const headerText = header?.querySelector('h2')?.textContent;
          a.setAttribute('aria-label', `${a.textContent.trim()} ${headerText || ''}`);
        } catch (linkError) {
          window.lana?.log('Error processing CTA link:', linkError);
        }
      });
    } catch (ctaError) {
      window.lana?.log('CTA group processing error', { error: ctaError.message });
    }
  } catch (error) {
    window.lana?.log('createPricingSection error', { error: error.message });
  }
}

function decorateHeader(cardWrapper, card, header, cardIndex, defaultOpenIndex) {
  header.classList.add('card-header');
  const headers = header.querySelectorAll('h2,h3,h4,h5,h6');
  if (headers.length > 1) {
    const eyebrowContent = createTag('div', { class: 'eyebrow-content' });
    const firstHeader = headers[0];
    firstHeader.classList.add('eyebrow-header');
    eyebrowContent.appendChild(firstHeader);
    card.prepend(eyebrowContent);
    cardWrapper.classList.add('has-eyebrow');
    if (defaultOpenIndex[0] === 0) {
      defaultOpenIndex[0] = cardIndex;
    }
  }

  header.querySelectorAll('p').forEach((p) => {
    if (p.innerHTML.trim() === '') p.remove();
  });

  // Get the header text for the button name
  const remainingHeaders = header.querySelectorAll('h2,h3,h4,h5,h6');
  const headerText = remainingHeaders[0]?.textContent?.trim() || '';

  // Create button wrapper for header content and chevron
  const headerButton = createTag('button', {
    class: 'header-toggle-button',
    type: 'button',
    name: headerText,
    'aria-expanded': 'false',
    'aria-controls': `card-content-${cardIndex}`,
  });

  // Move all header content into the button
  const headerContent = createTag('div', { class: 'header-content' });
  while (header.firstChild) {
    headerContent.appendChild(header.firstChild);
  }

  // Create chevron wrapper and icon
  const hideButtonWrapper = createTag('div', { class: 'toggle-switch-wrapper' });
  const hideButton = getIconElementDeprecated('chevron-up');
  hideButtonWrapper.append(hideButton);

  // Add click handler to the button
  headerButton.addEventListener('click', () => {
    const { classList } = header.parentElement;
    if (classList.contains('hide')) {
      classList.remove('hide');
      headerButton.setAttribute('aria-expanded', 'true');
      adjustImageTooltipPosition();
      adjustElementPosition();
    } else {
      classList.add('hide');
      headerButton.setAttribute('aria-expanded', 'false');
    }
  });

  // Append content and chevron to button
  headerButton.append(headerContent);
  headerButton.append(hideButtonWrapper);

  // Append button to header
  header.append(headerButton);
}

function decorateCardBorder(card, source) {
  const pattern = /\(\((.*?)\)\)/g;
  const matches = Array.from(source.textContent?.matchAll(pattern));
  if (matches.length > 0) {
    const [, promoType] = matches[matches.length - 1];
    card.classList.add(promoType.replaceAll(' ', ''));
    source.textContent = source.textContent.replace(pattern, '').trim();
    if (source.textContent !== '') {
      source.classList.add('promo-eyebrow-text');
      card.classList.add('promo-text');
    } else {
      source.style.display = 'none';
    }
  }
  source.style.display = 'none';
}

/**
 * Loads required modules and initializes module-level variables
 */
async function loadRequiredModules() {
  try {
    await Promise.all([
      import(`${getLibs()}/utils/utils.js`),
      import(`${getLibs()}/features/placeholders.js`),
      import('../../scripts/utils/location-utils.js'),
    ]).then(([utils, placeholders, locationUtils]) => {
      ({ createTag, getConfig } = utils);
      ({ replaceKeyArray } = placeholders);
      ({ formatSalesPhoneNumber } = locationUtils);
    });
  } catch (error) {
    window.lana?.log('Failed to load required modules:', error);
    throw error;
  }
}

/**
 * Creates and processes all pricing cards
 * @param {Array} rows - The DOM rows containing card data
 * @param {number} cardCount - Number of cards to create
 * @returns {Object} - Object containing cards array and defaultOpenIndex
 */
async function createCards(el, rows, cardCount) {
  const defaultClassIndex = Array.from(el.classList).filter((className) => className.includes('default-open-')).map((className) => parseInt(className.replace('default-open-', ''), 10) - 1);
  const cards = [];
  const defaultOpenIndex = defaultClassIndex.length > 0 ? defaultClassIndex : [0];
  const cardWrapper = createTag('div', { class: 'card-wrapper' });

  /* eslint-disable no-await-in-loop */
  for (let cardIndex = 0; cardIndex < cardCount; cardIndex += 1) {
    const card = createTag('div', { class: 'card' });
    const cardInnerContent = createTag('div', {
      class: 'card-inner-content',
      id: `card-content-${cardIndex}`,
    });
    cardInnerContent.classList.add('hide');
    card.appendChild(cardInnerContent);

    // Process card header, border, and content
    decorateHeader(cardWrapper, card, rows[0].children[0], cardIndex, defaultOpenIndex);
    decorateCardBorder(card, rows[1].children[0]);
    rows[2].children[0].classList.add('plan-explanation');

    await createPricingSection(
      rows[0].children[0],
      rows[3].children[0],
      rows[4].children[0],
    );

    // Append content to card
    for (let j = 0; j < rows.length - 2; j += 1) {
      cardInnerContent.appendChild(rows[j].children[0]);
    }

    cards.push(card);
  }

  return { cards, defaultOpenIndex, cardWrapper };
}

/**
 * Processes plan explanation elements to setup tooltips
 * @param {Element} el - The container element
 */
function processTooltips(el) {
  const planExplanations = el.querySelectorAll('.plan-explanation');
  planExplanations.forEach((planExplanation) => {
    const paragraphs = planExplanation.querySelectorAll('p');
    paragraphs.forEach((p) => {
      const images = p.querySelectorAll('img');
      if (images.length > 0) {
        p.classList.add('plan-icon-list');
        images.forEach((img) => {
          handleImageTooltip(img);
        });
      } else {
        p.classList.add('plan-text');
      }
    });
  });
}

/**
 * Sets up DOM structure and event handlers
 * @param {Element} el - The container element
 * @param {Array} cards - Array of card elements
 * @param {Array} rows - The DOM rows
 * @param {Array} defaultOpenIndex - Index of the default open card
 * @param {Element} cardWrapper - The card wrapper element
 */
function setupDOMAndEvents(el, cards, rows, defaultOpenIndex, cardWrapper) {
  // Set default open card
  cards[defaultOpenIndex[0]].querySelector('.card-inner-content').classList.remove('hide');
  cards[defaultOpenIndex[0]].querySelector('.header-toggle-button').setAttribute('aria-expanded', 'true');

  // Clear and setup DOM structure
  el.innerHTML = '';
  el.appendChild(cardWrapper);
  for (const card of cards) {
    cardWrapper.appendChild(card);
  }

  // Add footer elements

  if (rows.length > 6) {
    rows[rows.length - 2].classList.add('pricing-footer');
    cardWrapper.appendChild(rows[rows.length - 2]);
  } else {
    rows[rows.length - 1].classList.add('pricing-footer-button');
  }

  rows[rows.length - 1].querySelector('a').classList.add('button', 'compare-all-button');
  cardWrapper.appendChild(rows[rows.length - 1]);

  // Initialize observers array for cleanup tracking
  const observers = [];

  // Setup intersection observer for height equalization
  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        try {
          equalizeHeights(el);
          intersectionObserver.unobserve(entry.target);
          adjustElementPosition();
          adjustImageTooltipPosition();
        } catch (error) {
          window.lana?.log('Simplified IntersectionObserver error', { error: error.message });
        }
      }
    });
  });

  // Store observer for cleanup
  observers.push(intersectionObserver);

  const c = el.querySelectorAll('.card');
  if (c.length > 0) {
    c.forEach((card) => {
      intersectionObserver.observe(card);
    });
  }

  // Setup resize handler with cleanup tracking
  const resizeHandler = debounce(() => {
    try {
      equalizeHeights(el);
    } catch (error) {
      window.lana?.log('Error in simplified resize handler:', error);
    }
  }, RESIZE_DEBOUNCE_MS);

  window.addEventListener('resize', resizeHandler);

  // Setup observers for parent .section element
  const parentSection = el.closest('.section');
  if (parentSection) {
    // MutationObserver for display changes
    const mutationObserver = new MutationObserver(debounce((mutations) => {
      try {
        let displayChanged = false;

        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes'
              && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
            const computedStyle = window.getComputedStyle(parentSection);
            const currentDisplay = computedStyle.display;

            if (!parentSection.dataset.prevDisplay) {
              parentSection.dataset.prevDisplay = currentDisplay;
            }

            if (parentSection.dataset.prevDisplay !== currentDisplay) {
              displayChanged = true;
              parentSection.dataset.prevDisplay = currentDisplay;
            }
          }
        });

        if (displayChanged && parentSection.offsetHeight > 0) {
          equalizeHeights(el);
        }
      } catch (error) {
        window.lana?.log('Error in simplified mutation observer:', error);
        window.lana?.log('Simplified MutationObserver error', { error: error.message });
      }
    }, RESIZE_DEBOUNCE_MS));

    // ResizeObserver for height changes
    const resizeObserver = new ResizeObserver(debounce((entries) => {
      try {
        for (const entry of entries) {
          if (entry.target === parentSection && entry.contentRect.height > 0) {
            equalizeHeights(el);
          }
        }
      } catch (error) {
        window.lana?.log('Error in simplified resize observer:', error);
        window.lana?.log('Simplified ResizeObserver error', { error: error.message });
      }
    }, RESIZE_DEBOUNCE_MS));

    // Store observers for cleanup
    observers.push(mutationObserver);
    observers.push(resizeObserver);

    // Start observing
    mutationObserver.observe(parentSection, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: false,
      subtree: false,
    });

    resizeObserver.observe(parentSection);
  }

  // Enhanced cleanup function
  el.cleanupObservers = () => {
    try {
      // Disconnect all stored observers
      observers.forEach((observer) => {
        if (observer && typeof observer.disconnect === 'function') {
          observer.disconnect();
        }
      });

      // Clear observers array
      observers.length = 0;

      // Remove resize handler
      window.removeEventListener('resize', resizeHandler);

      // Clear stored references
      el.sectionMutationObserver = null;
      el.sectionResizeObserver = null;
    } catch (error) {
      window.lana?.log('Simplified observer cleanup error', { error: error.message });
    }
  };

  // Auto cleanup on page unload
  window.addEventListener('beforeunload', el.cleanupObservers, { once: true });
}

export default async function init(el) {
  try {
    if (!el) {
      window.lana?.log('Element is required for simplified-pricing-cards-v2 initialization');
      return;
    }

    // Initialize component wrapper
    addTempWrapperDeprecated(el, 'simplified-pricing-cards-v2');

    // Load required modules
    await loadRequiredModules();

    // Extract DOM structure
    const rows = Array.from(el.querySelectorAll(':scope > div'));
    const cardCount = rows[0].children.length;

    // Create all cards
    const { cards, defaultOpenIndex, cardWrapper } = await createCards(el, rows, cardCount);
    el.classList.add('loaded');
    // Setup DOM structure and event handlers
    setupDOMAndEvents(el, cards, rows, defaultOpenIndex, cardWrapper);

    // Process tooltips
    processTooltips(el);

    // Decorate buttons
    await decorateButtonsDeprecated(el);
  } catch (error) {
    window.lana?.log('Error initializing simplified-pricing-cards-v2:', error);
  }
}
