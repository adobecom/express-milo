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

function replacePromptTokenInUrl(url, promptText) {
  if (!url || !promptText) return url;
  const encodedPrompt = encodeURIComponent(promptText).replace(/%20/g, '+');
  // Match encoded and unencoded token variants, single or double braces, with space or hyphen
  const patterns = [
    /%7B%7B?prompt(?:%20|-)text%7D%7D?/gi, // encoded {prompt-text} or {{prompt text}}
    /\{\{?prompt(?:\s|-)text\}\}?/gi,   // unencoded {prompt-text} or {{prompt text}}
  ];
  let result = url;
  patterns.forEach((re) => { result = result.replace(re, encodedPrompt); });
  return result;
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

  // Ensure a CTA button exists, promoting a plain link if authored as text (ax-columns approach)
  let cta = block.querySelector('a.button, a.con-button');
  if (!cta) {
    const lastParagraph = block.querySelector('p:last-of-type');
    const candidateLink = lastParagraph?.querySelector(':scope > a:not(.button)');
    const shouldPromote = !!(candidateLink
      && lastParagraph.childElementCount === 1
      && lastParagraph.textContent.trim() === candidateLink.textContent.trim());
    if (shouldPromote) {
      candidateLink.classList.add('button', 'accent', 'primaryCTA', 'xlarge');
      lastParagraph.classList.add('button-container');
      cta = candidateLink;
    }
  }

  // Inject an inline text input to the right of the CTA button, when present
  if (cta) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter your business name';
    input.className = 'logo-marquee-input';

    const container = cta.closest('.button-container') || cta.parentElement;
    container.classList.add('cta-with-input');
    // Mobile: input above CTA (achieved with CSS orders). Desktop: swap order so CTA is right of input
    container.prepend(input);

    // Submit on Enter delegates to CTA click
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        cta.click();
      }
    });

    // Cache original href so repeated clicks always start from tokenized URL
    cta.dataset.originalHref = cta.getAttribute('href');

    // Replace {prompt-text} token (and set input param) in CTA href on click
    const onCtaClick = (e) => {
      e.stopPropagation();
      e.preventDefault();
     
      const value = input.value?.trim();
      const baseHref = cta.href || cta.dataset.originalHref;
      // If no value, keep normal behavior
      if (!value) return;

      const nextUrlStr = replacePromptTokenInUrl(baseHref, value);
      e.preventDefault();
      window.location.assign(nextUrlStr);
    };

    // Use capture to ensure we run before any other navigation logic
    cta.addEventListener('click', onCtaClick, { capture: true });
  }
}

