import {
  getLibs,
  yieldToMain,
} from '../../scripts/utils.js';
import { addTempWrapperDeprecated, decorateButtonsDeprecated } from '../../scripts/utils/decorate.js';
import { getIconElementDeprecated, fixIcons } from '../../scripts/utils/icons.js';
import { debounce } from '../../scripts/utils/hofs.js';
import { formatSalesPhoneNumber } from '../../scripts/utils/location-utils.js';
import {
  formatDynamicCartLink,
  shallSuppressOfferEyebrowText,
  fetchPlanOnePlans,
} from '../../scripts/utils/pricing.js';
import createToggle, { tagFreePlan } from './pricing-toggle.js';
import BlockMediator from '../../scripts/block-mediator.min.js';

const [{ createTag, getConfig }, { replaceKeyArray }] = await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]);

const blockKeys = [
  'header',
  'borderParams',
  'explain',
  'mPricingRow',
  'mCtaGroup',
  'yPricingRow',
  'yCtaGroup',
  'featureList',
  'compare',
];
const SAVE_PERCENTAGE = '((savePercentage))';
const SALES_NUMBERS = '((business-sales-numbers))';
const PRICE_TOKEN = '((pricing))';
const YEAR_2_PRICING_TOKEN = '[[year-2-pricing-token]]';
const BASE_PRICING_TOKEN = '[[base-pricing-token]]';

function suppressOfferEyebrow(specialPromo, legacyVersion) {
  if (specialPromo.parentElement) {
    if (legacyVersion) {
      specialPromo.parentElement.classList.remove('special-promo');
      specialPromo.remove();
    } else {
      specialPromo.className = 'hide';
      specialPromo.parentElement.className = '';
      specialPromo.parentElement.classList.add('card-border');
      specialPromo.remove();
    }
  }
}

async function getPriceElementSuffix(placeholderArr, response) {
  const cleanPlaceholderArr = placeholderArr.map((placeholder) => placeholder.replace('((', '').replace('))', ''));
  const placeholdersResponse = await replaceKeyArray(cleanPlaceholderArr, getConfig());

  return cleanPlaceholderArr.map((key, i) => (key.includes('vat') && !response.showVat
    ? ''
    : placeholdersResponse[i] || '')).join(' ');
}

// eslint-disable-next-line default-param-last
function handlePriceToken(pricingArea, priceToken = YEAR_2_PRICING_TOKEN, newPrice, priceSuffix = '') {
  try {
    const elements = pricingArea.querySelectorAll('p');
    const year2PricingToken = Array.from(elements).find(
      (p) => p.textContent.includes(priceToken),
    );
    if (!year2PricingToken) return;
    if (newPrice) {
      year2PricingToken.innerHTML = year2PricingToken.innerHTML.replace(
        priceToken,
        `${newPrice} ${priceSuffix}`,
      );
    } else {
      year2PricingToken.textContent = '';
    }
  } catch (e) {
    window.lana.log(e);
  }
}

function handleSpecialPromo(
  specialPromo,
  isPremiumCard,
  response,
  legacyVersion,
) {
  if (specialPromo?.textContent.includes(SAVE_PERCENTAGE)) {
    const offerTextContent = specialPromo.textContent;
    const shouldSuppress = shallSuppressOfferEyebrowText(
      response.savePer,
      offerTextContent,
      isPremiumCard,
      true,
      response.offerId,
    );

    if (shouldSuppress) {
      suppressOfferEyebrow(specialPromo, legacyVersion);
    } else {
      specialPromo.innerHTML = specialPromo.innerHTML.replace(
        SAVE_PERCENTAGE,
        response.savePer,
      );
    }
  }
  if (
    !isPremiumCard
    && specialPromo?.parentElement?.classList?.contains('special-promo')
  ) {
    specialPromo.parentElement.classList.remove('special-promo');
    if (specialPromo.parentElement.firstChild.innerHTML !== '') {
      specialPromo.parentElement.firstChild.remove();
    }
  }
}

