import { getLibs } from '../../scripts/utils.js';

let createTag;
let getMetadata;

const MOBILE_MAX = 600;
const TABLET_MAX = 900;
const HERO_IMAGE_WIDTHS = { mobile: 480, tablet: 720, desktop: 960 };
const PRECONNECT_DATA_ATTRIBUTE = 'blogArticleMarquee';
const PRODUCT_ICON_PATH = '/express/code/blocks/blog-article-marquee/author.png';

const METADATA_KEYS = {
  eyebrow: 'blog-article-eyebrow',
  headline: 'blog-article-title',
  subcopy: 'blog-article-subheading',
  productName: 'blog-article-product-name',
  date: 'blog-article-date',
  productCopy: 'blog-article-description',
};

function getBlogArticleMarqueeMetadata() {
  if (!getMetadata) return {};
  const sanitize = (value) => (typeof value === 'string' ? value.trim() : '');
  const meta = Object.entries(METADATA_KEYS).reduce((acc, [key, metaName]) => {
    const metaValue = sanitize(getMetadata(metaName));
    if (metaValue) acc[key] = metaValue;
    return acc;
  }, {});
  if (meta.productCopy) {
    meta.productCopy = meta.productCopy
      .split(/\r?\n+|[|]{2,}/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return meta;
}

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
  if (!column) return false;
  const media = column.querySelectorAll('picture, img');
  if (!media.length) return false;
  const nonDecorativeChildren = [...column.children]
    .filter((el) => !['BR', 'PICTURE'].includes(el.tagName) && !(el.tagName === 'IMG' && el.closest('picture')));
  return nonDecorativeChildren.length === 0;
}

function buildProductHighlight(metadata = {}) {
  const { productName, date } = metadata;
  const productCopy = Array.isArray(metadata.productCopy) ? metadata.productCopy : [];
  const hasContent = productName || date || productCopy.length;
  if (!hasContent) return null;

  const wrapper = createTag('div', { class: 'blog-article-marquee-products' });
  const product = createTag('div', { class: 'blog-article-marquee-product' });

  if (PRODUCT_ICON_PATH) {
    const mediaWrapper = createTag('div', { class: 'blog-article-marquee-product-media' });
    const logoAlt = productName ? `${productName} logo` : 'Product logo';
    const logoImg = createTag('img', {
      src: PRODUCT_ICON_PATH,
      alt: logoAlt,
      loading: 'lazy',
      decoding: 'async',
    });
    mediaWrapper.append(logoImg);
    product.append(mediaWrapper);
  }

  const copyWrapper = createTag('div', { class: 'blog-article-marquee-product-copy' });
  if (productName) {
    copyWrapper.append(createTag('p', { class: 'blog-article-marquee-product-name' }, productName));
  }
  productCopy.forEach((paragraph) => {
    copyWrapper.append(createTag('p', null, paragraph));
  });
  if (date) {
    copyWrapper.append(createTag('p', { class: 'blog-article-marquee-product-date' }, date));
  }

  if (copyWrapper.childElementCount) product.append(copyWrapper);
  if (!product.childElementCount) return null;

  wrapper.append(product);
  return wrapper;
}

function decorateContentColumn(column, metadata = {}, ctaNode = null, fallbackNodes = []) {
  column.classList.add('blog-article-marquee-content');
  column.textContent = '';

  const availableFallback = [...fallbackNodes];
  const takeFallback = (predicate) => {
    const index = availableFallback.findIndex((node) => node.nodeType === Node.ELEMENT_NODE && predicate(node));
    if (index === -1) return null;
    const [node] = availableFallback.splice(index, 1);
    return node;
  };

  if (metadata.eyebrow) {
    column.append(createTag('p', { class: 'blog-article-marquee-eyebrow' }, metadata.eyebrow));
  } else {
    const fallbackEyebrow = takeFallback((node) => node.matches?.('p'));
    if (fallbackEyebrow) {
      fallbackEyebrow.classList.add('blog-article-marquee-eyebrow');
      column.append(fallbackEyebrow);
    }
  }

  if (metadata.headline) {
    column.append(createTag('h1', null, metadata.headline));
  } else {
    const fallbackHeadline = takeFallback((node) => /^H[1-6]$/.test(node.tagName));
    if (fallbackHeadline) column.append(fallbackHeadline);
  }

  if (metadata.subcopy) {
    column.append(createTag('p', { class: 'blog-article-marquee-subcopy' }, metadata.subcopy));
  } else {
    const fallbackParagraph = takeFallback((node) => node.tagName === 'P');
    if (fallbackParagraph) {
      fallbackParagraph.classList.add('blog-article-marquee-subcopy');
      column.append(fallbackParagraph);
    }
  }

  const productHighlight = buildProductHighlight(metadata);
  if (productHighlight) column.append(productHighlight);

  if (ctaNode) column.append(ctaNode);
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

function extractCTA(row) {
  if (!row) return null;
  const container = row.querySelector('p:has(a), div:has(a), a');
  if (!container) return null;
  const target = container.closest('p, div') || container;
  target.remove();
  target.classList.add('button-container');
  return target;
}

function prepareStructure(block) {
  const rows = [...block.children].filter((row) => row.tagName === 'DIV');
  if (!rows.length) {
    const wrapperFallback = createTag('div', { class: 'blog-article-marquee-inner' });
    const mainRowFallback = createTag('div', { class: 'blog-article-marquee-row' });
    wrapperFallback.append(mainRowFallback);
    block.replaceChildren(wrapperFallback);
    const content = createTag('div', { class: 'column blog-article-marquee-content' });
    const media = createTag('div', { class: 'column blog-article-marquee-media' });
    mainRowFallback.append(content, media);
    return {
      wrapper: wrapperFallback,
      mainRow: mainRowFallback,
      contentColumn: content,
      mediaColumn: media,
      ctaNode: null,
      fallbackNodes: [],
    };
  }

  const [imageRow, ...maybeCtaRows] = rows;
  const wrapper = createTag('div', { class: 'blog-article-marquee-inner' });
  block.replaceChildren(wrapper);

  const mainRow = createTag('div', { class: 'blog-article-marquee-row' });
  wrapper.append(mainRow);

  const contentColumn = createTag('div', { class: 'column blog-article-marquee-content' });
  const mediaColumn = createTag('div', { class: 'column blog-article-marquee-media' });
  mainRow.append(contentColumn, mediaColumn);

  const fallbackNodes = [];

  if (imageRow) {
    const columns = [...imageRow.children].filter((col) => col.tagName === 'DIV');
    const processColumn = (col) => {
      if (isPictureOnlyColumn(col)) {
        while (col.firstChild) {
          const child = col.firstChild;
          mediaColumn.append(child);
        }
      } else {
        while (col.firstChild) {
          const child = col.firstChild;
          if (child.nodeType === Node.ELEMENT_NODE) fallbackNodes.push(child);
        }
      }
      col.remove();
    };

    if (columns.length) {
      columns.forEach(processColumn);
    } else {
      processColumn(imageRow);
    }

    imageRow.remove();
  }

  const ctaNode = extractCTA(maybeCtaRows.find((row) => row.querySelector('a')));

  return {
    wrapper,
    mainRow,
    contentColumn,
    mediaColumn,
    ctaNode,
    fallbackNodes,
  };
}

export default async function decorate(block) {
  ({ createTag, getMetadata } = await import(`${getLibs()}/utils/utils.js`));
  const { decorateButtons } = await import(`${getLibs()}/utils/decorate.js`);
  block.classList.add('blog-article-marquee');

  const metadata = getBlogArticleMarqueeMetadata();

  const {
    wrapper,
    mainRow,
    contentColumn,
    mediaColumn,
    ctaNode,
    fallbackNodes,
  } = prepareStructure(block);

  if (!mainRow || !contentColumn) return;

  decorateContentColumn(contentColumn, metadata, ctaNode, fallbackNodes);
  if (mediaColumn) decorateMediaColumn(mediaColumn);
  decorateButtons(block, 'button-xl');
  wrapper.classList.add('blog-article-marquee-ready');
}
