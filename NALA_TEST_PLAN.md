# Nala E2E Test Plan for C8 Ignored Code

## Overview
This document outlines the Nala (Playwright) E2E tests needed for code marked with `/* c8 ignore */` comments. These are complex integration features that cannot be effectively unit tested and require real browser testing.

---

## 1. quotes.js - Ratings System

**File:** `express/code/blocks/quotes/quotes.js`  
**Lines Ignored:** 74-93 (alreadyRated), 105-250 (isCarouselVariant)  
**Complexity:** High - API calls, user state, timers, animations

### Nala Tests Needed:

#### Test Suite: `quotes-ratings.spec.js`

1. **Rating Submission Flow**
   - User can see rating stars (1-5)
   - User can click a star to select rating
   - User can add optional comment
   - Submit button becomes enabled after rating selection
   - Rating submits successfully to API
   - Success message displays after submission

2. **Already Rated State**
   - User who has already rated sees "already rated" message
   - Previous rating is displayed (read-only)
   - Submit button is disabled
   - User cannot change their rating

3. **Carousel Variant with Ratings**
   - Carousel navigation works (prev/next buttons)
   - Each quote in carousel has its own rating interface
   - Ratings persist when navigating between quotes
   - Keyboard navigation works (arrow keys)
   - Touch/swipe works on mobile

4. **Timer and Auto-Submit**
   - 10-second countdown timer displays
   - Timer counts down correctly
   - Auto-submit triggers after 10 seconds
   - User can submit before timer expires
   - Timer resets on new quote

5. **Lottie Animations**
   - Lottie animation loads correctly
   - Animation plays on interaction
   - Animation doesn't block functionality

6. **Edge Cases**
   - Handle API failure gracefully
   - Handle network timeout
   - Handle invalid rating data
   - Handle missing quote content

---

## 2. template-x/template-rendering.js - Template Sharing & Video

**File:** `express/code/blocks/template-x/template-rendering.js`  
**Lines Ignored:** 84, 116, 138, 193, 208  
**Complexity:** High - Video API, clipboard, modal iframes

### Nala Tests Needed:

#### Test Suite: `template-x-rendering.spec.js`

1. **Share Functionality**
   - Share button is visible on template
   - Click share button opens share options
   - Copy link to clipboard works
   - "Copied" tooltip displays
   - Tooltip disappears after 2.5 seconds
   - Share URL is correct format

2. **Video Template Rendering**
   - Video templates load video URLs correctly
   - Video metadata is fetched from API
   - Video thumbnails display
   - Video playback controls work
   - Video quality options available

3. **Modal iFrame Display**
   - Click template opens modal
   - iFrame loads correctly in modal
   - iFrame has correct dimensions
   - Close modal button works
   - ESC key closes modal
   - Click outside modal closes it

4. **Print CTA**
   - Print button is visible
   - Click print opens print dialog
   - Print preview shows correctly

---

## 3. frictionless-quick-action.js - File Upload & SDK

**File:** `express/code/blocks/frictionless-quick-action/frictionless-quick-action.js`  
**Lines Ignored:** 190-205, 219-230, 233-241, 244-250, 253-265, 268-282, 442-479  
**Complexity:** Very High - SDK integration, file uploads, async workflows

### Nala Tests Needed:

#### Test Suite: `frictionless-quick-action.spec.js`

1. **SDK Initialization**
   - SDK loads correctly
   - SDK ready state is detected
   - Token validation works
   - Service initialization succeeds
   - Error handling for SDK failures

2. **File Upload Flow**
   - Click upload button opens file picker
   - Select file triggers upload
   - Progress bar displays during upload
   - Progress bar updates correctly (0-100%)
   - Upload completes successfully
   - Success message displays

3. **Upload Status Listener**
   - Status updates in real-time
   - Progress events fire correctly
   - Error events are caught
   - Completion event fires

4. **Storage Upload**
   - File uploads to storage service
   - Asset ID is generated
   - Asset URL is returned
   - Metadata is stored correctly

