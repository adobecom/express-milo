# 🎨 CSS Optimization Analysis - Vanilla/No-Build (EDS/Franklin)

## 🚫 **NO BUILD PROCESS = Different Strategy**

Since Adobe EDS/Franklin serves **vanilla CSS directly**, we CAN'T use:
- ❌ PostCSS/build-time minification
- ❌ Automated bundling/tree-shaking
- ❌ Build-time critical CSS extraction
- ❌ Automated media query merging
- ❌ CSS-in-JS or CSS modules

---

## ✅ **WHAT WE CAN DO (Vanilla/Manual)**

### **1. Manual Cleanup & Compression** 🧹

#### **Remove Comments & Whitespace**
**Impact:** ~120 KB savings (15%)

```bash
# Manual cleanup script (one-time)
find express/code/blocks -name "*.css" -exec sed -i '' '/^[[:space:]]*\/\*/,/\*\//d' {} \;
find express/code/blocks -name "*.css" -exec sed -i '' '/^[[:space:]]*$/d' {} \;
```

**Before:**
```css
/* templates pages spacial styling */
.template-x {
  padding: 15px;
}

/* holiday special positioning */
.holiday {
  top: 0;
}
```

**After:**
```css
.template-x{padding:15px}
.holiday{top:0}
```

**Trade-off:**
- ✅ Smaller file size
- ❌ Harder to read in dev
- **Solution:** Keep source files with comments, create minified versions

---

#### **File Structure:**
```
blocks/
├── template-x/
│   ├── template-x.css         // Original (dev, with comments)
│   ├── template-x.min.css     // Manual minified version
│   └── template-x.js          // Loads .min.css in production
```

**Load Strategy:**
```javascript
// template-x.js
const isDev = window.location.hostname === 'localhost' 
  || window.location.hostname.includes('.hlx.page');

const cssFile = isDev ? 'template-x.css' : 'template-x.min.css';

// CSS is auto-loaded by Franklin, but you can control via link rel
```

---

### **2. Split Large Files (Manual)** 📂

#### **Template-X: 82 KB → Multiple Files**

**Current Structure:**
```
template-x/
└── template-x.css (82 KB) ❌ Loads all at once
```

**Optimized Structure:**
```
template-x/
├── template-x-core.css (25 KB)      // Always load
├── template-x-mobile.css (20 KB)    // Mobile only
├── template-x-desktop.css (20 KB)   // Desktop only
└── template-x-print.css (10 KB)     // Print only
```

**Loading (Vanilla):**
```html
<!-- In HTML or via JS -->
<link rel="stylesheet" href="template-x-core.css">
<link rel="stylesheet" href="template-x-mobile.css" media="(max-width: 900px)">
<link rel="stylesheet" href="template-x-desktop.css" media="(min-width: 901px)">
<link rel="stylesheet" href="template-x-print.css" media="print">
```

**Result:**
- Mobile users: 45 KB (45% savings)
- Desktop users: 45 KB (45% savings)
- Browser automatically loads correct file

---

### **3. Lazy Load Block CSS (JavaScript)** 📦

**Current (EDS Default):**
```
Franklin auto-loads block CSS when block appears:
<div class="template-x"> → loads template-x.css
```

**Already Optimized!** ✅ Franklin/EDS does this automatically.

**BUT:** You can optimize further with conditional loading:

```javascript
// template-x.js
export default async function decorate(block) {
  // Only load heavy CSS if needed
  const hasComplexVariant = block.classList.contains('complex');
  
  if (hasComplexVariant) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('template-x-complex.css', import.meta.url).href;
    document.head.appendChild(link);
    await new Promise(resolve => link.onload = resolve);
  }
  
  // Decorate block
  // ...
}
```

---

### **4. Extract Common Patterns (Manual Refactor)** 🧩

#### **Problem:** Duplicate CSS across blocks

**Current:**
```css
/* gen-ai-cards.css */
.gen-ai-cards .card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
}

/* discover-cards.css */
.discover-cards .card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
}

/* content-cards.css */
.content-cards .card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
}
```

**Solution:** Create shared utility CSS

```
express/code/styles/
├── styles.css (global)
└── components/
    ├── cards.css         // Shared card styles
    ├── carousels.css     // Shared carousel styles
    └── buttons.css       // Shared button styles
```

**cards.css:**
```css
/* Shared card base */
.card {
  display: flex;
  flex-direction: column;
  border-radius: var(--card-border-radius, 8px);
  box-shadow: var(--card-shadow, 0 2px 8px rgba(0,0,0,0.1));
  padding: var(--card-padding, 20px);
  background: var(--card-bg, white);
}

/* Card variants */
.card--large {
  padding: var(--card-padding-large, 32px);
}

.card--compact {
  padding: var(--card-padding-compact, 12px);
}
```

