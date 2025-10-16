# 🚀 Express Milo Performance Improvement Roadmap

## Executive Summary

**Target Pages:**
1. Express Home: `/express/`
2. Logo Maker: `/express/create/logo`
3. Remove Background: `/express/feature/image/remove-background/png/transparent`
4. Resize: `/express/feature/image/resize`
5. Business Spotlight: `/express/spotlight/business`

**Current State:**
- LCP: 3.5-4.5s (Target: <2.5s)
- Performance Scores: 67-76 (Target: 80+)
- Main Issues: Video loading, image optimization, font loading

**Strategy:** Start with low-risk, high-impact general optimizations, then move to page-specific granular improvements.

---

## 🎯 Phase 1: Universal Low-Risk Optimizations (Week 1)

### 1.1 Image Optimization (Non-Invasive)

**Impact:** HIGH | **Risk:** LOW | **Effort:** MEDIUM

**Problem:**
- 292KB of potential image savings
- Images served at larger dimensions than displayed
- Missing modern image formats (WebP/AVIF)

**Solution A: Automatic Image Optimization via AEM**
```javascript
// Add to express/code/scripts/utils.js
export function optimizeImages(container = document) {
  const images = container.querySelectorAll('img[src*=".aem.live"]');
  
  images.forEach(img => {
    const src = new URL(img.src);
    
    // Add format parameter for WebP
    if (!src.searchParams.has('format')) {
      src.searchParams.set('format', 'webp');
    }
    
    // Optimize width based on display size
    if (!src.searchParams.has('width')) {
      const displayWidth = img.clientWidth || img.naturalWidth;
      const optimalWidth = Math.ceil(displayWidth * window.devicePixelRatio / 100) * 100;
      src.searchParams.set('width', Math.min(optimalWidth, 2000));
    }
    
    // Add quality parameter
    if (!src.searchParams.has('quality')) {
      src.searchParams.set('quality', '85');
    }
    
    img.src = src.toString();
  });
}

// Call after blocks are decorated
window.addEventListener('load', () => {
  optimizeImages();
});
```

**Solution B: Responsive Images with srcset**
```javascript
// Add to block decoration utilities
export function addResponsiveImages(picture) {
  const img = picture.querySelector('img');
  if (!img) return;
  
  const baseSrc = new URL(img.src);
  baseSrc.searchParams.set('format', 'webp');
  
  // Generate srcset for different viewport sizes
  const widths = [400, 800, 1200, 1600];
  const srcset = widths.map(w => {
    const url = new URL(baseSrc);
    url.searchParams.set('width', w);
    return `${url.toString()} ${w}w`;
  }).join(', ');
  
  img.setAttribute('srcset', srcset);
  img.setAttribute('sizes', '(max-width: 600px) 400px, (max-width: 900px) 800px, (max-width: 1200px) 1200px, 1600px');
}
```

**Testing:**
- Visual regression testing
- Image quality checks
- Page weight analysis

**Expected Impact:**
- 150-200KB reduction in page weight
- 10-15% improvement in LCP

---

### 1.2 Video Loading Optimization (Non-Invasive)

**Impact:** HIGH | **Risk:** LOW | **Effort:** LOW

**Problem:**
- 4 videos loading on page load (only 1 visible)
- Videos use `preload="auto"` unnecessarily
- No lazy loading for below-fold videos

**Solution: Smart Video Loading**
```javascript
// Add to express/code/scripts/utils/media.js or create new file

export function optimizeVideoLoading() {
  const videos = document.querySelectorAll('video');
  
  videos.forEach((video, index) => {
    const videoWrapper = video.closest('.hero-marquee, .ax-columns');
    const isAboveFold = videoWrapper && 
      videoWrapper.getBoundingClientRect().top < window.innerHeight;
    
    if (isAboveFold && index === 0) {
      // First above-fold video: load metadata only for quick display
      video.setAttribute('preload', 'metadata');
      video.setAttribute('loading', 'eager');
    } else {
      // Below-fold videos: lazy load
      video.setAttribute('preload', 'none');
      video.setAttribute('loading', 'lazy');
      
      // Use IntersectionObserver for lazy loading
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            video.setAttribute('preload', 'metadata');
            observer.disconnect();
          }
        });
      }, { rootMargin: '200px' });
      
      observer.observe(video);
    }
  });
}

// Call early in page lifecycle
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', optimizeVideoLoading);
} else {
  optimizeVideoLoading();
}
```

