# MWPW-183627 Carousel Branch - Complete Changes Summary

## 📦 New Files Created

### 1. `/express/code/scripts/widgets/simple-carousel.js`
- **Purpose**: Lightweight carousel widget for horizontal scrolling
- **Key Features**:
  - IntersectionObserver for arrow visibility
  - Keyboard navigation
  - Touch/swipe support
  - ARIA accessibility
  - Active item management

### 2. `/express/code/scripts/widgets/simple-carousel.css`
- **Purpose**: Base styles for simple-carousel widget
- **Key Styles**:
  - Arrow buttons: 32px circles with chevron (10px, 2px border, 2px margins)
  - Faders: opacity-based visibility
  - Platform: horizontal scroll with snap

### 3. `/express/code/scripts/widgets/simple-carousel.md`
- **Purpose**: Developer documentation (no comments in code due to no build process)

---

## 📝 Modified Files - Detailed Changes

### 1. `createProductImagesContainer.js`

**OUR CHANGES:**
- Added import: `import createSimpleCarousel from '../../../scripts/widgets/simple-carousel.js';`
- Changed from class export to default export: `export default async function createProductImagesContainer(...)`
- Changed `createProductThumbnailCarousel` return value from `imageThumbnailCarouselContainer` to `carouselWrapper`
- Modified thumbnail structure:
  - Wrapper: `<div class="pdpx-image-thumbnail-carousel-wrapper">` (replaces old container)
  - Items appended to `carouselWrapper` instead of container
  - Added `title: viewKey` attribute to thumbnail buttons (for tooltips)
- Click handler changed:
  - Query scope changed from `imageThumbnailCarouselContainer` to `carouselWrapper`
  - Simplified to `e.currentTarget` instead of `element.currentTarget`
  - Removed srcset/convertImageSize (these are in HEAD/pdp-x-development)
- Added carousel initialization:
  ```javascript
  await createSimpleCarousel('.pdpx-image-thumbnail-carousel-item', carouselWrapper, {
    ariaLabel: 'Product image thumbnails',
    centerActive: true,
    activeClass: 'selected',
  });
  ```

**HEAD/pdp-x-development HAS:**
- Import: `import { convertImageSize, createHeroImageSrcset } from '../utilities/utility-functions.js';`
- In hero image function: `heroImageSrc` parameter name (not `heroImage`)
- In thumbnail function:
  - `const imageURLSmall = convertImageSize(imageURL, '100');`
  - Image attributes: `width: '76', height: '76', loading: 'lazy', decoding: 'async'`
  - Click handler: `productHeroImage.srcset = createHeroImageSrcset(thumbnailImageURL);`
  - Click handler: `productHeroImage.src = convertImageSize(thumbnailImageURL, '500');`

**RESOLUTION STRATEGY:**
- Keep BOTH imports (convertImageSize + createSimpleCarousel)
- Use our carousel structure (carouselWrapper)
- Use HEAD's image optimization (convertImageSize, srcset)
- Use our carousel initialization
- Combine: `const imageURLSmall = convertImageSize(imageURL, '100');` + carousel structure

---

### 2. `createMiniPillOptionsSelector.js`

**OUR CHANGES:**
- Added import: `import createSimpleCarousel from '../../../../scripts/widgets/simple-carousel.js';`
- Added wrapper structure:
  ```javascript
  const miniPillSelectorOptionsWrapper = createTag('div', { class: 'pdpx-mini-pill-selector-options-wrapper' });
  ```
- Pills now appended to wrapper (not directly to container)
- Click handler query scope changed from `miniPillSelectorOptionsContainer` to `miniPillSelectorOptionsWrapper`
- Added conditional carousel initialization (mobile only):
  ```javascript
  if (window.innerWidth < 768) {
    await createSimpleCarousel('.pdpx-mini-pill-container', miniPillSelectorOptionsWrapper, {
      ariaLabel: `${labelText} options`,
      centerActive: false,
      activeClass: 'selected',
    });
  }
  ```
- Final append changed from `optionsContainer` to `miniPillSelectorOptionsWrapper`

**HEAD/pdp-x-development HAS:**
- Different parameter name: `heroImageSrc` vs `heroImage` (throughout)
- Might have performance optimizations or bug fixes

**RESOLUTION STRATEGY:**
- Keep our carousel wrapper structure
- Keep our conditional carousel initialization
- Merge any HEAD performance fixes into our structure

---

### 3. `createSegmentedMiniPillOptionsSelector.js`

**OUR CHANGES:**
- Added import: `import createSimpleCarousel from '../../../../scripts/widgets/simple-carousel.js';`
- Added wrapper structure for BOTH "Classic" and "Vivid" sections:
  ```javascript
  const classicWrapper = createTag('div', { class: 'pdpx-mini-pill-selector-options-wrapper' });
  const vividWrapper = createTag('div', { class: 'pdpx-mini-pill-selector-options-wrapper' });
  ```
- Pills appended to respective wrappers (not containers)
- Click handler query scope changed to use wrappers
- Added conditional carousel initialization for BOTH sections (mobile only):
  ```javascript
  if (window.innerWidth < 768) {
    await createSimpleCarousel('.pdpx-mini-pill-container', classicWrapper, {...});
    await createSimpleCarousel('.pdpx-mini-pill-container', vividWrapper, {...});
  }
  ```

**RESOLUTION STRATEGY:**
- Keep our dual wrapper structure
- Keep our conditional carousel initialization for both sections

---