function handleSavePercentage(savePercentElem, isPremiumCard, response) {
  if (savePercentElem) {
    const offerTextContent = savePercentElem.textContent;
    if (
      shallSuppressOfferEyebrowText(
        response.savePer,
        offerTextContent,
        isPremiumCard,
        true,
        response.offerId,
      )
    ) {
      savePercentElem.remove();
    } else {
      savePercentElem.innerHTML = savePercentElem.innerHTML.replace(
        SAVE_PERCENTAGE,
        response.savePer,
      );
    }
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
}

function adjustElementPosition() {
  const elements = document.querySelectorAll('.tooltip-text');

  if (elements.length === 0) return;
  for (const element of elements) {
    const rect = element.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      element.classList.remove('overflow-left');
      element.classList.add('overflow-right');
    } else if (rect.left < 0) {
      element.classList.remove('overflow-right');
      element.classList.add('overflow-left');
    } else {
      element.classList.remove('overflow-right');
      element.classList.remove('overflow-left');
    }
  }
}

function handleTooltip(pricingArea) {
  const elements = pricingArea.querySelectorAll('p');
  const pattern = /\[\[([^]+)\]\]([^]+)\[\[\/([^]+)\]\]/g;
  let tooltip;
  let tooltipDiv;

  Array.from(elements).forEach((p) => {
    const res = pattern.exec(p.textContent);
    if (res) {
      tooltip = res;
      tooltipDiv = p;
    }
  });
  if (!tooltip) return;

  tooltipDiv.innerHTML = tooltipDiv.innerHTML.replace(pattern, '');
  const tooltipText = tooltip[2];
  tooltipDiv.classList.add('tooltip');
  const span = createTag('div', { class: 'tooltip-text' });
  span.innerText = tooltipText;
  const icon = getIconElementDeprecated('info', 44, 'Info', 'tooltip-icon');
  icon.append(span);
  const iconWrapper = createTag('span');
  iconWrapper.append(icon);
  iconWrapper.append(span);
  tooltipDiv.append(iconWrapper);
}

async function handlePrice(pricingArea, specialPromo, groupID, legacyVersion) {
  const priceEl = Array.from(pricingArea.querySelectorAll('a')).find((anchor) => anchor.textContent === PRICE_TOKEN);
  const pricingBtnContainer = pricingArea.querySelector('.action-area, .button-container');

  if (!pricingBtnContainer) return;
  if (!priceEl) return;

  const pricingSuffixTextElem = pricingBtnContainer.nextElementSibling;
  const placeholderArr = pricingSuffixTextElem.textContent?.split(' ');

  const priceRow = createTag('div', { class: 'pricing-row' });
  const price = createTag('span', { class: 'pricing-price' });
  const basePrice = createTag('span', { class: 'pricing-base-price' });
  const priceSuffix = createTag('div', { class: 'pricing-row-suf' });

  priceRow.append(basePrice, price, priceSuffix);

  const response = await fetchPlanOnePlans(priceEl?.href);
  if (response.term && groupID) {
    BlockMediator.set(groupID, response.term);
  }

  const priceSuffixTextContent = await getPriceElementSuffix(
    placeholderArr,
    response,
  );

  const isPremiumCard = response.ooAvailable || false;
  const savePercentElem = pricingArea.querySelector('.card-offer');
  handleRawPrice(price, basePrice, response);
  handlePriceSuffix(priceEl, priceSuffix, priceSuffixTextContent);
  handleTooltip(pricingArea);
  handleSavePercentage(savePercentElem, isPremiumCard, response);
  handleSpecialPromo(specialPromo, isPremiumCard, response, legacyVersion);
  handlePriceToken(pricingArea, YEAR_2_PRICING_TOKEN, response.y2p, priceSuffixTextContent);
  handlePriceToken(pricingArea, BASE_PRICING_TOKEN, response.formattedBP);
  priceEl?.parentNode?.remove();
  if (!priceRow) return;
  pricingArea.prepend(priceRow);
  pricingBtnContainer?.remove();
  pricingSuffixTextElem?.remove();
}

