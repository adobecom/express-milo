# Video Analytics Tracking: MILO vs Express Implementation

## Overview

This document compares how MILO handles video tracking versus our custom implementation for Express video analytics, specifically for Adobe TV video play/pause events.

## MILO Video Tracking Implementation

### Architecture
MILO uses a **postMessage-based approach** for video state management through the `adobetv` block.

### Key Components

#### 1. Adobe TV Block (`milo/libs/blocks/adobetv/adobetv.js`)

**Purpose**: Embeds Adobe TV videos and manages their state

**Key Features**:
- Creates iframe with `class="adobetv"`
- Extracts video ID from URL using regex: `/\/v\/(\d+)/`
- Fetches video metadata from Adobe TV API
- Sets up postMessage listener for state changes
- Uses IntersectionObserver for pause-on-scroll functionality

**State Management**:
```javascript
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://video.tv.adobe.com' || !event.data) return;
  const { state, id } = event.data;
  if (!['play', 'pause'].includes(state)
    || !Number.isInteger(id)
    || !iframe.src.startsWith(`${event.origin}/v/${id}`)) return;

  iframe.setAttribute('data-playing', state === 'play');
});
```

**Analytics Integration**: 
- MILO does **NOT** implement video analytics tracking
- Only manages `data-playing` attribute for UI state
- No `_satellite.track` calls for video events

#### 2. Video State Attributes

**`data-playing` Attribute**:
- `"true"` when video is playing
- `"false"` when video is paused
- Set via postMessage events from Adobe TV player
- Used for UI state management (pause on scroll, etc.)

### MILO Analytics Framework

Based on [MILO Analytics Documentation](https://milo.adobe.com/docs/authoring/analytics-review):

**Standard Analytics Structure**:
```
Template: link name(20)-#--Last header before link(20)|s#|b#|blockname(15)
Example: Learn more-1--Recolor your world|s1|b1|marquee
```

**Key Attributes**:
- `daa-ll`: Link analytics (link text, number, header)
- `daa-lh`: Block/section analytics (block number, block name)
- Character limits enforced (20 chars for link text, 15 for block names)

**No Video-Specific Analytics**: MILO's standard analytics framework does not include video play/pause tracking.

## Express Video Tracking Implementation

### Architecture
Express implements **custom video analytics** using MutationObserver to track `data-playing` attribute changes.

### Key Components

#### 1. Video Analytics Tracker (`express/code/scripts/instrument.js`)

**Purpose**: Tracks Adobe TV video play/pause events for analytics

**Implementation**:
```javascript
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'data-playing') {
      const iframe = mutation.target;
      if (iframe.classList.contains('adobetv') && iframe.src) {
        const url = new URL(iframe.src);
        if (url.hostname === 'video.tv.adobe.com') {
          const match = iframe.src.match(/\/v\/(\d+)/);
          const videoId = match ? match[1] : 'unknown';
          const isPlaying = iframe.getAttribute('data-playing') === 'true';
          const state = isPlaying ? 'play' : 'pause';
          const eventName = `adobe.com:express:video:adobe-tv:${state}:${videoId}`;
          console.log('Sending to _satellite.track:', eventName);
          sendEventToAnalytics(eventName);
        }
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['data-playing'],
});
```

#### 2. Event Taxonomy

**Play Events**:
```
adobe.com:express:video:adobe-tv:play:{videoId}
```

**Pause Events**:
```
adobe.com:express:video:adobe-tv:pause:{videoId}
```

**Video Close Events** (existing):
```
adobe.com:express:cta:learn:columns:{videoId}:videoClosed
```

#### 3. Security Implementation

**URL Validation**:
- Uses `new URL(iframe.src)` for secure hostname checking
- Validates `url.hostname === 'video.tv.adobe.com'`
- Prevents URL injection attacks

**Video ID Extraction**:
- Regex pattern: `/\/v\/(\d+)/`
- Fallback to `'unknown'` if no match found
- Handles Adobe TV URL format: `https://video.tv.adobe.com/v/123456`

## Comparison Summary

| Aspect | MILO | Express |
|--------|------|---------|
| **Purpose** | UI State Management | Analytics Tracking |
| **Method** | PostMessage Listener | MutationObserver |
| **Analytics** | ❌ None | ✅ Custom Events |
| **State Tracking** | ✅ `data-playing` attribute | ✅ Observes attribute changes |
| **Security** | Basic URL checking | Secure URL validation |
| **Event Names** | N/A | `adobe.com:express:video:adobe-tv:{state}:{videoId}` |
| **Integration** | MILO blocks | Custom analytics layer |

## Technical Differences

### 1. **Event Handling**
- **MILO**: Direct postMessage → attribute update
- **Express**: PostMessage → attribute update → MutationObserver → analytics

### 2. **Analytics Integration**
- **MILO**: No video analytics (relies on standard link/button tracking)
- **Express**: Custom video event taxonomy with `_satellite.track`

### 3. **State Management**
- **MILO**: Manages `data-playing` for UI purposes
- **Express**: Observes `data-playing` changes for analytics

### 4. **Security**
- **MILO**: Basic origin checking
- **Express**: Full URL parsing and hostname validation

## Implementation Benefits

### Express Approach Advantages:
1. **Non-intrusive**: Doesn't modify MILO's existing video handling
2. **Secure**: Proper URL validation prevents injection attacks
3. **Comprehensive**: Tracks all video state changes automatically
4. **Maintainable**: Clean separation of concerns
5. **Debuggable**: Console logging for event tracking

### Why Not Use MILO's Approach:
1. **No Analytics**: MILO doesn't implement video analytics
2. **Different Purpose**: MILO focuses on UI state, not analytics
3. **Custom Requirements**: Express needs specific event taxonomy
4. **Integration**: Works with existing Express analytics framework

## Conclusion

While MILO provides the foundation for video state management through the `adobetv` block, Express requires a custom analytics layer to track video engagement. Our MutationObserver approach leverages MILO's existing `data-playing` attribute system while adding comprehensive analytics tracking that aligns with Express's analytics requirements.

The implementation successfully bridges the gap between MILO's video functionality and Express's analytics needs, providing secure, maintainable video tracking without modifying the core MILO video handling code.
