import { getLibs, getIconElementDeprecated, decorateButtonsDeprecated, addTempWrapperDeprecated } from '../../scripts/utils.js';
import BlockMediator from '../../scripts/block-mediator.min.js';
import { trackSearch, generateSearchId } from '../../scripts/template-search-api-v3.js';

let createTag; let getConfig;
let replaceKeyArray; let blockConfig;

// Search configuration constants
const SEARCH_CONFIG = {
  THROTTLE_DELAY: 300,
  DEBOUNCE_DELAY: 500,
  SUGGESTIONS_LIMIT: 7,
};

// Key codes for keyboard navigation
const KEY_CODES = {
  ARROW_DOWN: 40,
  ARROW_UP: 38,
  ESCAPE: 27,
  ENTER: 13,
};

// Default text values
const DEFAULT_TEXT = {
  SEARCH_PLACEHOLDER: 'Search for over 50,000 templates',
  SEARCH_HINT: 'Search',
};

// CSS class constants
const CSS_CLASSES = {
  SEARCH_BAR_WRAPPER: 'search-bar-wrapper',
  SEARCH_DROPDOWN: 'search-dropdown-container',
  SUGGESTIONS_LIST: 'suggestions-list',
  HIDDEN: 'hidden',
  SEARCH_INPUT_WRAPPER: 'search-input-wrapper',
};

function cycleThroughSuggestions(block, targetIndex = 0) {
  const suggestions = block.querySelectorAll(`.${CSS_CLASSES.SUGGESTIONS_LIST} li`);
  const searchBar = block.querySelector('input.search-bar');

  // If trying to go before first suggestion, return to search input
  if (targetIndex < 0) {
    searchBar.focus();
    return;
  }

  if (targetIndex >= suggestions.length) return;

  // Make all suggestions focusable when keyboard navigation starts
  suggestions.forEach((suggestion) => {
    suggestion.setAttribute('tabindex', '0');
  });

  if (suggestions.length > 0) suggestions[targetIndex].focus();
}

/**
 * Builds configuration object from block HTML structure (Word document approach)
 * @param {HTMLElement} block - The block element
 * @returns {Object} Configuration object with key-value pairs from the Word doc
 */
function buildSearchConfig(block) {
  const searchConfig = {};
  const rows = Array.from(block.children);

  // Read all rows to build the configuration
  rows.forEach((row) => {
    const cells = Array.from(row.children);

    if (cells.length >= 2) {
      const key = cells[0]?.textContent?.trim();
      const value = cells.length > 1
        ? Array.from(cells.slice(1))
          .map((cell) => cell?.textContent?.trim())
          .filter((text) => text !== undefined)
          .join(' ')
        : '';

      if (key) {
        searchConfig[key] = value;
      }
    }
  });

  return searchConfig;
}

