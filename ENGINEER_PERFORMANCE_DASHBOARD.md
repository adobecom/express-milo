# Adobe Express Engineering Performance Dashboard
## Technical Implementation Guide & Optimization Strategies

### 🔧 **Engineering Overview**
- **Architecture**: AEM EDS Three-Phase DOM Transformation
- **Performance Budget**: LCP <2.5s, INP <200ms, CLS <0.1
- **Critical Path**: 45+ Express pages requiring optimization
- **Tech Stack**: Vanilla JS, CSS, AEM Franklin, Milo Framework

---

## 🏗️ **AEM EDS Performance Architecture**

### **AEM EDS Three-Phase Loading (E-L-D) Critical Path**
Following AEM's "Keeping it 100" principle with mandatory phase assignment:

**Phase E (Eager)**: LCP elements, <100KB total, single origin only
**Phase L (Lazy)**: Below-fold, same-origin enhancement  
**Phase D (Delayed)**: Third-party, 3+ seconds after LCP

```javascript
// Phase 1: Raw Franklin HTML (Server Delivery)
<div class="grid-marquee">
  <div><div><h1>Hero Title</h1></div></div>
  <div><div><img src="hero.jpg"></div></div>
</div>

// Phase 2: Decorated State (data-status="decorated")
<div class="section" data-status="decorated">
  <div class="grid-marquee">
    // Basic structure + some enhancements
  </div>
</div>

// Phase 3: Fully Loaded (data-block-status="loaded")
<div class="section">
  <div class="grid-marquee" data-block-status="loaded">
    // Full interactive component with optimized structure
  </div>
</div>
```

### **Critical Performance Constraints**
```css
/* REQUIRED: Prevents FOUC during 3-phase transformation */
body { display: none; }
/* ⚠️ Cannot be removed - users must not see intermediate states */
```

### **Phase E Budget Rules (MANDATORY)**
- **100KB total** before LCP (aggregate all resources)
- **Single origin only** (no CDNs, fonts, APIs before LCP)
- **Essential AEM CSS** (required for transformations)
- **First section only** (below-fold deferred to Phase L)

---

## 📊 **Current Performance Analysis**

### **🚨 CRITICAL: CSS Render-Blocking Detection (URGENT INVESTIGATION)**
**ALWAYS check CSS loading sequence FIRST when diagnosing slow LCP**

#### **CSS Render-Blocking Symptoms**
- LCP > 3 seconds with white screen until late in loading
- Body visibility delayed despite JavaScript optimization  
- Performance scores plateau despite component optimizations
- Render delay >70% in LCP breakdown

#### **Root Cause: 27KB CSS Blocks Body Visibility**
```javascript
// ❌ PROBLEM: CSS render-blocking via JavaScript
(function loadStyles() {
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', path); // BLOCKS until download complete
  document.head.appendChild(link);
}());
```

### **LCP Bottlenecks by Page Type**

| Page Category | Current LCP | Root Cause | Optimization Target |
|---------------|-------------|------------|-------------------|
| **Homepage** | 4.33s | CSS render-blocking (27KB styles.css) | 2.0s |
| **Create Pages** | 3.5-4.2s | Template-x block + CSS blocking | 2.2s |
| **Template Pages** | 2.8-3.2s | Template-list + CSS loading delay | 2.3s |
| **Feature Pages** | 2.5-3.0s | Image optimization + CSS blocking | 2.1s |

### **INP Issues by Component**

| Component | Current INP | Issue | Solution |
|-----------|-------------|-------|---------|
| **Template Cards** | 260ms | Heavy DOM manipulation | Virtual scrolling |
| **Search Filters** | 220ms | Synchronous filtering | Web Workers |
| **Image Editor** | 180ms | Canvas operations | OffscreenCanvas |
| **Navigation** | 150ms | Menu animations | CSS transforms |

---

## 🚀 **Technical Optimization Strategies**

### **1. Scripts.js Critical Path Optimization**

#### **Current Blocking Pattern (ALL pages affected)**
```javascript
// ❌ PROBLEM: Synchronous imports block LCP
const {
  loadArea,
  loadStyle,
  setConfig,
  loadLana,
  createTag,
} = await import(`${miloLibs}/utils/utils.js`); // BLOCKS LCP

// ❌ PROBLEM: Heavy initialization before LCP
await loadArea(main, config);
await loadStyle(`${miloLibs}/styles/styles.css`);
```

