import { useState } from 'react';

export default function Form({ formData, onFormChange }) {
  const [showInfo, setShowInfo] = useState({});

  const toggleInfo = (fieldName) => {
    setShowInfo((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const InfoButton = ({ fieldName, content }) => (
    <>
      <button
        type="button"
        className="info-button"
        aria-label={`Show information for ${fieldName}`}
        onClick={() => toggleInfo(fieldName)}
      >
        ℹ️
      </button>
      {showInfo[fieldName] && (
        <div className="info-content" tabIndex="0">
          <small>{content}</small>
        </div>
      )}
    </>
  );

  return (
    <form className="border-grey rounded p-1 gap-1">
      <h2>Form to Recipe:</h2>
      <h4>Search Parameters</h4>

      <label>
        Q:
        <input
          name="q"
          type="text"
          value={formData.q}
          onChange={(e) => onFormChange('q', e.target.value)}
        />
        <InfoButton
          fieldName="q"
          content="Search query. This is more flexible and ambiguous than using filters but also less precise."
        />
      </label>

      <label>
        Collection:
        <select
          name="collection"
          value={formData.collection}
          onChange={(e) => onFormChange('collection', e.target.value)}
        >
          <option value="default">Default</option>
          <option value="popular">Popular</option>
          <option value="custom">Use Custom collection ID</option>
        </select>
        <InfoButton
          fieldName="collection"
          content="Predefined collections. Select Customized to use specific Collection ID. Defaults to the global collection (urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418). You can also use the Popular collection (urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852)."
        />
      </label>

      <label>
        Collection ID:
        <input
          name="collectionId"
          type="text"
          title="Optional. Defaults to the global collection (urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418). Another common is the popular collection (urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852)."
          value={formData.collectionId}
          disabled={formData.collection !== 'custom'}
          required={formData.collection === 'custom'}
          onChange={(e) => onFormChange('collectionId', e.target.value)}
        />
      </label>
      {formData.collection === 'custom' && !formData.collectionId && (
        <div className="error-message">
          Collection ID is required when using a custom collection
        </div>
      )}

      <label>
        Limit:
        <input
          name="limit"
          type="number"
          value={formData.limit}
          onChange={(e) => onFormChange('limit', e.target.value)}
        />
        <InfoButton fieldName="limit" content="Number of results to return" />
      </label>

      <label>
        Start:
        <input
          name="start"
          type="number"
          value={formData.start}
          onChange={(e) => onFormChange('start', e.target.value)}
        />
        <InfoButton
          fieldName="start"
          content="Starting index for the results"
        />
      </label>

      <label>
        Order by:
        <select
          name="orderBy"
          value={formData.orderBy}
          onChange={(e) => onFormChange('orderBy', e.target.value)}
        >
          <option value="">Relevancy (Default)</option>
          <option value="-remixCount">Descending Remix Count</option>
          <option value="+remixCount">Ascending Remix Count</option>
          <option value="-createDate">
            Descending Create Date (New first)
          </option>
          <option value="+createDate">Ascending Create Date (Old first)</option>
        </select>
        <InfoButton
          fieldName="orderBy"
          content="Select by which method results would be ordered"
        />
      </label>

      <h4>Filters (comma separated):</h4>

      <label>
        Language:
        <input
          name="language"
          type="text"
          value={formData.language}
          onChange={(e) => onFormChange('language', e.target.value)}
        />
        <InfoButton
          fieldName="language"
          content="Available values : ar-SA, bn-IN, cs-CZ, da-DK, de-DE, el-GR, en-US, es-ES, fil-P,fi-FI, fr-FR,hi-IN, id-ID, it-IT, ja-JP, ko-KR, ms-MY, nb-NO, nl-NL, pl-PL, pt-BR, ro-RO, ru-RU, sv-SE, ta-IN, th-TH, tr-TR, uk-UA, vi-VN, zh-Hans-CN, zh-Hant-TW"
        />
      </label>

      <label>
        Tasks:
        <input
          name="tasks"
          type="text"
          value={formData.tasks}
          onChange={(e) => onFormChange('tasks', e.target.value)}
        />
      </label>

      <label>
        Topics:
        <input
          name="topics"
          type="text"
          value={formData.topics}
          onChange={(e) => onFormChange('topics', e.target.value)}
        />
      </label>

      <label>
        Behaviors:
        <select
          name="behaviors"
          value={formData.behaviors}
          onChange={(e) => onFormChange('behaviors', e.target.value)}
        >
          <option value="">All (Default)</option>
          <option value="still">Still</option>
          <option value="animated">Animated</option>
          <option value="video">Video</option>
          <option value="animated,video">Animated + Video</option>
        </select>
      </label>

      <label>
        Licensing Category:
        <select
          name="license"
          value={formData.license}
          onChange={(e) => onFormChange('license', e.target.value)}
        >
          <option value="">Mixed (Default)</option>
          <option value="free">Free only</option>
          <option value="premium">Premium only</option>
        </select>
      </label>

      <h4>Boosting:</h4>

      <label>
        Preferred Language Boosting:
        <input
          name="prefLang"
          value={formData.prefLang}
          onChange={onFormChange}
        />
        <InfoButton
          fieldName="prefLang"
          content="Boost templates that are in this language. Useful when your results have a mix of languages. Same list as the one for language filter."
        />
      </label>

      <label>
        Preferred Region Boosting:
        <input
          name="prefRegion"
          value={formData.prefRegion}
          onChange={onFormChange}
        />
        <InfoButton
          fieldName="prefRegion"
          content="Available values : AD, AE, AF, AG, AI, AL, AM, AN, AO, AQ, AR, AS, AT, AU, AW, AX, AZ, BA, BB, BD, BE, BF, BG, BH, BI, BJ, BL, BM, BN, BO, BR, BS, BT, BV, BW, BY, BZ, CA, CC, CD, CF, CG, CH, CI, CK, CL, CM, CN, CO, CR, CU, CV, CX, CY, CZ, DE, DJ, DK, DM, DO, DZ, EC, EE, EG, EH, ER, ES, ET, FI, FJ, FK, FM, FO, FR, GA, GB, GD, GE, GF, GG, GH, GI, GL, GM, GN, GP, GQ, GR, GS, GT, GU, GW, GY, HK, HM, HN, HR, HT, HU, ID, IE, IL, IM, IN, IO, IQ, IR, IS, IT, JE, JM, JO, JP, KE, KG, KH, KI, KM, KN, KR, KV, KW, KY, KZ, LA, LB, LC, LI, LK, LR, LS, LT, LU, LV, LY, MA, MC, MD, ME, MF, MG, MH, MK, ML, MM, MN, MO, MP, MQ, MR, MS, MT, MU, MV, MW, MX, MY, MZ, NA, NC, NE, NF, NG, NI, NL, NO, NP, NR, NU, NZ, OM, PA, PE, PF, PG, PH, PK, PL, PM, PN, PR, PS, PT, PW, PY, QA, RE, RO, RS, RU, RW, SA, SB, SC, SD, SE, SG, SH, SI, SJ, SK, SL, SM, SN, SO, SR, ST, SV, SY, SZ, TC, TD, TF, TG, TH, TJ, TK, TL, TM, TN, TO, TR, TT, TV, TW, TZ, UA, UG, UM, US, UY, UZ, VA, VC, VE, VG, VI, VN, VU, WF, WS, YE, YT, ZA, ZM, ZW, ZZ"
        />
      </label>
    </form>
  );
}
