/**
 * Video Performance Monitoring Utility
 * Enable with ?video-perf=true parameter
 *
 * Features:
 * - Tracks video loading strategies (eager vs lazy)
 * - Monitors Core Web Vitals (LCP, FCP, CLS, FID)
 * - Reports bandwidth savings
 * - Timeline of video loads
 *
 * Usage:
 *   import { trackVideoPerformance } from './video-performance-monitor.js';
 *   trackVideoPerformance(videoElement, 'metadata', containerElement);
 */

const PERF_MONITOR_ENABLED = new URLSearchParams(window.location.search).has('video-perf');

const perfStats = {
  videosCreated: 0,
  videosEagerLoaded: 0,
  videosLazyLoaded: 0,
  videosDeferredAutoplay: 0,
  videosInHiddenContainers: 0,
  videoLoadEvents: [],
  coreWebVitals: {},
};

// Cache first section lookup (won't change after page load)
let cachedFirstSection;

/**
 * Check if element is in a hidden container (drawer, accordion, tab, etc.)
 * @param {HTMLElement} element - Element to check
 * @returns {boolean}
 */
function isElementHidden(element) {
  return !!(
    element.classList.contains('drawer')
    || element.classList.contains('hide')
    || element.closest('[aria-hidden="true"]')
    || element.closest('.drawer')
    || element.closest('.hide')
    || element.closest('[style*="display: none"]')
    || element.closest('[style*="display:none"]')
  );
}

/**
 * Check if element is in the first section (Phase E)
 * @param {HTMLElement} element - Element to check
 * @returns {boolean}
 */
function isInFirstSection(element) {
  if (!cachedFirstSection) {
    cachedFirstSection = document.querySelector('.section');
  }
  return element.closest('.section') === cachedFirstSection;
}

/**
 * Initialize Core Web Vitals observers
 */
function initCoreWebVitalsObservers() {
  if (!PERF_MONITOR_ENABLED) return;

  // Observe LCP (Largest Contentful Paint)
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      perfStats.coreWebVitals.LCP = Math.round(lastEntry.startTime);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    // LCP not supported
  }

  // Observe CLS (Cumulative Layout Shift)
  try {
    let clsScore = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
          perfStats.coreWebVitals.CLS = clsScore.toFixed(3);
        }
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    // CLS not supported
  }

  // Observe FID (First Input Delay)
  try {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.processingStart) {
          const inputDelay = entry.processingStart - entry.startTime;
          if (!perfStats.coreWebVitals.FID || inputDelay < perfStats.coreWebVitals.FID) {
            perfStats.coreWebVitals.FID = Math.round(inputDelay);
          }
        }
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    // FID not supported
  }
}

/**
 * Collect Core Web Vitals metrics (timing data)
 */
function collectCoreWebVitals() {
  if (!PERF_MONITOR_ENABLED) return;

  // Get navigation timing
  const navTiming = performance.getEntriesByType('navigation')[0];
  if (navTiming) {
    perfStats.coreWebVitals.TTFB = Math.round(
      navTiming.responseStart - navTiming.requestStart,
    );
    perfStats.coreWebVitals.DOMContentLoaded = Math.round(
      navTiming.domContentLoadedEventEnd - navTiming.fetchStart,
    );
    perfStats.coreWebVitals.LoadComplete = Math.round(
      navTiming.loadEventEnd - navTiming.fetchStart,
    );
  }

  // Get paint timing
  const paintEntries = performance.getEntriesByType('paint');
  paintEntries.forEach((entry) => {
    if (entry.name === 'first-contentful-paint') {
      perfStats.coreWebVitals.FCP = Math.round(entry.startTime);
    }
  });
}

/**
 * Log performance summary to console
 */