#### **Optimized Critical Path (Following Express-Milo Patterns)**
```javascript
// ✅ SOLUTION: AEM EDS Three-Phase Loading Pattern
(async function optimizedLoad() {
  // PHASE E: LCP Critical (<100KB, single origin)
  // Focus on accelerating transformation speed for LCP elements
  const isFirstSection = document.querySelector('.section');
  
  if (isFirstSection) {
    // Create LCP structure immediately (synchronous DOM)
    const basicStructure = createLCPStructure(isFirstSection);
    isFirstSection.append(basicStructure);
  }
  
  // PHASE L: Same-origin enhancement (deferred)
  requestIdleCallback(async () => {
    const { loadArea, loadStyle, setConfig } = await import(`${miloLibs}/utils/utils.js`);
    await loadArea(main, config);
  });
  
  // PHASE D: Third-party delayed (3+ seconds after LCP)
  setTimeout(() => {
    loadAnalytics();
    loadTagManager();
    loadChatSupport();
  }, 3000);
})();
```

### **2. Block-Level Performance Patterns**

#### **Template-X Block Optimization (Express-Milo Pattern)**
```javascript
// ❌ ANTI-PATTERN: All-or-Nothing Initialization
export default async function init(el) {
  const data = await fetchTemplateData(); // BLOCKS LCP
  const ui = createComplexUI(data); // HEAVY DOM
  el.appendChild(ui);
}

// ✅ REQUIRED: Progressive Enhancement Pattern (Phase E)
export default async function init(el) {
  const isFirstSection = el.closest('.section') === document.querySelector('.section');
  
  if (isFirstSection) {
    // PHASE E: Create LCP DOM immediately (synchronous)
    const basicStructure = createLCPStructure(el);
    el.append(basicStructure); // LCP element visible now
    
    // PHASE L: Enhance progressively
    setTimeout(async () => {
      const data = await fetchTemplateData();
      enhanceWithData(basicStructure, data);
    }, 0);
  } else {
    // PHASE L: Lazy load with intersection observer
    setupLazyLoading(el);
  }
}
```

#### **Template-List Block Optimization**
```javascript
// ✅ VIRTUAL SCROLLING for large lists
export default async function init(el) {
  const virtualScroller = new VirtualScroller({
    container: el,
    itemHeight: 200,
    renderItem: (item, index) => createTemplateCard(item),
    onScroll: debounce(updateVisibleItems, 16) // 60fps
  });
  
  // Intersection Observer for lazy loading
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadTemplateData(entry.target);
      }
    });
  }, { rootMargin: '50px' });
}
```

### **3. Image Optimization Strategy**

#### **Hero Image Preloading**
```javascript
// ✅ CRITICAL: Preload LCP images
function preloadLCPImages() {
  const heroImages = document.querySelectorAll('.marquee img, .hero img');
  heroImages.forEach(img => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = img.src;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
}
```

#### **Responsive Image Optimization**
```javascript
// ✅ ASPECT RATIO preservation for CLS prevention
function optimizeImages(block) {
  const images = block.querySelectorAll('img');
  images.forEach(img => {
    // Calculate aspect ratio from original dimensions
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    img.style.aspectRatio = aspectRatio;
    
    // WebP format with fallback
    if (img.src.includes('.png') || img.src.includes('.jpg')) {
      const webpSrc = img.src.replace(/\.(png|jpg)/, '.webp');
      img.src = webpSrc;
    }
    
    // Lazy loading for non-LCP images
    if (!img.closest('.hero, .marquee')) {
      img.loading = 'lazy';
      img.fetchPriority = 'low';
    }
  });
}
```

### **4. JavaScript Bundle Optimization**

#### **Code Splitting Strategy**
```javascript
// ✅ PAGE-SPECIFIC bundles
const pageModules = {
  'create': () => import('./modules/create-tools.js'),
  'templates': () => import('./modules/template-browser.js'),
  'feature': () => import('./modules/feature-demos.js')
};

// Load only relevant modules
const pageType = getPageType();
if (pageModules[pageType]) {
  requestIdleCallback(() => pageModules[pageType]());
}
```

