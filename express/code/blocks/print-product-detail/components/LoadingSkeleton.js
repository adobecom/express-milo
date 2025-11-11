import { html } from '../vendor/htm-preact.js';

export function LoadingSkeleton() {
  return html`
    <div class="pdpx-global-container">
      <div class="pdpx-product-images-container">
        <div class="pdpx-product-hero-image-container" data-skeleton="true" style="height: 400px;"></div>
      </div>
      <div class="pdpx-product-info-section-wrapper-container">
        <div class="pdpx-product-info-heading-section-container">
          <h1 class="pdpx-product-title" data-skeleton="true" style="height: 32px; width: 60%;"></h1>
          <div class="pdpx-price-info-container" data-skeleton="true" style="height: 40px; width: 40%; margin-top: 16px;"></div>
        </div>
        <div class="pdpx-product-info-section-wrapper">
          <div class="pdpx-customization-inputs-container" data-skeleton="true" style="height: 300px; margin-top: 24px;"></div>
        </div>
      </div>
    </div>
  `;
}
