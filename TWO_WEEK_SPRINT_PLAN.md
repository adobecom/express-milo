# Express Performance: 2-Week Sprint Plan
## What We Can Accomplish Working Hard

### 🎯 **2-Week Target: 18 Story Points**
**Realistic capacity**: 1-2 engineers × 2 weeks = 16-20 points

---

## **Week 1: Critical Fixes (13 points)**

### **Ticket 1: CSS Render-Blocking Fix** ✅ 
**Points**: 5 | **Days**: 2-3
- Inline critical CSS in head.html
- Non-blocking CSS loading strategy
- **Impact**: Immediate improvement across ALL Express pages

### **Ticket 2: Scripts.js Critical Path** ✅
**Points**: 8 | **Days**: 3-4  
- Accelerate AEM EDS transformation
- Defer heavy imports
- Preload LCP images
- **Impact**: Biggest performance win

## **Week 2: High-Impact Block (5 points)**

### **Ticket 3: Template-X Block** ✅
**Points**: 5 | **Days**: 2-3
- Progressive enhancement pattern
- LCP structure immediate
- **Impact**: Create pages 3.5s → 2.2s LCP

---

## **Expected Results After 2 Weeks**

### **Performance Improvements**
- **Homepage**: 4.33s → **2.0s LCP** (54% improvement)
- **Create Pages**: 3.5-4.2s → **2.2s LCP** (37% improvement)  
- **All Express Pages**: Benefit from CSS + scripts fixes

### **Pages Affected**
✅ `/express/` (homepage)
✅ `/express/create/logo` 
✅ `/express/create/*` (all create pages)
✅ **Every Express page** gets CSS + scripts improvement

### **Measurable Impact**
- **~30 Express pages** significantly improved
- **Performance Score**: 81 → **88+** 
- **User Experience**: No more 4+ second white screens

---

## **What Gets Deferred (16 points)**

### **Week 3-4 (Future Sprint)**
- **Ticket 4**: Template-List Block (8 points)
- **Ticket 5**: Image Optimization (3 points)  
- **Ticket 6**: Performance Monitoring (5 points)

---

## **Success Criteria for 2 Weeks**

### **Technical Validation**
- [ ] Nala tests pass: `npm run nala stage @css-blocking @scripts-optimization`
- [ ] LCP <2.5s on homepage and create pages
- [ ] No regressions on other pages
- [ ] AEM EDS compliance maintained

### **Business Impact**
- [ ] **54% LCP improvement** on homepage
- [ ] **37% LCP improvement** on create pages
- [ ] **Zero white screen** delays >2.5s
- [ ] Performance Score 81 → 88+

---

## **Risk Mitigation**

### **If We Fall Behind**
**Priority Order**:
1. **CSS Fix** (5 points) - Affects ALL pages
2. **Scripts.js** (8 points) - Biggest impact  
3. **Template-X** (5 points) - Create pages only

### **Minimum Viable Outcome**
Even if we only complete **Tickets 1 & 2** (13 points):
- **ALL Express pages** get 40%+ LCP improvement
- **Homepage**: 4.33s → 2.5s LCP
- **Massive user experience win**

---

## **Daily Breakdown**

### **Days 1-3: CSS Render-Blocking**
- Day 1: Critical CSS extraction
- Day 2: Non-blocking loading implementation  
- Day 3: Testing and validation

### **Days 4-7: Scripts.js Critical Path**
- Day 4-5: AEM EDS transformation optimization
- Day 6: Deferred imports implementation
- Day 7: LCP image preloading

### **Days 8-10: Template-X Block**
- Day 8-9: Progressive enhancement pattern
- Day 10: Testing and performance validation

---

## **Bottom Line**

**2 weeks working hard = 60% of the total performance gains**

The first two tickets alone will deliver the **biggest impact** across **ALL Express pages**. Template-X adds significant value for create pages specifically.

This is a **high-impact, achievable sprint** that delivers immediate user experience improvements! 🚀
