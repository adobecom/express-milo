# Comparison Table V2 - Implementation Context

## Overview
The comparison-table-v2 component is a mobile-optimized, accessible comparison table designed to display feature comparisons between different plans/products. It uses a mobile-first approach with JavaScript-generated semantic HTML and advanced state management.

## Recent Updates
- Fixed header alignment issues on desktop
- Resolved flashing/rendering issues during plan switching
- Enhanced CSS styling for better visual consistency
- Improved accessibility with proper ARIA attributes and keyboard navigation
- Added comprehensive tooltip support with pattern matching
- Implemented smooth plan height synchronization

## Architecture

### Core Files
- **comparison-table-v2.js** (575 lines): Main component logic
- **comparison-table-state.js** (342 lines): State management and plan switching logic
- **comparison-table-v2.css**: Styling and responsive layout

### Key Dependencies
- `decorateButtonsDeprecated`: Button styling from utils
- `handleTooltip`: Tooltip functionality from widgets
- `ComparisonTableState`: State management class

## Component Features

### 1. Content Structure & Processing
- **Separator-based partitioning**: Content sections divided by `<hr>`, `+++` (open by default), or `===` (no accordion)
- **Column shading**: First section defines column styling (comma-separated classes)
- **Tooltip support**: Pattern `[[tooltip_id]]content[[/tooltip_id]]` for interactive tooltips

### 2. Sticky Header System
- **Fixed positioning**: Header sticks to top when scrolling (line 403)
- **Intersection Observer**: Tracks scroll position for smooth transitions
- **Mobile optimization**: Shows only 2 plans at a time with dropdown selectors
- **Desktop support**: All plans visible on screens ≥1280px
- **Height synchronization**: Dynamic height matching across plan cells (line 468)

### 3. Table Generation & Accessibility
- **Semantic HTML**: Converts div-based content to proper `<table>` structure
- **Screen reader support**: 
  - Invisible table headers for context
  - Proper ARIA labels and roles
  - Live region announcements for plan changes
- **Icon conversion**:
  - "+" → checkmark icon with "Yes" label
  - "-" → crossmark icon with "No" label
  - Other text wrapped in styled containers

### 4. Interactive Plan Selection
- **Dropdown selectors**: Click/tap to open plan selection menu
- **Keyboard navigation**:
  - Arrow keys to navigate options
  - Enter/Space to select
  - Escape to close
  - Tab cycling within dropdown (focus trap)
- **Visual feedback**: Selected plans show checkmark icon
- **State persistence**: Selected plans remain visible across sections

### 5. Collapsible Sections
- **Toggle buttons**: Expand/collapse table sections
- **ARIA states**: Proper expanded/collapsed announcements
- **Default states**: Controlled by separator type (`+++` = open)

## State Management (ComparisonTableState)

### Core Properties
- `visiblePlans`: Array tracking visible plan indices (e.g., [0, 1])
- `planSelectors`: DOM references to dropdown elements
- `ariaLiveRegion`: Announces plan changes to screen readers

### Key Methods
- `updateVisiblePlan()`: Swaps plans and updates DOM order
- `updateTableCells()`: Synchronizes table cells with header changes
- `updatePlanSelectorOptions()`: Manages dropdown visibility/selection state

### Plan Switching Logic
1. User selects new plan from dropdown
2. State updates visible plan indices
3. DOM elements reorder to maintain visual flow
4. Table cells update to match new selection
5. Screen reader announces the change

## Mobile vs Desktop Behavior

### Mobile (<1280px)
- 2 plans maximum visible
- Interactive plan selectors
- Touch-friendly tap targets
- Responsive grid layout
- Focus management for accessibility

### Desktop (≥1280px)
- All plans visible simultaneously
- No plan selectors needed
- Wider layout optimization
- Simplified interaction model

## Generated HTML Structure

```html
<div class="comparison-table-v2">
  <!-- Screen Reader Announcement Region -->
  <div class="sr-only" aria-live="polite" aria-atomic="true"></div>
  
  <!-- Sticky Header -->
  <div class="sticky-header">
    <div class="first-cell">Compare Plans</div>
    <div class="plan-cell [left-plan|right-plan]">
      <div class="plan-cell-wrapper" 
           tabindex="0" 
           role="button" 
           aria-expanded="false" 
           aria-haspopup="listbox">
        <h3>Plan Name</h3>
        <p>Price/Description</p>
        <div class="plan-selector-wrapper">
          <div class="plan-selector" data-plan-index="0">
            <div class="plan-selector-choices" role="listbox">
              <div class="plan-selector-choice" 
                   role="option" 
                   aria-selected="true">
                <div class="plan-selector-choice-text">
                  <span class="selected-icon icon-selected"></span>
                  Plan Name
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a class="con-button action-area">Get Started</a>
    </div>
  </div>
  
  <!-- Table Sections -->
  <div class="table-container [no-accordion]">
    <div class="first-row">
      <h2>Section Title</h2>
      <button class="toggle-button" 
              aria-label="Expand section" 
              aria-expanded="false">
        <span class="icon expand-button [open]"></span>
      </button>
    </div>
    
    <table class="[hide-table]">
      <thead class="invisible-headers">
        <tr>
          <th>Section Title</th>
          <th scope="col">Plan 1</th>
          <th scope="col">Plan 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th class="feature-cell feature-cell-header" scope="row">
            <p>Feature Name</p>
          </th>
          <td class="feature-cell" data-plan-index="0">
            <div class="icon-wrapper">
              <span class="icon-checkmark-no-fill" 
                    role="img" 
                    aria-label="Yes"></span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

## Button Styling Enhancement
The component supports special button styling with the `#_button-fill` suffix in button text, which adds the `fill` class for filled button variants.

## Performance Optimizations
- **ResizeObserver**: Monitors dynamic content changes for height adjustments
- **Event delegation**: Efficient event handling for interactive elements
- **DOM reordering**: Maintains visual consistency during plan switches
- **Debounced resize handling**: Prevents excessive recalculations

## Accessibility Features
- Full keyboard navigation support
- Screen reader announcements for all interactions
- Proper ARIA attributes throughout
- Focus management and trapping
- Semantic HTML structure
- High contrast support for icons

## Testing Considerations
- Test plan switching on mobile and desktop viewports
- Verify keyboard navigation flows
- Check screen reader announcements
- Validate tooltip interactions
- Ensure proper collapse/expand behavior
- Test with 2, 3, and 4+ plans