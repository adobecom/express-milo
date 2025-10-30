import { h } from 'https://esm.sh/preact@10';
import { useEffect, useRef } from 'https://esm.sh/preact@10/hooks';
import htm from 'https://esm.sh/htm@3';
import axAccordionDecorate from '../../ax-accordion/ax-accordion.js';

const html = htm.bind(h);

/**
 * Map description components to accordion format
 */
function mapToAccordionFormat(descriptions) {
  if (!descriptions || !Array.isArray(descriptions)) return [];
  return descriptions.map(item => ({
    title: item.attributeTitle,
    content: item.descriptionHTML,
  }));
}

/**
 * Product details accordion component
 * @param {Object} props
 * @param {Object} props.state - PDP state from SDK
 */
export function ProductDetails({ state }) {
  const accordionRef = useRef(null);
  const previousDescriptionsRef = useRef(null);
  
  useEffect(() => {
    if (accordionRef.current && state.descriptionComponents) {
      const accordionData = mapToAccordionFormat(state.descriptionComponents);
      
      // Initialize accordion if not already done
      if (!accordionRef.current.accordionData) {
        accordionRef.current.accordionData = accordionData;
        axAccordionDecorate(accordionRef.current);
      } else {
        // Update accordion when descriptions change
        const prevDescriptions = previousDescriptionsRef.current;
        if (prevDescriptions !== state.descriptionComponents) {
          const mappedData = mapToAccordionFormat(state.descriptionComponents);
          
          // Determine which field changed to auto-expand
          let forceExpandTitle = null;
          if (prevDescriptions && Array.isArray(prevDescriptions)) {
            // Simple heuristic: find the first changed description
            const prevTitles = prevDescriptions.map(d => d.attributeTitle);
            const currentTitles = state.descriptionComponents.map(d => d.attributeTitle);
            const changedIndex = currentTitles.findIndex((title, idx) => 
              !prevTitles[idx] || title !== prevTitles[idx]
            );
            if (changedIndex >= 0) {
              forceExpandTitle = state.descriptionComponents[changedIndex].attributeTitle;
            }
          }
          
          if (accordionRef.current.updateAccordion) {
            accordionRef.current.updateAccordion(mappedData, forceExpandTitle);
          }
        }
      }
      
      previousDescriptionsRef.current = state.descriptionComponents;
    }
  }, [state.descriptionComponents]);
  
  return html`
    <div class="pdpx-product-details-section">
      <div class="pdpx-product-details-section-title-container">
        <span class="pdpx-product-details-section-title">Product Details</span>
      </div>
      <div 
        ref=${accordionRef}
        class="ax-accordion pdpx-product-details-accordion"
      ></div>
    </div>
  `;
}
