import { h } from 'https://esm.sh/preact@10';
import htm from 'https://esm.sh/htm@3';

const html = htm.bind(h);

/**
 * Update max_dim parameter in URL to desired resolution
 */
function updateImageUrl(url, maxDim = 644) {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('max_dim', String(maxDim));
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Product images component displaying hero image and thumbnail carousel
 * @param {Object} props
 * @param {Object} props.state - PDP state from SDK
 * @param {Object} props.store - Zazzle PDP store instance
 */
export function ProductImages({ state, store }) {
  const { realviews, selectedRealview } = state;
  
  const handleThumbnailClick = (realview) => {
    if (store && realview.id !== selectedRealview.id) {
      store.selectRealview(realview.id);
    }
  };
  
  const heroImageUrl = updateImageUrl(selectedRealview.url, 644);
  
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
      ${realviews && realviews.length > 0 && html`
        <div class="pdpx-image-thumbnail-carousel-container" id="pdpx-image-thumbnail-carousel-container">
          ${realviews.map((realview) => {
            const thumbnailUrl = updateImageUrl(realview.url, 76);
            const isSelected = realview.id === selectedRealview.id;
            
            return html`
              <button 
                class="pdpx-image-thumbnail-carousel-item ${isSelected ? 'selected' : ''}"
                data-image-type="${realview.id}"
                onClick=${() => handleThumbnailClick(realview)}
                type="button"
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
