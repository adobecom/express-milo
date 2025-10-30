import { h } from 'https://esm.sh/preact@10';
import htm from 'https://esm.sh/htm@3';

const html = htm.bind(h);

/**
 * Dropdown selector component for attributes
 * @param {Object} props
 * @param {Object} props.attribute - Attribute data from SDK state
 * @param {Object} props.store - Zazzle PDP store instance
 */
export function DropdownSelector({ attribute, store }) {
  const { selector, selectedOptionValue, title } = attribute;
  
  const handleChange = (e) => {
    if (store) {
      store.selectOption(attribute.name, e.target.value);
    }
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
        ${selector.options.map(opt => html`
          <option key="${opt.value}" value="${opt.value}">
            ${opt.title}${opt.priceDelta ? ` ${opt.priceDelta}` : ''}
          </option>
        `)}
      </select>
      ${selector.message && html`
        <div class="pdpx-standard-selector-message">${selector.message}</div>
      `}
    </div>
  `;
}
