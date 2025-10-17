# Dead Code Analysis Report

**Branch:** `stage`  
**Date:** October 16, 2025  
**Analysis Scope:** `express/code/` directory

---

## 🎯 Executive Summary

Found **significant dead code** across the Express codebase that should be cleaned up:

| Category | Count | Impact |
|----------|-------|--------|
| **Critical Dead Code** | 1 function | 10+ months old, should be removed |
| **TODO Comments (Removal)** | 11 items | Code marked for removal but never cleaned up |
| **Console Logs (Production)** | 51 instances | Debug code left in production |
| **Commented-Out Code** | 4 blocks | Dead code fragments |
| **Deprecated Functions** | 3 functions | Used in 42+ files, needs refactoring |

**Estimated Cleanup Impact:**
- **-200 to -500 lines** of dead/debug code
- **Improved maintainability** (remove confusion from TODOs)
- **Smaller bundle size** (remove unused imports and console.logs)

---

## 🔴 CRITICAL: Dead Code (10+ Months Old)

### 1. `listenAlloy()` Function - **REMOVE IMMEDIATELY**

**Location:** `express/code/scripts/scripts.js:318-331`

```javascript
// TODO this method should be removed about two weeks after going live
listenAlloy();
```

**Status:** 🚨 **10+ MONTHS OVERDUE FOR REMOVAL**

**The Function:**
```javascript
const listenAlloy = () => {
  let resolver;
  let loaded;
  window.alloyLoader = new Promise((r) => {
    resolver = r;
  });
  window.addEventListener('alloy_sendEvent', (e) => {
    if (e.detail.type === 'pageView') {
      // eslint-disable-next-line no-console
      loaded = true;
      resolver(e.detail.result);
    }
  });

  setTimeout(() => {
    if (!loaded) {
      resolver();
    }
  }, 3000);
};
```

**Impact:**
- **Lines to remove:** ~20 lines
- **Call site:** Line 380 in `scripts.js`
- **Risk:** LOW (function appears to be no longer needed)

**Recommendation:** ✅ **SAFE TO REMOVE** - This was a temporary workaround for Alloy analytics initialization

---

## ⚠️ TODO Comments Marked for Removal

### 11 TODO Comments Found

#### 1. **Metadata Creation (Post-Launch Cleanup)**

**File:** `express/code/scripts/scripts.js:356-358`

```javascript
// end TODO remove metadata after we go live
```

**Context:** Creating metadata dynamically that should be in document head
- `footer` meta tag
- `footer-source` meta tag  
- `adobe-home-redirect` meta tag
- `google-login` meta tag

**Recommendation:** Evaluate if these are now in the HTML head and remove dynamic creation

---

#### 2. **GNav Source Metadata**

**File:** `express/code/scripts/scripts.js:367-368`

```javascript
// TODO remove metadata after we go live
getMetadata('gnav-source') || document.head.append(createTag('meta', { name: 'gnav-source', content: `${config.locale.prefix}/express/localnav-express` }));
```

**Recommendation:** Move to `head.html` or confirm it's needed dynamically

---

#### 3. **Template-List Deprecation**

**File:** `express/code/scripts/utils.js:747-752`

```javascript
// TODO remove this method and the unwrap block method once template-list blocks are gone
function splitSections(area, selector) {
  const blocks = area.querySelectorAll(`${selector} > .template-list`);
  blocks.forEach((block) => {
    unwrapBlockDeprecated(block);
  });
}
```

**Status:** Template-list still in use (found in multiple blocks)  
**Recommendation:** Create migration plan to remove template-list block

---

#### 4. **Milo CSS Imports in Tabs-AX**

**File:** `express/code/blocks/tabs-ax/tabs-ax.css:16`

```css
/* @TODO REMOVE IMPORTS DIRECTLY FROM MILO STYLE.CSS */
```

**Issue:** Hardcoding CSS variables instead of importing from Milo  
**Recommendation:** Use CSS custom properties from Milo or document why duplicates are needed

---

#### 5. **Template-List Search Bar Backward Compatibility**

**File:** `express/code/blocks/template-list/template-list.js:730-731`

```javascript
// TODO: consider removing !searchMarqueeSearchBar as it should always be there for desktop pages
const searchBarToWatch = (document.body.dataset.device === 'mobile' || !searchMarqueeSearchBar) ? generatedSearchBar : searchMarqueeSearchBar;
```

**Recommendation:** Verify searchMarqueeSearchBar is always present and simplify logic

---

#### 6. **Masonry Widget Backward Compatibility**

**File:** `express/code/scripts/widgets/masonry.js:3-4`

```javascript
// todo: remove this.needBackwardCompatibility() when template-list is deprecated
function nodeIsBefore(node, otherNode) {
```

**Linked to:** Template-list deprecation  
**Recommendation:** Part of template-list cleanup

---

#### 7. **Pricing URL Hosts**

**File:** `express/code/scripts/utils/pricing.js:214-215`

```javascript
// TODO: Remove '/sp/ once confirmed with stakeholders
const allowedHosts = ['new.express.adobe.com', 'express.adobe.com', 'adobesparkpost.app.link', 'adobesparkpost-web.app.link'];
```

