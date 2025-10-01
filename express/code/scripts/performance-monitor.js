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
    }

    logInitialMetrics() {
      if (!PerformanceMonitor.isDebugMode()) return;

      console.log('📊 Performance Monitor Initialized (Baseline)');
      console.log('🔍 Monitoring Core Web Vitals and resource loading');
      console.log('💡 Add ?perf-debug=true to URL for detailed logging');
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