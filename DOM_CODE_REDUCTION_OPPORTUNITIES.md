# DOM & Code Reduction Opportunities - Express Homepage

## Goal: **Less DOM = Faster Parsing = Better Performance** ⚡

Based on analysis of the codebase, here are **concrete opportunities** to reduce DOM size and remove unnecessary code.

---

## 🎯 Top Opportunities (Highest Impact)

### 1. **`addTempWrapperDeprecated()` - Remove This Everywhere** 🗑️

**Impact:** -1 wrapper div per block = ~10-15 divs on homepage

**Current Pattern:**
```javascript
export default function decorate(block) {
  addTempWrapperDeprecated(block, 'my-block'); // ← Creates unnecessary wrapper
  // ... rest of code
}
```

**Files Using This (25+ blocks):**
- `express/code/blocks/floating-button/floating-button.js`
- `express/code/blocks/quick-action-hub/quick-action-hub.js`
- `express/code/blocks/long-text/long-text.js`
- `express/code/blocks/banner/banner.js`
- ... 20+ more

**What It Does:**
```javascript
// Wraps block in ANOTHER div:
<div class="block-wrapper">
  <div class="block">...</div>  
</div>
```

**Why Remove:**
- ❌ Extra DOM node
- ❌ Extra CSS selector complexity
- ❌ No functional benefit
- ❌ Named "Deprecated" - should have been removed already!

**Savings:**
- **DOM:** -15 wrapper divs on homepage
- **CSS Parsing:** Faster (fewer nodes)
- **Memory:** Lower

---

### 2. **Excessive CSS Variables - `gen-ai-cards.css`** 🎨

**Impact:** -20-30 CSS variables that could be hardcoded

**Current:** 61 CSS variables for a single block
```css
.gen-ai-cards {
  --card-height: 315px;
  --card-width: 292px;
  --card-padding: 12px;
  --card-gap: 8px;
  --input-form-width: 244px;
  --blue-background: #EDEEFF;
  --color-text-primary: #212121;
  --color-background-light: #EDEEFF;
  --color-hover-light: #e6e6e6;
  --color-border: none;
  --font-size-tag: 10px;
  --font-size-beta: 10px;
  --font-size-heading-mobile: 22px;
  --font-size-heading-desktop: 36px;
  --spacing-card-margin: 20px;
  --spacing-card-padding: 8px;
  --spacing-border-radius-small: 3px;
  --spacing-border-radius-medium: 8px;
  --spacing-border-radius-large: 16px;
  --media-wrapper-height: 228px;
  --media-wrapper-desktop-width: 352px;
  --card-height-mobile: 325px;
  --card-height-desktop: 392px;
  --card-width-desktop: 380px;
  --form-padding: 8px;
  --form-border-radius: 8px;
  --form-border-width: 2px;
  --transition-duration: 0.3s;
  --transition-timing: ease-in-out;
  /* ... 30+ more! */
}
```

**Why This is Excessive:**
- Used once? → Just write the value directly
- Generic values like `8px`? → Don't need a variable
- Colors used 1-2 times? → Inline them

**Recommendation:**
- Keep **3-5 core variables** (theme colors, breakpoints)
- Remove rest = **-50% CSS file size**

**Files to Review:**
- `gen-ai-cards.css` (700 lines, 61 CSS vars)
- `template-x.css` (3,375 lines!)
- `ax-columns.css` (1,860 lines)

---

### 3. **Duplicate/Redundant DOM Creation** 🔁

#### Example A: `simplified-pricing-cards-v2.js`

**Current:**
```javascript
const card = createTag('div', { class: 'card' });
const cardInnerContent = createTag('div', {
  class: 'card-inner-content',
  id: `card-content-${cardIndex}`,
});
cardInnerContent.classList.add('hide');
card.appendChild(cardInnerContent);
```

**DOM Output:**
```html
<div class="card">
  <div class="card-inner-content hide" id="card-content-0">
    <!-- actual content -->
  </div>
</div>
```

**Question:** Do we need TWO divs? Or can content go directly in `.card`?

