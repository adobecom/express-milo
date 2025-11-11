import { html as htmlFn } from '../../vendor/htm-preact.js';
import { useStore } from '../store-context.js';

const html = htmlFn;

export function RadioSelector({ attribute }) {
  const { actions } = useStore();
  const { selector, selectedOptionValue, name, title } = attribute;

  const handleChange = (value) => {
    if (value !== selectedOptionValue) {
      actions.selectOption(name, value);
    }
  };

  return html`
    <div class="pdpx-standard-selector-container">
      <label class="pdpx-standard-selector-label">${title}</label>
      <div class="pdpx-radio-selector-options">
        ${selector.options.map((option) => html`
          <label key="${option.value}">
            <input
              type="radio"
              name="${name}"
              value="${option.value}"
              checked="${option.value === selectedOptionValue}"
              onChange=${() => handleChange(option.value)}
            />
            <span>${option.title}${option.priceDelta ? ` ${option.priceDelta}` : ''}</span>
          </label>
        `)}
      </div>
    </div>
  `;
}

