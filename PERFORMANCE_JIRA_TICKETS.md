# Express Performance Optimization Jira Tickets

## Ticket 1: CSS Render-Blocking Fix

**Summary**: Fix CSS render-blocking affecting ALL Express pages

**Description**: 
27KB styles.css loaded via JavaScript blocks LCP on every Express page (/express/*). Pages show white screen for 2-4 seconds.

**Requirements**:
- Inline critical CSS in head.html for LCP elements
- Load full CSS non-blocking with preload strategy
- Maintain AEM EDS compatibility

**Acceptance Criteria**:
- [ ] LCP improves from 4.33s to <2.5s on homepage
- [ ] CSS no longer blocks body visibility
- [ ] All Express pages benefit from fix
- [ ] Nala tests pass: npm run nala stage @css-blocking

**Priority**: Critical
**Story Points**: 5

---

## Ticket 2: Scripts.js Critical Path Optimization

**Summary**: Eliminate scripts.js blocking bottleneck on ALL Express pages

**Description**:
scripts.js synchronous imports block LCP on every Express page. Heavy initialization happens before AEM EDS transformation completes.

**Requirements**:
- Accelerate AEM EDS transformation for LCP elements
- Defer heavy imports to Phase L (requestIdleCallback)
- Preload LCP images before transformation
- Maintain body display none requirement

**Acceptance Criteria**:
- [ ] First section marked lcp-priority within 100ms
- [ ] LCP images preloaded immediately
- [ ] Heavy imports deferred after LCP
- [ ] Nala tests pass: npm run nala stage @scripts-optimization

**Priority**: Critical  
**Story Points**: 8

---

## Ticket 3: Template-X Block Performance

**Summary**: Optimize template-x block for 2.2s LCP target

**Description**:
Template-x block on create pages has 3.5-4.2s LCP. Affects /express/create/* pages.

**Requirements**:
- Implement AEM EDS Phase E/L pattern
- Create LCP structure immediately
- Defer template data loading
- Progressive enhancement

**Acceptance Criteria**:
- [ ] LCP <2.2s on /express/create/logo
- [ ] Template preview visible within 100ms
- [ ] No layout shifts during loading
- [ ] Nala tests pass: npm run nala stage @template-x @perf

**Priority**: High
**Story Points**: 5

---

## Ticket 4: Template-List Block Performance  

**Summary**: Optimize template-list block for 2.3s LCP target

**Description**:
Template-list block on template pages has 2.8-3.2s LCP. Affects /express/templates/* pages.

**Requirements**:
- Implement virtual scrolling for large lists
- Progressive template loading
- Skeleton placeholders for initial load
- Intersection Observer lazy loading

**Acceptance Criteria**:
- [ ] LCP <2.3s on /express/templates/
- [ ] Initial 12 templates load within 1s
- [ ] Smooth scrolling performance (60fps)
- [ ] Nala tests pass: npm run nala stage @template-list @perf

**Priority**: High
**Story Points**: 8

---

## Ticket 5: Cross-Page Image Optimization

**Summary**: Implement image optimization strategy across Express pages

**Description**:
Images lack aspect ratios causing CLS and missing WebP optimization across Express pages.

**Requirements**:
- Add aspect-ratio CSS to prevent CLS
- Implement WebP format with fallback
- Preload LCP images with fetchpriority high
- Lazy load non-LCP images

**Acceptance Criteria**:
- [ ] CLS <0.1 maintained across all pages
- [ ] LCP images preloaded on all Express pages
- [ ] WebP format used where supported
- [ ] No layout shifts during image loading

**Priority**: Medium
**Story Points**: 3

---

## Ticket 6: Performance Monitoring Integration

**Summary**: Add Nala performance regression testing to CI/CD

**Description**:
Implement automated performance testing to prevent regressions on Express pages.

**Requirements**:
- Add Nala performance tests to GitHub Actions
- Performance budget checks (LCP <2.5s, INP <200ms)
- Block-specific performance validation
- Fail PRs that exceed budgets

**Acceptance Criteria**:
- [ ] GitHub Actions runs Nala perf tests on PR
- [ ] Performance budgets enforced automatically
- [ ] Tests cover all critical Express pages
- [ ] Clear failure messages when budgets exceeded

**Priority**: Medium
**Story Points**: 5

---

## Epic Summary

**Total Story Points**: 34
**Timeline**: 3 sprints (6 weeks)
**Expected Impact**: 
- LCP: 4.33s → <2.5s (42% improvement)
- Affects: 45+ Express pages
- Performance Score: 81 → 90+
