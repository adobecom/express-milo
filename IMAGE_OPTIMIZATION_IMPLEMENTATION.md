# Image Optimization Implementation

## Overview
Implemented responsive image optimization with WebP conversion and srcset/sizes attributes to reduce image payload and improve Core Web Vitals (LCP, FCP).

## Implementation Details

### 1. Responsive Images Utility (`express/code/scripts/utils/responsive-images.js`)
- **Generates `srcset`** with multiple image widths: [400, 800, 1200, 1600]w
- **Generates `sizes`** based on responsive breakpoints
- **Converts to WebP** format for better compression
- **Applies lazy loading** to below-fold images
- **Eager loads** the first image in the first section (LCP candidate)

### 2. Integration (`express/code/scripts/scripts.js`)
```javascript
// After loadArea(), optimize all images in main
import('./utils/responsive-images.js').then((mod) => {
  mod.optimizeImagesInContainer(document.querySelector('main'));
});
```

### 3. Key Features

#### a. Automatic WebP Conversion
- All `.aem.live` images are converted to WebP format
- Quality set to 85 (good balance of size vs. quality)
- Original format as fallback via `src` attribute

#### b. Responsive Sizing
```html
<!-- Before: -->
<img src="image.jpg?width=2000" loading="lazy">

<!-- After: -->
<img 
  src="image.jpg?width=400&format=webp&quality=85" 
  srcset="image.jpg?width=400&format=webp 400w,
          image.jpg?width=800&format=webp 800w,
          image.jpg?width=1200&format=webp 1200w,
          image.jpg?width=1600&format=webp 1600w"
  sizes="(max-width: 600px) 400px,
         (max-width: 900px) 800px,
         (max-width: 1200px) 1200px,
         1600px"
  loading="lazy"
  decoding="async">
```

#### c. LCP Optimization
- First image in first section gets `loading="eager"`
- Prevents lazy loading delay for hero images
- All other images get `loading="lazy"`

#### d. Device Pixel Ratio Support
- Generates multiple resolutions
- Browser automatically selects optimal size based on:
  - Viewport width
  - Device pixel ratio (retina displays)
  - Network conditions

## Expected Results

### Before Optimization
From Lighthouse audit:
- **Image payload:** 487 KB
- **Issues:**
  - Images served at full resolution (2000px) for small devices
  - No WebP conversion
  - No srcset/sizes
  - Oversized images (500x500 served for 4x4 display)

### After Optimization
- **Expected savings:** ~292 KB (60% reduction)
- **Improvements:**
  - Mobile devices get 400px images instead of 2000px
  - WebP format provides ~30% better compression
  - Lazy loading for below-fold images
  - Proper sizing for all viewports

### Lighthouse Improvements Expected
1. ✅ **"Properly size images"** audit should pass
2. ✅ **"Serve images in next-gen formats"** audit should pass
3. ✅ **LCP (Largest Contentful Paint)** should improve by 0.3-0.5s
4. ✅ **Total page weight** reduced by ~292 KB

## Testing Steps

### 1. Manual Testing
```bash
# Clear cache and test on branch
# Open: https://mwpw-181668--express-milo--adobecom.aem.live/express/

# Check Network tab:
1. Verify images are loading as WebP
2. Check srcset attribute on images
3. Verify first image has loading="eager"
4. Verify other images have loading="lazy"
5. Resize viewport - verify different image sizes load
```

### 2. Lighthouse Testing
```bash
# Run Lighthouse in Chrome DevTools
# Compare before/after scores for:
- Performance score
- LCP time
- "Properly size images" audit
- "Serve images in next-gen formats" audit
- Network payload
```

### 3. Visual Regression
- Images should look identical to before (WebP is visually lossless at quality 85)
- No layout shifts (CLS should not increase)
- No broken images or 404s

### 4. Cross-Device Testing
Test on:
- **Mobile (375px)** - should load 400w images
- **Tablet (768px)** - should load 800w images
- **Desktop (1440px)** - should load 1200w or 1600w images
- **Retina display** - should load 2x size for sharpness

## Specific Pages to Test

From Lighthouse analysis, these images have the biggest issues:

### Homepage (express/)
1. **Hero background** - 116 KB → should become ~40 KB
2. **Template thumbnails from design-assets.adobeprojectm.com** - Multiple 165x165 images served as 500x500

### Create/Logo Page
3. **Feature images** - Oversized by ~115 KB

### Background Remover Page
4. **Before/after images** - Need proper responsive sizing

## Block-Specific Optimization (Future Enhancement)

The utility also supports block-specific optimization:
```javascript
// For hero blocks - higher quality, larger sizes
optimizeBlockImages(heroBlock, 'hero-marquee');

// For thumbnails - smaller sizes, lower quality
optimizeBlockImages(templateBlock, 'template-x');
```

## Monitoring

After deployment, monitor:
1. **RUM data** - Real User Monitoring for LCP improvements
2. **CDN cache hit ratio** - Should remain high despite multiple image sizes
3. **Image 404s** - Verify no broken WebP conversions
4. **Page weight** - Should see ~292 KB reduction in median page weight

## Rollback Plan

If issues occur:
1. Comment out the `optimizeImagesInContainer()` call in `scripts.js`
2. Commit and push
3. CDN will invalidate in ~5 minutes

## Notes

- **Skips images already optimized** (with srcset attribute)
- **Only processes AEM images** (`.aem.live` domain)
- **Gracefully handles errors** - doesn't break page if optimization fails
- **Non-blocking** - runs as dynamic import after page load
- **Minimal performance cost** - only DOM manipulation, no network requests

## Related Files
- `express/code/scripts/utils/responsive-images.js` - Core utility
- `express/code/scripts/scripts.js` - Integration point
- `VIDEO_LAZY_LOADING_IMPLEMENTATION.md` - Similar video optimization

