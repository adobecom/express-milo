import {
  html,
  useEffect,
  useRef,
  useState,
} from '../../../scripts/vendors/htm-preact.js';
import { useStore } from './Contexts.js';
import axAccordionDecorate from '../../ax-accordion/ax-accordion.js';
import { formatLargeNumberToK } from '../utilities/utility-functions.js';

function mapToAccordionFormat(descriptions) {
  if (!descriptions || !Array.isArray(descriptions)) {
    return [];
  }
  return descriptions.map((item) => ({
    title: item.attributeTitle,
    content: item.descriptionHTML,
  }));
}

export function ProductDetails() {
  const { state } = useStore();
  const accordionRef = useRef(null);
  const previousDescriptionsRef = useRef(null);

  useEffect(() => {
    if (!state || !accordionRef.current) {
      return;
    }

    const descriptions = state.descriptionComponents;
    if (!descriptions) {
      return;
    }

    const accordionData = mapToAccordionFormat(descriptions);

    if (!accordionRef.current.accordionData) {
      accordionRef.current.accordionData = accordionData;
      axAccordionDecorate(accordionRef.current);
    } else {
      const previousDescriptions = previousDescriptionsRef.current;
      if (previousDescriptions !== descriptions && accordionRef.current.updateAccordion) {
        let forceExpandTitle = null;
        if (previousDescriptions && Array.isArray(previousDescriptions)) {
          const prevTitles = previousDescriptions.map((entry) => entry.attributeTitle);
          const currentTitles = descriptions.map((entry) => entry.attributeTitle);
          const changedIndex = currentTitles
            .findIndex((title, index) => prevTitles[index] !== title);
          if (changedIndex >= 0) {
            forceExpandTitle = descriptions[changedIndex].attributeTitle;
          }
        }
        accordionRef.current.updateAccordion(accordionData, forceExpandTitle);
      }
    }

    previousDescriptionsRef.current = descriptions;
  }, [state]);

  if (!state) {
    return null;
  }

  return html`
    <div class="pdpx-product-details-section">
      <div class="pdpx-product-details-section-title-container">
        <span class="pdpx-product-details-section-title">Product Details</span>
      </div>
      <div ref=${accordionRef} class="ax-accordion pdpx-product-details-accordion"></div>
    </div>
  `;
}

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

function updateImageUrl(url, maxDim = 644) {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('max_dim', String(maxDim));
    return urlObj.toString();
  } catch {
    return url;
  }
}

export function ProductImages() {
  const { state, actions } = useStore();

  if (!state || !state.selectedRealview) {
    return null;
  }

  const { realviews = [], selectedRealview } = state;
  const heroImageUrl = updateImageUrl(selectedRealview.url, 644);

  const handleThumbnailClick = (realview) => {
    if (realview.id !== selectedRealview.id) {
      actions.selectRealview(realview.id);
    }
  };

  return html`
    <div class="pdpx-product-images-container" id="pdpx-product-images-container">
      <div class="pdpx-product-hero-image-container">
        <img
          class="pdpx-product-hero-image"
          id="pdpx-product-hero-image"
          src="${heroImageUrl}"
          alt="${selectedRealview.title}"
          fetchpriority="high"
          decoding="async"
          loading="eager"
          data-image-type="${selectedRealview.id}"
        />
      </div>
      ${realviews.length > 0 && html`
        <div class="pdpx-image-thumbnail-carousel-container" id="pdpx-image-thumbnail-carousel-container">
          ${realviews.map((realview) => {
            const thumbnailUrl = updateImageUrl(realview.url, 76);
            const isSelected = realview.id === selectedRealview.id;
            return html`
              <button
                key="${realview.id}"
                class="pdpx-image-thumbnail-carousel-item ${isSelected ? 'selected' : ''}"
                type="button"
                data-image-type="${realview.id}"
                onClick=${() => handleThumbnailClick(realview)}
              >
                <img
                  class="pdpx-image-thumbnail-carousel-item-image"
                  src="${thumbnailUrl}"
                  alt="${realview.title}"
                  data-image-type="${realview.id}"
                />
              </button>
            `;
          })}
        </div>
      `}
    </div>
  `;
}

const TASK_ID_MAP = {
  zazzle_shirt: 'tshirt',
  zazzle_businesscard: 'businesscard',
};

function buildCheckoutUrl(templateId, expressProductSettings, productType) {
  const taskId = TASK_ID_MAP[productType] || '';
  const baseUrl = `https://new.express.adobe.com/design/template/${templateId}`;
  const params = new URLSearchParams({
    productSettings: expressProductSettings,
    category: 'templates',
    taskId,
    loadPrintAddon: 'true',
    print: 'true',
    action: 'pdp-cta',
    source: 'a.com-print-and-deliver-seo',
    mv: 'other',
    url: 'express/print',
  });
  return `${baseUrl}?${params.toString()}`;
}

export function CheckoutButton({ templateId }) {
  const { state } = useStore();

  const checkoutUrl = state?.expressProductSettings
    ? buildCheckoutUrl(templateId, state.expressProductSettings, state.productType)
    : '#';

  return html`
    <div class="pdpx-checkout-button-container">
      <a
        class="pdpx-checkout-button"
        id="pdpx-checkout-button"
        href="${checkoutUrl}"
      >
        <img class="pdpx-checkout-button-icon" src="/express/code/icons/print-icon.svg" alt="print" />
        <span class="pdpx-checkout-button-text">Customize and print it</span>
      </a>
      <div class="pdpx-checkout-button-subhead">
        <img class="pdpx-checkout-button-subhead-image" src="/express/code/icons/powered-by-zazzle.svg" alt="powered by zazzle" />
        <a class="pdpx-checkout-button-subhead-link" href="https://www.zazzle.com/returns">Returns guaranteed</a>
        <span class="pdpx-checkout-button-subhead-text">through 100% satisfaction promise.</span>
      </div>
    </div>
  `;
}
