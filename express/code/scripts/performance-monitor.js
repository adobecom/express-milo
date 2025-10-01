// performance-monitor.js - Baseline Performance Monitoring
(function () {
  if (window.performanceMonitor) return; // Already initialized

  class PerformanceMonitor {
    constructor() {
      this.metrics = {};
      this.marks = {};
      this.observers = [];
      this.init();
    }

    init() {
      // Only run in production or when explicitly enabled
      if (window.location.hostname.includes('localhost') && !PerformanceMonitor.isDebugMode()) {
        return;
      }

      this.observeLCP();
      this.observeFID();
      this.observeCLS();
      this.observeCustomMetrics();
      this.logInitialMetrics();
    }

    static isDebugMode() {
      return new URLSearchParams(window.location.search).has('perf-debug')
           || localStorage.getItem('perf-debug') === 'true';
    }

    observeLCP() {
      if (!('PerformanceObserver' in window)) return;

      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          this.metrics.lcp = {
            value: lastEntry.startTime,
            element: lastEntry.element,
            url: lastEntry.url,
            size: lastEntry.size,
            timestamp: Date.now(),
          };

          this.logMetric('LCP', lastEntry.startTime, lastEntry.element);
        });

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP observer failed:', error);
      }
    }

    observeFID() {
      if (!('PerformanceObserver' in window)) return;

      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.metrics.fid = {
              value: entry.processingStart - entry.startTime,
              timestamp: Date.now(),
            };

            this.logMetric('FID', entry.processingStart - entry.startTime);
          });
        });

        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (error) {
        console.warn('FID observer failed:', error);
      }
    }

    observeCLS() {
      if (!('PerformanceObserver' in window)) return;

      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });

          this.metrics.cls = {
            value: clsValue,
            timestamp: Date.now(),
          };

          this.logMetric('CLS', clsValue);
        });

        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('CLS observer failed:', error);
      }
    }

    observeCustomMetrics() {
      // Monitor resource loading times
      if (!('PerformanceObserver' in window)) return;

      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'resource') {
              this.logResourceLoad(entry);
            }
          });
        });

        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn('Resource observer failed:', error);
      }

      // Monitor navigation timing
      this.observeNavigationTiming();
    }

    observeNavigationTiming() {
      if (!('performance' in window) || !('getEntriesByType' in performance)) return;

      // Wait for page load to complete
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.logNavigationMetrics();
        }, 100);
      });
    }

    logNavigationMetrics() {
      if (!PerformanceMonitor.isDebugMode()) return;

      const navigation = performance.getEntriesByType('navigation')[0];
      if (!navigation) return;

      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      const loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
      const totalLoadTime = navigation.loadEventEnd - navigation.fetchStart;

      console.log('🚀 Initial Page Load Metrics');
      console.log(`DOM Content Loaded: ${domContentLoaded} ms`);
      console.log(`Load Complete: ${loadComplete} ms`);
      console.log(`Total Load Time: ${totalLoadTime} ms`);

      // Log resource summary
      this.logResourceSummary();
    }

    logResourceSummary() {
      if (!PerformanceMonitor.isDebugMode()) return;

      const resources = performance.getEntriesByType('resource');
      const totalSize = resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0);
      const resourceTypes = {};

      resources.forEach(resource => {
        const type = resource.initiatorType || 'other';
        resourceTypes[type] = (resourceTypes[type] || 0) + 1;
      });

      console.log('📊 Resource Loading Summary');
      console.log(`Total resources: ${resources.length}`);
      console.log(`Total size: ${(totalSize / 1024).toFixed(2)} KB`);
      console.log('By type:', resourceTypes);
    }

    logInitialMetrics() {
      if (!PerformanceMonitor.isDebugMode()) return;

      console.log('📊 Performance Monitor Initialized (Baseline)');
      console.log('🔍 Monitoring Core Web Vitals and resource loading');
      console.log('💡 Add ?perf-debug=true to URL for detailed logging');
      
      // Check for missing Core Web Vitals after a delay
      setTimeout(() => {
        this.checkMissingMetrics();
      }, 5000);
    }

    checkMissingMetrics() {
      if (!PerformanceMonitor.isDebugMode()) return;

      const missing = [];
      if (!this.metrics.lcp) missing.push('LCP');
      if (!this.metrics.fid) missing.push('FID');
      if (!this.metrics.cls) missing.push('CLS');

      if (missing.length > 0) {
        console.warn('⚠️ Missing Core Web Vitals:', missing.join(', '));
        console.log('💡 This is normal for FID (requires user interaction)');
        console.log('💡 LCP and CLS should appear after page load');
      } else {
        console.log('✅ All Core Web Vitals captured successfully');
      }
    }

    logMetric(name, value, element = null) {
      if (!PerformanceMonitor.isDebugMode()) return;

      const status = this.getMetricStatus(name, value);
      const emoji = this.getMetricEmoji(name);
      
      console.log(`${emoji} ${name}: ${value.toFixed(2)}ms ${status}`, {
        element: element?.tagName || 'N/A',
        src: element?.src || 'N/A',
        timestamp: new Date().toISOString(),
      });
    }

    logResourceLoad(entry) {
      if (!PerformanceMonitor.isDebugMode()) return;

      const loadTime = entry.responseEnd - entry.startTime;
      const size = entry.transferSize || 0;
      
      if (loadTime > 1000 || size > 100000) { // Log slow or large resources
        console.log('🐌 Slow Resource:', {
          url: entry.name,
          loadTime: `${loadTime.toFixed(2)}ms`,
          size: `${(size / 1024).toFixed(2)}KB`,
          type: entry.initiatorType,
        });
      }
    }

    getMetricEmoji(name) {
      const emojis = {
        'LCP': '🎯',
        'FID': '⚡',
        'CLS': '📐',
      };
      return emojis[name] || '📊';
    }

    getMetricStatus(name, value) {
      const thresholds = {
        'LCP': { good: 2500, poor: 4000 },
        'FID': { good: 100, poor: 300 },
        'CLS': { good: 0.1, poor: 0.25 },
      };

      const threshold = thresholds[name];
      if (!threshold) return '';

      if (value <= threshold.good) return '✅ Good';
      if (value <= threshold.poor) return '⚠️ Needs Improvement';
      return '❌ Poor';
    }

    // Public API for external access
    getMetrics() {
      return { ...this.metrics };
    }

    getCoreWebVitals() {
      return {
        lcp: this.metrics.lcp?.value || null,
        fid: this.metrics.fid?.value || null,
        cls: this.metrics.cls?.value || null,
      };
    }

    // Cleanup method
    disconnect() {
      this.observers.forEach(observer => observer.disconnect());
      this.observers = [];
    }
  }

  // Initialize performance monitoring
  window.performanceMonitor = new PerformanceMonitor();

  // Expose global API for debugging
  window.getPerformanceMetrics = () => window.performanceMonitor.getMetrics();
  window.getCoreWebVitals = () => window.performanceMonitor.getCoreWebVitals();

  console.log('🚀 Baseline Performance Monitor Initialized');
})();