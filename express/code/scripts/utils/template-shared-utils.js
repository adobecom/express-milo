/**
 * Shared utilities for template-list and template-x blocks
 * This file contains common functions to avoid code duplication
 * and ensure consistent behavior across template blocks.
 */

/**
 * Closes the filter drawer with animation
 * @param {HTMLElement} toolBar - The toolbar element containing the drawer
 */
export function closeDrawer(toolBar) {
  const drawerBackground = toolBar.querySelector('.drawer-background');
  const drawer = toolBar.querySelector('.filter-drawer-mobile');
  const applyButton = toolBar.querySelector('.apply-filter-button-wrapper');

  drawer.classList.add('retracted');
  drawerBackground.classList.add('transparent');
  applyButton.classList.add('transparent');

  setTimeout(() => {
    drawer.classList.add('hidden');
    drawerBackground.classList.add('hidden');
    applyButton.classList.add('hidden');
  }, 500);
}

/**
 * Calculates placeholder width based on viewport and view mode
 * @param {HTMLElement} block - The template block element
 * @returns {number} Calculated width in pixels
 */
export function getPlaceholderWidth(block) {
  let width;
  if (window.innerWidth >= 900) {
    if (block.classList.contains('sm-view')) {
      width = 165;
    }

    if (block.classList.contains('md-view')) {
      width = 258.5;
    }

    if (block.classList.contains('lg-view')) {
      width = 352;
    }
  } else if (window.innerWidth >= 600) {
    if (block.classList.contains('sm-view')) {
      width = 165;
    }

    if (block.classList.contains('md-view')) {
      width = 258.5;
    }

    if (block.classList.contains('lg-view')) {
      width = 352;
    }
  } else {
    width = window.innerWidth >= 400 ? 165 : window.innerWidth - 32;
  }
  return Math.round(width);
}

/**
 * Checks if a word starts with a vowel
 * @param {string} word - The word to check
 * @returns {boolean} True if word starts with a vowel
 */
export function wordStartsWithVowels(word) {
  return word.match('^[aieouâêîôûäëïöüàéèùœAIEOUÂÊÎÔÛÄËÏÖÜÀÉÈÙŒ].*');
}

/**
 * Initializes toolbar shadow effect based on scroll position
 * @param {HTMLElement} block - The template block element
 */
export function initToolbarShadow(block) {
  const scrollableDiv = block.querySelector('.card-wrapper, .template-container-wrapper');
  const toolBar = block.querySelector('.filter-wrapper, .template-x-filter-container');
  scrollableDiv?.addEventListener('scroll', () => {
    if (scrollableDiv.scrollTop > 0) {
      toolBar.classList.add('toolbar-box-shadow');
    } else {
      toolBar.classList.remove('toolbar-box-shadow');
    }
  });
}
