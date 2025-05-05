/* eslint-disable quotes */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable class-methods-use-this */
import { html, LitElement, css } from './lit.min.js';
import { getIconElementDeprecated } from '../../scripts/utils.js';

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

    h2 {
      margin: 0px;
    }
  `;

  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    this.dispatchEvent(new CustomEvent('taas-form-submit', { detail: Object.fromEntries(formData), bubbles: true, composed: true }));
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
    const [qInfoButton, qInfoContent] = this.getInfo('q', 'Search query. This is more flexible and ambiguous than using filters but also less precise.');
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
        </label>

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
        </label>

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
`;
  }
}

customElements.define('taas-form', TAASForm);
