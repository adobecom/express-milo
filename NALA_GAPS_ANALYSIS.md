# Nala Test Coverage Gaps for C8 Ignored Code

## Overview
This document identifies the gaps between existing Nala tests and the code marked with `/* c8 ignore */` comments that requires E2E testing.

---

## 1. quotes.js - MISSING RATINGS TESTS ⚠️

**Existing Nala Tests:** ✅ Basic display, carousel navigation  
**Missing Tests:** ❌ **Ratings system (lines 74-250)**

### What Exists:
- ✅ Quote display (default, singular, carousel variants)
- ✅ Author information display
- ✅ Carousel navigation (arrows)
- ✅ Analytics attributes
- ✅ Accessibility checks

### What's Missing (C8 Ignored Code):
- ❌ **Rating submission flow** (lines 74-93: alreadyRated state)
- ❌ **Star rating interaction** (1-5 stars)
- ❌ **Comment submission**
- ❌ **API integration** (`fetchRatingsData`)
- ❌ **"Already rated" state display**
- ❌ **Carousel with ratings** (lines 105-250)
- ❌ **Timer/countdown** (10-second auto-submit)
- ❌ **Lottie animations** (`lazyLoadLottiePlayer`)
- ❌ **Form validation**

### Recommendation:
**Create new test suite:** `quotes-ratings.spec.cjs` and `quotes-ratings.test.cjs`

---

## 2. template-x-promo.js - MISSING ADVANCED TESTS ⚠️

**Existing Nala Tests:** ✅ Basic display  
**Missing Tests:** ❌ **Carousel, API-driven templates (lines 16-910)**

### What Exists:
- ✅ API integration (template loading from Adobe CDN)
- ✅ Template display verification
- ✅ Image loading from design-assets CDN
- ✅ Mobile viewport testing
- ✅ Basic carousel presence

### What's Missing (C8 Ignored Code):
- ❌ **Direct carousel navigation** (lines 16-375: createDirectCarousel)
  - Next/Previous button interaction
  - Carousel state management
  - Wrap-around behavior
  - Touch/swipe gestures
- ❌ **IntersectionObserver height measurement** (within carousel)
  - Height calculation on scroll
  - Min-height setting
  - Resize handling
- ❌ **Desktop layout** (lines 474-809: createDesktopLayout)
  - Grid layout verification
  - Hover states
  - Column count
- ❌ **Template element creation** (lines 432-472)
  - Share button functionality
  - Hover overlays
  - CTA interactions
- ❌ **One-up API data handling** (lines 376-430)
  - Single template display
  - Full-width layout

### Recommendation:
**Enhance existing test suite:** Add carousel interaction, desktop layout, and share functionality tests to `template-x-promo.test.cjs`

---

## 3. frictionless-quick-action.js - NO NALA TESTS ❌

**Existing Nala Tests:** ❌ **NONE**  
**Missing Tests:** ❌ **ALL upload functionality (lines 190-479)**

### What's Missing (C8 Ignored Code):
- ❌ **SDK initialization** (`startSDK`)
- ❌ **File upload flow** (entire workflow)
- ❌ **Progress bar** (`createUploadStatusListener`)
- ❌ **Token validation** (`validateTokenAndReturnService`)
- ❌ **Service initialization** (`initializeUploadService`)
- ❌ **Storage upload** (`uploadAssetToStorage`, `performStorageUpload`)
- ❌ **Upload UI** (`setupUploadUI`)
- ❌ **Editor redirect** (`applySearchParamsToUrl`, `performUploadAction`)
- ❌ **Error handling** (all error states)

### Recommendation:
**Create new test suite:** `frictionless-quick-action.spec.cjs` and `frictionless-quick-action.test.cjs`  
**Priority:** **HIGH** - This is critical user flow with no E2E coverage

---

## 4. template-x/template-rendering.js - NO NALA TESTS ❌

**Existing Nala Tests:** ❌ **NONE**  
**Missing Tests:** ❌ **Share, video, modal functionality (lines 84-209)**

### What's Missing (C8 Ignored Code):
- ❌ **Share functionality** (`share`, `renderShareWrapper`)
  - Copy to clipboard
  - Share button interaction
  - Tooltip display
- ❌ **Video templates** (`getVideoUrls`)
  - Video URL fetching
  - Video metadata
  - Playback controls
- ❌ **Modal iFrame** (`showModaliFrame`)
  - Modal open/close
  - iFrame loading
  - ESC key handling
- ❌ **Print CTA** (`renderPrintCTA`)
  - Print dialog
  - Print preview

### Recommendation:
**Create new test suite:** `template-x-rendering.spec.cjs` and `template-x-rendering.test.cjs`  
**Priority:** **MEDIUM** - Share feature is commonly used

---

## 5. tabs-ax.js & susi-light.js - REVIEW NEEDED 🔍

**Status:** Pre-existing c8 ignore comments  
**Action Required:** Review if Nala tests exist for ignored code

---

## Summary Table

| Block | Existing Nala | Missing Tests | Priority | Lines Ignored |
|-------|---------------|---------------|----------|---------------|
| **quotes** | ✅ Partial | ❌ Ratings system | HIGH | ~176 lines |
| **template-x-promo** | ✅ Partial | ❌ Carousel interactions | MEDIUM | ~835 lines |
| **frictionless-quick-action** | ❌ None | ❌ ALL upload flow | **CRITICAL** | ~290 lines |
| **template-x/template-rendering** | ❌ None | ❌ Share/video/modal | MEDIUM | ~125 lines |
| **tabs-ax** | 🔍 Unknown | 🔍 Review needed | LOW | ~10 lines |
| **susi-light** | 🔍 Unknown | 🔍 Review needed | LOW | ~3 lines |

**Total C8 Ignored Lines:** ~1,439 lines  
**Total Missing E2E Coverage:** ~1,426 lines (99%)

---

## Action Plan

### Phase 1: Critical (Week 1)
1. ✅ Create `NALA_TEST_PLAN.md`
2. ✅ Create `NALA_GAPS_ANALYSIS.md`
3. ⏳ Create `frictionless-quick-action` Nala tests (CRITICAL - no coverage)
4. ⏳ Create `quotes-ratings` Nala tests (HIGH - ratings uncovered)

### Phase 2: Important (Week 2)
5. ⏳ Enhance `template-x-promo` tests (carousel, desktop layout)
6. ⏳ Create `template-x-rendering` tests (share, video, modal)

### Phase 3: Review (Week 3)
7. ⏳ Review `tabs-ax` and `susi-light` existing tests
8. ⏳ Add missing tests if needed

---

**Generated:** October 6, 2025  
**Branch:** MWPW-181177  
**Related:** NALA_TEST_PLAN.md, COVERAGE_IMPROVEMENT_SUMMARY.md

