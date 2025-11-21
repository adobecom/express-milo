# Mobile Fork Button Blocks - Logic Documentation

## Overview

The mobile fork button system consists of three variants that present Android (and optionally Safari) users with a choice between different CTAs, typically for app downloads or web experiences. All three variants share ~83% of their code through a common utility library.

---

## Block Variants

### 1. `mobile-fork-button` (Base)
**Purpose:** Standard fork button for Android users  
**Eligibility:** Android devices only (configurable)  
**Use Case:** Direct users to Google Play Store or web app

### 2. `mobile-fork-button-dismissable` (Dismissable)
**Purpose:** Fork button with close functionality  
**Eligibility:** Android devices only (configurable)  
**Use Case:** Same as base, but allows users to dismiss and continue browsing with a less intrusive sticky CTA

### 3. `mobile-fork-button-frictionless` (Frictionless)
**Purpose:** Fork button for frictionless editing/upload flows  
**Eligibility:** Android devices AND Safari (when enabled)  
**Use Case:** Quick actions that work without app installation, like frictionless image editing or file uploads

---

## Common Functionality (Shared Logic)

All three variants share these components via `mobile-fork-button-utils.js`:

### 1. Text Measurement
- `getTextWidth()` - Calculates pixel width of button text
- `LONG_TEXT_CUTOFF` (70px) - Threshold for responsive styling

### 2. Metadata Collection
- `createMetadataMap()` - Creates a lookup map of all page metadata
- Used to efficiently read configuration from document `<meta>` tags

### 3. Button Building
- `buildAction()` - Creates individual CTA rows (icon + text + button)
- `createMultiFunctionButton()` - Assembles the complete fork button UI
- Builds header, two action buttons (accent & outline), integrates with floating button widget

### 4. Tool Data Creation
- `createToolData()` - Creates button data from metadata
- Supports standard metadata OR frictionless-suffixed fallback metadata
- Handles special `#mobile-fqa-upload` click handler for file uploads

### 5. Data Collection
- `collectFloatingButtonData()` - Gathers all configuration from metadata
- Supports variant-specific metadata extensions
- Checks for long text and sets appropriate flags

### 6. Eligibility Check (Base & Dismissable only)
- `androidCheck()` - Determines if fork button should display
- Checks device OS and optional metadata flag

---

## Key Differences

### Eligibility Logic

| Variant | Check Method | Devices | Configuration |
|---------|--------------|---------|---------------|
| **Base** | `androidCheck()` | Android only | `fork-eligibility-check: on` to enforce |
| **Dismissable** | `androidCheck()` | Android only | `fork-eligibility-check: on` to enforce |
| **Frictionless** | Custom check | Android OR Safari | `frictionless-safari: on` to include Safari |

**Base/Dismissable:**
```javascript
if (getMetadata('fork-eligibility-check') !== 'on') return true; // Show to all
return getMobileOperatingSystem() === 'Android';
```

**Frictionless:**
```javascript
const eligible = getMetadata('frictionless-safari') === 'on' 
  || getMobileOperatingSystem() === 'Android';
```

### Metadata Strategy

#### Base & Dismissable - Standard Metadata
```
fork-cta-1-icon: icon-name
fork-cta-1-icon-text: Label
fork-cta-1-link: https://...
fork-cta-1-text: Button Text
(same pattern for fork-cta-2-*)
```

#### Frictionless - Fallback Metadata
Uses `-frictionless` suffixed metadata when eligible, falls back to standard:
```
fork-cta-1-icon-frictionless: different-icon (for eligible users)
fork-cta-1-icon: icon-name (fallback)
fork-cta-1-link-frictionless: #mobile-fqa-upload (for eligible users)
fork-cta-1-link: https://... (fallback)
```

### Dismissable-Specific Features

The dismissable variant includes 61 lines of unique functionality:

#### 1. Close Button (`mWebBuildElements`)
- Adds an X button to the fork overlay
- Uses inline SVG for the close icon
- Prepended to first child element

#### 2. Scroll Management (`mWebOverlayScroll`)
- Disables body scroll when overlay is open
- Re-enables scroll when closed
- Prevents page interaction behind overlay