**Potential Savings:** -1 div per pricing card = -3 divs

---

### 4. **Remove `.innerHTML = ''` Pattern** 🧹

**Found in:** `quick-action-hub.js`, `long-text.js`, others

**Current Pattern:**
```javascript
block.innerHTML = ''; // ← Destroys all existing DOM
// Then recreates everything
block.append($container);
block.append($contentContainer);
```

**Why This is Bad:**
1. Destroys **all** DOM nodes (forces full repaint)
2. Loses event listeners
3. Forces browser to rebuild CSSOM
4. Usually unnecessary

**Better Pattern:**
```javascript
// Move/reuse existing DOM instead of destroying
while (block.firstChild) {
  $container.appendChild(block.firstChild);
}
```

**Savings:**
- Faster rendering (no full repaint)
- Lower memory churn

---

### 5. **Overly Complex Selectors** 🎯

**Example from `gen-ai-cards.css`:**
```css
.section:not(.xxxl-spacing-static, .xxl-spacing-static, .xl-spacing-static, .xxxl-spacing, .xxl-spacing, .xl-spacing, .l-spacing, .m-spacing, .s-spacing, .xs-spacing, .xxs-spacing) .gen-ai-cards.homepage:first-child {
  padding-top: 60px;
}
```

**This selector:**
- 🐌 Slow to parse (11 negations!)
- 🔧 Hard to maintain
- ❌ Brittle (breaks if class names change)

**Better:**
```css
.gen-ai-cards.homepage:first-child:not([class*="-spacing"]) {
  padding-top: 60px;
}
```

**Or even better - add a utility class:**
```css
.gen-ai-cards.default-spacing {
  padding-top: 60px;
}
```

---

### 6. **Remove Unused/Dead Code** 💀

#### Files to Audit for Dead Code:

| File | Size | Red Flags |
|------|------|-----------|
| `template-x.js` | 1,930 lines | Holiday functions (used year-round?) |
| `template-list.js` | 2,028 lines | Duplicate carousel logic? |
| `quotes.js` | 471 lines | Already optimized in `quotes-lazy-backgrounds` |
| `pricing-cards.js` vs `pricing-cards-v2.js` | 726 + 575 lines | Two versions? Remove old one? |
| `simplified-pricing-cards.js` vs `-v2.js` | 296 + 552 lines | Two versions? Remove old one? |

**Question for each:**
1. Is this code actually used on the homepage?
2. Can v1 be removed now that v2 exists?
3. Are there dead branches/functions?

---

### 7. **Consolidate Duplicate Utilities** 🔧

**Example:** Carousel logic appears in **4 different files:**

```
express/code/scripts/widgets/basic-carousel.js (354 lines)
express/code/scripts/widgets/grid-carousel.js (280 lines)
express/code/scripts/widgets/carousel.js (290 lines)
express/code/blocks/template-x/custom carousel (~200 lines inline)
```

**Each has:**
- Touch/swipe handlers
- Navigation buttons
- Autoplay logic
- Resize handlers

**Opportunity:**
- Create **ONE** carousel utility
- Blocks import it
- **Savings:** -500-700 lines of duplicate code

---

### 8. **Minify Inline Styles and Comments** 📦

**Example from `quotes.css`:**

```css
/* This is a very long comment explaining why we do this thing
   and the history of this decision and the person who made it
   and the ticket number and the date... */
.quote-container {
  display: flex; /* flex layout */
  flex-direction: column; /* vertical stack */
  gap: 20px; /* spacing between items */
}
```

**Production should:**
- Remove all comments
- Minify CSS
- Remove unnecessary whitespace

**Savings:** -20-30% CSS file size

---

## 📊 Estimated Impact by Priority

### High Priority (Do First):

| Change | DOM Reduction | Code Reduction | Effort | Impact |
|--------|---------------|----------------|--------|--------|
| Remove `addTempWrapperDeprecated` | -15 divs | -0 lines (just removals) | 2 hrs | 🔥🔥🔥 |
| Simplify `gen-ai-cards` CSS vars | -0 | -300 lines CSS | 1 hr | 🔥🔥 |
| Fix long selector chains | -0 | Faster parsing | 2 hrs | 🔥🔥 |