async function createPricingSection(
  pricingArea,
  ctaGroup,
  specialPromo,
  groupID,
  legacyVersion,
) {
  const pricingSection = createTag('div', { class: 'pricing-section' });
  pricingArea.classList.add('pricing-area');
  const offer = pricingArea.querySelector(':scope > p > i');
  if (offer) {
    offer.classList.add('card-offer');
    offer.parentElement.outerHTML = offer.outerHTML;
  }
  await handlePrice(pricingArea, specialPromo, groupID, legacyVersion);
  ctaGroup.classList.add('card-cta-group');
  ctaGroup.querySelectorAll('a').forEach((a, i) => {
    a.classList.add('large');
    if (i === 1) a.classList.add('secondary');
    if (a.parentNode.tagName.toLowerCase() === 'strong' || a.getAttribute('href').includes('adobesparkpost.app.link')) {
      a.classList.add('button', 'primary');
      a.parentNode.remove();
    }
    if (a.parentNode.tagName.toLowerCase() === 'p') {
      a.parentNode.remove();
    }
    formatDynamicCartLink(a);
    ctaGroup.append(a);
  });
  pricingSection.append(pricingArea);
  pricingSection.append(ctaGroup);
  return pricingSection;
}

function readBraces(inputString, card) {
  if (!inputString) {
    return null;
  }

  // Pattern to find ((...))
  const pattern = /\(\((.*?)\)\)/g;
  const matches = Array.from(inputString.trim().matchAll(pattern));

  if (matches.length > 0) {
    const [token, promoType] = matches[matches.length - 1];
    const specialPromo = createTag('div');
    specialPromo.textContent = inputString.split(token)[0].trim();
    card.classList.add(promoType.replaceAll(' ', ''));
    card.append(specialPromo);
    return specialPromo;
  }
  return null;
}
// Function for decorating a legacy header / promo.
function decorateLegacyHeader(header, card) {
  header.classList.add('card-header');
  const h2 = header.querySelector('h2');
  const h2Text = h2.textContent.trim();
  h2.innerHTML = '';
  const headerConfig = /\((.+)\)/.exec(h2Text);
  const premiumIcon = header.querySelector('img');
  let specialPromo;
  if (premiumIcon) h2.append(premiumIcon);
  if (headerConfig) {
    const cfg = headerConfig[1];
    h2.append(h2Text.replace(`(${cfg})`, '').trim());
    if (/^\d/.test(cfg)) {
      const headCntDiv = createTag('div', { class: 'head-cnt', alt: '' });
      headCntDiv.textContent = cfg;
      headCntDiv.prepend(
        createTag('img', {
          src: '/express/icons/head-count.svg',
          alt: 'icon-head-count',
        }),
      );
      header.append(headCntDiv);
    } else {
      specialPromo = createTag('div');
      specialPromo.textContent = cfg;
      card.classList.add('special-promo');
      card.append(specialPromo);
    }
  } else {
    h2.append(h2Text);
  }
  header.querySelectorAll('p').forEach((p) => {
    if (p.innerHTML.trim() === '') p.remove();
  });
  card.append(header);
  return { specialPromo, cardWrapper: card };
}

