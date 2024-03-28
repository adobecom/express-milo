import { getLibs } from '../../scripts/utils.js';
import buildCarousel from '../shared/carousel.js';
import {
  decorateButtonsDeprecated,
  addTempWrapperDeprecated,
} from '../../scripts/utils/decorate.js';

const { getConfig, getEnv } = await import(`${getLibs()}/utils/utils.js`);

async function fetchRelevantRows(path) {
  if (!window.relevantRows) {
    try {
      const { prefix } = getConfig().locale;
      const resp = await fetch(`${prefix}/express/relevant-rows.json`);
      window.relevantRows = resp.ok ? (await resp.json()).data : [];
    } catch {
      const resp = await fetch('/express/relevant-rows.json');
      window.relevantRows = resp.ok ? (await resp.json()).data : [];
    }
  }

  if (window.relevantRows.length) {
    const relevantRow = window.relevantRows.find((p) => path === p.path);
    const env = getEnv(getConfig());

    if (env && env.name === 'stage') {
      return relevantRow || null;
    }

    return relevantRow && relevantRow.live !== 'N' ? relevantRow : null;
  }

  return null;
}

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

export default async function decorate(block) {
  addTempWrapperDeprecated(block, 'link-list');
  decorateButtonsDeprecated(block);

  const options = {};
  const toggleLinksHighlight = (links) => {
    links.forEach((l) => {
      const a = l.querySelector(':scope > a');

      if (a) {
        l.classList.toggle('active', a.href === window.location.href);
      }
    });
  };

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
    toggleLinksHighlight(links);
  }

  window.addEventListener('popstate', () => {
    toggleLinksHighlight(links);
  });

  if (window.location.href.includes('/express/templates/')) {
    const { default: updateAsyncBlocks } = await import(
      '../../scripts/utils/template-ckg.js'
    );
    await updateAsyncBlocks();
  }
}