**Recommendation:** Confirm with stakeholders and remove `/sp/` check

---

#### 8. **XLG Integration (Jingle)**

**File:** `express/code/scripts/instrument.js:379-382`

```javascript
// TODO Start of section to be removed after Jingle finishes adding xlg to old express Repo
// this piece of code is necessary for the ratings block atm so that the right user
// segments can leave a review
```

**Recommendation:** Check with Jingle team if this is still needed

---

#### 9-11. **Breadcrumbs Backward Compatibility**

**File:** `express/code/blocks/template-list/breadcrumbs.js`

```javascript
// TODO: remove templateTasks and allTemplatesMetadata here after all content are updated
const tasks = getMetadata('tasks')
  ?? getMetadata('templateTasks')
  ?? allTemplatesMetadata[pathname]?.tasks
  ?? allTemplatesMetadata[pathname]?.templateTasks;

// TODO: remove this check after all content are updated
if (getMetadata('sheet-powered') !== 'Y' && !document.querySelector('.search-marquee')) {
  return null;
}
```

**Recommendation:** Audit content and remove fallback metadata checks

---

## 🐛 Console Logs in Production Code

### Found 51 console.log/warn/error statements

**Breakdown by Type:**
- `console.log`: 15 instances (debug statements)
- `console.warn`: 8 instances (warnings)
- `console.error`: 28 instances (error handling)

**High-Impact Files:**

#### 1. **simplified-pricing-cards-v2.js** (10 console statements)

```javascript
console.log('resize');  // Line 449
console.log('Section display changed, equalizing heights');  // Line 478
console.log('Section resized, equalizing heights');  // Line 487
console.warn('Invalid parameters passed to getPriceElementSuffix');  // Line 62
console.warn('Failed to fetch pricing data');  // Line 187
console.error('Missing required parameters for createPricingSection');  // Line 169
console.error('Error in getPriceElementSuffix:', error);  // Line 78
console.error('Error in createPricingSection:', error);  // Line 227
console.error('Failed to load required modules:', error);  // Line 328
console.error('Element is required for simplified-pricing-cards-v2 initialization');  // Line 524
console.error('Error initializing simplified-pricing-cards-v2:', error);  // Line 550
```

**Recommendation:**
- Replace `console.log` with proper telemetry
- Keep `console.error` but ensure they're actionable
- Remove debug `console.log` statements

#### 2. **pricing-cards-v2.js** (1 console statement)

```javascript
console.log('Section display changed, equalizing heights');  // Line 546
```

**Recommendation:** Remove debug statement

#### 3. **susi-light.js** (1 console statement)

```javascript
// eslint-disable-next-line no-console
console.log('redirecting to:', e.detail);  // Line 17
```

**Recommendation:** Remove or replace with telemetry

#### 4. **page-list.js** (1 console statement)

```javascript
// eslint-disable-next-line no-console
console.log(`${indexURL}: ${json.data.length}`);  // Line 11
```

**Recommendation:** Remove debug statement

#### 5. **masonry.js** (1 active, 3 commented out)

```javascript
// eslint-disable-next-line no-console
console.log(cell.offsetHeight, calculatedHeight, cell);  // Line 161

// Commented out:
// console.log('entering fill mode');
// console.log(this.fillToHeight, minOuterHeight, height, cell);
// console.log('no more fill mode');
```

**Recommendation:** Remove all console statements

---

## 📝 Commented-Out Code

### 1. **template-search-api-v3.js**

```javascript
// const regionFilter = extractRegions(locales).join(',');
// if (regionFilter) str += `&filters=applicableRegions==${regionFilter}`;
```

**Reason:** "Region Filter as template region tagging is still inconsistent"  
**Recommendation:** ✅ Remove (clearly not being used)

---

### 2. **mobile-fork-button.js** (MEP variant)

```javascript
// import { getLibs, getMobileOperatingSystem, getIconElementDeprecated, addTempWrapperDeprecated }
// from '../../scripts/utils.js';
// import { createFloatingButton } from '../../scripts/widgets/floating-cta.js';

// const { default: decorateNormal } = await import('../floating-button/floating-button.js');
```

**Recommendation:** ✅ Remove (old import paths)

---

## 🔧 Deprecated Functions Still in Use

### 1. **`addTempWrapperDeprecated()`**

**Status:** 🚨 **Used in 42 files!**

**Files:**
- `ax-marquee.js`
- `simplified-pricing-cards-v2.js`
- `quotes.js`
- `quick-action-hub.js`
- `pricing-table.js`
- `pricing-cards.js`
- `pricing-cards-v2.js`
- `mobile-fork-button-dismissable.js`
- `make-a-project.js`
- `long-text.js`
- `list.js`
- `link-list.js`
- `icon-list.js`
- `gen-ai-cards.js`
- `floating-button.js`
- `cta-carousel.js`
- `content-toggle-v2.js`
- `content-cards.js`
- `blog-posts.js`
- ... and 23 more files

