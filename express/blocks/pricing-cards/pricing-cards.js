import {   addTempWrapperDeprecated,
} from '../../scripts/utils/decorate.js';
import BlockMediator from '../../scripts/block-mediator.min.js';
import { getLibs } from '../../scripts/utils.js';
const { createTag, getMetadata } = await import(`${getLibs()}/utils/utils.js`);
import {
  formatDynamicCartLink,

  shallSuppressOfferEyebrowText,
  fetchPlanOnePlans,
} from '../../scripts/utils/pricing.js';
import { fetchPlaceholders } from '../../scripts/utils/placeholders.js';
import { formatSalesPhoneNumber } from '../../scripts/utils/location-utils.js';

const blockKeys = ['header', 'borderParams', 'explain', 'mPricingRow', 'mCtaGroup', 'yPricingRow', 'yCtaGroup', 'featureList', 'compare'];
const plans = ['monthly', 'yearly']; // authored order should match with billing-radio
const BILLING_PLAN = 'billing-plan';
const SAVE_PERCENTAGE = 'savePercentage';
const SALES_NUMBERS = '{{business-sales-numbers}}';

function suppressOfferEyebrow(specialPromo) {
  if (specialPromo.parentElement) {
      specialPromo.className = 'hide';
      specialPromo.parentElement.className = '';
      specialPromo.parentElement.classList.add('card-border');
      specialPromo.remove();
  }
}

function handlePrice(placeholders, pricingArea, placeholderArr, specialPromo) {
  const priceRow = createTag('div', { class: 'pricing-row' });
  const priceEl = pricingArea.querySelector('[title="{{pricing}}"]');
  if (!priceEl) return null;
  const priceParent = priceEl?.parentNode;

  const price = createTag('span', { class: 'pricing-price' });
  const basePrice = createTag('span', { class: 'pricing-base-price' });
  const priceSuffix = createTag('div', { class: 'pricing-row-suf' });

  priceRow.append(basePrice, price, priceSuffix);

  fetchPlanOnePlans(priceEl?.href).then((response) => {
    let specialPromoPercentageEyeBrowTextReplaced = false;
    let pricingCardPercentageEyeBrowTextReplaced = false;
    const parentP = priceEl.parentElement;
    price.innerHTML = response.formatted;
    basePrice.innerHTML = response.formattedBP || '';
    if (basePrice.innerHTML !== '') {
      price.classList.add('price-active');
    } else {
      price.classList.remove('price-active');
    }
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
      const priceSuffixContent = placeholderArr.map((phText) => {
        const key = phText.replace('{{', '').replace('}}', '');
        return (key.includes('vat') && !response.showVat) ? '' : placeholders[key] || '';
      }).join(' ');
      priceSuffix.textContent = priceSuffixContent;
    }
    const isPremiumCard = response.ooAvailable || false;
    const savePercentElem = pricingArea.querySelector('.card-offer');
    if (savePercentElem && !pricingCardPercentageEyeBrowTextReplaced) {
      const offerTextContent = savePercentElem.textContent;
      if (shallSuppressOfferEyebrowText(response.savePer, offerTextContent, isPremiumCard,
        false, response.offerId)) {
        savePercentElem.remove();
      } else {
        savePercentElem.innerHTML = savePercentElem.innerHTML.replace(`{{${SAVE_PERCENTAGE}}}`, response.savePer);
        pricingCardPercentageEyeBrowTextReplaced = true;
      }
    }

    if (specialPromo && !specialPromoPercentageEyeBrowTextReplaced && specialPromo.textContent.includes(`{{${SAVE_PERCENTAGE}}}`)) {
      const offerTextContent = specialPromo.textContent;

      const shouldSuppress = shallSuppressOfferEyebrowText(
        response.savePer,
        offerTextContent,
        isPremiumCard,
        true,
        response.offerId,
      );
      if (shouldSuppress) {
        suppressOfferEyebrow(specialPromo);
      } else {
        specialPromo.innerHTML = specialPromo.innerHTML.replace(`{{${SAVE_PERCENTAGE}}}`, response.savePer);
        specialPromoPercentageEyeBrowTextReplaced = true;
      }
    }
  });

  priceParent?.remove();
  return priceRow;
}

