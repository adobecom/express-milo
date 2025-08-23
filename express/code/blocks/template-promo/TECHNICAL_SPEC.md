# Template Promo Block - Technical Specification

## Architecture Overview

The Template Promo block follows a modular architecture pattern with clear separation of concerns:

```
template-promo.js
├── Main decorate function (entry point)
├── handleOneUp function (one-up variant handler)
├── getStillWrapperIcons function (icon factory)
└── Dynamic imports for utilities
```

## Implementation Details

### Core Functions

#### `decorate(block)`
**Purpose**: Main entry point that orchestrates the block decoration process

**Implementation Flow**:
1. **Dynamic Import Resolution**: Uses `getLibs()` to dynamically import required utilities
2. **DOM Analysis**: Queries for template links, images, and premium tags
3. **Variant Detection**: Determines layout based on image count
4. **Handler Delegation**: Routes to appropriate variant handler

**Key Implementation Notes**:
- Uses `Promise.all()` for concurrent utility imports
- Implements defensive programming with optional chaining
- Maintains backward compatibility through fallback values

#### `handleOneUp(blockElement, variantsData)`
**Purpose**: Handles single template layout and interaction

**Implementation Flow**:
1. **Layout Preparation**: Adds "one-up" class to parent
2. **Image Wrapping**: Creates wrapper and repositions image
3. **Icon Integration**: Appends template type indicator
4. **Button Generation**: Creates edit button with proper attributes
5. **DOM Assembly**: Assembles final structure

**Key Implementation Notes**:
- Uses `createTag` utility for consistent element creation
- Implements proper ARIA labeling for accessibility
- Handles edge cases where elements may be missing

#### `getStillWrapperIcons(templateType)`
**Purpose**: Factory function for template type indicators

**Implementation Flow**:
1. **Type Detection**: Checks template type string
2. **Icon Creation**: Creates appropriate icon element
3. **Return Structure**: Returns object with icon reference

**Key Implementation Notes**:
- Case-insensitive template type matching
- Uses utility function for premium icon retrieval
- Maintains consistent return structure

### Dynamic Import Strategy

The block uses a sophisticated dynamic import strategy to optimize bundle size:

```javascript
await Promise.all([
  import(`${getLibs()}/utils/utils.js`),
  import(`${getLibs()}/features/placeholders.js`)
])
```

**Benefits**:
- Code splitting for better performance
- Lazy loading of non-critical utilities
- Reduced initial bundle size

**Dependencies**:
- `utils.js`: Provides `createTag` and `getConfig`
- `placeholders.js`: Provides `replaceKey` for i18n

### DOM Manipulation Patterns

#### Element Selection Strategy
```javascript
const templateLinks = [...(block?.querySelectorAll('a') || [])];
const imageElements = [...(block?.querySelectorAll('picture > img') || [])];
const premiumTagsElements = [...(block?.querySelectorAll('h4') || [])];
```

**Patterns Used**:
- Spread operator for array conversion
- Optional chaining for null safety
- Fallback to empty array for defensive programming

#### Element Creation Pattern
```javascript
const imgWrapper = createTag('div', { class: 'image-wrapper' });
```

**Benefits**:
- Consistent element creation
- Centralized attribute handling
- Easier testing and mocking

### CSS Architecture

#### Responsive Design System
The CSS implements a mobile-first responsive design with progressive enhancement:

**Breakpoint Strategy**:
- **Base (Mobile)**: `< 600px` - Stacked layout
- **Small Tablet**: `≥ 768px` - Enhanced spacing
- **Large Tablet**: `≥ 1024px` - Grid layout
- **Desktop**: `≥ 1680px` - Centered layout

#### CSS Custom Properties
Uses CSS custom properties for consistent theming:
```css
color: var(--color-gray-800-variant);
font-size: var(--heading-font-size-l);
font-weight: var(--heading-font-weight-extra);
```

#### Layout Systems
- **Flexbox**: Primary layout system for component alignment
- **CSS Grid**: Used for responsive column layouts
- **Positioning**: Absolute positioning for overlay elements

### Error Handling Strategy

#### Defensive Programming
```javascript
if (img && img.parentElement) {
  img.parentElement.insertBefore(imgWrapper, img);
  imgWrapper.append(img);
}
```

**Approach**:
- Null checks before DOM operations
- Graceful degradation for missing elements
- No exceptions thrown for missing content

#### Fallback Values
```javascript
const editThisTemplate = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
```

**Benefits**:
- Ensures functionality even with missing translations
- Maintains user experience during configuration issues
- Provides sensible defaults

### Performance Optimizations

#### Lazy Loading
- Images use `loading="lazy"` attribute
- Dynamic imports for code splitting
- Efficient DOM querying with specific selectors

#### Memory Management
- No event listeners attached (stateless component)
- Minimal DOM manipulation
- Efficient element creation and positioning

#### Bundle Optimization
- Dynamic imports reduce initial bundle size
- Utility functions loaded only when needed
- Shared dependencies with other blocks

### Accessibility Implementation

#### ARIA Support
```javascript
const editTemplateButton = createTag('a', {
  href: templateEditLink?.href,
  title: `${editThisTemplate} ${img?.alt}`,
  class: 'button accent',
  'aria-label': `${editThisTemplate} ${img?.alt}`,
});
```

**Features**:
- Descriptive `aria-label` attributes
- Meaningful `title` attributes
- Semantic HTML structure

#### Keyboard Navigation
- Focusable elements properly marked
- Logical tab order maintained
- Screen reader compatible structure

### Testing Strategy

#### Unit Test Coverage
- **Function Testing**: All public functions tested
- **Variant Testing**: Both one-up and multi-up scenarios
- **Edge Case Testing**: Missing elements, empty blocks
- **Mock Testing**: External dependencies properly mocked

#### Test Structure
```javascript
describe('Template Promo', () => {
  describe('decorate function', () => { /* ... */ });
  describe('handleOneUp function', () => { /* ... */ });
  describe('getStillWrapperIcons function', () => { /* ... */ });
  describe('Edge cases and error handling', () => { /* ... */ });
});
```

### Integration Points

#### Block Library Integration
- Follows Adobe Block Library patterns
- Uses shared utility functions
- Implements standard block lifecycle

#### Template Promo Carousel Integration
```javascript
: templatePromoCarousel(block, variantsData);
```

**Integration Pattern**:
- Delegates multi-template handling
- Passes consistent data structure
- Maintains separation of concerns

### Security Considerations

#### Content Security
- No inline scripts or styles
- External content properly sanitized
- XSS prevention through safe DOM manipulation

#### Data Validation
- Input validation for template types
- Safe URL handling for template links
- Proper escaping of user content

### Browser Compatibility

#### Supported Features
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Modern DOM APIs
- Promise-based async/await

#### Progressive Enhancement
- Graceful degradation for older browsers
- Feature detection for advanced CSS
- Fallback layouts for unsupported features

### Future Considerations

#### Potential Enhancements
- **Animation Support**: Smooth transitions between variants
- **Lazy Loading**: Progressive image loading
- **Performance Monitoring**: Metrics collection
- **A/B Testing**: Variant performance comparison

#### Scalability
- **Component Composition**: Reusable sub-components
- **Plugin Architecture**: Extensible functionality
- **Performance Monitoring**: Runtime performance tracking

## Conclusion

The Template Promo block demonstrates modern web development best practices with:
- Clean separation of concerns
- Robust error handling
- Comprehensive accessibility support
- Performance-optimized implementation
- Maintainable and testable code structure

This architecture provides a solid foundation for future enhancements while maintaining current functionality and performance requirements.
