/**
 * Video Lazy Loading Utility
 * Implements AEM Three-Phase Loading Strategy for video elements
 * 
 * Phase E (Eager): First section video only - preload="metadata" for quick poster display
 * Phase L (Lazy): Below-fold videos - preload="none" with IntersectionObserver
 * 
 * Based on: .cursor/rules/lazy-loading-implementation.mdc
 * Based on: .cursor/rules/resource-loading-strategy.mdc
 */

/**
 * Check if element is in the first section (Phase E)
 * @param {HTMLElement} element - Element to check
 * @returns {boolean}
 */
function isInFirstSection(element) {
  const firstSection = document.querySelector('.section');
  return element.closest('.section') === firstSection;
}

/**
 * Optimize video loading based on position (Phase E or Phase L)
 * @param {HTMLVideoElement} video - Video element to optimize
 */
export function optimizeVideoLoading(video) {
  if (!video || video.tagName !== 'VIDEO') return;
  
  const inFirstSection = isInFirstSection(video);
  
  if (inFirstSection) {
    // Phase E: First section video - load metadata only for poster/first frame
    // This allows quick visual display without loading the entire video
    video.setAttribute('preload', 'metadata');
    video.setAttribute('loading', 'eager');
    
    // Optional: Add poster if not present
    if (!video.hasAttribute('poster') && video.querySelector('source')) {
      const videoSrc = video.querySelector('source').src;
      // AEM can generate poster from video URL
      const posterUrl = videoSrc.replace(/\.(mp4|webm)$/i, '.jpg') + '?format=webp&width=1200&quality=85';
      video.setAttribute('poster', posterUrl);
    }
  } else {
    // Phase L: Below-fold video - don't load anything until near viewport
    video.setAttribute('preload', 'none');
    video.setAttribute('loading', 'lazy');
    
    // Use IntersectionObserver to start loading when video approaches viewport
    // Using 300px rootMargin as per AEM guidelines
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Start loading video metadata when it gets close
          video.setAttribute('preload', 'metadata');
          observer.disconnect();
        }
      });
    }, {
      rootMargin: '300px 0px', // Start loading 300px before entering viewport
      threshold: 0,
    });
    
    observer.observe(video);
  }
}

/**
 * Apply video optimization to all videos in a container
 * @param {HTMLElement} container - Container element (defaults to document)
 */
export function optimizeAllVideos(container = document) {
  const videos = container.querySelectorAll('video');
  videos.forEach(video => optimizeVideoLoading(video));
}

/**
 * Initialize video lazy loading on page load
 * Called automatically when module is imported
 */
export function initVideoLazyLoading() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeAllVideos();
    });
  } else {
    optimizeAllVideos();
  }
  
  // Watch for dynamically added videos (e.g., from carousel navigation)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          // Check if node is a video
          if (node.tagName === 'VIDEO') {
            optimizeVideoLoading(node);
          }
          // Check if node contains videos
          if (node.querySelectorAll) {
            const videos = node.querySelectorAll('video');
            videos.forEach(video => optimizeVideoLoading(video));
          }
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

