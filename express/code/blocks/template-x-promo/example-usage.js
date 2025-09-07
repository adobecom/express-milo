/**
 * Example usage of template-x-promo pure functions
 * This demonstrates how the pure functions can be imported and used anywhere
 */

import {
  calculateTooltipPosition,
  generateShareActionData,
  extractRecipeFromElement,
  cleanRecipeString,
  extractApiUrl,
  createTemplateMetadata,
  getTemplateLayoutClass,
  calculateMobileHeight,
  generateCarouselStatusText,
  createNavButtonConfig,
} from './template-x-promo-utils.js';

// Example 1: Using tooltip positioning in a different component
function createCustomTooltip(element) {
  const rect = element.getBoundingClientRect();
  const position = calculateTooltipPosition(rect, window.innerWidth);

  // Use the position data to create your custom tooltip
  return {
    x: position.position.left,
    y: rect.top,
    flipped: position.shouldFlip,
  };
}

// Example 2: Using share action data in a different context
function createCustomShareButton(url, text) {
  const mockPosition = { shouldFlip: false };
  const shareData = generateShareActionData(url, text, mockPosition);

  // Use the share data to create your custom share button
  return {
    classes: shareData.tooltipClasses.join(' '),
    timeout: shareData.timeoutDuration,
  };
}

// Example 3: Using template metadata creation
function processTemplateData(rawTemplate, index) {
  const metadata = createTemplateMetadata(rawTemplate, index);

  // Use the metadata to create your custom template display
  return {
    id: metadata.id,
    title: metadata.title,
    isFree: metadata.isFree,
    layout: getTemplateLayoutClass(1), // one-up layout
  };
}

// Example 4: Using carousel utilities
function createCustomCarousel(templateCount) {
  const layoutClass = getTemplateLayoutClass(templateCount);
  const mobileHeight = calculateMobileHeight(templateCount);
  const statusText = generateCarouselStatusText(0, templateCount);

  return {
    layout: layoutClass,
    height: mobileHeight,
    status: statusText,
  };
}

// Example 5: Using navigation button configuration
function createCustomNavButtons() {
  const prevConfig = createNavButtonConfig('prev', false);
  const nextConfig = createNavButtonConfig('next', false);

  return {
    prev: prevConfig,
    next: nextConfig,
  };
}

// Example 6: Using recipe extraction in a different context
function processRecipeData(element) {
  const recipeString = extractRecipeFromElement(element);
  const cleanedUrl = cleanRecipeString(recipeString);
  const apiUrl = extractApiUrl(recipeString);

  return {
    raw: recipeString,
    cleaned: cleanedUrl,
    api: apiUrl,
  };
}

// Export the example functions for demonstration
export {
  createCustomTooltip,
  createCustomShareButton,
  processTemplateData,
  createCustomCarousel,
  createCustomNavButtons,
  processRecipeData,
};
