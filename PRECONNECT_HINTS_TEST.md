# Preconnect Hints Test Branch

## 🎯 **What This Branch Tests**

**TEST 3 (Current)**: This branch tests **video preload** for the hero video to improve LCP.

**Previous Tests**:
- Test 1: Adobe services preconnects (failed - LCP +5.8s regression)
- Test 2: Lighthouse-recommended preconnects (failed - LCP +0.3s regression)

## 📝 **What Was Changed (Test 3)**

**File**: `express/code/scripts/scripts.js`

**Added**:
```javascript
// Preload hero video to improve LCP (test only - will revert)
// This downloads the video early, potentially improving LCP if video is above-fold
const videoPreload = createTag('link', {
  rel: 'preload',
  href: '/express/assets/video/marketing/homepage/media_1d617584a0b780c7bf8c2ca185a61a247c85298e8.mp4',
  as: 'video',
  type: 'video/mp4',
});
document.head.appendChild(videoPreload);
```

## 🧪 **How to Test**

### **Test URL**
```
https://preconnect-hints--express-milo--adobecom.aem.live/express/
```

### **Comparison URLs**
- **With hints**: `https://preconnect-hints--express-milo--adobecom.aem.live/express/`
- **Baseline (stage)**: `https://stage--express-milo--adobecom.aem.live/express/`

## 📊 **What to Measure**

### **1. Google PageSpeed Insights**

Run on both URLs:
```
https://pagespeed.web.dev/
```

**What to look for:**
- **Performance Score**: Should improve +1-2 points
- **FCP/LCP**: Should improve by 50-150ms
- **"Preconnect to required origins" audit**: Should disappear or show fewer domains

### **2. Chrome DevTools Network Tab**

1. Open DevTools → Network tab
2. Clear cache (Cmd+Shift+R)
3. Load page
4. Filter by domain: `adobedtm.com`, `services.adobe.com`
5. Click on first request from each domain
6. Check "Timing" tab

**What to look for:**
- **Queueing time**: Should be near 0ms (connection already established)
- **Connection time**: Should show "reused" immediately
- **DNS lookup**: Should be 0ms for preconnected domains

### **3. Network Waterfall Comparison**

Compare timing for first requests to:
- `assets.adobedtm.com` (Adobe Launch)
- `auth.services.adobe.com` (IMS)

**Without hints** (baseline):
```
DNS:        20-50ms
TCP:        50-100ms
TLS:        50-150ms
─────────────────────
Total:      120-300ms overhead
```

**With hints** (this branch):
```
DNS:        0ms (preconnected)
TCP:        0ms (preconnected)
TLS:        0ms (preconnected)
─────────────────────
Total:      ~0ms overhead
```

### **4. Lighthouse CLI (Optional)**

```bash
# Baseline
npx lighthouse https://stage--express-milo--adobecom.aem.live/express/ --only-categories=performance --output=json --output-path=baseline.json

# With hints
npx lighthouse https://preconnect-hints--express-milo--adobecom.aem.live/express/ --only-categories=performance --output=json --output-path=hints.json

# Compare
# Look at: performance.score, audits['first-contentful-paint'], audits['largest-contentful-paint']
```

## 🎯 **Expected Results (Test 3 - Video Preload)**

| Metric | Baseline (stage) | With Video Preload | Expected Improvement |
|--------|------------------|--------------------|--------------------|
| **Performance Score** | 81-85 | 82-87 | +1-3 points |
| **FCP** | 1.6s | 1.6s | Unchanged (FCP is not video) |
| **LCP** | 3.9-4.6s | 2.5-3.5s | **-0.5-1.5s (if video is LCP)** |
| **Speed Index** | 5.4s | 4.5-5.0s | -0.4-0.9s |
| **Video Load Start** | 2-3s | 0-0.5s | -1.5-3s (starts immediately) |

**Key Difference from Preconnects:**
- ✅ **Video preload** downloads actual content (hero video)
- ✅ No bandwidth waste if video is LCP element
- ✅ High-priority resource hint
- ⚠️ Will waste bandwidth if video is NOT actually visible/LCP

---