function initSearchFunction(block, searchBarWrapper) {
  const searchDropdown = searchBarWrapper.querySelector(`.${CSS_CLASSES.SEARCH_DROPDOWN}`);
  const searchForm = searchBarWrapper.querySelector('.search-form');
  const searchBar = searchBarWrapper.querySelector('input.search-bar');
  const clearBtn = searchBarWrapper.querySelector('.icon-search-clear');
  const trendsContainer = searchBarWrapper.querySelector('.trends-container');
  const suggestionsContainer = searchBarWrapper.querySelector('.suggestions-container');
  const suggestionsList = searchBarWrapper.querySelector(`.${CSS_CLASSES.SUGGESTIONS_LIST}`);

  clearBtn.style.display = 'none';

  const searchBarWatcher = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) {
      BlockMediator.set('stickySearchBar', {
        element: searchBarWrapper.cloneNode(true),
        loadSearchBar: true,
      });
    } else {
      BlockMediator.set('stickySearchBar', {
        element: searchBarWrapper.cloneNode(true),
        loadSearchBar: false,
      });
    }
  }, { rootMargin: '0px', threshold: 1 });

  searchBarWatcher.observe(searchBarWrapper);

  searchBar.addEventListener('click', (e) => {
    e.stopPropagation();
    searchBar.scrollIntoView({ behavior: 'smooth' });
    searchDropdown.classList.remove(CSS_CLASSES.HIDDEN);
  }, { passive: true });

  searchBar.addEventListener('keyup', () => {
    if (searchBar.value !== '') {
      clearBtn.style.display = 'inline-block';
      trendsContainer.classList.add(CSS_CLASSES.HIDDEN);
      suggestionsContainer.classList.remove(CSS_CLASSES.HIDDEN);
    } else {
      clearBtn.style.display = 'none';
      trendsContainer.classList.remove(CSS_CLASSES.HIDDEN);
      suggestionsContainer.classList.add(CSS_CLASSES.HIDDEN);
    }
  }, { passive: true });

  searchBar.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.keyCode === KEY_CODES.ARROW_DOWN) {
      e.preventDefault();
      cycleThroughSuggestions(block);
    } else if (e.key === 'ArrowUp' || e.keyCode === KEY_CODES.ARROW_UP) {
      e.preventDefault();
      const suggestions = block.querySelectorAll('.suggestions-list li');
      if (suggestions.length > 0) {
        cycleThroughSuggestions(block, suggestions.length - 1);
      }
    } else if (e.key === 'Escape' || e.keyCode === KEY_CODES.ESCAPE) {
      searchDropdown.classList.add(CSS_CLASSES.HIDDEN);
      searchBar.blur();
    }
  });

  document.addEventListener('click', (e) => {
    const { target } = e;
    if (target !== searchBarWrapper && !searchBarWrapper.contains(target)) {
      searchDropdown.classList.add(CSS_CLASSES.HIDDEN);
    }
  }, { passive: true });

  const redirectSearch = async () => {
    const { 'search-destination': searchDestination } = blockConfig;

    // If destination is authored, use simple redirect with query param
    if (searchDestination && searchDestination.trim() !== '') {
      trackSearch('search-inspire');

      const searchQuery = searchBar.value || '';
      const separator = searchDestination.includes('?') ? '&' : '?';
      const targetLocation = `${searchDestination}${separator}q=${encodeURIComponent(searchQuery)}`;

      window.location.assign(targetLocation);
    }
  };

  const onSearchSubmit = async () => {
    const { sampleRUM } = await import(`${getLibs()}/utils/samplerum.js`);
    searchBar.disabled = true;
    sampleRUM('search', {
      source: block.dataset.blockName,
      target: searchBar.value,
    }, 1);
    await redirectSearch();
  };

  async function handleSubmitInteraction(item) {
    if (item.query !== searchBar.value) {
      searchBar.value = item.query;
      searchBar.dispatchEvent(new Event('input'));
    }
    await onSearchSubmit();
  }

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await onSearchSubmit();
  });

  clearBtn.addEventListener('click', () => {
    searchBar.value = '';
    suggestionsList.innerHTML = '';
    trendsContainer.classList.remove(CSS_CLASSES.HIDDEN);
    suggestionsContainer.classList.add(CSS_CLASSES.HIDDEN);
    clearBtn.style.display = 'none';
  }, { passive: true });

  const suggestionsListUIUpdateCB = (suggestions) => {
    suggestionsList.innerHTML = '';
    const searchBarVal = searchBar.value.toLowerCase();
    if (suggestions && !(suggestions.length <= 1 && suggestions[0]?.query === searchBarVal)) {
      suggestions.forEach((item, index) => {
        const li = createTag('li', { tabindex: -1 }); // Start unfocusable
        const valRegEx = new RegExp(searchBar.value, 'i');
        li.innerHTML = item.query.replace(valRegEx, `<b>${searchBarVal}</b>`);
        li.addEventListener('click', async () => {
          await handleSubmitInteraction(item, index);
        });

        li.addEventListener('keydown', async (e) => {
          if (e.key === 'Enter' || e.keyCode === KEY_CODES.ENTER) {
            await handleSubmitInteraction(item, index);
          }
        });

        li.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowDown' || e.keyCode === KEY_CODES.ARROW_DOWN) {
            e.preventDefault();
            cycleThroughSuggestions(block, index + 1);
          }
        });

        li.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowUp' || e.keyCode === KEY_CODES.ARROW_UP) {
            e.preventDefault();
            cycleThroughSuggestions(block, index - 1);
          }
        });

        li.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' || e.keyCode === KEY_CODES.ESCAPE) {
            e.preventDefault();
            searchBar.focus();
            searchDropdown.classList.add(CSS_CLASSES.HIDDEN);
          }
        });

        suggestionsList.append(li);
      });
    }

    // Ensure search input keeps focus after suggestions are populated
    setTimeout(() => {
      if (document.activeElement !== searchBar) {
        searchBar.focus();
      }
    }, 0);
  };

  import('./utils/autocomplete-api-v3.js').then(({ default: useInputAutocomplete }) => {
    const { inputHandler } = useInputAutocomplete(
      suggestionsListUIUpdateCB,
      getConfig,
      {
        throttleDelay: SEARCH_CONFIG.THROTTLE_DELAY,
        debounceDelay: SEARCH_CONFIG.DEBOUNCE_DELAY,
        limit: SEARCH_CONFIG.SUGGESTIONS_LIMIT,
      },
    );
    searchBar.addEventListener('input', inputHandler);
  });
}

