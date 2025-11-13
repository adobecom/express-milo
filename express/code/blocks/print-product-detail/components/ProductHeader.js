import {
  html,
  useState,
} from '../../../scripts/vendors/htm-preact.js';
import { useStore } from './store-context.js';
import { formatLargeNumberToK } from '../utilities/utility-functions.js';

export function ProductHeader() {
  const { state } = useStore();
  const [tooltipVisible, setTooltipVisible] = useState(false);

  if (!state) {
    return null;
  }

  const { title, pricing, shippingEstimate, reviewsStats } = state;
  const reviewsCount = reviewsStats?.count || 0;
  const reviewsRating = reviewsStats?.rating || 0;
  const formattedRating = reviewsRating ? Math.round(reviewsRating * 10) / 10 : '';
  const formattedCount = reviewsCount ? formatLargeNumberToK(reviewsCount) : '';

  const showTooltip = () => setTooltipVisible(true);
  const hideTooltip = () => setTooltipVisible(false);

  return html`
    <div class="pdpx-product-info-heading-section-wrapper">
      <div class="pdpx-product-info-heading-section-container">
        <div class="pdpx-title-and-ratings-container">
          <div class="pdpx-product-title-container">
            <h1 class="pdpx-product-title" id="pdpx-product-title">${title}</h1>
          </div>
          ${reviewsRating > 0 && html`
            <div class="pdpx-product-ratings-lockup-container">
              <div class="pdpx-star-ratings">
                ${Array.from({ length: 5 }).map(() => html`
                  <img class="pdpx-product-info-header-ratings-star" src="/express/code/icons/star-sharp.svg" alt="star" />
                `)}
              </div>
              <div class="pdpx-ratings-number-container">
                <span class="pdpx-ratings-number" id="pdpx-ratings-number">${formattedRating}</span>
              </div>
              <div class="pdpx-ratings-amount-container">
                <button class="pdpx-ratings-amount" id="pdpx-ratings-amount" type="button">${formattedCount}</button>
              </div>
            </div>
          `}
        </div>
        <div class="pdpx-price-info-container">
          <div class="pdpx-price-info-row">
            <span class="pdpx-price-label" id="pdpx-price-label">${pricing.totalPrice}</span>
            ${pricing.originalTotalPrice !== pricing.totalPrice && html`
              <span class="pdpx-compare-price-label" id="pdpx-compare-price-label">${pricing.originalTotalPrice}</span>
            `}
            ${pricing.showCompValue && html`
              <span class="pdpx-compare-price-info-label">Comp. value</span>
              <div class="pdpx-compare-price-info-icon-container">
                <button
                  class="pdpx-compare-price-info-icon-button"
                  type="button"
                  aria-label="Compare value information"
                  aria-expanded="${tooltipVisible}"
                  onMouseEnter=${showTooltip}
                  onMouseLeave=${hideTooltip}
                  onClick=${showTooltip}
                >
                  <img class="pdpx-compare-price-info-icon" src="/express/code/icons/info.svg" alt="info" />
                </button>
                ${tooltipVisible && html`
                  <div class="pdpx-info-tooltip-content" id="pdpx-info-tooltip-content" role="tooltip" style="display: block;">
                    <h6 class="pdpx-info-tooltip-content-title" id="pdpx-info-tooltip-content-title">Compare Value</h6>
                    <p class="pdpx-info-tooltip-content-description" id="pdpx-info-tooltip-content-description-1">
                      The compare value is the estimated retail value of a similar product purchased elsewhere.
                    </p>
                    <p class="pdpx-info-tooltip-content-description" id="pdpx-info-tooltip-content-description-2">
                      Your price may vary based on the options you select.
                    </p>
                  </div>
                `}
              </div>
            `}
          </div>
          ${pricing.discountLabel && html`
            <span class="pdpx-savings-text" id="pdpx-savings-text">${pricing.discountLabel}</span>
          `}
        </div>
      </div>
      ${shippingEstimate && html`
        <div class="pdpx-delivery-estimate-pill">
          <img class="pdpx-delivery-estimate-pill-icon" src="/express/code/icons/delivery-truck.svg" alt="delivery" />
          <span class="pdpx-delivery-estimate-pill-text" id="pdpx-delivery-estimate-pill-text">Estimated Delivery</span>
          <span class="pdpx-delivery-estimate-pill-date" id="pdpx-delivery-estimate-pill-date">${shippingEstimate}</span>
        </div>
      `}
    </div>
  `;
}
