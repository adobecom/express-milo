# Picker Widget - Code Review
## Branch: MWPW-182442

**Reviewer Focus:** Patterns established in codebase, Milo practices, consistency with similar components

---

## Executive Summary

The picker widget implementation is **solid and follows most Milo patterns**, but there are **several inconsistencies and areas for improvement** when compared to similar components in the codebase.

**Overall Grade:** B+ (85/100)

**Key Strengths:**
- ✅ Excellent accessibility implementation (ARIA, keyboard nav, screen reader support)
- ✅ Memory leak prevention with cleanup observers
- ✅ Comprehensive public API
- ✅ Mobile-first CSS architecture
- ✅ Design token usage

**Key Issues:**
- ⚠️ Inconsistent with template-x-carousel-toolbar dropdown pattern
- ⚠️ Global event listener pattern differs from other widgets
- ⚠️ Missing integration with Milo's block loading patterns
- ⚠️ No integration with Milo's `getConfig()` for paths

---

## Detailed Analysis

### 1. **Architecture & Initialization** ⚠️

#### Issue: Inconsistent with Similar Components

**Current Implementation:**
```javascript
async function initUtils() {
  if (!loadStyle) {
    const utils = await import(`${getLibs()}/utils/utils.js`);
    ({ loadStyle, getConfig } = utils);
  }
}

async function loadPickerStyles() {
  if (stylesLoaded) return;
  await initUtils();
  const config = getConfig();
  loadStyle(`${config.codeRoot}/scripts/widgets/picker.css`);
  stylesLoaded = true;
}

export function createPicker({ ... }) {
  loadPickerStyles(); // ⚠️ No await!
  // ...
}
```

**Reference: template-x-carousel-toolbar.js** (Similar custom dropdown):
```javascript
// No separate style loading - relies on block CSS
```

**Reference: floating-cta.js** (Widget):
```javascript
// No separate style loading within widget
```

**Reference: free-plan.js** (Widget):
```javascript
// No CSS loading - handled by block
```

