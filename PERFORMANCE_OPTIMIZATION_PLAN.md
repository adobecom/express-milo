# Adobe Express Homepage Core Web Vitals Optimization Plan

## Current Performance Issues Analysis

Based on the [Adobe Express homepage](https://www.adobe.com/express/), here are the critical Core Web Vitals issues:

### 🚨 LCP (Largest Contentful Paint) Issues
- **Hero video** (`media_1d617584a0b780c7bf8c2ca185a61a247c85298e8.mp4`) is likely the LCP element
- **Multiple large videos** loading simultaneously (4 different video files)
- **No video preloading** or optimization strategies
- **Heavy video payload** before LCP

### 🚨 CLS (Cumulative Layout Shift) Issues
- **Dynamic content loading** - testimonials, pricing cards, logo rows
- **Video loading** causing layout shifts
- **Responsive image switching** between mobile/desktop/tablet
- **JavaScript-driven content** appearing after initial render

### 🚨 FID (First Input Delay) Issues
- **Heavy JavaScript** for interactive features
- **Multiple third-party scripts** (analytics, tracking)
- **Complex carousel and interactive elements**
- **Blocking JavaScript** during page load

## Optimization Strategy

### Phase 1: Critical LCP Optimization (Immediate Impact)

#### 1.1 Hero Video Optimization
```javascript
// Implement in hero-marquee.js
const optimizeHeroVideo = (videoEl) => {
  // Critical: Preload only first frame for LCP
  videoEl.setAttribute('preload', 'metadata');
  videoEl.setAttribute('poster', 'optimized-poster.jpg');
  
  // Lazy load video content after LCP
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        videoEl.setAttribute('preload', 'auto');
        observer.disconnect();
      }
    });
  }, { rootMargin: '100px' });
  observer.observe(videoEl);
};
```

#### 1.2 Image Optimization for Above-the-Fold
```javascript
// Implement in ax-columns.js (already partially done)
const optimizeLCPImages = (block) => {
  const isFirstSection = block.closest('.section') === document.querySelector('.section');
  if (!isFirstSection) return;
  
  const images = block.querySelectorAll('img');
  images.forEach((img, index) => {
    if (index === 0) {
      // First image gets critical optimization
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
      img.setAttribute('width', '800'); // Optimal for mobile LCP
      img.setAttribute('height', '600');
    } else {
      // Other images lazy load
      img.setAttribute('loading', 'lazy');
    }
  });
};
```

### Phase 2: CLS Prevention (Layout Stability)

#### 2.1 Reserve Space for Dynamic Content
```css
/* Add to styles.css */
.hero-marquee {
  min-height: 600px; /* Reserve space for video */
}

.pricing-cards {
  min-height: 400px; /* Reserve space for pricing cards */
}

.testimonials {
  min-height: 200px; /* Reserve space for testimonials */
}
```

#### 2.2 Skeleton Loading States
```javascript
// Implement skeleton loading for dynamic content
const createSkeletonLoader = (container) => {
  const skeleton = document.createElement('div');
  skeleton.className = 'skeleton-loader';
  skeleton.innerHTML = `
    <div class="skeleton-shimmer"></div>
    <div class="skeleton-content">
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>
  `;
  container.appendChild(skeleton);
  return skeleton;
};
```

### Phase 3: FID Improvement (JavaScript Optimization)

#### 3.1 Defer Non-Critical JavaScript
```javascript
// Implement in scripts.js
const deferNonCriticalJS = () => {
  // Defer analytics and tracking scripts
  const analyticsScripts = document.querySelectorAll('script[src*="analytics"]');
  analyticsScripts.forEach(script => {
    script.defer = true;
  });
  
  // Defer carousel and interactive features
  const interactiveScripts = document.querySelectorAll('script[src*="carousel"]');
  interactiveScripts.forEach(script => {
    script.defer = true;
  });
};
```

#### 3.2 Code Splitting for Interactive Features
```javascript
// Implement lazy loading for interactive features
const loadInteractiveFeatures = async () => {
  // Load carousel only when needed
  const carouselBlocks = document.querySelectorAll('.carousel');
  if (carouselBlocks.length > 0) {
    const { default: initCarousel } = await import('./blocks/carousel/carousel.js');
    carouselBlocks.forEach(block => initCarousel(block));
  }
  
  // Load pricing cards only when needed
  const pricingBlocks = document.querySelectorAll('.pricing-cards');
  if (pricingBlocks.length > 0) {
    const { default: initPricing } = await import('./blocks/pricing-cards/pricing-cards.js');
    pricingBlocks.forEach(block => initPricing(block));
  }
};
```

### Phase 4: Advanced Optimizations

#### 4.1 Resource Hints
```html
<!-- Add to head.html -->
<link rel="preconnect" href="https://main--express--adobecom.hlx.page">
<link rel="dns-prefetch" href="https://www.adobe.com">
<link rel="preload" href="/express/assets/video/marketing/homepage/media_1d617584a0b780c7bf8c2ca185a61a247c85298e8.mp4" as="video" type="video/mp4">
```

#### 4.2 Service Worker for Caching
```javascript
// Implement service worker for critical resources
const cacheCriticalResources = () => {
  const criticalResources = [
    '/express/assets/video/marketing/homepage/media_1d617584a0b780c7bf8c2ca185a61a247c85298e8.mp4',
    '/express/code/styles/styles.css',
    '/express/code/scripts/scripts.js'
  ];
  
  // Cache critical resources for faster subsequent loads
  caches.open('critical-v1').then(cache => {
    cache.addAll(criticalResources);
  });
};
```

## Implementation Priority

### Week 1: Critical LCP Fixes
1. ✅ Optimize hero video loading
2. ✅ Implement image optimization for above-the-fold
3. ✅ Add resource hints and preloading

### Week 2: CLS Prevention
1. ✅ Add skeleton loading states
2. ✅ Reserve space for dynamic content
3. ✅ Fix layout shifts from responsive images

### Week 3: FID Improvement
1. ✅ Defer non-critical JavaScript
2. ✅ Implement code splitting
3. ✅ Optimize third-party script loading

### Week 4: Advanced Optimizations
1. ✅ Implement service worker caching
2. ✅ Add performance monitoring
3. ✅ Fine-tune based on real user metrics

## Expected Results

- **LCP**: Improve from ~4s to <2.5s (target: <1.6s)
- **CLS**: Reduce from current to <0.1 (target: <0.05)
- **FID**: Improve from current to <100ms (target: <50ms)
- **Overall Lighthouse Score**: Target 90+ (currently estimated 60-70)

## Monitoring and Validation

1. **Lighthouse CI** integration for automated testing
2. **Real User Monitoring** (RUM) for production metrics
3. **Core Web Vitals** tracking in analytics
4. **A/B testing** for optimization validation

## Files to Modify

- `express/code/blocks/hero-marquee/hero-marquee.js`
- `express/code/blocks/ax-columns/ax-columns.js`
- `express/code/scripts/scripts.js`
- `express/code/styles/styles.css`
- `head.html`
- `web-test-runner.config.js` (for performance testing)
