/**
 * Adapter to build accordion structure compatible with Milo's decorator
 * Mimics the HTML structure created by authored content (Word/Google Docs)
 */

/**
 * Builds Milo-compatible accordion structure
 * @param {Function} createTag - createTag function from utils
 * @param {Array} items - Array of {title, description} objects
 * @returns {HTMLElement} Accordion block ready for Milo's decorator
 */
export function buildMiloAccordionStructure(createTag, items) {
  const accordionBlock = createTag('div', { class: 'accordion quiet xs-spacing pdp-details' });
  
  items.forEach(({ title, description }) => {
    const row = createTag('div');
    
    // Title cell - wrap in <p> to match authored content
    const titleCell = createTag('div');
    const titlePara = createTag('p');
    titlePara.textContent = title;
    titleCell.appendChild(titlePara);
    
    // Content cell - wrap in <div> container (Milo expects this)
    const contentCell = createTag('div');
    // Don't wrap in <p> if content already has block elements (ul, p, etc.)
    if (description.includes('<ul>') || description.includes('<ol>') || description.includes('<p>')) {
      contentCell.innerHTML = description;
    } else {
      const contentPara = createTag('p');
      contentPara.innerHTML = description;
      contentCell.appendChild(contentPara);
    }
    
    row.appendChild(titleCell);
    row.appendChild(contentCell);
    accordionBlock.appendChild(row);
  });
  
  return accordionBlock;
}

/**
 * Rebuilds accordion structure and re-decorates
 * @param {HTMLElement} accordionBlock - Existing accordion block
 * @param {Function} createTag - createTag function
 * @param {Array} items - New items to display
 * @param {Function} decorateAccordion - Milo's decorator function
 */
export async function rebuildMiloAccordion(accordionBlock, createTag, items, decorateAccordion) {
  // Clear existing content
  accordionBlock.innerHTML = '';
  
  // Rebuild structure
  items.forEach(({ title, description }) => {
    const row = createTag('div');
    
    const titleCell = createTag('div');
    const titlePara = createTag('p');
    titlePara.textContent = title;
    titleCell.appendChild(titlePara);
    
    const contentCell = createTag('div');
    if (description.includes('<ul>') || description.includes('<ol>') || description.includes('<p>')) {
      contentCell.innerHTML = description;
    } else {
      const contentPara = createTag('p');
      contentPara.innerHTML = description;
      contentCell.appendChild(contentPara);
    }
    
    row.appendChild(titleCell);
    row.appendChild(contentCell);
    accordionBlock.appendChild(row);
  });
  
  // Re-decorate
  await decorateAccordion(accordionBlock);
}