**The Function:**
```javascript
export function addTempWrapperDeprecated($block, blockName) {
  const blockParent = $block.parentElement;
  $block.classList.add(blockName);
  const wrapper = createTag('div', { class: `${blockName}-wrapper` });
  blockParent.append(wrapper);
  wrapper.append($block);
}
```

**Impact:** Creates unnecessary wrapper `<div>` elements  
**Recommendation:** ⚠️ **Major Refactor Required**
- Remove wrapper creation from all 42 blocks
- Update CSS selectors to target block directly
- Test all blocks after removal

**Estimated effort:** 2-3 days (update 42 files + CSS + tests)

---

### 2. **`getIconElementDeprecated()`**

**Location:** `express/code/scripts/utils.js:250`

**Status:** ⚠️ Unknown usage count (needs grep analysis)

**Recommendation:** Audit usage and create migration plan

---

### 3. **`decorateButtonsDeprecated()`**

**Location:** `express/code/scripts/utils.js:299`

**Status:** ⚠️ Unknown usage count (needs grep analysis)

**Recommendation:** Audit usage and create migration plan

---

## 📊 Cleanup Priority Matrix

| Priority | Item | Effort | Impact | Risk |
|----------|------|--------|--------|------|
| 🔴 **P0** | Remove `listenAlloy()` | 10 min | Low | Low |
| 🔴 **P0** | Remove commented-out code | 5 min | Low | None |
| 🟡 **P1** | Remove debug console.logs | 30 min | Medium | Low |
| 🟡 **P1** | Evaluate metadata TODOs | 2 hours | Medium | Medium |
| 🟢 **P2** | Template-list deprecation plan | 1 week | High | High |
| 🟢 **P2** | `addTempWrapperDeprecated()` refactor | 2-3 days | High | Medium |
| 🔵 **P3** | Audit other deprecated functions | 1 day | Medium | Low |

---

## 🚀 Recommended Cleanup Strategy

### Phase 1: Quick Wins (1 hour)

1. **Remove `listenAlloy()` function and call**
   - File: `express/code/scripts/scripts.js`
   - Lines: 318-331, 380
   
2. **Remove commented-out code blocks**
   - `template-search-api-v3.js`: Lines 100-101
   - `mobile-fork-button.js`: Lines 4-6, 179

3. **Remove debug console.log statements**
   - `simplified-pricing-cards-v2.js`: Lines 449, 478, 487
   - `pricing-cards-v2.js`: Line 546
   - `susi-light.js`: Line 17
   - `page-list.js`: Line 11
   - `masonry.js`: Line 161

### Phase 2: Medium Effort (2-4 hours)

1. **Evaluate and remove metadata TODOs**
   - Test if metadata is now in `head.html`
   - Remove dynamic creation if redundant
   - Document if intentionally dynamic

2. **Replace console.error with proper error handling**
   - Review error handling in pricing blocks
   - Consider using Lana for production errors

### Phase 3: Major Refactoring (1-2 weeks)

1. **Create Template-List Deprecation Plan**
   - Identify all template-list usage
   - Create migration guide
   - Update affected blocks
   - Remove template-list block
   - Remove `splitSections()` and `unwrapBlockDeprecated()`

2. **Refactor `addTempWrapperDeprecated()`**
   - Update 42 files to remove wrapper creation
   - Update CSS selectors
   - Run full test suite
   - Visual regression testing

---

## 📋 Cleanup Checklist

### Immediate (Can do now)

- [ ] Remove `listenAlloy()` function and call
- [ ] Remove commented-out code in `template-search-api-v3.js`
- [ ] Remove commented-out imports in `mobile-fork-button.js`
- [ ] Remove debug console.log in `simplified-pricing-cards-v2.js` (3 instances)
- [ ] Remove debug console.log in `pricing-cards-v2.js`
- [ ] Remove debug console.log in `susi-light.js`
- [ ] Remove debug console.log in `page-list.js`
- [ ] Remove debug console.log in `masonry.js`

### Short-term (Next sprint)

- [ ] Audit all metadata creation TODOs
- [ ] Test if metadata can be moved to `head.html`
- [ ] Review console.error statements for actionability
- [ ] Document why certain console statements are kept
- [ ] Check Jingle team on XLG integration status

### Long-term (Next quarter)

- [ ] Create template-list deprecation RFC
- [ ] Plan `addTempWrapperDeprecated()` refactor
- [ ] Audit other deprecated functions
- [ ] Create style guide for error handling
- [ ] Set up ESLint rule to prevent console.log in production

---

## 🎯 Expected Impact

**After Phase 1 Cleanup:**
- **~50-100 lines removed**
- **Cleaner console output**
- **Removed confusing dead code**
- **Better code clarity**

**After Full Cleanup:**
- **~200-500 lines removed**
- **Simplified DOM structure** (no wrapper divs)
- **Better performance** (fewer DOM elements)
- **Improved maintainability**
- **Smaller bundle size**

---

**Last Updated:** October 16, 2025  
**Branch:** `stage`  
**Next Review:** Q1 2026

