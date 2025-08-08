# Comparison Table V2 - Implementation Context

## Overview
The comparison-table-v2 component is a mobile-optimized comparison table designed to display feature comparisons between different plans/products. It uses a mobile-first approach with JavaScript-generated HTML.

## Key Components

### 1. Main Structure (`decorate()` function)
- Entry point at line 335
- Partitions content into sections separated by `<hr>` or `+++` markers
- Creates a sticky header for plan navigation
- Converts content sections into accessible tables

### 2. Content Partitioning
- `partitionContentBySeparators()` (line 35): Groups content by separator elements
- Separators can be `<hr>` elements or text content `+++`
- Content between separators forms individual table sections

### 3. Sticky Header Creation
- `createStickyHeader()` (line 243): 
  - Creates a fixed header that appears when scrolling
  - Contains plan cells with interactive dropdown selectors
  - Only shows 2 plans at a time on mobile
  - Each plan cell has a button wrapper for accessibility

### 4. Table Generation
- `convertToTable()` (line 135):
  - Converts div-based content into semantic table structure
  - Creates screen reader headers (invisible but accessible)
  - Adds collapsible sections with toggle buttons
  - Processes feature rows with icon support

### 5. Icon Handling
- `handleCellIcons()` (line 5):
  - Converts "+" text to checkmark icons
  - Converts "-" text to crossmark icons
  - Wraps icons in div containers for styling

### 6. Plan Selection & Swapping
- `ComparisonTableState` class (line 354):
  - Manages visible plans (2 at a time)
  - Handles plan swapping via dropdown selectors
  - Updates table cells when plans are swapped
  - Maintains DOM order for smooth transitions

### 7. Sticky Behavior
- `initStickyBehavior()` (line 293):
  - Uses Intersection Observer API
  - Creates placeholder to maintain layout
  - Adds/removes sticky class based on scroll position
  - Shows simplified header when stuck

## Mobile-Specific Features

1. **Limited Columns**: Only 2 plans visible at once
2. **Plan Selectors**: Dropdown menus to switch between plans
3. **Touch-Friendly**: Large touch targets on buttons and selectors
4. **Responsive Layout**: Flexible grid that adapts to screen size
5. **Collapsible Sections**: Toggle buttons to expand/collapse table sections

## Generated HTML Structure

```html
<div class="comparison-table-v2">
  <!-- Sticky Header -->
  <div class="sticky-header">
    <div class="first-cell">Compare Plans</div>
    <div class="plan-cell">
      <button class="plan-cell-wrapper">
        <h3>Plan Name</h3>
        <p>Price</p>
        <div class="plan-selector-wrapper">
          <div class="plan-selector" role="button" aria-haspopup="listbox">
            <div class="plan-selector-choices" role="listbox">
              <div class="plan-selector-choice" role="option">Plan 1</div>
              <div class="plan-selector-choice" role="option">Plan 2</div>
            </div>
          </div>
        </div>
        <a class="con-button">Get Started</a>
      </button>
    </div>
  </div>
  
  <!-- Table Sections -->
  <div class="table-container">
    <div class="first-row" tabindex="0">
      <h2>Section Title</h2>
      <div class="button-cell">
        <button class="toggle-button">
          <span class="icon expand-button"></span>
        </button>
      </div>
    </div>
    
    <table>
      <thead class="invisible-headers">
        <tr>
          <th>Section Title</th>
          <th>Plan 1</th>
          <th>Plan 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="feature-cell feature-cell-header">Feature Name</td>
          <td class="feature-cell" data-plan-index="0">
            <div class="icon-wrapper">
              <span class="icon-checkmark-no-fill"></span>
            </div>
          </td>
          <td class="feature-cell" data-plan-index="1">
            <div class="icon-wrapper">
              <span class="icon-crossmark"></span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

## Key Interactions

1. **Plan Selection**: Click on plan selector → dropdown appears → select new plan → table updates
2. **Section Toggle**: Click toggle button → table expands/collapses
3. **Sticky Header**: Scroll down → header sticks to top → scroll up → header returns to position
4. **Plan Swapping**: Selected plan moves to visible position, previous plan becomes hidden

## State Management

The `ComparisonTableState` class maintains:
- `visiblePlans`: Array of currently visible plan indices [0, 1]
- `planSelectors`: References to dropdown selector elements
- Methods to update visibility and reorder DOM elements