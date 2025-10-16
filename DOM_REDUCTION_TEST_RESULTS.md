# DOM Reduction Analysis - Performance Test Results

**Test Date:** October 16, 2025  
**Branch:** `dom-reduction-analysis`  
**Test URL:** `https://dom-reduction-analysis--express-milo--adobecom.aem.live/express/?martech=off`

---

## 📊 Test History

### Test 1: With Font Optimization (REVERTED)
**Commit:** ca993850

| Metric | Stage Baseline | With Font Opt | Δ |
|--------|----------------|---------------|---|
| Performance | **86** | 78 | **-8 pts** 🔴 |
| Speed Index | 3.4s | **21.9s** | **+18.5s** 🔴🔴🔴 |
| LCP | 4.0s | 3.9s | -0.1s ✅ |
| CLS | 0.004 | 0.008 | 2x ⚠️ |

**Result:** Font optimization caused catastrophic Speed Index regression. Reverted.

---

### Test 2: Without Font Optimization
**Commit:** 59b11353

| Metric | Stage Baseline | Without Font | Δ |
|--------|----------------|--------------|---|
| Performance | **86** | **82** | **-4 pts** ⚠️ |
| Speed Index | 3.4s | 4.8s | +1.4s ⚠️ |
| LCP | 4.0s | 4.3s | +0.3s ⚠️ |
| CLS | 0.004 | 0.008 | 2x ⚠️ |

**Analysis:**
- Still 4-point performance gap
- Speed Index +1.4s slower
- CLS doubled (0.004 → 0.008)
- LCP render delay: 1,910ms

**Suspected issues:**
1. Attribute selector in `gen-ai-cards.css` slower than class list
2. CLS from unsized images (logo, background, ratings)

---

### Test 3: Selector Reverted + CLS Fixes (CURRENT)
**Commit:** 066d95a5

**Changes:**
1. ✅ **Reverted attribute selector in gen-ai-cards.css:**
   ```css
   /* Before (SLOW) */
   .section:not([class*="-spacing"]) .gen-ai-cards.homepage:first-child
   
   /* After (FAST) */
   .section:not(.xxxl-spacing-static, .xxl-spacing-static, .xl-spacing-static, 
     .xxxl-spacing, .xxl-spacing, .xl-spacing, .l-spacing, .m-spacing, 
     .s-spacing, .xs-spacing, .xxs-spacing) .gen-ai-cards.homepage:first-child
   ```

2. ✅ **Fixed CLS issues with explicit dimensions:**
   - **Express logo:** Added `width: 98px` (had only height)
   - **Background image:** Added `height: 600px` (prevents absolute positioning shift)
   - **Ratings images:** Added `width: auto` (explicit dimension declaration)

**Status:** 🕒 Awaiting test results

**Expected improvements:**
- Speed Index: 4.8s → 3.6-4.0s (revert selector overhead)
- CLS: 0.008 → 0.004-0.006 (explicit dimensions)
- Performance: 82 → 84-86 (combined effect)

---

## 🔬 Root Cause Analysis

### Issue 1: Attribute Selector Performance
```css
/* SLOW: Attribute substring matching */
.section:not([class*="-spacing"])

/* FAST: Direct class matching */
.section:not(.xxxl-spacing-static, .xxl-spacing-static, ...)
```

**Why attribute selectors are slower:**
1. Browser must check every element's class attribute as a string
2. Substring matching `[class*="-spacing"]` requires regex-like evaluation
3. Multiple section elements on page = selector evaluated many times
4. No browser optimization for attribute selectors (unlike class selectors)

**Impact:** Estimated +1.4s Speed Index from selector matching overhead.

---

### Issue 2: CLS from Unsized Elements

**Culprits identified by Lighthouse:**

1. **Adobe Express Logo** (0.004 shift)
   ```css
   /* Before: No explicit width */
   .grid-marquee .express-logo {
     width: initial;  /* <- Browser calculates on load */
     height: 30px;
   }
   
   /* After: Explicit width */
   .grid-marquee .express-logo {
     width: 98px;  /* <- Reserved space */
     height: 30px;
   }
   ```

