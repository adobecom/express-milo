# Franklin Media Asset Workflow - Complete Guide

## 📍 Where Video Assets Are Placed

### Content Sources (Author's Perspective)

Franklin supports multiple content sources for video assets:

#### **1. SharePoint / OneDrive (Most Common)**
```
📁 Your SharePoint Site
  └── 📁 express-milo
      └── 📁 express
          └── 📁 website
              └── 📁 drafts
                  └── 📁 yeiber
                      └── 🎬 yyy.mp4.mp4 (433 KB)
```

**Path in Franklin:**
- SharePoint: `/drafts/yeiber/yyy.mp4.mp4`
- Franklin URL: `https://main--express-milo--adobecom.aem.page/drafts/yeiber/yyy.mp4.mp4`

#### **2. Google Drive**
```
📁 Google Drive
  └── 📁 express-milo-content
      └── 📁 media
          └── 🎬 video.mp4
```

#### **3. Directly in GitHub (Less Common)**
```
📁 express-milo-mac (GitHub repo)
  └── 📁 express
      └── 📁 code
          └── 📁 media
              └── 🎬 background-video.mp4
```

---

## 🔄 How Files Are Converted to `media_` Format

### The Complete Flow

```
┌─────────────────────────────────────────────────────────┐
│  STEP 1: Author Uploads to SharePoint                   │
│  File: yyy.mp4.mp4 (433 KB)                             │
│  Path: /drafts/yeiber/yyy.mp4.mp4                       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 2: Franklin Monitors SharePoint                   │
│  - Webhook detects new file                             │
│  - Franklin Pipeline triggers sync                       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 3: Content Ingestion (helix-pipeline)             │
│  - Download file from SharePoint                        │
│  - Extract metadata (duration, dimensions, bitrate)     │
│  - Generate content-based hash                          │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 4: Hash Generation                                │
│  Hash algorithm: SHA-1 or SHA-256                       │
│  Input: File content + metadata                         │
│  Output: 184ba127fa10e6b95b4bf300c8397d00186227aeb     │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 5: Media Transformation (helix-media-bus)         │
│  - Validate against limits (2 min, 300 KB/s)            │
│  - Re-encode video (⚠️ BUG: Always re-encodes)         │
│  - Apply faststart for web streaming                    │
│  - Compress audio to 128 kbps AAC                       │
│  Output: 2,084 KB (re-encoded version)                  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 6: Store to Azure Blob Storage                    │
│  Blob Name: media_184ba127...aeb.mp4                    │
│  Storage: hlx.blob.core.windows.net (legacy)            │
│         OR aem.blob.core.windows.net (current)          │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 7: Update Content Index                           │
│  - Map original path to media_ hash                     │
│  - Update .docx/.gdoc reference                         │
│  - Generate preview HTML                                │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 8: CDN Distribution                               │
│  Preview: https://main--project--org.aem.page/path/media_xxx.mp4  │
│  Live:    https://main--project--org.aem.live/path/media_xxx.mp4  │
│  Size:    2,084 KB (bloated)                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Hash Generation Details

### Why Hashes?

1. **Unique Identifiers:** No naming conflicts across sites
2. **Content-Based:** Same content = same hash (caching)
3. **Immutable URLs:** Hash changes if content changes
4. **CDN-Friendly:** Perfect for cache invalidation

### Hash Format

```
media_[40-character-hash].mp4
media_184ba127fa10e6b95b4bf300c8397d00186227aeb.mp4
       └───────────────────────────────────┘
                  SHA-1 Hash (160 bits)
```

### What's Hashed?

```javascript
// Pseudo-code for hash generation
function generateMediaHash(file) {
  const content = readFileBytes(file);
  const metadata = {
    filename: file.name,
    size: file.size,
    lastModified: file.lastModified
  };
  
  const hashInput = content + JSON.stringify(metadata);
  const hash = sha1(hashInput); // Or SHA-256
  
  return hash.substring(0, 40); // First 40 characters
}
```

---

## 📄 Document References

### How Videos Are Linked in Documents

#### **In Word/Google Docs (Authoring):**

```
Author writes:
"Check out this video: https://sharepoint.com/.../yyy.mp4.mp4"

OR inserts video directly in document
```

#### **After Franklin Sync:**

Franklin transforms the document HTML:

```html
<!-- Original reference -->
<a href="https://sharepoint.com/.../yyy.mp4.mp4">Video</a>

