/* eslint-disable quotes */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable class-methods-use-this */
import { html, LitElement, css } from './lit.min.js';
import { getIconElementDeprecated } from '../../scripts/utils.js';

const defaultCollectionId =
  'urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418';

class RecipeEditor extends LitElement {
  static properties = {
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
    h2 {
      margin: 0px;
    }
  `;

  form2Recipe() {
    const collectionId = `collectionId=${
      this.collectionId || defaultCollectionId
    }`;
    const limit = this.limit ? `limit=${this.limit}` : '';
    const start = this.start ? `start=${this.start}` : '';
    const q = this.q ? `q=${this.q}` : '';
    const language = this.language ? `language=${this.language}` : '';
    const tasks = this.tasks ? `tasks=${this.tasks}` : '';
    const topics = this.topics ? `topics=${this.topics}` : '';
    const license = this.license ? `license=${this.license}` : '';
    const behaviors = this.behaviors ? `behaviors=${this.behaviors}` : '';
    const prefLang = this.prefLang ? `prefLang=${this.prefLang}` : '';
    const prefRegion = this.prefRegion ? `prefRegion=${this.prefRegion}` : '';
    const recipe = [
      collectionId,
      limit,
      start,
      q,
      language,
      tasks,
      topics,
      license,
      behaviors,
      prefLang,
      prefRegion,
    ]
      .filter(Boolean)
      .join('&');
    this.recipe = recipe;
  }

  recipe2Form() {
    const params = new URLSearchParams(this.recipe);
    if (params.has('collectionId')) {
      this.collectionId = params.get('collectionId');
    }
    if (params.has('limit')) {
      this.limit = Number(params.get('limit'));
    }
    if (params.has('start')) {
      this.start = Number(params.get('start'));
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
      this.prefRegion = params.get('prefRegion');
    }
  }

  handleGenerate(e) {
    e.preventDefault();
    // No need to call form2Recipe here since it's already in sync
    this.dispatchEvent(
      new CustomEvent('recipe-changed', {
        detail: this.recipe,
        bubbles: true,
        composed: true,
      })
    );
  }

  handleFieldChange(field, value) {
    this[field] = value;
    this.form2Recipe();
    this.dispatchEvent(
      new CustomEvent('recipe-changed', {
        detail: this.recipe,
        bubbles: true,
        composed: true,
      })
    );
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('recipe') && this.recipe) {
      // Only update form if recipe changed from outside
      this.recipe2Form();
    }
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
      `Available values : AR_SA, BN_IN, CS_CZ, DA_DK, DE_DE, EL_GR, EN_US, ES_ES, FIL_PH, FI_FI, FR_FR, HI_IN, ID_ID, IT_IT, I_DEFAULT, JA_JP, KO_KR, MS_MY, NB_NO, NL_NL, PL_PL, PT_BR, RO_RO, RU_RU, SV_SE, TA_IN, TH_TH, TR_TR, UK_UA, VI_VN, ZH_HANS_CN, ZH_HANT_TW`
    );
    const [tasksInfoButton, tasksInfoContent] = this.getInfo(
      'tasks',
      'Filter by tasks'
    );
    const [topicsInfoButton, topicsInfoContent] = this.getInfo(
      'topics',
      'Filter by topics'
    );
    const [prefLangInfoButton, prefLangInfoContent] = this.getInfo(
      'prefLang',
      'Boost templates that are in this language'
    );
    const [prefRegionInfoButton, prefRegionInfoContent] = this.getInfo(
      'prefRegion',
      `Available values : AD, AE, AF, AG, AI, AL, AM, AN, AO, AQ, AR, AS, AT, AU, AW, AX, AZ, BA, BB, BD, BE, BF, BG, BH, BI, BJ, BL, BM, BN, BO, BR, BS, BT, BV, BW, BY, BZ, CA, CC, CD, CF, CG, CH, CI, CK, CL, CM, CN, CO, CR, CU, CV, CX, CY, CZ, DE, DJ, DK, DM, DO, DZ, EC, EE, EG, EH, ER, ES, ET, FI, FJ, FK, FM, FO, FR, GA, GB, GD, GE, GF, GG, GH, GI, GL, GM, GN, GP, GQ, GR, GS, GT, GU, GW, GY, HK, HM, HN, HR, HT, HU, ID, IE, IL, IM, IN, IO, IQ, IR, IS, IT, JE, JM, JO, JP, KE, KG, KH, KI, KM, KN, KR, KV, KW, KY, KZ, LA, LB, LC, LI, LK, LR, LS, LT, LU, LV, LY, MA, MC, MD, ME, MF, MG, MH, MK, ML, MM, MN, MO, MP, MQ, MR, MS, MT, MU, MV, MW, MX, MY, MZ, NA, NC, NE, NF, NG, NI, NL, NO, NP, NR, NU, NZ, OM, PA, PE, PF, PG, PH, PK, PL, PM, PN, PR, PS, PT, PW, PY, QA, RE, RO, RS, RU, RW, SA, SB, SC, SD, SE, SG, SH, SI, SJ, SK, SL, SM, SN, SO, SR, ST, SV, SY, SZ, TC, TD, TF, TG, TH, TJ, TK, TL, TM, TN, TO, TR, TT, TV, TW, TZ, UA, UG, UM, US, UY, UZ, VA, VC, VE, VG, VI, VN, VU, WF, WS, YE, YT, ZA, ZM, ZW, ZZ`
    );

    return html`<form @submit=${this.handleGenerate}>
      <h2>Search Parameters:</h2>
      <label>
        Q:
        <input
          name="q"
          type="text"
          .value=${this.q}
          @input=${(e) => this.handleFieldChange('q', e.target.value)}
        />
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
          @input=${(e) => this.handleFieldChange('collectionId', e.target.value)}
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
          @input=${(e) => this.handleFieldChange('limit', Number(e.target.value))}
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
          @input=${(e) => this.handleFieldChange('start', Number(e.target.value))}
        />
        ${startInfoButton}
      </label>
      ${startInfoContent}

      <label>
        Order by:
        <select
          name="order-by"
          @change=${(e) => this.handleFieldChange('orderBy', e.target.value)}
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

      <h2>Filters (comma separated):</h2>
      <label>
        Language:
        <input
          name="language"
          type="text"
          .value=${this.language}
          @input=${(e) => this.handleFieldChange('language', e.target.value)}
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
          @input=${(e) => this.handleFieldChange('tasks', e.target.value)}
        />
        ${tasksInfoButton}
      </label>
      ${tasksInfoContent}

      <label>
        Topics:
        <input
          name="topics"
          type="text"
          .value=${this.topics}
          @input=${(e) => this.handleFieldChange('topics', e.target.value)}
        />
        ${topicsInfoButton}
      </label>
      ${topicsInfoContent}

      <label>
        Behaviors:
        <select
          name="behaviors"
          @change=${(e) => this.handleFieldChange('behaviors', e.target.value)}
        >
          <option value="">All (Default)</option>
          <option value="still">Still</option>
          <option value="animated">Animated</option>
          <option value="video">Video</option>
          <option value="animated+video">Animated + Video</option>
        </select>
      </label>

      <label>
        Licensing Category:
        <select
          name="license"
          @change=${(e) => this.handleFieldChange('license', e.target.value)}
        >
          <option value="">Mixed (Default)</option>
          <option value="free">Free only</option>
          <option value="premium">Premium only</option>
        </select>
      </label>

      <h2>Boosting:</h2>
      <label>
        Preferred Language Boosting:
        <input
          name="pref-lang"
          .value=${this.prefLang}
          @input=${(e) => this.handleFieldChange('prefLang', e.target.value)}
        />
        ${prefLangInfoButton}
      </label>
      ${prefLangInfoContent}
      <label>
        Preferred Region Boosting:
        <input
          name="pref-region"
          .value=${this.prefRegion}
          @input=${(e) => this.handleFieldChange('prefRegion', e.target.value)}
        />
        ${prefRegionInfoButton}
      </label>
      ${prefRegionInfoContent}

      <label>
        Recipe:
        <input
          name="recipe"
          type="text"
          .value=${this.recipe}
          @input=${(e) => this.handleFieldChange('recipe', e.target.value)}
        />
      </label>

      <button type="submit">Generate</button>
    </form> `;
  }
}

customElements.define('recipe-editor', RecipeEditor); 
