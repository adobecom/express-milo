# Frictionless Quick Action Optimization Plan

## 🔍 Problem Identification

### Current Architecture
- ✅ **Good:** Separate blocks for mobile/desktop (not dual-loading)
  - `frictionless-quick-action` (Desktop)
  - `frictionless-quick-action-mobile` (Mobile)
  - Franklin EDS only loads ONE based on authoring

### ❌ Performance Issue: Eager Video Loading

Both blocks use `transformLinkToAnimation()` which creates **autoplay videos**:
```javascript
// express/code/scripts/utils/media.js:147
const dataAttr = ['playsinline', 'autoplay', 'loop', 'muted'];
```

**Impact:**
- Videos load immediately on page load
- No lazy loading (even if below fold)
- Wastes bandwidth on mobile
- Delays LCP for critical content

---

## 📊 Optimization Strategy

### 1. Lazy Load Frictionless Videos
**Pattern:** Use Intersection Observer (same as grid-marquee videos)

**Before:**
```javascript
if (animation && animation.href.includes('.mp4')) {
  animationContainer.append(transformLinkToAnimation(animation));
}
```

**After:**
```javascript
if (animation && animation.href.includes('.mp4')) {
  const video = transformLinkToAnimation(animation, true, false);
  video.removeAttribute('autoplay'); // Remove autoplay
  video.setAttribute('preload', 'none'); // Don't preload
  animationContainer.append(video);
  
  // Lazy load with Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        video.setAttribute('preload', 'auto');
        video.load();
        video.play();
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '100px' });
  
  observer.observe(video);
}
```

### 2. Optimize Poster Images
- Only load poster initially
- Load full video when in viewport
- Save bandwidth on mobile

---

## 🎯 Implementation Steps

### Step 1: Create Lazy Video Utility
```javascript
// express/code/scripts/utils/lazy-video.js
export function createLazyVideo(videoElement, options = {}) {
  const { rootMargin = '100px' } = options;
  
  // Remove autoplay to prevent eager loading
  videoElement.removeAttribute('autoplay');
  videoElement.setAttribute('preload', 'none');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        videoElement.setAttribute('preload', 'auto');
        videoElement.load();
        
        // Respect original autoplay intent
        if (options.shouldAutoplay) {
          videoElement.play().catch(() => {
            // Ignore play errors (user interaction required)
          });
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin });
  
  observer.observe(videoElement);
  
  return videoElement;
}
```

### Step 2: Update frictionless-quick-action.js
```javascript
import { createLazyVideo } from '../../scripts/utils/lazy-video.js';

// Line 583-585
if (animation && animation.href.includes('.mp4')) {
  const video = transformLinkToAnimation(animation);
  createLazyVideo(video, { shouldAutoplay: true, rootMargin: '200px' });
  animationContainer.append(video);
}
```

### Step 3: Update frictionless-quick-action-mobile.js
```javascript
import { createLazyVideo } from '../../scripts/utils/lazy-video.js';

// Line 269-272
if (animation && animation.href.includes('.mp4')) {
  const video = transformLinkToAnimation(animation, false);
  video.addEventListener('ended', animationEnd);
  createLazyVideo(video, { shouldAutoplay: true, rootMargin: '100px' });
}
```

---

## 📈 Expected Performance Gains

### Before (Eager Loading):
```
Frictionless Page Load:
├── ❌ Hero video loads immediately (2MB)
├── ❌ Blocks LCP while downloading
├── ❌ Autoplay consumes bandwidth
└── Total: 2MB+ wasted if user doesn't scroll
```

### After (Lazy Loading):
```
Frictionless Page Load:
├── ✅ Only poster image loads (50KB)
├── ✅ LCP not blocked
├── ✅ Video loads when visible
└── Total: 2MB saved if below fold
```

**Estimated Gains:**
- 📉 **95% reduction** in initial payload (2MB → 50KB poster)
- 📈 **0.5-1.0s faster LCP** (not blocked by video)
- 📉 **50% bandwidth savings** on mobile (if user doesn't scroll)

---

## 🧪 Testing Plan

### 1. Manual Testing
```bash
# Test on mobile device
open "https://frictionless-device-optimization--express-milo--adobecom.aem.live/express/feature/image/remove-background"

# Check Network tab:
# - Poster image loads immediately
# - Video only loads when scrolled into view
```

### 2. Lighthouse Testing
**Metrics to measure:**
- LCP (should improve by 0.5-1.0s)
- Total Blocking Time (should decrease)
- Network Payload (should decrease by ~2MB)
- Speed Index (should improve)

### 3. Regression Testing
**Ensure:**
- Video still autoplays when visible
- Poster images display correctly
- Animation ended event still fires (mobile)
- Controls work correctly

---

## 🚀 Implementation Priority

**High Priority:**
1. ✅ Lazy load frictionless videos (biggest impact)
2. ✅ Test on mobile and desktop
3. ✅ Lighthouse performance comparison

**Medium Priority:**
4. Optimize poster image sizes
5. Add device-aware video dimensions
6. Consider WebP poster images

**Low Priority:**
7. Add preconnect for video CDN
8. Implement video caching strategy

---

## 📚 References

**Similar Implementations:**
- `grid-marquee.js` - Video lazy loading with Intersection Observer
- `quotes.js` - Device-aware single-container rendering
- `prompt-marquee.js` - Device-aware image loading

**Performance Patterns:**
- `.cursor/rules/lazy-loading-implementation.mdc`
- `.cursor/rules/resource-loading-strategy.mdc`
- `DEVICE_RENDERING_ANALYSIS.md`

---

## ✅ Success Criteria

1. **Performance:** LCP improves by 0.5s+ on mobile
2. **Bandwidth:** 2MB+ saved on initial page load
3. **UX:** Videos still autoplay smoothly when visible
4. **Compatibility:** No regressions in existing functionality
5. **Tests:** All unit tests pass

**Ready to implement!** 🚀

