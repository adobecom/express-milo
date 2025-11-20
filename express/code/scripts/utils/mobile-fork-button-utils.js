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