### 4. `event-handlers.js`

**OUR CHANGES:**
- Removed import: `import createProductImagesContainer from '../createComponents/createProductImagesContainer.js';` (no longer used)
- Modified `updateProductImages` function:
  - Changed to update images IN PLACE (no DOM recreation)
  - Direct `src` update: `heroImg.src = newHeroImgSrc;`
  - Iterate thumbnails and update their `src` attributes
  - Remove `data-skeleton` from updated items
  - Query selector changed from `#pdpx-image-thumbnail-carousel-container` to `#pdpx-image-thumbnail-carousel-wrapper`
- Added `updatePillTextValues` function:
  - Updates pill text/prices without recreating form
  - Queries for pills and updates `textContent`
- Modified `updateCustomizationOptions` logic:
  - Added `data-attribute-keys` check on form
  - Only recreate form if attribute keys change
  - Otherwise call `updatePillTextValues`

**RESOLUTION STRATEGY:**
- Keep our optimized updateProductImages (in-place updates)
- Keep our updatePillTextValues function
- Keep our form recreation prevention logic
- Remove unused createProductImagesContainer import

---

### 5. `print-product-detail.css`

**OUR CHANGES:**

#### **Product Images Section (Lines 171-294):**
- Hero image: `margin-bottom: var(--spacing-100);` (8px mobile/tablet)
- Thumbnail wrapper: `.pdpx-image-thumbnail-carousel-wrapper` styles added
- Carousel platform: `gap: var(--spacing-75);` (4px between thumbnails)
- Faders: gradient backgrounds, 88px width, flex layout
- Arrows: `width/height: var(--spacing-500)` (32px), white background, box-shadow
- Chevrons: `width/height: var(--spacing-100)` (8px), 2.5px borders, 3px margins
- Thumbnails: `width/height: var(--spacing-700)` (48px base size)

#### **Mini-Pill Carousel (Mobile Only, Lines 615-725):**
- Wrapper: `.pdpx-mini-pill-selector-options-wrapper:has(.simple-carousel-container)` styles
- Inside `@media (max-width: 767px)` block:
  - Carousel platform: `flex-wrap: nowrap`, horizontal scroll
  - Faders: 64px width, display: none when arrow-hidden
  - Arrows: 32px size (hardcoded for mobile)
  - Chevrons: `var(--spacing-100)` (8px), 2.5px borders, 3px margins

#### **Tooltip Fixes (Lines 759-806):**
- Tooltips: `left: 0; transform: translate(0, -8px);` (left-aligned to prevent clipping)
- Arrow: `left: 12px; transform: translate(0, -4px) rotate(45deg);`

#### **Desktop Media Query (Lines 1147-1195):**
- Hero image: `margin-bottom: var(--spacing-200);` (12px)
- Thumbnails: `width: 76px; height: 76px;` (hardcoded, no token)
- Specificity: `.pdpx-product-images-container .pdpx-image-thumbnail-carousel-item`
- Specificity: `.pdpx-product-images-container .pdpx-product-hero-image-container`

**HEAD/pdp-x-development MIGHT HAVE:**
- Bug fixes from black-friday-updates
- Other performance CSS tweaks

**RESOLUTION STRATEGY:**
- Keep ALL our carousel-specific CSS
- Merge any HEAD bug fixes that don't conflict
- Ensure our specificity overrides are preserved

---

### 6. `print-product-detail.js`

**OUR CHANGES:**
- Import changed: `import createProductImagesContainer from './createComponents/createProductImagesContainer.js';` remains
- Usage: `const productImagesSection = await createProductImagesContainer(...)` (async/await)

**RESOLUTION STRATEGY:**
- Keep our async/await pattern

---

## 🎯 Key Principles for Conflict Resolution

1. **Image Optimization (HEAD wins)**: Always keep `convertImageSize`, `createHeroImageSrcset` from HEAD
2. **Carousel Structure (OURS wins)**: Keep our wrapper-based carousel structure
3. **Performance (OURS wins)**: Keep our in-place update optimizations
4. **CSS Tokens (OURS wins)**: Keep our token usage (`var(--spacing-XXX)`)
5. **Conditional Carousel (OURS)**: Keep `if (window.innerWidth < 768)` for mini-pills
6. **Tooltips (OURS)**: Keep our left-aligned tooltip fix
7. **Specificity (OURS)**: Keep our increased specificity for desktop overrides

---

## ✅ Checklist for Each Conflict

- [ ] Both imports included (theirs + ours)
- [ ] Carousel structure preserved (wrappers, initialization)
- [ ] Image optimization preserved (convertImageSize, srcset)
- [ ] Performance optimizations preserved (in-place updates)
- [ ] CSS tokens used where available
- [ ] Conditional mobile-only carousel for mini-pills
- [ ] Tooltip left-alignment preserved
- [ ] Desktop specificity overrides preserved

---

## 🚨 Critical Areas - DO NOT BREAK

1. **Thumbnail carousel must ALWAYS initialize** (not conditional)
2. **Mini-pill carousel ONLY on mobile** (`< 768px`)
3. **Hero image srcset must use `createHeroImageSrcset`** (from HEAD)
4. **Thumbnail images must use `convertImageSize(..., '100')`** (from HEAD)
5. **Click handlers must update both `src` AND `srcset`** (combined)
6. **Query selectors must use `carouselWrapper` not old container**
7. **Form recreation prevention logic must be preserved**
8. **Tooltip CSS must remain left-aligned** (not centered)

