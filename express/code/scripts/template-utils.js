/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import { getLibs, getIconElementDeprecated } from './utils.js';

let createTag; let getConfig;
let getMetadata; let replaceKeyArray;
let tagCopied; let editThisTemplate;
let free; let sharePlaceholder;

export const base = 'https://www.adobe.com/express-search-api-v3';

export const defaultCollectionId = 'urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418';
export const popularCollectionId = 'urn:aaid:sc:VA6C2:a6767752-9c76-493e-a9e8-49b54b3b9852';

export function convertFilterParams(params) {
  if (params.has('collection')) {
    if (params.get('collection') === 'default') {
      params.set('collectionId', `${defaultCollectionId}`);
    } else if (params.get('collection') === 'popular') {
      params.set('collectionId', `${popularCollectionId}`);
    }
    params.delete('collection');
  }
  if (params.get('collectionId')) {
    params.set('collectionId', `${params.get('collectionId')}`);
  } else {
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
}

export function extractHeaderParams(params) {
  const headers = {};
  if (params.get('prefLang')) {
    headers['x-express-pref-lang'] = params.get('prefLang');
    params.delete('prefLang');
  }
  if (params.get('prefRegion')) {
    headers['x-express-pref-region-code'] = params.get('prefRegion');
    params.delete('prefRegion');
  }
  return headers;
}

export function recipe2ApiQuery(recipe) {
  const params = new URLSearchParams(recipe);
  params.set('queryType', 'search');
  convertFilterParams(params);
  const headers = extractHeaderParams(params);
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

export function getImageThumbnailSrc(renditionLinkHref, componentLinkHref, page) {
  const thumbnail = page?.rendition?.image?.thumbnail;
  if (!thumbnail) {
    // webpages
    return renditionLinkHref.replace('{&page,size,type,fragment}', '');
  }
  const {
    mediaType,
    componentId,
    width,
    height,
    hzRevision,
  } = thumbnail;
  if (mediaType === 'image/webp') {
    // webp only supported by componentLink
    return componentLinkHref.replace(
      '{&revision,component_id}',
      `&revision=${hzRevision || 0}&component_id=${componentId}`,
    );
  }

  return renditionLinkHref.replace(
    '{&page,size,type,fragment}',
    `&size=${Math.max(width, height)}&type=${mediaType}&fragment=id=${componentId}`,
  );
}

export function containsVideo(pages) {
  return pages.some((page) => !!page?.rendition?.video?.thumbnail?.componentId);
}

function getStillWrapperIcons(template) {
  let planIcon = null;
  if (template.licensingCategory === 'free') {
    planIcon = createTag('span', { class: 'free-tag' });
    planIcon.append(free === 'free' ? 'Free' : free);
  } else {
    planIcon = getIconElementDeprecated('premium');
  }
  let videoIcon = '';
  if (!containsVideo(template.pages) && template.pages.length > 1) {
    videoIcon = getIconElementDeprecated('multipage-static-badge');
  }

  if (containsVideo(template.pages) && template.pages.length === 1) {
    videoIcon = getIconElementDeprecated('video-badge');
  }

  if (containsVideo(template.pages) && template.pages.length > 1) {
    videoIcon = getIconElementDeprecated('multipage-video-badge');
  }
  if (videoIcon) videoIcon.classList.add('media-type-icon');
  return { planIcon, videoIcon };
}

function renderStillWrapper(template) {
  const stillWrapper = createTag('div', { class: 'still-wrapper' });

  const templateTitle = getTemplateTitle(template);
  const renditionLinkHref = extractRenditionLinkHref(template);
  const componentLinkHref = extractComponentLinkHref(template);

  const thumbnailImageHref = getImageThumbnailSrc(
    renditionLinkHref,
    componentLinkHref,
    template.pages[0],
  );

  const imgWrapper = createTag('div', { class: 'image-wrapper' });

  const img = createTag('img', {
    src: thumbnailImageHref,
    alt: templateTitle,
  });
  imgWrapper.append(img);

  const { planIcon, videoIcon } = getStillWrapperIcons(template);
  img.onload = (e) => {
    if (e.eventPhase >= Event.AT_TARGET) {
      imgWrapper.append(planIcon);
      imgWrapper.append(videoIcon);
    }
  };

  stillWrapper.append(imgWrapper);
  return stillWrapper;
}

// export async function renderTemplate(template) {
//   await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]).then(([utils, placeholders]) => {
//     ({ createTag, getConfig, getMetadata } = utils);
//     ({ replaceKeyArray } = placeholders);
//   });
//   [tagCopied, editThisTemplate, free, sharePlaceholder] = await replaceKeyArray(['tag-copied', 'edit-this-template', 'free', 'share'], getConfig());
//   const tmpltEl = createTag('div');
//   if (template.assetType === 'Webpage_Template') {
//     // webpage_template has no pages
//     template.pages = [{}];
//   }

//   tmpltEl.append(renderStillWrapper(template));
//   tmpltEl.append(renderHoverWrapper(template));
//   return tmpltEl;
// }
