/* eslint-disable class-methods-use-this */
import { html, LitElement, css } from './lit.min.js';

const base = 'https://www.adobe.com/express-search-api-v3';

class TAASResults extends LitElement {
  static properties = {
    formData: { type: Object },
  };

  static styles = css`
    form {
      display: flex;
    }
  `;

  shouldUpdate(changedProperties) {
    if (changedProperties.has('formData')) {
      const oldData = changedProperties.get('formData');
      const newData = this.formData;
      return JSON.stringify(oldData) !== JSON.stringify(newData);
    }
    return false;
  }

  render() {
    console.log('Form data:', this.formData);
    return html`<div>For authors, copy this identifier:</div>
      <div>
        {collectionIdParam}{qParam}{limitParam}{startParam}{sortParam}{filterStr}
      </div>
      <div>
        For developers debugging, this is the API call:
        <div>
          {base}?{collectionIdParam}{queryParam}{qParam}{limitParam}{startParam}{sortParam}{filterStr}
        </div>
      </div>
      <div>Form data: ${JSON.stringify(this.formData)}</div>`;
  }
}

customElements.define('taas-results', TAASResults);
