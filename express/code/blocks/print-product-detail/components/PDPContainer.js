import { h } from 'https://esm.sh/preact@10';
import { useEffect, useState } from 'https://esm.sh/preact@10/hooks';
import htm from 'https://esm.sh/htm@3';
import { getZazzleStore } from '../store/store-manager.js';
import { LoadingSkeleton } from './LoadingSkeleton.js';
import { ProductHeader } from './ProductHeader.js';
import { ProductImages } from './ProductImages.js';
import { CustomizationInputs } from './CustomizationInputs.js';
import { ProductDetails } from './ProductDetails.js';
import { CheckoutButton } from './CheckoutButton.js';

const html = htm.bind(h);

/**
 * Main PDP container component that manages SDK store and renders all child components
 * @param {Object} props
 * @param {string} props.templateId - The template ID to fetch product data for
 */
export function PDPContainer({ templateId }) {
  const [store, setStore] = useState(null);
  const [storeReady, setStoreReady] = useState(false);
  const [pdpState, setPdpState] = useState(null);
  
  // Initialize store on mount
  useEffect(() => {
    getZazzleStore().then((s) => {
      setStore(s);
      setStoreReady(true);
      // Get initial state
      setPdpState(s.getSnapshot());
    });
  }, []);
  
  // Subscribe to store changes (manual implementation of useSyncExternalStore pattern)
  useEffect(() => {
    if (!store) return;
    
    // Update state whenever store changes
    const updateState = () => {
      setPdpState(store.getSnapshot());
    };
    
    // Subscribe to changes
    const unsubscribe = store.subscribe(updateState);
    
    // Ensure we have the latest state
    updateState();
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [store]);
  
  // Fetch product on mount
  useEffect(() => {
    if (store && templateId && !pdpState) {
      store.fetchProduct(templateId);
    }
  }, [templateId, store, pdpState]);
  
  if (!storeReady || !pdpState) {
    return html`<${LoadingSkeleton} />`;
  }
  
  return html`
    <div class="pdpx-global-container" data-template-id="${templateId}">
      <${ProductImages} state=${pdpState} store=${store} />
      <div class="pdpx-product-info-section-wrapper-container">
        <${ProductHeader} state=${pdpState} />
        <div class="pdpx-product-info-section-wrapper">
          <div class="pdpx-product-info-container" id="pdpx-product-info-container">
            <${CustomizationInputs} state=${pdpState} store=${store} />
            <${ProductDetails} state=${pdpState} />
          </div>
          <${CheckoutButton} state=${pdpState} templateId=${templateId} />
        </div>
      </div>
    </div>
  `;
}
