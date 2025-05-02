/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable class-methods-use-this */
import { html, LitElement, css } from './lit.min.js';
import { getIconElementDeprecated } from '../../scripts/utils.js';

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
    behaviors: { type: String },
    prefLang: { type: String },
    prefRegion: { type: String },
  };

  constructor() {
    super();
    this.collectionId = '';
    this.limit = 70;
    this.start = 0;
    this.q = '';
    this.orderBy = '';
    this.language = '';
    this.tasks = '';
    this.topics = '';
    this.license = '';
    this.behaviors = '';
    this.prefLang = '';
    this.prefRegion = '';
  }

  static styles = css`
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    form label {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .hidden {
      display: none;
    }
    button.info-button {
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
    }
    button[type='submit'] {
      align-self: flex-start;
    }
  `;

  handleSubmit(e) {
    const formData = new FormData(e.target);
  }

  toggleInfoContent(fieldName) {
    const infoContent = this.shadowRoot.querySelector(
      `[data-info-content="${fieldName}"]`
    );
    infoContent.classList?.toggle('hidden');
  }

  getInfo(fieldName, content) {
    const infoButton = html`
      <button
        type="button"
        class="info-button"
        aria-label="Show information for ${fieldName}"
        @click=${() => this.toggleInfoContent(fieldName)}
      >
        ${getIconElementDeprecated('info', 16, fieldName, 'info-icon')}
      </button>
    `;
    const infoContent = html`
      <div
        class="info-content hidden"
        tabindex="0"
        data-info-content="${fieldName}"
      >
        <small>${content}</small>
      </div>
    `;
    return [infoButton, infoContent];
  }

  render() {
    const [collectionInfoButton, collectionInfoContent] = this.getInfo(
      'collectionId',
      'Optional. Defaults to the global collection (urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418). Another common is the popular collection (urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852).'
    );
    const [limitInfoButton, limitInfoContent] = this.getInfo(
      'limit',
      'Number of results to return. Leave empty to use the default limit (e.g. 10).'
    );
    const [startInfoButton, startInfoContent] = this.getInfo(
      'start',
      'Starting index for the results'
    );
    const [orderByInfoButton, orderByInfoContent] = this.getInfo(
      'orderBy',
      'Select by which method results would be ordered'
    );
    const [qInfoButton, qInfoContent] = this.getInfo('q', 'Search query');
    const [languageInfoButton, languageInfoContent] = this.getInfo(
      'language',
      'Filter by language'
    );
    const [tasksInfoButton, tasksInfoContent] = this.getInfo(
      'tasks',
      'Filter by tasks'
    );
    const [topicsInfoButton, topicsInfoContent] = this.getInfo(
      'topics',
      'Filter by topics'
    );
    const [licenseInfoButton, licenseInfoContent] = this.getInfo(
      'license',
      'Filter by license'
    );
    const [behaviorsInfoButton, behaviorsInfoContent] = this.getInfo(
      'behaviors',
      'Filter by behaviors'
    );
    const [prefLangInfoButton, prefLangInfoContent] = this.getInfo(
      'prefLang',
      'Boost templates that are in this language'
    );
    const [prefRegionInfoButton, prefRegionInfoContent] = this.getInfo(
      'prefRegion',
      'Boost templates that are in this country'
    );

    return html`<form @submit=${this.handleSubmit}>
        <label>
          Q:
          <input name="q" type="text" />
          ${qInfoButton}
        </label>
        ${qInfoContent}

        <label>
          Collection ID:
          <input
            name="collectionID"
            type="text"
            title="Optional. Defaults to the global collection (urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418). Another common is the popular collection (urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852)."
            .value=${this.collectionId}
            .input=${(e) => (this.collectionID = e.target.value)}
          />
          ${collectionInfoButton}
        </label>
        ${collectionInfoContent}

        <label>
          Limit:
          <input
            name="limit"
            type="number"
            .value=${this.limit}
            .input=${(e) => (this.limit = Number(e.target.value))}
          />
          ${limitInfoButton}
        </label>
        ${limitInfoContent}

        <label>
          Start:
          <input
            name="start"
            type="number"
            .value=${this.start}
            .input=${(e) => (this.start = Number(e.target.value))}
          />
          ${startInfoButton}
        </label>
        ${startInfoContent}

        <label>
          Order by:
          <select
            name="order-by"
            @change=${(e) => (this.orderBy = e.target.value)}
          >
            <option value="">Relevancy (Default)</option>
            <option value="-remixCount">Descending by Remix Count</option>
            <option value="+remixCount">Ascending by Remix Count</option>
            <option value="-createDate">
              Descending by Create Date (Newest first)
            </option>
            <option value="+createDate">
              Ascending by Create Date (Oldest first)
            </option>
          </select>
          ${orderByInfoButton}
        </label>
        ${orderByInfoContent}

        <h2>Filters:</h2>
        <label>
          Language:
          <input name="language" type="text" />
          ${languageInfoButton}
        </label>
        ${languageInfoContent}

        <label>
          Tasks:
          <input name="tasks" type="text" />
          ${tasksInfoButton}
        </label>
        ${tasksInfoContent}

        <label>
          Topics:
          <input name="topics" type="text" />
          ${topicsInfoButton}
        </label>
        ${topicsInfoContent}

        <label>
          Behaviors:
          <select
            name="behaviors"
            @change=${(e) => (this.behaviors = e.target.value)}
          >
            <option value="">All (Default)</option>
            <option value="still">Still</option>
            <option value="animated">Animated</option>
            <option value="video">Video</option>
            <option value="animated+video">Animated + Video</option>
          </select>
          ${behaviorsInfoButton}
        </label>
        ${behaviorsInfoContent}

        <label>
          Licensing Category:
          <select
            name="license"
            @change=${(e) => (this.license = e.target.value)}
          >
            <option value="">Mixed (Default)</option>
            <option value="free">Free only</option>
            <option value="premium">Premium only</option>
          </select>
          ${licenseInfoButton}
        </label>
        ${licenseInfoContent}

        <h2>Boosting:</h2>
        <label>
          Preferred Language Boosting:
          <input name="pref-lang" />
          ${prefLangInfoButton}
        </label>
        ${prefLangInfoContent}
        <label>
          Preferred Region Boosting:
          <input name="pref-region" />
          ${prefRegionInfoButton}
        </label>
        ${prefRegionInfoContent}

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
