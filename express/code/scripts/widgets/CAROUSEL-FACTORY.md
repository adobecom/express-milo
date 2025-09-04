# Carousel Factory - Functional Programming Module

## 📋 Overview

The Carousel Factory is a functional programming module extracted from the `template-x-promo` component to provide reusable, composable carousel functionality across the Adobe Express Milo ecosystem.

## 📁 Files

- `carousel-factory.js` - Main JavaScript module with factory functions
- `carousel-factory.css` - Reusable CSS styles for all carousel types
- `CAROUSEL-FACTORY.md` - This documentation file

## 🎯 Design Principles

### Functional Programming Core
- **Pure Functions**: All state transformations are immutable
- **Composable Architecture**: Separate concerns for DOM, State, Display, and Hover
- **No Side Effects**: Functions return new objects rather than mutating existing ones
- **Predictable Behavior**: Same inputs always produce same outputs

### SOLID Principles
- **Single Responsibility**: Each module handles one specific concern
- **Open/Closed**: Open for extension via configuration, closed for modification
- **Dependency Inversion**: Depends on abstractions (createTag) not concrete implementations

## 🏗️ Architecture

### Core Modules

#### 1. CarouselState
Manages carousel state using pure functions:
```javascript
const CarouselState = {
  create: (config) => ({ currentIndex: 0, templateCount, isMobile, ...config }),
  moveNext: (state) => ({ ...state, currentIndex: (state.currentIndex + 1) % state.templateCount }),
  movePrev: (state) => ({ ...state, currentIndex: (state.currentIndex - 1 + state.templateCount) % state.templateCount })
};
```

#### 2. CarouselDOM
Pure DOM creation functions with semantic HTML:
```javascript
const CarouselDOM = {
  createStructure: (createTag) => ({ 
    wrapper: createTag('section', { class: 'promo-carousel-wrapper', 'aria-label': 'Template carousel' }),
    viewport: createTag('div', { class: 'promo-carousel-viewport' }),
    track: createTag('div', { class: 'promo-carousel-track' })
  }),
  createNavigation: (createTag) => ({ 
    container: createTag('nav', { class: 'promo-nav-controls', 'aria-label': 'Carousel navigation' }),
    prevBtn: createTag('button', { ... }),
    nextBtn: createTag('button', { ... })
  }),
  createButtonSVG: (direction) => 'SVG string'
};
```

**Semantic HTML Benefits:**
- `<section>` for carousel wrapper (logical content section)
- `<nav>` for navigation controls (navigation landmark)  
- `<article>` for individual templates (self-contained content)
- `<section>` for interactive button containers
- Proper ARIA labels for accessibility

**Accessibility Features:**
- **Screen Reader Support**: Live regions announce carousel changes
- **Keyboard Navigation**: Arrow keys, Home/End for navigation
- **Focus Management**: Visible focus indicators and logical tab order
- **ARIA Attributes**: Comprehensive labeling and descriptions
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **High Contrast**: Supports `prefers-contrast: high`
- **Touch Targets**: Minimum 44px touch targets on mobile
- **Skip Links**: Allow users to skip carousel navigation

#### 3. HoverSystem
Template-X compatible hover management:
```javascript
const HoverSystem = {
  create: () => ({ enterHandler, leaveHandler, focusHandler }),
  attachToTemplate: (templateEl, hoverSystem) => { /* attach events */ }
};
```

#### 4. DisplayLogic
Pure display calculation functions:
```javascript
const DisplayLogic = {
  getVisibleTemplates: (state) => [...], // Returns array of display instructions
  shouldShowNavigation: (state) => boolean
};
```

## 🚀 API Reference

### Primary Factory Function

#### `createCustomCarousel(config)`
Creates a new carousel instance with functional configuration.

**Parameters:**
```javascript
const config = {
  block: HTMLElement,           // Required: Container element
  templates: Array<HTMLElement>, // Required: Template elements to display
  createTag: Function,          // Required: DOM creation utility
  attachHoverListeners: Function, // Optional: Custom hover attachment
  customDOMCallback: Function   // Optional: Custom DOM modification callback
};
```

