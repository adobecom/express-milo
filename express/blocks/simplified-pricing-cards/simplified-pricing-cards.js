import { addTempWrapper } from '../../scripts/decorate.js';
import {
  createTag,
  fetchPlaceholders,
} from '../../scripts/utils.js';

import {
  fetchPlanOnePlans,
  formatDynamicCartLink,
  formatSalesPhoneNumber,
} from '../../scripts/utils/pricing.js';

import { adjustElementPosition, handleTooltip } from './simplified-pricing-tooltip.js';

const SALES_NUMBERS = '((business-sales-numbers))';
const PRICE_TOKEN = '((pricing))';
const YEAR_2_PRICING_TOKEN = '((year-2-pricing-token))';

function getHeightWithoutPadding(element) {
  const styles = window.getComputedStyle(element);
  const paddingTop = parseFloat(styles.paddingTop);
  const paddingBottom = parseFloat(styles.paddingBottom);
  return element.clientHeight - paddingTop - paddingBottom;
}

function equalizeHeights(el) {

  const classNames = ['.plan-explanation', '.card-header'];
  const cardCount = el.querySelectorAll('.simplified-pricing-cards .card').length;
  if (cardCount === 1) return;
  for (const className of classNames) {
    const headers = el.querySelectorAll(className);
    let maxHeight = 0;
    headers.forEach((placeholder) => {
      placeholder.style.height = 'unset';
    });
    if (window.screen.width < 1200) continue;
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

function getPriceElementSuffix(placeholders, placeholderArr, response) {
  return placeholderArr
    .map((phText) => {
      const key = phText.replace('((', '').replace('))', '');
      return key.includes('vat') && !response.showVat
        ? ''
        : placeholders?.[key] || '';
    })
    .join(' ');
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
      year2PricingToken.textContent = '';
    }
  } catch (e) {
    window.lana.log(e);
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
  }
}

function handleRawPrice(price, basePrice, response) {
  price.innerHTML = response.formatted;
  basePrice.innerHTML = response.formattedBP || '';
  if (basePrice.innerHTML !== '') {
    price.classList.add('price-active');
  } else {
    price.classList.remove('price-active');
  }
  if (response.price.length > 6) {
    price.classList.add('long-price');
    basePrice.classList.add('long-price');
  }
}

async function createPricingSection(
  placeholders,
  pricingArea,
  ctaGroup,
) {
  pricingArea.classList.add('pricing-area');
  const priceEl = pricingArea.querySelector(`[title="${PRICE_TOKEN}"]`);
  const pricingBtnContainer = pricingArea.querySelector('.button-container');

  if (pricingBtnContainer && priceEl) {
    const pricingSuffixTextElem = pricingBtnContainer.nextElementSibling;
    const placeholderArr = pricingSuffixTextElem.textContent?.split(' ');

    const priceRow = createTag('div', { class: 'pricing-row' });
    const price = createTag('span', { class: 'pricing-price' });
    const basePrice = createTag('span', { class: 'pricing-base-price' });
    const priceSuffix = createTag('div', { class: 'pricing-row-suf' });
    const response = await fetchPlanOnePlans(priceEl?.href);

    const priceSuffixTextContent = getPriceElementSuffix(
      placeholders,
      placeholderArr,
      response,
    );

    handleRawPrice(price, basePrice, response);
    handlePriceSuffix(priceEl, priceSuffix, priceSuffixTextContent);
    handleTooltip(pricingArea);
    handleYear2PricingToken(pricingArea, response.y2p, priceSuffixTextContent);

    priceRow.append(basePrice, price, priceSuffix);
    pricingArea.prepend(priceRow);
    priceEl?.parentNode?.remove();
    pricingSuffixTextElem?.remove();
    pricingBtnContainer?.remove();
  }

  ctaGroup.classList.add('card-cta-group');
  ctaGroup.querySelectorAll('a').forEach((a, i) => {
    a.classList.add('large');
    if (i === 1) a.classList.add('secondary');
    if (a.parentNode.tagName.toLowerCase() === 'strong') {
      a.classList.add('button', 'primary');
    }
    formatDynamicCartLink(a);
    if (a.textContent.includes(SALES_NUMBERS)) {
      formatSalesPhoneNumber([a], SALES_NUMBERS);
    }
  });
}

function decorateHeader(header, planExplanation) {
  header.classList.add('card-header');
  header.querySelectorAll('p').forEach((p) => {
    if (p.innerHTML.trim() === '') p.remove();
  });
  planExplanation.classList.add('plan-explanation');
  const hideButtonWrapper = createTag('div', { class: 'toggle-switch-wrapper' });
  const hideButton = createTag('div', { class: 'toggle-switch' });
  hideButton.innerText = '>';
  hideButton.addEventListener('click', () => {
    const { classList } = header.parentElement;
    if (classList.contains('hide')) {
      classList.remove('hide');
    } else {
      classList.add('hide');
    }
  });
  header.append(hideButtonWrapper);
  hideButtonWrapper.append(hideButton);
}

function decorateCardBorder(card, source) {
  const pattern = /\[\[(.*?)\]\]/g;
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

export default async function init(el) {
  addTempWrapper(el, 'simplified-pricing-cards');
  const placeholders = await fetchPlaceholders();
  const rows = Array.from(el.querySelectorAll(':scope > div'));
  const cardCount = rows[0].children.length;
  const cards = [];

  /* eslint-disable no-await-in-loop */
  for (let cardIndex = 0; cardIndex < cardCount; cardIndex += 1) {
    const card = createTag('div', { class: 'card' });
    if (cardIndex > 0) {
      card.classList.add('hide');
    }
    decorateCardBorder(card, rows[1].children[0]);
    decorateHeader(rows[0].children[0], rows[2].children[0]);
    await createPricingSection(placeholders, rows[3].children[0],
      rows[4].children[0]);

    for (let j = 0; j < rows.length - 2; j += 1) {
      card.appendChild(rows[j].children[0]);
    }
    cards.push(card);
  }

  el.innerHTML = '';
  el.appendChild(createTag('div', { class: 'card-wrapper' }));
  for (const card of cards) {
    el.children[0].appendChild(card);
  }
  rows[rows.length - 2].classList.add('pricing-footer');
  rows[rows.length - 1].querySelector('a').classList.add('button', 'compare-all-button');
  el.appendChild(rows[rows.length - 2]);
  el.appendChild(rows[rows.length - 1]);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        equalizeHeights(el);
        observer.unobserve(entry.target);
        adjustElementPosition();
      }
    });
  });

  document.querySelectorAll('.simplified-pricing-cards .card').forEach((column) => {
    observer.observe(column);
  });

  const { debounce } = await import('../../scripts/hofs.js');
  window.addEventListener('resize', debounce(
    () => {
      equalizeHeights(el);
    }, 100,
  ));
}
