/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import { html, LitElement, css } from './lit.min.js';

export const base = 'https://www.adobe.com/express-search-api-v3';

/**
 * Convert filter params
 * @param {URLSearchParams} params
 */
export function convertFilterParams(params) {
  if (params.get('license')) {
    params.append('filters', `licensingCategory==${params.get('license')}`);
    params.delete('license');
  }
  if (params.get('behaviors')) {
    params.append('filters', `behaviors==${params.get('behaviors')}`);
    params.delete('behaviors');
  }
  if (params.get('tasks')) {
    params.append('filters', `pages.task.name==${params.get('tasks')}`);
    params.delete('tasks');
  }
  if (params.get('topics')) {
    params.append('filters', `topics==${params.get('topics')}`);
    params.delete('topics');
  }
  if (params.get('language')) {
    params.append('filters', `language==${params.get('language')}`);
    params.delete('language');
  }
}

/**
 * Extract and delete header params
 * @param {URLSearchParams} params
 */
export function extractHeaderParams(params) {
  const headers = {};
  if (params.get('prefLang')) {
    headers['x-express-pref-lang'] = params.get('prefLang');
    params.delete('prefLang');
  }
  if (params.get('prefRegion')) {
    headers['x-express-ims-region-code'] = params.get('prefRegion');
    params.delete('prefRegion');
  }
  return headers;
}

/**
 * @param {string} recipe
 * @returns {Object} url and headers
 */
export function recipe2ApiQuery(recipe) {
  const params = new URLSearchParams(recipe);
  params.set('queryType', 'search');
  convertFilterParams(params);
  const headers = extractHeaderParams(params);
  return { url: `${base}?${params.toString()}`, headers };
}

/**
 * @typedef {Object} TemplateThumbnail
 * @property {string} componentId - The component ID of the thumbnail
 * @property {string} hzRevision - The horizontal revision of the thumbnail
 * @property {string} mediaType - The media type of the thumbnail
 */

/**
 * @typedef {Object} VideoThumbnail
 * @property {string} componentId - The component ID of the video thumbnail
 * @property {string} hzRevision - The horizontal revision of the video thumbnail
 */

/**
 * @typedef {Object} TemplateRendition
 * @property {Object} image - The image rendition
 * @property {TemplateThumbnail} image.thumbnail - The image thumbnail details
 * @property {VideoThumbnail} [video] - Optional video thumbnail details
 */

/**
 * @typedef {Object} TemplateLinks
 * @property {Object} 'http://ns.adobe.com/adobecloud/rel/rendition' - Rendition link
 * @property {string} 'http://ns.adobe.com/adobecloud/rel/rendition'.href - Rendition URL
 * @property {Object} 'http://ns.adobe.com/adobecloud/rel/component' - Component link
 * @property {string} 'http://ns.adobe.com/adobecloud/rel/component'.href - Component URL
 */

/**
 * @typedef {Object} Template
 * @property {Object} customLinks - Custom links for the template
 * @property {TemplateRendition[]} pages - Array of page renditions
 * @property {TemplateLinks} _links - Template links
 */

/**
 * @typedef {Object} VideoTemplate
 * @property {Object} customLinks - Custom links for the template
 * @property {string} customLinks.branchUrl - The branch URL
 * @property {string[]} topics - Array of topics
 * @property {Object} 'dc:title' - Title information
 * @property {string} 'dc:title'.'i-default' - Default title
 * @property {Array<{rendition: {image: {thumbnail: TemplateThumbnail}, video: {thumbnail: VideoThumbnail}}}>} pages - Array of page renditions with required video
 * @property {TemplateLinks} _links - Template links
 */

/**
 * @typedef {Object} APIResponse
 * @property {(Template|VideoTemplate)[]} items - Array of template results
 * @property {Object} metadata - Response metadata
 * @property {number} metadata.totalHits - Total number of results available
 * @property {Object} status
 * @property {number} status.httpCode
 */

/**
 * Fetch results from the Adobe Express Search API
 * @param {string} recipe - The search recipe string containing query parameters
 * @example
 * fetchResults('q=chicago&topics=cats&tasks=flyer&language=en-us&license=free&behaviors=still&limit=11&collectionId=urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418&prefLang=en-us&prefRegion=us&start=1')
 * @returns {Promise<APIResponse>} Promise that resolves to the API response containing items and metadata
 */
export async function fetchResults(recipe) {
  const { url, headers } = recipe2ApiQuery(recipe);
  const response = await fetch(url, { headers });
  const data = await response.json();
  return data;
}

/**
 * @param {Template|VideoTemplate} template
 * @returns {boolean}
 */
function isVideoTemplate(template) {
  return !!template.pages?.[0]?.rendition?.video;
}

/**
 * Render a template
 * @param {Template|VideoTemplate} template
 */
function renderTemplate(template) {
  if (isVideoTemplate(template)) {
    return html`
      <div>
        <h3>${template.name}</h3>
      </div>
    `;
  }
  return html`
    <div>
      <h3>${template.name}</h3>
    </div>
  `;
}

class TAASResults extends LitElement {
  static properties = {
    recipe: { type: String },
    loading: { type: Boolean, state: true },
    results: { type: Object, state: true },
  };

  static styles = css`
    form {
      display: flex;
    }
  `;

  constructor() {
    super();
    this.results = null;
    this.loading = false;
  }

  async handleGenerate() {
    this.loading = true;
    const data = await fetchResults(this.recipe);
    console.log(data);
    this.results = data;
    this.loading = false;
  }

  renderResults() {
    if (this.loading) {
      return html`<div>Loading...</div>`;
    }
    if (!this.results) {
      return html`<div>Click "Generate" to see results</div>`;
    }
    if (this.results.status.httpCode !== 200) {
      return html`<div>Error: ${this.results.status.httpCode}</div>`;
    }
    if (this.results.items.length === 0) {
      return html`<div>No results found</div>`;
    }
    return html`
      <div id="results">
        ${this.results.items.map(renderTemplate).join('')}
      </div>`;
  }

  render() {
    const { url, headers } = recipe2ApiQuery(this.recipe);
    return html` <button @click=${this.handleGenerate}>Generate</button>
      <div>
        <h3>API Query for developers debugging:</h3>
        <div>URL: ${url}</div>
        <div>Headers: ${JSON.stringify(headers, null, 2)}</div>
      </div>
      ${this.renderResults()}
    </div>`;
  }
}

customElements.define('taas-results', TAASResults);
