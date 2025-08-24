# Template Promo Block

The Template Promo block is a dynamic component designed to showcase Adobe Express templates with interactive elements and responsive design. It automatically adapts its layout based on the number of templates provided, offering two distinct variants: one-up (single template) and multi-up (carousel of multiple templates).

## Overview

The Template Promo block serves as a promotional showcase for Adobe Express templates, providing users with:
- Visual template previews with responsive images
- Template type indicators (Free/Premium)
- Direct edit links for each template
- Adaptive layouts based on content quantity
- Accessibility features and internationalization support

## Features

### Core Functionality
- **Automatic Layout Detection**: Automatically determines whether to display as single template (one-up) or multiple templates (carousel)
- **Template Type Recognition**: Identifies and displays appropriate badges for Free and Premium templates
- **Responsive Design**: Adapts to different screen sizes with mobile-first approach
- **Accessibility**: Includes proper ARIA labels and semantic HTML structure
- **Internationalization**: Supports multiple languages through placeholder replacement

### Variants

#### One-Up Variant
- Displays a single template prominently
- Creates an image wrapper with template type indicator
- Generates an "Edit this template" button
- Optimized for focused template promotion

#### Multi-Up Variant
- Displays multiple templates in a carousel format
- Delegates to the `template-promo-carousel` component
- Ideal for showcasing template collections

## Usage

### HTML Structure

```html
<div class="template-promo block" data-block-name="template-promo">
  <div>
    <picture>
      <source media="(min-width: 600px)" type="image/webp" srcset="...">
      <source type="image/webp" srcset="...">
      <source media="(min-width: 600px)" srcset="...">
      <img loading="lazy" alt="Template Description" src="...">
    </picture>
    <h4>Premium</h4> <!-- or "Free" -->
    <a href="https://express.adobe.com/template/123" class="template-link">Edit Template</a>
  </div>
  <!-- Additional template divs for multi-up variant -->
</div>
```

### Required Elements

1. **Picture Element**: Contains responsive image sources and fallback image
2. **H4 Tag**: Indicates template type ("Free" or "Premium")
3. **Template Link**: Provides the edit URL for the template

### Optional Elements

- Multiple template divs for carousel functionality
- Additional metadata or descriptions

## API Reference

### Main Function

#### `decorate(block)`
The main entry point that initializes and decorates the template promo block.

**Parameters:**
- `block` (HTMLElement): The DOM element containing the template promo block

**Returns:** Promise<void>

**Behavior:**
1. Dynamically imports required utilities and features
2. Adds `ax-template-promo` class to parent element
3. Processes template links, images, and premium tags
4. Determines layout variant and calls appropriate handler

### Helper Functions

#### `getStillWrapperIcons(templateType)`
Creates appropriate icon elements for template type indicators.

**Parameters:**
- `templateType` (string): The type of template ("free" or other)

**Returns:** Object with `planIcon` property

**Behavior:**
- For "free" templates: Creates a "Free" badge
- For other templates: Returns premium icon element

#### `handleOneUp(blockElement, variantsData)`
Handles the one-up variant layout and functionality.

**Parameters:**
- `blockElement` (HTMLElement): The block element to process
- `variantsData` (Object): Object containing:
  - `imageElements` (Array): Array of image elements
  - `templateLinks` (Array): Array of template link elements
  - `premiumTagsElements` (Array): Array of premium tag elements

**Behavior:**
1. Adds "one-up" class to parent element
2. Creates image wrapper and moves image into it
3. Appends template type indicator
4. Hides original template link
5. Creates and appends edit button

## CSS Classes

### Main Container
- `.ax-template-promo`: Main container class added to parent section
- `.ax-template-promo.one-up`: Applied when displaying single template
- `.ax-template-promo.multiple-up`: Applied when displaying multiple templates

### Image Elements
- `.image-wrapper`: Container for template images with relative positioning
- `.free-tag`: Styling for free template indicators
- `.icon-premium`: Styling for premium template indicators

### Button Elements
- `.button-container`: Container for action buttons
- `.button.accent`: Styling for primary action buttons

### Responsive Breakpoints
- **Mobile**: `< 600px` - Stacked layout with full-width images
- **Tablet**: `≥ 768px` - Enhanced spacing and typography
- **Desktop**: `≥ 1024px` - Multi-column layout with grid positioning
- **Large Desktop**: `≥ 1680px` - Centered layout with maximum width

## Dependencies

### Internal Dependencies
- `../../scripts/utils.js`: Provides `getLibs` and `getIconElementDeprecated` utilities
- `../template-promo-carousel/template-promo-carousel.js`: Handles multi-template carousel functionality

### Dynamic Imports
- `@adobe/block-library/utils/utils.js`: Provides `createTag` and `getConfig` utilities
- `@adobe/block-library/features/placeholders.js`: Provides `replaceKey` functionality for internationalization

## Browser Support

- Modern browsers with ES6+ support
- Responsive design with CSS Grid and Flexbox
- Progressive enhancement for older browsers

## Accessibility Features

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast support through CSS custom properties

## Performance Considerations

- Lazy loading for images
- Dynamic imports for code splitting
- Efficient DOM manipulation
- Minimal reflows and repaints

## Testing

The block includes comprehensive unit tests covering:
- Main decorate function functionality
- One-up variant handling
- Multi-up variant delegation
- Edge cases and error handling
- Template type detection
- Accessibility features

Run tests with:
```bash
npm test -- test/blocks/template-promo/template-promo.test.js
```

## Examples

### Single Template (One-Up)
```html
<div class="template-promo block">
  <div>
    <picture>
      <img src="business-card-template.png" alt="Professional Business Card">
    </picture>
    <h4>Premium</h4>
    <a href="/template/business-card">Edit Template</a>
  </div>
</div>
```

### Multiple Templates (Multi-Up)
```html
<div class="template-promo block">
  <div>
    <picture>
      <img src="template1.png" alt="Social Media Post">
    </picture>
    <h4>Free</h4>
    <a href="/template/social-media">Edit Template</a>
  </div>
  <div>
    <picture>
      <img src="template2.png" alt="Presentation">
    </picture>
    <h4>Premium</h4>
    <a href="/template/presentation">Edit Template</a>
  </div>
</div>
```

## Contributing

When contributing to the Template Promo block:

1. Follow the existing code style and patterns
2. Add tests for new functionality
3. Update documentation for API changes
4. Ensure accessibility compliance
5. Test across different screen sizes and devices

## Related Components

- [Template Promo Carousel](../template-promo-carousel/): Handles multi-template display
- [Cards](../cards/): Similar promotional component for different content types
- [CTA Cards](../cta-cards/): Call-to-action focused promotional component
