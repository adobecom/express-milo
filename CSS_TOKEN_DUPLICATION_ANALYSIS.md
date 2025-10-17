# CSS Token Duplication Analysis

**Date:** October 16, 2025  
**Branch:** `dead-code-cleanup`  
**Analysis:** Milo vs. Express `styles.css`

---

## 🎯 Executive Summary

Found **16 duplicated CSS custom properties** between Milo and Express, with **11 having different values** (mostly case differences in hex colors). Express also has **89 unique tokens** for Express-specific features.

### Key Findings:

| Category | Count | Details |
|----------|-------|---------|
| **Milo Tokens** | 110 | Total CSS custom properties in Milo |
| **Express Tokens** | 105 | Total CSS custom properties in Express |
| **Duplicated** | 16 | Tokens that appear in both files |
| **Same Values** | 5 | Duplicates with identical values (31.2%) |
| **Different Values** | 11 | Duplicates with differing values (68.8%) |
| **Express-Only** | 89 | Unique to Express (not in Milo) |

---

## ❌ Duplicated Tokens with Different Values (11)

### 1. `--body-font-family` - **Font Order Difference**

| Source | Value |
|--------|-------|
| **Milo** | `'Adobe Clean', adobe-clean, 'Trebuchet MS', sans-serif` |
| **Express** | `'adobe-clean', 'Adobe Clean', 'Trebuchet MS', sans-serif` |

**Impact:** Minor - Both will work, but inconsistent ordering  
**Recommendation:** Use Milo's order (capitalized first)

---

### 2-11. Color Tokens - **Case Differences Only**

All color differences are purely case (uppercase vs lowercase hex values):

| Token | Milo | Express |
|-------|------|---------|
| `--color-brand-title` | `#000B1D` | `#000b1d` |
| `--color-gray-100` | `#F8F8F8` | `#f8f8f8` |
| `--color-gray-200` | `#E8E8E8` | `#e8e8e8` |
| `--color-gray-300` | `#D4D4D4` | `#d4d4d4` |
| `--color-gray-400` | `#B6B6B6` | `#b6b6b6` |
| `--color-info-accent` | `#5C5CE0` | `#5c5ce0` |
| `--color-info-accent-down` | `#3D3DB4` | `#3d3db4` |
| `--color-info-accent-hover` | `#4646C6` | `#4646c6` |
| `--color-info-accent-light` | `#DEDEF9` | `#dedef9` |
| `--color-white` | `#FFF` | `#fff` |

**Impact:** None - CSS is case-insensitive for hex colors  
**Recommendation:** Standardize on lowercase for consistency

---

## ✅ Duplicated Tokens with Same Values (5)

These can potentially be removed from Express and imported from Milo:

| Token | Value (Same in Both) |
|-------|----------------------|
| `--color-black` | `#000` |
| `--color-gray-500` | `#909090` |
| `--color-gray-600` | `#707070` |
| `--color-gray-700` | `#505050` |
| `--color-gray-800` | `#404040` |

---

## 🔍 Critical Issue: `tabs-ax.css` Hardcoding

**File:** `express/code/blocks/tabs-ax/tabs-ax.css`

### The Problem

```css
:root {
  /* @TODO REMOVE IMPORTS DIRECTLY FROM MILO STYLE.CSS */

  /* Spacing */
  --spacing-xxs: 8px;      /* ← Duplicated from Milo! */
  --spacing-xs: 16px;      /* ← Duplicated from Milo! */
  --spacing-s: 24px;       /* ← Duplicated from Milo! */
  --spacing-m: 32px;       /* ← Duplicated from Milo! */
  --spacing-l: 40px;       /* ← Duplicated from Milo! */
  --spacing-xl: 48px;      /* ← Duplicated from Milo! */
  --spacing-xxl: 56px;     /* ← Duplicated from Milo! */
  --spacing-xxxl: 80px;    /* ← Duplicated from Milo! */

  /* grid sizes */
  --grid-container-width: 83.4%;  /* ← Duplicated from Milo! */
}
```

### Why This Is Bad:

1. **Maintenance burden:** Changes to Milo spacing need manual updates in Express
2. **Drift risk:** Values can get out of sync
3. **Unnecessary duplication:** Adding 9 redundant CSS variables

### The Solution:

**Option A: Remove duplication (Recommended)**
```css
/* tabs-ax.css - cleaned up */
:root {
  /* Tab Colors */
  --tabs-active-color: #1473e6;
  --tabs-border-color: #d8d8d8;
  /* ... other tab-specific variables ... */
}

/* Use Milo's spacing directly: var(--spacing-m), var(--spacing-xl), etc. */
```

**Option B: Document why duplication is necessary**
If there's a specific reason (e.g., tabs-ax needs different spacing values in the future), document it:
```css
/* Spacing tokens duplicated from Milo for tabs-ax customization
   TODO: Evaluate if these should diverge from Milo's values */
```

---

## 📊 Express-Only Tokens (89 Unique)

Express has many unique tokens for Express-specific features:

### Categories:

**S2 Buttons (Gen-AI & Premium):**
- `--S2-Buttons-Gen-AI`
- `--S2-Buttons-Premium`
- `--S2-Buttons-Premium-Down`
- `--S2-Buttons-Premium-Hover`

**AX Grid System:**
- `--ax-grid-1-col-width` through `--ax-grid-12-col-width`
- `--ax-grid-column-width`
- `--ax-grid-container-width`
- `--ax-grid-gutter`
- `--ax-grid-margin`

**Body Background:**
- `--body-background-color`

**And 80+ more Express-specific tokens...**

---

## 🎯 Recommendations

### Immediate Actions (P0)