### Medium Priority:

| Change | DOM Reduction | Code Reduction | Effort | Impact |
|--------|---------------|----------------|--------|--------|
| Remove duplicate card wrappers | -5-10 divs | -50 lines | 3 hrs | 🔥🔥 |
| Remove `innerHTML` pattern | -0 | Faster render | 2 hrs | 🔥 |
| Consolidate carousel code | -0 | -500 lines | 8 hrs | 🔥 |

### Low Priority (Nice to Have):

| Change | DOM Reduction | Code Reduction | Effort | Impact |
|--------|---------------|----------------|--------|--------|
| Remove v1 pricing cards | -0 | -726 lines | 4 hrs | 🔥 |
| Minify CSS production | -0 | -30% CSS size | 2 hrs | 🔥 |
| Remove dead functions | -0 | -200 lines | 6 hrs | 🔥 |

---

## 🚀 Quick Wins (Start Here)

### Quick Win #1: Remove `addTempWrapperDeprecated` (2 hours)

**Files to change:** 25+ blocks

**Pattern:**
```diff
export default function decorate(block) {
- addTempWrapperDeprecated(block, 'my-block');
  // ... rest of code
}
```

**CSS to update:**
```diff
- .my-block-wrapper .my-block {
+ .my-block {
    /* styles */
  }
```

**Result:**
- ✅ -15 wrapper divs on homepage
- ✅ Simpler CSS
- ✅ Smaller DOM

---

### Quick Win #2: Simplify `gen-ai-cards.css` (1 hour)

**Before:** 700 lines, 61 CSS variables
**After:** 400 lines, 5 CSS variables

**Keep only:**
```css
.gen-ai-cards {
  --color-primary: #212121;
  --color-background: #EDEEFF;
  --card-width-desktop: 380px;
  --transition-duration: 0.3s;
  --border-radius: 8px;
}
```

**Inline the rest:**
```css
.gen-ai-card {
  padding: 12px; /* was var(--card-padding) */
  gap: 8px; /* was var(--card-gap) */
}
```

**Result:**
- ✅ -300 lines CSS
- ✅ -40% file size
- ✅ Faster CSS parsing

---

### Quick Win #3: Fix Long Selectors (2 hours)

**Find and replace overly complex selectors:**

**Before:**
```css
.section:not(.xxxl-spacing-static, .xxl-spacing-static, ...) .block:first-child {
```

**After:**
```css
.section:not([class*="-spacing"]) .block:first-child {
```

**Or:**
```css
.block.default-spacing {
```

**Result:**
- ✅ 10x faster selector matching
- ✅ More maintainable
- ✅ Smaller CSS

---

## 📋 Detailed Audit Checklist

### For Each Block, Ask:

- [ ] Does it use `addTempWrapperDeprecated`? → **Remove it**
- [ ] Does it use `.innerHTML = ''`? → **Refactor to DOM manipulation**
- [ ] Does it create nested wrapper divs unnecessarily? → **Flatten structure**
- [ ] Does CSS have 10+ variables used once? → **Inline them**
- [ ] Are there selectors with 5+ class negations? → **Simplify**
- [ ] Is there commented-out code? → **Delete it**
- [ ] Are there `console.log` statements? → **Remove them**
- [ ] Is this a v1 file with a v2 version? → **Delete v1**

---

## 🎯 Specific Blocks to Target (Homepage Only)

### Blocks Actually on Homepage:

1. **grid-marquee** (415 JS + 512 CSS lines)
   - Check for wrapper removal
   - Simplify CSS

2. **simplified-pricing-cards-v2** (552 JS + 625 CSS lines)
   - Remove extra card wrappers?
   - Consolidate CSS variables

3. **quotes** (471 JS + 858 CSS lines)
   - Already optimized in `quotes-lazy-backgrounds` branch
   - Merge those changes

4. **gen-ai-cards** (700 CSS lines)
   - **Priority #1:** Reduce CSS variables
   - **Priority #2:** Simplify selectors