**Analysis:**
- ✅ **Good:** Uses `getConfig()` from Milo utils
- ⚠️ **Issue:** `loadPickerStyles()` is called without `await`, so initialization is non-blocking
- ⚠️ **Issue:** Most Milo widgets don't load their own CSS - it's handled by the block that uses them
- ⚠️ **Issue:** The `stylesLoaded` flag is module-level, which could cause issues in multi-instance scenarios (though it's actually okay here)

**Recommendation:**
```javascript
// Option A: Follow Milo pattern - let the consuming block load CSS
// Remove loadPickerStyles() entirely

// Option B: If self-loading CSS is required, make it explicit:
export async function createPicker({ ... }) {
  await loadPickerStyles(); // Make async explicit
  // ...
}
```

---

### 2. **Custom Dropdown Implementation** ✅⚠️

#### Comparison with template-x-carousel-toolbar.js

**Picker Implementation:**
```javascript
const buttonWrapper = createTag('div', {
  role: 'button',
  'aria-haspopup': 'listbox',
  'aria-expanded': 'false',
  'aria-activedescendant': '',
});

const optionsWrapper = createTag('div', {
  class: 'picker-options-wrapper',
  role: 'listbox',
});
```

**template-x-carousel-toolbar.js Implementation:**
```javascript
const select = createTag('div', {
  role: 'combobox', // ⚠️ Different role!
  'aria-haspopup': 'listbox',
  'aria-expanded': 'false',
  tabindex: '0',
});

const optionList = createTag('ul', {  // ⚠️ Uses <ul>!
  role: 'listbox',
  tabindex: -1,
}, options);
```

**Analysis:**
- ✅ **Picker:** Uses `role="button"` for the trigger - semantically correct for a dropdown trigger
- ✅ **Toolbar:** Uses `role="combobox"` - more appropriate for a select-like component
- ⚠️ **Inconsistency:** Picker uses `<div>` for options list, toolbar uses `<ul>` (more semantic)
- ⚠️ **Inconsistency:** Different ARIA role choices for similar functionality

**ARIA Role Comparison:**
| Role | Use Case | Picker | Toolbar |
|------|----------|--------|---------|
| `button` | Opens/closes menu | ✅ | ❌ |
| `combobox` | Select-like dropdown | ❌ | ✅ |
| `listbox` | Options container | ✅ | ✅ |

**Recommendation:**
- Consider using `role="combobox"` instead of `role="button"` for consistency with ARIA Authoring Practices Guide (APG) for select patterns
- Consider using `<ul>` with `<li>` for options list for better semantics

---

### 3. **Keyboard Navigation** ✅

**Picker Implementation:**
```javascript
buttonWrapper.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { /* ... */ }
  else if (e.key === 'Escape') { /* ... */ }
  else if (e.key === 'ArrowDown') { /* ... */ }
  else if (e.key === 'ArrowUp') { /* ... */ }
  else if (e.key === 'Home' && isOpen) { /* ... */ }
  else if (e.key === 'End' && isOpen) { /* ... */ }
  else if (e.key === 'Tab') { /* ... */ }
});
```

**template-x-carousel-toolbar.js Implementation:**
```javascript
select.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { /* ... */ }
  if (e.key === 'ArrowUp') { /* ... */ }
  if (e.key === 'Enter' || e.key === ' ') { /* ... */ }
  if (e.key === 'Escape') { /* ... */ }
  if (e.key === 'Tab') { /* ... */ }
});
```

**Analysis:**
- ✅ **Excellent:** Picker supports more keys (Home/End)
- ✅ **Good:** Both use similar patterns
- ✅ **Good:** Both prevent default behavior appropriately

**Score:** 10/10

---

### 4. **Click-Outside Handling** ⚠️

#### Issue: Different Pattern Than Other Widgets

**Picker Implementation:**
```javascript
const handleClickOutside = (e) => {
  if (isOpen && !container.contains(e.target)) {
    closeDropdown();
  }
};
document.addEventListener('click', handleClickOutside); // ⚠️ Global listener

cleanupObserver = new MutationObserver(() => {
  if (!document.body.contains(container)) {
    container.destroy();
    if (cleanupObserver) cleanupObserver.disconnect();
  }
});
cleanupObserver.observe(document.body, { childList: true, subtree: true });

container.destroy = () => {
  document.removeEventListener('click', handleClickOutside);
  if (focusObserver) focusObserver.disconnect();
  if (cleanupObserver) cleanupObserver.disconnect();
};
```

**template-x-carousel-toolbar.js:**
```javascript
document.addEventListener('click', (e) => {
  if (select.contains(e.target)) return;
  select.getAttribute('aria-expanded') === 'true' && select.click();
});
// ⚠️ No cleanup! Memory leak potential
```

**template-x.js (search bar):**
```javascript
document.addEventListener('click', (event) => {
  const { target } = event;
  if (target !== searchWrapper && !searchWrapper.contains(target)) {
    // Close dropdown
  }
});
// ⚠️ No cleanup either!
```

**template-x-promo.js:**
```javascript
document.addEventListener('click', handleClickOutside);

return {
  destroy: () => {
    // ... remove other listeners
    document.removeEventListener('click', handleClickOutside);
    heightObserver.disconnect();
  },
};
```

**Analysis:**
- ✅ **Excellent:** Picker has proper cleanup with `destroy()` method
- ✅ **Excellent:** Uses MutationObserver to auto-cleanup when removed from DOM
- ⚠️ **Issue:** Other similar widgets have memory leak potential (no cleanup)
- ⚠️ **Issue:** Picker is **MORE robust** than existing patterns, but inconsistent
- ⚠️ **Issue:** The auto-cleanup MutationObserver is observing all of `document.body` which could be expensive

**Recommendation:**
```javascript
// Option A: Follow existing (flawed) pattern for consistency
// Just add the listener, no cleanup (not recommended)

// Option B: Keep current pattern but optimize observer scope
cleanupObserver.observe(container.parentElement || document.body, { 
  childList: true 
  // Remove 'subtree: true' if possible
});

// Option C: Best - Keep current implementation, it's actually better!
// Document this pattern as a best practice for future widgets
```

**Verdict:** ✅ Current implementation is actually BETTER than existing code. Keep it!

---

### 5. **Public API & Stateful Methods** ✅

**Picker API:**
```javascript
container.setPicker(value)      // Set selected value
container.getPicker()           // Get selected value
container.setOptions(newOptions) // Update options list
container.setDisabled(isDisabled) // Enable/disable
container.setError(errorMessage)  // Show error
container.clearError()            // Clear error
container.setLoading(isLoading)   // Show loading state
container.destroy()               // Cleanup
```

**Comparison with other widgets:**

**free-plan.js:**
```javascript
// No public API - just returns element
export async function buildFreePlanWidget(config) {
  // ...
  return widget;
}
```

**basic-carousel.js:**
```javascript
export default async function buildBasicCarousel(selector, parent, options = {}) {
  // ...
  // No explicit public API methods
}
```

**template-x-promo.js (createDirectCarousel):**
```javascript
return {
  currentIndex: () => currentIndex,
  templateCount: () => templateCount,
  destroy: () => { /* cleanup */ },
};
```

**Analysis:**
- ✅ **Excellent:** Picker has the most comprehensive public API
- ✅ **Good:** Follows pattern of returning stateful methods
- ✅ **Good:** Consistent naming (set/get/clear prefix)
- ⚠️ **Issue:** No other widget has this level of API sophistication - might be over-engineered

**Score:** 9/10 (slight over-engineering for Milo patterns)

---

### 6. **Focus Management** ✅⚠️

#### Issue: Complex MutationObserver for Focus Restoration

**Current Implementation:**
```javascript
if (onChange) {
  if (focusObserver) focusObserver.disconnect();

  focusObserver = new MutationObserver((mutations, obs) => {
    const newButton = document.getElementById(id);
    if (newButton && newButton !== buttonWrapper) {
      newButton.focus();
      obs.disconnect();
      focusObserver = null;
    }
  });

  const observeTarget = container.parentElement || document.body;
  focusObserver.observe(observeTarget, { childList: true, subtree: true });
  onChange(value, { target: { value } });

  setTimeout(() => {
    if (focusObserver) {
      focusObserver.disconnect();
      focusObserver = null;
    }
  }, 2000);
}
```

**Analysis:**
- ✅ **Good:** Handles the edge case where onChange causes DOM re-render
- ⚠️ **Issue:** Very complex for a widget - assumes specific parent behavior
- ⚠️ **Issue:** Observing `subtree: true` is expensive
- ⚠️ **Issue:** 2-second timeout is arbitrary
- ⚠️ **Issue:** No other Milo widget does this level of focus management

**Real-world scenario:**
```javascript
// In print-product-detail/utilities/event-handlers.js:
const updateCustomizationOptions = () => {
  // This replaces the entire customization container!
  document.getElementById('pdpx-customization-inputs-container')
    .replaceWith(newCustomizationInputs);
};
```

**Recommendation:**
```javascript
// Option A: Simplify - let consuming code handle focus
// Remove MutationObserver entirely

// Option B: Document that onChange handlers should NOT re-render the picker
// Add warning comment

// Option C: Make it opt-in
export function createPicker({
  // ...
  restoreFocusAfterChange = false, // ⚠️ New option
}) {
  if (restoreFocusAfterChange) {
    // Current complex logic
  }
}
```

**Recommendation:** Make this behavior opt-in or document it clearly. It's too magical for a general-purpose widget.

---

### 7. **CSS Architecture** ✅

**Strengths:**
- ✅ Mobile-first with `@media (min-width: 768px)`
- ✅ Extensive use of design tokens
- ✅ BEM-like class naming (`picker-container`, `picker-button-wrapper`)
- ✅ `:focus-visible` for keyboard-only focus rings

**Comparison with template-x.css:**
```css
/* template-x.css - Options wrapper */
.template-x .search-dropdown-container {
  background: #FFFFFF; /* ⚠️ Hardcoded! */
  top: calc(100% + 6px);
  border-radius: 12px;
  box-shadow: 0 0 20px #00000029; /* ⚠️ Hardcoded! */
  position: absolute;
  width: 100%;
  z-index: 3;
}

/* picker.css - Options wrapper */
.picker-options-wrapper {
  background-color: var(--color-white); /* ✅ Token */
  border: 1px solid var(--color-gray-200);
  border-radius: var(--spacing-150);
  box-shadow: 0 var(--spacing-50) var(--spacing-300) 
              var(--spacing-100) var(--color-shadow-lightest); /* ✅ Tokens */
  position: absolute;
  top: calc(100% + var(--spacing-100));
  /* ... */
}
```

**Analysis:**
- ✅ **Excellent:** Picker CSS is MORE consistent with design tokens than existing code
- ✅ **Good:** No hardcoded colors or spacing (after recent cleanup)
- ✅ **Good:** Proper use of `calc()` with tokens

**Score:** 10/10

---

### 8. **Testing Coverage** ✅

**Test Structure:**
```javascript
// test/scripts/widgets/picker.test.js
describe('Picker Widget', () => {
  describe('Basic Initialization', () => { /* 10 tests */ });
  describe('Keyboard Navigation', () => { /* 14 tests */ });
  describe('Dropdown Interaction', () => { /* 9 tests */ });
  describe('Public API Methods', () => { /* 11 tests */ });
  describe('Accessibility', () => { /* 18 tests */ });
  describe('Error Handling', () => { /* 7 tests */ });
  // ... 81 tests total
});
```

**Comparison:**
- Most Milo blocks have minimal or no unit tests
- template-x-promo has tests but fewer (focus on integration)
- Picker has **exceptional** test coverage

**Score:** 10/10

---

### 9. **Documentation** ✅⚠️

**Current Documentation:**
- ✅ Comprehensive `.md` file with usage examples
- ✅ API reference
- ✅ Accessibility notes

**Issue:**
- ⚠️ Most Milo widgets have NO documentation
- ⚠️ Inconsistent with codebase patterns (over-documented?)

**Recommendation:** Keep the documentation - it's a GOOD thing. Consider creating docs for other widgets too.

---

### 10. **Integration with Print Product Detail** ⚠️

**Current Usage:**
```javascript
// createCustomizationInputs.js
import { createPicker } from '../../../../scripts/widgets/picker.js';

const quantitySelector = createPicker({
  id: 'pdpx-standard-selector-qty',
  // ...
  onChange: (value) => {
    formDataObject.qty = value;
    window.adobeDataLayer.push({ /* ... */ });
  },
});
```

**Issues:**
1. ⚠️ The `onChange` callback triggers DOM re-renders via `updateCustomizationOptions()`
2. ⚠️ This causes the complex MutationObserver focus restoration logic to activate
3. ⚠️ The picker doesn't know it's being re-created - tight coupling

**Root Cause:**
```javascript
// event-handlers.js
const handleColorChange = async (color) => {
  // ...
  document.getElementById('pdpx-customization-inputs-container')
    .replaceWith(newCustomizationInputs); // ⚠️ Replaces entire container!
};
```

**Analysis:**
- ⚠️ **Issue:** The PDP is treating pickers as ephemeral (re-creating them)
- ⚠️ **Issue:** The picker is trying to be stateful (maintaining focus/state)
- ⚠️ **Mismatch:** These two approaches conflict

**Recommendation:**

**Option A: Make PDP preserve pickers**
```javascript
// Instead of replacing entire container, update only what changed
const updateCustomizationOptions = () => {
  const existingQtyPicker = document.getElementById('pdpx-standard-selector-qty');
  if (existingQtyPicker) {
    // Update options without destroying picker
    const picker = existingQtyPicker.closest('.picker-container');
    picker.setOptions(newOptions);
  } else {
    // Create new picker
  }
};
```

**Option B: Make picker ephemeral (simpler)**
```javascript
// Remove the complex focus restoration logic
// Let the picker be destroyed and recreated
// Store state externally in formDataObject
```

**Recommendation:** Go with Option A - preserve widget state rather than destroying/recreating.

---

## Patterns Comparison Summary

| Pattern | Picker | template-x-carousel-toolbar | template-x | Milo Standard |
|---------|--------|---------------------------|------------|--------------|
| ARIA roles | `button` + `listbox` | `combobox` + `listbox` | Mixed | No standard |
| Options container | `<div>` | `<ul>` | `<div>` | Mixed |
| Click outside | ✅ Global + cleanup | ⚠️ Global (no cleanup) | ⚠️ Global (no cleanup) | No standard |
| Keyboard nav | ✅ Full (Home/End) | ✅ Full | ✅ Basic | Varies |
| Public API | ✅ Comprehensive | 🔵 Returns object | ❌ None | Minimal/None |
| CSS loading | Self-loads | Block loads | Block loads | Block loads |
| Focus mgmt | ✅ Complex (MutationObserver) | 🔵 Simple | 🔵 Simple | Simple |
| Cleanup | ✅ destroy() + auto | 🔵 destroy() | ⚠️ No cleanup | Varies |
| Tests | ✅ 81 tests | ❌ None | ❌ None | Minimal |
| Documentation | ✅ Full .md | ❌ None | ❌ None | None |

Legend:
- ✅ Good/Complete
- 🔵 Present
- ⚠️ Issue/Concern
- ❌ Missing

---

## Priority Recommendations

### P0 - Critical Inconsistencies

1. **Consider changing ARIA role from `button` to `combobox`**
   - Rationale: Better matches ARIA APG for select patterns
   - Reference: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

2. **Make focus restoration opt-in or simplify it**
   ```javascript
   export function createPicker({
     // ...
     maintainFocusAfterChange = false, // Default: false
   })
   ```

### P1 - Architectural Improvements

3. **Remove self-loading CSS or make it explicit async**
   ```javascript
   // Option 1: Remove entirely, let block load CSS
   // Option 2: Make async explicit
   export async function createPicker({ ... }) {
     await loadPickerStyles();
     // ...
   }
   ```

4. **Consider using `<ul>` + `<li>` for options**
   ```javascript
   const optionsWrapper = createTag('ul', {
     class: 'picker-options-wrapper',
     role: 'listbox',
   });
   
   const optionButton = createTag('li', {
     class: 'picker-option-button',
     role: 'option',
     // ...
   });
   ```

### P2 - Nice to Have

5. **Add pattern documentation for other widgets**
   - Document the cleanup pattern
   - Document the public API pattern
   - Create best practices guide

6. **Optimize MutationObserver scope**
   ```javascript
   cleanupObserver.observe(container.parentElement || document.body, {
     childList: true,
     // subtree: false, // Optimize if possible
   });
   ```

---

## Final Verdict

**Overall Assessment:** The picker widget is **exceptionally well-implemented** with:
- ✅ Excellent accessibility
- ✅ Comprehensive testing
- ✅ Proper cleanup and memory management
- ✅ Great documentation

**However**, it's **inconsistent** with established Milo patterns:
- ⚠️ Over-engineered compared to other widgets
- ⚠️ Self-loads CSS (unusual)
- ⚠️ Complex focus management (unusual)
- ⚠️ Different ARIA patterns than similar components

**Recommendation:**
1. **For consistency:** Simplify to match existing patterns (make it "more Milo-like")
2. **For quality:** Keep current implementation and IMPROVE other widgets to match

**My vote:** Go with #2. The picker is setting a NEW standard for quality that other Milo widgets should aspire to.

---

## Action Items

- [ ] Decision needed: Role `button` vs `combobox`
- [ ] Decision needed: Keep complex focus restoration or make it opt-in?
- [ ] Decision needed: Keep CSS self-loading or remove it?
- [ ] Consider: Update other widgets to match picker's cleanup pattern
- [ ] Consider: Add MutationObserver auto-cleanup to other widgets
- [ ] Consider: Document this as new widget pattern standard

---

**Review Date:** 2025-11-06  
**Reviewer:** AI Code Review Bot  
**Branch:** MWPW-182442  
**Files Reviewed:** 
- `express/code/scripts/widgets/picker.js` (507 lines)
- `express/code/scripts/widgets/picker.css` (347 lines)
- `test/scripts/widgets/picker.test.js` (1026 lines)
- `express/code/scripts/widgets/picker.md` (504 lines)

