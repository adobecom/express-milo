/* eslint-disable class-methods-use-this */
import { html, LitElement, css } from './lit.min.js';

class TAASForm extends LitElement {
  static styles = css`
    form {
      display: flex;
      flex-direction: column;
    }
  `;

  handleGenerate(e) {
    const formData = new FormData(e.target);
  }

  render() {
    return html`<form>
      <label>
        Collection ID:
        <input name="collectionID" type="text" />
      </label>

      <label>
        Limit:
        <input name="limit" type="number" aria-describedby="limit-desc" />
      </label>
      <p id="limit-desc">
        <small
          >Number of results to return. Leave empty to use the default limit
          (e.g. 10).</small
        >
      </p>

      <label>
        Start:
        <input name="start" type="number" />
      </label>

      <label>
        Sort:
        <select name="sort">
          <option value="ascending">Ascending by Clicks</option>
          <option value="descending">Descending by Clicks</option>
          <option value="popular">Popular</option>
        </select>
      </label>

      <label>
        Q:
        <input name="q" type="text" />
      </label>

      <label>
        Language:
        <input name="language" type="text" />
      </label>

      <label>
        Tasks:
        <input name="tasks" type="text" />
      </label>

      <label>
        Topics:
        <input name="topics" type="text" />
      </label>

      <fieldset>
        <legend>Behaviors (max 2)</legend>
        <p id="licensing-desc">
          <small>
            Optional field. Leave empty to include all licensing types.<br />
            If selected, must be either <strong>Free</strong> or
            <strong>Premium</strong>.
          </small>
        </p>
        <label
          ><input type="checkbox" name="behaviors" value="animated" />
          Animated</label
        >
        <label
          ><input type="checkbox" name="behaviors" value="video" /> Video</label
        >
        <label
          ><input type="checkbox" name="behaviors" value="still" /> Still</label
        >
        <p id="behavior-error" style="color: red; display: none;">
          Max 2 behaviors allowed.
        </p>
      </fieldset>

      <label for="licensingCategory">Licensing Category:</label>
      <select
        name="licensingCategory"
        id="licensingCategory"
        aria-describedby="licensing-desc"
      >
        <option value="">Mixed (Free and Premium)</option>
        <option value="free">Free</option>
        <option value="premium">Premium</option>
      </select>
      <p id="licensing-desc">
        <small>
          Optional filter. Select <strong>Free</strong> or
          <strong>Premium</strong> to narrow results.<br />
          Leave as <strong>Mixed</strong> to include all licensing types.
        </small>
      </p>

      <button type="submit">Generate</button>
    </form>`;
  }
}

customElements.define('taas-form', TAASForm);