5. **banner** (145 JS + 161 CSS lines)
   - Check for `addTempWrapperDeprecated`

6. **logo-row** (small, probably fine)

7. **discover-cards** (330 JS + 258 CSS lines)
   - Check for wrapper removal

---

## 🔬 Measurement Strategy

### Before (Baseline):
```bash
# Measure DOM size
document.querySelectorAll('*').length

# Measure CSS size
Array.from(document.styleSheets)
  .map(s => s.cssRules.length)
  .reduce((a,b) => a+b, 0)

# Measure JS heap
performance.memory.usedJSHeapSize
```

### After Each Change:
- Run same measurements
- Compare Lighthouse scores
- Check Core Web Vitals

---

## 🎬 Recommended Implementation Order

### Phase 1: Low-Hanging Fruit (1 week)
1. Remove `addTempWrapperDeprecated` (all blocks)
2. Simplify `gen-ai-cards.css` variables
3. Fix long CSS selectors

**Expected Gain:** -20 DOM nodes, -500 lines CSS, +2-3 Lighthouse points

### Phase 2: Structural Changes (2 weeks)
4. Remove duplicate card wrappers
5. Refactor `.innerHTML` patterns
6. Delete old v1 blocks (if v2 exists)

**Expected Gain:** -10 DOM nodes, -1000 lines JS, +3-5 Lighthouse points

### Phase 3: Consolidation (3 weeks)
7. Consolidate carousel utilities
8. Remove dead code/functions
9. Minify CSS for production

**Expected Gain:** -500 lines JS, +2-3 Lighthouse points

---

## ⚠️ Risks and Mitigation

### Risk #1: Breaking Existing Styles
**Mitigation:** Test each block individually, visual regression tests

### Risk #2: Breaking v1 Sites
**Mitigation:** Only remove code if v2 is fully deployed

### Risk #3: Regressions
**Mitigation:** Run full test suite after each change

---

## 📈 Success Metrics

| Metric | Baseline | Target | Stretch Goal |
|--------|----------|--------|--------------|
| **DOM Nodes** | ~800 | <750 | <700 |
| **CSS Rules** | ~2,000 | <1,800 | <1,600 |
| **JS Heap** | ~15MB | <13MB | <12MB |
| **Lighthouse Performance** | 86 | 90 | 92+ |
| **Total Code** | ~40,000 lines | <38,000 | <36,000 |

---

## 🤔 Questions to Answer

1. **Can we delete old pricing-cards.js now that v2 exists?**
   - Check: Is v2 fully deployed?
   - Check: Any pages still using v1?

2. **Why do we have 4 different carousel implementations?**
   - Can they be unified?
   - What's blocking consolidation?

3. **Is `addTempWrapperDeprecated` actually needed anywhere?**
   - It's named "deprecated" - can we remove it completely?

4. **Which blocks are NOT on the homepage?**
   - Don't optimize those (yet)
   - Focus only on homepage blocks

5. **Can we remove holiday-specific code after holidays?**
   - `template-x.js` has `decorateHoliday()` function
   - Does this need to load year-round?

---

## 💡 Pro Tips

1. **Start with CSS** - Easier wins, lower risk
2. **Measure Everything** - Before/after for each change
3. **One Block at a Time** - Don't refactor everything at once
4. **Keep Tests Green** - Run tests after each change
5. **Document Removals** - Note why code was safe to delete

---

## 🎓 Lessons from Previous Work

From `quotes-lazy-backgrounds` branch:
- ✅ **Device-aware rendering** reduced DOM by 50%
- ✅ **Single container** instead of two = cleaner
- ✅ **Removed duplicate CSS** = smaller files

**Apply these principles to other blocks!**

---

## Ready to Start?

**Recommend starting with:**
1. ✅ Remove `addTempWrapperDeprecated` from `banner.js` (test case)
2. ✅ Simplify `gen-ai-cards.css` variables
3. ✅ Fix 3-5 longest CSS selectors

**Time estimate:** 4-5 hours for these three quick wins
**Expected impact:** +2-3 Lighthouse points

Want to proceed? 🚀

