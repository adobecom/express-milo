import { html } from '../../../scripts/vendors/htm-preact.js';
import { useStore } from './store-context.js';
import { ThumbnailSelector } from './selectors/ThumbnailSelector.js';
import { DropdownSelector } from './selectors/DropdownSelector.js';
import { RadioSelector } from './selectors/RadioSelector.js';
import { CheckboxSelector } from './selectors/CheckboxSelector.js';
import { QuantitySelector } from './selectors/QuantitySelector.js';

function renderAttribute(attribute, onRequestDrawer) {
  switch (attribute.selector.type) {
    case 'thumbnails':
      return html`<${ThumbnailSelector} attribute=${attribute} onRequestDrawer=${onRequestDrawer} />`;
    case 'dropdown':
      return html`<${DropdownSelector} attribute=${attribute} />`;
    case 'radio':
      return html`<${RadioSelector} attribute=${attribute} />`;
    case 'checkbox':
      return html`<${CheckboxSelector} attribute=${attribute} />`;
    default:
      return null;
  }
}

export function CustomizationInputs({ onRequestDrawer }) {
  const { state } = useStore();

  if (!state) {
    return null;
  }

  const productAttributes = (state.attributes || []).filter((attribute) => attribute.name !== 'quantity');

  return html`
    <div class="pdpx-customization-inputs-container" id="pdpx-customization-inputs-container">
      <form class="pdpx-customization-inputs-form" id="pdpx-customization-inputs-form">
        ${productAttributes.map((attribute) => html`
          <div key="${attribute.name}">
            ${renderAttribute(attribute, onRequestDrawer)}
          </div>
        `)}
        <${QuantitySelector} />
      </form>
    </div>
  `;
}