function decorateHeader(header, borderParams, card, cardBorder) {
  const h2 = header.querySelector('h2');
  // The raw text extracted from the word doc
  header.classList.add('card-header');
  const specialPromo = readBraces(borderParams?.innerText, cardBorder);
  const premiumIcon = header.querySelector('img');
  // Finds the headcount, removes it from the original string and creates an icon with the hc
  const extractHeadCountExp = /(>?)\(\d+(.*?)\)/;
  if (extractHeadCountExp.test(h2.innerText)) {
    const headCntDiv = createTag('div', { class: 'head-cnt', alt: '' });
    const headCount = h2.innerText
      .match(extractHeadCountExp)[0]
      .replace(')', '')
      .replace('(', '');
    [h2.innerText] = h2.innerText.split(extractHeadCountExp);
    headCntDiv.textContent = headCount;
    headCntDiv.prepend(
      createTag('img', {
        src: '/express/icons/head-count.svg',
        alt: 'icon-head-count',
      }),
    );
    header.append(headCntDiv);
  }
  if (premiumIcon) h2.append(premiumIcon);
  header.querySelectorAll('p').forEach((p) => {
    if (p.innerHTML.trim() === '') p.remove();
  });
  card.append(header);
  cardBorder.append(card);
  return { cardWrapper: cardBorder, specialPromo };
}

function decorateBasicTextSection(textElement, className, card) {
  if (textElement.innerHTML.trim()) {
    textElement.classList.add(className);
    card.append(textElement);
  }
}

// Links user to page where plans can be compared
function decorateCompareSection(compare, el, card) {
  if (compare?.innerHTML.trim()) {
    compare.classList.add('card-compare');
    compare.querySelector('a')?.classList.remove('button', 'accent');
    // in a tab, update url
    const closestTab = el.closest('div.tabpanel');
    if (closestTab) {
      try {
        const tabId = parseInt(closestTab.id.split('-').pop(), 10);
        const compareLink = compare.querySelector('a');
        const url = new URL(compareLink.href);
        url.searchParams.set('tab', tabId);
        compareLink.href = url.href;
      } catch (e) {
        // ignore
      }
    }
    card.append(compare);
  }
}

// In legacy versions, the card element encapsulates all content
// In new versions, the cardBorder element encapsulates all content instead
async function decorateCard({
  header,
  borderParams,
  explain,
  mPricingRow,
  mCtaGroup,
  yPricingRow,
  yCtaGroup,
  featureList,
  compare,
}, el, legacyVersion) {
  const card = createTag('div', { class: 'card' });
  const cardBorder = createTag('div', { class: 'card-border' });
  const { specialPromo, cardWrapper } = legacyVersion
    ? decorateLegacyHeader(header, card)
    : decorateHeader(header, borderParams, card, cardBorder);

  decorateBasicTextSection(explain, 'card-explain', card);
  const groupID = `${Date.now()}:${header.textContent.replace(/\s/g, '').trim()}`;
  const [mPricingSection, yPricingSection] = await Promise.all([
    createPricingSection(mPricingRow, mCtaGroup, specialPromo, groupID, legacyVersion),
    createPricingSection(yPricingRow, yCtaGroup, null),
  ]);
  mPricingSection.classList.add('monthly');
  yPricingSection.classList.add('annually', 'hide');

  const toggle = createToggle(
    [mPricingSection, yPricingSection],
    groupID,
    adjustElementPosition,
  );
  card.append(toggle, mPricingSection, yPricingSection);
  decorateBasicTextSection(featureList, 'card-feature-list', card);
  decorateCompareSection(compare, el, card);
  return cardWrapper;
}

// less thrashing by separating get and set
async function syncMinHeights(groups) {
  const maxHeights = groups.map((els) => els
    .filter((e) => !!e)
    .reduce((max, e) => Math.max(max, e.offsetHeight), 0));
  await yieldToMain();
  maxHeights.forEach((maxHeight, i) => groups[i].forEach((e) => {
    if (e) e.style.minHeight = `${maxHeight}px`;
  }));
}