**Implementation Location:**
- Add to `express/code/scripts/scripts.js` in the early initialization

**Expected Impact:**
- 2-3s reduction in initial page load
- 500KB+ reduction in bandwidth for initial load
- 20-30% improvement in LCP

---

### 1.3 Font Loading Optimization (Low Risk)

**Impact:** MEDIUM | **Risk:** LOW | **Effort:** LOW

**Problem:**
- Fonts blocking text rendering
- No font-display strategy
- TypeKit loading synchronously

**Solution A: Add font-display to existing fonts**
```javascript
// Add to express/code/scripts/scripts.js
function optimizeFontLoading() {
  // Add font-display to all font-face rules
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'adobe-clean';
      font-display: swap;
    }
  `;
  document.head.prepend(style);
}

// Call early
optimizeFontLoading();
```

**Solution B: Preconnect to font origins**
```html
<!-- Add to head in scripts.js -->
<link rel="preconnect" href="https://use.typekit.net" crossorigin>
<link rel="preconnect" href="https://p.typekit.net" crossorigin>
```

**Expected Impact:**
- 200-500ms improvement in FCP
- Eliminate text flash/invisible text

---

### 1.4 Resource Hints (Non-Invasive)

**Impact:** MEDIUM | **Risk:** NONE | **Effort:** LOW

**Solution: Add preconnect for third-party origins**
```javascript
// Add to express/code/scripts/scripts.js
function addResourceHints() {
  const hints = [
    { rel: 'preconnect', href: 'https://use.typekit.net', crossOrigin: true },
    { rel: 'preconnect', href: 'https://p.typekit.net', crossOrigin: true },
    { rel: 'preconnect', href: 'https://www.adobe.com', crossOrigin: true },
    { rel: 'dns-prefetch', href: 'https://design-assets.adobeprojectm.com' },
  ];
  
  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.crossOrigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// Call immediately
addResourceHints();
```

**Expected Impact:**
- 100-200ms reduction in resource load times

---

## 🎯 Phase 2: Page-Specific Optimizations (Week 2)

### 2.1 Express Home Page Optimizations

**Current Issues:**
- Multiple hero videos
- Heavy interactive elements
- Large carousel

**Optimizations:**

#### A. Hero Video Poster Image
```javascript
// In hero-marquee block
export default function decorate(block) {
  const video = block.querySelector('video');
  if (video && !video.hasAttribute('poster')) {
    // Generate poster from video URL
    const posterUrl = video.src.replace(/\.(mp4|webm)$/, '.jpg') + '?format=webp&width=1200&quality=85';
    video.setAttribute('poster', posterUrl);
  }
}
```

#### B. Defer Below-Fold Carousels
```javascript
// In carousel blocks
export default async function decorate(block) {
  const isAboveFold = block.getBoundingClientRect().top < window.innerHeight * 1.5;
  
  if (!isAboveFold) {
    // Delay initialization until near viewport
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        initCarousel(block);
        observer.disconnect();
      }
    }, { rootMargin: '300px' });
    
    observer.observe(block);
    return;
  }
  
  // Initialize immediately if above fold
  initCarousel(block);
}
```

---

### 2.2 Logo Maker Page Optimizations

**Current Issues:**
- Template thumbnails loading eagerly
- Heavy template-x block

**Optimizations:**

#### A. Lazy Load Template Thumbnails
```javascript
// In template-x block
const images = block.querySelectorAll('img');
images.forEach((img, index) => {
  if (index > 8) { // Only first 8 visible
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
  }
});
```

#### B. Defer Template Search
```javascript
// Load template search API only when search is interacted with
const searchInput = block.querySelector('.search-input');
if (searchInput) {
  searchInput.addEventListener('focus', () => {
    import('./template-search-api-v3.js').then(module => {
      module.initSearch(searchInput);
    });
  }, { once: true });
}
```

---

### 2.3 Feature Pages (Remove Background, Resize)

**Current Issues:**
- Frictionless quick action loading synchronously
- Large preview images

**Optimizations:**

#### A. Optimize Frictionless Block
```javascript
// In frictionless-quick-action block
export default async function decorate(block) {
  // Show skeleton loader immediately
  block.innerHTML = '<div class="frictionless-skeleton">Loading...</div>';
  
  // Load actual functionality after a delay
  requestIdleCallback(() => {
    initFrictionlessTools(block);
  });
}
```

#### B. Compress Preview Images
```javascript
// Add to frictionless utilities
const previewImages = block.querySelectorAll('.preview-image');
previewImages.forEach(img => {
  const url = new URL(img.src);
  url.searchParams.set('quality', '75'); // Lower quality for previews
  url.searchParams.set('format', 'webp');
  img.src = url.toString();
});
```

---

### 2.4 Business Spotlight Page

**Current Issues:**
- Multiple case study images
- Testimonial carousel

**Optimizations:**

#### A. Progressive Image Loading
```javascript
// Load low-quality placeholder first
const images = block.querySelectorAll('img');
images.forEach(img => {
  const lqipUrl = new URL(img.src);
  lqipUrl.searchParams.set('width', '50');
  lqipUrl.searchParams.set('quality', '20');
  
  const placeholder = new Image();
  placeholder.src = lqipUrl.toString();
  placeholder.className = 'lqip-placeholder';
  img.parentNode.insertBefore(placeholder, img);
  
  img.addEventListener('load', () => {
    placeholder.remove();
  });
});
```

---

## 🎯 Phase 3: Advanced Optimizations (Week 3)

### 3.1 Critical CSS Extraction

**Impact:** HIGH | **Risk:** MEDIUM | **Effort:** HIGH

**Implementation:**
```javascript
// Generate critical CSS for above-fold content
import { generateCriticalCSS } from './utils/critical-css.js';