1. **Fix `tabs-ax.css` duplication**
   - Remove hardcoded spacing tokens
   - Use Milo's tokens directly
   - Remove TODO comment
   - **Effort:** 10 minutes
   - **Impact:** Reduced maintenance burden

2. **Standardize hex color case**
   - Convert all uppercase hex to lowercase in Express
   - **Effort:** 5 minutes
   - **Impact:** Consistency

3. **Fix `--body-font-family` order**
   - Match Milo's capitalized-first order
   - **Effort:** 1 minute
   - **Impact:** Consistency

### Short-term Actions (P1)

4. **Document Express-only tokens**
   - Add comments explaining unique tokens
   - Group related tokens together
   - **Effort:** 30 minutes
   - **Impact:** Better maintainability

5. **Evaluate duplicate removal**
   - Consider removing 5 identical duplicates
   - Import from Milo instead
   - **Effort:** 1 hour (including testing)
   - **Impact:** Reduced file size

### Long-term Actions (P2)

6. **Create design token system**
   - Centralize all design tokens
   - Use CSS imports or build process
   - **Effort:** 1 week
   - **Impact:** Scalable design system

---

## 📝 Implementation Plan

### Phase 1: Fix `tabs-ax.css` (10 minutes)

```diff
:root {
  /* Tab Colors */
  --tabs-active-color: #1473e6;
  --tabs-border-color: #d8d8d8;
  /* ... */
  
-  /* @TODO REMOVE IMPORTS DIRECTLY FROM MILO STYLE.CSS */
-
-  /* Spacing */
-  --spacing-xxs: 8px;
-  --spacing-xs: 16px;
-  --spacing-s: 24px;
-  --spacing-m: 32px;
-  --spacing-l: 40px;
-  --spacing-xl: 48px;
-  --spacing-xxl: 56px;
-  --spacing-xxxl: 80px;
-
-  /* grid sizes */
-  --grid-container-width: 83.4%;
}
```

### Phase 2: Standardize Color Case (5 minutes)

```diff
:root {
-  --color-brand-title: #000b1d;
+  --color-brand-title: #000b1d;  /* Already lowercase, no change */
  
-  --color-gray-100: #f8f8f8;
+  --color-gray-100: #f8f8f8;     /* Already lowercase, no change */
  /* ... etc ... */
}
```

**Note:** Express colors are already lowercase, so no changes needed!

### Phase 3: Fix Font Family Order (1 minute)

```diff
:root {
-  --body-font-family: 'adobe-clean', 'Adobe Clean', 'Trebuchet MS', sans-serif;
+  --body-font-family: 'Adobe Clean', adobe-clean, 'Trebuchet MS', sans-serif;
}
```

---

## 🧪 Testing Checklist

After making changes:

- [ ] Run linting: `npm run lint:css`
- [ ] Visual regression test tabs-ax block
- [ ] Verify spacing looks correct in tabs
- [ ] Check font rendering across browsers
- [ ] Test dark mode styling
- [ ] Run full test suite: `npm test`

---

## 📈 Expected Impact

**After Phase 1 (tabs-ax fix):**
- **-9 CSS variables** removed
- **-150 bytes** (approx)
- **Reduced maintenance:** No need to manually sync spacing
- **Better consistency:** Using Milo's spacing scale

**After Full Cleanup:**
- **-16 duplicate tokens** (if all removed)
- **-300-500 bytes** (approx)
- **Cleaner codebase**
- **Easier to maintain**

---

## 🚨 Potential Risks

### Risk 1: Breaking Changes

**Concern:** Removing duplicates might break blocks that depend on them

**Mitigation:**
- Test all blocks that use affected tokens
- Run visual regression tests
- Deploy to staging first

### Risk 2: Font Rendering

**Concern:** Changing font-family order might affect rendering

**Mitigation:**
- Both orders work (font cascade)
- Adobe Clean loads regardless
- Minimal visual impact

### Risk 3: Spacing Changes

**Concern:** Removing tabs-ax spacing might change layout

**Mitigation:**
- Milo's spacing tokens have same values
- No visual changes expected
- Test tabs-ax block thoroughly

---

## 💡 Design Token Best Practices

### Current State: Scattered

```
Milo: 110 tokens in styles.css
Express: 105 tokens in styles.css
tabs-ax: 9 duplicate tokens
... other blocks with hardcoded values ...
```

### Recommended State: Centralized

```
Design System:
├── Core Tokens (Milo)
│   ├── Colors
│   ├── Spacing
│   ├── Typography
│   └── Grid
├── Express Overrides
│   ├── Brand Colors
│   └── Express-specific
└── Block-specific
    └── Only truly unique values
```

---

## 📊 Detailed Token Inventory

### Milo Tokens (110)

**Color Tokens:** 40+
**Spacing Tokens:** 20+
**Typography Tokens:** 30+
**Grid Tokens:** 10+
**Misc Tokens:** 10+

### Express Tokens (105)

**Express-specific:** 89
**Duplicated (same):** 5
**Duplicated (different):** 11

### Duplication Rate

```
Duplication Rate = (Duplicated / Express Total) * 100
                 = (16 / 105) * 100
                 = 15.2%
```

**15.2% of Express tokens are duplicates from Milo!**

---

## 🔗 Related Issues

1. **TODO in `tabs-ax.css`** - Remove Milo imports
2. **Case inconsistency** - Uppercase vs lowercase hex
3. **Font family order** - Express vs Milo ordering
4. **Maintenance burden** - Manual syncing of spacing values

---

## 📚 References

- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Design Tokens (W3C)](https://www.w3.org/community/design-tokens/)
- [Milo Design System Documentation](#)
- [Express Style Guide](#)

---

**Last Updated:** October 16, 2025  
**Branch:** `dead-code-cleanup`  
**Status:** ✅ Analysis Complete, Ready for Implementation