export default async function init(el) {
  await fixIcons(el);
  const offers = Array.from(el.querySelectorAll('p > em'));

  // replace <em> with <i>
  offers.forEach((offer) => {
    const { parentElement } = offer; // <em>
    const i = document.createElement('i');
    i.innerHTML = offer.innerHTML;
    parentElement.replaceChild(i, offer);
  });

  decorateButtonsDeprecated(el);
  addTempWrapperDeprecated(el, 'pricing-cards');

  // For backwards compatability with old versions of the pricing card
  const legacyVersion = el.querySelectorAll(':scope > div').length < 10;
  const currentKeys = [...blockKeys];
  if (legacyVersion) {
    currentKeys.splice(1, 1);
  }
  const divs = currentKeys.map((_, index) => el.querySelectorAll(`:scope > div:nth-child(${index + 1}) > div`));

  const cards = Array.from(divs[0]).map((_, index) => currentKeys.reduce((obj, key, keyIndex) => {
    obj[key] = divs[keyIndex][index];
    return obj;
  }, {}));
  el.querySelectorAll(':scope > div:not(:last-of-type)').forEach((d) => d.remove());
  const cardsContainer = createTag('div', { class: 'cards-container' });

  const decoratedCards = await Promise.all(
    cards.map((card) => decorateCard(card, el, legacyVersion)),
  );
  decoratedCards.forEach((card) => cardsContainer.append(card));

  const phoneNumberTags = [...cardsContainer.querySelectorAll('a')].filter(
    (a) => a.title.includes(SALES_NUMBERS),
  );

  if (phoneNumberTags.length > 0) {
    await formatSalesPhoneNumber(phoneNumberTags, SALES_NUMBERS);
  }
  el.classList.add('no-visible');
  el.prepend(cardsContainer);

  const groups = [
    cards.map(({ header }) => header),
    cards.map(({ explain }) => explain),
    cards.reduce((acc, card) => [...acc, card.mCtaGroup, card.yCtaGroup], []),
    [...el.querySelectorAll('.pricing-area')],
    cards.map(({ featureList }) => featureList.querySelector('p')),
    cards.map(({ featureList }) => featureList),
    cards.map(({ compare }) => compare),
  ];

  const decoratedCardEls = [...cardsContainer.querySelectorAll('.card')];
  const synchedItems = groups.flat();
  synchedItems.forEach((item) => {
    // elements with js-controlled heights need border-box
    if (item) item.style.boxSizing = 'border-box';
  });
  const undoSyncHeights = () => {
    synchedItems.forEach((item) => {
      item.style?.removeProperty('min-height');
    });
  };
  const doSyncHeights = () => {
    // possible 2 card in row 1 and 3rd card in row 2
    const yPositions = decoratedCardEls.map((c) => c.getBoundingClientRect().top);
    const positionGroups = [];
    // positionGroups -> [2,1]
    yPositions.forEach((yPosition, i) => {
      // accounting for pixel lineup issues
      if (i === 0 || Math.abs(yPosition - yPositions[i - 1]) > 6) {
        positionGroups.push(1);
      } else {
        positionGroups[positionGroups.length - 1] += 1;
      }
    });
    if (positionGroups.length === cards.length) {
      // no sync when 1 card per row
      undoSyncHeights();
      return;
    }
    const groupsByTop = [];
    // [[h1, h2, h3], [e1, e2, e3], [m1,y1,m2,y2,m3,y3]] + [2,1]
    // -> [[h1, h2], [h3], [e1, e2], [e3], [m1, m2, y1, y2], [m3, y3]]
    groups.forEach((group) => {
      for (let prev = 0, i = 0; i < positionGroups.length; i += 1) {
        const span = positionGroups[i] * (group.length / cards.length);
        groupsByTop.push(group.slice(prev, prev + span));
        prev += span;
      }
    });
    syncMinHeights(groupsByTop);
  };
  window.addEventListener('resize', debounce(() => {
    doSyncHeights();
  }, 100));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        doSyncHeights();
        el.classList.remove('no-visible');
      }
      adjustElementPosition();
    });
  });

  observer.observe(el);
  tagFreePlan(cardsContainer);

  window.addEventListener('resize', adjustElementPosition);
}
