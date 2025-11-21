# Code Duplication Analysis: Mobile Fork Button Variants

## File Size Summary

| File | Lines of Code | Unique Code | Shared/Duplicated Code |
|------|--------------|-------------|------------------------|
| mobile-fork-button.js | 139 | ~70 | ~69 |
| mobile-fork-button-dismissable.js | 200 | ~131 | ~69 |
| mobile-fork-button-frictionless.js | 134 | ~65 | ~69 |
| **TOTAL** | **473** | **266** | **~207** (counted 3x) |

**Actual codebase if deduplicated: ~266 + 69 = ~335 lines**  
**Current codebase: 473 lines**  
**Redundant code: ~138 lines (29% of total)**

---

## Detailed Line-by-Line Breakdown

### 1. Imports & Module Setup (Lines 1-6)

**Status:** Nearly Identical (minor variations)

```javascript
// Base & Dismissable (identical)
import { getLibs, getMobileOperatingSystem, getIconElementDeprecated, addTempWrapperDeprecated } from '../../scripts/utils.js';
import { createFloatingButton } from '../../scripts/widgets/floating-cta.js';
let createTag; let getMetadata;

// Frictionless (different - imports createTag directly)
import { createTag, getMobileOperatingSystem, getLibs, addTempWrapperDeprecated, getIconElementDeprecated } from '../../scripts/utils.js';
import { createFloatingButton } from '../../scripts/widgets/floating-cta.js';
```

**Lines per file:** ~4-6 lines  
**Duplication:** ~4 lines (could be standardized)

---

### 2. LONG_TEXT_CUTOFF Constant (Line 6)

**Status:** 100% Identical

```javascript
const LONG_TEXT_CUTOFF = 70;
```

**Lines per file:** 1 line  
**Duplication:** 1 line × 3 files = 3 total

---

### 3. getTextWidth() Function (Lines 8-14)

**Status:** 100% Identical

```javascript
const getTextWidth = (text, font) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};
```

**Lines per file:** 7 lines  
**Duplication:** 7 lines × 3 files = 21 lines  
**✅ EXTRACTABLE**

---

### 4. buildAction() Function (Lines 16-26)

**Status:** 98% Identical (minor optional chaining difference)

```javascript
// Base & Dismissable version (with optional chaining)
function buildAction(entry, buttonType) {
  const wrapper = createTag('div', { class: 'floating-button-inner-row mobile-gating-row' });
  const text = createTag('div', { class: 'mobile-gating-text' });
  text.textContent = entry?.iconText;
  const a = entry?.anchor;
  if (a) {
    a.classList.add(buttonType, 'button', 'mobile-gating-link');
    wrapper.append(entry?.icon || null, text, a);
  }
  return wrapper;
}

// Frictionless version (no optional chaining)
function buildAction(entry, buttonType) {
  const wrapper = createTag('div', { class: 'floating-button-inner-row mobile-gating-row' });
  const text = createTag('div', { class: 'mobile-gating-text' });
  text.textContent = entry.iconText;  // <-- difference
  const a = entry.anchor;             // <-- difference
  a.classList.add(buttonType, 'button', 'mobile-gating-link');
  wrapper.append(entry.icon, text, a); // <-- difference
  return wrapper;
}
```

**Lines per file:** 11 lines  
**Duplication:** 11 lines × 3 files = 33 lines  
**✅ EXTRACTABLE** (use optional chaining for safety)

---

### 5. buildMobileGating() Function (Lines 28-36)

**Status:** 100% Identical

```javascript
function buildMobileGating(block, data) {
  block.children[0].remove();
  const header = createTag('div', {
    class:
      'mobile-gating-header',
  });
  header.textContent = data.forkButtonHeader;
  block.append(header, buildAction(data.tools[0], 'accent'), buildAction(data.tools[1], 'outline'));
}
```

**Lines per file:** 9 lines  
**Duplication:** 9 lines × 3 files = 27 lines  
**✅ EXTRACTABLE**

---

### 6. createMultiFunctionButton() Function (Lines 38-43)

**Status:** 95% Identical (only class name differs)

```javascript
// Base & Dismissable version
export async function createMultiFunctionButton(block, data, audience) {
  const buttonWrapper = await createFloatingButton(block, audience, data);
  buttonWrapper.classList.add('multifunction', 'mobile-fork-button');
  buildMobileGating(buttonWrapper.querySelector('.floating-button'), data);
  return buttonWrapper;
}

// Frictionless version
export async function createMultiFunctionButton(block, data, audience) {
  const buttonWrapper = await createFloatingButton(block, audience, data);
  buttonWrapper.classList.add('multifunction', 'mobile-fork-button-frictionless'); // <-- difference
  buildMobileGating(buttonWrapper.querySelector('.floating-button'), data);
  return buttonWrapper;
}
```

**Lines per file:** 6 lines  
**Duplication:** 6 lines × 3 files = 18 lines  
**✅ EXTRACTABLE** (with className parameter)

---

### 7. androidCheck() Function (Lines 48-51)

**Status:** 100% Identical (Base & Dismissable only)

```javascript
function androidCheck() {
  if (getMetadata('fork-eligibility-check')?.toLowerCase()?.trim() !== 'on') return true;
  return getMobileOperatingSystem() === 'Android';
}
```

**Lines per file:** 4 lines  
**Duplication:** 4 lines × 2 files = 8 lines  
**Note:** Frictionless doesn't have this (uses different eligibility logic)

---

### 8. createMetadataMap() Function (Lines 53-58)

**Status:** 100% Identical

```javascript
function createMetadataMap() {
  return Array.from(document.head.querySelectorAll('meta')).reduce((acc, meta) => {
    if (meta?.name && !meta.property) acc[meta.name] = meta.content || '';
    return acc;
  }, {});
}
```