function createPricingSection(placeholders, pricingArea, ctaGroup, specialPromo ) {
  const pricingSection = createTag('div', { class: 'pricing-section' });
  pricingArea.classList.add('pricing-area');
  const offer = pricingArea.querySelector(':scope > p > em');
  if (offer) {
    offer.classList.add('card-offer');
  }
  const pricingBtnContainer = pricingArea.querySelector('.button-container');
  if (pricingBtnContainer != null) {
    const pricingSuffixTextElem = pricingBtnContainer.nextElementSibling;
    const placeholderArr = pricingSuffixTextElem.textContent?.split(' ');
    const priceRow = handlePrice(placeholders, pricingArea,
      placeholderArr, specialPromo );
    if (priceRow) {
      pricingArea.prepend(priceRow);
      pricingBtnContainer?.remove();
      pricingSuffixTextElem?.remove();
    }
  }
  ctaGroup.classList.add('card-cta-group');
  ctaGroup.querySelectorAll('a').forEach((a, i) => {
    a.classList.add('large');
    if (i === 1) a.classList.add('secondary');
    if (a.parentNode.tagName.toLowerCase() === 'strong') {
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

  // Pattern to find {{...}}
  const pattern = /(?<=\{\{).*?(?=\}\})/g;
  const matches = Array.from(inputString.trim().matchAll(pattern));

  if (matches.length > 0) {
    let [promoType] = matches[matches.length - 1];
    const specialPromo = createTag('div');
    [specialPromo.textContent] = inputString.split(`{{${promoType}}}`);
    promoType = promoType.trim();
    card.classList.add(promoType);
    card.append(specialPromo);
    return specialPromo;
  }
  return null;
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
    const headCount = h2.innerText.match(extractHeadCountExp)[0].replace(')', '').replace('(', '');
    [h2.innerText] = h2.innerText.split(extractHeadCountExp);
    headCntDiv.textContent = headCount;
    headCntDiv.prepend(createTag('img', { src: '/express/icons/head-count.svg', alt: 'icon-head-count' }));
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
// Subscribes to the block mediator in order to receive price updates
// for each plan specified by authors
function subscribeToBlockMediator(mPricingSection, yPricingSection) {
  function reactToPlanChange({ newValue }) {
    [mPricingSection, yPricingSection].forEach((section) => {
      if (section.classList.contains(plans[newValue])) {
        section.classList.remove('hide');
      } else {
        section.classList.add('hide');
      }
    });
  }
  reactToPlanChange({ newValue: BlockMediator.get(BILLING_PLAN) ?? 0 });
  BlockMediator.subscribe(BILLING_PLAN, reactToPlanChange);
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
function decorateCard({
  header,
  borderParams,
  explain,
  mPricingRow,
  mCtaGroup,
  yPricingRow,
  yCtaGroup,
  featureList,
  compare,
}, el, placeholders) {
  const card = createTag('div', { class: 'card' });
  const cardBorder = createTag('div', { class: 'card-border' });

  const { specialPromo, cardWrapper } =  decorateHeader(header, borderParams, card, cardBorder);

  decorateBasicTextSection(explain, 'card-explain', card);
  const mPricingSection = createPricingSection(placeholders, mPricingRow, mCtaGroup,
    specialPromo);
  mPricingSection.classList.add('monthly');
  const yPricingSection = createPricingSection(placeholders, yPricingRow, yCtaGroup, null);
  yPricingSection.classList.add('yearly', 'hide');
  card.append(mPricingSection, yPricingSection);
  subscribeToBlockMediator(mPricingSection, yPricingSection);
  decorateBasicTextSection(featureList, 'card-feature-list', card);
  decorateCompareSection(compare, el, card);
  return cardWrapper;
}

export default async function init(el) {
  console.log('------------')
  addTempWrapperDeprecated(el, 'pricing-cards');
  // For backwards compatability with old versions of the pricing card 
  const currentKeys = [...blockKeys];
  const divs = currentKeys.map((_, index) => el.querySelectorAll(`:scope > div:nth-child(${index + 1}) > div`));

  const cards = Array.from(divs[0]).map((_, index) => currentKeys.reduce((obj, key, keyIndex) => {
    obj[key] = divs[keyIndex][index];
    return obj;
  }, {}));
  el.querySelectorAll(':scope > div:not(:last-of-type)').forEach((d) => d.remove());
  const cardsContainer = createTag('div', { class: 'cards-container' });
 
  console.log('------')
  console.log(fetchPlaceholders)
  const placeholders = await fetchPlaceholders();
  cards
    .map((card) => decorateCard(card, el, placeholders))
    .forEach((card) => cardsContainer.append(card));
  const maxMCTACnt = cards.reduce((max, card) => Math.max(max, card.mCtaGroup.querySelectorAll('a').length), 0);
  if (maxMCTACnt > 1) {
    cards.forEach(({ mCtaGroup }) => {
      mCtaGroup.classList.add(`min-height-${maxMCTACnt}`);
    });
  }
  const maxYCTACnt = cards.reduce((max, card) => Math.max(max, card.yCtaGroup.querySelectorAll('a').length), 0);
  if (maxYCTACnt > 1) {
    cards.forEach(({ yCtaGroup }) => {
      yCtaGroup.classList.add(`min-height-${maxYCTACnt}`);
    });
  }
  const phoneNumberTags = [...cardsContainer.querySelectorAll('a')].filter((a) => a.title.includes(SALES_NUMBERS));
  if (phoneNumberTags.length > 0) {
    await formatSalesPhoneNumber(phoneNumberTags, SALES_NUMBERS);
  }
  el.prepend(cardsContainer);
}
