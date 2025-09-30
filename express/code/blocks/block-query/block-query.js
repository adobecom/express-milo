const TOP_K = 5;

function qs(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function tokenize(value) {
  return String(value || '')
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function jaccardScore(tokensA, tokensB) {
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  if (setA.size === 0 && setB.size === 0) return 0;
  let intersection = 0;
  setA.forEach((token) => {
    if (setB.has(token)) intersection += 1;
  });
  const union = setA.size + setB.size - intersection;
  return Math.round((intersection / (union || 1)) * 100);
}

function exactMatchUrls(blockMapObj, tokens) {
  if (!Array.isArray(tokens) || tokens.length === 0) return [];
  const urls = [];
  const seen = new Set();

  Object.values(blockMapObj || {}).forEach((data) => {
    const classNames = (data.class_names || [])
      .map((item) => String(item || '').toLowerCase());
    const classSet = new Set(classNames);
    const matchesAll = tokens.every((token) => classSet.has(token));
    if (!matchesAll) return;

    (data.urls || []).forEach((url) => {
      if (!seen.has(url)) {
        seen.add(url);
        urls.push(url);
      }
    });
  });

  return urls;
}

function topSimilarCombos(blockMapObj, query, topK = TOP_K) {
  const queryTokens = tokenize(query);
  const seen = new Set();
  const candidates = [];

  Object.entries(blockMapObj || {}).forEach(([hashKey, data]) => {
    const classes = (data.class_names || [])
      .map((item) => String(item || '').trim().toLowerCase())
      .filter(Boolean);
    if (!classes.length) return;

    const combo = classes.slice().sort().join(' ');
    if (seen.has(combo)) return;
    seen.add(combo);

    const score = jaccardScore(queryTokens, tokenize(combo));
    candidates.push({ combo, score, hashKey });
  });

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, topK);
}

function renderList(listEl, items, renderItem) {
  listEl.innerHTML = '';
  if (!items || !items.length) {
    const li = document.createElement('li');
    li.className = 'muted';
    li.textContent = '(none)';
    listEl.append(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    li.append(renderItem(item));
    listEl.append(li);
  });
}

function makeLink(url) {
  const href = String(url || '');
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.textContent = href;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  return anchor;
}

function createComboElement(combo) {
  const wrapper = document.createElement('span');
  const text = document.createTextNode(combo.combo);
  const score = document.createElement('span');
  score.className = 'score';
  score.textContent = ` (${combo.score})`;
  wrapper.append(text, score);
  return wrapper;
}

function rewriteBranchUrl(url, branchName) {
  const branch = (branchName || '').trim();
  if (!branch) return url;
  const match = /^(https:\/\/)([^/]+?)--(.*)$/.exec(url);
  if (!match) return url;
  const [, scheme, , rest] = match;
  return `${scheme}${branch}--${rest}`;
}

function addMartechOff(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has('martech')) {
      parsed.searchParams.set('martech', 'off');
    }
    return parsed.toString();
  } catch (error) {
    return url;
  }
}

function uniquePreserveOrder(items) {
  const seen = new Set();
  const out = [];
  items.forEach((item) => {
    if (seen.has(item)) return;
    seen.add(item);
    out.push(item);
  });
  return out;
}

