/* eslint-disable no-underscore-dangle */
import { getLibs } from '../../scripts/utils.js';
import { getIconElementDeprecated } from '../../scripts/utils/icons.js';
import { trackSearch, updateImpressionCache } from '../../template-x/template-search-api-v3.js';
import BlockMediator from '../../scripts/block-mediator.min.js';

const imports = await Promise.all([import(`${getLibs()}/features/placeholders.js`), import(`${getLibs()}/utils/utils.js`)]);
const { replaceKey } = imports[0];
const { createTag, getMetadata, getConfig } = imports[1];

function containsVideo(pages) {
  return pages.some((page) => !!page?.rendition?.video?.thumbnail?.componentId);
}

function isVideo(iterator) {
  return iterator.current().rendition?.video?.thumbnail?.componentId;
}

function getTemplateTitle(template) {
  if (template['dc:title']?.['i-default']) {
    return template['dc:title']['i-default'];
  }

  if (template.moods?.length && template.task?.name) {
    return `${template.moods.join(', ')} ${template.task.name}`;
  }

  if (getMetadata('tasks-x')?.trim() && getMetadata('topics-x')?.trim()) {
    return `${getMetadata('topics-x').trim()} ${getMetadata('tasks-x').trim()}`;
  }

  return '';
}

function extractRenditionLinkHref(template) {
  return template._links?.['http://ns.adobe.com/adobecloud/rel/rendition']?.href;
}

function extractComponentLinkHref(template) {
  return template._links?.['http://ns.adobe.com/adobecloud/rel/component']?.href;
}

function extractImageThumbnail(page) {
  return page?.rendition?.image?.thumbnail;
}

function getImageThumbnailSrc(renditionLinkHref, componentLinkHref, page) {
  const thumbnail = extractImageThumbnail(page);
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

const videoMetadataType = 'application/vnd.adobe.ccv.videometadata';

async function getVideoUrls(renditionLinkHref, componentLinkHref, page) {
  const videoThumbnail = page.rendition?.video?.thumbnail;
  const { componentId } = videoThumbnail;
  const preLink = renditionLinkHref.replace(
    '{&page,size,type,fragment}',
    `&type=${videoMetadataType}&fragment=id=${componentId}`,
  );
  const backupPosterSrc = getImageThumbnailSrc(renditionLinkHref, componentLinkHref, page);
  try {
    const response = await fetch(preLink);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const { renditionsStatus: { state }, posterframe, renditions } = await response.json();
    if (state !== 'COMPLETED') throw new Error('Video not ready');

    const mp4Rendition = renditions.find((r) => r.videoContainer === 'MP4');
    if (!mp4Rendition?.url) throw new Error('No MP4 rendition found');

    return { src: mp4Rendition.url, poster: posterframe?.url || backupPosterSrc };
  } catch (err) {
    // use componentLink as backup
    return {
      src: componentLinkHref.replace(
        '{&revision,component_id}',
        `&revision=0&component_id=${componentId}`,
      ),
      poster: backupPosterSrc,
    };
  }
}

async function share(branchUrl, tooltip, timeoutId) {
  await navigator.clipboard.writeText(branchUrl);
  tooltip.classList.add('display-tooltip');

  const rect = tooltip.getBoundingClientRect();
  const tooltipRightEdgePos = rect.left + rect.width;
  if (tooltipRightEdgePos > window.innerWidth) {
    tooltip.classList.add('flipped');
  }

  clearTimeout(timeoutId);
  return setTimeout(() => {
    tooltip.classList.remove('display-tooltip');
    tooltip.classList.remove('flipped');
  }, 2500);
}

function renderShareWrapper(branchUrl, placeholders) {
  const text = placeholders['tag-copied'] ?? 'Copied to clipboard';
  const wrapper = createTag('div', { class: 'share-icon-wrapper' });
  const shareIcon = getIconElementDeprecated('share-arrow');
  shareIcon.setAttribute('tabindex', 0);
  const tooltip = createTag('div', {
    class: 'shared-tooltip',
    'aria-label': text,
    role: 'tooltip',
    tabindex: '-1',
  });
  let timeoutId = null;
  shareIcon.addEventListener('click', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    timeoutId = share(branchUrl, tooltip, timeoutId);
  });

  shareIcon.addEventListener('keypress', (e) => {
    if (e.key !== 'Enter') {
      return;
    }
    timeoutId = share(branchUrl, tooltip, timeoutId);
  });
  const checkmarkIcon = getIconElementDeprecated('checkmark-green');
  tooltip.append(checkmarkIcon);
  tooltip.append(text);
  wrapper.append(shareIcon);
  wrapper.append(tooltip);
  return wrapper;
}

