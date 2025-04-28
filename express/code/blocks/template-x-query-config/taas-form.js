/* eslint-disable class-methods-use-this */
import { html, LitElement, css } from './lit.min.js';

const supportedLanguages = [
  'ar-SA',
  'cs-CZ',
  'da-DK',
  'de-DE',
  'es-ES',
  'el-GR',
  'en-US',
  'fi-FI',
  'fil-PH',
  'fr-FR',
  'hi-IN',
  'id-ID',
  'it-IT',
  'i-DEFAULT',
  'ja-JP',
  'ko-KR',
  'MS-MY',
  'nb-NO',
  'nl-NL',
  'pl-PL',
  'pt-BR',
  'ro-RO',
  'ru-RU',
  'sv-SE',
  'th-TH',
  'tr-TR',
  'uk-UA',
  'vi-VN',
  'zh-Hant-TW',
  'zh-Hans-CN',
];
const supportedRegions = [];

class TAASForm extends LitElement {
  static properties = {
    collectionId: { type: String },
    limit: { type: Number },
    start: { type: Number },
    q: { type: String },
    language: { type: String },
    tasks: { type: String },
    topics: { type: String },
    license: { type: String },
    prefLang: { type: String },
    prefRegion: { type: String },
  };

  constructor() {
    super();
    this.collectionId = '';
    this.limit = 70;
    this.start = 0;
    this.q = '';
    this.language = '';
    this.tasks = '';
    this.topics = '';
    this.license = '';
    this.prefLang = '';
    this.prefRegion = '';
  }

  static styles = css`
    form {
      display: flex;
      flex-direction: column;
    }
  `;

  handleSubmit(e) {
    const formData = new FormData(e.target);
  }

  render() {
    return html`<form @submit=${this.handleSubmit}>
        <label>
          Collection ID:
          <input
            name="collectionID"
            type="text"
            .value=${this.collectionId}
            .input=${(e) => (this.collectionID = e.target.value)}
          />
        </label>
        <p id="limit-desc">
          <small
            >Optional. Defaults to the global collection (urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418). Another option is the
            popular collection</small
          >
        </p>

        <label>
          Limit:
          <input
            name="limit"
            type="number"
            aria-describedby="limit-desc"
            .value=${this.limit}
            .input=${(e) => (this.limit = Number(e.target.value))}
          />
        </label>
        <p id="limit-desc">
          <small
            >Number of results to return. Leave empty to use the default limit
            (e.g. 10).</small
          >
        </p>

        <label>
          Start:
          <input
            name="start"
            type="number"
            .value=${this.start}
            .input=${(e) => (this.start = Number(e.target.value))}
          />
        </label>

        <fieldset class="form-group">
          <legend>Order by</legend>
          <label
            ><input type="radio" name="order-by" value="relevancy" />
            Default by Relevancy</label
          ><br />
          <label
            ><input type="radio" name="order-by" value="-remixCount" />
            Descending by Remix Count</label
          ><br />
          <label
            ><input type="radio" name="order-by" value="+remixCount" />
            Ascending by Remix Count</label
          ><br />
          <label
            ><input type="radio" name="order-by" value="-createDate" />
            Descending by Create Date (Newest first)</label
          >
          <label
            ><input type="radio" name="order-by" value="+createDate" />
            Descending by Create Date (Oldest first)</label
          >
          <p><small>Select by which method results would be ordered.</small></p>
        </fieldset>

        <label>
          Q:
          <input name="q" type="text" />
        </label>

        <h2>Filters:</h2>
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

        <fieldset class="form-group full-width">
          <legend>Behaviors</legend>
          <label
            ><input type="radio" name="behaviors" value="" /> All
            (Default)</label
          ><br />
          <label
            ><input type="radio" name="behaviors" value="still" /> Still</label
          ><br />
          <label
            ><input type="radio" name="behaviors" value="animated" />
            Animated</label
          ><br />
          <label
            ><input type="radio" name="behaviors" value="video" /> Video</label
          ><br />
          <label
            ><input type="radio" name="behaviors" value="animated,video" />
            Animated + Video</label
          >
          <p>
            <small
              >Select one behavior filter. Choose "All" to include all
              types.</small
            >
          </p>
        </fieldset>

        <fieldset class="form-group full-width">
          <legend>Licensing Category</legend>
          <label
            ><input type="radio" name="licensingCategory" value="" /> Mixed
            (Free and Premium)</label
          ><br />
          <label
            ><input type="radio" name="licensingCategory" value="free" />
            Free</label
          ><br />
          <label
            ><input type="radio" name="licensingCategory" value="premium" />
            Premium</label
          >
          <p>
            <small
              >Select a category to filter results. Choose "Mixed" to include
              both Free and Premium.</small
            >
          </p>
        </fieldset>
        <h2>Boosting:</h2>
        <label>
          Preferred Language Boosting:
          <input name="pref-lang" />
          <p><small>boost templates that are in this language</small></p>
        </label>
        <label>
          Preferred Region Boosting:
          <input name="pref-region" />
          <p>
            <small>boost templates that are in this country</small>
          </p>
        </label>

        <button type="submit">Generate</button>
      </form>
      <div>For authors, copy this identifier:</div>
      <div>
        {collectionIdParam}{qParam}{limitParam}{startParam}{sortParam}{filterStr}
      </div>
      <div>
        For developers debugging, this is the API call:
        <div>
          {base}?{collectionIdParam}{queryParam}{qParam}{limitParam}{startParam}{sortParam}{filterStr}
        </div>
      </div> `;
  }
}

customElements.define('taas-form', TAASForm);
