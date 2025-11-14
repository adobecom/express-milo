import {
  html,
  useEffect,
  useRef,
  Fragment,
} from '../../../scripts/vendors/htm-preact.js';
import { StoreProvider, useStore, DrawerProvider, useDrawer } from './Contexts.js';
import { ProductImages, ProductDetails, ProductHeader, CheckoutButton } from './ProductComponents.js';
import { CustomizationInputs } from './CustomizationInputs.js';
import Drawer from './Drawer.js';
import useSeo from './useSeo.js';

function LoadingSkeleton() {
  return html`
    <div class="pdpx-global-container">
      <div class="pdpx-product-images-container">
        <div class="pdpx-product-hero-image-container" data-skeleton="true" style="height: 400px;"></div>
      </div>
      <div class="pdpx-product-info-section-wrapper-container">
        <div class="pdpx-product-info-heading-section-container">
          <h1 class="pdpx-product-title" data-skeleton="true" style="height: 32px; width: 60%;"></h1>
          <div class="pdpx-price-info-container" data-skeleton="true" style="height: 40px; width: 40%; margin-top: 16px;"></div>
        </div>
        <div class="pdpx-product-info-section-wrapper">
          <div class="pdpx-customization-inputs-container" data-skeleton="true" style="height: 300px; margin-top: 24px;"></div>
        </div>
      </div>
    </div>
  `;
}

function PDPContent({ templateId }) {
  const store = useStore();
  const { state, actions } = store;
  const { openDrawer } = useDrawer();
  const lastFetchedTemplateIdRef = useRef(null);

  useSeo(templateId);

  useEffect(() => {
    if (!templateId || lastFetchedTemplateIdRef.current === templateId) {
      return;
    }
    lastFetchedTemplateIdRef.current = templateId;
    actions.fetchProduct(templateId);
  }, [templateId, actions]);

  const handleDrawerRequest = (request) => {
    if (!request) {
      return;
    }
    if (request.type === 'sizeChart') {
      openDrawer({ type: 'sizeChart', payload: request.payload });
    }
  };

  if (!state) {
    return html`
      <${Fragment}>
        <${LoadingSkeleton} />
        <${Drawer} />
      </${Fragment}>
    `;
  }

  return html`
    <${Fragment}>
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
    </${Fragment}>
  `;
}

export default function PDPApp({ sdkStore, templateId }) {
  return html`
    <${StoreProvider} sdkStore=${sdkStore}>
      <${DrawerProvider}>
        <${PDPContent} templateId=${templateId} />
      </${DrawerProvider}>
    </${StoreProvider}>
  `;
}
