# CSS Minification Recommendation for Adobe EDS

## 🎯 **The Right Solution**

**Implement CSS Minification in Edge Functions**

Use Cloudflare Workers or Lambda@Edge to minify CSS on-the-fly at the CDN edge.

---

## 🤔 **Why This is the Best Approach**

### **Adobe EDS Already Does This for Images:**
```html
<!-- Author writes: -->
<img src="media_123abc.png">

<!-- EDS serves: -->
<picture>
  <source type="image/webp" srcset="media_123abc.png?width=750&format=webp">
  <img src="media_123abc.png?width=750">
</picture>
```

### **CSS Should Work the Same Way:**
```html
<!-- Author writes: -->
<link rel="stylesheet" href="/blocks/my-block/my-block.css">

<!-- EDS should serve: -->
<link rel="stylesheet" href="/blocks/my-block/my-block.css?minified=true">
<!-- Or auto-serve minified version based on environment -->
```

---

## ✅ **Benefits**

| Benefit | Why It Matters |
|---------|----------------|
| **Zero git commits** | Clean history, no pollution |
| **Zero workflow changes** | Developers work normally |
| **Zero manual steps** | No scripts to remember |
| **Auto-optimization** | Like images, videos, etc. |
| **Environment-aware** | Preview = readable, Prod = minified |

---

## 📊 **Proven Impact**

Our testing shows CSS minification provides:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Performance Score | 81 | 85 | **+4 points** |
| LCP | 4.6s | 4.0s | **-600ms** |
| FCP | 1.9s | 1.6s | **-300ms** |
| CSS Size | 772 KB | 668 KB | **-104 KB (13.6%)** |

**This is significant for mobile users on slow connections.**

---

## 🛠️ **How to Implement (Edge Functions)**

### **Option A: Edge Function (Recommended)**

Deploy to Cloudflare Workers or AWS Lambda@Edge:

```javascript
// In EDS edge worker/CDN
if (request.url.endsWith('.css') && isProduction) {
  const css = fetchOriginalCSS();
  const minified = minifyCSS(css); // Remove whitespace, comments
  return minified;
}
```

**Pros:**
- Source files stay readable
- No build process needed
- Works automatically

### **Option B: Query Parameter**

```html
<!-- Opt-in via query param -->
<link href="/blocks/my-block/my-block.css?minified=true">
```

**Pros:**
- Explicit control
- Can test both versions

### **Option C: Environment-Based**

```
Preview: https://main--express-milo--adobecom.aem.page
  → Serves readable CSS (for debugging)

Production: https://www.adobe.com/express/
  → Serves minified CSS (for performance)
```

**Pros:**
- Best developer experience
- Best production performance

---

## 🔄 **Comparison to Other Solutions**

### **Manual Minification (Current)**
```
❌ Pollutes git history with bot commits
❌ Requires developer action
❌ Easy to forget
❌ Merge conflicts on minified files
```

### **Build Process**
```
❌ Adobe EDS is "no build" - violates philosophy
❌ Adds complexity (PostCSS, webpack, etc.)
❌ Slower development cycles
```

### **Server-Side (Recommended)**
```
✅ Zero developer overhead
✅ Clean git history
✅ Automatic optimization
✅ Environment-aware (debug vs. prod)
```

---

## 📝 **Feature Request Template**

**Title:** CSS Minification Support in Adobe EDS

**Description:**
Currently, Adobe EDS automatically optimizes images (WebP conversion, srcset, lazy loading) but serves CSS files as-is. We request CSS minification support similar to image optimization.

**Rationale:**
- Testing shows **+4 Lighthouse score** and **-600ms LCP** with minified CSS
- 101 CSS files totaling 772 KB could be reduced to 668 KB (13.6% savings)
- Manual minification pollutes git history and adds developer overhead
- Server-side minification matches EDS philosophy of automatic optimization

**Proposed Implementation:**
1. Auto-minify CSS on production domains (`*.adobe.com`)
2. Serve readable CSS on preview domains (`*.aem.page`) for debugging
3. Or support query parameter: `?minified=true`

**Priority:** Medium (performance improvement, developer experience)

**Related:** Image optimization, WebP conversion, lazy loading

---

## 🎓 **In the Meantime**

### **Keep Readable CSS in Git**
```bash
# Only commit readable source files
git add express/code/blocks/**/*.css
git commit -m "feat: update styles"

# .min.css files are .gitignored
# Generate them locally for testing only
./scripts/minify-css.sh express/code/blocks
```

### **Test Minified Locally**
```bash
# 1. Minify for testing
./scripts/minify-css.sh express/code/blocks
./scripts/use-minified-css.sh

# 2. Test in browser
# 3. Restore for development
./scripts/restore-original-css.sh
```

### **Don't Commit Minified Files**
```bash
# .gitignore includes:
**/*.min.css
**/*.css.backup
```

---

## 📞 **Who to Contact**

- **Adobe EDS Team:** Request this feature
- **Franklin/Helix Team:** May already have this planned
- **Platform Engineering:** Can implement server-side minification

---

## 🏆 **Success Metrics**

If Adobe EDS implements server-side CSS minification:

- ✅ Zero extra commits in git history
- ✅ Developers work with readable CSS
- ✅ Production gets optimized CSS
- ✅ +4-5 Lighthouse score improvement
- ✅ -500-700ms LCP improvement on mobile

**This is a win-win for everyone!**

---

## 📚 **References**

- **CSS Minification Testing:** This branch (`css-minification`)
- **Lighthouse Reports:** 104 KB saved, +4 score, -600ms LCP
- **Scripts:** `scripts/minify-css.sh` (proof of concept)
- **Workflow Analysis:** `CSS_MINIFICATION_WORKFLOW.md`

---

**Recommendation:** File a feature request with Adobe EDS team to add server-side CSS minification.

**Timeline:** Until then, keep CSS readable in git, don't commit minified versions.

**Status:** Proven to work (+4 Lighthouse score), needs platform support.

---

**Last Updated:** October 16, 2025  
**Branch:** css-minification  
**Contact:** Adobe Express Team

