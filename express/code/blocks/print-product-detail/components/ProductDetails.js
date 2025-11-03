import {
  h,
  html as htmlFn,
  useEffect,
  useRef,
} from '../vendor/htm-preact.js';
import { useStore } from './store-context.js';
import axAccordionDecorate from '../../ax-accordion/ax-accordion.js';

const html = htmlFn;

function mapToAccordionFormat(descriptions) {
  if (!descriptions || !Array.isArray(descriptions)) {
    return [];
  }
  return descriptions.map((item) => ({
    title: item.attributeTitle,
    content: item.descriptionHTML,
  }));
}

export function ProductDetails() {
  const { state } = useStore();
  const snapshot = state.value;
  const accordionRef = useRef(null);
  const previousDescriptionsRef = useRef(null);

  useEffect(() => {
    if (!snapshot || !accordionRef.current) {
      return;
    }

    const descriptions = snapshot.descriptionComponents;
    if (!descriptions) {
      return;
    }

    const accordionData = mapToAccordionFormat(descriptions);

    if (!accordionRef.current.accordionData) {
      accordionRef.current.accordionData = accordionData;
      axAccordionDecorate(accordionRef.current);
    } else {
      const previousDescriptions = previousDescriptionsRef.current;
      if (previousDescriptions !== descriptions && accordionRef.current.updateAccordion) {
        let forceExpandTitle = null;
        if (previousDescriptions && Array.isArray(previousDescriptions)) {
          const prevTitles = previousDescriptions.map((entry) => entry.attributeTitle);
          const currentTitles = descriptions.map((entry) => entry.attributeTitle);
          const changedIndex = currentTitles.findIndex((title, index) => prevTitles[index] !== title);
          if (changedIndex >= 0) {
            forceExpandTitle = descriptions[changedIndex].attributeTitle;
          }
        }
        accordionRef.current.updateAccordion(accordionData, forceExpandTitle);
      }
    }

    previousDescriptionsRef.current = descriptions;
  }, [state.value]);

  if (!snapshot) {
    return null;
  }

  return html`
    <div class="pdpx-product-details-section">
      <div class="pdpx-product-details-section-title-container">
        <span class="pdpx-product-details-section-title">Product Details</span>
      </div>
      <div ref=${accordionRef} class="ax-accordion pdpx-product-details-accordion"></div>
    </div>
  `;
}

