import { h } from 'https://esm.sh/preact@10';
import htm from 'https://esm.sh/htm@3';

const html = htm.bind(h);

/**
 * Quantity selector component
 * @param {Object} props
 * @param {Object} props.state - PDP state from SDK
 * @param {Object} props.store - Zazzle PDP store instance
 */
export function QuantitySelector({ state, store }) {
  const { quantity, quantityOptions } = state;
  
  const handleChange = (e) => {
    if (store) {
      const newQuantity = parseInt(e.target.value, 10);
      store.selectQuantity(newQuantity);
    }
  };
  
  return html`
    <div class="pdpx-standard-selector-container">
      <label class="pdpx-standard-selector-label">Quantity</label>
      <select
        class="pdpx-standard-selector"
        name="qty"
        value="${quantity}"
        onChange=${handleChange}
      >
        ${quantityOptions.map(opt => html`
          <option key="${opt.quantity}" value="${opt.quantity}">
            ${opt.label}${opt.discount ? ` (Save ${opt.discount})` : ''}
          </option>
        `)}
      </select>
    </div>
  `;
}
