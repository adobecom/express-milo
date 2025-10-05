# Performance Testing Guide

## 🚀 How to Test Performance Monitoring & Core Web Vitals

### Test URLs

#### Performance Branch (Optimized)
```
https://performance--express--adobecom.hlx.page/express/?perf-debug=true
```

#### Baseline Branch (For Comparison)
```
https://main-monitor-core-vitals--express--adobecom.hlx.page/express/?perf-debug=true
```

**Note**: Both branches now have performance monitoring enabled for proper comparison!

### What You'll See in Console

#### 1. **Performance Monitor Initialization**

**Performance Branch (Optimized):**
```
📊 Performance Monitor Initialized
🔍 Monitoring Core Web Vitals and resource loading
💡 Debug mode enabled - detailed logging active
```

**Baseline Branch (For Comparison):**
```
📊 Baseline Performance Monitor Initialized
🔍 Monitoring Core Web Vitals and resource loading (BASELINE)
💡 Debug mode enabled - detailed logging active
```

#### 2. **Page Load Metrics**
```
🚀 Page Load Metrics
⏱️ Total Load Time: 1234 ms
📄 DOM Ready: 567 ms
🔄 Load Complete: 890 ms
```

#### 3. **Video Optimizations** (Performance Branch Only)
```
🎯 LCP Video optimization applied: metadata preload + high priority
🎥 Lazy video optimization applied: no preload
```

#### 4. **Image Optimizations** (Performance Branch Only)
```
🖼️ Image optimization applied: natural-dimensions (800x600)
🖼️ Image optimization applied: existing-attributes (1200x800)
```

**Note**: Baseline branch will NOT show these optimization messages - this is expected!

#### 5. **Core Web Vitals Detection**
```
🎯 LCP detected: 1234.56ms
⚡ FID detected: 45.67ms
📐 CLS detected: 0.012
```

#### 6. **Core Web Vitals Status Summary**
```
📊 Core Web Vitals Status:
🎯 LCP: 1234.56ms ✅
⚡ FID: 45.67ms ✅
📐 CLS: 0.012 ✅
✅ All Core Web Vitals captured successfully!
```

### Testing Steps

#### Step 1: Open Performance Branch
1. Go to: `https://performance--express--adobecom.hlx.page/express/?perf-debug=true`
2. Open Chrome DevTools (F12)
3. Go to Console tab
4. Look for the performance monitoring logs

#### Step 2: Trigger FID (First Input Delay)
1. Click anywhere on the page
2. You should see: `⚡ FID detected: XXms`
3. This measures how quickly the page responds to user input

#### Step 3: Compare with Baseline
1. Go to: `https://main-monitor-core-vitals--express--adobecom.hlx.page/express/?perf-debug=true`
2. Compare the console logs
3. Performance branch should show more optimizations

#### Step 4: Check PageSpeed Insights
1. Test both URLs with PageSpeed Insights
2. Compare LCP, FID, CLS scores
3. Performance branch should score better

### Expected Improvements

| Metric | Baseline | Performance Branch | Improvement |
|--------|----------|-------------------|-------------|
| **LCP** | ~4.3s | <2.5s | 42% faster |
| **FID** | ~190ms | <100ms | 47% better |
| **Performance Score** | ~81 | 85+ | 5+ points |

### Debug Mode Features

#### Basic Mode (Default)
- Shows essential performance metrics
- Core Web Vitals status
- Optimization confirmations

#### Debug Mode (`?perf-debug=true`)
- Detailed resource loading information
- Element-by-element optimization details
- Network payload analysis
- Performance recommendations

### Troubleshooting

#### If You Don't See Logs
1. Make sure you're on the performance branch
2. Add `?perf-debug=true` to the URL
3. Check that JavaScript is enabled
4. Try refreshing the page

#### If Core Web Vitals Don't Appear
1. **LCP**: Should appear after page load
2. **FID**: Requires user interaction (click/tap)
3. **CLS**: Should appear if there are layout shifts

#### If Optimizations Don't Show
1. Check that you're on the performance branch
2. Look for video and image optimization messages
3. Verify the page has videos and images to optimize

### Performance Monitoring Commands

#### Check Current Metrics
```javascript
// In browser console
window.performanceMonitor.getMetrics()
```

#### Enable Debug Mode Programmatically
```javascript
// In browser console
localStorage.setItem('perf-debug', 'true');
location.reload();
```

#### Disable Debug Mode
```javascript
// In browser console
localStorage.removeItem('perf-debug');
location.reload();
```

### Success Indicators

✅ **Performance Monitor Initialized** - System is working  
✅ **LCP Video optimization applied** - Video optimizations active  
✅ **Image optimization applied** - Image optimizations active  
✅ **LCP detected: <2500ms** - Good LCP score  
✅ **FID detected: <100ms** - Good FID score  
✅ **CLS detected: <0.1** - Good CLS score  

### Next Steps

1. **Test both branches** and compare results
2. **Run PageSpeed Insights** on both URLs
3. **Check mobile performance** on different devices
4. **Monitor real user metrics** when deployed

---

**Ready to test!** 🚀 Open the performance branch URL and check the console for detailed performance monitoring.