const criticalCSS = generateCriticalCSS([
  '.hero-marquee',
  '.section:first-child',
  'header',
  '.ax-columns:first-child'
]);

// Inline critical CSS
const style = document.createElement('style');
style.textContent = criticalCSS;
document.head.prepend(style);
```

---

### 3.2 Service Worker for Asset Caching

**Impact:** MEDIUM | **Risk:** LOW | **Effort:** MEDIUM

```javascript
// express/code/sw.js
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache images aggressively
  if (url.pathname.match(/\.(jpg|jpeg|png|webp|gif|svg)$/)) {
    event.respondWith(
      caches.open('images-v1').then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request).then(fetchResponse => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
```

---

### 3.3 Dynamic Import for Heavy Libraries

**Impact:** MEDIUM | **Risk:** LOW | **Effort:** MEDIUM

```javascript
// Replace synchronous imports with dynamic imports
// Before:
import { createCarousel } from './widgets/carousel.js';

// After:
const loadCarousel = async () => {
  const { createCarousel } = await import('./widgets/carousel.js');
  return createCarousel;
};
```

---

## 🎯 Phase 4: Monitoring & Fine-Tuning (Week 4)

### 4.1 Real User Monitoring (RUM)

**Implementation:**
```javascript
// Add to scripts.js
function captureWebVitals() {
  if ('PerformanceObserver' in window) {
    // Capture LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      // Send to analytics
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Capture FID
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });
    
    // Capture CLS
    new PerformanceObserver((list) => {
      let cls = 0;
      list.getEntries().forEach(entry => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });
      console.log('CLS:', cls);
    }).observe({ entryTypes: ['layout-shift'] });
  }
}

