import { getLibs, addTempWrapperDeprecated, decorateButtonsDeprecated, getIconElementDeprecated } from '../../scripts/utils.js';
import {
  fetchPlanOnePlans,
  formatDynamicCartLink,
} from '../../scripts/utils/pricing.js';
import { debounce } from '../../scripts/utils/hofs.js';
import handleTooltip, { adjustElementPosition, imageTooltipAdapter } from '../../scripts/widgets/tooltip.js';

let createTag; let getConfig;
let replaceKeyArray; let formatSalesPhoneNumber;

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
  const classNames = [ '.card-header', '.plan-text', '.pricing-area'];
  const cardCount = el.querySelectorAll('.simplified-pricing-cards-v2 .card').length;
  if (cardCount === 1) return;
  for (const className of classNames) {
    const headers = el.querySelectorAll(className);
    let maxHeight = 0;
    headers.forEach((placeholder) => {
      placeholder.style.height = 'unset';
    });
    if (window.screen.width > 1279) {
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
  const cleanPlaceholderArr = placeholderArr.map((placeholder) => placeholder.replace('((', '').replace('))', ''));
  const placeholdersResponse = await replaceKeyArray(cleanPlaceholderArr, getConfig());
  return cleanPlaceholderArr.map((key, i) => (key.includes('vat') && !response.showVat && placeholdersResponse[i].replaceAll(' ', '') !== key.replaceAll('-', '')
    ? ''
    : ((placeholdersResponse[i].replaceAll(' ', '') !== key.replaceAll('-', '') ? placeholdersResponse[i] : '') || ''))).join(' ');
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

async function handleRawPrice(price, basePrice, response, priceSuffix, priceRow) {
  const [priceReduced, priceWas, priceNow] = await replaceKeyArray([
    'price-reduced',
    'price-was',
    'price-now',
  ], getConfig());
  price.innerHTML = response.formatted;
  basePrice.innerHTML = response.formattedBP || '';
  if (response.price?.length > 6) {
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
  pricingArea.classList.add('pricing-area');
  const priceEl = [...pricingArea.querySelectorAll('a')].filter((link) => link.textContent.includes(PRICE_TOKEN))[0];

  if (priceEl) {
    const pricingSuffixTextElem = priceEl.closest('p').nextElementSibling;
    const placeholderArr = pricingSuffixTextElem.textContent?.split(' ');

    const priceRow = createTag('div', { class: 'pricing-row' });
    const price = createTag('span', { class: 'pricing-price' });
    const basePrice = createTag('span', { class: 'pricing-base-price' });
    const priceSuffix = createTag('div', { class: 'pricing-row-suf' });
    const response = await fetchPlanOnePlans(priceEl?.href);
    const priceSuffixTextContent = await getPriceElementSuffix(
      placeholderArr,
      response,
    );
    handlePriceSuffix(priceEl, priceSuffix, priceSuffixTextContent);
    handleRawPrice(price, basePrice, response, priceSuffix, priceRow);

    handleTooltip(pricingArea);
    handleYear2PricingToken(pricingArea, response.y2p, priceSuffixTextContent);
    pricingArea.prepend(priceRow);
    priceEl?.parentNode?.remove();
    pricingSuffixTextElem?.remove();
    
    // Clean up any empty paragraph elements
    pricingArea.querySelectorAll('p').forEach((p) => {
      if (p.textContent.trim() === '' && p.children.length === 0) {
        p.remove();
      }
    });
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
    const headerText = header?.querySelector('h2')?.textContent;
    a.setAttribute('aria-label', `${a.textContent.trim()} ${headerText}`);
  });
}

function decorateHeader(cardWrapper, card,header, cardIndex,defaultOpenIndex) {
  header.classList.add('card-header');
  const headers = header.querySelectorAll('h2,h3,h4,h5,h6');
  if (headers.length > 1) {
    const eyebrowContent = createTag('div', { class: 'eyebrow-content' });
    const firstHeader = headers[0];
    firstHeader.classList.add('eyebrow-header');
    eyebrowContent.appendChild(firstHeader);
    card.prepend(eyebrowContent);
    cardWrapper.classList.add('has-eyebrow');
    console.log(defaultOpenIndex[0]);
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

export default async function init(el) {
  addTempWrapperDeprecated(el, 'simplified-pricing-cards-v2');
  await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`), import('../../scripts/utils/location-utils.js')]).then(([utils, placeholders, locationUtils]) => {
    ({ createTag, getConfig } = utils);
    ({ replaceKeyArray } = placeholders);
    ({ formatSalesPhoneNumber } = locationUtils);
  });

  const rows = Array.from(el.querySelectorAll(':scope > div'));
  const cardCount = rows[0].children.length;
  const cards = [];
  const defaultOpenIndex = [0];
 
  const cardWrapper = createTag('div', { class: 'card-wrapper ax-grid-container small-gap' });
  
  /* eslint-disable no-await-in-loop */
  for (let cardIndex = 0; cardIndex < cardCount; cardIndex += 1) {
    const card = createTag('div', { class: 'card' });
    const cardInnerContent = createTag('div', {
      class: 'card-inner-content',
      id: `card-content-${cardIndex}`,
    });
    cardInnerContent.classList.add('hide');
    card.appendChild(cardInnerContent);
    decorateHeader(cardWrapper, card, rows[0].children[0], cardIndex, defaultOpenIndex);
    decorateCardBorder(card, rows[1].children[0]);
    rows[2].children[0].classList.add('plan-explanation');
    await createPricingSection(
      rows[0].children[0],
      rows[3].children[0],
      rows[4].children[0],
    );
    for (let j = 0; j < rows.length - 2; j += 1) {
      cardInnerContent.appendChild(rows[j].children[0]);
    }
    cards.push(card);
  }

  cards[defaultOpenIndex[0]].querySelector('.card-inner-content').classList.remove('hide');
  cards[defaultOpenIndex[0]].querySelector('.header-toggle-button').setAttribute('aria-expanded', 'true');

  el.innerHTML = '';
  el.appendChild(cardWrapper);
  for (const card of cards) {
    cardWrapper.appendChild(card);
  }
  rows[rows.length - 2].classList.add('pricing-footer');
  rows[rows.length - 1].querySelector('a').classList.add('button', 'compare-all-button');
  cardWrapper.appendChild(rows[rows.length - 2]);
  cardWrapper.appendChild(rows[rows.length - 1]);

  // Process images in plan-explanation elements for tooltips
  const planExplanations = el.querySelectorAll('.plan-explanation');
  planExplanations.forEach((planExplanation) => {
    const paragraphs = planExplanation.querySelectorAll('p');
    paragraphs.forEach((p) => {
      const images = p.querySelectorAll('img');
      if (images.length > 0) {
        p.classList.add('plan-icon-list');
        images.forEach((img) => {
          imageTooltipAdapter(img);
        });
      } else {
        p.classList.add('plan-text');
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        equalizeHeights(el);
        observer.unobserve(entry.target);
        adjustElementPosition();
      }
    });
  });

  document.querySelectorAll('.simplified-pricing-cards-v2 .card').forEach((column) => {
    observer.observe(column);
  });
  await decorateButtonsDeprecated(el);

  window.addEventListener('resize', debounce(() => {
    equalizeHeights(el);
  }, 100));

  // cards.forEach((card) => {
  //   const eyebrowContent = createTag('div', { class: 'card' });
  //   const header = createTag('h2', { class: 'eyebrow-header' });
  //   header.textContent = 'Best value';
  //   eyebrowContent.appendChild(header);
  //   eyebrowContent.appendChild(card);
  //   cardWrapper.appendChild(eyebrowContent);
  // });
}
