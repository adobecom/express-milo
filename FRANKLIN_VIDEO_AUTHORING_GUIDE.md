# Franklin Video Authoring Guide - How MP4 Files Get Authored

## 📝 Overview

Franklin supports **document-based authoring** - content creators use familiar tools like **Microsoft Word**, **Google Docs**, or **Excel/Sheets** rather than a traditional CMS interface.

---

## 🎬 Method 1: Link in Document (Most Common)

### **Step 1: Upload Video to SharePoint/Drive**

#### **SharePoint:**
```
1. Open your SharePoint site
2. Navigate to your content folder
   Example: /express/website/drafts/yeiber/
3. Click "Upload" → Select your video file
   Example: hero-animation.mp4 (433 KB)
4. Copy the SharePoint link
   Example: https://adobecom.sharepoint.com/.../hero-animation.mp4?web=1&e=abc123
```

#### **Google Drive:**
```
1. Open Google Drive
2. Navigate to your content folder
3. Upload video file
4. Right-click → "Get link" → Copy
```

---

### **Step 2: Author in Word/Docs**

#### **Option A: Simple Link (Auto-converts to Video)**

**In Microsoft Word:**
```
Type or paste the video URL on its own line:
https://sharepoint.com/.../hero-animation.mp4

Franklin will automatically convert this to a <video> tag!
```

**What Franklin sees:**
```html
<!-- Author types: -->
https://sharepoint.com/.../hero-animation.mp4

<!-- Franklin converts to: -->
<p><a href="./media_184ba127...aeb.mp4">video link</a></p>

<!-- Your code transforms to: -->
<video preload="metadata">
  <source src="./media_184ba127...aeb.mp4" type="video/mp4">
</video>
```

---

#### **Option B: Link with Text**

**In Word/Docs:**
```
Watch this demo: https://sharepoint.com/.../demo.mp4
```

**Result:**
```html
<p>Watch this demo: <a href="./media_xxx.mp4">demo</a></p>
```

Your code can detect the `.mp4` link and transform it to `<video>`.

---

#### **Option C: Hyperlinked Text**

**In Word:**
```
1. Type: "Click to watch"
2. Highlight the text
3. Insert → Hyperlink
4. Paste video URL
5. Click OK
```

**Result:**
```html
<p><a href="./media_xxx.mp4">Click to watch</a></p>
```

---

### **Step 3: Franklin Processing**

```
Author saves document
    ↓
Franklin detects change (webhook)
    ↓
Downloads document
    ↓
Extracts video URL
    ↓
Downloads video from SharePoint
    ↓
Generates hash: 184ba127fa10e6b95b4bf300c8397d00186227aeb
    ↓
Re-encodes video (⚠️ THE BUG!)
    ↓
Stores as: media_184ba127...aeb.mp4
    ↓
Updates document HTML:
  href="./media_184ba127...aeb.mp4"
```

---

## 🎬 Method 2: Block-Based Authoring

### **Using Tables for Blocks**

Franklin uses **tables** to define blocks with videos:

#### **Example: Hero Block with Background Video**

**In Word/Docs, create a table:**

```
┌────────────────────────────────────────┐
│ Hero (Video Background)                │
├────────────────────────────────────────┤
│ https://sharepoint.com/.../hero.mp4    │
├────────────────────────────────────────┤
│ The quick and easy create-anything app │
├────────────────────────────────────────┤
│ [Start Free Trial]                     │
└────────────────────────────────────────┘
```

**Franklin converts to:**

```html
<div class="hero video-background">
  <div>
    <div><a href="./media_xxx.mp4">video</a></div>
    <div><h1>The quick and easy create-anything app</h1></div>
    <div><a href="/signup">Start Free Trial</a></div>
  </div>
</div>
```

**Your JavaScript decorates to:**

```javascript
// In hero.js
export default async function decorate(block) {
  const videoLink = block.querySelector('a[href$=".mp4"]');
  if (videoLink) {
    const video = createOptimizedVideo({
      src: videoLink.href,
      container: block,
      attributes: { playsinline: '', muted: '', loop: '', autoplay: '' }
    });
    videoLink.parentElement.replaceChild(video, videoLink);
  }
}
```

---

### **Example: Columns Block with Multiple Videos**

**In Word/Docs:**

```
┌─────────────────────┬─────────────────────┬─────────────────────┐
│ Columns (3-up)      │                     │                     │
├─────────────────────┼─────────────────────┼─────────────────────┤
│ Feature 1           │ Feature 2           │ Feature 3           │
├─────────────────────┼─────────────────────┼─────────────────────┤
│ Description...      │ Description...      │ Description...      │
├─────────────────────┼─────────────────────┼─────────────────────┤
│ sharepoint.com/v1   │ sharepoint.com/v2   │ sharepoint.com/v3   │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

**Result:** Each cell gets its own `media_` video after processing.

---

## 🎬 Method 3: Section Metadata (Advanced)

### **Control Video Behavior via Metadata**

**In Word/Docs, add a section metadata table:**

```
┌─────────────────────────────────────┐
│ Section Metadata                    │
├─────────────────────────────────────┤
│ Background Video                    │
│ https://sharepoint.com/.../bg.mp4   │
├─────────────────────────────────────┤
│ Video Options                       │
│ autoplay, loop, muted               │
└─────────────────────────────────────┘