captureWebVitals();
```

---

### 4.2 Performance Budgets

**Set and enforce budgets:**
```javascript
// performance-budget.json
{
  "budgets": [
    {
      "resourceSizes": [
        { "resourceType": "image", "budget": 500 },
        { "resourceType": "script", "budget": 300 },
        { "resourceType": "stylesheet", "budget": 100 }
      ],
      "timings": [
        { "metric": "interactive", "budget": 3000 },
        { "metric": "first-contentful-paint", "budget": 2000 },
        { "metric": "largest-contentful-paint", "budget": 2500 }
      ]
    }
  ]
}
```

---

## 📊 Success Metrics

### Performance Targets (Per Page)

| Metric | Current | Target | Stretch Goal |
|--------|---------|--------|--------------|
| LCP | 3.5-4.5s | <2.5s | <2.0s |
| FCP | 2.3-3.5s | <1.8s | <1.5s |
| TBT | 10ms | <200ms | <100ms |
| CLS | 0-0.001 | <0.1 | <0.05 |
| Performance Score | 67-76 | 80+ | 90+ |

### Business Metrics

- **Bounce Rate**: Reduce by 10-15%
- **Conversion Rate**: Increase by 5-10%
- **User Engagement**: Increase time on page by 20%

---

## 🛠️ Implementation Checklist

### Week 1: Universal Optimizations
- [ ] Implement image optimization utility
- [ ] Add video lazy loading
- [ ] Optimize font loading strategy
- [ ] Add resource hints
- [ ] Test on all 5 pages
- [ ] Measure baseline metrics
- [ ] Deploy to staging

### Week 2: Page-Specific
- [ ] Optimize Express Home hero
- [ ] Defer carousels on home page
- [ ] Lazy load Logo Maker templates
- [ ] Optimize frictionless blocks
- [ ] Compress Business Spotlight images
- [ ] Test each page individually
- [ ] Deploy to staging

### Week 3: Advanced Features
- [ ] Extract critical CSS
- [ ] Implement service worker
- [ ] Convert to dynamic imports
- [ ] Test thoroughly
- [ ] Performance testing
- [ ] Deploy to staging

### Week 4: Monitoring
- [ ] Set up RUM
- [ ] Configure performance budgets
- [ ] Create monitoring dashboard
- [ ] Document learnings
- [ ] Deploy to production
- [ ] Monitor metrics

---

## 🚨 Risk Mitigation

### Testing Strategy
1. **Visual Regression**: Use Percy or similar for visual testing
2. **Performance Testing**: Test on 3G, 4G, and desktop
3. **A/B Testing**: Deploy to 10% of users first
4. **Rollback Plan**: Feature flags for each optimization

### Monitoring
1. **Real User Monitoring (RUM)**: Track actual user experience
2. **Synthetic Monitoring**: Lighthouse CI in every PR
3. **Error Tracking**: Monitor for JavaScript errors
4. **User Feedback**: Collect feedback on page speed

---

## 📈 Expected Results

### Phase 1 Completion (Week 1)
- **LCP improvement**: 20-30%
- **Page weight reduction**: 150-200KB
- **Performance score**: +5-8 points

### Phase 2 Completion (Week 2)
- **LCP improvement**: 30-40%
- **User engagement**: +10-15%
- **Performance score**: +8-12 points

### Phase 3 Completion (Week 3)
- **LCP improvement**: 40-50%
- **FCP improvement**: 30-40%
- **Performance score**: +12-20 points

### Phase 4 Completion (Week 4)
- **Sustained performance**: Maintain gains
- **Regression prevention**: Catch issues early
- **Performance score**: 80-85+ (target achieved)

---

## 🔄 Continuous Improvement

### Monthly Reviews
- Review RUM data
- Identify performance regressions
- Update performance budgets
- Optimize new pages/features

### Quarterly Goals
- Improve performance scores by 5 points
- Reduce page weight by 10%
- Improve Core Web Vitals by 15%

---

## 📚 Resources & Documentation

### Internal Docs
- [AEM Three-Phase Loading Strategy](.cursor/rules/resource-loading-strategy.mdc)
- [Performance Testing Guide](TESTING_GUIDE.md)
- [Image Optimization Guide](IMAGE_OPTIMIZATION.md)

### External Resources
- [Web.dev Performance](https://web.dev/performance/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)

---

**Last Updated**: {{ current_date }}
**Owner**: Engineering Team
**Status**: Ready for Implementation

