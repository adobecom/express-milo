/* eslint-disable operator-linebreak */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable class-methods-use-this */
import { html, LitElement, css } from './lit.min.js';
import { getIconElementDeprecated } from '../../scripts/utils.js';

export const defaultCollectionId =
  'urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418';
export const popularCollectionId = 
  'urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852';

class RecipeEditor extends LitElement {
  static properties = {
    collection: { type: String },
    collectionId: { type: String },
    limit: { type: Number },
    start: { type: Number },
    orderBy: { type: String },
    q: { type: String },
    language: { type: String },
    tasks: { type: String },
    topics: { type: String },
    license: { type: String },
    behaviors: { type: String },
    prefLang: { type: String },
    prefRegion: { type: String },
    recipe: { type: String },
  };

  constructor() {
    super();
    this.collection = 'default';
    this.collectionId = '';
    this.limit = 10;
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
    this.recipe = '';
  }

  notifyRecipeChanged() {
    this.dispatchEvent(
      new CustomEvent('recipe-changed', {
        detail: this.recipe,
        bubbles: true,
        composed: true,
      })
    );
  }

  firstUpdated() {
    this.form2Recipe();
    this.notifyRecipeChanged();
  }

  handleFieldChange(e) {
    const { name, value, type } = e.target;
    if (name === 'recipe') {
      this.recipe = value;
      this.recipe2Form();
    } else {
      this[name] = type === 'number' ? Number(value) : value;
      this.form2Recipe();
    }
    this.notifyRecipeChanged();

    if (name === 'collectionId' || name === 'collection') {
      const collectionIdInput = this.shadowRoot.querySelector('input[name="collectionId"]');
      const errorMessage = this.shadowRoot.querySelector('.collection-id-error');
      if (this.collection === 'custom' && !this.collectionId) {
        collectionIdInput.setCustomValidity('Collection ID is required when using a custom collection');
        if (errorMessage) errorMessage.classList.remove('hidden');
      } else {
        collectionIdInput.setCustomValidity('');
        if (errorMessage) errorMessage.classList.add('hidden');
      }
    }
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      border: 1px solid #ccc;
      padding: 1rem;
      border-radius: 0.5rem;
      max-width: 30vw;
      min-width: 340px;
      font-family: 'Adobe Clean', sans-serif;
      font-size: 1rem;
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

    h2,
    h3,
    h4 {
      margin: 0px;
      font-family: 'Adobe Clean', sans-serif;
    }

    h4 {
      padding-top: 1rem;
    }

    .copied {
      position: absolute;
      top: -25px;
      left: 60px;
      background-color: #000;
      color: #fff;
      padding: 10px;
      border-radius: 5px;
    }

    .copy-button-container {
      position: relative;
    }

    .recipe {
      display: flex;
      flex-direction: column;
      gap: 10px;
      border: 1px solid #ccc;
      padding: 1rem;
      border-radius: 0.5rem;
      max-width: 30vw;
      min-width: 340px;
    }

    textarea[name='recipe'] {
      padding: 0.5rem;
      min-height: 100px;
      font-family: 'Adobe Clean', sans-serif;
      font-size: 1rem;
      line-height: 1.5;
      word-break: break-all;
      max-width: calc(100% - 1rem);
    }
    input {
      font-size: 1rem;
    }

    input:invalid {
      border: 1px solid red;
    }

    .error-message {
      color: red;
      font-size: 0.8rem;
      margin-top: -5px;
      margin-left: 10px;
    }
  `;

  form2Recipe() {
    const collection = this.collection === 'custom' ? '' : `collection=${this.collection}`;
    const collectionId = this.collection === 'custom' ? `collectionId=${this.collectionId}` : '';
    const limit = this.limit ? `limit=${this.limit}` : '';
    const start = this.start ? `start=${this.start}` : '';
    const q = this.q ? `q=${this.q}` : '';
    const language = this.language ? `language=${this.language}` : '';
    const tasks = this.tasks ? `tasks=${this.tasks}` : '';
    const topics = this.topics ? `topics=${this.topics}` : '';
    const license = this.license ? `license=${this.license}` : '';
    const behaviors = this.behaviors ? `behaviors=${this.behaviors}` : '';
    const orderBy = this.orderBy ? `orderBy=${this.orderBy}` : '';
    const prefLang = this.prefLang ? `prefLang=${this.prefLang}` : '';
    const prefRegion = this.prefRegion ? `prefRegion=${this.prefRegion}` : '';
    const recipe = [
      q,
      topics,
      tasks,
      language,
      license,
      behaviors,
      orderBy,
      limit,
      collection,
      collectionId,
      prefLang,
      prefRegion,
      start,
    ]
      .filter(Boolean)
      .join('&');
    this.recipe = recipe;
  }

  recipe2Form() {
    const params = new URLSearchParams(this.recipe);
    if (params.has('collectionId')) {
      if (params.get('collectionId') === defaultCollectionId) {
        this.collection = 'default';
        this.collectionId = '';
      } else if (params.get('collectionId') === popularCollectionId) {
        this.collection = 'popular';
        this.collectionId = '';
      } else {
        this.collection = 'custom';
      }
    } else if (params.has('collection') && ['default', 'popular'].includes(params.get('collection'))) {
      this.collection = params.get('collection');
      this.collectionId = '';
    } else {
      this.collection = 'default';
      this.collectionId = '';
    }
    if (params.has('limit')) {
      this.limit = params.get('limit');
    }
    if (params.has('start')) {
      this.start = params.get('start');
    }
    if (params.has('orderBy')) {
      this.orderBy = params.get('orderBy');
    }
    if (params.has('q')) {
      this.q = params.get('q');
    }
    if (params.has('language')) {
      this.language = params.get('language');
    }
    if (params.has('tasks')) {
      this.tasks = params.get('tasks');
    }
    if (params.has('topics')) {
      this.topics = params.get('topics');
    }
    if (params.has('license')) {
      this.license = params.get('license');
    }
    if (params.has('behaviors')) {
      this.behaviors = params.get('behaviors');
    }
    if (params.has('prefLang')) {
      this.prefLang = params.get('prefLang');
    }
    if (params.has('prefRegion')) {
      this.prefRegion = params.get('prefRegion').toUpperCase();
    }
    return params;
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

  copyRecipe() {
    navigator.clipboard.writeText(this.recipe);
    this.shadowRoot.querySelector('.copied').classList.remove('hidden');
    setTimeout(() => {
      this.shadowRoot.querySelector('.copied').classList.add('hidden');
    }, 2000);
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('recipe') && this.recipe) {
      // Only update form if recipe changed from outside
      this.recipe2Form();
    }
  }

  render() {
    const [collectionInfoButton, collectionInfoContent] = this.getInfo(
      'collection',
      `Predefined collections. Select Customized to use specific Collection ID. Defaults to the global collection (${defaultCollectionId}). You can also use the Popular collection (${popularCollectionId}).`
    );
    const [limitInfoButton, limitInfoContent] = this.getInfo(
      'limit',
      'Number of results to return'
    );
    const [startInfoButton, startInfoContent] = this.getInfo(
      'start',
      'Starting index for the results'
    );
    const [orderByInfoButton, orderByInfoContent] = this.getInfo(
      'orderBy',
      'Select by which method results would be ordered'
    );
    const [qInfoButton, qInfoContent] = this.getInfo(
      'q',
      'Search query. This is more flexible and ambiguous than using filters but also less precise.'
    );
    const [languageInfoButton, languageInfoContent] = this.getInfo(
      'language',
      `Available values : ar-SA, bn-IN, cs-CZ, da-DK, de-DE, el-GR, en-US, es-ES, fil-P,fi-FI, fr-FR,hi-IN,
        id-ID, it-IT, ja-JP, ko-KR, ms-MY, nb-NO, nl-NL, pl-PL, pt-BR, ro-RO, ru-RU, sv-SE, ta-IN, th-TH,
        tr-TR, uk-UA, vi-VN, zh-Hans-CN, zh-Hant-TW`
    );
    const [prefLangInfoButton, prefLangInfoContent] = this.getInfo(
      'prefLang',
      'Boost templates that are in this language. Useful when your results have a mix of languages. Same list as the one for language filter.'
    );
    const [prefRegionInfoButton, prefRegionInfoContent] = this.getInfo(
      'prefRegion',
      `Available values : AD, AE, AF, AG, AI, AL, AM, AN, AO, AQ, AR, AS, AT, AU, AW, AX, AZ, BA, BB, BD, BE, BF, BG, BH, BI, BJ, BL, BM, BN, BO, BR, BS, BT, BV, BW, BY, BZ, CA, CC, CD, CF, CG, CH, CI, CK, CL, CM, CN, CO, CR, CU, CV, CX, CY, CZ, DE, DJ, DK, DM, DO, DZ, EC, EE, EG, EH, ER, ES, ET, FI, FJ, FK, FM, FO, FR, GA, GB, GD, GE, GF, GG, GH, GI, GL, GM, GN, GP, GQ, GR, GS, GT, GU, GW, GY, HK, HM, HN, HR, HT, HU, ID, IE, IL, IM, IN, IO, IQ, IR, IS, IT, JE, JM, JO, JP, KE, KG, KH, KI, KM, KN, KR, KV, KW, KY, KZ, LA, LB, LC, LI, LK, LR, LS, LT, LU, LV, LY, MA, MC, MD, ME, MF, MG, MH, MK, ML, MM, MN, MO, MP, MQ, MR, MS, MT, MU, MV, MW, MX, MY, MZ, NA, NC, NE, NF, NG, NI, NL, NO, NP, NR, NU, NZ, OM, PA, PE, PF, PG, PH, PK, PL, PM, PN, PR, PS, PT, PW, PY, QA, RE, RO, RS, RU, RW, SA, SB, SC, SD, SE, SG, SH, SI, SJ, SK, SL, SM, SN, SO, SR, ST, SV, SY, SZ, TC, TD, TF, TG, TH, TJ, TK, TL, TM, TN, TO, TR, TT, TV, TW, TZ, UA, UG, UM, US, UY, UZ, VA, VC, VE, VG, VI, VN, VU, WF, WS, YE, YT, ZA, ZM, ZW, ZZ`
    );

    return html`
      <div class="recipe">
        <h2>Recipe to Form:</h2>
        <textarea
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          name="recipe"
          .value=${this.recipe}
          @input=${this.handleFieldChange}
        ></textarea>
        <div class="copy-button-container">
          <button @click=${this.copyRecipe}>Copy</button>
          <p class="copied hidden">Copied to clipboard!</p>
        </div>
      </div>

      <form>
        <h2>Form to Recipe:</h2>
        <h4>Search Parameters:</h4>
        <label>
          Q:
          <input
            name="q"
            type="text"
            .value=${this.q}
            @input=${this.handleFieldChange}
          />
          ${qInfoButton}
        </label>
        ${qInfoContent}

        <label>
          Collection:
          <select name="collection" @change=${this.handleFieldChange}>
            <option value="default" ?selected=${this.collection === 'default'}>Default</option>
            <option value="popular" ?selected=${this.collection === 'popular'}>Popular</option>
            <option value="custom" ?selected=${this.collection === 'custom'}>
              Use Custom collection ID
            </option>
          </select>
          ${collectionInfoButton}
        </label>
        ${collectionInfoContent}

        <label>
          Collection ID:
          <input
            name="collectionId"
            type="text"
            title="Optional. Defaults to the global collection (urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418). Another common is the popular collection (urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852)."
            .value=${this.collectionId}
            ?disabled=${this.collection !== "custom"}
            ?required=${this.collection === "custom"}
            @input=${this.handleFieldChange}
          />
        </label>
        <div class="error-message collection-id-error hidden">
          Collection ID is required when using a custom collection
        </div>

        <label>
          Limit:
          <input
            name="limit"
            type="number"
            .value=${this.limit}
            @input=${this.handleFieldChange}
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
            @input=${this.handleFieldChange}
          />
          ${startInfoButton}
        </label>
        ${startInfoContent}

        <label>
          Order by:
          <select name="orderBy" @change=${this.handleFieldChange}>
            <option value="" ?selected=${this.orderBy === ''}>Relevancy (Default)</option>
            <option value="-remixCount" ?selected=${this.orderBy === '-remixCount'}>Descending Remix Count</option>
            <option value="+remixCount" ?selected=${this.orderBy === '+remixCount'}>Ascending Remix Count</option>
            <option value="-createDate" ?selected=${this.orderBy === '-createDate'}>
              Descending Create Date (New first)
            </option>
            <option value="+createDate" ?selected=${this.orderBy === '+createDate'}>
              Ascending Create Date (Old first)
            </option>
          </select>
          ${orderByInfoButton}
        </label>
        ${orderByInfoContent}

        <h4>Filters (comma separated):</h4>
        <label>
          Language:
          <input
            name="language"
            type="text"
            .value=${this.language}
            @input=${this.handleFieldChange}
          />
          ${languageInfoButton}
        </label>
        ${languageInfoContent}

        <label>
          Tasks:
          <input
            name="tasks"
            type="text"
            .value=${this.tasks}
            @input=${this.handleFieldChange}
          />
        </label>

        <label>
          Topics:
          <input
            name="topics"
            type="text"
            .value=${this.topics}
            @input=${this.handleFieldChange}
          />
        </label>

        <label>
          Behaviors:
          <select name="behaviors" @change=${this.handleFieldChange}>
            <option value="" ?selected=${this.behaviors === ''}>All (Default)</option>
            <option value="still" ?selected=${this.behaviors === 'still'}>Still</option>
            <option value="animated" ?selected=${this.behaviors === 'animated'}>Animated</option>
            <option value="video" ?selected=${this.behaviors === 'video'}>Video</option>
            <option value="animated,video" ?selected=${this.behaviors === 'animated,video'}>Animated + Video</option>
          </select>
        </label>

        <label>
          Licensing Category:
          <select name="license" @change=${this.handleFieldChange}>
            <option value="" ?selected=${this.license === ''}>Mixed (Default)</option>
            <option value="free" ?selected=${this.license === 'free'}>Free only</option>
            <option value="premium" ?selected=${this.license === 'premium'}>Premium only</option>
          </select>
        </label>

        <h4>Boosting:</h4>
        <label>
          Preferred Language Boosting:
          <input
            name="prefLang"
            .value=${this.prefLang}
            @input=${this.handleFieldChange}
          />
          ${prefLangInfoButton}
        </label>
        ${prefLangInfoContent}
        <label>
          Preferred Region Boosting:
          <input
            name="prefRegion"
            .value=${this.prefRegion}
            @input=${this.handleFieldChange}
          />
          ${prefRegionInfoButton}
        </label>
        ${prefRegionInfoContent}
      </form>
    `;
  }
}

customElements.define('recipe-editor', RecipeEditor);
