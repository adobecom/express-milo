import { getLibs } from '../../scripts/utils.js';
import buildCarousel from '../../scripts/widgets/carousel.js';
import {
  decorateButtonsDeprecated,
  addTempWrapperDeprecated,
} from '../../scripts/utils/decorate.js';

import { fetchRelevantRows } from '../../scripts/utils/relevant.js';

let replaceKey;
let getConfig;
const placeholdersProm = import(`${getLibs()}/features/placeholders.js`).then((mod) => {
  ({ replaceKey } = mod);
});
const utilsProm = import(`${getLibs()}/utils/utils.js`).then((mod) => {
  ({ getConfig } = mod);
});
await Promise.all([placeholdersProm, utilsProm]);
const DEFAULT_VARIANT = 'default';
const SMART_VARIANT = 'smart';

export function normalizeHeadings(block, allowedHeadings) {
  const allowed = allowedHeadings.map((h) => h.toLowerCase());
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((tag) => {
    const h = tag.tagName.toLowerCase();
    if (allowed.indexOf(h) === -1) {
      // current heading is not in the allowed list -> try first to "promote" the heading
      let level = parseInt(h.charAt(1), 10) - 1;
      while (allowed.indexOf(`h${level}`) === -1 && level > 0) {
        level -= 1;
      }
      if (level === 0) {
        // did not find a match -> try to "downgrade" the heading
        while (allowed.indexOf(`h${level}`) === -1 && level < 7) {
          level += 1;
        }
      }
      if (level !== 7) {
        tag.outerHTML = `<h${level}>${tag.textContent.trim()}</h${level}>`;
      }
    }
  });
}

async function loadSpreadsheetData(block, relevantRowsData) {
  const defaultContainer = block.querySelector('.button-container');
  const defaultContainerParent = defaultContainer.parentElement;

  relevantRowsData.linkListCategories.split('\n').forEach((listData) => {
    const list = listData.split(',');
    const listEl = defaultContainer.cloneNode(true);

    listEl.innerHTML = listEl.innerHTML.replaceAll('Default', list[0].trim());
    listEl.innerHTML = listEl.innerHTML.replace(
      '/express/templates/default',
      list[1].trim(),
    );

    defaultContainerParent.append(listEl);
  });

  defaultContainer.remove();

  if (relevantRowsData.linkListTitle) {
    block.innerHTML = block.innerHTML.replaceAll(
      'link-list-title',
      relevantRowsData.linkListTitle.trim(),
    );
  }
}

const formatBlockLinks = (links, variant, baseURL) => {
  if (!links || variant !== SMART_VARIANT || !baseURL) {
    return;
  }
  const formattedURL = `${baseURL}?acomx-dno=true&category=templates`;
  links.forEach((p) => {
    const a = p.querySelector('a');
    a.href = `${formattedURL}&q=${a.title}`;
  });
};

const toggleLinksHighlight = (links, variant) => {
  if (variant === SMART_VARIANT) {
    return;
  }
  links.forEach((l) => {
    const a = l.querySelector(':scope > a');
    if (a) {
      l.classList.toggle('active', a.href === window.location.href);
    }
  });
};

export default async function decorate(block) {
  let variant = DEFAULT_VARIANT;
  if (block.classList.contains(SMART_VARIANT)) {
    variant = SMART_VARIANT;
  }
  addTempWrapperDeprecated(block, 'link-list');
  decorateButtonsDeprecated(block);
  const options = {};

  if (block.classList.contains('spreadsheet-powered')) {
    const relevantRowsData = await fetchRelevantRows(window.location.pathname);

    if (relevantRowsData && relevantRowsData.linkListCategories) {
      await loadSpreadsheetData(block, relevantRowsData);
    } else {
      block.remove();
    }
  }

  if (block.classList.contains('center')) {
    options.centerAlign = true;
  }

  normalizeHeadings(block, ['h3']);
  const links = [...block.querySelectorAll('p.button-container')];
  if (links.length) {
    links.forEach((p) => {
      const link = p.querySelector('a');
      if (!block.classList.contains('shaded')) {
        link.classList.add('secondary');
      }

      link.classList.add('medium');
      link.classList.remove('accent');
    });
    const platformEl = document.createElement('div');
    platformEl.classList.add('link-list-platform');
    await buildCarousel('p.button-container', block, options);
  }

  if (block.classList.contains('shaded')) {
    toggleLinksHighlight(links, variant);
  }

  window.addEventListener('popstate', () => {
    toggleLinksHighlight(links, variant);
  });

  if (window.location.href.includes('/express/templates/')) {
    const { default: updateAsyncBlocks } = await import(
      '../../scripts/utils/template-ckg.js'
    );
    await updateAsyncBlocks();
  }

  const searchBrankLinks = await replaceKey('search-branch-links', getConfig());
  formatBlockLinks(links, variant, searchBrankLinks);
}
