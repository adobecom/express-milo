import { formatDeliveryEstimateDateRange, formatLargeNumberToK } from '../utilities/utility-functions.js';

function createProductTitle(productDetails) {
  const productTitleContainer = document.createElement('div');
  productTitleContainer.className = 'pdpx-product-title-container';
  const productTitle = document.createElement('h1');
  productTitle.className = 'pdpx-product-title';
  productTitle.textContent = productDetails.productTitle;
  productTitleContainer.append(productTitle);
  return productTitleContainer;
}

// CREATE PRODUCT RATINGS LOCKUP
function createStarRatings(productDetails) {
  const starRatingsContainer = document.createElement('div');
  starRatingsContainer.className = 'pdpx-star-ratings-container';
  const starRatings = document.createElement('div');
  starRatings.className = 'pdpx-star-ratings';
  for (let i = 0; i < 5; i += 1) {
    const star = document.createElement('img');
    star.src = '/express/code/icons/star-sharp.svg';
    star.className = 'pdpx-product-info-header-ratings-star';
    starRatings.appendChild(star);
  }
  starRatingsContainer.append(starRatings);
  return starRatingsContainer;
}

function createRatingsNumber(productDetails) {
  const ratingsNumberText = Math.round(productDetails.averageRating * 10) / 10;
  const ratingsNumberContainer = document.createElement('div');
  ratingsNumberContainer.className = 'pdpx-ratings-number-container';
  const ratingsNumber = document.createElement('p');
  ratingsNumber.className = 'pdpx-ratings-number';
  ratingsNumber.textContent = ratingsNumberText;
  ratingsNumberContainer.append(ratingsNumber);
  return ratingsNumberContainer;
}

function createRatingsAmount(productDetails) {
  const ratingsAmountText = formatLargeNumberToK(productDetails.totaltReviews);
  const ratingsAmountContainer = document.createElement('div');
  ratingsAmountContainer.className = 'pdpx-ratings-amount-container';
  const ratingsAmount = document.createElement('a');
  ratingsAmount.href = '#';
  ratingsAmount.textContent = ratingsAmountText;
  ratingsAmount.className = 'pdpx-ratings-amount';
  ratingsAmountContainer.append(ratingsAmount);
  return ratingsAmountContainer;
}

function createProductRatingsLockup(productDetails) {
  const productRatingsLockupContainer = document.createElement('div');
  productRatingsLockupContainer.className = 'pdpx-product-ratings-lockup-container';
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

// CREATE PRODUCT PRICE LOCKUP
function createPrice(productDetails) {
  const priceContainer = document.createElement('div');
  priceContainer.className = 'pdpx-price-container';
  const priceText = document.createElement('p');
  priceText.className = 'pdpx-price-label';
  priceText.textContent = `US$${productDetails.price}`;
  priceContainer.appendChild(priceText);
  return priceContainer;
}

function createComparePrice(productDetails) {
  const comparePriceContainer = document.createElement('div');
  comparePriceContainer.className = 'pdpx-compare-price-container';
  const comparePriceLabel = document.createElement('p');
  comparePriceLabel.className = 'pdpx-compare-price-label';
  comparePriceLabel.textContent = 'US$25.95';
  comparePriceContainer.appendChild(comparePriceLabel);
  return comparePriceContainer;
}

function createComparePriceInfoContainer(productDetails) {
  const comparePriceInfoContainer = document.createElement('div');
  comparePriceInfoContainer.className = 'pdpx-price-info-row';
  const comparePriceInfoLabel = document.createElement('p');
  comparePriceInfoLabel.className = 'pdpx-compare-price-info-label';
  comparePriceInfoLabel.textContent = 'Comp. value';
  comparePriceInfoContainer.appendChild(comparePriceInfoLabel);
  const comparePriceInfoIcon = document.createElement('img');
  comparePriceInfoIcon.className = 'pdpx-compare-price-info-icon';
  comparePriceInfoIcon.src = '/express/code/icons/info.svg';
  comparePriceInfoContainer.appendChild(comparePriceInfoIcon);
  return comparePriceInfoContainer;
}

function createSavingsText(productDetails) {
  const savingsText = document.createElement('p');
  savingsText.className = 'pdpx-savings-text';
  savingsText.textContent = 'You save 25%';
  return savingsText;
}

function createPriceInfoContainer(productDetails) {
  const priceInfoContainer = document.createElement('div');
  priceInfoContainer.className = 'pdpx-price-info-container';
  const priceInfoRow = document.createElement('div');
  priceInfoRow.className = 'pdpx-price-info-row';
  const priceContainer = createPrice(productDetails);
  priceInfoRow.appendChild(priceContainer);
  const comparePrice = createComparePrice(productDetails);
  priceInfoRow.appendChild(comparePrice);
  const comparePriceInfoContainer = createComparePriceInfoContainer(productDetails);
  priceInfoRow.appendChild(comparePriceInfoContainer);
  priceInfoContainer.appendChild(priceInfoRow);
  const savingsText = createSavingsText(productDetails);
  priceInfoContainer.appendChild(savingsText);
  return priceInfoContainer;
}

// CREATE DELIVERY ESTIMATE PILL
export function createDeliveryEstimatePill(productDetails) {
  const deliveryEstimateDateRange = formatDeliveryEstimateDateRange(productDetails.deliveryEstimateMinDate, productDetails.deliveryEstimateMaxDate);
  const deliveryEstimatePillContainer = document.createElement('div');
  deliveryEstimatePillContainer.className = 'pdpx-delivery-estimate-pill';
  const deliveryEstimatePillIcon = document.createElement('img');
  deliveryEstimatePillIcon.src = '/express/code/icons/delivery-truck.svg';
  const deliveryEstimatePillText = document.createElement('span');
  deliveryEstimatePillText.innerHTML = `${productDetails.deliveryEstimateStringText} `;
  const deliveryEstimatePillDate = document.createElement('span');
  deliveryEstimatePillDate.innerHTML = deliveryEstimateDateRange;
  deliveryEstimatePillContainer.appendChild(deliveryEstimatePillIcon);
  deliveryEstimatePillContainer.appendChild(deliveryEstimatePillText);
  deliveryEstimatePillContainer.appendChild(deliveryEstimatePillDate);
  return deliveryEstimatePillContainer;
}

export default function createProductInfoHeadingSection(productDetails) {
  const productInfoHeadingSectionContainer = document.createElement('div');
  productInfoHeadingSectionContainer.className = 'pdpx-product-info-heading-section-container';
  const productTitleAndRatingsContainer = createProductTitleAndRatingsContainer(productDetails);
  productInfoHeadingSectionContainer.append(productTitleAndRatingsContainer);
  const priceInfoContainer = createPriceInfoContainer(productDetails);
  productInfoHeadingSectionContainer.append(priceInfoContainer);
  return productInfoHeadingSectionContainer;
}
