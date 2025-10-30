import { h } from 'https://esm.sh/preact@10';
import { useEffect, useRef } from 'https://esm.sh/preact@10/hooks';
import htm from 'https://esm.sh/htm@3';

const html = htm.bind(h);

/**
 * Build checkout button URL with product settings
 * @param {string} templateId - Template ID
 * @param {string} expressProductSettings - Product settings string from SDK
 * @returns {string} Complete checkout URL
 */
function buildCheckoutUrl(templateId, expressProductSettings) {
  const baseUrl = `https://new.express.adobe.com/design/template/${templateId}`;
  const params = new URLSearchParams();
  
  params.set('productSettings', expressProductSettings);
  params.set('action', 'print-null-now');
  params.set('loadPrintAddon', 'true');
  params.set('mv', '1');
  params.set('referrer', 'a.com-print-and-deliver-seo');
  params.set('sdid', 'MH16S6M4');
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Checkout button component
 * @param {Object} props
 * @param {Object} props.state - PDP state from SDK
 * @param {string} props.templateId - Template ID
 */
export function CheckoutButton({ state, templateId }) {
  const buttonRef = useRef(null);
  
  useEffect(() => {
    if (buttonRef.current && state.expressProductSettings) {
      const url = buildCheckoutUrl(templateId, state.expressProductSettings);
      buttonRef.current.href = url;
    }
  }, [state.expressProductSettings, templateId]);
  
  return html`
    <div class="pdpx-checkout-button-container">
      <a 
        ref=${buttonRef}
        class="pdpx-checkout-button" 
        id="pdpx-checkout-button"
        href="${state.expressProductSettings ? buildCheckoutUrl(templateId, state.expressProductSettings) : '#'}"
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
