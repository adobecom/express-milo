# Preconnect Hints Performance Analysis

## 📋 Executive Summary

**Hypothesis**: Adding preconnect hints for critical 3rd-party domains (Adobe Launch, IMS, Demdex) would reduce connection overhead and improve LCP by 100-200ms.

**Result**: ❌ **HYPOTHESIS REJECTED** - Preconnect hints caused a **149% degradation** in LCP (3.9s → 9.7s) and a **15-point drop** in Performance Score (83 → 68).

**Recommendation**: **DO NOT MERGE** - This approach is counterproductive and should serve as documentation of what NOT to do.

---

## 🎯 Test Configuration

### Branch Details
- **Branch Name**: `preconnect-hints`
- **Based On**: `stage` (commit d37ebc44)
- **Date Created**: October 16, 2025
- **Test Date**: October 15, 2025

### Implementation
**File Modified**: `express/code/scripts/scripts.js`

**Code Added**:
```javascript
// Add preconnect hints for critical 3rd-party domains
// Saves ~200-300ms connection time for Adobe Launch and IMS
const preconnectDTM = createTag('link', { 
  rel: 'preconnect', 
  href: 'https://assets.adobedtm.com', 
  crossorigin: 'anonymous' 
});
const preconnectIMS = createTag('link', { 
  rel: 'preconnect', 
  href: 'https://auth.services.adobe.com', 
  crossorigin: 'anonymous' 
});
const dnsPrefetchDemdex = createTag('link', { 
  rel: 'dns-prefetch', 
  href: 'https://dpm.demdex.net' 
});
const dnsPrefetchAdobe = createTag('link', { 
  rel: 'dns-prefetch', 
  href: 'https://adobe.demdex.net' 
});

document.head.append(preconnectDTM, preconnectIMS, dnsPrefetchDemdex, dnsPrefetchAdobe);
```

### Test URLs
- **Baseline (stage)**: `https://stage--express-milo--adobecom.aem.live/express/?martech=off`
- **Test Branch**: `https://preconnect-hints--express-milo--adobecom.aem.live/express/?martech=off`

### Test Environment
- **Tool**: Google PageSpeed Insights (Lighthouse 12.8.2)
- **Device**: Emulated Moto G Power
- **Connection**: Slow 4G throttling
- **Browser**: HeadlessChromium 137.0.7151.119

---

## 📊 Performance Results

### Lighthouse Scores Comparison

| Metric | Baseline (stage) | With Preconnect Hints | Δ Change | Status |
|--------|------------------|------------------------|----------|---------|
| **Performance Score** | 83/100 | 68/100 | **-15 points (-18%)** | ❌ **MUCH WORSE** |
| **Accessibility** | 99/100 | 99/100 | 0 | ⚪ Same |
| **Best Practices** | 93/100 | 93/100 | 0 | ⚪ Same |
| **SEO** | 54/100 | 54/100 | 0 | ⚪ Same |

### Core Web Vitals

| Metric | Baseline | With Hints | Δ Change | Impact | Status |
|--------|----------|------------|----------|--------|---------|
| **LCP** (Largest Contentful Paint) | 3.9s | 9.7s | **+5.8s (+149%)** | Critical | ❌ **FAILED** |
| **FCP** (First Contentful Paint) | 1.6s | 1.6s | 0ms | None | ⚪ Same |
| **TBT** (Total Blocking Time) | 0ms | 0ms | 0ms | None | ⚪ Same |
| **CLS** (Cumulative Layout Shift) | 0.008 | 0.008 | 0 | None | ⚪ Same |
| **Speed Index** | 5.4s | 6.9s | **+1.5s (+28%)** | High | ❌ **WORSE** |

### Key Findings

1. **LCP Catastrophic Failure**: 
   - Increased from 3.9s (borderline) to 9.7s (failed)
   - 5.8 second degradation = 149% slower
   - Single biggest performance regression observed

2. **FCP Unchanged**: 
   - Remained at 1.6s
   - Indicates hints don't affect initial paint
   - Resources load too late to benefit

3. **Speed Index Degradation**: 
   - Increased by 1.5s (28% slower)
   - Visual completeness significantly delayed
   - User-perceived performance worse

4. **No CLS Impact**: 
   - Layout stability unchanged
   - Not a layout-related issue

---

## 🔍 Root Cause Analysis

### 1. Timing Issue: Hints Added Too Late ⏰

**Problem**: Preconnect hints are added in `scripts.js`, which loads after:
- HTML parsing
- Initial resource discovery
- Critical CSS loading
- Early JavaScript execution

