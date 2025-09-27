/**
 * Performance monitoring for Adobe Express homepage
 * Tracks Core Web Vitals and video loading performance
 */

// Core Web Vitals monitoring - Performance optimized
function initPerformanceMonitoring() {
  // Only run in production
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('hlx.page')) {
    return;
  }

  // Performance optimization: Use requestIdleCallback for non-critical monitoring
  const scheduleMonitoring = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        import('https://unpkg.com/web-vitals@3/dist/web-vitals.attribution.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          // Track Core Web Vitals
          getCLS(sendToAnalytics);
          getFID(sendToAnalytics);
          getFCP(sendToAnalytics);
          getLCP(sendToAnalytics);
          getTTFB(sendToAnalytics);
        });
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        import('https://unpkg.com/web-vitals@3/dist/web-vitals.attribution.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS(sendToAnalytics);
          getFID(sendToAnalytics);
          getFCP(sendToAnalytics);
          getLCP(sendToAnalytics);
          getTTFB(sendToAnalytics);
        });
      }, 1000);
    }
  };

  scheduleMonitoring();

  // Track video loading performance
  trackVideoPerformance();
}

function sendToAnalytics(metric) {
  // Send to Adobe Analytics
  if (window.adobeAnalytics && window.adobeAnalytics.track) {
    window.adobeAnalytics.track('web-vitals', {
      name: metric.name,
      value: Math.round(metric.value),
      delta: Math.round(metric.delta),
      id: metric.id,
      url: window.location.href,
      timestamp: Date.now(),
    });
  }

  // Also send to console for debugging
  console.log('Performance Metric:', {
    name: metric.name,
    value: Math.round(metric.value),
    rating: metric.rating,
  });
}

function trackVideoPerformance() {
  // Track video loading performance
  const videos = document.querySelectorAll('video');
  
  videos.forEach((video, index) => {
    const startTime = performance.now();
    
    video.addEventListener('loadstart', () => {
      console.log(`Video ${index + 1}: Load started`);
    });
    
    video.addEventListener('loadedmetadata', () => {
      const loadTime = performance.now() - startTime;
      console.log(`Video ${index + 1}: Metadata loaded in ${Math.round(loadTime)}ms`);
      
      // Send to analytics
      if (window.adobeAnalytics && window.adobeAnalytics.track) {
        window.adobeAnalytics.track('video-performance', {
          videoIndex: index + 1,
          loadTime: Math.round(loadTime),
          videoSrc: video.src || video.querySelector('source')?.src,
        });
      }
    });
    
    video.addEventListener('canplay', () => {
      const loadTime = performance.now() - startTime;
      console.log(`Video ${index + 1}: Can play in ${Math.round(loadTime)}ms`);
    });
    
    video.addEventListener('error', (e) => {
      console.error(`Video ${index + 1}: Load error`, e);
      
      // Send error to analytics
      if (window.adobeAnalytics && window.adobeAnalytics.track) {
        window.adobeAnalytics.track('video-error', {
          videoIndex: index + 1,
          error: e.type,
          videoSrc: video.src || video.querySelector('source')?.src,
        });
      }
    });
  });
}

// Track intersection observer performance
function trackIntersectionObserverPerformance() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        if (element.tagName === 'VIDEO') {
          console.log('Video entered viewport:', element.src || element.querySelector('source')?.src);
          
          // Track viewport entry time
          if (window.adobeAnalytics && window.adobeAnalytics.track) {
            window.adobeAnalytics.track('video-viewport-entry', {
              videoSrc: element.src || element.querySelector('source')?.src,
              timestamp: Date.now(),
            });
          }
        }
      }
    });
  }, { rootMargin: '100px' });

  // Observe all videos
  document.querySelectorAll('video').forEach((video) => {
    observer.observe(video);
  });
}

// Initialize performance monitoring when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPerformanceMonitoring);
} else {
  initPerformanceMonitoring();
}

// Track intersection observer performance
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', trackIntersectionObserverPerformance);
} else {
  trackIntersectionObserverPerformance();
}

export { initPerformanceMonitoring, trackVideoPerformance };
