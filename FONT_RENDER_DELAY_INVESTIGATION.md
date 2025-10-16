# Font Render Delay Investigation

## 🎯 The Problem

### Lighthouse Findings (Main Branch - Oct 16, 2025)
**URL:** `https://main--express-milo--adobecom.aem.live/express/feature/image/remove-background/png/transparent`

```
Performance: 93
LCP: 3.0s
Speed Index: 2.0s
FCP: 2.0s

LCP Element: <h1>Free transparent PNG maker.</h1>

LCP Breakdown:
├─ TTFB:          600ms (20%) ✅ Good
├─ Load Delay:      0ms (0%)  ✅ Perfect
├─ Load Time:       0ms (0%)  ✅ Perfect
└─ Render Delay: 2,430ms (80%) 🚨 FONT BLOCKING!
```

**The Issue:** The LCP element (the hero `<h1>`) is **blocked for 2.4 seconds** (80% of LCP time) waiting for web fonts to load. The text is ready to paint immediately, but the browser refuses to show it until `adobe-clean` loads from TypeKit.

---

## 🔍 Current Font Setup

### 1. TypeKit (Adobe Fonts)
**Source:** `<link rel="stylesheet" href="https://use.typekit.net/oln4yqj.css">`
- **Loaded by:** Milo's Global Navigation
- **Fonts:** `adobe-clean`, `adobe-clean-serif`
- **Behavior:** **Blocks rendering** until loaded (FOIT - Flash of Invisible Text)

### 2. Local Fallback Font
**File:** `express/code/styles/styles.css`
```css
@font-face {
  font-family: 'Trebuchet MS';
  size-adjust: 90%;
  src: local('Trebuchet MS'), local('TrebuchetMS');
}

:root {
  --body-font-family: 'adobe-clean', 'Adobe Clean', 'Trebuchet MS', sans-serif;
}
```

**Problem:** Even though `Trebuchet MS` is a fallback, the browser **waits for `adobe-clean`** before rendering text, causing the 1.5s delay.

---

## 🧪 Previous Fix Attempt (Failed)

### What We Tried
**Branch:** `dom-reduction-analysis` (later reverted)

**Changes:**
1. **Added `font-display: swap`** to force immediate fallback text:
```css
@font-face {
  font-family: 'Trebuchet MS';
  size-adjust: 90%;
  src: local('Trebuchet MS'), local('TrebuchetMS');
  font-display: swap;  /* Show fallback immediately */
}
```

2. **Added preconnect hints** to speed up TypeKit DNS/connection:
```javascript
// In scripts.js
const typekit = document.createElement('link');
typekit.rel = 'preconnect';
typekit.href = 'https://use.typekit.net';
typekit.crossOrigin = 'anonymous';
document.head.appendChild(typekit);
```

### Results: CATASTROPHIC FAILURE ❌

| Metric | Baseline | With Font Fix | Delta |
|--------|----------|---------------|-------|
| **Performance** | 86 | **69** | **-17** 🚨 |
| **Speed Index** | 3.4s | **21.9s** | **+18.5s** 🚨 |
| **LCP** | 4.2s | **5.7s** | **+1.5s** ❌ |
| **LCP Render Delay** | 1,480ms | **11,070ms** | **+9,590ms** 🚨 |

