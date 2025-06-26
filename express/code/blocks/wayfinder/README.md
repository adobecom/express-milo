# Wayfinder Component

The Wayfinder component displays text content with call-to-action buttons in a banner format.

## Custom Background Colors & Gradients

To add a custom background color or gradient to the wayfinder component, simply add an extra row at the bottom of the block. The value can be any valid CSS color or gradient string—**no prefix required**. This matches the authoring pattern used by `ribbon-banner` and other components.

### Example Authoring

**Gradient background:**
```html
<div class="wayfinder">
  <div>Text here</div>
  <div><a href="#">CTA 1</a> <a href="#">CTA 2</a></div>
  <div>linear-gradient(90deg, #C0C9FF 0%, #ACCFFD 100%)</div>
</div>
```

**Solid color background:**
```html
<div class="wayfinder">
  <div>Text here</div>
  <div><a href="#">CTA 1</a> <a href="#">CTA 2</a></div>
  <div>#C0C9FF</div>
</div>
```

**Named color:**
```html
<div class="wayfinder">
  <div>Text here</div>
  <div><a href="#">CTA 1</a> <a href="#">CTA 2</a></div>
  <div>lightblue</div>
</div>
```

- The background will be applied to the `.wayfinder` div only (not the whole section).
- The config row will be removed from the DOM and not displayed.
- You can use any valid CSS color, hex, rgb, hsl, or gradient string.

## Existing Variants

- `.dark`: Black background with white text
- `.light`: Light border with accent color
- `.gradient`: Pre-defined gradient background
- `.narrow`: Reduced width (850px)
- `.borderless`: No border

## Notes
- This pattern matches `ribbon-banner` and other blocks for consistency.
- If you want a background on the entire section, use `section-metadata` instead.
