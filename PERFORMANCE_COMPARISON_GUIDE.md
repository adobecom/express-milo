# Performance Comparison Guide

## Overview
This guide helps you compare baseline performance (main branch) with optimized performance (performance branch) to measure the impact of our Core Web Vitals optimizations.

## Setup Instructions

### 1. Baseline Testing (Main Branch)
```bash
git checkout main
npm run dev
# Open browser to http://localhost:3000
# Add ?perf-debug=true to URL for detailed logging
```

### 2. Optimized Testing (Performance Branch)
```bash
git checkout performance
npm run dev
# Open browser to http://localhost:3000
# Add ?perf-debug=true to URL for detailed logging
```

## What to Monitor

### Core Web Vitals Metrics

#### LCP (Largest Contentful Paint)
- **Target**: < 2.5s (Good), < 4.0s (Needs Improvement)
- **What to look for**:
  - Baseline: Hero video loads with default settings
  - Optimized: Hero video uses `preload="metadata"` and `fetchpriority="high"`

#### FID (First Input Delay)
- **Target**: < 100ms (Good), < 300ms (Needs Improvement)
- **What to look for**:
  - Baseline: All JavaScript loads immediately
  - Optimized: Analytics and third-party scripts are deferred

#### CLS (Cumulative Layout Shift)
- **Target**: < 0.1 (Good), < 0.25 (Needs Improvement)
- **What to look for**:
  - Baseline: Images load without dimensions, causing layout shifts
  - Optimized: Images have explicit aspect ratios preventing shifts

### Console Logging Comparison

#### Baseline Logs (Main Branch)
```
🚀 Baseline Performance monitoring initialized
🎯 LCP: 3200.45ms ⚠️ Needs Improvement
⚡ FID: 150.23ms ⚠️ Needs Improvement
📐 CLS: 0.15 ⚠️ Needs Improvement
🐌 Slow Resource: hero-video.mp4 - 2800ms, 2.1MB
```

#### Optimized Logs (Performance Branch)
```
🚀 Performance monitoring initialized
🎯 LCP Video optimization applied: {preload: "metadata", fetchpriority: "high"}
🖼️ Image optimization applied: {method: "natural-dimensions", aspectRatio: "16/9"}
🎯 LCP: 1800.23ms ✅ Good
⚡ FID: 45.67ms ✅ Good
📐 CLS: 0.05 ✅ Good
🎥 Lazy video loading started: {src: "non-critical-video.mp4"}
```

## Key Differences to Look For

### 1. Video Loading Strategy
**Baseline:**
- All videos load with `preload="auto"`
- No prioritization
- Blocking LCP

**Optimized:**
- Hero video: `preload="metadata"` + `fetchpriority="high"`
- Non-critical videos: Lazy loaded with IntersectionObserver
- Deferred content loading after LCP

### 2. Image Loading Strategy
**Baseline:**
- Images load without explicit dimensions
- Layout shifts as images load
- No aspect ratio preservation

**Optimized:**
- Intelligent aspect ratio detection
- Explicit `aspect-ratio` CSS prevents CLS
- Context-aware ratio selection

### 3. JavaScript Loading Strategy
**Baseline:**
- All scripts load immediately
- Analytics and tracking scripts block main thread
- No prioritization

**Optimized:**
- Critical scripts load first
- Analytics and third-party scripts deferred
- Performance monitoring provides insights

## Testing Scenarios

### 1. Fast 3G Network
Test both branches on slow network to see optimization impact:
- Open Chrome DevTools
- Go to Network tab
- Select "Fast 3G" throttling
- Reload page and compare metrics

### 2. Mobile Device Testing
Use Chrome DevTools device emulation:
- Select mobile device (iPhone 12, Pixel 5)
- Compare LCP, FID, CLS scores
- Check for layout shifts

### 3. Real User Monitoring
Enable debug mode and check console logs:
- Add `?perf-debug=true` to URL
- Monitor detailed performance logs
- Compare optimization strategies used

## Expected Improvements

### LCP Improvements
- **Baseline**: 3-4 seconds (hero video loading)
- **Optimized**: 1.5-2.5 seconds (metadata preload + prioritization)
- **Improvement**: 30-50% faster LCP

### FID Improvements
- **Baseline**: 100-300ms (blocked by analytics)
- **Optimized**: 50-100ms (deferred non-critical JS)
- **Improvement**: 50-70% better responsiveness

### CLS Improvements
- **Baseline**: 0.1-0.3 (image layout shifts)
- **Optimized**: 0.0-0.1 (explicit aspect ratios)
- **Improvement**: 60-80% reduction in layout shifts

## Debugging Commands

### Check Current Metrics
```javascript
// In browser console
getCoreWebVitals()
// Returns: {lcp: 1800.23, fid: 45.67, cls: 0.05}

getPerformanceMetrics()
// Returns: Detailed metrics object
```

### Enable Debug Mode
```javascript
// In browser console
localStorage.setItem('perf-debug', 'true');
location.reload();
```

### Compare Branches
```bash
# Switch between branches and test
git checkout main && npm run dev
# Test baseline performance

git checkout performance && npm run dev  
# Test optimized performance
```

## Performance Budget

### Target Metrics (Optimized)
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Total Blocking Time**: < 200ms
- **Speed Index**: < 3.0s

### Monitoring Tools
- Chrome DevTools Lighthouse
- WebPageTest.org
- Real User Monitoring (RUM)
- Performance Observer API

## Troubleshooting

### If Optimizations Don't Show
1. Clear browser cache
2. Check console for errors
3. Verify debug mode is enabled
4. Ensure you're on the correct branch

### If Metrics Are Worse
1. Check for JavaScript errors
2. Verify all optimizations are applied
3. Test on different network conditions
4. Check for conflicting scripts

## Next Steps

After comparing performance:
1. **Document improvements** in PR description
2. **Share metrics** with team
3. **Plan rollout** strategy
4. **Monitor production** performance
5. **Iterate** based on real user data