**Lines per file:** 6 lines  
**Duplication:** 6 lines × 3 files = 18 lines  
**✅ EXTRACTABLE**

---

### 9. createToolData() Function (Lines 60-82)

**Status:** 60% Similar (different logic per variant)

**Base & Dismissable:** Lines 60-82 (23 lines)
- Simple metadata lookup
- Uses `fork-cta-{index}-*` keys
- Creates icon with `getIconElementDeprecated`

**Frictionless:** Lines 54-79 (26 lines)
- Accepts `eligible` parameter
- Uses `-frictionless` suffixed metadata when eligible
- Special handler for `#mobile-fqa-upload` links
- Creates icon with `getIconElementDeprecated`

**Lines per file:** ~23-26 lines  
**Common patterns:** Icon creation logic, anchor creation (~10 lines could be extracted)  
**⚠️ PARTIALLY EXTRACTABLE** (extract icon/anchor creation helpers)

---

### 10. collectFloatingButtonData() Function (Lines 84-118)

**Status:** 75% Similar (structural differences)

**Common structure (all variants):**
- Create metadata map
- Build data object with same core properties
- Loop to create 2 tools
- Check for long text

**Differences:**
- Base: 31 lines (84-114)
- Dismissable: 34 lines (84-117) - adds `forkStickyMobileHref/Text` to mainCta
- Frictionless: 29 lines (81-112) - accepts `eligible` param, passes to `createToolData`

**Lines per file:** ~29-34 lines  
**Common code:** ~25 lines  
**⚠️ PARTIALLY EXTRACTABLE** (could create base template function)

---

### 11. Main decorate() Function (Lines 117-139+)

**Status:** 60-70% Similar

**Common pattern (all variants):**
- Import createTag/getMetadata from utils
- Check eligibility (different logic per variant)
- Add temp wrapper
- Check meta-powered class
- Get audience
- Collect data
- Create button wrapper
- Dispatch linkspopulated event
- Add long-text class if needed

**Differences:**
- Base: 23 lines (117-139) - simple androidCheck()
- Dismissable: 24 lines (177-200) - androidCheck() + mWebVariant() call
- Frictionless: 20 lines (115-134) - different eligibility check

**Lines per file:** ~20-24 lines  
**⚠️ NOT EXTRACTABLE** (variant-specific orchestration)

---

### 12. Dismissable-Specific Functions (Lines 120-175)

**Status:** Unique to dismissable variant

- `mWebStickyCTA()` - 17 lines
- `mWebOverlayScroll()` - 8 lines
- `mWebBuildElements()` - 9 lines
- `mWebCloseEvents()` - 10 lines
- `mWebVariant()` - 6 lines

**Total unique code:** ~61 lines

---

## Summary: Extractable vs Non-Extractable

### ✅ Highly Extractable (100% identical)

| Function | Lines | Total Duplication |
|----------|-------|-------------------|
| `LONG_TEXT_CUTOFF` | 1 | 3 |
| `getTextWidth()` | 7 | 21 |
| `buildMobileGating()` | 9 | 27 |
| `createMetadataMap()` | 6 | 18 |
| **Subtotal** | **23** | **69 lines** |

### ✅ Easily Extractable (95-98% similar)

| Function | Lines | Total Duplication | Note |
|----------|-------|-------------------|------|
| `buildAction()` | 11 | 33 | Use optional chaining |
| `createMultiFunctionButton()` | 6 | 18 | Add className param |
| **Subtotal** | **17** | **51 lines** |

### ⚠️ Partially Extractable (60-75% similar)

| Function | Lines | Potential Savings | Note |
|----------|-------|-------------------|------|
| `createToolData()` | 23-26 | ~10-15 lines | Extract icon/anchor helpers |
| `collectFloatingButtonData()` | 29-34 | ~20-25 lines | Extract base template |
| **Subtotal** | **52-60** | **~30-40 lines** |

### ❌ Not Extractable (variant-specific)

| Code | Lines | Reason |
|------|-------|--------|
| Eligibility checks | 4-8 | Different logic per variant |
| Main `decorate()` | 20-24 | Variant orchestration |
| Dismissable-specific functions | 61 | Unique to one variant |
| Import statements | 4-6 | Minor variations |

---

## Total Savings Potential

### Conservative Estimate (Extract only 100% identical)
- **Lines saved:** 69 lines per file × 2 duplicate files = **138 lines eliminated**
- **New util file:** 69 lines
- **Net reduction:** 138 - 69 = **69 lines (15% reduction)**

### Moderate Estimate (Extract identical + easily extractable)
- **Lines saved:** 120 lines per file × 2 duplicate files = **240 lines eliminated**
- **New util file:** 120 lines
- **Net reduction:** 240 - 120 = **120 lines (25% reduction)**

### Aggressive Estimate (Extract all extractable code)
- **Lines saved:** 150-160 lines per file × 2 duplicate files = **300-320 lines eliminated**
- **New util file:** ~150-160 lines
- **Net reduction:** 150-160 lines = **150-160 lines (32-34% reduction)**

---

## Recommendation

**Implement the Moderate approach:**

1. Create `express/code/scripts/utils/mobile-fork-button-utils.js` (~120 lines)
2. Extract all 100% identical functions (immediate 69-line savings)
3. Extract easily refactorable functions with minor parameterization (additional 51-line savings)
4. Consider creating helper functions for icon/anchor creation (potential 30-40 additional lines)

**Result:**
- More maintainable code
- Easier to fix bugs (fix once, not three times)
- Clearer distinction between variant-specific and shared logic
- ~120-160 line reduction (25-34% smaller codebase)

