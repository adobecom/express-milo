import {
  html,
  useEffect,
  useRef,
} from '../vendor/htm-preact.js';
import { StoreContext, useStore } from './store-context.js';
import { DrawerProvider, useDrawer } from './drawer-context.js';
import { LoadingSkeleton } from './LoadingSkeleton.js';
import { ProductImages } from './ProductImages.js';
import { ProductHeader } from './ProductHeader.js';
import { CustomizationInputs } from './CustomizationInputs.js';
import { ProductDetails } from './ProductDetails.js';
import { CheckoutButton } from './CheckoutButton.js';
import { Drawer } from './Drawer.js';
import { useSeo } from './useSeo.js';

function PDPContent({ templateId }) {
  const store = useStore();
  const { state, actions, hasState } = store;
  const { openDrawer } = useDrawer();
  const lastFetchedTemplateIdRef = useRef(null);

  useSeo(templateId);

  useEffect(() => {
    if (!templateId) {
      return;
    }
    if (lastFetchedTemplateIdRef.current === templateId && state.value) {
      return;
    }
    lastFetchedTemplateIdRef.current = templateId;
    actions.fetchProduct(templateId);
  }, [templateId, actions, state.value]);

  const handleDrawerRequest = (request) => {
    if (!request) {
      return;
    }
    if (request.type === 'sizeChart') {
      openDrawer({ type: 'sizeChart', payload: request.payload });
    }
  };

  if (!hasState.value || !state.value) {
    return html`
      <>
        <${LoadingSkeleton} />
        <${Drawer} />
      </>
    `;
  }

  return html`
    <>
      <div class="pdpx-global-container" data-template-id="${templateId}">
        <${ProductImages} />
        <div class="pdpx-product-info-section-wrapper-container">
          <${ProductHeader} />
          <div class="pdpx-product-info-section-wrapper">
            <div class="pdpx-product-info-container" id="pdpx-product-info-container">
              <${CustomizationInputs} onRequestDrawer=${handleDrawerRequest} />
              <${ProductDetails} />
            </div>
            <${CheckoutButton} templateId=${templateId} />
          </div>
        </div>
      </div>
      <${Drawer} />
    </>
  `;
}

export function PDPApp({ store, templateId }) {
  return html`
    <${StoreContext.Provider} value=${store}>
      <${DrawerProvider}>
        <${PDPContent} templateId=${templateId} />
      </${DrawerProvider}>
    </${StoreContext.Provider}>
  `;
}

