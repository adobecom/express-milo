/* eslint-disable class-methods-use-this */
import { html, LitElement, css } from './lit.min.js';
import { getLibs } from '../../scripts/utils.js';
import './taas-form.js';
import './taas-results.js';

let createTag;

class TemplatesAsAService extends LitElement {
  static properties = {
    recipe: { type: String },
  };

  static styles = css`
    #taas-container {
      display: flex;
    }
  `;

  constructor() {
    super();
    this.recipe = null;
  }

  handleGenerateRecipe(e) {
    this.recipe = e.detail;
  }

  render() {
    return html`<div id="taas-container">
      <taas-form @taas-generate-recipe=${this.handleGenerateRecipe}></taas-form>
      <taas-results .recipe=${this.recipe}></taas-results>
    </div>`;
  }
}

customElements.define('templates-as-a-service', TemplatesAsAService);

export default async function init(el) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  el.querySelector('div').replaceWith(createTag('templates-as-a-service'));
}