async function fetchBlockMap(url) {
  const response = await fetch(url, { credentials: 'omit' });
  if (!response.ok) {
    throw new Error(`Failed to fetch block map: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export default function decorate(block) {
  const authorLink = block.querySelector('a');
  const authorHref = authorLink?.href || '';
  const authorLabel = authorLink?.textContent?.trim() || authorHref;
  const queryParamUrl = qs('blockMapUrl') || qs('url') || '';

  let activeBlockMapUrl = queryParamUrl || authorHref;
  const activeBlockMapLabel = queryParamUrl ? queryParamUrl : authorLabel;

  block.textContent = '';

  const title = document.createElement('h2');
  title.textContent = 'Block Map Search';

  const description = document.createElement('p');
  description.className = 'muted';
  description.innerHTML = 'Click Load to fetch the configured block_map.json and then search by keywords. You can also pass <code>?blockMapUrl=...</code> in the page URL.';

  const loaderCard = document.createElement('div');
  loaderCard.className = 'card stack block-query-loader';

  const loaderGrid = document.createElement('div');
  loaderGrid.className = 'grid';

  const sourceField = document.createElement('div');
  sourceField.className = 'block-query-source';

  const sourceLabel = document.createElement('span');
  sourceLabel.className = 'muted';
  sourceLabel.textContent = 'Block map';

  const sourceValue = document.createElement('div');
  sourceValue.className = 'block-query-source-value';

  const sourceLink = document.createElement('a');
  sourceLink.className = 'block-query-map-link';
  sourceLink.target = '_blank';
  sourceLink.rel = 'noopener noreferrer';

  const loadButton = document.createElement('button');
  loadButton.className = 'block-query-load';
  loadButton.textContent = 'Load';

  sourceField.append(sourceLabel, sourceValue);
  loaderGrid.append(sourceField, loadButton);
  loaderCard.append(loaderGrid);

  const statusEl = document.createElement('div');
  statusEl.className = 'block-query-status muted';
  statusEl.textContent = 'Not loaded.';
  loaderCard.append(statusEl);

  const queryInput = document.createElement('input');
  queryInput.type = 'text';
  queryInput.placeholder = 'Type keywords (e.g. hero centered sticky)';
  queryInput.disabled = true;
  queryInput.className = 'block-query-query-input';

  const row = document.createElement('div');
  row.className = 'row';

  const exactCard = document.createElement('div');
  exactCard.className = 'card';

  const exactToolbar = document.createElement('div');
  exactToolbar.className = 'toolbar';

  const exactHeading = document.createElement('h3');
  exactHeading.textContent = 'Exact match (all keywords)';

  const exactControls = document.createElement('div');
  exactControls.className = 'block-query-exact-controls';

  const filterInput = document.createElement('input');
  filterInput.type = 'text';
  filterInput.placeholder = 'Filter URLs (substring)';
  filterInput.disabled = true;

  const copyButton = document.createElement('button');
  copyButton.title = 'Copy exact-match URLs to clipboard';
  copyButton.textContent = 'Copy URLs';
  copyButton.disabled = true;

  exactControls.append(filterInput, copyButton);
  exactToolbar.append(exactHeading, exactControls);

  const exactScroll = document.createElement('div');
  exactScroll.className = 'scroll';

  const exactList = document.createElement('ul');
  exactList.className = 'block-query-exact-list';
  exactScroll.append(exactList);

  const branchWidget = document.createElement('div');
  branchWidget.className = 'block-query-branch-widget';

  const branchTitle = document.createElement('h4');
  branchTitle.className = 'block-query-branch-title';
  branchTitle.textContent = 'Copy URLs for a branch';

  const branchHint = document.createElement('p');
  branchHint.className = 'muted block-query-branch-hint';
  branchHint.textContent = 'Overrides the branch on filtered URLs and removes duplicates before copying.';

  const branchControls = document.createElement('div');
  branchControls.className = 'block-query-branch-controls';

  const branchInputId = `block-query-branch-${Math.random().toString(36).slice(2, 8)}`;

  const branchLabel = document.createElement('label');
  branchLabel.className = 'block-query-branch-label';
  branchLabel.setAttribute('for', branchInputId);
  branchLabel.textContent = 'Branch name';

  const branchInput = document.createElement('input');
  branchInput.className = 'block-query-branch-input';
  branchInput.type = 'text';
  branchInput.id = branchInputId;
  branchInput.placeholder = 'feature-my-branch';

  const branchCopyButton = document.createElement('button');
  branchCopyButton.className = 'block-query-branch-copy';
  branchCopyButton.textContent = 'Copy branch URLs';
  branchCopyButton.disabled = true;

  branchControls.append(branchInput, branchCopyButton);
  branchWidget.append(branchTitle, branchHint, branchLabel, branchControls);

  exactCard.append(exactToolbar, exactScroll, branchWidget);

  const combosCard = document.createElement('div');
  combosCard.className = 'card';

  const combosHeading = document.createElement('h3');
  combosHeading.textContent = 'Top 5 similar class name combinations (combo, score)';

  const combosList = document.createElement('ul');
  combosList.className = 'block-query-combos-list';

  combosCard.append(combosHeading, combosList);
  row.append(exactCard, combosCard);

  block.append(title, description, loaderCard, queryInput, row);

  let blockMapData = null;
  let currentExact = [];
  let filteredExact = [];
  const statusBaseClass = 'block-query-status muted';

  function setStatus(message, variant = '', codeValue) {
    statusEl.className = statusBaseClass;
    if (variant) statusEl.classList.add(variant);

    statusEl.textContent = message || '';
    if (codeValue) {
      statusEl.append(' ');
      const codeEl = document.createElement('code');
      codeEl.textContent = codeValue;
      statusEl.append(codeEl);
    }
  }

  function updateSource(url, label) {
    sourceValue.innerHTML = '';
    activeBlockMapUrl = url || '';

    if (activeBlockMapUrl) {
      sourceLink.href = activeBlockMapUrl;
      sourceLink.textContent = label || activeBlockMapUrl;
      sourceValue.append(sourceLink);
      loadButton.disabled = false;
    } else {
      const placeholder = document.createElement('span');
      placeholder.className = 'muted';
      placeholder.textContent = 'Add a block map link in this block.';
      sourceValue.append(placeholder);
      loadButton.disabled = true;
    }

    return activeBlockMapUrl;
  }

  function applyUrlFilter(urls) {
    const filterValue = filterInput.value.trim().toLowerCase();
    if (!filterValue) return urls;
    return urls.filter((url) => String(url).toLowerCase().includes(filterValue));
  }

  function renderExactList() {
    copyButton.textContent = 'Copy URLs';
    branchCopyButton.textContent = 'Copy branch URLs';
    filteredExact = applyUrlFilter(currentExact);
    renderList(exactList, filteredExact, makeLink);
    const hasResults = filteredExact.length > 0;
    copyButton.disabled = !hasResults;
    const hasBranch = Boolean(branchInput.value.trim());
    branchCopyButton.disabled = !hasResults || !hasBranch;
  }

  function update() {
    if (!blockMapData) return;
    const tokens = tokenize(queryInput.value);

    currentExact = exactMatchUrls(blockMapData, tokens);
    renderExactList();

    const combos = topSimilarCombos(blockMapData, queryInput.value, TOP_K);
    renderList(combosList, combos, createComboElement);
  }

  async function loadBlockMap() {
    if (!activeBlockMapUrl) {
      setStatus('Please configure a block map link in the block.', 'err');
      return;
    }

    loadButton.disabled = true;
    setStatus('Loading', '', activeBlockMapUrl);

    try {
      blockMapData = await fetchBlockMap(activeBlockMapUrl);
      setStatus('Loaded', 'ok', activeBlockMapUrl);
      queryInput.disabled = false;
      filterInput.disabled = false;
      update();
      block.setAttribute('data-loaded-block-map', activeBlockMapUrl);
    } catch (error) {
      console.error(error);
      setStatus('Error loading block map. See console for details.', 'err');
    } finally {
      loadButton.disabled = !activeBlockMapUrl;
    }
  }

  loadButton.addEventListener('click', loadBlockMap);

  queryInput.addEventListener('input', () => {
    update();
  });

  filterInput.addEventListener('input', () => {
    if (!blockMapData) return;
    renderExactList();
  });

  branchInput.addEventListener('input', () => {
    branchCopyButton.textContent = 'Copy branch URLs';
    const hasBranch = Boolean(branchInput.value.trim());
    branchCopyButton.disabled = !hasBranch || filteredExact.length === 0;
  });

  branchCopyButton.addEventListener('click', async () => {
    const branchName = branchInput.value.trim();
    if (!branchName || !filteredExact.length) return;

    const rewritten = uniquePreserveOrder(
      filteredExact.map((url) => addMartechOff(rewriteBranchUrl(url, branchName))),
    );

    if (!rewritten.length) return;

    try {
      await navigator.clipboard.writeText(rewritten.join('\n'));
      branchCopyButton.textContent = 'Copied!';
      setTimeout(() => {
        branchCopyButton.textContent = 'Copy branch URLs';
      }, 1200);
    } catch (error) {
      console.error(error);
      // eslint-disable-next-line no-alert
      window.alert('Failed to copy to clipboard.');
    }
  });

  copyButton.addEventListener('click', async () => {
    if (!filteredExact.length) return;

    try {
      await navigator.clipboard.writeText(filteredExact.join('\n'));
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = 'Copy URLs';
      }, 1200);
    } catch (error) {
      console.error(error);
      // eslint-disable-next-line no-alert
      window.alert('Failed to copy to clipboard.');
    }
  });

  renderList(exactList, [], makeLink);
  renderList(combosList, [], createComboElement);

  const resolvedUrl = updateSource(activeBlockMapUrl, activeBlockMapLabel);

  if (!resolvedUrl) {
    setStatus('No block map URL configured. Add a link to this block.', 'err');
    return;
  }

  loadBlockMap();
}
