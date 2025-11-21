# Mobile Fork Button Variants - Analysis and Planning

## Overview
This document analyzes three variants of the mobile fork button implementation and identifies opportunities for code sharing and refactoring.

---

## File Purpose Summary

### 1. `mobile-fork-button.js` (Base Variant)
**Purpose:** Creates a mobile fork button specifically for Android devices.

**Key Behavior:**
- Checks if the device is Android using `androidCheck()`
- If `fork-eligibility-check` metadata is set to "on", only shows for Android devices
- If not Android, falls back to the standard `floating-button` block
- Presents two CTAs to the user (typically app download options)
- Uses metadata like `fork-cta-1-*` and `fork-cta-2-*` to configure the buttons

**Use Case:** Standard mobile fork button for directing Android users to appropriate app stores or actions.

---

### 2. `mobile-fork-button-dismissable.js` (Dismissable Variant)
**Purpose:** Extends the base mobile fork button with dismissable/closeable functionality.

**Key Behavior:**
- All functionality from `mobile-fork-button.js`
- **Additional:** Adds a close button (X) that users can tap to dismiss the fork overlay
- **Additional:** When dismissed, replaces the fork button with a simpler sticky CTA
- **Additional:** Controls body scroll (prevents scrolling when overlay is open)
- Uses additional metadata: `cta-1-link` and `cta-1-text` for the sticky fallback CTA
- Implements `mWeb` variant functions for the dismissable behavior

**Use Case:** For pages where users might want to dismiss the fork button and continue browsing, with a less intrusive sticky CTA as fallback.

---

### 3. `mobile-fork-button-frictionless.js` (Frictionless Variant)
**Purpose:** Creates a fork button for frictionless flows that work on both Android AND iOS Safari.

**Key Behavior:**
- Checks for `frictionless-safari` metadata OR Android device (broader eligibility)
- Uses frictionless-specific metadata when user is eligible (`fork-cta-1-*-frictionless`)
- Falls back to standard metadata if not eligible
- Special handling for `#mobile-fqa-upload` links (triggers file upload)
- Does **not** have dismissable functionality
- No Android-only restriction - can show for Safari users too

**Use Case:** For frictionless editing/upload flows where Safari users can participate without app installation.

---

## Common Functions Analysis

### Identical Functions (Can be extracted to shared utility)

#### 1. `getTextWidth(text, font)`
- **Purpose:** Calculates pixel width of text for a given font
- **Usage:** Determines if button text is too long (>70px)
- **Location in files:** Lines 8-14 in all three files
- **Identical:** ✅ Exactly the same across all variants

#### 2. `createMetadataMap()`
- **Purpose:** Creates a key-value map of all metadata tags
- **Usage:** Faster metadata lookups without repeated DOM queries
- **Location in files:** Lines 53-58 (button), 53-58 (dismissable), 47-52 (frictionless)
- **Identical:** ✅ Exactly the same across all variants

#### 3. `buildMobileGating(block, data)`
- **Purpose:** Builds the fork button UI structure (header + 2 action buttons)
- **Usage:** Constructs the DOM for the gating overlay
- **Location in files:** Lines 28-36 in all three files
- **Identical:** ✅ Exactly the same across all variants

---

### Nearly Identical Functions (Minor differences)

#### 4. `buildAction(entry, buttonType)`
- **Purpose:** Creates a single action row (icon + text + button)
- **Location in files:** Lines 16-26 in all three files
- **Differences:**
  - `mobile-fork-button.js` & `mobile-fork-button-dismissable.js`: Uses optional chaining (`entry?.icon`, `entry?.iconText`)
  - `mobile-fork-button-frictionless.js`: No optional chaining (`entry.icon`, `entry.iconText`)
- **Recommendation:** Standardize on optional chaining version for safety

#### 5. `createMultiFunctionButton(block, data, audience)`
- **Purpose:** Creates the floating button wrapper and builds the gating UI
- **Location in files:** Lines 38-43 in all three files
- **Differences:**
  - Only difference is the class name added:
    - Base: `'mobile-fork-button'`
    - Dismissable: `'mobile-fork-button'`
    - Frictionless: `'mobile-fork-button-frictionless'`
- **Recommendation:** Extract with class name as parameter

---

### Variant-Specific Functions (Keep separate)

#### 6. `createToolData(metadataMap, index)`
- **Location:** All three files but with different implementations
- **Differences:**
  - Base & Dismissable: Simple metadata lookup with `fork-cta-{index}-*`
  - Frictionless: Accepts `eligible` parameter, uses `-frictionless` suffixed metadata when eligible
  - Frictionless: Special click handler for `#mobile-fqa-upload` links
- **Recommendation:** Keep separate, but could share the icon creation logic

#### 7. `collectFloatingButtonData()`
- **Location:** All three files but with variations
- **Differences:**
  - Base: Standard metadata collection
  - Dismissable: Adds `forkStickyMobileHref` and `forkStickyMobileText` to mainCta
  - Frictionless: Accepts `eligible` parameter, passes it to `createToolData`
- **Recommendation:** Could extract common structure with extension points