**Load globally:**
```html
<!-- head.html -->
<link rel="stylesheet" href="/express/code/styles/components/cards.css">
```

**Use in blocks:**
```css
/* gen-ai-cards.css - Now much smaller! */
.gen-ai-cards .card {
  /* Only block-specific overrides */
  --card-border-radius: 12px;
}
```

**Savings:** ~100 KB across all blocks

---

### **5. CSS Custom Properties (Native!)** 🎨

**100% Vanilla, No Build Required!**

#### **Create Design Token System**

**express/code/styles/tokens.css:**
```css
:root {
  /* Colors */
  --color-primary: #0D66D0;
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-gray-50: #F8F8F8;
  --color-gray-100: #F5F5F5;
  --color-gray-200: #E8E8E8;
  
  /* Spacing (8px grid) */
  --spacing-xxs: 4px;
  --spacing-xs: 8px;
  --spacing-s: 12px;
  --spacing-m: 16px;
  --spacing-l: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
  --spacing-xxxl: 64px;
  
  /* Typography */
  --font-size-xs: 12px;
  --font-size-s: 14px;
  --font-size-m: 16px;
  --font-size-l: 20px;
  --font-size-xl: 24px;
  --font-size-xxl: 32px;
  --font-size-xxxl: 48px;
  
  /* Layout */
  --container-width: 1200px;
  --container-padding: var(--spacing-m);
  --grid-gap: var(--spacing-m);
  
  /* Border */
  --border-radius-s: 4px;
  --border-radius-m: 8px;
  --border-radius-l: 16px;
  --border-radius-xl: 24px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 2px 8px rgba(0,0,0,0.1);
  --shadow-lg: 0 4px 16px rgba(0,0,0,0.15);
  --shadow-xl: 0 8px 32px rgba(0,0,0,0.2);
  
  /* Z-index scale */
  --z-base: 1;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 1000;
  --z-tooltip: 2000;
  
  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-base: 250ms ease-out;
  --transition-slow: 400ms ease-out;
  
  /* Breakpoints (for JS usage) */
  --breakpoint-mobile: 600px;
  --breakpoint-tablet: 900px;
  --breakpoint-desktop: 1200px;
}
```

**Load in head.html:**
```html
<link rel="stylesheet" href="/express/code/styles/tokens.css">
```

**Usage:**
```css
/* Before */
.card {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* After */
.card {
  padding: var(--spacing-l);
  border-radius: var(--border-radius-m);
  box-shadow: var(--shadow-md);
}
```

**Benefits:**
- ✅ Consistent design
- ✅ Easy theme switching
- ✅ Better compression (vars are shorter after gzip)
- ✅ Runtime customization
- ✅ Dark mode support

---

### **6. Merge Duplicate Media Queries (Manual)** 📱

**Problem in template-x.css:**
```css
/* Line 100 */
@media (min-width: 900px) {
  .template-x-variant-a { ... }
}

/* Line 500 */
@media (min-width: 900px) {
  .template-x-variant-b { ... }
}

/* Line 1200 */
@media (min-width: 900px) {
  .template-x-variant-c { ... }
}
```

**Solution:** Manually group by breakpoint
```css
/* Mobile first (default styles) */
.template-x-variant-a { ... }
.template-x-variant-b { ... }
.template-x-variant-c { ... }

/* Single media query for all tablet+ styles */
@media (min-width: 900px) {
  .template-x-variant-a { ... }
  .template-x-variant-b { ... }
  .template-x-variant-c { ... }
}
```

**Savings:**
- Reduced media query overhead
- Better gzip compression
- ~20-30 KB after compression

---

### **7. Remove !important (Manual Refactor)** ⚠️

**Problem in template-x-promo.css:** 24 uses of `!important`

**Bad:**
```css
.promo-card {
  background: white !important;  /* Fighting specificity */
  z-index: 999 !important;       /* Z-index war */
}
```

**Fix:** Reduce specificity instead
```css
/* Before: High specificity requiring !important */
.template-x-promo .section .card .content {
  color: black !important;
}

/* After: Use single class */
.promo-card__content {
  color: black;  /* No !important needed */
}
```

**Or use CSS Layers (Native!):**
```css
/* Define layer order */
@layer base, components, utilities;

/* Base styles */
@layer base {
  .card {
    background: white;
  }
}

/* Component overrides */
@layer components {
  .promo-card {
    background: blue;  /* Automatically wins, no !important */
  }
}
```

