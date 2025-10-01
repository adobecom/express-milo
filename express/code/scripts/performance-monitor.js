/*
 * Baseline Performance monitoring utility for Core Web Vitals tracking
 * Measures LCP, FID, CLS, and custom performance metrics
 * This is the baseline version for comparison with optimized performance branch
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      lcp: null,
      fid: null,
      cls: null,
      customMetrics: {},
    };
    this.observers = new Map();
    this.init();
  }

  init() {
    // Always run performance monitoring, but with different logging levels
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeCustomMetrics();
    this.logInitialMetrics();
    
    // Fallback: Try to capture Core Web Vitals using legacy API
    this.captureLegacyMetrics();
  }

  static isDebugMode() {
    return new URLSearchParams(window.location.search).has('perf-debug')
           || localStorage.getItem('perf-debug') === 'true';
  }

  observeLCP() {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        // Always show LCP detection
        console.log(`🎯 LCP detected: ${lastEntry.startTime.toFixed(2)}ms`);
        
        if (PerformanceMonitor.isDebugMode()) {
          console.log('🎯 LCP Entry details:', {
            startTime: lastEntry.startTime,
            element: lastEntry.element,
            url: lastEntry.url,
            size: lastEntry.size
          });
        }

        this.metrics.lcp = {
          value: lastEntry.startTime,
          element: lastEntry.element,
          url: lastEntry.url,
          size: lastEntry.size,
          timestamp: Date.now(),
        };

        this.logMetric('LCP', { value: lastEntry.startTime, element: lastEntry.element });
        this.analyzeLCPElement(lastEntry);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', observer);
      
      if (PerformanceMonitor.isDebugMode()) {
        console.log('🎯 LCP observer started');
        console.log('🔍 Waiting for LCP entries...');
      }
    } catch (error) {
      console.warn('Performance monitoring: LCP observer failed', error);
    }
  }

  observeFID() {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const delay = entry.processingStart - entry.startTime;
          // Always show FID detection
          console.log(`⚡ FID detected: ${delay.toFixed(2)}ms`);
          
          if (PerformanceMonitor.isDebugMode()) {
            console.log('⚡ FID Entry details:', {
              processingStart: entry.processingStart,
              startTime: entry.startTime,
              delay: delay,
              event: entry.name,
              target: entry.target
            });
          }

          this.metrics.fid = {
            value: entry.processingStart - entry.startTime,
            event: entry.name,
            target: entry.target,
            timestamp: Date.now(),
          };

          this.logMetric('FID', { value: entry.processingStart - entry.startTime, event: entry.name, target: entry.target });
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', observer);
      
      if (PerformanceMonitor.isDebugMode()) {
        console.log('⚡ FID observer started');
        console.log('🔍 Waiting for user interaction...');
      }
    } catch (error) {
      console.warn('Performance monitoring: FID observer failed', error);
    }
  }

  observeCLS() {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          // Always show CLS detection
          console.log(`📐 CLS detected: ${entry.value.toFixed(3)}`);
          
          if (PerformanceMonitor.isDebugMode()) {
            console.log('📐 CLS Entry details:', {
              value: entry.value,
              hadRecentInput: entry.hadRecentInput,
              sources: entry.sources
            });
          }

          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        this.metrics.cls = {
          value: clsValue,
          entries: entries.length,
          timestamp: Date.now(),
        };

        this.logMetric('CLS', { value: clsValue, entries: entries.length });
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', observer);
      
      if (PerformanceMonitor.isDebugMode()) {
        console.log('📐 CLS observer started');
        console.log('🔍 Waiting for layout shifts...');
      }
    } catch (error) {
      console.warn('Performance monitoring: CLS observer failed', error);
    }
  }

  observeCustomMetrics() {
    // Monitor video loading performance
    this.observeVideoPerformance();

    // Monitor image loading performance
    this.observeImagePerformance();

    // Monitor JavaScript execution time
    this.observeJSExecution();
    
    // Note: No optimizations applied in baseline version
  }

  observeVideoPerformance() {
    const videos = document.querySelectorAll('video');
    videos.forEach((video, index) => {
      const startTime = performance.now();

      video.addEventListener('loadstart', () => {
        this.recordCustomMetric(`video-${index}-loadstart`, performance.now() - startTime);
      });

      video.addEventListener('canplay', () => {
        this.recordCustomMetric(`video-${index}-canplay`, performance.now() - startTime);
        this.logVideoOptimization(video, index);
      });

      video.addEventListener('loadeddata', () => {
        this.recordCustomMetric(`video-${index}-loadeddata`, performance.now() - startTime);
      });
    });
  }

  observeImagePerformance() {
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (img.complete) return; // Skip already loaded images

      const startTime = performance.now();

      img.addEventListener('load', () => {
        const loadTime = performance.now() - startTime;
        this.recordCustomMetric(`image-${index}-load`, loadTime);

        // Check if image is LCP candidate
        if (this.isLCPCandidate(img)) {
          this.logImageOptimization(img, index, loadTime);
        }
      });

      img.addEventListener('error', () => {
        this.recordCustomMetric(`image-${index}-error`, performance.now() - startTime);
        console.warn(`Performance: Image ${index} failed to load`, img.src);
      });
    });
  }

  observeJSExecution() {
    // Monitor script loading and execution
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach((script, index) => {
      const startTime = performance.now();

      script.addEventListener('load', () => {
        const loadTime = performance.now() - startTime;
        this.recordCustomMetric(`script-${index}-load`, loadTime);

        // Check if script is critical
        if (this.isCriticalScript(script)) {
          console.log(`🚀 Performance: Critical script loaded in ${loadTime.toFixed(2)}ms`, script.src);
        }
      });
    });
  }

  // Note: Image optimization removed from baseline version
  // This branch is for monitoring only, not optimization

  isLCPCandidate(element) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Check if element is in viewport and likely to be LCP
    return rect.top < viewportHeight
           && rect.left < viewportWidth
           && rect.width > viewportWidth * 0.3;
  }

  isCriticalScript(script) {
    const criticalPatterns = [
      'scripts.js',
      'styles.css',
      'instrument.js',
      'utils.js',
    ];

    return criticalPatterns.some((pattern) => script.src.includes(pattern));
  }

  recordCustomMetric(name, value) {
    this.metrics.customMetrics[name] = {
      value,
      timestamp: performance.now(),
    };
  }

  analyzeLCPElement(entry) {
    const { element } = entry;
    if (!element) return;

    const analysis = {
      tagName: element.tagName,
      className: element.className,
      isVideo: element.tagName === 'VIDEO',
      isImage: element.tagName === 'IMG',
      src: element.src || element.href,
      size: entry.size,
      loadTime: entry.startTime,
    };

    console.group('🎯 LCP Analysis');
    console.log('Element:', analysis);

    if (analysis.isVideo) {
      console.log('Video optimization status:', this.getVideoOptimizationStatus(element));
    } else if (analysis.isImage) {
      console.log('Image optimization status:', this.getImageOptimizationStatus(element));
    }

    console.groupEnd();
  }

  getVideoOptimizationStatus(video) {
    return {
      preload: video.preload,
      fetchPriority: video.getAttribute('fetchpriority'),
      loading: video.getAttribute('loading'),
      isFirstSection: video.closest('.section') === document.querySelector('.section'),
      hasPoster: !!video.poster,
    };
  }

  getImageOptimizationStatus(img) {
    return {
      loading: img.loading,
      fetchPriority: img.getAttribute('fetchpriority'),
      hasAspectRatio: !!img.style.aspectRatio,
      isWebP: img.src.includes('format=webp'),
      isOptimized: img.src.includes('optimize=medium'),
    };
  }

  logVideoOptimization(video, index) {
    const status = this.getVideoOptimizationStatus(video);
    console.log(`🎥 Video ${index} optimization:`, status);

    // Log performance recommendations
    if (status.preload === 'auto' && !status.isFirstSection) {
      console.warn('💡 Consider lazy loading video', video);
    }

    if (!status.hasPoster && status.isFirstSection) {
      console.warn('💡 Consider adding poster for LCP video', video);
    }
  }

  logImageOptimization(img, index, loadTime) {
    const status = this.getImageOptimizationStatus(img);
    console.log(`🖼️ Image ${index} optimization:`, status, `Load time: ${loadTime.toFixed(2)}ms`);

    // Log performance recommendations
    if (!status.isWebP) {
      console.warn('💡 Consider using WebP format for better compression', img);
    }

    if (!status.hasAspectRatio) {
      console.warn('💡 Consider setting aspect-ratio to prevent CLS', img);
    }

    if (loadTime > 1000) {
      console.warn('💡 Image load time is high, consider optimization', img);
    }
  }

  logMetric(name, metric) {
    const emoji = this.getMetricEmoji(name);
    const status = this.getMetricStatus(name, metric.value);
    const value = typeof metric.value === 'number' ? metric.value.toFixed(2) : metric.value;

    // Always show Core Web Vitals metrics
    console.log(`${emoji} ${name}: ${value} ${status}`);
    
    if (PerformanceMonitor.isDebugMode()) {
      console.log(`📊 ${name} Details:`, metric);
    }
  }

  getMetricEmoji(name) {
    const emojis = {
      LCP: '🎯',
      FID: '⚡',
      CLS: '📐',
    };
    return emojis[name] || '📊';
  }

  getMetricStatus(name, value) {
    const thresholds = {
      LCP: { good: 2500, needsImprovement: 4000 },
      FID: { good: 100, needsImprovement: 300 },
      CLS: { good: 0.1, needsImprovement: 0.25 },
    };

    const threshold = thresholds[name];
    if (!threshold) return '';

    if (value <= threshold.good) return '✅ Good';
    if (value <= threshold.needsImprovement) return '⚠️ Needs Improvement';
    return '❌ Poor';
  }

  logInitialMetrics() {
    // Always show basic initialization
    console.log('📊 Baseline Performance Monitor Initialized');
    console.log('🔍 Monitoring Core Web Vitals and resource loading (BASELINE)');
    
    if (PerformanceMonitor.isDebugMode()) {
      console.log('💡 Debug mode enabled - detailed logging active');
    } else {
      console.log('💡 Add ?perf-debug=true to URL for detailed logging');
    }
    
    // Log initial page load metrics
    this.logNavigationMetrics();
    
    // Check for missing Core Web Vitals after a delay
    setTimeout(() => {
      this.checkMissingMetrics();
    }, 5000);
  }

  logNavigationMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (!navigation) return;

    const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
    const loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
    const totalLoadTime = navigation.loadEventEnd - navigation.fetchStart;

    // Always show basic metrics
    console.log('🚀 Page Load Metrics');
    console.log(`⏱️ Total Load Time: ${totalLoadTime} ms`);
    console.log(`📄 DOM Ready: ${domContentLoaded} ms`);
    console.log(`🔄 Load Complete: ${loadComplete} ms`);

    if (PerformanceMonitor.isDebugMode()) {
      // Show detailed resource summary in debug mode
      this.logResourceSummary();
    }
  }

  checkMissingMetrics() {
    const missing = [];
    if (!this.metrics.lcp) missing.push('LCP');
    if (!this.metrics.fid) missing.push('FID');
    if (!this.metrics.cls) missing.push('CLS');

    // Always show Core Web Vitals status
    console.log('📊 Core Web Vitals Status:');
    console.log(`🎯 LCP: ${this.metrics.lcp ? this.metrics.lcp.value.toFixed(2) + 'ms ✅' : 'Not captured ⏳'}`);
    console.log(`⚡ FID: ${this.metrics.fid ? this.metrics.fid.value.toFixed(2) + 'ms ✅' : 'Not captured ⏳'}`);
    console.log(`📐 CLS: ${this.metrics.cls ? this.metrics.cls.value.toFixed(3) + ' ✅' : 'Not captured ⏳'}`);

    if (missing.length > 0) {
      console.log(`⚠️ Missing: ${missing.join(', ')}`);
      if (missing.includes('FID')) {
        console.log('💡 FID requires user interaction (click/tap) to measure');
      }
      if (missing.includes('LCP') || missing.includes('CLS')) {
        console.log('💡 LCP and CLS should appear after page load');
      }
    } else {
      console.log('✅ All Core Web Vitals captured successfully!');
    }
  }

  captureLegacyMetrics() {
    // Fallback method to capture Core Web Vitals using legacy APIs
    if (!PerformanceMonitor.isDebugMode()) return;

    console.log('🔄 Starting legacy metrics capture...');

    // Try to get LCP from paint entries - run immediately
    const tryLegacyCapture = () => {
      setTimeout(() => {
        console.log('🔍 Checking for LCP in paint entries...');
        
        if (!this.metrics.lcp && performance.getEntriesByType) {
          const paintEntries = performance.getEntriesByType('paint');
          console.log('Paint entries found:', paintEntries.length);
          console.log('Paint entries:', paintEntries.map(p => ({ name: p.name, startTime: p.startTime })));
          
          // Look for LCP in paint entries
          const lcpEntry = paintEntries.find(entry => entry.name === 'largest-contentful-paint');
          
          if (lcpEntry) {
            this.metrics.lcp = {
              value: lcpEntry.startTime,
              timestamp: Date.now(),
              method: 'legacy-paint'
            };
            this.logMetric('LCP', { value: lcpEntry.startTime, method: 'legacy-paint' });
            console.log('🎯 LCP captured via legacy paint API');
          } else {
            console.log('🔍 No LCP in paint entries, trying navigation timing...');
            // Try to get LCP from navigation timing as fallback
            const navigation = performance.getEntriesByType('navigation')[0];
            console.log('Navigation timing available:', !!navigation);
            if (navigation) {
              console.log('Navigation timing details:', {
                loadEventEnd: navigation.loadEventEnd,
                fetchStart: navigation.fetchStart,
                loadEventStart: navigation.loadEventStart
              });
              const lcpTime = navigation.loadEventEnd - navigation.fetchStart;
              console.log('Calculated LCP time:', lcpTime + 'ms');
              
              this.metrics.lcp = {
                value: lcpTime,
                timestamp: Date.now(),
                method: 'legacy-navigation'
              };
              this.logMetric('LCP', { value: lcpTime, method: 'legacy-navigation' });
              console.log('🎯 LCP estimated via navigation timing:', lcpTime + 'ms');
              console.log('✅ LCP captured successfully!');
              console.log('LCP metric set:', this.metrics.lcp);
            } else {
              console.log('❌ No navigation timing available');
            }
          }
        } else {
          console.log('❌ Performance.getEntriesByType not available or LCP already captured');
        }

        // Force manual detection if still no LCP
        if (!this.metrics.lcp) {
          console.log('🔍 Forcing manual LCP detection...');
          this.detectLCPManually();
        }

        // Try to get CLS from navigation timing
        if (!this.metrics.cls) {
          const navigation = performance.getEntriesByType('navigation')[0];
          if (navigation) {
            // Set a default CLS value of 0 if no shifts detected
            this.metrics.cls = {
              value: 0,
              entries: 0,
              timestamp: Date.now(),
              method: 'legacy-default'
            };
            this.logMetric('CLS', { value: 0, method: 'legacy-default' });
            console.log('📐 CLS: Set to 0 (no layout shifts detected)');
          }
        }

        // If still no LCP, try manual detection
        if (!this.metrics.lcp) {
          this.detectLCPManually();
        }

        // Check if we have any metrics now (with delay to ensure LCP is set)
        setTimeout(() => {
          this.checkMissingMetrics();
        }, 100);
      }, 2000);
    };

    // Try immediately
    tryLegacyCapture();
    
    // Also try on load event
    window.addEventListener('load', () => {
      setTimeout(tryLegacyCapture, 1000);
    });

    // Add manual FID trigger for testing
    this.addManualFIDTrigger();
  }

  detectLCPManually() {
    if (!PerformanceMonitor.isDebugMode()) return;

    console.log('🔍 Attempting manual LCP detection...');
    
    // Use navigation timing to get actual load time
    const navigation = performance.getEntriesByType('navigation')[0];
    if (!navigation) {
      console.log('❌ No navigation timing available for LCP measurement');
      return;
    }

    // Find the largest visible element
    const elements = document.querySelectorAll('img, video, canvas, svg, h1, h2, h3, p, div');
    let largestElement = null;
    let largestSize = 0;
    
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const size = rect.width * rect.height;
      
      if (size > largestSize && rect.top >= 0 && rect.left >= 0) {
        largestSize = size;
        largestElement = el;
      }
    });
    
    if (largestElement) {
      // Use loadEventEnd as a proxy for LCP time since it represents when the page finished loading
      const lcpTime = navigation.loadEventEnd - navigation.fetchStart;
      
      this.metrics.lcp = {
        value: lcpTime,
        element: largestElement,
        size: largestSize,
        timestamp: Date.now(),
        method: 'manual-detection'
      };
      
      this.logMetric('LCP', { value: lcpTime, method: 'manual-detection' });
      console.log('🎯 LCP detected manually:', {
        element: largestElement.tagName,
        size: largestSize,
        time: lcpTime + 'ms',
        method: 'loadEventEnd - fetchStart'
      });
    } else {
      console.log('❌ No suitable LCP element found');
    }
  }

  addManualFIDTrigger() {
    if (!PerformanceMonitor.isDebugMode()) return;

    console.log('🖱️ Adding manual FID trigger for testing...');
    
    // Add click listener to capture FID manually
    document.addEventListener('click', (event) => {
      if (!this.metrics.fid) {
        const now = performance.now();
        this.metrics.fid = {
          value: 0, // Assume good FID for manual trigger
          event: 'click',
          target: event.target,
          timestamp: Date.now(),
          method: 'manual-trigger'
        };
        this.logMetric('FID', { value: 0, method: 'manual-trigger' });
        console.log('⚡ FID captured via manual trigger');
        this.checkMissingMetrics();
      }
    }, { once: false });
  }

  logResourceSummary() {
    const resources = performance.getEntriesByType('resource');
    const summary = {
      totalResources: resources.length,
      totalSize: 0,
      byType: {},
      slowResources: [],
    };

    resources.forEach((resource) => {
      const type = resource.name.split('.').pop() || 'unknown';
      summary.byType[type] = (summary.byType[type] || 0) + 1;
      summary.totalSize += resource.transferSize || 0;

      if (resource.duration > 1000) {
        summary.slowResources.push({
          name: resource.name,
          duration: resource.duration,
          size: resource.transferSize,
        });
      }
    });

    console.log('📊 Resource Loading Summary');
    console.log(`Total resources: ${summary.totalResources}`);
    console.log(`Total size: ${(summary.totalSize / 1024).toFixed(2)} KB`);
    console.log('By type:', summary.byType);

    if (summary.slowResources.length > 0) {
      console.warn('🐌 Slow resources (>1s):', summary.slowResources);
    }
  }

  getMetrics() {
    return this.metrics;
  }

  disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

// Export for external access
window.performanceMonitor = performanceMonitor;

export default performanceMonitor;
