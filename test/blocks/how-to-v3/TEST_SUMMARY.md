# How-to-v3 Test Summary

## Quick Start

```bash
# Navigate to test directory
cd test/blocks/how-to-v3

# Run the interactive test runner
./run-tests.sh

# Or run directly with npm
npm test -- --grep "How-to-v3"
```

## Test Structure

```
test/blocks/how-to-v3/
├── how-to-v3.test.js          # Main JavaScript functionality tests
├── how-to-v3.css.test.js      # CSS integration and styling tests
├── mocks/
│   └── body.html              # Test data with 3 different scenarios
├── run-tests.sh               # Interactive test runner script
├── README.md                  # Detailed documentation
└── TEST_SUMMARY.md            # This file
```

## Test Coverage

### JavaScript Functionality (how-to-v3.test.js)
- ✅ `decorate()` function - DOM structure creation
- ✅ `buildAccordion()` function - Accordion building
- ✅ `setStepDetails()` function - State management
- ✅ Event handling (click, keyboard)
- ✅ Accessibility (ARIA attributes)
- ✅ Edge cases and error handling

### CSS Integration (how-to-v3.css.test.js)
- ✅ CSS class application
- ✅ State-based styling
- ✅ Transitions and animations
- ✅ Media handling
- ✅ Responsive behavior
- ✅ Performance optimization

## Mock Data Scenarios

1. **Full Block**: Background image + picture media + 5 steps
2. **Minimal Block**: No background + picture media + 2 steps
3. **Link Media**: No background + link with image + 1 step

## Key Test Areas

- **DOM Manipulation**: Creating and modifying HTML structure
- **Event Handling**: Click and keyboard interactions
- **Accessibility**: ARIA attributes and screen reader support
- **CSS Integration**: Class management and styling
- **Media Handling**: Pictures, links, and background images
- **State Management**: Accordion open/close behavior
- **Performance**: Smooth transitions and efficient updates

## Running Specific Tests

```bash
# All how-to-v3 tests
npm test -- --grep "How-to-v3"

# Only JavaScript tests
npm test -- --grep "How-to-v3" --grep -v "CSS Integration"

# Only CSS tests
npm test -- --grep "How-to-v3 CSS Integration"

# Watch mode
npm run test:watch -- --grep "How-to-v3"
```

## Dependencies

- `@web/test-runner` - Test framework
- `@esm-bundle/chai` - Assertions
- Project utilities and Milo libraries
- Mock HTML data for testing scenarios
