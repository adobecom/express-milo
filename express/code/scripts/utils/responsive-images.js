/**
 * Responsive Image Optimization Utility
 * Implements best-practice responsive images with srcset and sizes
 * for optimal performance across all devices and viewports
 */

/**
 * Default responsive breakpoints and sizes
 */
const DEFAULT_BREAKPOINTS = {
  mobile: { width: 400, maxViewport: 600 },
  tablet: { width: 800, maxViewport: 900 },
  desktop: { width: 1200, maxViewport: 1200 },
  large: { width: 1600, maxViewport: null },
};

/**
 * Generate srcset string from base image URL
 * @param {string} baseUrl - Base image URL from AEM
 * @param {number[]} widths - Array of widths for srcset
 * @param {object} options - Additional options (format, quality)
 * @returns {string} - srcset string
 */
export function generateSrcset(baseUrl, widths = [400, 800, 1200, 1600], options = {}) {
  const { format = 'webp', quality = 85 } = options;
  
  return widths.map(width => {
    const url = new URL(baseUrl);
    url.searchParams.set('width', width);
    url.searchParams.set('format', format);
    url.searchParams.set('quality', quality);
    return `${url.toString()} ${width}w`;
  }).join(', ');
}

/**
 * Generate sizes string from breakpoints
 * @param {object} breakpoints - Breakpoint configuration
 * @returns {string} - sizes string
 */
export function generateSizes(breakpoints = DEFAULT_BREAKPOINTS) {
  const sizeEntries = Object.entries(breakpoints)
    .filter(([, config]) => config.maxViewport !== null)
    .map(([, config]) => `(max-width: ${config.maxViewport}px) ${config.width}px`);
  
  // Add default size (largest)
  const largestWidth = Math.max(...Object.values(breakpoints).map(b => b.width));
  sizeEntries.push(`${largestWidth}px`);
  
  return sizeEntries.join(', ');
}

/**
 * Make an image responsive with srcset and sizes
 * @param {HTMLImageElement} img - Image element to optimize
 * @param {object} options - Configuration options
 */
export function makeImageResponsive(img, options = {}) {
  // Skip if already has srcset
  if (img.hasAttribute('srcset')) return;
  
  // Skip if not from AEM
  if (!img.src.includes('.aem.live')) return;
  
  const {
    widths = [400, 800, 1200, 1600],
    breakpoints = DEFAULT_BREAKPOINTS,
    format = 'webp',
    quality = 85,
    eager = false,
  } = options;
  
  // Generate and apply srcset
  const srcset = generateSrcset(img.src, widths, { format, quality });
  img.setAttribute('srcset', srcset);
  
  // Generate and apply sizes
  const sizes = generateSizes(breakpoints);
  img.setAttribute('sizes', sizes);
  
  // Set loading strategy
  img.setAttribute('loading', eager ? 'eager' : 'lazy');
  img.setAttribute('decoding', 'async');
  
  // Optimize main src as fallback
  const fallbackUrl = new URL(img.src);
  fallbackUrl.searchParams.set('width', widths[0]);
  fallbackUrl.searchParams.set('format', format);
  fallbackUrl.searchParams.set('quality', quality);
  img.src = fallbackUrl.toString();
}

/**
 * Apply responsive images to all images in a container
 * @param {HTMLElement} container - Container element
 * @param {object} options - Configuration options
 */
export function optimizeImagesInContainer(container = document, options = {}) {
  const images = container.querySelectorAll('img');
  const firstSection = document.querySelector('.section');
  let firstSectionImageFound = false;
  
  images.forEach((img) => {
    // First image in first section gets eager loading (likely LCP)
    const isInFirstSection = img.closest('.section') === firstSection;
    const eager = isInFirstSection && !firstSectionImageFound;
    
    if (eager) {
      firstSectionImageFound = true;
    }
    
    makeImageResponsive(img, {
      ...options,
      eager,
    });
  });
}

/**
 * Optimize images in a specific block with custom breakpoints
 * Example: Hero images need different sizes than thumbnails
 * @param {HTMLElement} block - Block element
 * @param {string} blockType - Type of block for specific optimization
 */
export function optimizeBlockImages(block, blockType) {
  const customConfigs = {
    'hero-marquee': {
      widths: [800, 1200, 1600, 2000],
      breakpoints: {
        mobile: { width: 800, maxViewport: 600 },
        tablet: { width: 1200, maxViewport: 900 },
        desktop: { width: 1600, maxViewport: 1440 },
        large: { width: 2000, maxViewport: null },
      },
      quality: 90, // Higher quality for hero
      eager: true, // Always eager load hero images
    },
    'template-x': {
      widths: [200, 400, 600],
      breakpoints: {
        mobile: { width: 200, maxViewport: 600 },
        tablet: { width: 400, maxViewport: 900 },
        desktop: { width: 600, maxViewport: null },
      },
      quality: 75, // Lower quality for thumbnails
      eager: false, // Lazy load thumbnails
    },
    'ax-columns': {
      widths: [400, 800, 1200],
      breakpoints: DEFAULT_BREAKPOINTS,
      quality: 85,
      eager: false,
    },
  };
  
  const config = customConfigs[blockType] || {};
  optimizeImagesInContainer(block, config);
}

/**
 * Add picture element with multiple formats (WebP with JPEG fallback)
 * @param {HTMLImageElement} img - Image element
 */
export function enhanceWithPictureElement(img) {
  // Skip if already in a picture element
  if (img.parentElement.tagName === 'PICTURE') return;
  
  const picture = document.createElement('picture');
  
  // WebP source
  const webpSource = document.createElement('source');
  webpSource.type = 'image/webp';
  webpSource.srcset = generateSrcset(img.src, [400, 800, 1200, 1600], { format: 'webp' });
  webpSource.sizes = generateSizes();
  
  // AVIF source (even better compression)
  const avifSource = document.createElement('source');
  avifSource.type = 'image/avif';
  avifSource.srcset = generateSrcset(img.src, [400, 800, 1200, 1600], { format: 'avif' });
  avifSource.sizes = generateSizes();
  
  // Fallback JPEG
  const jpegSrcset = generateSrcset(img.src, [400, 800, 1200, 1600], { format: 'jpeg' });
  img.setAttribute('srcset', jpegSrcset);
  img.setAttribute('sizes', generateSizes());
  
  // Wrap img in picture
  img.parentNode.insertBefore(picture, img);
  picture.appendChild(avifSource);
  picture.appendChild(webpSource);
  picture.appendChild(img);
}

/**
 * Initialize responsive images on page load
 * Call this from scripts.js
 */
export function initResponsiveImages() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeImagesInContainer(document);
    });
  } else {
    optimizeImagesInContainer(document);
  }
  
  // Re-optimize when new blocks are loaded
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.querySelectorAll) {
          optimizeImagesInContainer(node);
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Auto-initialize if loaded as module
if (typeof window !== 'undefined' && document.readyState !== 'complete') {
  window.addEventListener('load', initResponsiveImages);
}