<!-- Transformed to -->
<a href="./media_184ba127fa10e6b95b4bf300c8397d00186227aeb.mp4">Video</a>
```

#### **Code Detects and Converts:**

From our codebase (`media.js`):

```javascript
// Check if it's a legacy format
const isLegacy = videoUrl.hostname.includes('hlx.blob.core') || 
                 videoUrl.hostname.includes('aem.blob.core') || 
                 videoUrl.pathname.includes('media_');

if (isLegacy) {
  // Extract hash from various formats:
  
  // Format 1: hlx.blob.core.windows.net/project/[hash]/video.mp4
  if (videoUrl.hostname.includes('hlx.blob.core')) {
    helixId = videoUrl.pathname.split('/')[2];
  }
  
  // Format 2: aem.blob.core.windows.net/project/[hash]/video.mp4
  else if (videoUrl.hostname.includes('aem.blob.core')) {
    helixId = videoUrl.pathname.split('/')[2];
  }
  
  // Format 3: ./media_[hash].mp4 (already converted)
  else if (videoUrl.pathname.includes('media_')) {
    helixId = videoUrl.pathname.split('media_')[1].split('.')[0];
  }
  
  // Normalize to local path
  const videoHref = `./media_${helixId}.mp4`;
}
```

---

## 🗂️ File Organization Patterns

### Pattern 1: Co-located with Content

```
📁 /express/
  ├── 📄 index.docx (references video)
  └── 🎬 hero-animation.mp4
  
After sync:
📁 /express/
  ├── 📄 index.html
  └── 🎬 media_abc123...xyz.mp4
```

### Pattern 2: Centralized Media Folder

```
📁 /express/
  ├── 📁 media/
  │   ├── 🎬 video1.mp4 → media_aaa111...mp4
  │   ├── 🎬 video2.mp4 → media_bbb222...mp4
  │   └── 🎬 video3.mp4 → media_ccc333...mp4
  ├── 📁 pages/
  │   ├── 📄 page1.html (references ../media/media_aaa111...mp4)
  │   └── 📄 page2.html (references ../media/media_bbb222...mp4)
```

### Pattern 3: Per-Page Assets

```
📁 /express/
  ├── 📁 create/
  │   ├── 📁 logo/
  │   │   ├── 📄 index.html
  │   │   └── 🎬 media_xxx...mp4 (specific to logo page)
  │   ├── 📁 poster/
  │   │   ├── 📄 index.html
  │   │   └── 🎬 media_yyy...mp4 (specific to poster page)
```

---

## 🔄 URL Resolution

### Different URL Formats Franklin Handles

```javascript
// Format 1: SharePoint Direct Link (Author's view)
https://adobecom.sharepoint.com/.../yyy.mp4.mp4

// Format 2: Google Drive Direct Link
https://drive.google.com/file/d/abc123/view

// Format 3: Legacy Blob Storage
https://hlx.blob.core.windows.net/express-milo/184ba127.../video.mp4

// Format 4: Current Blob Storage
https://aem.blob.core.windows.net/express-milo/184ba127.../video.mp4

// Format 5: Local Path (in rendered HTML)
./media_184ba127fa10e6b95b4bf300c8397d00186227aeb.mp4

