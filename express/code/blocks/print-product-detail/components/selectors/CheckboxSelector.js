import { html } from '../../vendor/htm-preact.js';
import { useStore } from '../store-context.js';

export function CheckboxSelector({ attribute }) {
  const { actions } = useStore();
  const { selector, selectedOptionValue, name, title } = attribute;
  const isChecked = selectedOptionValue === selector.checkedValue;

  const handleChange = () => {
    const nextValue = isChecked ? selector.uncheckedValue : selector.checkedValue;
    actions.selectOption(name, nextValue);
  };

  return html`
    <div class="pdpx-standard-selector-container">
      <label>
        <input
          type="checkbox"
          name="${name}"
          checked="${isChecked}"
          onChange=${handleChange}
        />
        <span>${selector.title}${selector.priceDelta ? ` ${selector.priceDelta}` : ''}</span>
      </label>
    </div>
  `;
}
