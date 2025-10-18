# Fix Express Icons 404 Errors - Technical Summary

## Problem Statement

Express homepage was experiencing **40+ wasted 404 network requests** before LCP (Largest Contentful Paint), impacting performance metrics. These requests were attempting to fetch Express icons from Adobe's federal icon server, where they don't exist.

**Express has 447 icons** stored locally in `/express/code/icons/` that are Express-specific and not available on the federal server.

## Root Cause Analysis

### How Milo's Icon System Works

**Step 1: Icon Discovery** (`/milo/libs/utils/utils.js` line 1130)
```javascript
async function decorateIcons(area, config) {
  const icons = area.querySelectorAll('span.icon');  // ← Finds ALL span.icon elements
  if (icons.length === 0) return;
  // ...
  await loadIcons(icons, config);
}
```

**Step 2: Icon Name Extraction** (`/milo/libs/features/icons/icons.js` line 114-117)
```javascript
export default async function loadIcons(icons) {
  const iconPromises = [...icons].map(async (icon) => {
    const iconNameInitial = icon.classList[1].replace('icon-', '');
    // Extracts "ax-blank" from "icon icon-ax-blank"
    const svgElement = await getIcon(iconName);
  });
}
```

**Step 3: Federal Server Fetch** (`/milo/libs/features/icons/icons.js` line 68-80)
```javascript
async function fetchFederalIcon(iconName) {
  const fedRoot = getFederatedContentRoot();
  const url = `${fedRoot}/federal/assets/icons/svgs/${iconName}.svg`;
  // For ax-blank: https://www.adobe.com/federal/assets/icons/svgs/ax-blank.svg
  
  try {
    const svgElement = await fetchAndParseSVG(url, iconName);  // ← 404 ERROR HERE
    return svgElement;
  } catch (error) {
    return null;  // Falls back after wasting network request
  }
}
```

### Where Icons Come From

Icons are **NOT** injected by JavaScript blocks. They come from **authored content in SharePoint**:

1. **Authoring**: Content authors use syntax like `:icon-ax-blank:` in SharePoint
2. **Server-side**: Franklin converts this to `<span class="icon icon-ax-blank"></span>` in the HTML
3. **Client-side**: This HTML is delivered to the browser before any JS runs
4. **Milo's processing**: Milo's `decorateIcons()` finds all `span.icon` elements and tries to load them

### Found in Blocks

Express icons appear in these blocks:
- `grid-marquee` - Uses icons in drawer panels (e.g., upload, crop, resize, convert)
- `drawer-cards` - Uses icons in card content
- `gen-ai-cards` - Uses AI-related icons
- `discover-cards` - Uses quick action icons
- `ax-columns` - Uses various Express icons

### Example HTML Structure

```html
<div class="grid-marquee">
  <div class="card">
    <div class="face">
      <p>
        <span class="icon icon-ax-blank"></span>
        <a href="...">Start from scratch</a>
      </p>
    </div>
  </div>
</div>
```

## Solution

### Implementation

**Location**: `express/code/scripts/scripts.js` (lines 376-383)

```javascript
// Remove icon class from ALL icons before Milo's decorateArea runs
// Express has its own icon system (getIconElementDeprecated) with 447 icons in /express/code/icons/
// Milo's icon loader tries to fetch these from federal server, causing wasted 404 requests
// This prevents ALL unnecessary federal icon requests (40+ 404s before LCP)
document.querySelectorAll('span.icon').forEach((icon) => {
  icon.classList.remove('icon');
  icon.classList.add('express-icon'); // Mark as Express-handled
});

// Decorate the page with site specific needs.
decorateArea();
```

**Block Updates**: `grid-marquee.js` and `drawer-cards.js` (2 files)

```javascript
// Updated to find icons with new class name
const icons = panelsFrag.querySelectorAll('.express-icon, .icon');
```

### How It Works