// Format 6: Absolute CDN Path
https://main--express-milo--adobecom.aem.live/express/media_184ba127...mp4
```

### Resolution Logic

```javascript
// Pseudo-code for URL resolution
function resolveMediaUrl(url) {
  // Step 1: Check if external (SharePoint, Google Drive)
  if (isExternal(url)) {
    // Lookup in content index
    const hash = contentIndex.lookup(url);
    return `./media_${hash}.mp4`;
  }
  
  // Step 2: Check if blob storage
  if (url.includes('blob.core')) {
    const hash = extractHashFromBlob(url);
    return `./media_${hash}.mp4`;
  }
  
  // Step 3: Already media_ format
  if (url.includes('media_')) {
    return url; // Use as-is
  }
  
  // Step 4: Relative path
  return resolveRelativePath(url);
}
```

---

## 📊 Media Index / Mapping

Franklin maintains an internal mapping:

```json
{
  "media-index": {
    "/drafts/yeiber/yyy.mp4.mp4": {
      "hash": "184ba127fa10e6b95b4bf300c8397d00186227aeb",
      "type": "video/mp4",
      "size": 2084215,
      "originalSize": 443392,
      "duration": 10,
      "dimensions": "800x534",
      "bitrate": 2000000,
      "processed": "2025-10-10T20:10:53Z",
      "blobUrl": "https://aem.blob.core.windows.net/.../media_184ba127...mp4",
      "cdnUrl": "https://main--express-milo--adobecom.aem.live/express/media_184ba127...mp4"
    }
  }
}
```

---

## 🎯 Best Practices

### For Authors

1. **Naming Convention:**
   ```
   ✅ hero-animation.mp4
   ✅ product-demo.mp4
   ✅ logo-reveal.mp4
   
   ❌ yyy.mp4.mp4 (confusing double extension)
   ❌ video 1.mp4 (spaces cause issues)
   ❌ FINAL_FINAL_v3.mp4 (unclear version control)
   ```

2. **Organization:**
   - Keep videos near related content
   - Use consistent folder structure
   - Document video purpose in filename

3. **Optimization:**
   - Use [Cazzaran Video Processor](https://cazzaran.github.io/video-processor/) first
   - Target < 300 KB/s bitrate
   - Keep under 2 minutes duration
   - Enable `faststart` flag

### For Developers

1. **Always Use Relative Paths:**
   ```javascript
   // ✅ Good - works everywhere
   const videoSrc = `./media_${hash}.mp4`;
   
   // ❌ Bad - breaks in preview/staging
   const videoSrc = `https://main--project--org.aem.live/media_${hash}.mp4`;
   ```

2. **Handle Multiple Formats:**
   ```javascript
   // Support both old and new blob URLs
   const isLegacy = url.includes('hlx.blob.core') || 
                    url.includes('aem.blob.core') || 
                    url.includes('media_');
   ```

3. **Use Our Video Utility:**
   ```javascript
   import { createOptimizedVideo } from '../../scripts/utils/video.js';
   
   const video = createOptimizedVideo({
     src: `./media_${hash}.mp4`,
     container: element,
     attributes: { playsinline: '', muted: '', loop: '' }
   });
   ```

---

## 🔍 Debugging Media Issues

### Check Media Mapping

```bash
# Get content index
curl -s "https://main--project--org.aem.live/query-index.json" | \
  jq '.data[] | select(.path | contains("media_"))'
```

### Verify Hash

```bash
# Original file
sha1sum yyy.mp4.mp4

# Compare with Franklin hash
# If different, Franklin re-processed the file
```

### Check CDN

```bash
# Check if file exists
curl -I "https://main--project--org.aem.live/path/media_xxx.mp4"

# Check size
curl -sI "https://main--project--org.aem.live/path/media_xxx.mp4" | \
  grep content-length
```

### Inspect Blob Storage

```bash
# Legacy format
https://hlx.blob.core.windows.net/project/hash/video.mp4

# Current format
https://aem.blob.core.windows.net/project/hash/video.mp4
```

---

## 🚨 Common Issues

### Issue 1: Video Not Found (404)

**Cause:** File not synced yet or wrong path

**Solution:**
1. Trigger preview in Sidekick
2. Wait for sync to complete
3. Verify path matches document reference

### Issue 2: Wrong Video Playing

**Cause:** Hash collision or cache issue

**Solution:**
1. Clear browser cache
2. Hard refresh (Cmd+Shift+R)
3. Check CDN cache headers

### Issue 3: Video Bloated

**Cause:** Franklin re-encoding (known bug)

**Solution:**
1. Use external video CDN
2. Accept bloat + use lazy loading
3. File bug with Adobe

---

## 📚 Related Documentation

- [AEM Limits](https://www.aem.live/docs/limits#file-size-limits)
- [MP4 Doctor Tool](https://www.aem.live/tools/mp4-doctor/)
- [Franklin Library GitHub](https://github.com/adobe/franklin-library)
- Our Research: `FRANKLIN_VIDEO_PROCESSING_RESEARCH.md`

---

## 📋 Summary

### The Complete Workflow:

1. **Author uploads** to SharePoint/Google Drive
2. **Franklin monitors** and detects changes
3. **Content ingestion** downloads and analyzes
4. **Hash generation** creates unique identifier
5. **Media transformation** re-encodes video (⚠️ bug!)
6. **Blob storage** saves as `media_[hash].mp4`
7. **CDN distribution** serves via `*.aem.live`
8. **Code references** use relative `./media_*` paths

### Key Takeaways:

- ✅ **Hashes are content-based** (SHA-1/SHA-256)
- ✅ **Format is predictable** (`media_[40chars].ext`)
- ⚠️ **Franklin always re-encodes** (bug!)
- ✅ **Use relative paths** for portability
- ✅ **Our lazy loading fixes** work regardless of size

---

**Created:** October 11, 2025  
**Author:** AI Assistant  
**Related:** 
- `FRANKLIN_VIDEO_PROCESSING_RESEARCH.md`
- `FRANKLIN_VIDEO_SOURCE_CODE_INVESTIGATION.md`
- `PERFORMANCE_FIXES_SUMMARY.md`