#### **Dependency Tree Optimization**
```javascript
// ❌ HEAVY: All utilities loaded upfront
import { loadArea, loadStyle, setConfig, loadLana, createTag } from './utils.js';

// ✅ OPTIMIZED: Granular imports
import { createTag } from './utils/dom.js';           // 2KB
import { loadStyle } from './utils/styles.js';        // 1KB
// Defer heavy utilities until needed
const { loadArea } = await import('./utils/area.js'); // 15KB
```

---

## 🎯 **Block-Specific Optimizations**

### **High-Impact Blocks (Affecting Multiple Pages)**

#### **1. Marquee Block (Homepage + Landing Pages)**
```javascript
// Current Issues: 4.33s LCP on homepage
// Optimization Target: 2.0s LCP

export default async function init(el) {
  // IMMEDIATE: Hero structure for LCP
  const hero = el.querySelector('h1').closest('div');
  hero.style.display = 'block';
  hero.style.minHeight = '400px'; // Prevent CLS
  
  // DEFERRED: Background images and animations
  requestIdleCallback(() => {
    loadBackgroundImages(el);
    initializeAnimations(el);
  });
}
```

#### **2. Template-X Block (20+ Feature Pages)**
```javascript
// Current Issues: 3.5-4.2s LCP on create pages
// Optimization Target: 2.2s LCP

export default async function init(el) {
  // IMMEDIATE: Template preview structure
  const preview = createTemplatePreview(el);
  el.appendChild(preview);
  
  // PROGRESSIVE: Load template data in chunks
  const templates = await loadTemplateMetadata(); // Fast metadata only
  renderTemplateCards(preview, templates);
  
  // DEFERRED: Full template data and interactions
  requestIdleCallback(() => {
    loadFullTemplateData(templates);
    initializeTemplateInteractions(el);
  });
}
```

#### **3. Template-List Block (15+ Template Pages)**
```javascript
// Current Issues: 2.8-3.2s LCP on template pages
// Optimization Target: 2.3s LCP

export default async function init(el) {
  // IMMEDIATE: Grid structure with skeletons
  const grid = createTemplateGrid(el);
  const skeletons = createSkeletonCards(12); // Show 12 placeholders
  grid.appendChild(skeletons);
  
  // STREAMING: Load templates in batches
  const templateStream = streamTemplates();
  for await (const batch of templateStream) {
    replaceSkeletonsWithTemplates(batch);
    await new Promise(resolve => requestAnimationFrame(resolve));
  }
}
```

---

## 🔧 **Performance Monitoring & Debugging**

### **Real-time Performance Tracking**
```javascript
// ✅ COMPREHENSIVE performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observer = new PerformanceObserver(this.handleEntries.bind(this));
    this.observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
  }
  
  handleEntries(list) {
    list.getEntries().forEach(entry => {
      switch(entry.entryType) {
        case 'largest-contentful-paint':
          this.trackLCP(entry);
          break;
        case 'first-input':
          this.trackFID(entry);
          break;
        case 'layout-shift':
          this.trackCLS(entry);
          break;
      }
    });
  }
  
  trackLCP(entry) {
    const lcp = entry.startTime;
    const element = entry.element;
    
    console.log(`🎯 LCP: ${lcp.toFixed(0)}ms`, {
      element: element.tagName,
      src: element.src || element.textContent?.substring(0, 50),
      blockName: element.closest('[class*="block"]')?.className
    });
    
    // Alert if LCP > 2.5s
    if (lcp > 2500) {
      this.reportSlowLCP(lcp, element);
    }
  }
}

// Initialize monitoring
const monitor = new PerformanceMonitor();
```

### **Block Performance Profiling**
```javascript
// ✅ BLOCK-LEVEL performance tracking
function profileBlock(blockName, initFunction) {
  return async function profiledInit(el) {
    const startTime = performance.now();
    
    // Track DOM mutations
    const mutationObserver = new MutationObserver(mutations => {
      console.log(`${blockName} DOM mutations:`, mutations.length);
    });
    mutationObserver.observe(el, { childList: true, subtree: true });
    
    // Execute block initialization
    await initFunction(el);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`⚡ ${blockName} initialized in ${duration.toFixed(2)}ms`);
    
    // Performance budget check
    if (duration > 100) {
      console.warn(`⚠️ ${blockName} exceeded 100ms budget: ${duration.toFixed(2)}ms`);
    }
    
    mutationObserver.disconnect();
  };
}

// Usage
export default profileBlock('template-x', async function init(el) {
  // Block implementation
});
```

---

## 🧪 **Testing & Validation**

