# Preconnect Hints Test 2 - Lighthouse Candidates

## 🔄 Test 2: Using Lighthouse-Recommended Domains

**Previous Test**: Failed badly (LCP +5.8s)  
**This Test**: Using Lighthouse's specific suggestions

---

## 📝 Changes from Test 1

### Test 1 (FAILED):
```javascript
// 4 hints, added based on network waterfall analysis
- assets.adobedtm.com (Adobe Launch)
- auth.services.adobe.com (IMS)
- dpm.demdex.net (Demdex)
- adobe.demdex.net (Analytics)
```

### Test 2 (THIS TEST):
```javascript
// 2 hints, based on Lighthouse recommendations
- geo2.adobe.com (300ms estimated savings)
- main--milo--adobecom.aem.live (240ms estimated savings)
```

---

## 🎯 Why These Domains?

### 1. geo2.adobe.com
- **Lighthouse Est. Savings**: 300ms
- **Actual Load Time**: 870ms (relatively early)
- **Purpose**: Geolocation for region-based redirects
- **Critical**: Medium (personalization)
- **Different from Test 1**: Loads earlier, smaller payload

### 2. main--milo--adobecom.aem.live
- **Lighthouse Est. Savings**: 240ms
- **Actual Load Time**: 400-4,000ms (many resources)
- **Purpose**: Milo library resources (utils, blocks, styles)
- **Critical**: High (core functionality)
- **Different from Test 1**: First-party Adobe domain, many resources

---

## 🧪 Test Configuration

### Test URLs
- **Test Branch**: `https://preconnect-hints--express-milo--adobecom.aem.live/express/?martech=off`
- **Baseline**: `https://stage--express-milo--adobecom.aem.live/express/?martech=off`

### Baseline Metrics (from previous test)
- Performance Score: 83
- LCP: 3.9s
- FCP: 1.6s
- Speed Index: 5.4s
- CLS: 0.008

### Success Criteria
- ✅ LCP < 3.9s (no regression, ideally improvement)
- ✅ Performance Score >= 83 (no regression)
- ✅ Speed Index <= 5.4s (no regression)
- ❌ If ANY metric regresses, revert immediately

---

## 🔍 What's Different This Time?

### Improvements over Test 1:

1. **Fewer Hints**: 2 instead of 4
   - Less bandwidth contention
   - Less connection overhead

2. **No CrossOrigin**: Removed `crossorigin="anonymous"`
   - Avoids connection pool mismatch
   - Browser can reuse connection

3. **Lighthouse-Validated**: Using their actual recommendations
   - Based on critical path analysis
   - Estimated savings provided

4. **First-Party Focus**: main--milo is Adobe domain
   - Better cache behavior
   - More likely to benefit

---

## 📊 Expected Results

### Best Case:
- LCP: 3.9s → 3.6-3.7s (-200-300ms)
- Performance: 83 → 84-85 (+1-2 points)
- Speed Index: 5.4s → 5.1-5.2s (-200-300ms)

### Realistic Case:
- LCP: 3.9s → 3.8s (-100ms)
- Performance: 83 → 83-84 (0-1 point)
- Speed Index: ~5.4s (unchanged)

### Worst Case (like Test 1):
- LCP: 3.9s → 5.0s+ (regression)
- Performance: 83 → 70s (major drop)
- **Action**: Revert immediately

---

## 🚦 Testing Steps

1. **Push this change** to preconnect-hints branch
2. **Wait for deployment** (~2-3 minutes)
3. **Run PageSpeed Insights** on test URL
4. **Compare with baseline** metrics
5. **If regression**: Revert to stage baseline
6. **If improvement**: Document and consider merge

---

## 📋 Test Checklist

- [ ] Test URL deployed and accessible
- [ ] Baseline metrics confirmed (stage)
- [ ] Test metrics captured (preconnect-hints)
- [ ] All metrics compared
- [ ] Decision made (keep/revert)
- [ ] Results documented

---

## ⚠️ Revert Plan

If metrics regress:

```bash
# Revert the preconnect hints
git revert HEAD
git push origin preconnect-hints

# Or restore previous working commit
git reset --hard c70a99ca
git push --force origin preconnect-hints
```

---

**Status**: Ready for Test 2  
**Domains**: geo2.adobe.com, main--milo--adobecom.aem.live  
**Revert Trigger**: ANY regression in LCP, Performance, or Speed Index

