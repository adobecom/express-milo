/* eslint-disable class-methods-use-this */
import { html, LitElement, css } from './lit.min.js';
import { getLibs } from '../../scripts/utils.js';
import './recipe-editor.js';
import './taas-results.js';

let createTag;

class TemplatesAsAService extends LitElement {
  static properties = {
    recipe: { type: String },
  };

  static styles = css`
    @media (min-width: 1024px) {
      #templates-as-a-service {
        display: flex;
        gap: 1rem;
        padding: 1rem;
      }
    }
  `;

  constructor() {
    super();
    this.recipe = '';
  }

  handleRecipeChanged(e) {
    this.recipe = e.detail;
  }

  render() {
    return html`
    <div id="templates-as-a-service">
      <recipe-editor
        .recipe=${this.recipe}
        @recipe-changed=${this.handleRecipeChanged}
      ></recipe-editor>
      <taas-results .recipe=${this.recipe}></taas-results>
    </div>
    `;
  }
}

customElements.define('templates-as-a-service', TemplatesAsAService);

export default async function init(el) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  el.querySelector('div').replaceWith(createTag('templates-as-a-service'));
}
