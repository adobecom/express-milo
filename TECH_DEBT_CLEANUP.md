# Technical Debt Cleanup Tasks

## 🗑️ Dead Code to Remove

### 1. listenAlloy() - Unused Alloy Loader (10 months old)

**Location:** `express/code/scripts/scripts.js` (Lines 383-401, 445)

**Issue:**
- Added December 2, 2024 (10 months ago)
- TODO says: "remove about two weeks after going live"
- Creates `window.alloyLoader` promise that **nothing uses**
- Event listener + 3s timeout running on every page load
- Zero references in codebase (verified via grep)

**Code to Remove:**
```javascript
// Lines 383-401
const listenAlloy = () => {
  let resolver;
  let loaded;
  window.alloyLoader = new Promise((r) => {
    resolver = r;
  });
  window.addEventListener('alloy_sendEvent', (e) => {
    if (e.detail.type === 'pageView') {
      loaded = true;
      resolver(e.detail.result);
    }
  }, { once: true });
  setTimeout(() => {
    if (!loaded) {
      resolver();
    }
  }, 3000);
};

// Line 445
listenAlloy(); // Remove this call
```

**Impact:**
- ✅ Reduce page load overhead (removes event listener + timeout)
- ✅ Cleaner codebase
- ✅ No risk - not used anywhere

**Timeline:** Can remove anytime (safe)

---

## 📝 Other TODOs to Review

### 2. Metadata TODOs
**Location:** `express/code/scripts/scripts.js`

```javascript
// Line 423
// end TODO remove metadata after we go live

// Line 432
// TODO remove metadata after we go live
getMetadata('gnav-source') || document.head.append(...)
```

**Question:** Are these still needed? Investigate if metadata can be removed.

---

## 🎯 Cleanup Priority

1. **High Priority:**
   - [ ] Remove `listenAlloy()` dead code
   
2. **Medium Priority:**
   - [ ] Review metadata TODOs (lines 423, 432)
   - [ ] Check if any other "TODO remove after" comments exist
   
3. **Low Priority:**
   - [ ] General code audit for unused functions

---

## 📅 Next Steps

1. ✅ Test font optimization branch first
2. ⏳ After font optimization is validated, create separate cleanup PR
3. ⏳ Remove `listenAlloy()` + document why it's safe
4. ⏳ Review other TODOs