1. **Before** Milo's `decorateArea()` runs, we find all Express icons
2. Remove the `icon` class so Milo's `querySelectorAll('span.icon')` won't find them
3. Add `express-icon` class to mark them as Express-handled
4. Express's own icon system (`getIconElementDeprecated`) handles them separately

### CSS Compatibility

**No CSS changes needed!** Blocks use descendant selectors that target element types, not icon classes:

```css
.grid-marquee .face img {
  border-radius: 8px;
  width: var(--m-img-w);
}

.grid-marquee .face p {
  margin: 0;
  line-height: 20.8px;
}
```

These selectors target:
- ✅ `.face img` - Any `<img>` inside `.face` (regardless of class)
- ✅ `.face p` - Any `<p>` inside `.face` (regardless of class)

They do NOT target:
- ❌ `.icon` class
- ❌ `.icon-ax-*` specific classes
- ❌ `span.icon` elements

## Impact

### Performance Improvements

- **40+ fewer 404 network requests** before LCP
- **Reduced network waterfall** complexity
- **Faster page load** due to eliminated failed requests
- **Cleaner network tab** for debugging

### Before Fix
```
→ GET https://www.adobe.com/federal/assets/icons/svgs/blank.svg (404)
→ GET https://www.adobe.com/federal/assets/icons/svgs/upload.svg (404)
→ GET https://www.adobe.com/federal/assets/icons/svgs/crop.svg (404)
→ GET https://www.adobe.com/federal/assets/icons/svgs/resize.svg (404)
... (36+ more 404 errors)
```

### After Fix
```
✅ No federal icon requests for Express icons
✅ Icons load correctly via Express's icon system (/express/code/icons/)
✅ Visual appearance unchanged
```

## Testing

### Test URL
```
https://fix-icons-404-crp--express-milo--adobecom.aem.live/express/?martech=off
```

### Verification Steps

1. **Open DevTools Network Tab**
2. **Filter**: `federal/assets/icons`
3. **Expected**: No 404 errors for icon SVG files
4. **Visual Check**: All icons display correctly in affected blocks
5. **Performance**: Check LCP improvement in Lighthouse (40+ fewer requests)

### Blocks to Test

Verify icons display correctly in:
- Grid Marquee (homepage hero)
- Gen AI Cards
- Discover Cards
- AX Columns

## Technical Details

### Express's Icon System

Express has its own icon loading system that's separate from Milo:

**Function**: `getIconElementDeprecated()` in `express/code/scripts/utils.js`

```javascript
export function getIconElementDeprecated(icons, size, alt, additionalClassName, altSrc) {
  const icon = getIconDeprecated(icons, alt, size, altSrc);
  if (additionalClassName) icon.classList.add(additionalClassName);
  return icon;
}
```

This system:
- Loads icons from `/express/code/icons/${icon}.svg`
- Creates `<img>` tags with appropriate classes
- Handles Express-specific icons independently

## Files Changed

- `express/code/scripts/scripts.js` - Filter all icons before Milo runs (+8 lines)
- `express/code/blocks/grid-marquee/grid-marquee.js` - Update icon query (+1 line)
- `express/code/blocks/drawer-cards/drawer-cards.js` - Update icon query (+1 line)

## Dependencies

- None - This is a pure Express-side solution

## Rollback Plan

If issues arise, simply revert the commit. The change is isolated to one location and easy to undo.

## Related Issues

- MWPW-182306: Remove dependency on deprecated `federated.js`
- Performance improvements for Express homepage LCP

## Success Metrics

- [ ] Zero 404 errors for icon SVGs in Network tab (filter: `federal/assets/icons`)
- [ ] All icons display correctly in grid-marquee and drawer-cards blocks
- [ ] No visual regressions in any Express blocks
- [ ] Improved LCP score (40+ fewer network requests before LCP)
- [ ] Clean Lighthouse report (no icon-related warnings)

