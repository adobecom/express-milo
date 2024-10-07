/* eslint-disable import/named, import/extensions */
import { getLibs, readBlockConfig } from '../../scripts/utils.js';

const { createTag, getConfig } = await import(`${getLibs()}/utils/utils.js`);

async function fetchIndex(indexURL) {
  try {
    const resp = await fetch(indexURL);
    const json = await resp.json();
    // eslint-disable-next-line no-console
    console.log(`${indexURL}: ${json.data.length}`);
    return (json.data);
  } catch (e) {
    // something went wrong
    return ([]);
  }
}

function outputPages(filteredPages, $block) {
  filteredPages.forEach((page) => {
    const p = createTag('p');
    p.innerHTML = `<a href="${page.path}">${page.shortTitle}</a>`;
    $block.appendChild(p);
  });
}

function addPages(pages, config, $block) {
  $block.innerHTML = '';
  $block.setAttribute('data-filter', config.filter);

  const filteredPages = pages.filter((page) => {
    const path = page.path.split('.')[0];
    const $existing = document.querySelector(`a[href="${path}"]`);
    if ($existing) {
      const $pageList = $existing.closest('.page-list');
      if ($pageList && $pageList.getAttribute('data-filter').length < config.filter.length) {
        $existing.remove();
        return true;
      }
      return false;
    }
    return true;
  });

  outputPages(filteredPages, $block);
}

async function decoratePageList($block) {
  const config = readBlockConfig($block);

  const { prefix } = getConfig().locale;
  const indexURL = `${prefix}/express/query-index.json`;
  const index = await fetchIndex(indexURL);
  const shortIndex = index.filter((e) => (e.shortTitle
    && e.path && e.path.includes(config.filter)));
  shortIndex.sort((e1, e2) => e1.shortTitle.localeCompare(e2.shortTitle));

  addPages(shortIndex, config, $block);
  $block.classList.add('appear');
}

export default async function decorate($block) {
  return decoratePageList($block);
}