#### 3. Sticky CTA Fallback (`mWebStickyCTA`)
- When user closes fork button, replaces it with simple sticky CTA
- Uses alternate metadata: `cta-1-link` and `cta-1-text`
- Maintains presence without being intrusive

#### 4. Close Event Handling (`mWebCloseEvents`)
- Attaches click handlers to:
  - Close button (`.mweb-close`)
  - Any link with `href="#"` (cancel links)
- Triggers sticky CTA replacement and scroll restoration

#### 5. Orchestration (`mWebVariant`)
- Only runs on Android devices
- Calls build, events, and scroll functions in sequence

**Usage in decorate():**
```javascript
mWebVariant(); // Called at end of decorate()
```

### CSS Class Names

Each variant uses a unique class for styling:

| Variant | Class Name |
|---------|-----------|
| **Base** | `mobile-fork-button` |
| **Dismissable** | `mobile-fork-button` (same as base) |
| **Frictionless** | `mobile-fork-button-frictionless` |

---

## Configuration Metadata Reference

### Common Metadata (All Variants)

| Meta Name | Purpose | Example |
|-----------|---------|---------|
| `fork-eligibility-check` | Enforce Android-only | `on` or `off` |
| `fork-button-header` | Header text in fork UI | "Choose your experience" |
| `fork-cta-1-icon` | Icon for first CTA | `google-play` |
| `fork-cta-1-icon-text` | Label for icon | "Available on" |
| `fork-cta-1-link` | URL for first CTA | `https://play.google.com/...` |
| `fork-cta-1-text` | Button text | "Get the app" |
| `fork-cta-2-*` | (same pattern) | Second CTA configuration |
| `show-floating-cta-app-store-badge` | Show app badge | `on` or `off` |
| `ctas-above-divider` | Number of CTAs above divider | `2` |
| `floating-cta-drawer-delay` | Delay before showing (ms) | `1000` |
| `desktop-floating-cta-link` | Desktop CTA link | URL |
| `desktop-floating-cta-text` | Desktop CTA text | Text |
| `mobile-floating-cta-link` | Mobile CTA link (non-fork) | URL |
| `mobile-floating-cta-text` | Mobile CTA text (non-fork) | Text |
| `main-cta-link` | Main CTA link | URL |
| `main-cta-text` | Main CTA text | Text |
| `floating-cta-bubble-sheet` | Bubble sheet config | Config value |
| `floating-cta-live` | Live configuration | `true` or `false` |

### Dismissable-Specific Metadata

| Meta Name | Purpose | Example |
|-----------|---------|---------|
| `cta-1-link` | Sticky CTA link after dismissal | URL |
| `cta-1-text` | Sticky CTA text after dismissal | "Try on web" |

### Frictionless-Specific Metadata

| Meta Name | Purpose | Example |
|-----------|---------|---------|
| `frictionless-safari` | Enable for Safari users | `on` or `off` |
| `fork-cta-1-icon-frictionless` | Alt icon for eligible users | Different icon |
| `fork-cta-1-icon-text-frictionless` | Alt icon text | "Upload" |
| `fork-cta-1-link-frictionless` | Alt link (e.g., upload trigger) | `#mobile-fqa-upload` |
| `fork-cta-1-text-frictionless` | Alt button text | "Upload & Edit" |
| `fork-cta-2-*-frictionless` | (same pattern) | Second CTA alternates |

**Special Link:** `#mobile-fqa-upload`
- When used in frictionless variant, triggers a file upload dialog
- Clicks the `#mobile-fqa-upload` element on the page

---

## Technical Architecture

### Shared Utility Module
**Location:** `express/code/scripts/utils/mobile-fork-button-utils.js`

**Exports:**
- `LONG_TEXT_CUTOFF` - Constant (70)
- `getTextWidth(text, font)` - Pure utility
- `createMetadataMap()` - DOM reader
- `buildAction(createTag, entry, buttonType)` - UI builder
- `androidCheck(getMetadata, getMobileOperatingSystem)` - Eligibility
- `createToolData(createTag, getIcon, metadataMap, index, useFrictionless)` - Data parser
- `collectFloatingButtonData(createTag, getIcon, useFrictionless, extraProps)` - Data collector
- `createMultiFunctionButton(createTag, createFloatingButton, block, data, audience, className)` - Main builder

