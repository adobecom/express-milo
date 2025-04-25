/* eslint-disable class-methods-use-this */
import { html, LitElement, css } from './lit.min.js';
import { getLibs } from '../../scripts/utils.js';
import './taas-form.js';
import './taas-results.js';

let createTag;

class TemplatesAsAService extends LitElement {
  static props = {
    test: {},
    config: {},
  };

  static styles = css`
    #taas-container {
      display: flex;
    }
  `;

  constructor() {
    super();
    this.test = 'testing';
  }

  render() {
    return html`<div id="taas-container">
      <taas-form></taas-form> <taas-results></taas-results>
    </div>`;
  }
}

customElements.define('templates-as-a-service', TemplatesAsAService);

export default async function init(el) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  el.querySelector('div').replaceWith(createTag('templates-as-a-service'));
}
