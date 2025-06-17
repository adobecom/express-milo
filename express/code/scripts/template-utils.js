/* eslint-disable no-underscore-dangle */
export const base = 'https://www.adobe.com/express-search-api-v3';

export const defaultCollectionId = 'urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418';
export const popularCollectionId = 'urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852';

export function recipe2ApiQuery(recipe) {
  const params = new URLSearchParams(recipe);
  if (params.has('collection')) {
    if (params.get('collection') === 'default') {
      params.set('collectionId', `${defaultCollectionId}`);
    } else if (params.get('collection') === 'popular') {
      params.set('collectionId', `${popularCollectionId}`);
    }
    params.delete('collection');
  }
  if (!params.get('collectionId')) {
    params.set('collectionId', `${defaultCollectionId}`);
  }
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

  const headers = {};
  if (params.get('prefLang')) {
    headers['x-express-pref-lang'] = params.get('prefLang');
    params.delete('prefLang');
  }
  if (params.get('prefRegion')) {
    headers['x-express-pref-region-code'] = params.get('prefRegion');
    params.delete('prefRegion');
  }

  params.set('queryType', 'search');
  return { url: `${base}?${decodeURIComponent(params.toString())}`, headers };
}

export async function fetchResults(recipe) {
  const { url, headers } = recipe2ApiQuery(recipe);
  const response = await fetch(url, { headers });
  const data = await response.json();
  return data;
}

export function getTemplateTitle(template) {
  if (template['dc:title']?.['i-default']) {
    return template['dc:title']['i-default'];
  }
  if (template.moods?.length && template.task?.name) {
    return `${template.moods.join(', ')} ${template.task.name}`;
  }
  return '';
}

export function extractRenditionLinkHref(template) {
  return template._links?.['http://ns.adobe.com/adobecloud/rel/rendition']?.href;
}

export function extractComponentLinkHref(template) {
  return template._links?.['http://ns.adobe.com/adobecloud/rel/component']?.href;
}

export function containsVideo(page) {
  return !!page?.rendition?.video?.thumbnail?.componentId;
}