**Returns:**
```javascript
{
  // State accessors (read-only)
  getCurrentIndex: () => number,
  getTemplateCount: () => number,
  isMobile: () => boolean,
  
  // Actions
  next: () => void,
  prev: () => void,
  goTo: (index) => void,
  
  // Cleanup
  destroy: () => void
}
```

### Convenience Functions

#### `createTemplateCarousel(block, templates, createTag, attachHoverListeners, customDOMCallback)`
Simplified factory function with preset configuration for template components.

**Example:**
```javascript
import { createTemplateCarousel } from '../../scripts/widgets/custom-carousel.js';

const carousel = createTemplateCarousel(
  blockElement,
  templateElements,
  createTag,
  attachHoverListeners,
  customDOMCallback
);
```

### Custom DOM Callback Feature

The `customDOMCallback` parameter allows you to modify the carousel DOM structure after it's created but before it's rendered. This provides maximum flexibility for custom styling, additional elements, or unique layouts.

#### Callback Signature
```javascript
const customDOMCallback = (domElements) => {
  // domElements contains:
  // - wrapper: Main carousel wrapper
  // - viewport: Viewport container
  // - track: Scrollable track
  // - navigation: Navigation container
  // - prevButton: Previous button element
  // - nextButton: Next button element
  // - block: Original block element
  // - state: Current carousel state
};
```

#### Custom DOM Examples

**Add Custom Controls:**
```javascript
const addCustomControls = ({ wrapper, state }) => {
  const customControls = createTag('div', { class: 'custom-controls' });
  
  // Add template counter
  const counter = createTag('span', { class: 'template-counter' });
  counter.textContent = `${state.currentIndex + 1} / ${state.templateCount}`;
  customControls.append(counter);
  
  // Add play/pause button
  const playButton = createTag('button', { class: 'play-toggle' });
  playButton.textContent = 'Auto Play';
  customControls.append(playButton);
  
  wrapper.append(customControls);
};

const carousel = createTemplateCarousel(
  block, templates, createTag, attachHoverListeners, addCustomControls
);
```

**Modify Navigation Style:**
```javascript
const customizeNavigation = ({ prevButton, nextButton, navigation }) => {
  // Add custom icons
  prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
  nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
  
  // Add custom classes
  navigation.classList.add('floating-nav', 'bottom-right');
  
  // Add additional styling
  navigation.style.position = 'absolute';
  navigation.style.bottom = '20px';
  navigation.style.right = '20px';
};
```

**Add Progress Indicator:**
```javascript
const addProgressIndicator = ({ wrapper, state }) => {
  const progressBar = createTag('div', { class: 'carousel-progress' });
  const progressFill = createTag('div', { class: 'progress-fill' });
  
  progressFill.style.width = `${((state.currentIndex + 1) / state.templateCount) * 100}%`;
  
  progressBar.append(progressFill);
  wrapper.append(progressBar);
};
```

**Create Thumbnail Navigation:**
```javascript
const addThumbnailNav = ({ wrapper, state, templates }) => {
  const thumbNav = createTag('div', { class: 'thumbnail-nav' });
  
  templates.forEach((template, index) => {
    const thumb = createTag('button', { 
      class: index === state.currentIndex ? 'thumb active' : 'thumb' 
    });
    const img = template.querySelector('img');
    if (img) {
      thumb.style.backgroundImage = `url(${img.src})`;
    }
    thumbNav.append(thumb);
  });
  
  wrapper.append(thumbNav);
};
```

## 📱 Responsive Behavior

### Mobile (< 768px)
- **Display Pattern**: Previous → **Current** → Next (3-up layout)
- **Navigation**: Circular navigation buttons visible
- **Touch Support**: Two-tap hover behavior for mobile devices
- **Looping**: Infinite loop through templates

### Desktop (≥ 768px)
- **Display Pattern**: All templates visible simultaneously
- **Navigation**: Navigation buttons hidden
- **Layout**: Responsive grid with dynamic sizing
- **Hover**: Full Template-X hover system active

