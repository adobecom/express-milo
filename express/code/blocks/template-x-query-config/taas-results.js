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
 * Fetch results
 * @param {string} recipe
 * @example
 * fetchResults('q=chicago&topics=cats&tasks=flyer&language=en-us&license=free&behaviors=still&limit=11&collectionId=urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418&prefLang=en-us&prefRegion=us&start=1')
 */
export async function fetchResults(recipe) {
  const params = new URLSearchParams(recipe);
  params.set('queryType', 'search');
  convertFilterParams(params);
  const headers = extractHeaderParams(params);
  console.log('params and headers', params.toString(), headers);
  const response = await fetch(`${base}?${params.toString()}`, { headers });
  const data = await response.json();
  console.log(data);
  return data;
}

class TAASResults extends LitElement {
  static properties = {
    recipe: { type: String },
  };

  static styles = css`
    form {
      display: flex;
    }
  `;

  shouldUpdate(changedProperties) {
    if (changedProperties.has('recipe')) {
      const oldData = changedProperties.get('recipe');
      const newData = this.recipe;
      return oldData !== newData;
    }
    return false;
  }

  updated(changedProperties) {
    if (changedProperties.has('recipe') && this.recipe) {
      fetchResults(this.recipe);
    }
  }

  render() {
    return html`<div>For authors, copy this recipe:</div>
      <div>
        ${this.recipe}
      </div>
      <div>
        For developers debugging, this is the request:
        <div>
          {base}?{collectionIdParam}{queryParam}{qParam}{limitParam}{startParam}{sortParam}{filterStr}
        </div>
      </div>`;
  }
}

customElements.define('taas-results', TAASResults);