### **Performance Regression Testing with Nala**
```javascript
// ✅ NALA: Performance testing for Express pages
import { test, expect } from '@playwright/test';

test.describe('Express Performance Regression Tests @perf', () => {
  test('should maintain LCP < 2.5s on homepage @homepage @lcp', async ({ page }) => {
    await page.goto('/express/');
    await page.waitForLoadState('networkidle');
    
    // Measure LCP using Nala patterns
    const lcpElement = page.locator('.marquee h1, .hero h1').first();
    await expect(lcpElement).toBeVisible();
    
    // Use Performance API to measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Fallback timeout
        setTimeout(() => resolve(null), 5000);
      });
    });
    
    expect(lcp).toBeLessThan(2500);
  });
  
  test('should maintain INP < 200ms on template pages @templates @inp', async ({ page }) => {
    await page.goto('/express/templates/');
    await page.waitForLoadState('networkidle');
    
    // Simulate user interaction with template cards
    const templateCard = page.locator('.template-card, .template-list .card').first();
    await expect(templateCard).toBeVisible();
    
    const startTime = Date.now();
    await templateCard.click();
    
    // Wait for interaction response
    await page.waitForLoadState('networkidle');
    const interactionTime = Date.now() - startTime;
    
    expect(interactionTime).toBeLessThan(200);
  });
  
  test('should maintain CLS < 0.1 across all Express pages @cls', async ({ page }) => {
    const pages = ['/express/', '/express/templates/', '/express/create/'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      const block = page.locator('.section').first();
      const initialBox = await block.boundingBox();
      
      // Wait for potential layout shifts
      await page.waitForTimeout(2000);
      const finalBox = await block.boundingBox();
      
      // Calculate layout shift
      const shift = Math.abs(initialBox.y - finalBox.y) / initialBox.height;
      expect(shift).toBeLessThan(0.1);
    }
  });
});
```

### **Nala Performance Test Execution**
```bash
# Run performance tests for specific pages
npm run nala stage @perf @homepage
npm run nala stage @perf @templates  
npm run nala stage @perf @lcp

# Run comprehensive performance suite
npm run nala stage @perf

# Run performance tests on different environments
npm run nala prod @perf @homepage
```

### **Block Performance Testing with Nala**
```javascript
// ✅ NALA: Block-specific performance tests
import { test, expect } from '@playwright/test';

test.describe('Template-X Block Performance @template-x @perf', () => {
  test('should render initial structure quickly @render-speed', async ({ page }) => {
    await page.goto('/express/create/');
    
    const startTime = Date.now();
    const templateBlock = page.locator('.template-x');
    await expect(templateBlock).toBeVisible();
    const renderTime = Date.now() - startTime;
    
    // Should render within 100ms
    expect(renderTime).toBeLessThan(100);
    
    // Check for essential elements
    const templatePreview = templateBlock.locator('.template-preview');
    await expect(templatePreview).toBeVisible();
  });
  
  test('should not cause layout shifts during loading @cls', async ({ page }) => {
    await page.goto('/express/create/');
    
    const templateBlock = page.locator('.template-x');
    const initialBox = await templateBlock.boundingBox();
    
    // Wait for block to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const finalBox = await templateBlock.boundingBox();
    
    // Calculate layout shift percentage
    const heightShift = Math.abs(finalBox.height - initialBox.height) / initialBox.height;
    const positionShift = Math.abs(finalBox.y - initialBox.y) / initialBox.height;
    
    expect(heightShift).toBeLessThan(0.1); // <10% height change
    expect(positionShift).toBeLessThan(0.1); // <10% position change
  });
  
  test('should handle template interactions efficiently @inp', async ({ page }) => {
    await page.goto('/express/create/');
    
    const templateCard = page.locator('.template-x .template-card').first();
    await expect(templateCard).toBeVisible();
    
    const startTime = Date.now();
    await templateCard.click();
    
    // Wait for interaction response
    const modal = page.locator('.template-modal, .preview-modal');
    await expect(modal).toBeVisible();
    const interactionTime = Date.now() - startTime;
    
    expect(interactionTime).toBeLessThan(200); // <200ms INP
  });
});

test.describe('Template-List Block Performance @template-list @perf', () => {
  test('should load templates progressively @progressive-loading', async ({ page }) => {
    await page.goto('/express/templates/');
    
    const templateList = page.locator('.template-list');
    await expect(templateList).toBeVisible();
    
    // Check that initial templates load quickly
    const initialTemplates = templateList.locator('.template-card').first();
    await expect(initialTemplates).toBeVisible({ timeout: 1000 });
    
    // Scroll to trigger lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Additional templates should load
    const allTemplates = templateList.locator('.template-card');
    const templateCount = await allTemplates.count();
    
    expect(templateCount).toBeGreaterThan(12); // Should load more than initial batch
  });
  
  test('should maintain smooth scrolling performance @scroll-performance', async ({ page }) => {
    await page.goto('/express/templates/');
    
    const templateList = page.locator('.template-list');
    await expect(templateList).toBeVisible();
    
    // Measure scroll performance
    const scrollMetrics = await page.evaluate(() => {
      return new Promise(resolve => {
        let frameCount = 0;
        let startTime = performance.now();
        
        function measureFrame() {
          frameCount++;
          if (frameCount < 60) { // Measure for ~1 second at 60fps
            requestAnimationFrame(measureFrame);
          } else {
            const endTime = performance.now();
            const avgFrameTime = (endTime - startTime) / frameCount;
            resolve(avgFrameTime);
          }
        }
        
        // Start scrolling
        window.scrollBy(0, 10);
        requestAnimationFrame(measureFrame);
      });
    });
    
    // Average frame time should be <16.67ms for 60fps
    expect(scrollMetrics).toBeLessThan(16.67);
  });
});
```

