import { html as htmlFn } from '../vendor/htm-preact.js';
import { useStore } from './store-context.js';

const html = htmlFn;

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
  const snapshot = state.value;

  if (!snapshot || !snapshot.selectedRealview) {
    return null;
  }

  const { realviews = [], selectedRealview } = snapshot;
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

