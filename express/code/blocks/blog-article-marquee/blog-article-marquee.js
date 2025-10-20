import { getLibs } from '../../scripts/utils.js';

let createTag;

const MOBILE_MAX = 600;
const TABLET_MAX = 900;
const HERO_IMAGE_WIDTHS = { mobile: 480, tablet: 720, desktop: 960 };
const PRODUCT_IMAGE_WIDTHS = { mobile: 160, tablet: 200, desktop: 240 };
const PRECONNECT_DATA_ATTRIBUTE = 'blogArticleMarquee';

function getViewportWidth() {
  return window.innerWidth || document.documentElement?.clientWidth || 0;
}

function getResponsiveWidth(widths, fallback = 600) {
  const viewportWidth = getViewportWidth();
  if (viewportWidth && viewportWidth <= MOBILE_MAX) return widths.mobile ?? fallback;
  if (viewportWidth && viewportWidth <= TABLET_MAX) return widths.tablet ?? widths.desktop ?? fallback;
  return widths.desktop ?? widths.tablet ?? widths.mobile ?? fallback;
}

function ensureHeadLink(tagName, attrs = {}) {
  const hrefKey = attrs.href || '';
  const relSelector = attrs.rel ? `[rel="${attrs.rel}"]` : '';
  const existing = hrefKey
    ? document.head.querySelector(`${tagName}${relSelector}[data-${PRECONNECT_DATA_ATTRIBUTE}="${hrefKey}"]`)
    || document.head.querySelector(`${tagName}${relSelector}[href="${hrefKey}"]`)
    : null;
  if (existing) return existing;
  const el = document.createElement(tagName);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== undefined && value !== null) el.setAttribute(key, value);
  });
  if (hrefKey) el.dataset[PRECONNECT_DATA_ATTRIBUTE] = hrefKey;
  document.head.appendChild(el);
  return el;
}

function addImagePreconnects(imageUrl) {
  if (!imageUrl) return;
  try {
    const url = new URL(imageUrl, window.location.href);
    if (url.origin !== window.location.origin) {
      ensureHeadLink('link', {
        rel: 'preconnect',
        href: url.origin,
        crossorigin: 'anonymous',
      });
    }
  } catch (e) {
    // ignore invalid URLs
  }
}

function preloadImage(imageUrl) {
  if (!imageUrl) return;
  ensureHeadLink('link', { rel: 'preload', as: 'image', href: imageUrl });
}

function buildOptimizedImageUrl(src, width) {
  if (!src || !width) return null;
  try {
    const url = new URL(src, window.location.href);
    const roundedWidth = Math.max(1, Math.round(width));
    return `${url.pathname}?width=${roundedWidth}&format=webp&optimize=medium`;
  } catch (e) {
    return null;
  }
}

function getAspectRatio(img) {
  const widthAttr = Number.parseFloat(img.getAttribute('width'));
  const heightAttr = Number.parseFloat(img.getAttribute('height'));
  if (widthAttr > 0 && heightAttr > 0) return heightAttr / widthAttr;
  return null;
}

function optimizeImage(img, {
  width,
  eager = false,
  priority,
  preload = false,
  preconnect = true,
} = {}) {
  if (!img) return;

  const originalSrc = img.currentSrc || img.src;
  const optimizedSrc = buildOptimizedImageUrl(originalSrc, width);
  if (optimizedSrc) {
    img.src = optimizedSrc;
    if (preload) preloadImage(optimizedSrc);
  }
  if (preconnect) addImagePreconnects(originalSrc);

  const ratio = getAspectRatio(img);
  if (width) {
    img.setAttribute('width', Math.round(width));
    if (ratio) img.setAttribute('height', Math.round(width * ratio));
  }

  img.setAttribute('decoding', 'async');

  if (eager) {
    img.setAttribute('loading', 'eager');
    if (priority) img.setAttribute('fetchpriority', priority);
  } else {
    img.setAttribute('loading', 'lazy');
    img.removeAttribute('fetchpriority');
  }
}

function isPictureOnlyColumn(column) {
  const media = column.querySelectorAll('picture, img');
  if (!media.length) return false;
  const nonDecorativeChildren = [...column.children]
    .filter((el) => !['BR', 'PICTURE'].includes(el.tagName) && !(el.tagName === 'IMG' && el.closest('picture')));
  return nonDecorativeChildren.length === 0;
}

function findHeading(container) {
  return container.querySelector('h1, h2, h3, h4, h5, h6');
}

function cleanEmptyElements(container) {
  container.querySelectorAll('p, div').forEach((el) => {
    if (!el.textContent.trim() && !el.querySelector('img, picture, svg')) el.remove();
  });
}