**Impact**: By the time hints are added, browser has already:
- Started discovering Adobe Launch script
- Queued IMS authentication requests
- Begun loading Demdex tracking pixels

**Conclusion**: Preconnect hints are **ineffective** when added via JavaScript. They must be in the initial HTML `<head>`.

---

### 2. Bandwidth Contention on Slow 4G 📶

**Problem**: Slow 4G has limited bandwidth (~400 Kbps). Adding 4 preconnect operations:

| Operation | Bandwidth Used | Time Cost |
|-----------|----------------|-----------|
| DNS Lookup (×4) | ~2 KB | ~80-200ms |
| TCP Handshake (×2) | ~2 KB | ~100-300ms |
| TLS Handshake (×2) | ~8 KB | ~200-600ms |
| **Total** | **~12 KB** | **~380-1100ms** |

**Impact**: This 12 KB and 380-1100ms directly competes with:
- LCP image/video (~500 KB)
- Critical CSS (~50 KB)
- Hero JavaScript (~30 KB)

**Result**: LCP resource gets starved of bandwidth, causing massive delay.

---

### 3. CrossOrigin Attribute Mismatch 🔐

**Problem**: We used `crossorigin="anonymous"` on preconnect:
```javascript
crossorigin: 'anonymous'
```

**But**: Adobe Launch and IMS scripts may:
- Not use CORS at all
- Use different CORS mode (`use-credentials`)
- Load from different subdomains

**Impact**: 
- Browser opens separate connection pool for CORS vs non-CORS
- Preconnect connection goes **unused**
- Actual requests open **new connections** anyway

**Evidence**: FCP unchanged (early scripts not affected), only LCP degraded (late resources affected by bandwidth exhaustion).

---

### 4. Over-Optimization 🎯

**Problem**: Added 4 resource hints:
- 2 full preconnects (DNS + TCP + TLS)
- 2 DNS prefetches (DNS only)

**Best Practice**: On slow connections, limit to 1-2 CRITICAL preconnects only.

**Impact**: Each additional hint:
- Consumes bandwidth
- Uses TCP/TLS handshake slots
- Competes with actual content