---

## 🔍 **Debugging Tools & Techniques**

### **Performance DevTools Integration**
```javascript
// ✅ CUSTOM performance marks for debugging
function debugPerformance() {
  // Mark critical milestones
  performance.mark('scripts-start');
  performance.mark('first-block-loaded');
  performance.mark('lcp-element-ready');
  
  // Measure phases
  performance.measure('script-to-first-block', 'scripts-start', 'first-block-loaded');
  performance.measure('first-block-to-lcp', 'first-block-loaded', 'lcp-element-ready');
  
  // Log measurements
  const measures = performance.getEntriesByType('measure');
  measures.forEach(measure => {
    console.log(`📊 ${measure.name}: ${measure.duration.toFixed(2)}ms`);
  });
}
```

### **Block Loading Waterfall Analysis**
```javascript
// ✅ VISUALIZE block loading sequence
class BlockLoadingTracker {
  constructor() {
    this.loadingSequence = [];
    this.startTime = performance.now();
  }
  
  trackBlockStart(blockName) {
    this.loadingSequence.push({
      block: blockName,
      startTime: performance.now() - this.startTime,
      status: 'loading'
    });
  }
  
  trackBlockComplete(blockName) {
    const entry = this.loadingSequence.find(e => e.block === blockName);
    if (entry) {
      entry.endTime = performance.now() - this.startTime;
      entry.duration = entry.endTime - entry.startTime;
      entry.status = 'complete';
    }
  }
  
  generateWaterfall() {
    console.table(this.loadingSequence);
    
    // Visual waterfall in console
    this.loadingSequence.forEach(entry => {
      const bar = '█'.repeat(Math.floor(entry.duration / 10));
      console.log(`${entry.block.padEnd(20)} |${bar} ${entry.duration.toFixed(0)}ms`);
    });
  }
}
```

---

## 📈 **Implementation Roadmap**

### **Sprint 1: Critical Path (Week 1-2)**
```javascript
// Priority 1: Scripts.js optimization
- [ ] Implement deferred imports pattern
- [ ] Add LCP element preloading
- [ ] Remove blocking operations from critical path
- [ ] Add performance monitoring

// Expected Impact: 25-40% LCP improvement
```

### **Sprint 2: Block Optimization (Week 3-4)**
```javascript
// Priority 2: High-impact blocks
- [ ] Optimize marquee block (homepage)
- [ ] Implement template-x progressive loading
- [ ] Add virtual scrolling to template-list
- [ ] Optimize image loading patterns

// Expected Impact: 15-25% additional improvement
```

### **Sprint 3: Advanced Optimizations (Week 5-6)**
```javascript
// Priority 3: Advanced techniques
- [ ] Implement service worker caching
- [ ] Add predictive prefetching
- [ ] Optimize JavaScript bundles
- [ ] Add performance regression testing

// Expected Impact: 10-15% additional improvement
```

---