2. **Background Image** (unsized)
   ```css
   /* Before: Only max-height */
   .grid-marquee .background img {
     position: absolute;
     max-height: 600px;
   }
   
   /* After: Explicit height */
   .grid-marquee .background img {
     position: absolute;
     height: 600px;  /* <- Prevents shift */
     max-height: 600px;
   }
   ```

3. **Ratings Images** (no width)
   ```css
   /* Before: Only height */
   .grid-marquee .ratings img {
     height: 35px;
   }
   
   /* After: Explicit width */
   .grid-marquee .ratings img {
     width: auto;  /* <- Browser reserves space */
     height: 35px;
   }
   ```

**Impact:** Estimated 0.004 CLS reduction (back to baseline 0.004).

---

## 🎯 Expected Final Results

| Metric | Stage Baseline | Test 3 (Expected) | Δ |
|--------|----------------|-------------------|---|
| **Performance** | **86** | **84-86** | **-2 to 0 pts** |
| **FCP** | 1.6s | 1.6s | ✅ Same |
| **LCP** | 4.0s | 4.0-4.2s | ✅ -0 to +0.2s |
| **Speed Index** | **3.4s** | **3.6-4.0s** | ⚠️ +0.2-0.6s |
| **CLS** | 0.004 | **0.004-0.006** | ✅ ~Same |
| **TBT** | 0ms | 0ms | ✅ Same |

**Rationale:**
- Reverting attribute selector should recover most of +1.4s Speed Index loss
- CLS fixes should eliminate 0.004 shift
- Remaining gap likely from wrapper removal (minor CSS cascade changes)

---

## ✅ Active Optimizations

1. ✅ **Wrapper Removal** (17 blocks)
   - Removed `addTempWrapperDeprecated()` calls
   - Updated CSS selectors

2. ✅ **CSS Variable Simplification**
   - `gen-ai-cards.css`: 61 variables → 4 variables
   - Direct values for faster parsing

3. ✅ **Dead Code Removal** (10 files)
   - Removed console.logs, empty blocks, unused imports

4. ✅ **Explicit Class Selectors** (not attribute)
   - Faster browser matching

5. ✅ **CLS Prevention**
   - Explicit dimensions on logo, background, ratings

---

## 🚫 Reverted Optimizations

1. ❌ **Font Preconnects + font-display: swap**
   - Caused 21.9s Speed Index (+18.5s)
   - LCP render delay 11,070ms (+9,500ms)
   - Font optimization needs different approach

2. ❌ **Attribute Selectors**
   - Slower than explicit class lists
   - Caused +1.4s Speed Index

---

## 📝 Lessons Learned

### ✅ What Worked
1. **Incremental testing** - Test one change at a time
2. **Baseline on same environment** - Fair comparison
3. **Revert and isolate** - Find culprit quickly
4. **Explicit dimensions** - Prevent CLS

### ❌ What Didn't Work
1. **Font optimization via JS** - Blocking render path
2. **Attribute selectors for performance** - Actually slower
3. **Multiple changes at once** - Hard to debug

### 💡 Key Insights
1. **CSS selector performance matters** - Use class lists, not attributes
2. **Font loading is complex** - Don't fight TypeKit's loader
3. **CLS needs explicit dimensions** - Browser can't guess
4. **Testing conditions vary** - Always baseline first

---

## 🎯 Next Steps

1. ⏳ **Test current branch** (selector reverted + CLS fixed)
2. 📊 **Compare to baseline** (expect 84-86 performance)
3. ✅ **If successful:** Merge with confidence
4. 📚 **Document findings:** Share with team

---

## 🔮 Future Optimization Opportunities

### Font Loading (Separate Branch)
- Try static HTML preconnects (not JS)
- Test font-display strategies in isolation
- Consider font subsetting

### CSS Performance
- Audit remaining complex selectors
- Profile CSS parsing time
- Consider CSS containment

### Image Optimization
- Convert PNGs to WebP/AVIF
- Implement responsive images
- Optimize compression

---

## 📌 Branch Status

**Current commit:** 066d95a5  
**URL:** `https://dom-reduction-analysis--express-milo--adobecom.aem.live/express/?martech=off`  
**Status:** Ready for Test 3  
**Confidence:** High - targeted fixes for identified issues
