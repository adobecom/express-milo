import { h } from 'https://esm.sh/preact@10';
import htm from 'https://esm.sh/htm@3';

const html = htm.bind(h);

/**
 * Radio button selector component for attributes
 * @param {Object} props
 * @param {Object} props.attribute - Attribute data from SDK state
 * @param {Object} props.store - Zazzle PDP store instance
 */
export function RadioSelector({ attribute, store }) {
  const { selector, selectedOptionValue, name, title } = attribute;
  
  const handleChange = (value) => {
    if (store && value !== selectedOptionValue) {
      store.selectOption(name, value);
    }
  };
  
  return html`
    <div class="pdpx-standard-selector-container">
      <label class="pdpx-standard-selector-label">${title}</label>
      <div class="pdpx-radio-selector-options">
        ${selector.options.map(opt => html`
          <label key="${opt.value}">
            <input
              type="radio"
              name="${name}"
              value="${opt.value}"
              checked="${opt.value === selectedOptionValue}"
              onChange=${() => handleChange(opt.value)}
            />
            <span>${opt.title}${opt.priceDelta ? ` ${opt.priceDelta}` : ''}</span>
          </label>
        `)}
      </div>
    </div>
  `;
}
