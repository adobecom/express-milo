import { getLibs } from '../../scripts/utils.js';

let createTag;

/**
 * Loads an external script dynamically
 * @param {string} src - Script source URL
 * @param {string} type - Script type (default: 'text/javascript')
 * @returns {Promise} Promise that resolves when script is loaded
 */
function loadExternalScript(src, type = 'text/javascript') {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.type = type;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

/**
 * Loads an external stylesheet
 * @param {string} href - Stylesheet URL
 */
function loadExternalStylesheet(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Extracts TD value from the block structure
 * @param {HTMLElement} block - The block element
 * @returns {string|null} The TD value or null if not found
 */
function extractTdValue(block) {
  // Look for the TD value in the second cell of the first row
  const firstRow = block.querySelector(':scope > div:first-child');
  if (!firstRow) return null;

  const cells = firstRow.querySelectorAll(':scope > div');
  if (cells.length < 2) return null;

  const firstCell = cells[0];
  const secondCell = cells[1];

  // Check if first cell contains "TD" and second cell contains the URN
  if (firstCell.textContent.trim() === 'TD') {
    const tdValue = secondCell.textContent.trim();
    return tdValue || null;
  }

  return null;
}

/**
 * Adds TD parameter to current URL and updates browser URL
 * @param {string} tdValue - The TD value to add as query parameter (unencoded)
 */
function updateUrlWithTdParameter(tdValue) {
  const url = new URL(window.location.href);

  // Remove existing TD parameter if present
  url.searchParams.delete('TD');

  // Manually add TD parameter without encoding (to match Adobe's format)
  const separator = url.search ? '&' : '?';
  const newUrl = `${url.origin}${url.pathname}${url.search}${separator}TD=${tdValue}`;

  // Update the browser URL without page reload
  window.history.replaceState({}, '', newUrl);
}

/**
 * Creates the zazzle root element where the external script will render
 * @param {HTMLElement} block - The block element to append the root to
 * @returns {HTMLElement} The created root element
 */
function createZazzleRoot(block) {
  const root = createTag('div', {
    id: 'zazzle-root',
    class: 'pdp-x-content',
  });

  // Clear the block and add the root
  block.innerHTML = '';
  block.appendChild(root);

  return root;
}


/**
 * Loads the Adobe PDP script and stylesheet
 * @returns {Promise} Promise that resolves when resources are loaded
 */
async function loadAdobePdpResources() {
  const basePath = 'https://w299ihl20.wxp.adobe-addons.com/distribute/private/JZnNGECCzfpgfcUmlgcNKgZKclyFP1YXLvq8rF3yfE9RI7inYDEPFaEGWDFv2ynr/0/w299ihl20/wxp-w299ihl20-version-1713829154591';

  // Load stylesheet immediately
  loadExternalStylesheet(`${basePath}/adobePdp.css`);

  // Load script as module
  await loadExternalScript(`${basePath}/adobePdp.js`, 'module');
}

/**
 * Main decoration function for the pdp-x block
 * @param {HTMLElement} block - The block element
 */
export default async function decorate(block) {
  // Initialize utilities
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));

  // Extract TD value from authored content
  const tdValue = extractTdValue(block);

  if (!tdValue) {
    return;
  }

  // Add TD parameter to current URL
  updateUrlWithTdParameter(tdValue);

  // Create the zazzle root element
  createZazzleRoot(block);

  // Load Adobe PDP resources
  await loadAdobePdpResources();

  // Add loading indicator
  block.classList.add('pdp-x-loaded');
}