5. **Editor Integration**
   - After upload, redirects to editor
   - Editor URL includes asset ID
   - Editor URL includes quick action params
   - Editor URL includes dimensions
   - Editor loads with uploaded asset

6. **Error Handling**
   - Invalid file type shows error
   - File too large shows error
   - Network error shows retry option
   - Token expired shows re-auth
   - Upload timeout handled gracefully

7. **Multiple File Upload**
   - Can upload multiple files
   - Each file shows separate progress
   - All files complete before redirect
   - Failed files don't block others

---

## 4. template-x-promo.js - Carousel & API-Driven Templates

**File:** `express/code/blocks/template-x-promo/template-x-promo.js`  
**Lines Ignored:** 16-375 (carousel), 376-430 (API data), 432-472 (template elements), 474-809 (desktop layout), 866-910 (API-driven)  
**Complexity:** Very High - 835+ lines of carousel, API, and layout code

### Nala Tests Needed:

#### Test Suite: `template-x-promo-carousel.spec.js`

1. **Direct Carousel Navigation**
   - Carousel displays templates correctly
   - Next button advances carousel
   - Previous button goes back
   - First item: prev button disabled
   - Last item: next button disabled
   - Carousel wraps around (optional)

2. **Carousel Interaction**
   - Click template opens editor
   - Hover shows template details
   - Keyboard navigation works (arrow keys)
   - Touch/swipe works on mobile
   - Carousel is responsive (mobile/desktop)

3. **IntersectionObserver Height Measurement**
   - Carousel height is measured correctly
   - Height adjusts on window resize
   - Min-height is set on track
   - No layout shift after measurement

4. **API-Driven Templates**
   - Templates load from API
   - Loading state displays
   - Templates render after API response
   - Error state for API failure
   - Retry mechanism works
   - Cache works on subsequent loads

5. **Template Element Creation**
   - Template cards have correct structure
   - Images load correctly
   - Titles display
   - CTAs are clickable
   - Metadata is shown (category, tags)

6. **Desktop Layout**
   - Grid layout on desktop
   - Correct number of columns
   - Responsive breakpoints work
   - Hover states work
   - Click to edit works

7. **One-Up from API Data**
   - Single template displays correctly
   - Full-width layout
   - All template details shown
   - CTA works

8. **Edge Cases**
   - Empty API response handled
   - Malformed data handled
   - Missing images handled
   - Network timeout handled

---

## 5. tabs-ax.js & susi-light.js - Pre-existing

**Files:** `express/code/blocks/tabs-ax/tabs-ax.js`, `express/code/blocks/susi-light/susi-light.js`  
**Status:** Pre-existing c8 ignore comments  
**Action:** Review existing Nala tests, add if missing

---

## Test Execution Strategy

### Priority Order:
1. **High Priority:** `frictionless-quick-action` (most complex, critical user flow)
2. **High Priority:** `template-x-promo` (most lines ignored, core feature)
3. **Medium Priority:** `quotes` (ratings are important but less critical)
4. **Medium Priority:** `template-x-rendering` (share/video features)
5. **Low Priority:** Review existing tests for `tabs-ax` and `susi-light`

### Test Environment:
- Use staging environment with real APIs
- Use test user accounts
- Mock external services where appropriate
- Test on multiple browsers (Chrome, Firefox, Safari)
- Test on mobile viewports

### Test Data:
- Use consistent test templates
- Use test file uploads (small, valid files)
- Use test user accounts with known state
- Clean up test data after runs

### CI/CD Integration:
- Run Nala tests on PR creation
- Run full suite nightly
- Run smoke tests on every commit
- Report failures to team

---

## Next Steps

1. ✅ Create this test plan document
2. ⏳ Create Nala test files for each suite
3. ⏳ Implement tests one suite at a time
4. ⏳ Review and refine tests with team
5. ⏳ Integrate into CI/CD pipeline

---

**Generated:** October 6, 2025  
**Branch:** MWPW-181177  
**Related:** COVERAGE_IMPROVEMENT_SUMMARY.md
