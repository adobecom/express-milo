import { getLibs } from '../../../scripts/utils.js';
import { formatProductDescriptions } from '../fetchData/fetchProductDetails.js';
import BlockMediator from '../../../scripts/block-mediator.min.js';

let createTag;

export default async function createProductDetailsSection(productDescriptions) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  
  // Main section container with flex
  const productDetailsSectionContainer = createTag('div', { class: 'pdpx-product-details-section' });
  
  // Title container
  const productDetailsSectionTitleContainer = createTag('div', { class: 'pdpx-product-details-section-title-container' });
  const productDetailsSectionTitle = createTag('span', { class: 'pdpx-product-details-section-title' }, 'Product Details');
  productDetailsSectionTitleContainer.appendChild(productDetailsSectionTitle);
  productDetailsSectionContainer.appendChild(productDetailsSectionTitleContainer);
  
  // Items container (wrapper for all accordion items)
  const productDetailsItemsContainer = createTag('div', { class: 'pdpx-product-details-items-container' });
  productDetailsSectionContainer.appendChild(productDetailsItemsContainer);
  
  // Track which item is currently expanded
  let expandedItemIndex = -1;
  
  // Generate unique ID for this accordion instance
  const accordionId = `pdpx-details-${Math.floor(Math.random() * 10000)}`;
  
  // Function to build accordion items
  function buildAccordionItems(descriptions, keepExpandedIndex = true) {
    // Remember which item was expanded before clearing
    if (keepExpandedIndex) {
      const existingItems = productDetailsItemsContainer.querySelectorAll('.pdpx-product-details-section-item-container');
      existingItems.forEach((item, idx) => {
        if (item.classList.contains('expanded')) {
          expandedItemIndex = idx;
        }
      });
    }
    
    // Clear existing items
    productDetailsItemsContainer.innerHTML = '';
    
    // Build new items
    for (let i = 0; i < descriptions.length; i += 1) {
      // If this was the expanded item, keep it expanded
      const shouldExpand = keepExpandedIndex && i === expandedItemIndex;
      
      const productDetailsSectionItemContainer = createTag('div', { class: 'pdpx-product-details-section-item-container' });
      
      // Button (no heading wrapper)
      const productDetailsSectionItemTitleContainer = createTag('button', {
        type: 'button',
        id: `${accordionId}-trigger-${i + 1}`,
        class: 'accordion-trigger',
        'aria-expanded': shouldExpand ? 'true' : 'false',
        'aria-controls': `${accordionId}-content-${i + 1}`,
      });
      
      productDetailsSectionItemTitleContainer.textContent = descriptions[i].title;
      
      const productDetailsSectionItemIcon = createTag('span', { class: 'accordion-icon' });
      productDetailsSectionItemTitleContainer.appendChild(productDetailsSectionItemIcon);
      
      // Content (aria-hidden approach)
      const productDetailsSectionItemDescription = createTag('div', {
        'aria-labelledby': `${accordionId}-trigger-${i + 1}`,
        id: `${accordionId}-content-${i + 1}`,
        class: shouldExpand ? 'descr-details visible' : 'descr-details',
        'aria-hidden': shouldExpand ? 'false' : 'true',
      });
      
      // Wrap content in inner div
      const contentInner = createTag('div');
      contentInner.innerHTML = descriptions[i].description;
      productDetailsSectionItemDescription.appendChild(contentInner);
      
      productDetailsSectionItemContainer.appendChild(productDetailsSectionItemTitleContainer);
      productDetailsSectionItemContainer.appendChild(productDetailsSectionItemDescription);
      productDetailsItemsContainer.appendChild(productDetailsSectionItemContainer);
      
      // Button click handler
      productDetailsSectionItemTitleContainer.addEventListener('click', () => {
        const isExpanded = productDetailsSectionItemTitleContainer.getAttribute('aria-expanded') === 'true';
        
        // Close all others
        const allButtons = productDetailsItemsContainer.querySelectorAll('.accordion-trigger');
        const allContents = productDetailsItemsContainer.querySelectorAll('.descr-details');
        allButtons.forEach((btn, idx) => {
          if (btn !== productDetailsSectionItemTitleContainer) {
            btn.setAttribute('aria-expanded', 'false');
            allContents[idx].setAttribute('aria-hidden', 'true');
            allContents[idx].classList.remove('visible');
          }
        });
        
        // Toggle current
        if (isExpanded) {
          productDetailsSectionItemTitleContainer.setAttribute('aria-expanded', 'false');
          productDetailsSectionItemDescription.setAttribute('aria-hidden', 'true');
          productDetailsSectionItemDescription.classList.remove('visible');
          expandedItemIndex = -1;
        } else {
          productDetailsSectionItemTitleContainer.setAttribute('aria-expanded', 'true');
          productDetailsSectionItemDescription.setAttribute('aria-hidden', 'false');
          productDetailsSectionItemDescription.classList.add('visible');
          expandedItemIndex = i;
        }
      });
    }
  }
  
  // Build initial items (all collapsed)
  buildAccordionItems(productDescriptions, false);
  
  // Subscribe to product updates
  BlockMediator.subscribe('product:updated', (data) => {
    const { productDetails, formData } = data;
    const updatedDescriptions = formatProductDescriptions(productDetails, formData);
    // Rebuild and preserve expanded state
    buildAccordionItems(updatedDescriptions, true);
  });

  return productDetailsSectionContainer;
}

export function createCheckoutButton() {
  const checkoutButtonContainer = createTag('div', { class: 'pdpx-checkout-button-container' });
  const checkoutButton = createTag('button', { class: 'pdpx-checkout-button' });
  const CTAIcon = createTag('img', { class: 'pdpx-checkout-button-icon', src: '/express/code/icons/print-icon.svg' });
  const CTAText = createTag('span', { class: 'pdpx-checkout-button-text' }, 'Customize and print it');
  checkoutButton.appendChild(CTAIcon);
  checkoutButton.appendChild(CTAText);
  const checkoutButtonSubhead = createTag('div', { class: 'pdpx-checkout-button-subhead' });
  const checkoutButtonSubheadImage = createTag('img', { class: 'pdpx-checkout-button-subhead-image', src: '/express/code/icons/powered-by-zazzle.svg' });
  const checkoutButtonSubheadLink = createTag('a', { class: 'pdpx-checkout-button-subhead-link', href: 'https://www.zazzle.com/returns' }, 'Returns gauranteed');
  const checkoutButtonSubheadText = createTag('span', { class: 'pdpx-checkout-button-subhead-text' }, 'through 100% satisfaction promise.');
  checkoutButtonSubhead.appendChild(checkoutButtonSubheadImage);
  checkoutButtonSubhead.appendChild(checkoutButtonSubheadLink);
  checkoutButtonSubhead.appendChild(checkoutButtonSubheadText);
  checkoutButtonContainer.appendChild(checkoutButton);
  checkoutButtonContainer.appendChild(checkoutButtonSubhead);
  return checkoutButtonContainer;
}
