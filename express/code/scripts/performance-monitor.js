/**
 * Core Web Vitals Performance Monitoring
 * Enable with ?perf-debug=true or ?video-perf=true
 * Tracks LCP, FCP, CLS, FID, TTFB and other key metrics
 */

// ============================================================================
// PERFORMANCE MONITORING (Enable with ?perf-debug=true or ?video-perf=true)
// ============================================================================

const PERF_MONITOR_ENABLED = new URLSearchParams(window.location.search).has('perf-debug')
                             || new URLSearchParams(window.location.search).has('video-perf');

const perfStats = {
  coreWebVitals: {},
  customMetrics: {},
};

/**
 * Initialize Core Web Vitals observers
 * Must be called early to capture metrics from page load
 */
function initCoreWebVitalsObservers() {
  if (!PERF_MONITOR_ENABLED) return;

  // Observe LCP (Largest Contentful Paint)
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      perfStats.coreWebVitals.LCP = Math.round(lastEntry.startTime);
      perfStats.coreWebVitals.LCPElement = lastEntry.element?.tagName || 'N/A';
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

  // Observe INP (Interaction to Next Paint) - new metric
  try {
    const inpObserver = new PerformanceObserver((list) => {
      let maxDuration = 0;
      list.getEntries().forEach((entry) => {
        if (entry.duration > maxDuration) {
          maxDuration = entry.duration;
          perfStats.coreWebVitals.INP = Math.round(entry.duration);
        }
      });
    });
    inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 40 });
  } catch (e) {
    // INP not supported
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
 * Calculate estimated performance score (0-100)
 */
function calculatePerformanceScore() {
  const { LCP, FCP, CLS } = perfStats.coreWebVitals;
  if (!LCP && !FCP) return null;

  let score = 100;

  // LCP scoring (weighted 25%)
  if (LCP) {
    if (LCP > 4000) score -= 25;
    else if (LCP > 2500) score -= ((LCP - 2500) / 1500) * 25;
  }

  // FCP scoring (weighted 10%)
  if (FCP) {
    if (FCP > 3000) score -= 10;
    else if (FCP > 1800) score -= ((FCP - 1800) / 1200) * 10;
  }

  // CLS scoring (weighted 25%)
  if (CLS) {
    const clsValue = parseFloat(CLS);
    if (clsValue > 0.25) score -= 25;
    else if (clsValue > 0.1) score -= ((clsValue - 0.1) / 0.15) * 25;
  }

  return Math.max(0, Math.round(score));
}

/**
 * Get rating for performance score
 */
function getScoreRating(score) {
  if (score >= 90) return '✅ Good - Page is performing well';
  if (score >= 50) return '⚠️ Needs Improvement - Optimization recommended';
  return '❌ Poor - Significant optimization needed';
}

/**
 * Get rating for a metric value
 */
function getRating(metric, value) {
  const thresholds = {
    LCP: { good: 2500, needsImprovement: 4000 },
    FCP: { good: 1800, needsImprovement: 3000 },
    CLS: { good: 0.1, needsImprovement: 0.25 },
    FID: { good: 100, needsImprovement: 300 },
    INP: { good: 200, needsImprovement: 500 },
    TTFB: { good: 800, needsImprovement: 1800 },
  };

  if (!thresholds[metric]) return '';

  const threshold = thresholds[metric];
  if (value <= threshold.good) return '✅ Good';
  if (value <= threshold.needsImprovement) return '⚠️ Needs Improvement';
  return '❌ Poor';
}

/**
 * Log performance summary to console
 */
function logPerfSummary() {
  if (!PERF_MONITOR_ENABLED) return;

  // Collect Core Web Vitals before logging
  collectCoreWebVitals();

  /* eslint-disable no-console */
  console.group('⚡ Core Web Vitals Performance Monitor');

  // Core Web Vitals Table with ratings
  console.log('📊 Core Web Vitals:');
  const vitalsTable = {
    'TTFB (Time to First Byte)': perfStats.coreWebVitals.TTFB
      ? `${perfStats.coreWebVitals.TTFB} ms ${getRating('TTFB', perfStats.coreWebVitals.TTFB)}`
      : 'N/A',
    'FCP (First Contentful Paint)': perfStats.coreWebVitals.FCP
      ? `${perfStats.coreWebVitals.FCP} ms ${getRating('FCP', perfStats.coreWebVitals.FCP)}`
      : 'N/A',
    'LCP (Largest Contentful Paint)': perfStats.coreWebVitals.LCP
      ? `${perfStats.coreWebVitals.LCP} ms ${getRating('LCP', perfStats.coreWebVitals.LCP)}`
      : 'N/A',
    'LCP Element': perfStats.coreWebVitals.LCPElement || 'N/A',
    'CLS (Cumulative Layout Shift)': perfStats.coreWebVitals.CLS
      ? `${perfStats.coreWebVitals.CLS} ${getRating('CLS', parseFloat(perfStats.coreWebVitals.CLS))}`
      : 'N/A',
    'FID (First Input Delay)': perfStats.coreWebVitals.FID
      ? `${perfStats.coreWebVitals.FID} ms ${getRating('FID', perfStats.coreWebVitals.FID)}`
      : 'N/A (requires user interaction)',
    'INP (Interaction to Next Paint)': perfStats.coreWebVitals.INP
      ? `${perfStats.coreWebVitals.INP} ms ${getRating('INP', perfStats.coreWebVitals.INP)}`
      : 'N/A (requires user interaction)',
  };
  console.table(vitalsTable);

  // Additional timing data
  console.log('\n⏱️ Load Timing:');
  console.table({
    'DOM Content Loaded': perfStats.coreWebVitals.DOMContentLoaded
      ? `${perfStats.coreWebVitals.DOMContentLoaded} ms`
      : 'N/A',
    'Page Load Complete': perfStats.coreWebVitals.LoadComplete
      ? `${perfStats.coreWebVitals.LoadComplete} ms`
      : 'N/A',
  });

  // Performance score estimation
  const score = calculatePerformanceScore();
  if (score !== null) {
    console.log(`\n🎯 Estimated Performance Score: ${score}/100`);
    console.log(`   ${getScoreRating(score)}`);
  }

  console.log('\n💡 Tips:');
  console.log('   - Open Network tab to see resource loading');
  console.log('   - Use Lighthouse for comprehensive audits');
  console.log('   - Compare with baseline: https://main--express-milo--adobecom.aem.live/express/');

  console.groupEnd();
  /* eslint-enable no-console */
}

/**
 * Add custom metric tracking
 */
function trackCustomMetric(name, value) {
  if (!PERF_MONITOR_ENABLED) return;
  perfStats.customMetrics[name] = value;
}

// Initialize observers immediately if monitoring is enabled
initCoreWebVitalsObservers();

// Log summary after page is loaded and stable
if (PERF_MONITOR_ENABLED) {
  setTimeout(() => logPerfSummary(), 5000); // Log after 5 seconds
}

// Export for external access
const performanceMonitor = {
  getMetrics: () => perfStats,
  trackCustomMetric,
  logSummary: logPerfSummary,
};

window.performanceMonitor = performanceMonitor;

export default performanceMonitor;