**Why it failed:**
- Lighthouse reported: **"No origins were preconnected"** despite the code being present
- `font-display: swap` on **local font fallback** has no effect (it's already local!)
- We need to add `font-display: swap` to **TypeKit's `@font-face`**, which we don't control
- The preconnect didn't work (possibly wrong timing or Milo overrides)

---

## 🤔 Why Is This Hard?

### Problem 1: We Don't Control TypeKit Loading
- TypeKit stylesheet is injected by **Milo's Global Navigation**
- We can't modify the `@font-face` rules inside `use.typekit.net/oln4yqj.css`
- TypeKit uses default font-display behavior (block)

### Problem 2: Preconnect Timing
- Our preconnect hints are added **too late** (after TypeKit is already requested)
- Milo loads TypeKit **before** our scripts run
- We'd need to add preconnect in the **server-side head**

### Problem 3: Font Fallback Mismatch
- `adobe-clean` (web font) vs `Trebuchet MS` (fallback) have different metrics
- Even with `size-adjust: 90%`, they don't match perfectly
- Causes **layout shift** when font swaps

---

## 💡 Potential Solutions

### Option 1: Self-Host Adobe Clean (Best Performance)
**Pros:**
- Full control over font loading
- Can add `font-display: swap` or `optional`
- Faster than TypeKit CDN
- Eliminates external DNS/connection time

**Cons:**
- May violate Adobe licensing
- Need to manage font updates
- Larger repo size

**Impact:** Could eliminate 1.5s render delay

---

### Option 2: Preload TypeKit Stylesheet (Moderate Gain)
**Implementation:**
```html
<!-- Add in server-side head template -->
<link rel="preload" href="https://use.typekit.net/oln4yqj.css" as="style">
<link rel="preconnect" href="https://use.typekit.net" crossorigin>
<link rel="preconnect" href="https://p.typekit.net" crossorigin>
```

**Pros:**
- Easy to implement
- No licensing issues
- Reduces network time

**Cons:**
- Still blocks rendering (no `font-display` control)
- Only saves ~200-300ms
- Requires Milo/Franklin changes

**Impact:** Reduce render delay from 1,480ms → ~1,200ms

---

### Option 3: Inline Critical Fonts (Maximum Performance)
**Implementation:**
1. Extract only the **critical characters** (A-Z, a-z, 0-9, common punctuation)
2. Base64 encode and inline in `<style>` block
3. Add `font-display: optional` to make it non-blocking
4. Lazy-load full TypeKit after LCP

**Pros:**
- Zero network latency for critical text
- Full control over `font-display`
- Eliminates render delay completely

**Cons:**
- Complex implementation
- Larger HTML size (~50-100KB)
- Need to identify critical glyphs
- Maintenance burden

**Impact:** Eliminate 1.5s render delay, but +50KB HTML

---

### Option 4: Use System Fonts Only (Nuclear Option)
**Implementation:**
```css
:root {
  --body-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                      Roboto, sans-serif;
}
```

**Pros:**
- Zero network requests
- Instant rendering
- Best performance possible

**Cons:**
- Breaks brand consistency
- Requires design approval
- Not aligned with Adobe branding

**Impact:** Eliminate render delay, but loses brand fonts

---

### Option 5: Fix TypeKit at Milo Level (Long-term Solution)
**Implementation:**
Request Milo team to:
1. Add `font-display: swap` to TypeKit config
2. Add preconnect hints in `<head>`
3. Defer TypeKit for below-fold pages

**Pros:**
- Fixes it for all Express pages
- Centralized solution
- No maintenance burden

**Cons:**
- Requires Milo team buy-in
- Long timeline
- Not under our control

**Impact:** Could reduce render delay by 50-70%

---

## 📊 Performance Impact Analysis

**Current State:**
- LCP: 3.0s (93 Performance Score)
- Font Render Delay: 2,430ms (80% of LCP)

**Potential Gains:**

| Solution | LCP Improvement | Final LCP | Perf Score | Complexity | Risk | Timeline |
|----------|----------------|-----------|------------|------------|------|----------|
| **Self-host fonts** | -1,800ms | 1.2s | 99+ | High | Medium | 2 weeks |
| **Preload TypeKit** | -500ms | 2.5s | 94-95 | Low | Low | 1 day |
| **Inline critical** | -2,400ms | 0.6s | 100 | Very High | High | 4 weeks |
| **System fonts** | -2,400ms | 0.6s | 100 | Low | Very High | 1 week |
| **Fix Milo** | -1,200ms | 1.8s | 97-98 | Medium | Low | 6 weeks+ |

**Note:** Even a modest -500ms improvement (Preload) would bring LCP from 3.0s → 2.5s, crossing into "good" territory.

---

## 🚨 CRITICAL FINDING: Milo Violates Its Own Guidelines!

**See:** `MILO_FONT_VIOLATION_ANALYSIS.md` for full analysis.

### The Problem
**Milo's Global Navigation** is loading TypeKit **BEFORE LCP** (Phase E), which **directly violates** Milo's official E-L-D performance guidelines.

**Milo Guidelines Say (Lines 92-120):**
- ✅ Fonts MUST load in Phase L (AFTER LCP)
- ❌ NO external connections before LCP
- ❌ NO font preloading before LCP
- ✅ Use non-blocking load with `media="print"` trick

**Current Reality:**
- ❌ TypeKit loads in Phase E (BEFORE LCP)
- ❌ Blocks `<h1>` for 2,430ms (80% of LCP)
- ❌ No `font-display: swap`
- ❌ External connection violates "Single Origin" rule

**Impact:** 2.4 seconds of render delay that **shouldn't exist** per Milo's own rules.

---

## 🎯 Recommended Approach (REVISED)

### Phase 1: Quick Win - Express Override (This Sprint)
**Intercept Milo's TypeKit loading** and defer to Phase L:

```javascript
// At top of scripts.js - intercept Milo's font loading
(function deferFontsToPhaseL() {
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    
    if (tagName.toLowerCase() === 'link') {
      const originalSetAttribute = element.setAttribute.bind(element);
      element.setAttribute = function(name, value) {
        if (name === 'href' && value.includes('typekit.net')) {
          // Defer TypeKit to Phase L (after LCP)
          const observer = new PerformanceObserver((list) => {
            const lcpEntry = list.getEntries()[list.getEntries().length - 1];
            if (lcpEntry) {
              setTimeout(() => {
                element.media = 'print';
                element.onload = () => { element.media = 'all'; };
                originalSetAttribute('href', value);
              }, 100);
              observer.disconnect();
            }
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
          return;
        }
        originalSetAttribute(name, value);
      };
    }
    return element;
  };
}());
```

**Expected gain:** -2,400ms LCP (-80%), Performance 93 → 99+

**Timeline:** 1 week

---

### Phase 2: Proper Fix - Work with Milo Team (Next Sprint)
**Contact Milo team** with analysis:
1. Show that Global Nav violates Milo's E-L-D guidelines
2. Request Phase L font loading implementation
3. Propose `font-display: swap` as interim fix
4. Get timeline for proper fix

**Expected gain:** Permanent solution, all Milo apps benefit

**Timeline:** 4-8 weeks

---

### Phase 3: Monitor & Document (Ongoing)
**Track real-world impact:**
- Monitor Core Web Vitals
- Measure user LCP distribution
- Compare before/after
- Document learnings for Milo team

**Timeline:** Continuous

---

## 🧪 How to Test

### Test 1: Verify Font Blocking
```javascript
// Run in DevTools Console
const entries = performance.getEntriesByType('resource');
const fonts = entries.filter(e => e.name.includes('typekit') || e.name.includes('font'));
console.table(fonts.map(f => ({
  name: f.name,
  startTime: f.startTime,
  duration: f.duration,
  renderBlockingStatus: f.renderBlockingStatus
})));
```

### Test 2: Measure LCP Impact
```javascript
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('LCP element:', entry.element);
    console.log('LCP time:', entry.renderTime);
    console.log('LCP start:', entry.startTime);
  }
}).observe({entryTypes: ['largest-contentful-paint']});
```

### Test 3: Compare Font Strategies
Use Chrome DevTools → Performance → Enable "Web Vitals" lane

---

## 📝 Questions to Answer

1. **Can we modify TypeKit config?**
   - Contact: Milo team
   - Check: Is `font-display` configurable in TypeKit dashboard?

2. **What's the licensing for self-hosting?**
   - Contact: Adobe Legal / Brand team
   - Check: Can Express self-host adobe-clean?

3. **What characters are critical?**
   - Analysis: What text appears above-the-fold?
   - Check: Can we inline just English + numbers?

4. **Is preload/preconnect possible in Franklin?**
   - Contact: Franklin/EDS team
   - Check: Can we modify `<head>` template?

---

## 🧪 Experiment Plan

### Experiment 1: Test System Fonts (Quick Win Test)
**Goal:** Measure maximum possible improvement by eliminating web fonts entirely

**Implementation:**
```css
/* Add to styles.css temporarily */
:root {
  --body-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                      Roboto, 'Helvetica Neue', Arial, sans-serif !important;
}

body, h1, h2, h3, h4, h5, h6 {
  font-family: var(--body-font-family) !important;
}
```

**Expected Results:**
- LCP: 3.0s → 0.6s (-2.4s, -80%)
- Performance: 93 → 100 (+7 points)
- FCP: 2.0s → 0.6s (-1.4s)

**Branch:** `font-optimization-test-1-system-fonts`

---

### Experiment 2: Preload + Preconnect TypeKit
**Goal:** Speed up TypeKit loading without changing fonts

**Implementation:**
```javascript
// Add to scripts.js (very top, before any other code)
(function optimizeFonts() {
  const preconnect1 = document.createElement('link');
  preconnect1.rel = 'preconnect';
  preconnect1.href = 'https://use.typekit.net';
  preconnect1.crossOrigin = 'anonymous';
  
  const preconnect2 = document.createElement('link');
  preconnect2.rel = 'preconnect';
  preconnect2.href = 'https://p.typekit.net';
  preconnect2.crossOrigin = 'anonymous';
  
  const preload = document.createElement('link');
  preload.rel = 'preload';
  preload.href = 'https://use.typekit.net/oln4yqj.css';
  preload.as = 'style';
  
  document.head.prepend(preload, preconnect2, preconnect1);
}());
```

**Expected Results:**
- LCP: 3.0s → 2.3s (-700ms, -23%)
- Performance: 93 → 95 (+2 points)
- Render Delay: 2,430ms → 1,730ms (-700ms)

**Branch:** `font-optimization-test-2-preload`

---

### Experiment 3: Font-Display Swap Override
**Goal:** Force immediate fallback text display

**Implementation:**
```javascript
// Add to scripts.js after Milo loads
(function overrideFontDisplay() {
  // Wait for TypeKit stylesheet to load
  const checkTypeKit = setInterval(() => {
    const stylesheets = Array.from(document.styleSheets);
    const typekitSheet = stylesheets.find(s => s.href?.includes('typekit.net'));
    
    if (typekitSheet) {
      clearInterval(checkTypeKit);
      try {
        const rules = Array.from(typekitSheet.cssRules || []);
        rules.forEach(rule => {
          if (rule.style && rule.style.fontFamily) {
            rule.style.fontDisplay = 'swap';
          }
        });
      } catch (e) {
        // CORS will prevent this, try CSS override instead
        const style = document.createElement('style');
        style.textContent = `
          @font-face {
            font-family: adobe-clean;
            font-display: swap !important;
            src: local('adobe-clean');
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, 50);
}());
```

**Expected Results:**
- LCP: 3.0s → 1.0s (-2.0s, -67%)
- Performance: 93 → 98 (+5 points)
- Render Delay: 2,430ms → 430ms (-2,000ms)

**Branch:** `font-optimization-test-3-font-display`

---

### Experiment 4: Self-Host Adobe Clean
**Goal:** Maximum performance with brand fonts

**Requirements:**
1. Download `adobe-clean` from TypeKit
2. Convert to WOFF2 format
3. Subset to Latin characters only
4. Add font-display: swap

**Implementation:**
```css
/* Replace in styles.css */
@font-face {
  font-family: 'adobe-clean';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/express/code/fonts/adobe-clean-regular.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, 
                 U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, 
                 U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'adobe-clean';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/express/code/fonts/adobe-clean-bold.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, 
                 U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, 
                 U+2212, U+2215, U+FEFF, U+FFFD;
}
```

**Expected Results:**
- LCP: 3.0s → 1.2s (-1.8s, -60%)
- Performance: 93 → 99 (+6 points)
- Render Delay: 2,430ms → 630ms (-1,800ms)
- Font file size: ~40KB per weight (vs ~150KB from TypeKit)

**Branch:** `font-optimization-test-4-self-host`

---

## 🚦 Next Steps

1. ✅ **Document current state** (this file)
2. ✅ **Identify exact render delay** (2,430ms from Lighthouse)
3. 🔄 **Run Experiment 1** (System fonts baseline)
   - Create branch
   - Override fonts
   - Run Lighthouse
   - Document results
4. ⏳ **Run Experiment 2** (Preload TypeKit)
   - If Exp 1 shows improvement, test preload
   - Measure actual gain
5. ⏳ **Run Experiment 3** (Font-display override)
   - Test if we can modify TypeKit rules
   - Measure FOUT vs performance tradeoff
6. ⏳ **Decision point**
   - Present results to team
   - Choose production approach
7. ⏳ **Production implementation**
   - Implement chosen solution
   - Monitor Core Web Vitals
   - Measure user impact

---

## 📚 References

- [Web Font Best Practices](https://web.dev/font-best-practices/)
- [font-display: swap](https://web.dev/font-display/)
- [TypeKit Performance Guide](https://helpx.adobe.com/fonts/using/embed-codes.html)
- [Franklin Font Loading](https://www.aem.live/developer/keeping-it-100)
- [LCP Optimization](https://web.dev/optimize-lcp/)

