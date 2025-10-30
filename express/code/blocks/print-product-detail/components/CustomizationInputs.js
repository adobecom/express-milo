import { h } from 'https://esm.sh/preact@10';
import { useState } from 'https://esm.sh/preact@10/hooks';
import htm from 'https://esm.sh/htm@3';
import { ThumbnailSelector } from './selectors/ThumbnailSelector.js';
import { DropdownSelector } from './selectors/DropdownSelector.js';
import { RadioSelector } from './selectors/RadioSelector.js';
import { CheckboxSelector } from './selectors/CheckboxSelector.js';
import { QuantitySelector } from './selectors/QuantitySelector.js';

const html = htm.bind(h);

/**
 * Render an individual attribute based on its selector type
 */
function renderAttribute(attribute, store) {
  const { selector } = attribute;
  
  switch (selector.type) {
    case 'thumbnails':
      return html`<${ThumbnailSelector} attribute=${attribute} store=${store} />`;
    case 'dropdown':
      return html`<${DropdownSelector} attribute=${attribute} store=${store} />`;
    case 'radio':
      return html`<${RadioSelector} attribute=${attribute} store=${store} />`;
    case 'checkbox':
      return html`<${CheckboxSelector} attribute=${attribute} store=${store} />`;
    default:
      return null;
  }
}

/**
 * Customization inputs component rendering all product attributes
 * @param {Object} props
 * @param {Object} props.state - PDP state from SDK
 * @param {Object} props.store - Zazzle PDP store instance
 */
export function CustomizationInputs({ state, store }) {
  const { attributes, quantityOptions, quantity } = state;
  
  // Filter out quantity attribute as it's handled separately
  const productAttributes = attributes.filter(attr => attr.name !== 'quantity');
  
  return html`
    <div class="pdpx-customization-inputs-container" id="pdpx-customization-inputs-container">
      <form class="pdpx-customization-inputs-form" id="pdpx-customization-inputs-form">
        ${productAttributes.map(attribute => html`
          <div key="${attribute.name}">
            ${renderAttribute(attribute, store)}
          </div>
        `)}
        <${QuantitySelector} state=${state} store=${store} />
      </form>
    </div>
  `;
}