function renderCTA(placeholders, branchUrl) {
  const btnTitle = placeholders['edit-this-template'] ?? 'Edit this template';
  const btnEl = createTag('a', {
    href: branchUrl,
    title: btnTitle,
    class: 'button accent small',
  });
  btnEl.textContent = btnTitle;
  return btnEl;
}

function renderCTALink(branchUrl) {
  const linkEl = createTag('a', {
    href: branchUrl,
    class: 'cta-link',
    tabindex: '-1',
  });
  return linkEl;
}

function getPageIterator(pages) {
  return {
    i: 0,
    next() {
      this.i = (this.i + 1) % pages.length;
    },
    reset() {
      this.i = 0;
    },
    current() {
      return pages[this.i];
    },
    all() {
      return pages;
    },
  };
}
async function renderRotatingMedias(
  wrapper,
  pages,
  { templateTitle, renditionLinkHref, componentLinkHref },
) {
  const pageIterator = getPageIterator(pages);
  let imgTimeoutId;

  const constructVideo = async () => {
    if (!containsVideo(pages)) return null;
    const { src, poster } = await getVideoUrls(
      renditionLinkHref,
      componentLinkHref,
      pageIterator.current(),
    );
    const video = createTag('video', {
      muted: true,
      playsinline: '',
      title: templateTitle,
      poster,
      class: 'unloaded hidden',
    });
    const videoSource = createTag('source', {
      src,
      type: 'video/mp4',
    });

    video.append(videoSource);

    return video;
  };

  const constructImg = () => createTag('img', {
    src: '',
    alt: templateTitle,
    class: 'hidden',
  });

  const img = constructImg();
  if (img) wrapper.prepend(img);

  const video = await constructVideo();
  if (video) wrapper.prepend(video);

  const dispatchImgEndEvent = () => {
    img.dispatchEvent(new CustomEvent('imgended', { detail: this }));
  };

  const playImage = () => {
    img.classList.remove('hidden');
    img.src = getImageThumbnailSrc(renditionLinkHref, componentLinkHref, pageIterator.current());

    imgTimeoutId = setTimeout(dispatchImgEndEvent, 2000);
  };

  const playVideo = async () => {
    if (video) {
      const videoSource = video.querySelector('source');
      video.classList.remove('hidden');
      const { src, poster } = await getVideoUrls(
        renditionLinkHref,
        componentLinkHref,
        pageIterator.current(),
      );
      video.poster = poster;
      videoSource.src = src;
      video.load();
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // ignore
        });
      }
    }
  };

  const playMedia = () => {
    if (isVideo(pageIterator)) {
      if (img) img.classList.add('hidden');
      playVideo();
    } else {
      if (video) video.classList.add('hidden');
      playImage();
    }
  };

  const cleanup = () => {
    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    if (imgTimeoutId) {
      clearTimeout(imgTimeoutId);
    }

    pageIterator.reset();
  };

  if (video) {
    video.addEventListener('ended', () => {
      if (pageIterator.all().length > 1) {
        pageIterator.next();
        playMedia();
      }
    });
  }

  if (img) {
    img.addEventListener('imgended', () => {
      if (pageIterator.all().length > 1) {
        pageIterator.next();
        playMedia();
      }
    });
  }

  return { cleanup, hover: playMedia };
}

let currentHoveredElement;

