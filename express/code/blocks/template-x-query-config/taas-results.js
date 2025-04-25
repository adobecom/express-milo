/* eslint-disable class-methods-use-this */
import { html, LitElement, css } from './lit.min.js';

class TAASResults extends LitElement {
  static styles = css`
    form {
      display: flex;
      flex-direction: column;
    }
  `;

  render() {
    return html`results`;
  }
}

customElements.define('taas-results', TAASResults);
