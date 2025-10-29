/* eslint-disable no-console */

/**
 * Debug utility for tracking resize performance
 * Usage: Import and call initResizeDebug() in print-product-detail.js
 */

let resizeCount = 0;
let lastResizeTime = performance.now();
let resizeTimeouts = [];

export function initResizeDebug() {
  console.log('🔍 [Resize Debug] Initialized');

  // Track all resize events
  window.addEventListener('resize', () => {
    resizeCount++;
    const now = performance.now();
    const timeSinceLastResize = now - lastResizeTime;
    
    console.log(`📐 [Resize Debug] Event #${resizeCount} - ${timeSinceLastResize.toFixed(2)}ms since last`);
    
    // Check current viewport
    console.log(`   Viewport: ${window.innerWidth}x${window.innerHeight}`);
    
    // Check DOM size
    const totalNodes = document.querySelectorAll('*').length;
    console.log(`   Total DOM nodes: ${totalNodes}`);
    
    // Force layout and measure time
    const layoutStart = performance.now();
    document.body.offsetHeight; // eslint-disable-line no-unused-expressions
    const layoutTime = performance.now() - layoutStart;
    
    if (layoutTime > 10) {
      console.warn(`   ⚠️ Slow layout recalculation: ${layoutTime.toFixed(2)}ms`);
    } else {
      console.log(`   ✅ Layout time: ${layoutTime.toFixed(2)}ms`);
    }
    
    // Check for print-product-detail elements
    const pdpElements = document.querySelectorAll('[class*="pdpx-"]').length;
    console.log(`   PDP elements: ${pdpElements}`);
    
    lastResizeTime = now;
  });

  // Track ResizeObserver usage
  const originalResizeObserver = window.ResizeObserver;
  let observerCount = 0;
  
  window.ResizeObserver = class extends originalResizeObserver {
    constructor(callback) {
      observerCount++;
      console.log(`👁️ [Resize Debug] ResizeObserver #${observerCount} created`);
      
      const wrappedCallback = (entries, observer) => {
        const start = performance.now();
        callback(entries, observer);
        const duration = performance.now() - start;
        
        if (duration > 10) {
          console.warn(`   ⚠️ Slow ResizeObserver callback: ${duration.toFixed(2)}ms`);
        }
      };
      
      super(wrappedCallback);
    }
  };

  // Track media query listeners
  const originalMatchMedia = window.matchMedia;
  let mediaQueryCount = 0;
  
  window.matchMedia = function(query) {
    const mql = originalMatchMedia.call(window, query);
    const originalAddListener = mql.addListener || mql.addEventListener;
    
    if (originalAddListener) {
      const wrappedAddListener = function(callback) {
        mediaQueryCount++;
        console.log(`🎯 [Resize Debug] Media query listener #${mediaQueryCount}: ${query}`);
        
        const wrappedCallback = function(...args) {
          const start = performance.now();
          callback.apply(this, args);
          const duration = performance.now() - start;
          
          if (duration > 10) {
            console.warn(`   ⚠️ Slow media query callback: ${duration.toFixed(2)}ms`);
          }
        };
        
        return originalAddListener.call(this, wrappedCallback);
      };
      
      if (mql.addListener) {
        mql.addListener = wrappedAddListener;
      }
      if (mql.addEventListener) {
        mql.addEventListener = wrappedAddListener;
      }
    }
    
    return mql;
  };

  // Track setTimeout/setInterval that might be resize-related
  const originalSetTimeout = window.setTimeout;
  window.setTimeout = function(callback, delay, ...args) {
    const timeoutId = originalSetTimeout.call(window, function() {
      if (resizeTimeouts.includes(timeoutId)) {
        const start = performance.now();
        callback.apply(this, args);
        const duration = performance.now() - start;
        
        if (duration > 10) {
          console.warn(`⏱️ [Resize Debug] Slow timeout callback: ${duration.toFixed(2)}ms`);
        }
        
        resizeTimeouts = resizeTimeouts.filter((id) => id !== timeoutId);
      } else {
        callback.apply(this, args);
      }
    }, delay);
    
    // Assume timeouts during resize are resize-related
    if (delay < 500) {
      resizeTimeouts.push(timeoutId);
    }
    
    return timeoutId;
  };

  console.log('✅ [Resize Debug] Monitoring active');
  console.log('   - Resize events');
  console.log('   - ResizeObserver');
  console.log('   - Media query listeners');
  console.log('   - Timeout callbacks');
}

export function stopResizeDebug() {
  console.log('🛑 [Resize Debug] Stopped (refresh page to fully reset)');
}

export function getResizeStats() {
  return {
    totalResizeEvents: resizeCount,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    totalDOMNodes: document.querySelectorAll('*').length,
    pdpElements: document.querySelectorAll('[class*="pdpx-"]').length,
  };
}