function renderMediaWrapper(template) {
  const mediaWrapper = createTag('div', { class: 'media-wrapper' });

  // TODO: reduce memory with LRU cache or memoization with ttl
  let renderedMedia = null;

  const templateTitle = getTemplateTitle(template);
  const renditionLinkHref = extractRenditionLinkHref(template);
  const componentLinkHref = extractComponentLinkHref(template);
  const { branchUrl } = template.customLinks;
  const templateInfo = {
    templateTitle,
    branchUrl,
    renditionLinkHref,
    componentLinkHref,
  };

  const enterHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!renderedMedia) {
      renderedMedia = await renderRotatingMedias(mediaWrapper, template.pages, templateInfo);
      const shareWrapper = await renderShareWrapper(branchUrl);
      mediaWrapper.append(shareWrapper);
    }
    renderedMedia.hover();
    currentHoveredElement?.classList.remove('singleton-hover');
    currentHoveredElement = e.target;
    currentHoveredElement?.classList.add('singleton-hover');
    document.activeElement.blur();
  };

  const leaveHandler = () => {
    if (renderedMedia) renderedMedia.cleanup();
  };

  const focusHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!renderedMedia) {
      renderedMedia = await renderRotatingMedias(mediaWrapper, template.pages, templateInfo);
      const shareWrapper = await renderShareWrapper(branchUrl);
      mediaWrapper.append(shareWrapper);
      renderedMedia.hover();
    }
    currentHoveredElement?.classList.remove('singleton-hover');
    currentHoveredElement = e.target;
    currentHoveredElement?.classList.add('singleton-hover');
  };

  return { mediaWrapper, enterHandler, leaveHandler, focusHandler };
}

async function renderHoverWrapper(template) {
  const btnContainer = createTag('div', { class: 'button-container' });

  const {
    mediaWrapper,
    enterHandler,
    leaveHandler,
    focusHandler,
  } = renderMediaWrapper(template);

  const cta = renderCTA(template.customLinks.branchUrl);
  const ctaLink = renderCTALink(template.customLinks.branchUrl);

  ctaLink.append(mediaWrapper);

  btnContainer.append(cta);
  btnContainer.append(ctaLink);
  btnContainer.addEventListener('mouseenter', enterHandler);
  btnContainer.addEventListener('mouseleave', leaveHandler);

  cta.addEventListener('focusin', focusHandler);
  const ctaClickHandler = () => {
    updateImpressionCache({
      content_id: template.id,
      status: template.licensingCategory,
      task: getMetadata('tasksx') || getMetadata('tasks') || '',
      search_keyword: getMetadata('q') || getMetadata('topics') || '',
      collection: getMetadata('tasksx') || getMetadata('tasks') || '',
      collection_path: window.location.pathname,
    });
    trackSearch('select-template', BlockMediator.get('templateSearchSpecs')?.search_id);
  };

  const ctaClickHandlerTouchDevice = (ev) => {
    // If it is a mobile device with a touch screen, do not jump over to the Edit page,
    // but allow the user to preview the template instead
    if (window.matchMedia('(pointer: coarse)').matches) {
      ev.preventDefault();
    }
  };

  cta.addEventListener('click', ctaClickHandler, { passive: true });
  ctaLink.addEventListener('click', ctaClickHandler, { passive: true });
  ctaLink.addEventListener('click', ctaClickHandlerTouchDevice);
  return btnContainer;
}

async function getStillWrapperIcons(template) {
  let planIcon = null;
  if (template.licensingCategory === 'free') {
    planIcon = createTag('span', { class: 'free-tag' });
    const free = await replaceKey('free', getConfig());
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

async function renderStillWrapper(template) {
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

  const { planIcon, videoIcon } = await getStillWrapperIcons(template);
  // console.log('theOtherVideoIcon');
  // console.log(videoIcon);
  img.onload = (e) => {
    if (e.eventPhase >= Event.AT_TARGET) {
      imgWrapper.append(planIcon);
      imgWrapper.append(videoIcon);
    }
  };

  stillWrapper.append(imgWrapper);
  return stillWrapper;
}

export default async function renderTemplate(template) {
  const tmpltEl = createTag('div');
  if (template.assetType === 'Webpage_Template') {
    // webpage_template has no pages
    template.pages = [{}];
  }
  tmpltEl.append(renderStillWrapper(template));
  tmpltEl.append(renderHoverWrapper(template));

  return tmpltEl;
}