### Integration with Floating Button Widget
All variants integrate with `express/code/scripts/widgets/floating-cta.js`:

```javascript
const buttonWrapper = await createFloatingButton(block, audience, data);
```

This creates the base floating button structure, which the fork button then enhances with the gating UI (header + two action buttons).

### Event System
All variants dispatch a custom event when links are populated:

```javascript
const linksPopulated = new CustomEvent('linkspopulated', { detail: blockLinks });
document.dispatchEvent(linksPopulated);
```

This allows other scripts (like analytics) to track or enhance the links.

---

## Flow Diagrams

### Base Variant Flow

```
User loads page
    ↓
decorate() called
    ↓
Import createTag/getMetadata
    ↓
Check androidCheck()
    ├─ Not Android → Load normal floating-button
    └─ Is Android → Continue
        ↓
    Add temp wrapper
        ↓
    Check meta-powered class
        ↓
    Get audience (mobile/desktop)
        ↓
    Collect floating button data
        ↓
    Create multi-function button
        ├─ Create floating button wrapper
        ├─ Add class 'mobile-fork-button'
        └─ Build mobile gating UI
            ├─ Remove first child
            ├─ Add header
            ├─ Add CTA 1 (accent button)
            └─ Add CTA 2 (outline button)
        ↓
    Dispatch linkspopulated event
        ↓
    Add long-text class if needed
```

### Dismissable Variant Flow

```
[Same as Base until after linkspopulated event]
    ↓
Call mWebVariant()
    ├─ Check if Android (exit if not)
    ├─ mWebBuildElements()
    │   ├─ Add 'mweb-mobile-fork' class
    │   └─ Prepend close button (X)
    ├─ mWebCloseEvents()
    │   └─ Attach click handlers to close button & # links
    │       └─ On click:
    │           ├─ mWebStickyCTA()
    │           │   ├─ Create new simple floating button
    │           │   ├─ Replace fork button with sticky CTA
    │           │   └─ Use cta-1-link/text metadata
    │           └─ mWebOverlayScroll()
    │               └─ Restore body scroll
    └─ mWebOverlayScroll()
        └─ Initially disable body scroll
```

### Frictionless Variant Flow

```
User loads page
    ↓
decorate() called
    ↓
Import getMetadata
    ↓
Check eligibility
    eligible = frictionless-safari is 'on' OR Android
    ↓
Add temp wrapper
    ↓
Check meta-powered class
    ↓
Get audience (mobile/desktop)
    ↓
Collect floating button data (pass eligible flag)
    └─ createToolData uses -frictionless metadata when eligible
        └─ If link is #mobile-fqa-upload, attach click handler
            └─ Click triggers document.getElementById('mobile-fqa-upload').click()
    ↓
Create multi-function button
    ├─ Create floating button wrapper
    ├─ Add class 'mobile-fork-button-frictionless'
    └─ Build mobile gating UI
    ↓
Dispatch linkspopulated event
    ↓
Add long-text class if needed
```

---

## Decision Matrix: Which Variant to Use?

| Scenario | Use Variant | Reason |
|----------|-------------|--------|
| Android users, standard app download choice | **Base** | Simple, no extra features needed |
| Android users, want dismissal option | **Dismissable** | Provides close button + sticky fallback |
| Android users, need sticky CTA after close | **Dismissable** | Has sticky CTA configuration |
| Quick actions without app install | **Frictionless** | Works on Android + Safari |
| Image/file upload flows | **Frictionless** | Supports `#mobile-fqa-upload` trigger |
| iOS Safari users need access | **Frictionless** | Can enable via `frictionless-safari: on` |
| Want different CTAs for app vs web users | **Frictionless** | Supports `-frictionless` suffixed metadata |

---

## Code Metrics

### Before Extraction
- **Total:** 473 lines across 3 files
- **mobile-fork-button.js:** 139 lines
- **mobile-fork-button-dismissable.js:** 200 lines
- **mobile-fork-button-frictionless.js:** 134 lines
- **Duplication:** ~29% (138 lines duplicated)

