import {
  html,
  useEffect,
  useRef,
} from '../../../scripts/vendors/htm-preact.js';
import { useStore } from './store-context.js';

const TASK_ID_MAP = {
  zazzle_shirt: 'tshirt',
  zazzle_businesscard: 'businesscard',
};

function buildCheckoutUrl(templateId, expressProductSettings, productType) {
  const taskId = TASK_ID_MAP[productType] || '';
  const baseUrl = `https://new.express.adobe.com/design/template/${templateId}`;
  const params = new URLSearchParams({
    productSettings: expressProductSettings,
    category: 'templates',
    taskId,
    loadPrintAddon: 'true',
    print: 'true',
    action: 'pdp-cta',
    source: 'a.com-print-and-deliver-seo',
    mv: 'other',
    url: 'express/print',
  });
  return `${baseUrl}?${params.toString()}`;
}

export function CheckoutButton({ templateId }) {
  const { state } = useStore();
  const anchorRef = useRef(null);

  useEffect(() => {
    if (!anchorRef.current || !state?.expressProductSettings) {
      return;
    }
    anchorRef.current.href = buildCheckoutUrl(templateId, state.expressProductSettings, state.productType);
  }, [state?.expressProductSettings, state?.productType, templateId]);

  return html`
    <div class="pdpx-checkout-button-container">
      <a
        ref=${anchorRef}
        class="pdpx-checkout-button"
        id="pdpx-checkout-button"
        href="${state?.expressProductSettings ? buildCheckoutUrl(templateId, state.expressProductSettings, state.productType) : '#'}"
      >
        <img class="pdpx-checkout-button-icon" src="/express/code/icons/print-icon.svg" alt="print" />
        <span class="pdpx-checkout-button-text">Customize and print it</span>
      </a>
      <div class="pdpx-checkout-button-subhead">
        <img class="pdpx-checkout-button-subhead-image" src="/express/code/icons/powered-by-zazzle.svg" alt="powered by zazzle" />
        <a class="pdpx-checkout-button-subhead-link" href="https://www.zazzle.com/returns">Returns guaranteed</a>
        <span class="pdpx-checkout-button-subhead-text">through 100% satisfaction promise.</span>
      </div>
    </div>
  `;
}
