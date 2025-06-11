/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable comma-dangle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import { html, LitElement, css } from './lit.min.js';
import { recipe2ApiQuery, fetchResults, extractComponentLinkHref, extractRenditionLinkHref, containsVideo } from '../../scripts/template-utils.js';

const videoMetadataType = 'application/vnd.adobe.ccv.videometadata';

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
 * @typedef {Object} TemplateInfo
 * @property {string} src - The source URL of the template
 * @property {string} poster - The poster URL of the template
 * @property {string} title - The title of the template
 */

/**
 * @param {Template} template
 * @returns {string}
 */
function getImageSrc(template) {
  const thumbnail = template.pages[0].rendition.image?.thumbnail;
  const componentLinkHref = extractComponentLinkHref(template);
  const renditionLinkHref = extractRenditionLinkHref(template);
  const { mediaType, componentId, hzRevision } = thumbnail;
  if (mediaType === 'image/webp') {
    // webp only supported by componentLink
    return componentLinkHref.replace(
      '{&revision,component_id}',
      `&revision=${hzRevision || 0}&component_id=${componentId}`
    );
  }

  return renditionLinkHref.replace(
    '{&page,size,type,fragment}',
    `&type=${mediaType}&fragment=id=${componentId}`
  );
}

/**
 * @param {VideoTemplate} template
 * @returns {Promise<{src: string, poster: string}>}
 */
async function getVideo(template) {
  const videoThumbnail = template.pages[0].rendition.video.thumbnail;
  const renditionLinkHref = template._links['http://ns.adobe.com/adobecloud/rel/rendition'].href;
  const { componentId } = videoThumbnail;
  const preLink = renditionLinkHref.replace(
    '{&page,size,type,fragment}',
    `&type=${videoMetadataType}&fragment=id=${componentId}`
  );
  const backupPosterSrc = getImageSrc(template);
  try {
    const response = await fetch(preLink);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const {
      renditionsStatus: { state },
      posterframe,
      renditions,
    } = await response.json();
    if (state !== 'COMPLETED') throw new Error('Video not ready');

    const mp4Rendition = renditions.find((r) => r.videoContainer === 'MP4');
    if (!mp4Rendition?.url) throw new Error('No MP4 rendition found');

    return {
      src: mp4Rendition.url,
      poster: posterframe?.url || backupPosterSrc,
    };
  } catch (err) {
    console.error('in getting video url: ', err, JSON.stringify(template));
    return { src: backupPosterSrc };
  }
}

/**
 * @param {Template|VideoTemplate} template
 * @returns {Promise<TemplateInfo>}
 */
async function getTemplateInfo(template) {
  if (containsVideo(template)) {
    const videoInfo = await getVideo(template);
    return {
      ...videoInfo,
      title: template?.['dc:title']?.['i-default'] ?? 'Adobe Express Template',
    };
  }
  return {
    src: getImageSrc(template),
    title: template?.['dc:title']?.['i-default'] ?? 'Adobe Express Template',
  };
}

/**
 * Render a template
 * @param {TemplateInfo} templateInfo
 * @param {Template|VideoTemplate} template
 */
function renderTemplate(templateInfo) {
  const isVideo = !!templateInfo.poster;
  if (isVideo) {
    return html`
    <div class="template video">
    <video
      muted
      playsInline
      autoPlay
      loop
      preload="auto"
      poster=${templateInfo.poster}
    >
      <source src=${templateInfo.src}></source>
  </video>
    </div>
  `;
  }
  return html`
    <div class="template">
      <img src="${templateInfo.src}" alt="${templateInfo.title}" />
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
    :host {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    #generate-button {
      align-self: flex-start;
      color: #fff;
      background-color: #5c5ce0;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 50rem;
      cursor: pointer;
      font-size: 1rem;
      font-family: 'Adobe Clean', sans-serif;
    }
    #results {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border: 1px solid #ccc;
      padding: 1rem;
      border-radius: 0.5rem;
      max-width: 65vw;
      max-height: 100vh;
      overflow-y: auto;
    }
    .templates {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .template {
      max-height: 280px;
      max-width: 280px;
      border: 1px solid #ccc;
    }
    .template img,
    .template video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    #query {
      border: 1px solid #ccc;
      padding: 1rem;
      border-radius: 0.5rem;
      max-width: 65vw;
    }
    h2 {
      margin: 0;
    }
  `;

  constructor() {
    super();
    this.results = null;
    this.loading = false;
  }

  get $results() {
    return this.shadowRoot.getElementById('results');
  }

  async handleGenerate() {
    this.loading = true;
    const data = await fetchResults(this.recipe);
    data.processedItems = await Promise.all(
      data.items.map((item) => getTemplateInfo(item))
    );
    this.results = data;
    this.loading = false;
  }

  renderTemplates() {
    if (this.loading) {
      return html`<div>Loading...</div>`;
    }
    if (!this.results) {
      return html`<small>Click "Generate" to see results</small>`;
    }
    if (this.results.status.httpCode !== 200) {
      return html`<div>Error: ${this.results.status.httpCode}</div>`;
    }
    if (this.results.items.length === 0) {
      return html`<div>No results found</div>`;
    }
    return html` <div class="templates">
      ${this.results.processedItems.map(renderTemplate)}
    </div>`;
  }

  renderQuery() {
    const { url, headers } = recipe2ApiQuery(this.recipe);
    return html`
      <div>
        <h2>API Query: (ignore if you're not a developer)</h2>
        <code>${url} <br />Headers: ${JSON.stringify(headers, null, 2)}</code>
      </div>
    `;
  }

  render() {
    const totalResults = this.results?.metadata?.totalHits
      ? html`Total results: ${this.results?.metadata?.totalHits}`
      : '';
    return html`
      <div id="query">${this.renderQuery()}</div>
      <div id="results">
        <h2>Results:</h2>
        ${totalResults}
        <button @click=${this.handleGenerate} id="generate-button">
          ${this.loading
            ? 'Generating...'
            : this.results
            ? 'Regenerate'
            : 'Generate'}
        </button>
        ${this.renderTemplates()}
      </div>
    `;
  }
}

customElements.define('taas-results', TAASResults);