function logPerfSummary() {
  if (!PERF_MONITOR_ENABLED) return;

  collectCoreWebVitals();

  /* eslint-disable no-console */
  console.group('🎬 Video Performance Monitoring');

  // Core Web Vitals Table
  console.log('⚡ Core Web Vitals:');
  console.table({
    'TTFB (Time to First Byte)': perfStats.coreWebVitals.TTFB ? `${perfStats.coreWebVitals.TTFB} ms` : 'N/A',
    'FCP (First Contentful Paint)': perfStats.coreWebVitals.FCP ? `${perfStats.coreWebVitals.FCP} ms` : 'N/A',
    'LCP (Largest Contentful Paint)': perfStats.coreWebVitals.LCP ? `${perfStats.coreWebVitals.LCP} ms` : 'N/A',
    'CLS (Cumulative Layout Shift)': perfStats.coreWebVitals.CLS || 'N/A',
    'FID (First Input Delay)': perfStats.coreWebVitals.FID ? `${perfStats.coreWebVitals.FID} ms` : 'N/A',
    'DOM Content Loaded': perfStats.coreWebVitals.DOMContentLoaded ? `${perfStats.coreWebVitals.DOMContentLoaded} ms` : 'N/A',
    'Page Load Complete': perfStats.coreWebVitals.LoadComplete ? `${perfStats.coreWebVitals.LoadComplete} ms` : 'N/A',
  });

  console.log('\n📊 Video Statistics:');
  console.table({
    'Total Videos Created': perfStats.videosCreated,
    'Eager Loaded (preload=metadata)': perfStats.videosEagerLoaded,
    'Lazy Loaded (preload=none)': perfStats.videosLazyLoaded,
    'Deferred Autoplay': perfStats.videosDeferredAutoplay,
    'In Hidden Containers': perfStats.videosInHiddenContainers,
  });

  if (perfStats.videoLoadEvents.length > 0) {
    console.log('\n📹 Video Load Timeline:');
    console.table(perfStats.videoLoadEvents.map((event, i) => ({
      '#': i + 1,
      'Load Time (ms)': Math.round(event.time),
      Strategy: event.strategy,
      Position: event.position,
      Hidden: event.hidden ? 'Yes' : 'No',
      URL: `${event.src.substring(event.src.lastIndexOf('/') + 1, event.src.lastIndexOf('/') + 30)}...`,
    })));
  }

  // Estimate bandwidth saved
  const estimatedSizePerVideo = 1.0; // MB average
  const bandwidthSaved = perfStats.videosLazyLoaded * estimatedSizePerVideo;

  console.log(`\n💰 Estimated Bandwidth Saved: ~${bandwidthSaved.toFixed(1)} MB`);
  console.log('   (Videos with preload="none" won\'t load until needed)');

  console.log('\n💡 Tip: Open Network tab to see actual bandwidth usage');
  console.groupEnd();
  /* eslint-enable no-console */
}

/**
 * Track video load performance
 * @param {HTMLVideoElement} video - Video element
 * @param {string} strategy - Load strategy used ('metadata' or 'none')
 * @param {HTMLElement} container - Container element
 */
export function trackVideoPerformance(video, strategy, container) {
  if (!PERF_MONITOR_ENABLED) return;

  perfStats.videosCreated += 1;

  if (strategy === 'metadata') perfStats.videosEagerLoaded += 1;
  if (strategy === 'none') perfStats.videosLazyLoaded += 1;

  // Track when video actually starts loading
  video.addEventListener('loadstart', () => {
    perfStats.videoLoadEvents.push({
      src: video.querySelector('source')?.src || video.src,
      time: performance.now(),
      strategy,
      position: isInFirstSection(container) ? 'above-fold' : 'below-fold',
      hidden: isElementHidden(container),
    });
  }, { once: true });

  // Log summary when page is idle
  if (perfStats.videosCreated === 1) {
    setTimeout(() => logPerfSummary(), 5000);
  }
}

/**
 * Track deferred autoplay videos
 */
export function trackDeferredAutoplay() {
  if (!PERF_MONITOR_ENABLED) return;
  perfStats.videosDeferredAutoplay += 1;
}

/**
 * Track videos in hidden containers
 */
export function trackHiddenVideo() {
  if (!PERF_MONITOR_ENABLED) return;
  perfStats.videosInHiddenContainers += 1;
}

/**
 * Get current performance stats
 * @returns {object} Performance statistics
 */
export function getPerformanceStats() {
  return { ...perfStats };
}

// Initialize observers immediately if monitoring is enabled
initCoreWebVitalsObservers();

// Export for external access
if (PERF_MONITOR_ENABLED) {
  window.videoPerformanceMonitor = {
    getStats: getPerformanceStats,
    logSummary: logPerfSummary,
  };
}