## 🎯 **Success Metrics**

### **Technical KPIs**
```javascript
const performanceTargets = {
  LCP: {
    target: 2500,      // 2.5s
    current: 4330,     // 4.33s (homepage)
    improvement: '42%'
  },
  INP: {
    target: 200,       // 200ms
    current: 260,      // 260ms (template cards)
    improvement: '23%'
  },
  CLS: {
    target: 0.1,       // 0.1
    current: 0.06,     // 0.06ms (generally good)
    improvement: '40%'
  }
};
```

### **Engineering Metrics**
- **Bundle Size Reduction**: 30% smaller JavaScript bundles
- **Block Loading Time**: <100ms per block initialization
- **Performance Budget**: Zero regressions in CI/CD
- **Test Coverage**: 90% coverage for performance-critical code

---

## 🚨 **Common Pitfalls & Solutions**

### **❌ Anti-Patterns to Avoid (Based on Express-Milo Rules)**
```javascript
// DON'T: Remove body display none
body { display: block; } /* Breaks AEM EDS 3-phase loading */

// DON'T: All-or-Nothing Initialization Pattern
export default async function init(el) {
  const data = await fetchAllData();  // Blocks LCP
  const ui = buildCompleteUI(data);
  el.append(ui);  // Too late for good LCP
}

// DON'T: Global CSS affecting other blocks
.card { /* Affects all cards globally */ }

// DON'T: Complex table structures for authors
Columns (responsive, equal-height, mobile-stack, border-style-dotted)
| Content A | Background: blue, Font: large | Content B | Padding: 20px |

// DON'T: innerHTML content replacement
element.innerHTML = newContent; // Loses all attached events
```

### **✅ Best Practices (Express-Milo Standards)**
```javascript
// DO: Preserve AEM EDS architecture
body { display: none; } /* Required for proper loading */

// DO: Progressive Enhancement Pattern (Phase E)
export default async function init(el) {
  // IMMEDIATE: Zero-dependency DOM insertion for LCP
  const basicUI = createBasicStructure(el);
  el.append(basicUI);  // LCP element visible now
  
  // DEFERRED: Enhance progressively (Phase L)
  setTimeout(async () => {
    const data = await fetchEnhancements();
    enhanceUI(basicUI, data);
  }, 0);
}

// DO: Scoped CSS with block patterns
.template-x .card { /* Scoped to block */ }

// DO: Author-first design
// Simple authoring: Copy/paste blocks intuitively
// Progressive enhancement: Start simple, enhance with JS
// Resilient selectors: Use decorated classes, not pseudo-selectors

// DO: Content preservation
function safelyMoveContent(source, target) {
  // Move DOM nodes, preserve events
  while (source.firstChild) {
    target.appendChild(source.firstChild);
  }
}
```

---

## 🔧 **Development Workflow**

### **Performance-First Development with Nala**
1. **Before coding**: Set performance budget for the block
2. **During development**: Use performance profiling tools
3. **Before commit**: Run Nala performance regression tests
4. **After deploy**: Monitor real-user metrics with Nala E2E validation

### **Nala Performance CI/CD Integration**
```yaml
# .github/workflows/performance-regression.yml
name: Performance Regression Tests

on:
  pull_request:
    paths:
      - 'express/code/blocks/**'
      - 'express/code/scripts/**'

jobs:
  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run Nala Performance Tests
        run: |
          # Run performance tests for affected blocks
          npm run nala stage @perf @lcp
          npm run nala stage @perf @inp
          npm run nala stage @perf @cls
          
      - name: Performance Budget Check
        run: |
          # Fail if performance budgets exceeded
          npm run nala stage @perf --reporter=json > performance-results.json
          node scripts/check-performance-budget.js
```

### **Code Review Checklist**
- [ ] LCP elements rendered within 100ms
- [ ] No synchronous heavy operations in critical path
- [ ] Images have aspect ratios to prevent CLS
- [ ] JavaScript bundles are code-split appropriately
- [ ] **Nala performance tests pass** (`npm run nala stage @perf`)
- [ ] **Performance budgets maintained** (LCP <2.5s, INP <200ms, CLS <0.1)
- [ ] **Block-specific performance tests added** for new components

---

*This engineering dashboard provides the technical foundation for achieving the business goals outlined in the Executive Performance Dashboard. Focus on the critical path optimizations first, then progressively enhance with advanced techniques.*
