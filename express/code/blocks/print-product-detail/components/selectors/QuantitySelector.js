import { h, html as htmlFn } from '../../vendor/htm-preact.js';
import { useStore } from '../store-context.js';

const html = htmlFn;

export function QuantitySelector() {
  const { state, actions } = useStore();
  const snapshot = state.value;

  if (!snapshot) {
    return null;
  }

  const { quantity, quantityOptions } = snapshot;

  const handleChange = (event) => {
    const nextQuantity = parseInt(event.target.value, 10);
    actions.selectQuantity(nextQuantity);
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
        ${quantityOptions.map((option) => html`
          <option key="${option.quantity}" value="${option.quantity}">
            ${option.label}${option.discount ? ` (Save ${option.discount})` : ''}
          </option>
        `)}
      </select>
    </div>
  `;
}