## ❌ **ACTUAL RESULTS - TEST 1 (FAILED)**

**Test Date:** October 15, 2025  
**Test URL:** `https://preconnect-hints--express-milo--adobecom.aem.live/express/`  
**Baseline URL:** `https://stage--express-milo--adobecom.aem.live/express/`  
**Test Type:** Preconnect hints for Adobe services

| Metric | Baseline (stage) | With Hints | Change | Status |
|--------|------------------|------------|--------|--------|
| **Performance Score** | 83 | 68 | **-15 points** | ❌ **WORSE** |
| **FCP** | 1.6s | 1.6s | 0ms | ⚪ Same |
| **LCP** | 3.9s | 9.7s | **+5.8s (149% slower)** | ❌ **MUCH WORSE** |
| **Speed Index** | 5.4s | 6.9s | **+1.5s** | ❌ **WORSE** |
| **CLS** | 0.008 | 0.008 | 0 | ⚪ Same |
| **TBT** | 0ms | 0ms | 0ms | ⚪ Same |

### **Conclusion: NEGATIVE IMPACT**

Preconnect hints **significantly degraded** performance instead of improving it.

### **Why This Failed:**

1. **Timing Issue**: Hints added in `scripts.js` (too late)
   - Browser already discovering resources when hints are added
   - Preconnect needs to be in early `<head>`, not in async JS

2. **Bandwidth Contention**: On Slow 4G, preconnects compete with content
   - 4 simultaneous connections overwhelm limited bandwidth
   - LCP resource (likely hero image/video) gets starved

3. **CrossOrigin Mismatch**: Using `crossorigin="anonymous"` may be wrong
   - If actual requests don't use CORS, separate connection pool
   - Preconnect connection goes unused

4. **Over-optimization**: Too many hints for slow connection
   - 2 full preconnects + 2 DNS prefetches
   - Each consumes bandwidth that could load actual content

### **Lessons Learned:**

