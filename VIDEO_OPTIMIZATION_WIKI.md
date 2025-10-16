# Video Lazy Loading Optimization - Implementation Guide

> **Note**: This document contains detailed implementation details for the video lazy loading utility. The actual code is in `express/code/scripts/utils/video.js`.

## Overview

All video elements in the Express Milo codebase should be created through the centralized `video.js` utility to ensure consistent preload strategy and lazy loading behavior. This utility implements intelligent video lazy loading to reduce bandwidth consumption by **4-6 MB per page load**.

## Architecture

### Three-Phase Loading Strategy

The utility follows AEM's Three-Phase Loading Strategy:

- **Phase E (Eager)**: Visible first-section videos → `preload="metadata"`
- **Phase L (Lazy)**: Below-fold or hidden videos → `preload="none"`

### Core Functions

#### `isElementHidden(element)`
Checks if an element is in a hidden container (drawer, accordion, tab, etc.).

**Detection Logic**:
- Element has class `drawer` or `hide`
- Any ancestor has `aria-hidden="true"`
- Any ancestor has class `drawer` or `hide`
- Any ancestor has inline style `display: none`

#### `isInFirstSection(element)`
Checks if element is in the first section (Phase E). Uses cached lookup for performance optimization since the first section never changes after page load.

#### `getPreloadStrategy(container)`
Determines optimal preload strategy based on video position and visibility:
- Returns `'metadata'` for: visible videos in first section
- Returns `'none'` for: below-fold videos or hidden containers

#### `setupLazyLoading(video, container, shouldAutoplay)`
Sets up lazy loading for videos with `preload="none"`. Uses two strategies:

**For Hidden Containers** (drawers, accordions):
- Uses `MutationObserver` to watch for `aria-hidden` attribute changes
- When container becomes visible:
  - Changes preload from `none` → `metadata`
  - Adds `autoplay` attribute if needed
  - Calls `video.load()` to start loading
  - Disconnects observer

**For Below-Fold Videos**:
- Uses `IntersectionObserver` with 300px rootMargin
- Starts loading 300px before video enters viewport
- Same load sequence as hidden containers

## API

### `createOptimizedVideo(options)`

Primary function for creating video elements.

**Parameters**:
```javascript
{
  src: string,              // Video source URL (required)
  container: HTMLElement,   // Container element (required)
  attributes: Object,       // Video attributes (optional)
  poster: string,          // Poster image URL (optional)
  title: string,           // Video title (optional)
  autoOptimize: boolean    // Auto-optimize preload (default: true)
}
```

**Example**:
```javascript
import { createOptimizedVideo } from '../../scripts/utils/video.js';

const video = createOptimizedVideo({
  src: '/path/to/video.mp4',
  container: document.querySelector('.my-container'),
  attributes: {
    playsinline: '',
    muted: '',
    loop: ''
  },
  poster: '/path/to/poster.jpg',
  title: 'My Video'
});

container.appendChild(video);
```

**Returns**: `HTMLVideoElement`

### `optimizeExistingVideo(video)`

Optimizes video elements that were created elsewhere (e.g., by legacy code or third-party libraries).

**Parameters**:
- `video`: HTMLVideoElement - Video element to optimize

**Example**:
```javascript
import { optimizeExistingVideo } from '../../scripts/utils/video.js';

const existingVideo = document.querySelector('video');
optimizeExistingVideo(existingVideo);
```

### `optimizeAllVideos(container)`

Batch optimization for all videos in a container. Useful for optimizing videos after dynamic content loads.

**Parameters**:
- `container`: HTMLElement - Container to search (default: `document`)

**Example**:
```javascript
import { optimizeAllVideos } from '../../scripts/utils/video.js';

// After loading dynamic content
const dynamicSection = document.querySelector('.dynamic-content');
optimizeAllVideos(dynamicSection);
```

## Critical Implementation Details

### Autoplay Video Handling

**Problem**: Browsers ignore `preload` attribute on autoplay videos and always load the full video immediately.

**Solution**: For below-fold autoplay videos:
1. Remove `autoplay` attribute initially
2. Set `preload="none"` to prevent loading
3. Use lazy loading observers
4. Add `autoplay` attribute back when video becomes visible
5. Call `video.load()` to start playback

```javascript
const hasAutoplay = 'autoplay' in attributes;
const shouldDeferAutoplay = hasAutoplay && preload === 'none';

if (shouldDeferAutoplay) {
  delete videoAttributes.autoplay;
}

// Later, when visible:
if (shouldAutoplay) {
  video.setAttribute('autoplay', '');
}
video.load();
```

