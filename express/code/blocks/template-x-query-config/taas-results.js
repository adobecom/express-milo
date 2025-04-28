/* eslint-disable class-methods-use-this */
import { html, LitElement, css } from './lit.min.js';

const base = 'https://www.adobe.com/express-search-api-v3';
class TAASResults extends LitElement {
  static styles = css`
    form {
      display: flex;
    }
  `;

  render() {
    return html`results`;
  }
}

customElements.define('taas-results', TAASResults);
