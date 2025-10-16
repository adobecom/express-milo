# Preconnect Hints Test Branch

## 🎯 **What This Branch Tests**

This branch adds **resource hints** (preconnect and dns-prefetch) for critical 3rd-party domains to improve connection times.

## 📝 **What Was Changed**

**File**: `express/code/scripts/scripts.js`

**Added**:
```javascript
// Add preconnect hints for critical 3rd-party domains
// Saves ~200-300ms connection time for Adobe Launch and IMS
const preconnectDTM = createTag('link', { rel: 'preconnect', href: 'https://assets.adobedtm.com', crossorigin: 'anonymous' });
const preconnectIMS = createTag('link', { rel: 'preconnect', href: 'https://auth.services.adobe.com', crossorigin: 'anonymous' });
const dnsPrefetchDemdex = createTag('link', { rel: 'dns-prefetch', href: 'https://dpm.demdex.net' });
const dnsPrefetchAdobe = createTag('link', { rel: 'dns-prefetch', href: 'https://adobe.demdex.net' });

document.head.append(preconnectDTM, preconnectIMS, dnsPrefetchDemdex, dnsPrefetchAdobe);
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

## 🎯 **Expected Results**

| Metric | Baseline (stage) | With Hints | Improvement |
|--------|------------------|------------|-------------|
| **Performance Score** | 81-85 | 82-86 | +1-2 points |
| **FCP** | 1.6-1.9s | 1.5-1.8s | -50-100ms |
| **LCP** | 4.0-4.6s | 3.8-4.4s | -100-200ms |
| **Adobe Launch TTFB** | 300-500ms | 100-200ms | -200-300ms |
| **IMS TTFB** | 250-400ms | 100-150ms | -150-250ms |

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