### After Extraction
- **Total:** 392 lines (206 util + 186 variants)
- **mobile-fork-button.js:** 36 lines (-74%)
- **mobile-fork-button-dismissable.js:** 114 lines (-43%)
- **mobile-fork-button-frictionless.js:** 37 lines (-72%)
- **mobile-fork-button-utils.js:** 205 lines (new)
- **Reduction:** 81 lines saved (17%)

### Shared vs Unique Code

| Variant | Shared Code | Unique Code | Total |
|---------|-------------|-------------|-------|
| Base | 206 lines (util) | 36 lines | 242 effective |
| Dismissable | 206 lines (util) | 114 lines (78 unique) | 320 effective |
| Frictionless | 206 lines (util) | 37 lines | 243 effective |

**Dismissable's unique code:**
- 61 lines of mWeb functions (dismissal features)
- 53 lines of variant-specific decorate logic

---

## Testing Considerations

### Test Coverage Needed

1. **Eligibility Logic**
   - Base/Dismissable: Android-only enforcement
   - Frictionless: Android + Safari when enabled
   - Metadata flag override behavior

2. **Metadata Reading**
   - Standard metadata parsing
   - Frictionless fallback metadata
   - Dismissable sticky CTA metadata
   - Missing metadata graceful degradation

3. **UI Building**
   - Button rendering with icons
   - Long text detection and styling
   - Empty/null icon handling
   - Header text display

4. **Dismissable Features**
   - Close button click
   - Sticky CTA replacement
   - Scroll lock/unlock
   - Cancel link behavior

5. **Frictionless Features**
   - Safari eligibility
   - Upload trigger click handling
   - Fallback metadata resolution

6. **Event Dispatching**
   - linkspopulated event fires
   - Event detail contains correct links

---

## Common Issues & Debugging

### Issue: Fork button doesn't show on Android
**Check:**
- Is `fork-eligibility-check` metadata set to `on`?
- Is `meta-powered` class on the block?
- Are fork CTA metadata values populated?

### Issue: Frictionless not working on Safari
**Check:**
- Is `frictionless-safari` metadata set to `on`?
- Are `-frictionless` suffixed metadata values provided?

### Issue: Dismissable close button doesn't work
**Check:**
- Are `cta-1-link` and `cta-1-text` metadata provided?
- Is the device actually Android? (mWeb features are Android-only)

### Issue: Upload trigger not working in frictionless
**Check:**
- Is link set to `#mobile-fqa-upload` exactly?
- Does element with id `mobile-fqa-upload` exist on page?
- Is user eligible (Android or Safari with flag)?

### Issue: Text overlapping or truncated
**Check:**
- Text length exceeding 70px threshold?
- `long-text` class being applied?
- CSS for `.long-text` variant loaded?

---

## Future Considerations

### Potential Enhancements
1. **Unified eligibility system** - Extract eligibility logic to shared util
2. **Configurable text cutoff** - Make `LONG_TEXT_CUTOFF` metadata-driven
3. **More dismissable variants** - Other blocks might benefit from dismissal pattern
4. **Analytics integration** - Standard tracking for fork button interactions
5. **A/B testing support** - Framework for testing different fork strategies

### Maintenance Notes
- When adding new fork button variant, consider using utility functions
- Update this documentation when changing eligibility logic
- Test across Android and iOS Safari for frictionless changes
- Keep metadata naming consistent with existing patterns

---

## Related Files

- **Utility:** `express/code/scripts/utils/mobile-fork-button-utils.js`
- **Base Block:** `express/code/blocks/mobile-fork-button/mobile-fork-button.js`
- **Dismissable Block:** `express/code/blocks/mobile-fork-button-dismissable/mobile-fork-button-dismissable.js`
- **Frictionless Block:** `express/code/blocks/mobile-fork-button-frictionless/mobile-fork-button-frictionless.js`
- **Floating Button Widget:** `express/code/scripts/widgets/floating-cta.js`
- **Planning Doc:** `express/code/blocks/mobile-fork-button/planning.md`
- **Analysis Doc:** `express/code/blocks/mobile-fork-button/code-duplication-analysis.md`

---

*Last Updated: November 20, 2024*