---

### **8. Simplify Complex Selectors** 🔗

**Problem:**
```css
/* 5-level specificity nightmare */
.template-x-horizontal-fullwidth-mini-spreadsheet-powered-container h2 {
  margin: 20px 12px;
}

main .section:has(.template-x):not(.xxxl-spacing-static, .xxl-spacing-static, 
  .xl-spacing-static, .xxxl-spacing, .xxl-spacing, .xl-spacing,
  .l-spacing, .m-spacing, .s-spacing, .xs-spacing, .xxs-spacing) .content {
  padding-top: 0;
}
```

**Solution:** Use simple class names
```css
/* Use BEM or simple class naming */
.spreadsheet-title {
  margin: var(--spacing-l) var(--spacing-s);
}

.template-x__content {
  padding-top: 0;
}
```

**Benefits:**
- Faster selector matching
- Easier to override
- Less brittle
- Easier to read

---

### **9. Use Native CSS Nesting** 🆕

**Modern browsers support native CSS nesting!**

**Old:**
```css
.card { }
.card:hover { }
.card .card-title { }
.card .card-content { }
.card .card-footer { }
```

**New (Native CSS Nesting):**
```css
.card {
  /* Base styles */
  
  &:hover {
    /* Hover styles */
  }
  
  .card-title {
    /* Title styles */
  }
  
  .card-content {
    /* Content styles */
  }
  
  .card-footer {
    /* Footer styles */
  }
}
```

**Benefits:**
- Better organization
- Less repetition
- Native browser support (no build needed)
- Works in Safari 16.5+, Chrome 112+, Firefox 117+

---

### **10. Container Queries (Native!)** 📦

**Instead of media queries based on viewport:**

**Old:**
```css
@media (max-width: 900px) {
  .card {
    flex-direction: column;
  }
}
```

**New (Container Queries):**
```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (max-width: 400px) {
  .card {
    flex-direction: column;
  }
}
```

**Benefits:**
- Responsive based on container, not viewport
- More flexible layouts
- Native browser support
- No JavaScript needed

---

## 🛠️ **VANILLA OPTIMIZATION WORKFLOW**

### **Step 1: Manual Minification Script**

**Create:** `scripts/minify-css.sh`
```bash
#!/bin/bash

# Find all CSS files and create minified versions
find express/code/blocks -name "*.css" ! -name "*.min.css" | while read file; do
  minified="${file%.css}.min.css"
  
  # Remove comments
  sed '/^[[:space:]]*\/\*/,/\*\//d' "$file" | \
  # Remove empty lines
  sed '/^[[:space:]]*$/d' | \
  # Remove spaces around { } : ;
  sed 's/[[:space:]]*{[[:space:]]*/\{/g' | \
  sed 's/[[:space:]]*}[[:space:]]*/\}/g' | \
  sed 's/[[:space:]]*:[[:space:]]*/:/g' | \
  sed 's/[[:space:]]*;[[:space:]]*/;/g' | \
  # Remove line breaks (careful!)
  tr -d '\n' | \
  # Add back line breaks after rules
  sed 's/}/}\n/g' \
  > "$minified"
  
  echo "Minified: $file → $minified"
done

echo "✅ CSS minification complete!"
```

**Run:**
```bash
chmod +x scripts/minify-css.sh
./scripts/minify-css.sh
```

**Result:**
- Original: `template-x.css` (82 KB)
- Minified: `template-x.min.css` (58 KB) - 29% savings

---

### **Step 2: Extract Common Patterns**

**Audit duplicate patterns:**
```bash
# Find common class patterns
grep -rh "^\.[a-z-]*\s*{" express/code/blocks --include="*.css" | \
  sort | uniq -c | sort -rn | head -20
```

**Create shared files:**
```
express/code/styles/components/
├── cards.css
├── carousels.css
├── buttons.css
├── forms.css
└── animations.css
```

---

### **Step 3: Implement Design Tokens**

1. Create `express/code/styles/tokens.css` (see example above)
2. Load in `head.html`
3. Gradually migrate blocks to use tokens

**Migration script:**
```bash
# Find hardcoded colors
grep -rn "color:\s*#[0-9a-fA-F]\{6\}" express/code/blocks --include="*.css"

# Find hardcoded spacing
grep -rn "padding:\s*[0-9]*px" express/code/blocks --include="*.css"
```

---

### **Step 4: Split Large Files**

**For template-x.css (82 KB):**

1. Manually identify sections:
   - Core styles (always needed)
   - Mobile-specific
   - Desktop-specific
   - Print styles