## 🎨 CSS Integration

The carousel uses existing CSS classes from the template-x-promo system:

### Container Classes
```css
.custom-promo-carousel           /* Applied to block */
.multiple-up                     /* Applied to parent */
.promo-carousel-wrapper          /* Main wrapper */
.promo-carousel-viewport         /* Viewport container */
.promo-carousel-track            /* Scrollable track */
```

### Navigation Classes
```css
.promo-nav-controls              /* Navigation container */
.promo-nav-btn                   /* Button base */
.promo-prev-btn                  /* Previous button */
.promo-next-btn                  /* Next button */
```

### Template State Classes
```css
.prev-template                   /* Previous template (mobile) */
.current-template                /* Current template (mobile) */
.next-template                   /* Next template (mobile) */
```

## 🔧 Configuration Presets

### CarouselPresets.templatePromo
Default configuration for template promotion carousels:
```javascript
{
  showNavigation: true,
  responsive: true,
  hoverSystem: true,
  looping: true
}
```

### CarouselPresets.basic
Simplified configuration for basic carousels:
```javascript
{
  showNavigation: true,
  responsive: false,
  hoverSystem: false,
  looping: false
}
```

## 🧪 Testing & Integration

### Unit Testing Approach
Since the module uses pure functions, testing is straightforward:

```javascript
// Test state transformations
const initialState = CarouselState.create({ templates: [1, 2, 3] });
const nextState = CarouselState.moveNext(initialState);
assert(nextState.currentIndex === 1);
assert(initialState.currentIndex === 0); // Immutable
```

### Integration Testing
```javascript
// Mock dependencies for integration tests
const mockCreateTag = (tag, attrs) => ({ tag, attrs });
const mockTemplates = [mockElement1, mockElement2, mockElement3];

const carousel = createTemplateCarousel(
  mockBlock,
  mockTemplates,
  mockCreateTag
);
```

## 🔄 Migration Guide

### From Legacy Carousel
Replace large carousel implementations with functional calls:

**Before:**
```javascript
// 500+ lines of carousel logic
const carouselWrapper = createTag('div', { class: 'promo-carousel-wrapper' });
// ... massive implementation
```

**After:**
```javascript
// Clean functional approach
const carousel = createTemplateCarousel(block, templates, createTag, attachHoverListeners);
```

### Backward Compatibility
The module maintains 100% compatibility with existing Template-X hover systems and CSS classes.

## 🚀 Performance Characteristics

### Memory Management
- **Immutable State**: No memory leaks from state mutations
- **Event Cleanup**: Automatic cleanup via destroy() method
- **DOM Optimization**: Minimal DOM manipulation during state changes

### Rendering Performance
- **Debounced Resize**: 100ms debounce on window resize events
- **Efficient Cloning**: Smart cloneNode with event re-attachment
- **Lazy Updates**: Only re-render when state actually changes

## 🛠️ Extending the Carousel

### Custom DOM Modifications
Use the `customDOMCallback` for extensive DOM customizations:

```javascript
const addAdvancedFeatures = ({ wrapper, viewport, track, navigation, state }) => {
  // Add loading indicators
  const loader = createTag('div', { class: 'carousel-loader' });
  wrapper.prepend(loader);
  
  // Add keyboard navigation hints
  const hints = createTag('div', { class: 'keyboard-hints' });
  hints.innerHTML = 'Use ← → arrow keys to navigate';
  wrapper.append(hints);
  
  // Add swipe indicators for mobile
  if (state.isMobile()) {
    const swipeHint = createTag('div', { class: 'swipe-hint' });
    swipeHint.innerHTML = 'Swipe to navigate';
    viewport.append(swipeHint);
  }
  
  // Modify track for custom animations
  track.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
};

const carousel = createTemplateCarousel(
  block, templates, createTag, attachHoverListeners, addAdvancedFeatures
);
```

### Adding Custom Behavior
Create new behavior modules following the functional pattern:

