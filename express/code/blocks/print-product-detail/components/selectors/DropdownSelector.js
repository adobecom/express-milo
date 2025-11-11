import { html } from '../../vendor/htm-preact.js';
import { useStore } from '../store-context.js';

export function DropdownSelector({ attribute }) {
  const { actions } = useStore();
  const { selector, selectedOptionValue, title } = attribute;

  const handleChange = (event) => {
    actions.selectOption(attribute.name, event.target.value);
  };

  return html`
    <div class="pdpx-standard-selector-container">
      <label class="pdpx-standard-selector-label">${title}</label>
      <select
        class="pdpx-standard-selector"
        name="${attribute.name}"
        value="${selectedOptionValue}"
        onChange=${handleChange}
      >
        ${selector.options.map((option) => html`
          <option key="${option.value}" value="${option.value}">
            ${option.title}${option.priceDelta ? ` ${option.priceDelta}` : ''}
          </option>
        `)}
      </select>
      ${selector.message && html`
        <div class="pdpx-standard-selector-message">${selector.message}</div>
      `}
    </div>
  `;
}
