import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';

let createTag; let getMetadata; let getConfig;

function getOptimalImageSize() {
  if (window.innerWidth <= 600) return 400; // Mobile
  if (window.innerWidth <= 900) return 600; // Tablet
  return 900; // Desktop+
}

function addImagePreconnects(imageUrl) {
  if (!imageUrl) return;
  try {
    const url = new URL(imageUrl, window.location.href);
    if (url.origin !== window.location.origin) {
      const existingPreconnect = document.querySelector(`link[rel="preconnect"][href="${url.origin}"]`);
      if (!existingPreconnect) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url.origin;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    }
  } catch (e) {
    // ignore invalid URL
  }
}

function setBackgroundFromFirstRow(block, rows) {
  const background = rows[0];
  const bgImg = background?.querySelector('img');
  if (!bgImg) return;

  // remove background row from DOM
  block.firstElementChild?.remove();

  // optimize image URL and set CSS var
  const url = new URL(bgImg.src, window.location.href);
  const { pathname } = url;
  const width = getOptimalImageSize();
  const optimizedImageUrl = `${pathname}?width=${width}&format=webp&optimize=medium`;
  block.style.setProperty('--bg-image', `url("${optimizedImageUrl}")`);

  addImagePreconnects(bgImg.src);
}

function classifyAndOptimizeCells(block, rows) {
  let pictureCellCount = 0;
  rows.forEach((row) => {
    const cells = Array.from(row.children);
    cells.forEach((cell) => {
      cell.classList.add('column');

      // remove empty paragraphs
      cell.querySelectorAll(':scope p:empty').forEach(($p) => {
        if ($p.innerHTML.trim() === '') $p.remove();
      });

      const childEls = [...cell.children];
      const isPictureColumn = childEls.every((el) => ['BR', 'PICTURE'].includes(el.tagName)) && childEls.length > 0;
      if (!isPictureColumn) return;

      pictureCellCount += 1;
      cell.classList.add('column-picture');
      if (pictureCellCount === 2) cell.classList.add('column-picture-mobile');

      // Optimize marquee images following ax-columns behavior:
      // - Eager and preload only the visible image variant for current viewport
      // - Keep hidden variant lazy
      const isMobileVariant = cell.classList.contains('column-picture-mobile');
      const visibleOnMobile = isMobileVariant;
      const visibleOnDesktop = !isMobileVariant;
      const isDesktop = window.matchMedia('(min-width: 900px)').matches;

      const shouldEagerLoad = (isDesktop && visibleOnDesktop) || (!isDesktop && visibleOnMobile);

      const img = cell.querySelector('img');
      if (img) {
        const srcUrl = new URL(img.src, window.location.href);
        const { pathname } = srcUrl;
        const optimalWidth = getOptimalImageSize();
        const newSrc = `${pathname}?width=${optimalWidth}&format=webp&optimize=medium`;
        if (img.src !== newSrc) img.src = newSrc;
        img.setAttribute('width', optimalWidth);
        img.setAttribute('height', Math.round(optimalWidth * (352 / 600)));

        if (shouldEagerLoad) {
          img.removeAttribute('loading');
          img.setAttribute('loading', 'eager');
          img.setAttribute('fetchpriority', 'high');
          addImagePreconnects(img.src);
          if (pictureCellCount === 1 && !document.querySelector(`link[href="${img.src}"]`)) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src;
            document.head.appendChild(link);
          }
        } else {
          img.setAttribute('loading', 'lazy');
          img.removeAttribute('fetchpriority');
        }
      }
    });
  });
}

export default async function decorate(block) {
  ({ createTag, getMetadata, getConfig } = await import(`${getLibs()}/utils/utils.js`));
  const { decorateButtons } = await import(`${getLibs()}/utils/decorate.js`);
  decorateButtons(block, 'button-xxl');

  const rows = Array.from(block.children);
  if (!rows.length) return;

  // background from first row
  setBackgroundFromFirstRow(block, rows);

  // width-N-columns based on first content row
  const firstContentRow = block.firstElementChild;
  const numCols = firstContentRow ? firstContentRow.children.length : 0;
  if (numCols) block.classList.add(`width-${numCols}-columns`);

  // classify columns and optimize images
  classifyAndOptimizeCells(block, Array.from(block.children));

  // optional: inject express logo via metadata flag
  if (['on', 'yes'].includes(getMetadata('marquee-inject-logo')?.toLowerCase())) {
    const logo = getIconElementDeprecated('adobe-express-logo');
    logo.classList.add('express-logo');
    block.querySelector('.column')?.prepend(logo);
  }
}