```javascript
const CustomBehavior = {
  create: () => ({ /* behavior state */ }),
  process: (state, behavior) => ({ /* new state */ })
};
```

### Plugin Architecture Ready
The functional design makes it ideal for a plugin-based factory system:

```javascript
// Future factory usage
const carousel = CarouselFactory.create({
  type: 'template-promo',
  plugins: ['hover-system', 'responsive-layout'],
  config: { /* ... */ },
  customDOMCallback: addAdvancedFeatures
});
```

## 🐛 Troubleshooting

### Common Issues

#### Event Listeners Not Working
- **Cause**: cloneNode(true) doesn't copy event listeners
- **Solution**: Always call attachHoverListeners after cloning
- **Prevention**: Use the provided HoverSystem.attachToTemplate

#### Mobile Navigation Not Showing
- **Cause**: CSS media queries or isMobile() function
- **Solution**: Verify window.innerWidth < 768 detection
- **Debug**: Check DisplayLogic.shouldShowNavigation return value

#### State Mutations
- **Cause**: Directly modifying state object
- **Solution**: Always use CarouselState transformation functions
- **Prevention**: Use const for state variables

### Debug Utilities
```javascript
// Access carousel state for debugging
const carousel = createTemplateCarousel(/* ... */);
console.log('Current Index:', carousel.getCurrentIndex());
console.log('Is Mobile:', carousel.isMobile());
console.log('Template Count:', carousel.getTemplateCount());
```

## 📈 Metrics & Analytics

### Performance Monitoring
The carousel API provides hooks for performance monitoring:

```javascript
const carousel = createTemplateCarousel(/* ... */);

// Monitor navigation events
const originalNext = carousel.next;
carousel.next = () => {
  analytics.track('carousel_next', { component: 'template-promo' });
  originalNext();
};
```

### Usage Tracking
```javascript
// Track carousel creation
analytics.track('carousel_created', {
  type: 'template-promo',
  templateCount: templates.length,
  isMobile: carousel.isMobile()
});
```

## 🔮 Future Roadmap

### Phase 1: Factory Integration ✅
- Extract functional carousel module
- Design composable architecture
- Maintain backward compatibility

### Phase 2: Multi-Carousel Support
- Analyze existing carousel variants
- Design unified factory interface
- Plugin-based architecture

### Phase 3: Advanced Features
- Virtual scrolling for performance
- Intersection Observer optimizations
- Advanced animation systems

## 📝 Contributing

### Code Style
- Use pure functions wherever possible
- Prefer immutable state transformations
- Follow functional composition patterns
- Include comprehensive JSDoc comments

### Testing Requirements
- Unit tests for all pure functions
- Integration tests for carousel creation
- Visual regression tests for responsive behavior
- Performance benchmarks for large template sets

## 📚 CSS Integration

### Automatic CSS Loading

The carousel factory automatically loads `carousel-factory.css` unless disabled:

```javascript
// CSS loads automatically
const carousel = createTemplateCarousel(block, templates, createTag);

// Disable automatic CSS loading
const carousel = createCarousel({
  block, templates, createTag,
  loadCSS: false
});
```

### CSS Features

The `carousel-factory.css` provides:

- **Responsive Design**: Mobile carousel, desktop grid
- **Accessibility**: Focus indicators, reduced motion support  
- **Navigation**: Button positioning and interactions
- **Theming**: CSS custom properties for customization
- **Semantic Structure**: Works with semantic HTML elements

### CSS Custom Properties

```css
.promo-carousel-wrapper {
  --carousel-gap: 8px;
  --carousel-nav-bottom: 24px;
  --carousel-nav-right: 24px;
  --carousel-transition-speed: 0.3s;
  --carousel-focus-color: #0066CC;
}
```

## 📞 Support

For questions, issues, or contributions:
- **Architecture Questions**: Refer to functional programming principles
- **Integration Issues**: Check migration guide and troubleshooting
- **Performance Concerns**: Review performance characteristics section

---

**Built with ❤️ and functional programming by the Adobe Express Milo team** 🦢✨
