/**
 * Shared utilities for mobile fork button variants
 * Used by: mobile-fork-button, mobile-fork-button-dismissable, mobile-fork-button-frictionless
 */

export const LONG_TEXT_CUTOFF = 70;

/**
 * Calculates the pixel width of text for a given font
 * @param {string} text - The text to measure
 * @param {string|number} font - Font size or full font specification
 * @returns {number} The width of the text in pixels
 */
export const getTextWidth = (text, font) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};

/**
 * Creates a key-value map of all metadata tags from the document head
 * @returns {Object} Map of metadata name to content
 */
export function createMetadataMap() {
  return Array.from(document.head.querySelectorAll('meta')).reduce((acc, meta) => {
    if (meta?.name && !meta.property) acc[meta.name] = meta.content || '';
    return acc;
  }, {});
}

/**
 * Builds a single action row with icon, text, and button
 * @param {Function} createTag - Function to create DOM elements
 * @param {Object} entry - Entry object containing icon, iconText, and anchor
 * @param {string} buttonType - Button type class ('accent' or 'outline')
 * @returns {HTMLElement} The action row wrapper element
 */
export function buildAction(createTag, entry, buttonType) {
  const wrapper = createTag('div', { class: 'floating-button-inner-row mobile-gating-row' });
  const text = createTag('div', { class: 'mobile-gating-text' });
  text.textContent = entry?.iconText;
  const a = entry?.anchor;
  if (a) {
    a.classList.add(buttonType, 'button', 'mobile-gating-link');
    wrapper.append(entry?.icon || null, text, a);
  }
  return wrapper;
}
