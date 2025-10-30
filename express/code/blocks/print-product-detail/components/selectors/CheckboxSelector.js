import { h } from 'https://esm.sh/preact@10';
import htm from 'https://esm.sh/htm@3';

const html = htm.bind(h);

/**
 * Checkbox selector component for attributes
 * @param {Object} props
 * @param {Object} props.attribute - Attribute data from SDK state
 * @param {Object} props.store - Zazzle PDP store instance
 */
export function CheckboxSelector({ attribute, store }) {
  const { selector, selectedOptionValue, name, title } = attribute;
  
  const isChecked = selectedOptionValue === selector.checkedValue;
  
  const handleChange = () => {
    if (store) {
      const newValue = isChecked ? selector.uncheckedValue : selector.checkedValue;
      store.selectOption(name, newValue);
    }
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