### Performance Optimizations

1. **Cached First Section Lookup**: `cachedFirstSection` variable prevents repeated DOM queries
2. **Intersection Observer Root Margin**: 300px margin starts loading before viewport for smooth UX
3. **Observer Disconnection**: All observers disconnect after first trigger to prevent memory leaks

## Performance Impact

### Bandwidth Savings
- Express homepage: **~4-6 MB saved** per page load
- Videos load on-demand when users interact with drawers/accordions
- Below-fold videos load only when scrolling near them

### Rendering Performance
- **No LCP/FCP regression**: Videos in hidden drawers don't block initial render
- Videos are not on the critical rendering path
- Lighthouse scores unaffected (videos were already non-blocking)

## Testing Strategy

### Unit Tests
Located in `test/scripts/utils/video.test.js`:
- Preload strategy selection (metadata vs none)
- Hidden container detection
- Autoplay deferral for below-fold videos
- Lazy loading setup
- Video optimization functions

### Integration Testing
Nala tests verify:
- Grid-marquee drawer videos load on hover
- Hidden accordion videos load on expand
- Below-fold videos load on scroll

### Manual Testing
Enable performance monitoring with `?video-perf=true`:
```javascript
console.table({
  'Total Videos Created': 4,
  'Eager Loaded (preload=metadata)': 0,
  'Lazy Loaded (preload=none)': 4,
  'Deferred Autoplay': 0,
  'In Hidden Containers': 4
});
```

## Migration Guide

### For New Blocks
Always use `createOptimizedVideo()`:

```javascript
// ✅ Good
import { createOptimizedVideo } from '../../scripts/utils/video.js';

const video = createOptimizedVideo({
  src: videoUrl,
  container: block,
  attributes: { playsinline: '', muted: '', loop: '' }
});
```

```javascript
// ❌ Bad
const video = document.createElement('video');
video.src = videoUrl;
```

### For Existing Blocks
Use `optimizeExistingVideo()` to retrofit existing videos:

```javascript
import { optimizeExistingVideo } from '../../scripts/utils/video.js';

// After creating video the old way
const video = createTag('video', { src: videoUrl, playsinline: '', muted: '' });
optimizeExistingVideo(video);
```

### For Dynamic Content
Use `optimizeAllVideos()` after content loads:

```javascript
import { optimizeAllVideos } from '../../scripts/utils/video.js';

async function loadMoreContent() {
  const response = await fetch('/api/content');
  container.innerHTML = await response.text();
  
  // Optimize all newly loaded videos
  optimizeAllVideos(container);
}
```

## Troubleshooting

### Videos not loading in drawers
**Symptom**: Video remains blank after opening drawer

**Cause**: Drawer doesn't use `aria-hidden` attribute

**Solution**: Update drawer to use `aria-hidden="true"` when closed

### Autoplay videos loading immediately
**Symptom**: Autoplay videos load full data even when below fold

**Cause**: Video element created before container is in DOM

**Solution**: Create video after container is attached:
```javascript
container.appendChild(otherContent);
block.appendChild(container);
const video = createOptimizedVideo({ src, container });
container.appendChild(video);
```

### Videos loading too late (janky)
**Symptom**: Video starts loading when already in viewport

**Cause**: IntersectionObserver rootMargin too small

**Solution**: Increase rootMargin in `setupLazyLoading()`:
```javascript
{ rootMargin: '500px 0px' } // Load earlier
```

## Related Code

- **Main utility**: `express/code/scripts/utils/video.js`
- **Unit tests**: `test/scripts/utils/video.test.js`
- **Media utility**: `express/code/scripts/utils/media.js` (handles video transformations)
- **Performance monitor**: `express/code/scripts/utils/video-performance-monitor.js`

## Further Reading

- [AEM Three-Phase Loading Strategy](https://wiki.corp.adobe.com/display/WEM/Three-Phase+Loading)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Mutation Observer API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [Video Preload Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload)

## Changelog

### v1.0.0 (Oct 2025) - Initial Implementation
- Centralized video creation utility
- Intelligent preload strategy (Phase E/L)
- Hidden container detection (drawers, accordions)
- Autoplay deferral for below-fold videos
- Lazy loading with Intersection/Mutation Observers
- ~4-6 MB bandwidth savings per page load