(Your content goes here)
```

**Franklin processes to:**

```html
<div class="section" 
     data-background-video="./media_xxx.mp4"
     data-video-options="autoplay,loop,muted">
  <!-- content -->
</div>
```

---

## 📁 Method 4: Direct File Reference (Co-located)

### **Upload Video Next to Document**

**SharePoint Structure:**
```
📁 /express/
  ├── 📄 index.docx (your page)
  └── 🎬 hero-video.mp4 (your video)
```

**In index.docx, reference:**
```
./hero-video.mp4
```

**Franklin converts to:**
```
./media_abc123...xyz.mp4
```

**Benefits:**
- ✅ Easy to manage (video next to content)
- ✅ Relative paths work automatically
- ✅ Version control friendly

---

## 🎯 Best Practices for Authors

### **1. Video Optimization Before Upload**

```bash
# Use FFmpeg to optimize:
ffmpeg -i input.mp4 \
  -c:v libx264 -crf 28 -preset slow \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  output.mp4

# Or use online tool:
https://cazzaran.github.io/video-processor/
```

**Target specs:**
- ✅ Duration: < 2 minutes
- ✅ Bitrate: < 300 KB/s (2,400 kbps)
- ✅ Codec: H.264 with faststart
- ✅ Audio: AAC 128 kbps

---

### **2. Naming Conventions**

```
✅ GOOD:
  hero-animation.mp4
  product-demo-v2.mp4
  logo-reveal-dark.mp4

❌ BAD:
  Video1.mp4 (not descriptive)
  Final FINAL (2) copy.mp4 (spaces, special chars)
  yyy.mp4.mp4 (double extension)
  VID_20231015_143022.mp4 (phone default)
```

**Rules:**
- Use lowercase
- Use hyphens (not spaces or underscores)
- Be descriptive
- Include version if needed
- One file extension only

---

### **3. Organization Strategies**

#### **Strategy A: Centralized Media Folder**

```
📁 SharePoint Structure:
  ├── 📁 /media/
  │   ├── 🎬 video-1.mp4
  │   ├── 🎬 video-2.mp4
  │   └── 🎬 video-3.mp4
  ├── 📁 /pages/
  │   ├── 📄 page-1.docx → references ../media/video-1.mp4
  │   └── 📄 page-2.docx → references ../media/video-2.mp4
```

**Pros:**
- ✅ Easy to find all videos
- ✅ Reusable across pages
- ✅ Bulk updates easier

**Cons:**
- ❌ Path management in documents
- ❌ Harder to track which videos are used where

---

#### **Strategy B: Co-located Assets**

```
📁 SharePoint Structure:
  ├── 📁 /create/logo/
  │   ├── 📄 index.docx
  │   └── 🎬 hero-video.mp4
  ├── 📁 /create/poster/
  │   ├── 📄 index.docx
  │   └── 🎬 demo-video.mp4
```

**Pros:**
- ✅ Everything in one place
- ✅ Easy relative paths (./video.mp4)
- ✅ Clear ownership

**Cons:**
- ❌ Duplication if same video needed elsewhere
- ❌ More files in each folder

---

#### **Strategy C: Hybrid Approach**

```
📁 SharePoint Structure:
  ├── 📁 /shared-media/
  │   └── 🎬 global-videos.mp4 (reused across site)
  ├── 📁 /create/logo/
  │   ├── 📄 index.docx
  │   └── 🎬 logo-specific.mp4 (unique to this page)
```

---

## 🔄 Authoring Workflow Example

### **Real-World Scenario: Adding a Hero Video**

#### **Step 1: Prepare Video**
```bash
# Author has: raw-video.mov (50 MB, 1080p, 60fps)

# Optimize with Cazzaran tool or FFmpeg:
ffmpeg -i raw-video.mov \
  -vf scale=1280:720 \
  -r 30 \
  -c:v libx264 -crf 28 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  hero-animation.mp4

# Result: 800 KB, 720p, 30fps ✅
```

#### **Step 2: Upload to SharePoint**
```
1. Navigate to: /express/drafts/my-page/
2. Upload hero-animation.mp4
3. SharePoint assigns URL:
   https://adobecom.sharepoint.com/.../hero-animation.mp4?csf=1&web=1&e=abc
