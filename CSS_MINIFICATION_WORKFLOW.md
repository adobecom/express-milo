# CSS Minification Workflow for Adobe EDS

## 🎯 **Goal**
Keep CSS **readable** for development, but serve **minified** CSS in production for performance.

---

## 📋 **The Problem We Solved**
- ✅ Minifying CSS saves **104 KB (13.6%)**
- ✅ Improves Lighthouse score by **+4 points**
- ✅ Reduces LCP by **600ms** on mobile
- ❌ **BUT** minified CSS is unreadable for development

---

## 🛠️ **Solution: Production-Only Minification**

### **Option 1: GitHub Actions (Recommended)**

Automatically minify CSS when pushing to production branches:

```yaml
# .github/workflows/minify-css-prod.yml
name: Minify CSS for Production

on:
  push:
    branches:
      - main
      - stage
    paths:
      - 'express/code/blocks/**/*.css'
      - '!express/code/blocks/**/*.min.css'

jobs:
  minify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Minify all CSS files
        run: |
          chmod +x ./scripts/minify-css.sh
          ./scripts/minify-css.sh express/code/blocks
      
      - name: Swap to minified versions
        run: |
          chmod +x ./scripts/use-minified-css.sh
          ./scripts/use-minified-css.sh
      
      - name: Commit minified CSS
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add express/code/blocks/**/*.css
          git commit -m "chore: auto-minify CSS for production [skip ci]" || echo "No changes"
          git push
```

**Pros:**
- ✅ Automatic
- ✅ No developer action needed
- ✅ Always minified in production
- ✅ Source files stay readable

**Cons:**
- ⚠️ Adds extra commit to history
- ⚠️ Need `[skip ci]` to avoid infinite loops

---

### **Option 2: Pre-Deploy Script (Manual)**

Run before merging to production:

```bash
# 1. Develop normally with readable CSS
vim express/code/blocks/my-block/my-block.css

# 2. Before merging to main/stage, minify:
./scripts/minify-css.sh express/code/blocks
./scripts/use-minified-css.sh

# 3. Commit minified versions:
git add express/code/blocks/**/*.css
git commit -m "feat: my feature (CSS minified for production)"
git push

# 4. After merge, restore for next development:
./scripts/restore-original-css.sh
```

**Pros:**
- ✅ Full control
- ✅ No extra automation needed
- ✅ Clean history

**Cons:**
- ❌ Manual process (easy to forget)
- ❌ Risk of pushing unminified CSS

---

### **Option 3: Branch-Based Approach**

Keep readable CSS in feature branches, minified in main/stage:

```bash
# Development branch: readable CSS
git checkout feature/my-feature
vim express/code/blocks/my-block/my-block.css
git commit -am "feat: my feature"

# Before merging to main:
./scripts/minify-css.sh express/code/blocks
./scripts/use-minified-css.sh
git add express/code/blocks/**/*.css
git commit -m "chore: minify CSS for production"

# Merge to main
git checkout main
git merge feature/my-feature
git push origin main

# Start next feature with readable CSS
git checkout -b feature/next-feature
./scripts/restore-original-css.sh
```

**Pros:**
- ✅ Clear separation
- ✅ Production branch always minified
- ✅ Development branches readable

**Cons:**
- ⚠️ More complex git workflow
- ⚠️ Merge conflicts if CSS changed in main

---

### **Option 4: Server-Side Minification (Ideal)**

**If** Adobe Edge Delivery can minify CSS on the server:

```html
<!-- EDS automatically serves minified version -->
<link rel="stylesheet" href="/blocks/my-block/my-block.css">
<!-- Server transforms to: my-block.min.css -->
```

**Pros:**
- ✅ Best of both worlds
- ✅ No workflow changes
- ✅ Source stays readable

**Cons:**
- ❓ Need to check if EDS supports this

---

## 🚀 **Recommended Workflow**

### **For Adobe EDS (No Build Process):**

**Short term:**
1. Keep CSS readable in repo
2. Use **GitHub Actions** to auto-minify on push to `main`/`stage`
3. Or use **pre-deploy script** before merging

**Long term:**
- Request server-side CSS minification from Adobe EDS team
- Similar to how they already optimize images

---

## 📊 **Performance Impact**

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Performance Score | 81 | 85 | +4 points |
| LCP | 4.6s | 4.0s | -600ms |
| FCP | 1.9s | 1.6s | -300ms |
| CSS Size | 772 KB | 668 KB | -104 KB |

**Worth it?** ✅ Yes! But only for production.

---

## 🛠️ **Available Scripts**

```bash
# Minify all CSS in blocks
./scripts/minify-css.sh express/code/blocks

# Minify specific file
./scripts/minify-css.sh express/code/blocks/my-block/my-block.css

# Swap to minified versions (creates .backup)
./scripts/use-minified-css.sh

# Restore readable versions
./scripts/restore-original-css.sh

# Dry run (preview changes)
./scripts/minify-css.sh express/code/blocks true
```

---

## 🎓 **Best Practice**

1. ✅ **Develop with readable CSS**
2. ✅ **Test with readable CSS**
3. ✅ **Minify only before production deploy**
4. ✅ **Keep `.min.css` files in `.gitignore` (optional)**
5. ✅ **Document the workflow in PR template**

---

## 🤔 **FAQ**

### **Q: Why not commit minified CSS?**
**A:** Makes code reviews impossible and development painful.

### **Q: Can we use PostCSS/cssnano?**
**A:** No, Adobe EDS has no build process. Pure bash/sed solution.

### **Q: What about CSS in `/styles/`?**
**A:** Can minify those too, but blocks are higher priority (772 KB).

### **Q: Will this break hot reload?**
**A:** No, as long as you develop with readable CSS.

### **Q: Performance worth the hassle?**
**A:** +600ms LCP improvement = yes for production. Not worth it for every dev commit.

---

## ✅ **Next Steps**

1. Choose workflow (recommend GitHub Actions)
2. Update `.github/workflows/` if automated
3. Document in team wiki
4. Add to PR checklist (if manual)
5. Consider requesting server-side minification from Adobe

---

**Last Updated:** October 16, 2025  
**Branch:** css-minification  
**Status:** Proven to work (+4 Lighthouse score)

