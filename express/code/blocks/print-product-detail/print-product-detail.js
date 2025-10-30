import { h, render } from 'https://esm.sh/preact@10';
import htm from 'https://esm.sh/htm@3';
import { PDPContainer } from './components/PDPContainer.js';
import { addPrefetchLinks } from './utilities/utility-functions.js';

const html = htm.bind(h);

/**
 * Main entry point for print-product-detail block
 * Renders the PDP using Preact and the Zazzle PDP SDK
 * @param {HTMLElement} block - The block element from the page
 */
export default async function decorate(block) {
  // Add prefetch links for performance
  addPrefetchLinks();
  
  // Extract templateId from block structure
  // Format: block.children[0].children[1].textContent
  const templateId = block.children[0]?.children[1]?.textContent?.trim();
  
  if (!templateId) {
    // eslint-disable-next-line no-console
    console.error('print-product-detail: No template ID found in block');
    return;
  }
  
  // Clear block content
  block.innerHTML = '';
  
  // Create mount point for Preact
  const mountPoint = document.createElement('div');
  block.appendChild(mountPoint);
  
  // Render Preact component
  render(html`<${PDPContainer} templateId=${templateId} />`, mountPoint);
}