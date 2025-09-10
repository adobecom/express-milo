/**
 * Utility functions for template-x-promo
 * Only the functions actually used by template-x-promo.js
 */

import { fetchResults as fetchResultsUtil } from '../../scripts/template-utils.js';
import { isValidTemplate as isValidTemplateUtil } from '../../scripts/template-search-api-v3.js';

/**
 * Extract template metadata from API data
 * @param {Object} templateData - Raw template data from API
 * @returns {Object} Normalized template metadata
 */
export function extractTemplateMetadata(templateData) {
  return {
    editUrl: templateData.customLinks?.branchUrl || templateData.branchUrl || '#',
    imageUrl: templateData.thumbnail?.url || templateData.thumbnail
      || templateData._links?.['http://ns.adobe.com/adobecloud/rel/rendition']?.href, // eslint-disable-line no-underscore-dangle
    title: templateData['dc:title']?.['i-default'] || (typeof templateData.title === 'string' ? templateData.title : templateData.title?.['i-default']) || '',
    isFree: templateData.licensingCategory === 'free',
    isPremium: templateData.licensingCategory !== 'free',
  };
}

/**
 * Extract API parameters from recipe
 * @param {HTMLElement} block - The block element
 * @returns {string|null} The recipe string or null
 */
export function extractApiParamsFromRecipe(block) {
  const recipeElement = block.querySelector('[id^=recipe], h4');
  return recipeElement?.parentElement?.nextElementSibling?.textContent || null;
}

/**
 * Get block styling configuration
 * @param {HTMLElement} block - The block element
 * @returns {Object} Styling configuration
 */
export function getBlockStylingConfig(block) {
  return {
    parentClasses: ['ax-template-x-promo'],
    shouldApply: !!block?.parentElement,
  };
}

/**
 * Determine template routing strategy
 * @param {Array} templates - Array of templates
 * @returns {Object} Routing decision with handler type and data
 */
export function determineTemplateRouting(templates) {
  if (!templates || templates.length === 0) {
    return {
      strategy: 'none',
      reason: 'No templates available',
    };
  }

  if (templates.length === 1) {
    return {
      strategy: 'one-up',
      template: templates[0],
      reason: 'Single template display',
    };
  }

  return {
    strategy: 'carousel',
    templates,
    reason: 'Multiple templates - carousel display',
  };
}

/**
 * Fetch templates from API
 * @param {string} recipe - API recipe parameter
 * @param {Function} [fetchResults] - Function to fetch API results (optional)
 * @param {Function} [isValidTemplate] - Function to validate templates (optional)
 * @returns {Promise<Object>} API response with templates
 */
export async function fetchDirectFromApiUrl(recipe, fetchResults, isValidTemplate) {
  const fetchResultsFn = fetchResults || fetchResultsUtil;
  const isValidTemplateFn = isValidTemplate || isValidTemplateUtil;

  const data = await fetchResultsFn(recipe);

  if (!data || !data.items || !Array.isArray(data.items)) {
    throw new Error('Invalid API response format');
  }

  const filtered = data.items.filter((item) => isValidTemplateFn(item));

  return { templates: filtered };
}