function extractProductHighlight(row) {
  const column = row.querySelector('div');
  if (!column) return null;

  const product = createTag('div', { class: 'blog-article-marquee-product' });
  const mediaWrapper = createTag('div', { class: 'blog-article-marquee-product-media' });
  const copyWrapper = createTag('div', { class: 'blog-article-marquee-product-copy' });

  const picture = column.querySelector('picture, img');
  if (picture) {
    const pictureParent = picture.parentElement;
    mediaWrapper.append(picture);
    if (pictureParent && pictureParent !== column && pictureParent.childElementCount === 0) {
      pictureParent.remove();
    }
    const productImg = mediaWrapper.querySelector('img');
    if (productImg) {
      const targetWidth = getResponsiveWidth(PRODUCT_IMAGE_WIDTHS, PRODUCT_IMAGE_WIDTHS.desktop);
      optimizeImage(productImg, {
        width: targetWidth,
        eager: false,
        preconnect: false,
      });
    }
    product.append(mediaWrapper);
  }

  const heading = findHeading(column);
  if (heading) {
    heading.classList.add('blog-article-marquee-product-name');
    copyWrapper.append(heading);
  }

  column.querySelectorAll('p').forEach((para) => {
    if (!para.querySelector('picture, img')) {
      copyWrapper.append(para);
    }
  });

  cleanEmptyElements(copyWrapper);

  if (!copyWrapper.childElementCount) {
    copyWrapper.remove();
  } else {
    product.append(copyWrapper);
  }

  column.querySelectorAll('*').forEach((node) => {
    if (node instanceof HTMLElement && node.childElementCount === 0 && !node.textContent.trim()) {
      node.remove();
    }
  });
  cleanEmptyElements(column);

  return product.childElementCount ? product : null;
}

function buildProductHighlight(rows) {
  if (!rows.length) return null;

  const row = rows.find((candidate) => candidate.querySelector('div'));
  if (!row) return null;

  const highlight = extractProductHighlight(row);
  rows.forEach((extraRow) => extraRow.remove());

  if (!highlight) return null;
  const wrapper = createTag('div', { class: 'blog-article-marquee-products' });
  wrapper.append(highlight);
  return wrapper;
}

function decorateContentColumn(column, extraRows = []) {
  column.classList.add('blog-article-marquee-content');
  column.querySelectorAll('p').forEach((para) => {
    if (!para.textContent.trim()) para.remove();
  });
  const headline = findHeading(column);
  if (headline) {
    const eyebrow = headline.previousElementSibling;
    if (eyebrow?.tagName === 'P') eyebrow.classList.add('blog-article-marquee-eyebrow');
  }

  const productHighlight = buildProductHighlight(extraRows);
  if (productHighlight) {
    const ctaContainer = column.querySelector('p:has(a)');
    if (ctaContainer?.parentElement) {
      ctaContainer.parentElement.insertBefore(productHighlight, ctaContainer);
    } else {
      column.append(productHighlight);
    }
  }

  // column.querySelectorAll('p:has(a)').forEach((para) => {
  //   const button = para.querySelector('a.button, a.con-button');
  //   if (button) para.classList.add('button-container');
  // });
}

function decorateMediaColumn(column) {
  column.classList.add('blog-article-marquee-media');
  const img = column.querySelector('img');
  if (!img) return;
  const columnWidth = Math.round(column.getBoundingClientRect().width);
  const targetWidth = columnWidth || getResponsiveWidth(HERO_IMAGE_WIDTHS, HERO_IMAGE_WIDTHS.desktop);
  optimizeImage(img, {
    width: targetWidth,
    eager: true,
    priority: 'high',
    preload: true,
  });
  img.classList.add('blog-article-marquee-media-image');
}

function prepareStructure(block) {
  const rows = [...block.children].filter((row) => row.tagName === 'DIV');
  if (!rows.length) return { mainRow: null, extraRows: [] };

  const [mainRow, ...extraRows] = rows;
  const wrapper = createTag('div', { class: 'blog-article-marquee-inner' });
  block.replaceChildren(wrapper);
  wrapper.append(mainRow, ...extraRows);

  mainRow.classList.add('blog-article-marquee-row');
  const columns = [...mainRow.children].filter((col) => col.tagName === 'DIV');
  columns.forEach((col) => col.classList.add('column'));

  let contentColumn = columns.find((col) => !isPictureOnlyColumn(col));
  if (!contentColumn) [contentColumn] = columns;
  const mediaColumn = columns.find((col) => col !== contentColumn && isPictureOnlyColumn(col))
    || columns.find((col) => col !== contentColumn) || null;

  return {
    wrapper,
    mainRow,
    contentColumn,
    mediaColumn,
    extraRows,
  };
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  //
  const { decorateButtons } = await import(`${getLibs()}/utils/decorate.js`);
  console.log(decorateButtons);
  block.classList.add('blog-article-marquee');


  const {
    wrapper,
    mainRow,
    contentColumn,
    mediaColumn,
    extraRows,
  } = prepareStructure(block);

  if (!mainRow || !contentColumn) return;

  decorateContentColumn(contentColumn, extraRows);
  if (mediaColumn) decorateMediaColumn(mediaColumn);
  decorateButtons(block, 'button-xl');
  wrapper.classList.add('blog-article-marquee-ready',);
}
