# 🎨 CSS Minification Workflow

## Two Approaches

### Option 1: Commit Minified Files (Recommended for EDS)
**How it works:**
- Keep original `.css` files as source of truth
- Generate `.min.css` files locally
- Commit both to git
- **Don't swap** - serve originals in development

**Pros:**
- ✅ Both versions available in repo
- ✅ Easy to edit (edit originals)
- ✅ Easy to review in PRs
- ✅ No build process needed
- ✅ Can serve minified in production manually

**Cons:**
- ❌ Larger repo size (2x CSS files)
- ❌ Need to remember to regenerate after edits
- ❌ Can get out of sync

**Workflow:**
```bash
# 1. Edit your CSS
vim express/code/blocks/my-block/my-block.css

# 2. Minify it
./scripts/minify-css.sh express/code/blocks/my-block/my-block.css

# 3. Commit both
git add express/code/blocks/my-block/*.css
git commit -m "feat: update my-block styles"
```

---

### Option 2: Swap and Commit (What We're Testing)
**How it works:**
- Minify files locally
- Swap originals with minified (backup originals)
- Commit the swapped files
- **Result:** Production serves minified CSS

**Pros:**
- ✅ Production automatically gets minified CSS
- ✅ No manual serving needed
- ✅ Smaller deployed size

**Cons:**
- ❌ Hard to read/edit in repo
- ❌ Need to restore to edit
- ❌ PR diffs are ugly
- ❌ Confusing for contributors

**Workflow:**
```bash
# 1. Restore to edit
./scripts/restore-original-css.sh

# 2. Edit your CSS
vim express/code/blocks/my-block/my-block.css

# 3. Minify
./scripts/minify-css.sh express/code/blocks/my-block/my-block.css

# 4. Swap
./scripts/use-minified-css.sh

# 5. Commit
git add express/code/blocks/my-block/*.css
git commit -m "feat: update my-block styles"
```

---

## 🎯 Recommended Workflow for Express Milo

### For Development/Testing (Current Branch)
Use **Option 2** (Swap and Commit) to test the impact:
```bash
# Already done - just test and measure
```

### For Production (Long-term)
Use **Option 1** (Keep Both) with GitHub Action:
```bash
# Edit original
vim express/code/blocks/my-block/my-block.css

# Minify
./scripts/minify-css.sh express/code/blocks/my-block

# Commit both
git add express/code/blocks/my-block/my-block.css
git add express/code/blocks/my-block/my-block.min.css
git commit -m "feat: update my-block styles"
git push

# GitHub Action will:
# - Detect CSS change
# - Regenerate .min.css if needed
# - Comment on PR with savings
```

---

## 🤖 GitHub Action Enhancement

Update the action to:
1. Check if `.min.css` is out of sync with `.css`
2. Auto-regenerate if needed
3. Commit back to PR

This ensures `.min.css` is always up to date.

---

## 📦 Alternative: Pre-commit Hook

Auto-minify on commit:
```bash
# .git/hooks/pre-commit
#!/bin/bash
git diff --cached --name-only --diff-filter=ACM | grep '\.css$' | grep -v '\.min\.css$' | while read file; do
  echo "Minifying $file..."
  ./scripts/minify-css.sh "$file"
  git add "${file%.css}.min.css"
done
```

---

## 🎯 My Recommendation

**For your use case (EDS/Franklin):**

1. **Current branch (css-minification):** Keep as-is for testing
2. **Going forward:** Use Option 1 (keep both) with these rules:
   - ✅ Always edit `.css` files (originals)
   - ✅ Run `./scripts/minify-css.sh <file>` after edits
   - ✅ Commit both `.css` and `.min.css`
   - ✅ GitHub Action validates they're in sync
   - ✅ **Serve `.min.css` in production** (update imports)

3. **Update blocks to load `.min.css`:**
```javascript
// In lib-franklin.js or wherever CSS is loaded
const cssPath = prod ? 'my-block.min.css' : 'my-block.css';
```

This gives you:
- ✅ Readable source in repo
- ✅ Easy editing
- ✅ Clean PR diffs
- ✅ Minified files in production
- ✅ Automated validation