```

#### **Step 3: Author in Word**

**Open page.docx, add table:**
```
┌──────────────────────────────────────────────────┐
│ Hero Marquee (Video)                             │
├──────────────────────────────────────────────────┤
│ https://adobecom.sharepoint.com/.../hero-animation.mp4 │
├──────────────────────────────────────────────────┤
│ # Create stunning designs                        │
│ Fast, easy, and free                             │
│ [Get Started]                                    │
└──────────────────────────────────────────────────┘
```

#### **Step 4: Preview in Sidekick**
```
1. Save Word document
2. Open Franklin Sidekick extension
3. Click "Preview"
4. Franklin processes:
   - Downloads video
   - Generates hash
   - Re-encodes (⚠️ becomes 2 MB)
   - Updates document
```

#### **Step 5: View Preview**
```
Preview URL: https://main--express-milo--adobecom.aem.page/drafts/my-page/

Video URL: https://main--express-milo--adobecom.aem.page/drafts/my-page/media_184ba127...mp4

Your code detects it and applies lazy loading! ✅
```

#### **Step 6: Publish**
```
1. Click "Publish" in Sidekick
2. Live URL: https://main--express-milo--adobecom.aem.live/drafts/my-page/
3. Video is cached on CDN
4. Subsequent loads are instant
```

---

## 🛠️ Developer's Role

### **What Authors Do:**
1. ✅ Upload videos to SharePoint/Drive
2. ✅ Add video URLs in documents
3. ✅ Structure content using tables
4. ✅ Preview and publish

### **What Franklin Does:**
1. ✅ Detects video links
2. ✅ Downloads and processes videos
3. ✅ Generates `media_` hashes
4. ⚠️ Re-encodes (the bug)
5. ✅ Serves via CDN

### **What Your Code Does:**
1. ✅ Detects `<a href="*.mp4">` links
2. ✅ Transforms to `<video>` elements
3. ✅ Applies lazy loading strategy
4. ✅ Handles autoplay deferral
5. ✅ Optimizes performance

---

## 🎯 Code Integration

### **Your Blocks Should:**

```javascript
// In any block that might have videos
export default async function decorate(block) {
  // Find all .mp4 links
  const videoLinks = block.querySelectorAll('a[href$=".mp4"]');
  
  videoLinks.forEach(link => {
    // Use centralized video utility
    const video = createOptimizedVideo({
      src: link.href,
      container: block,
      attributes: {
        playsinline: '',
        muted: '',
        loop: '',
        // Don't add autoplay here - utility handles it
      }
    });
    
    // Replace link with video
    link.parentElement.replaceChild(video, link);
  });
}
```

---

## 📊 Summary Table

| Method | Author Effort | Flexibility | Best For |
|--------|--------------|-------------|----------|
| **Simple Link** | Low | Low | Quick embeds |
| **Block Table** | Medium | High | Structured content |
| **Section Metadata** | High | Very High | Complex layouts |
| **Direct Reference** | Low | Medium | Co-located assets |

---

## 🚨 Common Authoring Mistakes

### **Mistake 1: Wrong File Path**

```
❌ Author types:
C:\Users\John\Videos\hero.mp4

✅ Should be:
https://sharepoint.com/.../hero.mp4
OR
./hero.mp4 (if co-located)
```

### **Mistake 2: Using YouTube Links**

```
❌ Author types:
https://youtube.com/watch?v=abc123

Result: Franklin doesn't process it as video!

✅ Solution: Upload MP4 directly OR use embed block
```

### **Mistake 3: Forgetting File Extension**

```
❌ Author types:
https://sharepoint.com/.../hero

✅ Should be:
https://sharepoint.com/.../hero.mp4
```

### **Mistake 4: Special Characters in Filename**

```
❌ Filename: My Video (Final) #1.mp4
Result: URL encoding issues

✅ Filename: my-video-final-v1.mp4
```

---

## 📚 Related Documentation

- [AEM Limits](https://www.aem.live/docs/limits#file-size-limits) - Video constraints
- [MP4 Doctor](https://www.aem.live/tools/mp4-doctor/) - Optimization tool
- [Cazzaran Processor](https://cazzaran.github.io/video-processor/) - Video compression

---

## 🎬 Quick Start Checklist

For authors adding a video:

- [ ] Optimize video < 2 min, < 300 KB/s
- [ ] Upload to SharePoint/Drive
- [ ] Copy full URL with extension (.mp4)
- [ ] Paste URL in document (table or paragraph)
- [ ] Preview in Sidekick
- [ ] Verify video plays correctly
- [ ] Publish when ready

---

**Created:** October 11, 2025  
**Author:** AI Assistant  
**Related:** 
- `FRANKLIN_MEDIA_ASSET_WORKFLOW.md` - Technical workflow
- `FRANKLIN_VIDEO_PROCESSING_RESEARCH.md` - Processing details
- `express/code/scripts/utils/video.js` - Video utility code