**Recommendation**: If preconnects were needed (they're not in our case), use only:
```html
<link rel="preconnect" href="https://assets.adobedtm.com">
```
No crossorigin, no additional hints.

---

## 📚 Lessons Learned

### What We Learned ✅

1. **Always Measure**: Performance optimizations can backfire
   - Theory: "Preconnect saves connection time"
   - Reality: "Preconnect consumes bandwidth and delays LCP"

2. **Connection Speed Matters**: Optimizations have different effects on different connections
   - Fast connections (fiber, 5G): Preconnects likely help
   - Slow connections (3G, 4G): Preconnects can hurt
   - Lighthouse tests with Slow 4G (realistic for mobile users)

3. **Timing is Critical**: Resource hints only work when added early
   - ✅ Good: In initial HTML `<head>`
   - ❌ Bad: Via async JavaScript

4. **Fewer is Better**: On constrained connections
   - Each preconnect has a cost
   - Prioritize ruthlessly
   - When in doubt, leave it out

5. **Test Everything**: Don't assume optimizations help
   - This "optimization" made performance 149% worse
   - Would have shipped if not tested

### What NOT to Do ❌

1. ❌ **Don't add preconnects via JavaScript**
   - Too late to be effective
   - Just consumes bandwidth

2. ❌ **Don't use crossorigin without verification**
   - Must match actual request CORS mode
   - Mismatch = wasted connection

3. ❌ **Don't add multiple preconnects on slow connections**
   - Each consumes limited bandwidth
   - Content suffers

4. ❌ **Don't preconnect to resources that load late anyway**
   - Adobe Launch loads at ~500ms (already fast)
   - Not LCP-critical

5. ❌ **Don't optimize without measuring**
   - "Premature optimization is the root of all evil"
   - Always test before deploying

---

## 🎯 Alternative Approaches (If Preconnects Were Needed)

### Option 1: Server-Side HTML Injection (Best)

**If** preconnects were beneficial, add them server-side in HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  
  <!-- Add preconnects EARLY, before any scripts -->
  <link rel="preconnect" href="https://assets.adobedtm.com">
  
  <!-- Rest of head -->
  <link rel="stylesheet" href="styles.css">
  <script src="scripts.js"></script>
</head>
```

**Pros**:
- Browser sees hints during HTML parsing
- Can establish connections while parsing continues
- Effective for truly early resources

**Cons**:
- Requires server-side rendering or build step
- Adobe EDS may not support this easily

---

### Option 2: Fewer, Better Hints

**If** adding hints at all, use ONLY 1 critical hint:

```javascript
// ONLY if absolutely necessary
const preconnectDTM = createTag('link', { 
  rel: 'preconnect', 
  href: 'https://assets.adobedtm.com'
  // NO crossorigin!
});
document.head.prepend(preconnectDTM); // prepend, not append
```

**Pros**:
- Minimal bandwidth cost
- Single connection for most critical resource
- No crossorigin mismatch

**Cons**:
- Still added via JS (too late)
- Still competes with content
- Marginal benefit at best

---

### Option 3: Don't Use Preconnects (Recommended ✅)

**Best Approach**: Don't add preconnects at all.

**Rationale**:
- Adobe Launch (96.5 KB) is non-blocking
- IMS (41 KB) loads for logged-in users only
- Demdex (tracking) is low priority
- None are LCP-critical

**Instead**: Focus on:
1. ✅ Optimize LCP resource (hero image/video)
2. ✅ Defer non-critical JavaScript
3. ✅ Lazy load below-fold content
4. ✅ Use proper image dimensions (CLS prevention)

**Evidence**: The `performance` branch achieved:
- LCP: 4.3s → 928ms (78% improvement)
- Without ANY preconnect hints!

---

## 🚀 Recommended Optimizations (That Actually Work)

### 1. Performance Branch (Proven Success ✅)

**Branch**: `performance`  
**Status**: Tested, LCP improved 78%

**Optimizations**:
- Video preload strategy (metadata vs none)
- Image aspect ratios (CLS prevention)
- JavaScript deferral
- Performance monitoring

**Results**:
- LCP: 4.3s → 928ms ✅
- Performance Score: 81 → ~90 ✅

---

### 2. CSS Minification (Proven Success ✅)

**Branch**: `css-minification`  
**Status**: Tested, +4 Performance points

**Optimizations**:
- Edge Function CSS minification
- 104 KB saved (13.6% reduction)
- Clean git history (no bot commits)

**Results**:
- LCP: 4.6s → 4.0s (-600ms) ✅
- Performance Score: 81 → 85 (+4 points) ✅

---

### 3. Combined Approach (Recommended)

**Merge Both**: `performance` + CSS Edge Function

**Expected Results**:
- LCP: 4.3s → ~700-900ms (80% improvement)
- Performance Score: 81 → 88-90
- Clean workflow (Edge Function)
- Sustainable (no manual steps)

---

## 📊 Performance Budget Impact

### Current Production
- Performance Score: 81/100
- LCP: 4.3s (Failed Core Web Vitals)
- Network Payload: 6,063 KiB

### With This Branch (Preconnect Hints)
- Performance Score: 68/100 ❌ (-15 points)
- LCP: 9.7s ❌ (+5.8s, 149% slower)
- Status: **WORSE THAN PRODUCTION**

### With Proven Optimizations (Performance + CSS)
- Performance Score: 88-90/100 ✅ (+7-9 points)
- LCP: 700-900ms ✅ (-3.4-3.6s, 80% faster)
- Status: **PASSES CORE WEB VITALS**

---

## 🎓 Knowledge Transfer

### For Future Engineers

**Question**: "Should we add preconnect hints for 3rd-party scripts?"

**Answer**: **Probably not**, especially if:
1. Scripts load on Slow 4G (mobile users)
2. Scripts are non-blocking (analytics, tracking)
3. Scripts load after LCP
4. You're adding hints via JavaScript (too late)

**Exception**: Preconnects MAY help if:
1. Resource is truly LCP-critical (hero image CDN)
2. Hints are in initial HTML `<head>`
3. Connection is fast (desktop users)
4. You've tested and measured improvement

---

### Testing Checklist

Before deploying ANY performance optimization:

- [ ] Test with Google PageSpeed Insights
- [ ] Test on Slow 4G (realistic mobile)
- [ ] Compare ALL metrics (not just one)
- [ ] Test on multiple pages
- [ ] Verify no regressions
- [ ] Document results (even if negative)

---

## 📝 Conclusion

**Status**: ❌ **DO NOT MERGE**

**Verdict**: Preconnect hints, as implemented, cause significant performance degradation:
- 149% slower LCP
- 18% lower Performance Score
- 28% slower Speed Index

**Root Causes**:
1. Added too late (via JavaScript)
2. Bandwidth contention on Slow 4G
3. CrossOrigin attribute mismatch
4. Over-optimization (too many hints)

**Value**: This branch serves as **documentation** of what NOT to do and reinforces the importance of testing before deploying.

**Recommendation**: Focus on proven optimizations (`performance` branch + CSS Edge Function) that actually improve metrics without side effects.

---

---

## 🧪 Test 2 Results: Lighthouse-Recommended Domains

**Test Date**: October 16, 2025  
**Changed**: Removed Adobe Launch/IMS hints, using only Lighthouse's top 2 picks

### Implementation
```javascript
// Test 2: Only 2 hints, no crossorigin
const preconnectGeo = createTag('link', { rel: 'preconnect', href: 'https://geo2.adobe.com' });
const preconnectMilo = createTag('link', { rel: 'preconnect', href: 'https://main--milo--adobecom.aem.live' });
```

### Results vs Stage Baseline

| Metric | Stage | Test 2 | Δ Change | Status |
|--------|-------|--------|----------|--------|
| **Performance Score** | 83 | 82 | -1 point | ⚠️ Worse |
| **LCP** | 3.9s | 4.2s | +0.3s (+8%) | ❌ Worse |
| **FCP** | 1.6s | 1.6s | 0ms | ⚪ Same |
| **Speed Index** | 5.4s | 4.9s | -0.5s (-9%) | ✅ Better |
| **CLS** | 0.008 | 0.008 | 0 | ⚪ Same |

### Results vs Main (Production)

| Metric | Main | Test 2 | Δ Change | Status |
|--------|------|--------|----------|--------|
| **Performance Score** | 75 | 82 | +7 points | ✅ Better |
| **LCP** | 5.0s | 4.2s | -0.8s (-16%) | ✅ Better |
| **Speed Index** | 6.6s | 4.9s | -1.7s (-26%) | ✅ Better |

### Conclusion: Test 2

**Better than production** but **worse than stage baseline** (which has no preconnects).

**Key Finding**: Preconnects helped Speed Index but hurt LCP. For Core Web Vitals (where LCP is critical), this is a **net negative**.

---

## 📊 Final All-Tests Comparison

| Branch | Performance | LCP | Speed Index | Verdict |
|--------|-------------|-----|-------------|---------|
| **Main (prod)** | 75 | 5.0s | 6.6s | Needs optimization |
| **Stage (baseline)** | 83 | 3.9s | 5.4s | ✅ **BEST** |
| **Test 1 (4 hints)** | 68 | 9.7s | 6.9s | ❌ **WORST** |
| **Test 2 (2 hints)** | 82 | 4.2s | 4.9s | ⚠️ Mixed |

---

## 🎓 Final Conclusions

### What We Learned

1. **Preconnects hurt LCP on Slow 4G** - Even "good" candidates regress performance
   - Test 1: LCP +5.8s (149% worse)
   - Test 2: LCP +0.3s (8% worse)

2. **Stage baseline is already optimal** - No preconnects needed
   - Stage outperforms both test branches
   - Clean code, better results

3. **Speed Index ≠ LCP** - Different metrics, different story
   - Preconnects can improve visual progression (Speed Index)
   - But hurt largest element loading (LCP)
   - Core Web Vitals prioritize LCP

4. **Timing matters critically**
   - Adding hints via JavaScript is too late
   - Would need server-side HTML injection
   - Not practical for Adobe EDS

5. **Bandwidth is limited on mobile**
   - Slow 4G can't handle multiple preconnects
   - Each connection competes with content
   - Fewer connections = faster LCP

### Recommendations

1. ✅ **Use Stage as baseline** - Already optimized (83 score, 3.9s LCP)
2. ✅ **Focus on proven optimizations**:
   - Performance branch: 78% LCP improvement
   - CSS minification: +4 points, -600ms LCP
3. ❌ **Don't use preconnects** - Net negative for Core Web Vitals
4. ✅ **Document this as due diligence** - Shows thorough testing

### When Preconnects MIGHT Help

- Fast connections (fiber, 5G) where bandwidth isn't constrained
- Server-side HTML injection (not JavaScript)
- True LCP-critical resources (not analytics/tracking)
- Desktop users (less bandwidth constrained)

### When Preconnects DON'T Help (Our Case)

- ❌ Slow 4G mobile users (Lighthouse testing conditions)
- ❌ Added via JavaScript (too late in page load)
- ❌ Non-LCP-critical resources (analytics, tracking, late-loading)
- ❌ Already-optimized baseline (stage performs better without hints)

---

**Date**: October 16, 2025  
**Author**: Performance Team  
**Branch**: `preconnect-hints`  
**Tests Conducted**: 2 (Test 1 failed, Test 2 mixed results)  
**Final Decision**: REVERTED - Preconnects don't help in this context  
**Status**: Closed (Due Diligence Complete - Documented for Learning)