- ✅ Always test performance optimizations (don't assume they help)
- ✅ Preconnects work best on fast connections, can hurt on slow
- ✅ Timing matters: hints must be early in `<head>`
- ✅ Fewer is better on constrained connections
- ❌ Don't add preconnects via async JavaScript
- ❌ Don't preconnect to resources that load late anyway

---

## ❌ **ACTUAL RESULTS - TEST 3 (FAILED)**

**Test Date:** October 16, 2025  
**Test URL:** `https://preconnect-hints--express-milo--adobecom.aem.live/express/`  
**Baseline URL:** `https://stage--express-milo--adobecom.aem.live/express/`  
**Test Type:** Video preload for hero video

| Metric | Baseline (stage) | With Video Preload | Change | Status |
|--------|------------------|-----------------------|--------|--------|
| **Performance Score** | 83 | 84 | +1 | ✅ Better |
| **FCP** | 1.6s | 1.6s | 0s | ⚪ Same |
| **LCP** | 4.0s | 4.2s | **+0.2s (5% slower)** | ❌ **WORSE** |
| **Speed Index** | 5.4s | 3.8s | **-1.6s (30% faster)** | ✅ **MUCH BETTER** |
| **CLS** | 0.008 | 0.004 | -0.004 | ✅ Better |
| **TBT** | 0ms | 0ms | 0ms | ⚪ Same |

### **Conclusion: REJECTED (LCP Regression)**

Video preload showed **mixed results** - Speed Index dramatically improved, but LCP (the critical Core Web Vital) regressed.

### **Why This Failed:**

1. **Video is NOT the LCP element**: LCP is a `<p>` text element
   - LCP Element: "Make stunning social posts, images, videos, flyers..."
   - Preloading video doesn't help the actual LCP resource

2. **Bandwidth Competition**: On Slow 4G, preloading video competes with LCP
   - Video file: ~1-2 MB
   - Steals bandwidth from text/image that IS the LCP
   - LCP render delay increased to 1,530ms

3. **Speed Index vs LCP Trade-off**:
   - ✅ Speed Index improved (video makes page look loaded faster)
   - ❌ LCP regressed (actual critical content loads slower)
   - For Core Web Vitals, LCP is what matters

4. **Wrong Resource Prioritized**:
   - Should only preload resources that ARE the LCP element
   - Hero video is below-fold or not the LCP candidate
   - Preload should target the actual text/image LCP

### **Lessons Learned:**

- ✅ Only preload resources that ARE your LCP element
- ✅ Identify LCP element first before adding preload hints
- ✅ Speed Index improvements don't justify LCP regressions
- ✅ On Slow 4G, ANY extra resource competes with critical content
- ❌ Don't preload videos unless they're confirmed to be LCP
- ❌ Don't assume hero videos are LCP (often text/images are)

### **Key Insight:**

This test revealed that the original snippet `<link rel="preload" ... video>` was likely added without confirming the video was actually the LCP element. Preloading non-LCP resources always hurts on constrained connections.

---

## ✅ **Success Criteria**

- ✅ No regression in any metrics
- ✅ Faster TTFB for Adobe Launch and IMS
- ✅ PageSpeed "Preconnect" audit improvement
- ✅ Visible in Network tab (connection reuse)

## 🔍 **Verification Steps**

### **Step 1: Check hints are added**
1. Open test URL
2. Open DevTools → Elements → `<head>`
3. Verify you see:
```html
<link rel="preconnect" href="https://assets.adobedtm.com" crossorigin="anonymous">
<link rel="preconnect" href="https://auth.services.adobe.com" crossorigin="anonymous">
<link rel="dns-prefetch" href="https://dpm.demdex.net">
<link rel="dns-prefetch" href="https://adobe.demdex.net">
```

### **Step 2: Check connection timing**
1. DevTools → Network tab
2. Find first request to `assets.adobedtm.com`
3. Click on it → Timing tab
4. Verify "Queueing" and "Connection" times are minimal

### **Step 3: Run PageSpeed Insights**
1. Test both URLs side-by-side
2. Compare Performance scores
3. Check if "Preconnect" audit improves

## 📋 **What These Hints Do**

### **Preconnect** (Full connection)
```html
<link rel="preconnect" href="https://assets.adobedtm.com" crossorigin="anonymous">
```
- Performs DNS lookup
- Establishes TCP connection
- Completes TLS handshake
- **Use for**: Critical resources that WILL load soon
- **Cost**: ~10KB memory per connection

### **DNS Prefetch** (DNS only)
```html
<link rel="dns-prefetch" href="https://dpm.demdex.net">
```
- Only performs DNS lookup
- Lighter than preconnect
- **Use for**: Resources that might load later
- **Cost**: Minimal

## 🎯 **Why These Domains?**

Based on network waterfall analysis:

1. **assets.adobedtm.com** - Adobe Launch (96.5 KB)
   - Loads very early (first 500ms)
   - Blocking for analytics/personalization
   - ⭐ **CRITICAL** - Full preconnect

2. **auth.services.adobe.com** - Adobe IMS (41 KB)
   - Loads early (first 1s)
   - Required for authentication
   - ⭐ **CRITICAL** - Full preconnect

3. **dpm.demdex.net** - Audience Manager
   - Loads mid-page (1-2s)
   - Non-blocking analytics
   - ⭐ **MEDIUM** - DNS prefetch only

4. **adobe.demdex.net** - Analytics
   - Loads mid-page (1-2s)
   - Non-blocking analytics
   - ⭐ **MEDIUM** - DNS prefetch only

## 🚀 **Next Steps**

1. **Test this branch** with PageSpeed Insights
2. **Compare metrics** with baseline
3. **Verify improvements** are measurable
4. **If successful**: Merge to stage, then production
5. **If not**: Investigate why hints aren't helping

## 💡 **Notes**

- Hints are added early in scripts.js (right after config)
- They work best on slow connections (3G/4G)
- Benefits are smaller on fast connections (fiber/5G)
- Check Network tab for actual timing differences
- Mobile testing will show bigger improvements

---

**Branch**: `preconnect-hints`  
**Based on**: Latest `stage`  
**Status**: Ready for testing  
**Expected impact**: +1-2 Lighthouse points, -50-150ms FCP/LCP

