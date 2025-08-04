# CSS Improvements for simplified-pricing-cards-v2.css

## Code Quality Issues and Suggested Fixes

### 1. CSS Custom Property Organization
**Issue**: CSS custom properties are mixed between custom values and references to global variables
**Fix**: Group custom properties by type (dimensions, typography, colors, components) with clear comments

### 2. Color Value Inconsistency
**Issue**: Mix of hardcoded colors (#222222, #464646, etc.) and CSS variables
**Fix**: Replace all hardcoded colors with CSS custom properties for consistency:
- Replace `#222222` with `var(--color-text-primary)`
- Replace `#D5D5D5` with `var(--color-border)`
- Replace `#FFF` with `var(--color-white)`

### 3. Redundant Style Declarations
**Issue**: Multiple selectors targeting the same properties with identical values
**Fix**: Consolidate redundant rules:
- Lines 118-134: Merge duplicate heading styles
- Lines 205-212: Combine pricing area heading styles with main heading styles

### 4. Magic Numbers
**Issue**: Hardcoded pixel values throughout (e.g., 18px, 22px, 365px)
**Fix**: Use CSS custom properties or existing spacing variables:
- Replace `18px` with `var(--icon-size)`
- Replace `365px` with `var(--card-max-width)`

### 5. Overly Specific Selectors
**Issue**: Extremely long selector chains reduce maintainability
**Fix**: Simplify selectors like:
- `.simplified-pricing-cards-v2 .card-wrapper .card-inner-content .plan-explanation p`
- Use BEM methodology or simpler class-based selectors

### 6. Empty Media Queries
**Issue**: Empty media queries at lines 507-508 and 511-512
**Fix**: Remove empty media queries or add TODO comments if planned for future use

### 7. Inconsistent Units
**Issue**: Mix of px, unset, and spacing variables
**Fix**: Standardize on spacing variables where possible

### 8. Poor Selector Performance
**Issue**: Complex selectors with multiple descendant combinators
**Fix**: Use more specific class names to reduce selector complexity

### 9. Missing CSS Reset/Normalization
**Issue**: Relying on browser defaults for margins, padding
**Fix**: Add explicit resets for commonly used elements within the component

### 10. Accessibility Concerns
**Issue**: Color contrast might not meet WCAG standards
**Fix**: Verify color combinations meet WCAG AA standards:
- Text color `#8f8f8f` on white background may be too light
- Add focus styles beyond just outline for keyboard navigation

### 11. Duplicate Border Radius Values
**Issue**: Multiple border-radius declarations with same values
**Fix**: Create a single custom property for consistent border radius

### 12. Inefficient :has() Usage
**Issue**: Using :has() selector which has browser compatibility issues
**Fix**: Consider JavaScript-based solutions for better browser support

### 13. Z-index Management
**Issue**: Arbitrary z-index values (0, 2, 10) without clear hierarchy
**Fix**: Create z-index scale variables for consistent layering

### 14. Commented Out Code
**Issue**: Block of commented code at line 104
**Fix**: Remove commented code or add explanation if needed for reference

### 15. Inconsistent Spacing
**Issue**: Mix of margin/padding approaches
**Fix**: Standardize spacing approach using consistent custom properties

## Priority Fixes

1. **High**: Replace hardcoded colors with CSS variables
2. **High**: Remove empty media queries
3. **Medium**: Simplify overly complex selectors
4. **Medium**: Consolidate redundant style declarations
5. **Low**: Standardize units and spacing

---

# JavaScript Improvements for simplified-pricing-cards-v2.js

## Code Quality Issues and Suggested Fixes

### 1. Global Variable Declarations
**Issue**: Multiple let declarations at module level (lines 9-10)
**Fix**: Use proper module imports or initialize variables immediately

### 2. Magic Numbers
**Issue**: Hardcoded values throughout (1279px, 40px, etc.)
**Fix**: Define constants at the top of the file:
```javascript
const DESKTOP_BREAKPOINT = 1279;
const EYEBROW_HEIGHT = 40;
```

### 3. Error Handling
**Issue**: Only one try-catch block in entire file (line 57)
**Fix**: Add proper error handling for:
- API calls (fetchPlanOnePlans)
- DOM manipulations
- Async operations

### 4. Performance Issues
**Issue**: Multiple DOM queries in loops
**Fix**: Cache DOM queries outside loops:
- Line 165-169: Cache empty paragraph query
- Line 323-335: Cache plan explanation queries

### 5. Commented Out Code
**Issue**: Large block of commented code at lines 356-363
**Fix**: Remove commented code or document why it's preserved

### 6. Complex Function Parameters
**Issue**: Functions with too many parameters (e.g., createPricingSection)
**Fix**: Use object parameters for better readability:
```javascript
createPricingSection({ header, pricingArea, ctaGroup })
```

### 7. Inconsistent Async/Await
**Issue**: Mix of async/await and promise chains
**Fix**: Standardize on async/await throughout

### 8. Poor Variable Naming
**Issue**: Non-descriptive names like 'j', 'y2p'
**Fix**: Use descriptive variable names:
- `j` → `rowIndex`
- `y2p` → `year2Pricing`

### 9. DOM Manipulation Anti-patterns
**Issue**: Direct innerHTML usage and element removal in loops
**Fix**: Use DocumentFragment or batch DOM updates

### 10. Missing Type Safety
**Issue**: No type checking or validation
**Fix**: Add runtime type checks or migrate to TypeScript

### 11. Accessibility Issues
**Issue**: Aria attributes set after element creation
**Fix**: Set accessibility attributes during element creation

### 12. Event Listener Memory Leaks
**Issue**: No cleanup for resize event listener
**Fix**: Store and remove event listeners on component unmount

### 13. Hardcoded Strings
**Issue**: Strings like 'hide', 'card-header' scattered throughout
**Fix**: Define constants for CSS classes and states

### 14. Complex Nested Loops
**Issue**: Nested loops with await (line 285)
**Fix**: Refactor to reduce complexity and improve readability

### 15. Missing JSDoc Comments
**Issue**: No documentation for functions
**Fix**: Add JSDoc comments for all exported functions

### 16. Inconsistent Error Messages
**Issue**: Generic error logging with window.lana.log
**Fix**: Add contextual error messages

### 17. DOM Query Inefficiency
**Issue**: Multiple queries for same elements
**Fix**: Cache frequently accessed elements

### 18. Missing Input Validation
**Issue**: No validation of DOM structure assumptions
**Fix**: Add guards for expected DOM structure

### 19. Console.log in Production
**Issue**: console.log statement at line 198
**Fix**: Remove or use proper logging utility

### 20. Tight Coupling
**Issue**: Direct dependency on DOM structure
**Fix**: Use data attributes or configuration objects

## Priority Fixes

1. **Critical**: Remove console.log statement
2. **High**: Add comprehensive error handling
3. **High**: Replace magic numbers with constants
4. **Medium**: Improve function signatures and parameters
5. **Medium**: Add JSDoc documentation
6. **Low**: Refactor complex nested loops