#### 8. `androidCheck()` (Base & Dismissable only)
- **Purpose:** Determines if fork button should show (Android + metadata check)
- **Location:** Lines 48-51 in base and dismissable
- **Note:** Not present in frictionless (uses different eligibility logic)
- **Recommendation:** Could extract as `checkEligibility()` with variant-specific logic

---

### Dismissable-Only Functions (Keep in dismissable)

These are unique to the dismissable variant and should remain there:
- `mWebStickyCTA()` - Replaces fork button with simple sticky CTA
- `mWebOverlayScroll()` - Manages body scroll behavior
- `mWebBuildElements()` - Adds close button SVG
- `mWebCloseEvents()` - Attaches click handlers for close functionality
- `mWebVariant()` - Orchestrates the dismissable behavior

---

## Recommended Refactoring Plan

### Precedent in This Repo

Based on analysis of the codebase, **shared utilities for blocks belong in `express/code/scripts/utils/`**.

**Examples of this pattern:**
- `ratings-utils.js` - Shared by `quotes` and `ratings` blocks
- `load-carousel.js` - Shared carousel functionality
- `location-utils.js` - Location/phone number utilities
- `frictionless-utils.js` - Frictionless quick action utilities
- `decorate.js` - Shared decoration utilities

**Import pattern:** Blocks import with relative path:
```javascript
import { functionName } from '../../scripts/utils/util-name.js';
```

**File location for our shared utilities:**
```
express/code/scripts/utils/mobile-fork-button-utils.js
```

---

### Phase 1: Extract Pure Utilities
Create a new shared utility file: `express/code/scripts/utils/mobile-fork-button-utils.js`

**Extract these functions:**
1. `getTextWidth(text, font)` - Pure function, no dependencies
2. `createMetadataMap()` - Pure function, simple DOM query
3. `buildMobileGating(block, data)` - Uses imported `createTag`
4. `buildAction(entry, buttonType)` - Uses imported `createTag` (use optional chaining version)

### Phase 2: Extract Configurable Functions
**Extract with parameters:**
5. `createMultiFunctionButton(block, data, audience, className)` - Add className parameter

### Phase 3: Extract Template Functions
Create template functions that variants can customize:
- `createIconElement(iconMetadata)` - Shared icon creation logic
- `createAnchorElement(textMetadata, hrefMetadata)` - Basic anchor creation
- `createToolDataBase(metadataMap, index)` - Base tool data structure

### Phase 4: Variant-Specific Adapters
Each variant keeps its own:
- Eligibility check logic
- `collectFloatingButtonData()` with variant-specific metadata
- `createToolData()` that calls shared functions but adds variant logic
- Main `decorate()` function with variant-specific flow

---

## Metadata Usage Comparison

### Common Metadata (All variants)
- `fork-eligibility-check`
- `show-floating-cta-app-store-badge`
- `ctas-above-divider`
- `floating-cta-drawer-delay`
- `desktop-floating-cta-link/text`
- `mobile-floating-cta-link/text`
- `main-cta-link/text`
- `floating-cta-bubble-sheet`
- `floating-cta-live`
- `fork-button-header`
- `fork-cta-1-icon/icon-text/link/text`
- `fork-cta-2-icon/icon-text/link/text`

### Dismissable-Specific Metadata
- `cta-1-link` - For sticky CTA after dismissal
- `cta-1-text` - For sticky CTA after dismissal

### Frictionless-Specific Metadata
- `frictionless-safari` - Enables for Safari users
- `fork-cta-1-icon-frictionless` - Frictionless variant of icon
- `fork-cta-1-icon-text-frictionless` - Frictionless variant of icon text
- `fork-cta-1-link-frictionless` - Frictionless variant of link
- `fork-cta-1-text-frictionless` - Frictionless variant of text
- (Same pattern for `fork-cta-2-*-frictionless`)

---

## Dependencies Analysis

### Shared Dependencies (All variants)
- `getLibs()` from `../../scripts/utils.js`
- `getMobileOperatingSystem()` from `../../scripts/utils.js`
- `getIconElementDeprecated()` from `../../scripts/utils.js`
- `addTempWrapperDeprecated()` from `../../scripts/utils.js`
- `createFloatingButton()` from `../../scripts/widgets/floating-cta.js`
- `createTag` from Milo utils (dynamically imported)
- `getMetadata` from Milo utils (dynamically imported)

### Import Pattern Differences
- Base & Dismissable: Import `createTag` and `getMetadata` as `let` variables, assign in `decorate()`
- Frictionless: Import `createTag` directly, import `getMetadata` in `decorate()`

**Recommendation:** Standardize import pattern across all variants.

---

## Conclusion

These three variants share approximately **60-70% of their code**. The main differences are:
1. **Eligibility logic** (Android-only vs Android+Safari)
2. **Dismissable behavior** (close button + sticky CTA fallback)
3. **Metadata strategy** (standard vs frictionless-suffixed)

A shared utility file could eliminate ~50 lines of duplicate code per file, improving maintainability and reducing the risk of inconsistencies when updating shared logic.

