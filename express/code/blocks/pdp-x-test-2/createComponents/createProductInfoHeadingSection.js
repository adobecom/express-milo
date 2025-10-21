import { getLibs } from '../../../scripts/utils.js';
import { formatDeliveryEstimateDateRange, formatLargeNumberToK, formatPriceZazzle } from '../utilities/utility-functions.js';

let createTag;

function createProductTitle(productDetails) {
  const productTitleContainer = createTag('div', { class: 'pdpx-product-title-container' });
  const productTitle = createTag('h1', { class: 'pdpx-product-title' }, productDetails.productTitle);
  productTitleContainer.appendChild(productTitle);
  return productTitleContainer;
}

function createStarRatings(productDetails) {
  const starRatingsContainer = createTag('div', { class: 'pdpx-star-ratings-container' });
  const starRatings = createTag('div', { class: 'pdpx-star-ratings' });
  for (let i = 0; i < 5; i += 1) {
    const star = createTag('img', { class: 'pdpx-product-info-header-ratings-star', src: '/express/code/icons/star-sharp.svg' });
    starRatings.appendChild(star);
  }
  starRatingsContainer.appendChild(starRatings);
  return starRatingsContainer;
}

function createRatingsNumber(productDetails) {
  const ratingsNumberText = Math.round(productDetails.averageRating * 10) / 10;
  const ratingsNumberContainer = createTag('div', { class: 'pdpx-ratings-number-container' });
  const ratingsNumber = createTag('span', { class: 'pdpx-ratings-number' }, ratingsNumberText);
  ratingsNumberContainer.appendChild(ratingsNumber);
  return ratingsNumberContainer;
}

function createRatingsAmount(productDetails) {
  const ratingsAmountText = formatLargeNumberToK(productDetails.totalReviews);
  const ratingsAmountContainer = createTag('div', { class: 'pdpx-ratings-amount-container' });
  ratingsAmountContainer.className = 'pdpx-ratings-amount-container';
  const ratingsAmount = createTag('a', { class: 'pdpx-ratings-amount', href: '#' }, ratingsAmountText);
  ratingsAmountContainer.appendChild(ratingsAmount);
  return ratingsAmountContainer;
}

function createProductRatingsLockup(productDetails) {
  const productRatingsLockupContainer = createTag('div', { class: 'pdpx-product-ratings-lockup-container' });
  const starRatings = createStarRatings(productDetails);
  const ratingsNumber = createRatingsNumber(productDetails);
  const ratingsAmount = createRatingsAmount(productDetails);
  productRatingsLockupContainer.append(starRatings);
  productRatingsLockupContainer.append(ratingsNumber);
  productRatingsLockupContainer.append(ratingsAmount);
  return productRatingsLockupContainer;
}

function createProductTitleAndRatingsContainer(productDetails) {
  const productTitleAndRatingsContainer = document.createElement('div');
  productTitleAndRatingsContainer.className = 'pdpx-title-and-ratings-container';
  const productTitle = createProductTitle(productDetails);
  const productRatingsLockup = createProductRatingsLockup(productDetails);
  productTitleAndRatingsContainer.append(productTitle);
  productTitleAndRatingsContainer.append(productRatingsLockup);
  return productTitleAndRatingsContainer;
}

function createPriceLockup(productDetails) {
  const priceInfoContainer = createTag('div', { class: 'pdpx-price-info-container' });
  const priceInfoRow = createTag('div', { class: 'pdpx-price-info-row' });
  const priceContainer = createTag('span', { class: 'pdpx-price-label', id: 'pdpx-price-label' }, formatPriceZazzle(productDetails.productPrice));
  priceInfoRow.appendChild(priceContainer);
  const comparePrice = createTag('span', { class: 'pdpx-compare-price-label', id: 'pdpx-compare-price-label' }, formatPriceZazzle(productDetails.strikethroughPrice));
  priceInfoRow.appendChild(comparePrice);
  const comparePriceInfoLabel = createTag('span', { class: 'pdpx-compare-price-info-label' }, 'Comp. value');
  const comparePriceInfoIcon = createTag('img', { class: 'pdpx-compare-price-info-icon', src: '/express/code/icons/info.svg' });
  priceInfoRow.appendChild(comparePriceInfoLabel);
  priceInfoRow.appendChild(comparePriceInfoIcon);
  priceInfoContainer.appendChild(priceInfoRow);
  const savingsText = createTag('span', { class: 'pdpx-savings-text', id: 'pdpx-savings-text' }, productDetails.discountString);
  priceInfoContainer.appendChild(savingsText);
  return priceInfoContainer;
}

export function createDeliveryEstimatePill(productDetails) {
  const deliveryEstimateDateRange = formatDeliveryEstimateDateRange(productDetails.deliveryEstimateMinDate, productDetails.deliveryEstimateMaxDate);
  const deliveryEstimatePillContainer = createTag('div', { class: 'pdpx-delivery-estimate-pill' });
  const deliveryEstimatePillIcon = createTag('img', { class: 'pdpx-delivery-estimate-pill-icon', src: '/express/code/icons/delivery-truck.svg' });
  const deliveryEstimatePillText = createTag('span', { class: 'pdpx-delivery-estimate-pill-text' }, productDetails.deliveryEstimateStringText);
  const deliveryEstimatePillDate = createTag('span', { class: 'pdpx-delivery-estimate-pill-date', id: 'pdpx-delivery-estimate-pill-date' }, deliveryEstimateDateRange);
  deliveryEstimatePillContainer.appendChild(deliveryEstimatePillIcon);
  deliveryEstimatePillContainer.appendChild(deliveryEstimatePillText);
  deliveryEstimatePillContainer.appendChild(deliveryEstimatePillDate);
  return deliveryEstimatePillContainer;
}

export default async function createProductInfoHeadingSection(productDetails) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const productInfoHeadingSectionWrapper = createTag('div', { class: 'pdpx-product-info-heading-section-wrapper' });
  const productInfoHeadingSectionContainer = createTag('div', { class: 'pdpx-product-info-heading-section-container' });
  const productTitleAndRatingsContainer = createProductTitleAndRatingsContainer(productDetails);
  productInfoHeadingSectionContainer.append(productTitleAndRatingsContainer);
  const priceInfoContainer = createPriceLockup(productDetails);
  productInfoHeadingSectionContainer.append(priceInfoContainer);
  productInfoHeadingSectionWrapper.appendChild(productInfoHeadingSectionContainer);
  const deliveryEstimatePill = createDeliveryEstimatePill(productDetails);
  productInfoHeadingSectionWrapper.appendChild(deliveryEstimatePill);
  return productInfoHeadingSectionWrapper;
}