async function decorateSearchFunctions(block) {
  const searchBarWrapper = createTag('div', { class: 'search-bar-wrapper' });

  // Read header and subheader from first block element (split by line breaks)
  const firstElementText = block.children[0]?.textContent?.trim();
  let headerText = '';
  let subheaderText = '';

  if (firstElementText) {
    const lines = firstElementText.split('\n').map((line) => line.trim()).filter((line) => line);
    headerText = lines[0] || '';
    subheaderText = lines[1] || '';
  }

  // Add header and subheader if found
  if (headerText || subheaderText) {
    const headerWrapper = createTag('div', { class: 'search-header' });

    if (headerText) {
      const header = createTag('h1', { class: 'search-title' });
      header.textContent = headerText;
      headerWrapper.append(header);
    }

    if (subheaderText) {
      const subheader = createTag('p', { class: 'search-subtitle' });
      subheader.textContent = subheaderText;
      headerWrapper.append(subheader);
    }

    searchBarWrapper.append(headerWrapper);
  }

  const searchForm = createTag('form', { class: 'search-form' });
  const searchBar = createTag('input', {
    class: 'search-bar',
    type: 'text',
    placeholder: blockConfig['search-bar-text'] || DEFAULT_TEXT.SEARCH_PLACEHOLDER,
    enterKeyHint: blockConfig['search-enter-hint'] || DEFAULT_TEXT.SEARCH_HINT,
  });

  searchForm.append(searchBar);

  // Create search input container for proper icon positioning
  const searchInputWrapper = createTag('div', { class: 'search-input-wrapper' });
  const searchIcon = getIconElementDeprecated('search');
  searchIcon.loading = 'lazy';
  const searchClearIcon = getIconElementDeprecated('search-clear');
  searchClearIcon.loading = 'lazy';

  searchInputWrapper.append(searchIcon, searchClearIcon, searchForm);
  searchBarWrapper.append(searchInputWrapper);

  return searchBarWrapper;
}

async function buildSearchDropdown(searchBarWrapper) {
  if (!searchBarWrapper) return;
  const dropdownContainer = createTag('div', { class: 'search-dropdown-container hidden' });
  const trendsContainer = createTag('div', { class: 'trends-container' });
  const suggestionsContainer = createTag('div', { class: 'suggestions-container hidden' });
  const suggestionsTitle = createTag('p', { class: 'dropdown-title' });
  const suggestionsList = createTag('ul', { class: 'suggestions-list' });

  // Use centralized system for trends and titles
  const [trendsTitle, searchTrends, searchSuggestionsTitle] = await replaceKeyArray(['search-trends-title', 'search-trends', 'search-suggestions-title'], getConfig());
  let trends;
  if (searchTrends && searchTrends !== 'search trends') {
    try {
      trends = JSON.parse(searchTrends);
    } catch (e) {
      // Invalid JSON in search-trends configuration
    }
  }

  if (trendsTitle) {
    const trendsTitleEl = createTag('p', { class: 'dropdown-title' });
    trendsTitleEl.textContent = trendsTitle;
    trendsContainer.append(trendsTitleEl);
  }

  if (trends) {
    const trendsWrapper = createTag('ul', { class: 'trends-wrapper' });
    for (const [key, value] of Object.entries(trends)) {
      const trendLinkWrapper = createTag('li');
      const trendLink = createTag('a', { class: 'trend-link', href: `${value}?searchId=${generateSearchId()}` });
      trendLink.textContent = key;
      trendLinkWrapper.append(trendLink);
      trendsWrapper.append(trendLinkWrapper);
    }
    trendsContainer.append(trendsWrapper);
  }

  suggestionsTitle.textContent = searchSuggestionsTitle !== 'search suggestions title' ? searchSuggestionsTitle : '';
  suggestionsContainer.append(suggestionsTitle, suggestionsList);

  const showFreePlan = blockConfig['show-free-plan']?.toLowerCase();
  if (showFreePlan && ['yes', 'on'].includes(showFreePlan)) {
    import('../../scripts/widgets/free-plan.js')
      .then(({ buildFreePlanWidget }) => buildFreePlanWidget({ typeKey: 'branded', checkmarks: true }))
      .then((freePlanTags) => {
        const freePlanContainer = createTag('div', { class: 'free-plans-container' });
        freePlanContainer.append(freePlanTags);
        dropdownContainer.append(freePlanContainer);
      });
  }

  dropdownContainer.append(trendsContainer, suggestionsContainer);
  // Position dropdown relative to search input wrapper
  const searchInputWrapper = searchBarWrapper.querySelector('.search-input-wrapper');
  if (searchInputWrapper) {
    searchInputWrapper.append(dropdownContainer);
  } else {
    searchBarWrapper.append(dropdownContainer);
  }
}

export default async function decorate(block) {
  addTempWrapperDeprecated(block, 'standalone-search-bar');

  blockConfig = buildSearchConfig(block);

  await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`), decorateButtonsDeprecated(block)]).then(([utils, placeholders]) => {
    ({ createTag, getConfig } = utils);
    ({ replaceKeyArray } = placeholders);
  });

  const searchBarWrapper = await decorateSearchFunctions(block);
  await buildSearchDropdown(searchBarWrapper);
  initSearchFunction(block, searchBarWrapper);

  block.innerHTML = '';
  block.appendChild(searchBarWrapper);
}