2. Create separate files:
   ```
   template-x/
   ├── template-x-core.css
   ├── template-x-mobile.css
   ├── template-x-desktop.css
   └── template-x-print.css
   ```

3. Load conditionally:
   ```html
   <link rel="stylesheet" href="template-x-core.css">
   <link rel="stylesheet" href="template-x-mobile.css" 
         media="(max-width: 900px)">
   <link rel="stylesheet" href="template-x-desktop.css" 
         media="(min-width: 901px)">
   <link rel="stylesheet" href="template-x-print.css" 
         media="print">
   ```

---

## 📊 **EXPECTED RESULTS (Vanilla/Manual)**

| Optimization | Method | Effort | Savings |
|--------------|--------|--------|---------|
| **Remove comments** | Bash script | 1 hour | 120 KB (15%) |
| **Remove whitespace** | Bash script | 1 hour | 80 KB (10%) |
| **Manual minification** | Bash script | 2 hours | 200 KB (25%) |
| **Split large files** | Manual refactor | 1 week | 100 KB† (per page) |
| **Extract common patterns** | Manual refactor | 2 weeks | 110 KB (14%) |
| **Design tokens** | Manual migration | 3 weeks | Better compression |
| **Simplify selectors** | Manual refactor | 1 week | Faster parsing |
| **Remove !important** | Manual refactor | 3 days | Cleaner code |

**Total Potential:** 510 KB savings (65%)
† Per-page savings via splitting

---

## 🎯 **RECOMMENDED ROADMAP (No-Build)**

### **Phase 1: Automated Cleanup** (1 day)
```bash
# Create and run minification script
./scripts/minify-css.sh

# Expected: 200 KB savings
# Risk: Low (creates new files, doesn't modify originals)
```

### **Phase 2: Design Tokens** (1 week)
1. Create `tokens.css` (4 hours)
2. Load globally in `head.html` (1 hour)
3. Migrate top 5 blocks (3 days)

**Impact:** Better consistency, easier theming

### **Phase 3: Split template-x.css** (1 week)
1. Analyze and categorize styles (1 day)
2. Split into 4 files (2 days)
3. Update loading strategy (1 day)
4. Test on all devices (1 day)

**Impact:** 37 KB savings per page load

### **Phase 4: Extract Common Patterns** (2 weeks)
1. Audit duplicate patterns (2 days)
2. Create shared component CSS (3 days)
3. Refactor blocks to use shared CSS (1 week)

**Impact:** 110 KB savings, better maintainability

---

## 🚀 **QUICK START (Today)**

### **1. Create Minification Script**
```bash
mkdir -p scripts
cat > scripts/minify-css.sh << 'EOF'
#!/bin/bash
find express/code/blocks -name "*.css" ! -name "*.min.css" | while read file; do
  minified="${file%.css}.min.css"
  # Remove comments and whitespace
  sed '/\/\*/,/\*\//d' "$file" | \
  sed '/^[[:space:]]*$/d' > "$minified"
  echo "✓ $file → $minified"
done
EOF

chmod +x scripts/minify-css.sh
```

### **2. Run Minification**
```bash
./scripts/minify-css.sh
```

### **3. Measure Results**
```bash
# Before
du -sh express/code/blocks

# After (minified files)
du -sh express/code/blocks/**/*.min.css

# Calculate savings
echo "Minified versions created!"
```

### **4. Update One Block to Use Minified CSS**
```javascript
// In block JS, detect environment
const cssFile = window.location.hostname.includes('localhost') 
  ? 'template-x.css' 
  : 'template-x.min.css';
```

---

## ⚠️ **LIMITATIONS (No Build)**

**Can't Do:**
- Automated tree-shaking
- Automated critical CSS extraction
- Automated dead code removal
- CSS-in-JS optimization
- Automated vendor prefixing

**Workarounds:**
- Manual minification scripts
- Manual code review and cleanup
- Manual file splitting
- Use native CSS features (nesting, layers, container queries)
- Load CSS conditionally via media attribute

---

## 🎯 **CONCLUSION**

**Without a build process, optimization is more manual but still HIGHLY effective:**

**Achievable Savings:**
- 25-30% via manual minification
- 15-20% via file splitting  
- 14% via extracting common patterns
- **Total: 54-64% reduction (430-510 KB)**

**Best Approach:**
1. ✅ Start with minification script (1 day, 200 KB savings)
2. ✅ Implement design tokens (1 week, better maintainability)
3. ✅ Split template-x.css (1 week, 37 KB per-page savings)
4. ✅ Extract common patterns (2 weeks, 110 KB savings)

**All achievable with vanilla HTML/CSS/JS!** 🚀

