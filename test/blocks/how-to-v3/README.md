# How-to-v3 Block Tests

This directory contains comprehensive unit tests for the `how-to-v3` block component.

## Test Files

### `how-to-v3.test.js`
Main test file that covers the JavaScript functionality of the how-to-v3 block:

- **decorate function**: Tests the main decoration logic, DOM structure creation, and media handling
- **buildAccordion function**: Tests accordion creation, step numbering, and initial state
- **setStepDetails function**: Tests step state management and transitions
- **Event handling**: Tests click and keyboard interactions
- **Accessibility**: Tests ARIA attributes and screen reader support
- **Edge cases**: Tests minimal content, different media types, and auto-click behavior
- **CSS integration**: Tests proper CSS class application and styling

### `how-to-v3.css.test.js`
CSS-specific test file that focuses on styling and visual behavior:

- **CSS Classes and Structure**: Tests proper CSS class application
- **CSS State Management**: Tests state-based styling (open/closed states)
- **CSS Transitions and Animations**: Tests smooth accordion transitions
- **CSS Media Handling**: Tests media element preservation and background images
- **CSS Responsive Behavior**: Tests structure consistency across content sizes
- **CSS Accessibility Features**: Tests ARIA attribute preservation
- **CSS Performance and Optimization**: Tests efficient styling and repaint avoidance

### `mocks/body.html`
Mock HTML file containing test data for three different scenarios:

1. **Full how-to block**: Background image, picture media, 5 steps
2. **Minimal how-to block**: No background, picture media, 2 steps  
3. **Link-based media**: No background, link with image, 1 step

## What is Being Tested

The how-to-v3 block is a step-by-step instruction component that:

- Creates an accordion-style interface for step-by-step instructions
- Handles background images and media content (pictures, links)
- Provides keyboard navigation and accessibility features
- Implements smooth CSS transitions for opening/closing steps
- Automatically opens the first step on initialization
- Supports both click and Enter key interactions

## Key Functions Tested

### `decorate(block)`
- Extracts background images and sets CSS variables
- Preserves media content (pictures, links) in media containers
- Builds the accordion structure from step content
- Handles blocks with and without background images

### `buildAccordion(block, rows, stepsContent)`
- Creates ordered list structure with proper ARIA attributes
- Numbers steps sequentially (1. Step Title, 2. Step Title, etc.)
- Sets up event listeners for click and keyboard interactions
- Establishes initial state (first step open, others closed)

### `setStepDetails(block, indexOpenedStep)`
- Manages accordion state (only one step open at a time)
- Applies CSS classes for open/closed states
- Sets max-height for smooth CSS transitions
- Updates ARIA attributes for accessibility

## CSS Integration

The tests verify that the JavaScript properly integrates with the CSS by:

- Applying correct CSS classes for styling
- Managing state-based CSS classes (open/closed)
- Setting up CSS transitions with max-height
- Preserving media elements for CSS background handling
- Maintaining accessibility through proper ARIA attributes

## Running the Tests

To run these tests, use the project's test runner:

```bash
# Run all how-to-v3 tests
npm test -- --grep "How-to-v3"

# Run only JavaScript functionality tests
npm test -- --grep "How-to-v3" --grep -v "CSS Integration"

# Run only CSS integration tests  
npm test -- --grep "How-to-v3 CSS Integration"
```

## Test Coverage

The tests cover:

- ✅ All main functions (decorate, buildAccordion, setStepDetails)
- ✅ DOM structure creation and manipulation
- ✅ Event handling (click, keyboard)
- ✅ Accessibility features (ARIA attributes, keyboard navigation)
- ✅ CSS class application and state management
- ✅ Media content handling (pictures, links, background images)
- ✅ Edge cases (minimal content, different media types)
- ✅ Performance considerations (transitions, repaints)
- ✅ Responsive behavior and content consistency

## Dependencies

- `@web/test-runner-commands` for file reading
- `@esm-bundle/chai` for assertions
- Project utilities from `express/code/scripts/utils.js`
- Milo libraries for configuration

## Notes

- Tests use async/await for proper timing of DOM operations
- Event listeners are properly cleaned up in after() hooks
- CSS loading is simulated for CSS integration tests
- Mock data covers various real-world usage scenarios
- Tests verify both functionality and accessibility compliance
