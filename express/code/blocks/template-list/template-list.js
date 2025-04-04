/* eslint-disable no-underscore-dangle */
import {
  getLibs,
  getLottie,
  lazyLoadLottiePlayer,
  toClassName,
  fixIcons, getIconElementDeprecated,
  addTempWrapperDeprecated, decorateButtonsDeprecated,
} from '../../scripts/utils.js';

import { addAnimationToggle, createOptimizedPicture, linkImage } from '../../scripts/utils/media.js';
import { fetchRelevantRows } from '../../scripts/utils/relevant.js';

import { decorateSocialIcons } from '../../scripts/utils/icons.js';

import { Masonry } from '../../scripts/widgets/masonry.js';
import buildBasicCarousel from '../../scripts/widgets/basic-carousel.js';
import buildCarousel from '../../scripts/widgets/carousel.js';
import fetchAllTemplatesMetadata from '../../scripts/utils/all-templates-metadata.js';
import { memoize } from '../../scripts/utils/hofs.js';
import getBreadcrumbs from './breadcrumbs.js';

let createTag; let getConfig;
let getMetadata; let decorateSections;
let replaceKey;
function wordStartsWithVowels(word) {
  return word.match('^[aieouâêîôûäëïöüàéèùœAIEOUÂÊÎÔÛÄËÏÖÜÀÉÈÙŒ].*');
}

function handlelize(str) {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/(\W+|\s+)/g, '-') // Replace space and other characters by hyphen
    .replace(/--+/g, '-') // Replaces multiple hyphens by one hyphen
    .replace(/(^-+|-+$)/g, '') // Remove extra hyphens from beginning or end of the string
    .toLowerCase(); // To lowercase
}

function trimFormattedFilterText(attr, capitalize) {
  const resultString = attr.substring(1, attr.length - 1).replaceAll('"', '');

  return capitalize ? resultString.charAt(0).toUpperCase() + resultString.slice(1) : resultString;
}

function loadBetterAssetInBackground(img) {
  const updateImgRes = () => {
    img.src = img.src.replace('width/size/151', 'width/size/400');
    img.removeEventListener('load', updateImgRes);
  };

  img.addEventListener('load', updateImgRes);
}

async function populateHeadingPlaceholder(locale, props) {
  const heading = props.heading.replace("''", '');
  // special treatment for express/ root url
  const lowerCaseHeading = heading === 'Adobe Express' ? heading : heading.toLowerCase();
  const lang = getConfig().locale.ietf;
  const templateCount = lang === 'es-ES' ? props.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : props.total.toLocaleString(lang);
  let grammarTemplate;

  if (getMetadata('template-search-page') === 'Y') {
    grammarTemplate = props.total === 1 ? await replaceKey('template-search-heading-singular', getConfig()) : await replaceKey('template-search-heading-plural', getConfig());
  } else {
    grammarTemplate = await replaceKey('template-placeholder', getConfig());
  }

  if (grammarTemplate) {
    grammarTemplate = grammarTemplate
      .replace('{{quantity}}', props.fallbackMsg ? '0' : templateCount)
      .replace('{{Type}}', heading)
      .replace('{{type}}', lowerCaseHeading);
    if (locale.replace('/', '') === 'fr') {
      grammarTemplate.split(' ').forEach((word, index, words) => {
        if (index + 1 < words.length) {
          if (word === 'de' && wordStartsWithVowels(words[index + 1])) {
            words.splice(index, 2, `d'${words[index + 1]}`);
            grammarTemplate = words.join(' ');
          }
        }
      });
    }
  }

  return grammarTemplate;
}

function formatSearchQuery(limit, start, sort, filters) {
  const prunedFilter = Object.entries(filters).filter(([, value]) => value !== '()');
  const filterString = prunedFilter.reduce((string, [key, value]) => {
    if (key === prunedFilter[prunedFilter.length - 1][0]) {
      return `${string}${key}:${value}`;
    }
    return `${string}${key}:${value} AND `;
  }, '');

  return `https://www.adobe.com/cc-express-search-api?limit=${limit}&start=${start}&orderBy=${sort}&filters=${filterString}`;
}

const memoizedFetchUrl = memoize((url) => fetch(url).then((r) => (r.ok ? r.json() : null)), {
  key: (q) => q,
  ttl: 1000 * 60 * 60 * 24,
});

async function getFallbackMsg(tasks = '') {
  const fallBacktextTemplate = tasks && tasks !== "''" ? await replaceKey('templates-fallback-with-tasks', getConfig()) : await replaceKey('templates-fallback-without-tasks', getConfig());

  if (fallBacktextTemplate) {
    return tasks ? fallBacktextTemplate.replaceAll('{{tasks}}', tasks.toString()) : fallBacktextTemplate;
  }

  return `Sorry we couldn't find any results for what you searched for, try some of these popular ${
    tasks ? ` ${tasks.toString()} ` : ''}templates instead.`;
}

async function fetchTemplates(props) {
  props.fallbackMsg = null;
  if (props.authoringError || Object.keys(props.filters).length === 0) {
    props.authoringError = true;
    props.heading = 'Authoring error: first row must specify the template “type”';
    return null;
  }
  const { limit, start, sort } = props;
  props.queryString = formatSearchQuery(limit, start, sort, props.filters);

  let result = await memoizedFetchUrl(props.queryString);

  if (result?._embedded?.total) {
    return result;
  }
  const { filters: { tasks, locales } } = props;
  const tasksMatch = /\((.+)\)/.exec(tasks);
  if (tasksMatch) {
    props.queryString = formatSearchQuery(limit, start, sort, { locales, tasks });
    result = await memoizedFetchUrl(props.queryString);
    if (result?._embedded?.total) {
      props.fallbackMsg = await getFallbackMsg(tasksMatch[1]);
      return result;
    }
  }
  props.queryString = formatSearchQuery(limit, start, sort, { locales });
  props.fallbackMsg = await getFallbackMsg();
  return memoizedFetchUrl(props.queryString);
}

function fetchTemplatesByTasks(tasks, props) {
  const tempFilters = { ...props.filters };

  if (tasks) {
    tempFilters.tasks = `(${tasks})`;
  }

  if (!props.authoringError && Object.keys(tempFilters).length !== 0) {
    const tempQ = formatSearchQuery(0, '', props.sort, tempFilters);

    return memoizedFetchUrl(tempQ);
  }

  return null;
}

async function fetchCntSpan(props, anchor, lang) {
  const json = await fetchTemplatesByTasks(anchor.dataset.tasks, props);
  const cntSpan = createTag('span', { class: 'category-list-template-count' });
  cntSpan.textContent = `(${json?._embedded?.total?.toLocaleString(lang) ?? 0})`;
  return { cntSpan, anchor };
}

async function appendCategoryTemplatesCount(section, props) {
  if (props.loadedOtherCategoryCounts) {
    return;
  }
  props.loadedOtherCategoryCounts = true;
  const categories = section.querySelectorAll('ul.category-list > li');
  const lang = getConfig().locale.ietf;

  const fetchCntSpanPromises = [...categories]
    .map((li) => fetchCntSpan(props, li.querySelector('a'), lang));
  const res = await Promise.all(fetchCntSpanPromises);

  // append one by one to gain attention
  for (const { cntSpan, anchor } of res) {
    anchor.append(cntSpan);
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => { setTimeout(resolve, 25); });
  }
}

async function processResponse(props) {
  const response = await fetchTemplates(props);
  const { _embedded } = response || {};
  let templateFetched = [];
  if (_embedded) {
    const { results, total } = _embedded;
    templateFetched = results;

    if ('_links' in response) {
      const nextQuery = response._links.next.href;
      const starts = new URLSearchParams(nextQuery).get('start').split(',');
      starts.pop();
      props.start = starts.join(',');
    } else {
      props.start = '';
    }

    props.total = total;
  }

  if (templateFetched) {
    return templateFetched.filter((template) => !!template.branchURL).map(async (template) => {
      const templateTag = createTag('div');
      const imgWrapper = createTag('div');

      ['format', 'dimension', 'size'].forEach((param) => {
        template.rendition.href = template.rendition.href.replace(`{${param}}`, props.renditionParams[param]);
      });
      const img = createTag('img', {
        src: template.rendition.href,
        alt: template.title,
      });
      const buttonWrapper = createTag('div', { class: 'button-container' });
      const button = createTag('a', {
        href: template.branchURL,
        title: await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template',
        class: 'button accent',
      });

      button.textContent = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
      imgWrapper.append(img);
      buttonWrapper.append(button);
      templateTag.append(imgWrapper, buttonWrapper);
      loadBetterAssetInBackground(img);
      return templateTag;
    });
  }
  return null;
}

async function fetchBlueprint(pathname) {
  if (window.spark.blueprint) {
    return (window.spark.blueprint);
  }

  const bpPath = pathname.substr(pathname.indexOf('/', 1))
    .split('.')[0];
  const resp = await fetch(`${bpPath}.plain.html`);
  const body = await resp.text();
  const main = createTag('main');
  main.innerHTML = body;
  await decorateSections(main);

  window.spark.blueprint = main;
  return (main);
}

function populateTemplates(block, templates, props) {
  for (let tmplt of templates) {
    const isPlaceholder = tmplt.querySelector(':scope > div:first-of-type > img[src*=".svg"], :scope > div:first-of-type > svg');
    const linkContainer = tmplt.querySelector(':scope > div:nth-of-type(2)');
    const rowWithLinkInFirstCol = tmplt.querySelector(':scope > div:first-of-type > a');

    if (linkContainer) {
      const link = linkContainer.querySelector(':scope a');
      if (link) {
        if (!link.parentElement.classList.contains('button-container')) {
          link.parentElement.classList.add('button-container');
        }
        const a = createTag('a', { href: link.href || '#' });

        a.append(...tmplt.children);
        tmplt.remove();
        tmplt = a;
        block.append(a);

        // convert A to SPAN
        const newLink = createTag('span', { class: 'template-link' });
        newLink.append(link.textContent.trim());

        linkContainer.innerHTML = '';
        linkContainer.append(newLink);
      }
    }

    if (rowWithLinkInFirstCol && !tmplt.querySelector('img')) {
      props.tailButton = rowWithLinkInFirstCol;
      rowWithLinkInFirstCol.remove();
    }

    if (tmplt.children.length === 3) {
      // look for options in last cell
      const overlayCell = tmplt.querySelector(':scope > div:last-of-type');
      const option = overlayCell.textContent.trim();
      if (option) {
        if (isPlaceholder) {
          // add aspect ratio to template
          const sep = option.includes(':') ? ':' : 'x';
          const ratios = option.split(sep).map((str) => parseInt(str, 10));
          props.placeholderFormat = ratios;
          if (block.classList.contains('horizontal')) {
            const height = block.classList.contains('mini') ? 100 : 200;
            if (ratios?.length === 2) {
              const width = (ratios[0] / ratios[1]) * height;
              tmplt.style = `width: ${width}px`;
              if (width / height > 1.3) {
                tmplt.classList.add('tall');
              }
            }
          } else {
            const width = block.classList.contains('sixcols') || block.classList.contains('fullwidth') ? 165 : 200;
            if (ratios[1]) {
              const height = (ratios[1] / ratios[0]) * width;
              tmplt.style = `height: ${height - 21}px`;
              if (width / height > 1.3) {
                tmplt.classList.add('wide');
              }
            }
          }
        } else {
          // add icon to 1st cell
          const icon = getIconElementDeprecated(toClassName(option));
          icon.setAttribute('title', option);
          tmplt.children[0].append(icon);
        }
      }
      overlayCell.remove();
    }

    if (!tmplt.querySelectorAll(':scope > div > *').length) {
      // remove empty row
      tmplt.remove();
    }
    tmplt.classList.add('template');

    // wrap "linked images" with link
    const imgLink = tmplt.querySelector(':scope > div:first-of-type a');
    if (imgLink) {
      const parent = imgLink.closest('div');
      if (!imgLink.href.includes('.mp4')) {
        linkImage(parent);
      } else {
        let videoLink = imgLink.href;
        if (videoLink.includes('/media_')) {
          videoLink = `./media_${videoLink.split('/media_')[1]}`;
        }
        tmplt.querySelectorAll(':scope br').forEach((br) => br.remove());
        const picture = tmplt.querySelector('picture');
        if (picture) {
          const img = tmplt.querySelector('img');
          const video = createTag('video', {
            playsinline: '',
            autoplay: '',
            loop: '',
            muted: '',
            poster: img.getAttribute('src'),
            title: img.getAttribute('alt'),
          });
          video.append(createTag('source', {
            src: videoLink,
            type: 'video/mp4',
          }));
          parent.replaceChild(video, picture);
          imgLink.remove();
          video.addEventListener('canplay', () => {
            video.muted = true;
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // ignore
              });
            }
          });
        }
      }
    }

    if (isPlaceholder) {
      tmplt.classList.add('placeholder');
    }
  }
}

function initToggle(section) {
  const bar = section.querySelector('.toggle-bar');
  const wrapper = section.querySelector('.template-list-wrapper');
  const toggleButtons = section.querySelectorAll('.toggle-button');

  bar.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.toggle('expanded');
    section.classList.toggle('expanded');
    Array.from(toggleButtons).forEach((button) => {
      button.classList.toggle('expanded');
    });
  });

  Array.from(toggleButtons).forEach((button) => {
    const chev = button.querySelector('.toggle-button-chev');
    const a = button.querySelector('a');

    a.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    chev.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      wrapper.classList.toggle('expanded');
      section.classList.toggle('expanded');
      Array.from(toggleButtons).forEach((b) => {
        b.classList.toggle('expanded');
      });
    });
  });
}

async function attachFreeInAppPills(block) {
  const freeInAppText = await replaceKey('free-in-app', getConfig());

  const templateLinks = block.querySelectorAll('a.template');
  for (const templateLink of templateLinks) {
    if (!block.classList.contains('apipowered')
      && templateLink.querySelectorAll('.icon-premium').length <= 0
      && !templateLink.classList.contains('placeholder')
      && !templateLink.querySelector('.icon-free-badge')
      && freeInAppText) {
      const freeInAppBadge = createTag('span', { class: 'icon icon-free-badge' });
      freeInAppBadge.textContent = freeInAppText;
      templateLink.querySelector('div').append(freeInAppBadge);
    }
  }
}

async function readRowsFromBlock(block, props) {
  if (block.children.length > 0) {
    Array.from(block.children).forEach((row, index, array) => {
      const cells = row.querySelectorAll('div');
      if (index === 0) {
        if (cells.length >= 2 && ['type*', 'type'].includes(cells[0].textContent.trim().toLowerCase())) {
          props.filters.tasks = `(${cells[1].textContent.trim().toLowerCase()})`;
          props.heading = cells[1].textContent.trim();
        } else if (block.classList.contains('holiday')) {
          props.heading = row;
        } else {
          props.heading = row.textContent.trim();
        }
        row.remove();
      } else if (cells[0].textContent.toLowerCase() === 'auto-collapse delay') {
        props.autoCollapseDelay = parseFloat(cells[1].textContent.trim()) * 1000;
      } else if (cells[0].textContent.toLowerCase() === 'background animation') {
        props.backgroundAnimation = cells[1].textContent.trim();
        cells[1].remove();
      } else if (cells[0].textContent.toLowerCase() === 'background color') {
        props.backgroundColor = cells[1].textContent.trim();
      } else if (index < array.length) {
        if (cells.length >= 2) {
          if (['type*', 'type'].includes(cells[0].textContent.trim().toLowerCase())) {
            props.filters.tasks = `(${cells[1].textContent.trim().toLowerCase()})`;
          } else {
            props.filters[`${cells[0].textContent.trim().toLowerCase()}`] = `(${cells[1].textContent.trim().toLowerCase()})`;
          }
        }
        row.remove();
      }
    });

    const fetchedTemplates = await processResponse(props);

    if (fetchedTemplates) {
      props.templates = props.templates.concat(fetchedTemplates);
      props.templates.forEach((template) => {
        block.append(template);
      });
    }
  } else {
    props.heading = 'Authoring error: first row must specify the template “type”';
    props.authoringError = true;
  }
}

function getRedirectUrl(tasks, topics, format, allTemplatesMetadata) {
  const { prefix } = getConfig().locale;
  const topicUrl = topics ? `/${topics}` : '';
  const taskUrl = `/${handlelize(tasks.toLowerCase())}`;
  const targetPath = `${prefix}/express/templates${taskUrl}${topicUrl}`;
  const pathMatch = (e) => e.path === targetPath;
  if (allTemplatesMetadata.some(pathMatch)) {
    return `${window.location.origin}${targetPath}`;
  }

  const searchUrlTemplate = `/express/templates/search?tasks=${tasks}&phformat=${format}&topics=${topics || "''"}`;
  return `${window.location.origin}${prefix}${searchUrlTemplate}`;
}

async function redirectSearch(searchBar, props) {
  const taskMap = JSON.parse(await replaceKey('task-name-mapping', getConfig()));
  if (searchBar) {
    const wrapper = searchBar.closest('.template-list-search-bar-wrapper');
    const selectorTask = wrapper.querySelector('.task-dropdown-list > .option.active');
    props.filters.tasks = `(${selectorTask.dataset.tasks})`;
  }

  const format = `${props.placeholderFormat[0]}:${props.placeholderFormat[1]}`;
  let currentTasks = trimFormattedFilterText(props.filters.tasks);
  const currentTopic = trimFormattedFilterText(props.filters.topics);
  let searchInput = searchBar ? searchBar.value.toLowerCase() : currentTopic;

  const tasksFoundInInput = Object.entries(taskMap).filter((task) => task[1].some((word) => {
    const searchValue = searchBar.value.toLowerCase();
    return searchValue.indexOf(word.toLowerCase()) >= 0;
  })).sort((a, b) => b[0].length - a[0].length);

  if (tasksFoundInInput.length > 0) {
    tasksFoundInInput[0][1].sort((a, b) => b.length - a.length).forEach((word) => {
      searchInput = searchInput.toLowerCase().replace(word.toLowerCase(), '');
    });

    searchInput = searchInput.trim();
    [[currentTasks]] = tasksFoundInInput;
  }
  const allTemplatesMetadata = await fetchAllTemplatesMetadata(getConfig);
  const redirectUrl = getRedirectUrl(currentTasks, searchInput, format, allTemplatesMetadata);
  window.location = redirectUrl;
}

async function makeTemplateFunctions() {
  const functions = {
    premium: {
      placeholders: JSON.parse(await replaceKey('template-filter-premium', getConfig())),
      elements: {},
      icons: await replaceKey('template-filter-premium-icons', getConfig()).replace(/\s/g, '').split(','),
    },
    animated: {
      placeholders: JSON.parse(await replaceKey('template-filter-animated', getConfig())),
      elements: {},
      icons: await replaceKey('template-filter-animated-icons', getConfig()).replace(/\s/g, '').split(','),
    },
    sort: {
      placeholders: JSON.parse(await replaceKey('template-sort', getConfig())),
      elements: {},
      icons: await replaceKey('template-sort-icons', getConfig()).replace(/\s/g, '').split(','),
    },
  };

  Object.entries(functions).forEach((entry) => {
    entry[1].elements.wrapper = createTag('div', {
      class: `function-wrapper function-${entry[0]}`,
      'data-param': entry[0],
    });

    entry[1].elements.wrapper.subElements = {
      button: {
        wrapper: createTag('div', { class: `button-wrapper button-wrapper-${entry[0]}` }),
        subElements: {
          iconHolder: createTag('span', { class: 'icon-holder' }),
          textSpan: createTag('span', { class: `current-option current-option-${entry[0]}` }),
          chevIcon: getIconElementDeprecated('drop-down-arrow'),
        },
      },
      options: {
        wrapper: createTag('div', { class: `options-wrapper options-wrapper-${entry[0]}` }),
        subElements: Object.entries(entry[1].placeholders).map((option, subIndex) => {
          const icon = getIconElementDeprecated(entry[1].icons[subIndex]);
          const optionButton = createTag('div', { class: 'option-button', 'data-value': option[1] });
          [optionButton.textContent] = option;
          optionButton.prepend(icon);
          return optionButton;
        }),
      },
    };

    const span = entry[1].elements.wrapper.subElements.button.subElements.textSpan;
    [[span.textContent]] = Object.entries(entry[1].placeholders);
  });

  return functions;
}

function updateFilterIcon(block) {
  const section = block.closest('.section.template-list-fullwidth-apipowered-container');
  if (!section) return;
  const functionWrapper = section.querySelectorAll('.function-wrapper');
  const optionsWrapper = section.querySelectorAll('.options-wrapper');

  functionWrapper.forEach((wrap, index) => {
    const iconHolder = wrap.querySelector('.icon-holder');
    const activeOption = optionsWrapper[index].querySelector('.option-button.active');
    if (iconHolder && activeOption) {
      const activeIcon = activeOption.querySelector('.icon');
      if (activeIcon) {
        iconHolder.innerHTML = activeIcon.outerHTML;
      }
    }
  });
}

async function decorateFunctionsContainer(block, section, functions, props) {
  const functionsContainer = createTag('div', { class: 'functions-container' });
  const functionContainerMobile = createTag('div', { class: 'functions-drawer' });

  Object.values(functions).forEach((filter) => {
    const filterWrapper = filter.elements.wrapper;

    Object.values(filterWrapper.subElements).forEach((part) => {
      const innerWrapper = part.wrapper;

      Object.values(part.subElements).forEach((innerElement) => {
        if (innerElement) {
          innerWrapper.append(innerElement);
        }
      });

      filterWrapper.append(innerWrapper);
    });
    functionContainerMobile.append(filterWrapper.cloneNode({ deep: true }));
    functionsContainer.append(filterWrapper);
  });

  // restructure drawer for mobile design
  const filterContainer = createTag('div', { class: 'filter-container-mobile' });
  const mobileFilterButtonWrapper = createTag('div', { class: 'filter-button-mobile-wrapper' });
  const mobileFilterButton = createTag('span', { class: 'filter-button-mobile' });
  const drawer = createTag('div', { class: 'filter-drawer-mobile hidden retracted' });
  const drawerInnerWrapper = createTag('div', { class: 'filter-drawer-mobile-inner-wrapper' });
  const drawerBackground = createTag('div', { class: 'drawer-background hidden transparent' });
  const closeButton = getIconElementDeprecated('search-clear');
  const applyButtonWrapper = createTag('div', { class: 'apply-filter-button-wrapper hidden transparent' });
  const applyButton = createTag('a', { class: 'apply-filter-button button gradient', href: '#' });

  closeButton.classList.add('close-drawer');
  applyButton.textContent = await replaceKey('apply-filters', getConfig());

  functionContainerMobile.children[0]
    .querySelector('.current-option-premium')
    .textContent = `${await replaceKey('free', getConfig())} ${await replaceKey('versus-shorthand', getConfig())} ${await replaceKey('premium', getConfig())}`;

  functionContainerMobile.children[1]
    .querySelector('.current-option-animated')
    .textContent = `${await replaceKey('static', getConfig())} ${await replaceKey('versus-shorthand', getConfig())} ${await replaceKey('animated', getConfig())}`;

  drawerInnerWrapper.append(
    functionContainerMobile.children[0],
    functionContainerMobile.children[1],
  );

  drawer.append(closeButton, drawerInnerWrapper);

  const buttonsInDrawer = drawer.querySelectorAll('.button-wrapper');
  const optionsInDrawer = drawer.querySelectorAll('.options-wrapper');

  [buttonsInDrawer, optionsInDrawer].forEach((category) => {
    category.forEach((element) => {
      element.classList.add('in-drawer');
      const heading = element.querySelector('.current-option');
      const iconHolder = element.querySelector('.icon-holder');
      if (heading) {
        heading.className = 'filter-mobile-option-heading';
      }
      if (iconHolder) {
        iconHolder.remove();
      }
    });
  });

  mobileFilterButtonWrapper.append(getIconElementDeprecated('scratch-icon-22'), mobileFilterButton);
  applyButtonWrapper.append(applyButton);
  filterContainer.append(
    mobileFilterButtonWrapper,
    drawer,
    applyButtonWrapper,
    drawerBackground,
  );
  functionContainerMobile.prepend(filterContainer);

  mobileFilterButton.textContent = await replaceKey('filter', getConfig());
  const sortButton = functionContainerMobile.querySelector('.current-option-sort');
  if (sortButton) {
    sortButton.textContent = await replaceKey('sort', getConfig());
    sortButton.className = 'filter-mobile-option-heading';
  }

  mobileFilterButton.addEventListener('click', () => {
    appendCategoryTemplatesCount(section, props);
  }, { once: true });

  return { mobile: functionContainerMobile, desktop: functionsContainer };
}

function resetTaskDropdowns(section) {
  if (!section) return;
  const taskDropdowns = section.querySelectorAll('.task-dropdown');
  const taskDropdownLists = section.querySelectorAll('.task-dropdown-list');

  taskDropdowns.forEach((dropdown) => {
    dropdown.classList.remove('active');
  });

  taskDropdownLists.forEach((list) => {
    list.classList.remove('active');
  });
}

function closeTaskDropdown(toolBar) {
  const section = toolBar.closest('.section.template-list-fullwidth-apipowered-container');
  const searchBarWrappers = section.querySelectorAll('.template-list-search-bar-wrapper');
  searchBarWrappers.forEach((wrapper) => {
    const taskDropdown = wrapper.querySelector('.task-dropdown');
    const taskDropdownList = taskDropdown.querySelector('.task-dropdown-list');
    taskDropdown.classList.remove('active');
    taskDropdownList.classList.remove('active');
  });
}

function initSearchFunction(toolBar, stickySearchBarWrapper, generatedSearchBar, props) {
  const section = toolBar.closest('.section.template-list-fullwidth-apipowered-container');
  const stickySearchBar = stickySearchBarWrapper.querySelector('input.search-bar');
  const searchMarqueeSearchBar = document.querySelector('.search-marquee .search-bar-wrapper');
  const searchBarWrappers = document.querySelectorAll('.template-list-search-bar-wrapper');
  const toolbarWrapper = toolBar.parentElement;

  const searchBarWatcher = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) {
      toolbarWrapper.classList.add('sticking');
      resetTaskDropdowns(section);
    } else {
      toolbarWrapper.classList.remove('sticking');
    }
  }, { rootMargin: '0px', threshold: 1 });

  // for backward compatibility
  // TODO: consider removing !searchMarqueeSearchBar as it should always be there for desktop pages
  const searchBarToWatch = (document.body.dataset.device === 'mobile' || !searchMarqueeSearchBar) ? generatedSearchBar : searchMarqueeSearchBar;
  searchBarWatcher.observe(searchBarToWatch);

  searchBarWrappers.forEach((wrapper) => {
    const searchForm = wrapper.querySelector('.search-form');
    const searchBar = wrapper.querySelector('input.search-bar');
    const clear = wrapper.querySelector('.icon-search-clear');
    const taskDropdown = wrapper.querySelector('.task-dropdown');
    const taskDropdownToggle = taskDropdown.querySelector('.task-dropdown-toggle');
    const taskDropdownList = taskDropdown.querySelector('.task-dropdown-list');
    const taskOptions = taskDropdownList.querySelectorAll('.option');

    searchBar.addEventListener('click', (e) => {
      e.stopPropagation();
      closeTaskDropdown(toolBar);
    }, { passive: true });

    searchBar.addEventListener('keyup', () => {
      if (searchBar.value !== '') {
        clear.style.display = 'inline-block';
      } else {
        clear.style.display = 'none';
      }
    }, { passive: true });

    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      searchBar.disabled = true;

      // TODO: Disabled at this moment
      // sampleRUM('search', {
      //   source: 'template-list',
      //   target: $searchBar.value,
      // }, 1);
      await redirectSearch(searchBar, props);
    });

    clear.addEventListener('click', () => {
      searchBar.value = '';
      clear.style.display = 'none';
    }, { passive: true });

    taskDropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      taskDropdown.classList.toggle('active');
      taskDropdownList.classList.toggle('active');
    }, { passive: true });

    document.addEventListener('click', (e) => {
      const { target } = e;
      if (target !== taskDropdown && !taskDropdown.contains(target)) {
        taskDropdown.classList.remove('active');
        taskDropdownList.classList.remove('active');
      }
    }, { passive: true });

    taskOptions.forEach((option) => {
      const updateTaskOptions = () => {
        taskOptions.forEach((o) => {
          if (o !== option) {
            o.classList.remove('active');
          }
        });

        option.classList.add('active');
        props.filters.tasks = `(${option.dataset.tasks})`;
        taskDropdownToggle.textContent = option.textContent.trim();
        closeTaskDropdown(toolBar);
      };

      option.addEventListener('click', (e) => {
        e.stopPropagation();
        updateTaskOptions();
      }, { passive: true });
    });

    document.addEventListener('click', (e) => {
      if (e.target !== wrapper && !wrapper.contains(e.target)) {
        if (wrapper.classList.contains('sticky-search-bar')) {
          wrapper.classList.remove('ready');
          wrapper.classList.add('collapsed');
        }
      }
    }, { passive: true });
  });

  stickySearchBar.addEventListener('click', (e) => {
    e.stopPropagation();

    stickySearchBarWrapper.classList.remove('collapsed');
    setTimeout(() => {
      if (!stickySearchBarWrapper.classList.contains('collapsed')) {
        stickySearchBarWrapper.classList.add('ready');
      }
    }, 500);
  }, { passive: true });

  stickySearchBarWrapper.addEventListener('mouseenter', () => {
    stickySearchBarWrapper.classList.remove('collapsed');
    setTimeout(() => {
      if (!stickySearchBarWrapper.classList.contains('collapsed')) {
        stickySearchBarWrapper.classList.add('ready');
      }
    }, 500);
  }, { passive: true });
}

function updateLottieStatus(section) {
  const drawer = section.querySelector('.filter-drawer-mobile');
  const inWrapper = drawer.querySelector('.filter-drawer-mobile-inner-wrapper');
  const lottieArrows = drawer.querySelector('.lottie-wrapper');
  if (lottieArrows) {
    if (inWrapper.scrollHeight - inWrapper.scrollTop === inWrapper.offsetHeight) {
      lottieArrows.style.display = 'none';
      drawer.classList.remove('scrollable');
    } else {
      lottieArrows.style.removeProperty('display');
      drawer.classList.add('scrollable');
    }
  }
}

async function decorateCategoryList(block, section, props) {
  const blockWrapper = block.closest('.template-list-wrapper');
  const mobileDrawerWrapper = section.querySelector('.filter-drawer-mobile');
  const inWrapper = section.querySelector('.filter-drawer-mobile-inner-wrapper');
  const categories = JSON.parse(await replaceKey('task-categories', getConfig()));
  const categoryIcons = await replaceKey('task-category-icons', getConfig()).replace(/\s/g, '').split(',');
  const categoriesDesktopWrapper = createTag('div', { class: 'category-list-wrapper' });
  const categoriesToggleWrapper = createTag('div', { class: 'category-list-toggle-wrapper' });
  const desktopCategoriesToggleWrapper = createTag('div', { class: 'category-list-toggle-wrapper' });
  const categoriesToggle = createTag('span', { class: 'category-list-toggle' });
  const desktopCategoriesToggle = getIconElementDeprecated('drop-down-arrow');
  const categoriesListHeading = createTag('div', { class: 'category-list-heading' });
  const categoriesTag = createTag('ul', { class: 'category-list' });

  categoriesListHeading.append(getIconElementDeprecated('template-search'), await replaceKey('jump-to-category', getConfig()));
  categoriesToggle.textContent = await replaceKey('jump-to-category', getConfig());
  const allTemplatesMetadata = await fetchAllTemplatesMetadata(getConfig);

  Object.entries(categories).forEach((category, index) => {
    const format = `${props.placeholderFormat[0]}:${props.placeholderFormat[1]}`;
    const targetTasks = category[1];
    const currentTasks = trimFormattedFilterText(props.filters.tasks) ? trimFormattedFilterText(props.filters.tasks) : "''";
    const currentTopic = trimFormattedFilterText(props.filters.topics);

    const listItem = createTag('li');
    if (category[1] === currentTasks) {
      listItem.classList.add('active');
    }

    let icon;
    if (categoryIcons[index] && categoryIcons[index] !== '') {
      icon = categoryIcons[index];
    } else {
      icon = 'template-static';
    }

    const iconElement = getIconElementDeprecated(icon);
    const redirectUrl = getRedirectUrl(targetTasks, currentTopic, format, allTemplatesMetadata);
    const a = createTag('a', {
      'data-tasks': targetTasks,
      href: redirectUrl,
    });
    [a.textContent] = category;

    a.prepend(iconElement);
    listItem.append(a);
    categoriesTag.append(listItem);
  });

  categoriesDesktopWrapper.addEventListener('mouseover', () => {
    appendCategoryTemplatesCount(section, props);
  }, { once: true });

  categoriesToggleWrapper.append(categoriesToggle);
  categoriesDesktopWrapper.append(categoriesTag);
  const categoriesMobileWrapper = categoriesDesktopWrapper.cloneNode({ deep: true });
  categoriesMobileWrapper.prepend(categoriesToggleWrapper);

  desktopCategoriesToggleWrapper.append(desktopCategoriesToggle);
  categoriesDesktopWrapper.prepend(desktopCategoriesToggleWrapper, categoriesListHeading);

  const lottieArrows = createTag('a', { class: 'lottie-wrapper' });
  mobileDrawerWrapper.append(lottieArrows);
  inWrapper.append(categoriesMobileWrapper);
  lottieArrows.innerHTML = getLottie('purple-arrows', '/express/code/icons/purple-arrows.json');
  lazyLoadLottiePlayer();

  categoriesDesktopWrapper.classList.add('desktop-only');

  if (blockWrapper) {
    blockWrapper.prepend(categoriesDesktopWrapper);
    blockWrapper.classList.add('with-categories-list');
  }

  const toggleButton = categoriesMobileWrapper.querySelector('.category-list-toggle-wrapper');
  toggleButton.append(getIconElementDeprecated('drop-down-arrow'));
  toggleButton.addEventListener('click', () => {
    const listWrapper = toggleButton.parentElement;
    toggleButton.classList.toggle('collapsed');
    if (toggleButton.classList.contains('collapsed')) {
      if (listWrapper.classList.contains('desktop-only')) {
        listWrapper.classList.add('collapsed');
        listWrapper.style.maxHeight = '40px';
      } else {
        listWrapper.classList.add('collapsed');
        listWrapper.style.maxHeight = '24px';
      }
    } else {
      listWrapper.classList.remove('collapsed');
      listWrapper.style.maxHeight = '1000px';
    }

    setTimeout(() => {
      if (!listWrapper.classList.contains('desktop-only')) {
        updateLottieStatus(section);
      }
    }, 510);
  }, { passive: true });

  lottieArrows.addEventListener('click', () => {
    inWrapper.scrollBy({
      top: 300,
      behavior: 'smooth',
    });
  }, { passive: true });

  inWrapper.addEventListener('scroll', () => {
    updateLottieStatus(section);
  }, { passive: true });
}

async function decorateSearchFunctions(toolBar, section, props) {
  const inBlockLocation = toolBar.querySelector('.wrapper-content-search');
  const linkListLocation = document.querySelector('.link-list-fullwidth-container');
  const searchBarWrapper = createTag('div', { class: 'template-list-search-bar-wrapper' });
  const searchForm = createTag('form', { class: 'search-form' });
  const searchBar = createTag('input', {
    class: 'search-bar',
    type: 'text',
    placeholder: await replaceKey('template-search-placeholder', getConfig()) ?? 'Search for over 50,000 templates',
    enterKeyHint: await replaceKey('search', getConfig()) ?? 'Search',
  });

  const taskCats = await replaceKey('task-categories', getConfig());
  const taskCatIcons = await replaceKey('task-category-icons', getConfig());
  // Tasks Dropdown
  const taskDropdownContainer = createTag('div', { class: 'task-dropdown-container' });
  const taskDropdown = createTag('div', { class: 'task-dropdown' });
  const taskDropdownChev = getIconElementDeprecated('drop-down-arrow');
  const taskDropdownToggle = createTag('button', { class: 'task-dropdown-toggle' });
  const taskDropdownList = createTag('ul', { class: 'task-dropdown-list' });
  const categories = JSON.parse(taskCats);
  const categoryIcons = taskCatIcons.replace(/\s/g, '').split(',');
  let optionMatched = false;

  Object.entries(categories).forEach((category, index) => {
    const itemIcon = getIconElementDeprecated(categoryIcons[index]);
    const listItem = createTag('li', { class: 'option', 'data-tasks': category[1] });
    [listItem.textContent] = category;
    listItem.prepend(itemIcon);
    taskDropdownList.append(listItem);

    if (handlelize(listItem.dataset.tasks) === trimFormattedFilterText(props.filters.tasks)) {
      optionMatched = true;
      listItem.classList.add('active');
      taskDropdownToggle.textContent = listItem.textContent;
    }
  });

  if (!optionMatched) {
    const optionAll = taskDropdownList.querySelector('.option[data-tasks="\'\'"]');
    if (optionAll) {
      optionAll.classList.add('active');
      taskDropdownToggle.textContent = optionAll.textContent;
    }
  }

  searchForm.append(searchBar);
  searchBarWrapper.append(getIconElementDeprecated('search'), getIconElementDeprecated('search-clear'));
  taskDropdownContainer.append(taskDropdown);
  taskDropdown.append(taskDropdownToggle, taskDropdownList, taskDropdownChev);
  searchBarWrapper.append(searchForm, taskDropdownContainer);

  const stickySearchBarWrapper = searchBarWrapper.cloneNode({ deep: true });

  stickySearchBarWrapper.classList.add('sticky-search-bar');
  stickySearchBarWrapper.classList.add('collapsed');
  inBlockLocation.append(stickySearchBarWrapper);
  if (linkListLocation) {
    const linkListWrapper = linkListLocation.querySelector('.link-list-wrapper');
    if (linkListWrapper) {
      linkListWrapper.before(searchBarWrapper);
    } else {
      linkListLocation.prepend(searchBarWrapper);
    }
  }
  initSearchFunction(toolBar, stickySearchBarWrapper, searchBarWrapper, props);
}

function closeDrawer(toolBar) {
  const drawerBackground = toolBar.querySelector('.drawer-background');
  const drawer = toolBar.querySelector('.filter-drawer-mobile');
  const applyButton = toolBar.querySelector('.apply-filter-button-wrapper');

  drawer.classList.add('retracted');
  drawerBackground.classList.add('transparent');
  applyButton.classList.add('transparent');

  setTimeout(() => {
    drawer.classList.add('hidden');
    drawerBackground.classList.add('hidden');
    applyButton.classList.add('hidden');
  }, 500);
}

function updateOptionsStatus(block, toolBar, props) {
  const wrappers = toolBar.querySelectorAll('.function-wrapper');

  wrappers.forEach((wrapper) => {
    const currentOption = wrapper.querySelector('.current-option');
    const options = wrapper.querySelectorAll('.option-button');

    options.forEach((option) => {
      const paramType = wrapper.dataset.param;
      const paramValue = paramType === 'sort' ? option.dataset.value : `(${option.dataset.value})`;
      if (props[paramType] === paramValue
        || props.filters[paramType] === paramValue
        || ((!props.filters[paramType] || props.filters[paramType] === '()') && paramValue === '(remove)')) {
        const drawerCs = ['filter-drawer-mobile-inner-wrapper', 'functions-drawer'];
        let toReorder = false;
        if (drawerCs.every((className) => !wrapper.parentElement.classList.contains(className))) {
          toReorder = true;
        }

        if (toReorder) {
          option.parentElement.prepend(option);
        }
        if (currentOption) {
          currentOption.textContent = option.textContent;
        }

        options.forEach((o) => {
          if (option !== o) {
            o.classList.remove('active');
          }
        });
        option.classList.add('active');
      }
    });

    updateFilterIcon(block);
  });
}

function initDrawer(block, section, toolBar, props) {
  const filterButton = toolBar.querySelector('.filter-button-mobile-wrapper');
  const drawerBackground = toolBar.querySelector('.drawer-background');
  const drawer = toolBar.querySelector('.filter-drawer-mobile');
  const closeDrawerElement = toolBar.querySelector('.close-drawer');
  const applyButton = toolBar.querySelector('.apply-filter-button-wrapper');

  const functionWrappers = drawer.querySelectorAll('.function-wrapper');

  let currentFilters;

  filterButton.addEventListener('click', () => {
    currentFilters = { ...props.filters };
    drawer.classList.remove('hidden');
    drawerBackground.classList.remove('hidden');
    applyButton.classList.remove('hidden');
    updateLottieStatus(section);
    closeTaskDropdown(toolBar);

    setTimeout(() => {
      drawer.classList.remove('retracted');
      drawerBackground.classList.remove('transparent');
      applyButton.classList.remove('transparent');
      functionWrappers.forEach((wrapper) => {
        const button = wrapper.querySelector('.button-wrapper');
        if (button) {
          button.style.maxHeight = `${button.nextElementSibling.offsetHeight}px`;
        }
      });
    }, 100);
  }, { passive: true });

  [drawerBackground, closeDrawerElement].forEach((element) => {
    element.addEventListener('click', () => {
      props.filters = { ...currentFilters };
      closeDrawer(toolBar);
      updateOptionsStatus(block, toolBar, props);
    }, { passive: true });
  });

  drawer.classList.remove('hidden');
  functionWrappers.forEach((wrapper) => {
    const buttonEventSource = wrapper.querySelector('.button-wrapper');
    let maxHeight;
    if (buttonEventSource) {
      const wrapperMaxHeightGrabbed = setInterval(() => {
        if (wrapper.offsetHeight > 0) {
          maxHeight = `${wrapper.offsetHeight}px`;
          wrapper.style.maxHeight = maxHeight;
          clearInterval(wrapperMaxHeightGrabbed);
        }
      }, 200);

      buttonEventSource.addEventListener('click', (e) => {
        e.stopPropagation();
        const button = wrapper.querySelector('.button-wrapper');
        if (button) {
          const minHeight = `${button.offsetHeight - 8}px`;
          wrapper.classList.toggle('collapsed');
          wrapper.style.maxHeight = wrapper.classList.contains('collapsed') ? minHeight : maxHeight;
        }
      }, { passive: true });
    }
  });

  drawer.classList.add('hidden');
}

function updateQueryURL(functionWrapper, option, props) {
  const paramType = functionWrapper.dataset.param;
  const paramValue = option.dataset.value;

  if (paramType === 'sort') {
    props.sort = paramValue;
  } else {
    const filtersObj = props.filters;

    if (paramType in filtersObj) {
      if (paramValue === 'remove') {
        delete filtersObj[paramType];
      } else {
        filtersObj[paramType] = `(${paramValue})`;
      }
    } else if (paramValue !== 'remove') {
      filtersObj[paramType] = `(${paramValue})`;
    }

    props.filters = filtersObj;
  }
}

function updateLoadMoreButton(block, loadMore, props) {
  if (props.start === '') {
    loadMore.style.display = 'none';
  } else {
    loadMore.style.removeProperty('display');
  }
}

async function decorateNewTemplates(block, props, options = { reDrawMasonry: false }) {
  const newTemplates = await processResponse(props);
  const loadMore = block.parentElement.querySelector('.load-more');

  props.templates = props.templates.concat(newTemplates);
  populateTemplates(block, newTemplates, props);

  const newCells = Array.from(block.querySelectorAll('.template:not(.appear)'));

  if (options.reDrawMasonry) {
    props.masonry.cells = [props.masonry.cells[0]].concat(newCells);
  } else {
    props.masonry.cells = props.masonry.cells.concat(newCells);
  }
  props.masonry.draw(newCells);

  if (loadMore) {
    updateLoadMoreButton(block, loadMore, props);
  }
}

async function redrawTemplates(block, toolBar, props) {
  const heading = toolBar.querySelector('h2');
  const lang = getConfig().locale.ietf;
  const currentTotal = props.total.toLocaleString(lang);
  props.templates = [props.templates[0]];
  props.start = '';
  block.querySelectorAll('.template:not(.placeholder)').forEach((card) => {
    card.remove();
  });

  await decorateNewTemplates(block, props, { reDrawMasonry: true }).then(() => {
    heading.textContent = heading.textContent.replace(`${currentTotal}`, props.total.toLocaleString(lang));
    updateOptionsStatus(block, toolBar, props);
    if (block.querySelectorAll('.template').length <= 0) {
      const viewButtons = toolBar.querySelectorAll('.view-toggle-button');
      viewButtons.forEach((button) => {
        button.classList.remove('active');
      });
      ['sm-view', 'md-view', 'lg-view'].forEach((className) => {
        block.classList.remove(className);
      });
    }
  });
}

function initFilterSort(block, toolBar, props) {
  const buttons = toolBar.querySelectorAll('.button-wrapper');
  const applyFilterButton = toolBar.querySelector('.apply-filter-button');

  if (buttons.length > 0) {
    buttons.forEach((button) => {
      const wrapper = button.parentElement;
      const currentOption = wrapper.querySelector('span.current-option');
      const optionsList = button.nextElementSibling;
      const options = optionsList.querySelectorAll('.option-button');

      button.addEventListener('click', () => {
        if (!button.classList.contains('in-drawer')) {
          buttons.forEach((b) => {
            if (button !== b) {
              b.parentElement.classList.remove('opened');
            }
          });

          wrapper.classList.toggle('opened');
        }

        closeTaskDropdown(toolBar);
      }, { passive: true });

      options.forEach((option) => {
        const updateOptions = async () => {
          buttons.forEach((b) => {
            b.parentElement.classList.remove('opened');
          });

          if (currentOption) {
            currentOption.textContent = option.textContent;
          }

          options.forEach((o) => {
            if (option !== o) {
              o.classList.remove('active');
            }
          });
          option.classList.add('active');

          updateQueryURL(wrapper, option, props);
          updateFilterIcon(block);

          if (!button.classList.contains('in-drawer')) {
            await redrawTemplates(block, toolBar, props);
          }
        };

        const radio = option.querySelector('.option-radio');
        if (radio) {
          radio.addEventListener('keydown', async (e) => {
            e.stopPropagation();
            if (e.keyCode === 13) {
              await updateOptions();
            }
          }, { passive: true });
        }

        option.addEventListener('click', async (e) => {
          e.stopPropagation();
          await updateOptions();
        }, { passive: true });
      });

      document.addEventListener('click', (e) => {
        const { target } = e;
        if (target !== wrapper && !wrapper.contains(target) && !button.classList.contains('in-drawer')) {
          wrapper.classList.remove('opened');
        }
      }, { passive: true });
    });

    if (applyFilterButton) {
      applyFilterButton.addEventListener('click', async (e) => {
        e.preventDefault();
        await redrawTemplates(block, toolBar, props);
        closeDrawer(toolBar);
      });
    }

    // sync current filter & sorting method with toolbar current options
    updateOptionsStatus(block, toolBar, props);
    updateFilterIcon(block);
  }
}

function getPlaceholderWidth(block) {
  let width;
  if (window.innerWidth >= 900) {
    if (block.classList.contains('sm-view')) {
      width = 165;
    }

    if (block.classList.contains('md-view')) {
      width = 258.5;
    }

    if (block.classList.contains('lg-view')) {
      width = 352;
    }
  } else if (window.innerWidth >= 600) {
    if (block.classList.contains('sm-view')) {
      width = 165;
    }

    if (block.classList.contains('md-view')) {
      width = 227.33;
    }

    if (block.classList.contains('lg-view')) {
      width = 352;
    }
  } else {
    if (block.classList.contains('sm-view')) {
      width = 106.33;
    }

    if (block.classList.contains('md-view')) {
      width = 165.5;
    }

    if (block.classList.contains('lg-view')) {
      width = 335;
    }
  }

  return width;
}

function toggleMasonryView(block, button, toggleButtons, props) {
  const templatesToView = block.querySelectorAll('.template:not(.placeholder)');
  const blockWrapper = block.closest('.template-list-wrapper');
  if (!button.classList.contains('active') && templatesToView.length > 0) {
    toggleButtons.forEach((b) => {
      if (b !== button) {
        b.classList.remove('active');
      }
    });

    ['sm-view', 'md-view', 'lg-view'].forEach((className) => {
      if (className !== `${button.dataset.view}-view`) {
        block.classList.remove(className);
        blockWrapper.classList.remove(className);
      }
    });
    button.classList.add('active');
    block.classList.add(`${button.dataset.view}-view`);
    blockWrapper.classList.add(`${button.dataset.view}-view`);

    props.masonry?.draw();
  } else {
    button.classList.remove('active');
    ['sm-view', 'md-view', 'lg-view'].forEach((className) => {
      block.classList.remove(className);
      blockWrapper.classList.remove(className);
    });

    props.masonry?.draw();
  }

  const placeholder = block.querySelector('.template.placeholder');
  const ratios = props.placeholderFormat;
  const width = getPlaceholderWidth(block);

  if (ratios?.length === 2) {
    const height = (ratios[1] / ratios[0]) * width;
    placeholder.style = `height: ${height - 21}px`;
    if (width / height > 1.3) {
      placeholder.classList.add('wide');
    }
  }
}

function initViewToggle(block, toolBar, props) {
  const toggleButtons = toolBar.querySelectorAll('.view-toggle-button ');
  const authoredViewIndex = ['sm', 'md', 'lg'].findIndex((size) => getMetadata('initial-template-view')?.toLowerCase().trim() === size);
  const initViewIndex = authoredViewIndex === -1 ? 0 : authoredViewIndex;

  toggleButtons.forEach((button, index) => {
    if (index === initViewIndex && getMetadata('initial-template-view') !== 'no') {
      toggleMasonryView(block, button, toggleButtons, props);
    }

    button.addEventListener('click', () => {
      toggleMasonryView(block, button, toggleButtons, props);
    }, { passive: true });
  });
}

async function decorateBreadcrumbs(block) {
  const parent = block.closest('.section');
  // breadcrumbs are desktop-only
  if (document.body.dataset.device !== 'desktop') return;
  const breadcrumbs = await getBreadcrumbs(createTag, getMetadata, getConfig);
  if (breadcrumbs) parent.prepend(breadcrumbs);
}

function initToolbarShadow(toolbar) {
  const toolbarWrapper = toolbar.parentElement;
  document.addEventListener('scroll', () => {
    if (toolbarWrapper.getBoundingClientRect().top <= 0) {
      toolbarWrapper.classList.add('with-box-shadow');
    } else {
      toolbarWrapper.classList.remove('with-box-shadow');
    }
  });
}

async function decorateToolbar(block, section, props) {
  const toolBar = section.querySelector('.api-templates-toolbar');

  if (toolBar) {
    const toolBarFirstWrapper = toolBar.querySelector('.wrapper-content-search');
    const functionsWrapper = toolBar.querySelector('.wrapper-functions');

    const viewsWrapper = createTag('div', { class: 'views' });

    const smView = createTag('a', { class: 'view-toggle-button small-view', 'data-view': 'sm' });
    smView.append(getIconElementDeprecated('small_grid'));
    const mdView = createTag('a', { class: 'view-toggle-button medium-view', 'data-view': 'md' });
    mdView.append(getIconElementDeprecated('medium_grid'));
    const lgView = createTag('a', { class: 'view-toggle-button large-view', 'data-view': 'lg' });
    lgView.append(getIconElementDeprecated('large_grid'));

    const functionsObj = await makeTemplateFunctions();
    const functions = await decorateFunctionsContainer(
      block,
      section,
      functionsObj,
      props,
    );

    viewsWrapper.append(smView, mdView, lgView);
    functionsWrapper.append(viewsWrapper, functions.desktop);

    toolBar.append(toolBarFirstWrapper, functionsWrapper, functions.mobile);

    decorateSearchFunctions(toolBar, section, props);
    initDrawer(block, section, toolBar, props);
    initFilterSort(block, toolBar, props);
    initViewToggle(block, toolBar, props);
    initToolbarShadow(block, toolBar);
  }
}

export async function decorateTemplateList(block, props) {
  const { prefix } = getConfig().locale;
  if (block.classList.contains('apipowered')) {
    await readRowsFromBlock(block, props);

    const parent = block.closest('.section');
    if (parent) {
      if (block.classList.contains('holiday')) {
        if (props.backgroundColor) {
          parent.style.background = props.backgroundColor;
        }
        const wrapper = parent.querySelector('.template-list-wrapper');
        const icon = props.heading.querySelector('picture');
        const content = Array.from(props.heading.querySelectorAll('p'))
          .filter((p) => p.textContent.trim() !== '' && p.querySelector('a') === null);
        const seeTemplatesLink = props.heading.querySelector('a');

        const toggleBar = createTag('div', { class: 'toggle-bar' });
        const toggle = createTag('div', { class: 'expanded toggle-button' });
        const toggleChev = createTag('div', { class: 'toggle-button-chev' });
        const topElements = createTag('div', { class: 'toggle-bar-top' });
        const bottomElements = createTag('div', { class: 'toggle-bar-bottom' });
        const mobileSubtext = content[1].cloneNode(true);

        seeTemplatesLink.classList.remove('button');
        seeTemplatesLink.classList.remove('accent');
        mobileSubtext.classList.add('mobile-only');

        toggleBar.append(topElements, bottomElements);
        if (icon) {
          parent.classList.add('with-icon');
          topElements.append(icon, content[0]);
        }
        topElements.append(content[0]);
        toggle.append(seeTemplatesLink, toggleChev);
        bottomElements.append(content[1], toggle);
        wrapper.prepend(mobileSubtext);

        const mobileToggle = toggle.cloneNode(true);
        mobileToggle.classList.add('mobile-only');

        wrapper.insertAdjacentElement('afterend', mobileToggle);
        wrapper.classList.add('expanded');

        parent.prepend(toggleBar);
        parent.classList.add('expanded');
        initToggle(parent);

        setTimeout(() => {
          if (wrapper.classList.contains('expanded')) {
            const toggleButtons = parent.querySelectorAll('.toggle-button');

            wrapper.classList.toggle('expanded');
            parent.classList.toggle('expanded');
            Array.from(toggleButtons)
              .forEach((button) => {
                button.classList.toggle('expanded');
              });
          }
        }, props.autoCollapseDelay);
      } else {
        const toolBar = parent.querySelector('.content');
        const templateListWrapper = parent.querySelector('.template-list-wrapper');
        const sectionHeading = parent.querySelector('div > h2');
        let sectionSlug = null;

        const toolBarWrapper = createTag('div', { class: 'toolbar-wrapper' });
        const contentWrapper = createTag('div', { class: 'wrapper-content-search' });
        const functionsWrapper = createTag('div', { class: 'wrapper-functions' });

        if (sectionHeading.textContent.trim().indexOf('{{heading_placeholder}}') >= 0) {
          if (block.classList.contains('spreadsheet-powered') && props.headingTitle) {
            sectionHeading.textContent = props.headingTitle || '';

            if (props.headingSlug) {
              sectionSlug = createTag('p');
              sectionSlug.textContent = props.headingSlug;
            }
          } else if (props.authoringError) {
            sectionHeading.textContent = props.heading;
          } else {
            sectionHeading.textContent = await populateHeadingPlaceholder(prefix, props) || '';
          }
        }

        toolBar.classList.add('api-templates-toolbar');
        toolBar.classList.remove('default-content-wrapper');

        templateListWrapper.before(toolBarWrapper);
        if (props.fallbackMsg) {
          templateListWrapper.classList.add('with-fallback-msg');
          const fallbackMsgWrapper = createTag('div', { class: 'template-list-fallback-msg-wrapper' });
          fallbackMsgWrapper.textContent = props.fallbackMsg;
          templateListWrapper.before(fallbackMsgWrapper);
        }
        toolBarWrapper.append(toolBar);
        toolBar.append(contentWrapper, functionsWrapper);
        contentWrapper.append(sectionHeading);

        if (sectionSlug) {
          contentWrapper.append(sectionSlug);
        }
      }

      if (await replaceKey('template-filter-premium', getConfig()) && !block.classList.contains('horizontal')) {
        document.addEventListener('linkspopulated', async (e) => {
          // desktop/mobile fires the same event
          if (parent.contains(e.detail[0])) {
            await decorateToolbar(block, parent, props);
            await decorateCategoryList(block, parent, props);
          }
        });
      }
    }
  }

  let rows = block.children.length;
  if ((rows === 0 || block.querySelectorAll('img').length === 0) && prefix !== '') {
    const i18nTexts = block.firstElementChild
      // author defined localized edit text(s)
      && (block.firstElementChild.querySelector('p')
        // multiple lines in separate p tags
        ? Array.from(block.querySelectorAll('p'))
          .map((p) => p.textContent.trim())
        // single text directly in div
        : [block.firstElementChild.textContent.trim()]);
    block.innerHTML = '';
    const tls = Array.from(block.closest('main')
      .querySelectorAll('.template-list'));
    const i = tls.indexOf(block);

    const blueprint = await fetchBlueprint(window.location.pathname);

    const bpBlocks = blueprint.querySelectorAll('.template-list');
    if (bpBlocks[i] && bpBlocks[i].className === block.className) {
      block.innerHTML = bpBlocks[i].innerHTML;
    } else if (bpBlocks.length > 1 && bpBlocks[i].className !== block.className) {
      for (let x = 0; x < bpBlocks.length; x += 1) {
        if (bpBlocks[x].className === block.className) {
          block.innerHTML = bpBlocks[x].innerHTML;
          break;
        }
      }
    } else {
      block.remove();
    }

    if (i18nTexts && i18nTexts.length > 0) {
      const [placeholderText] = i18nTexts;
      let [, templateText] = i18nTexts;
      if (!templateText) {
        templateText = placeholderText;
      }
      block.querySelectorAll('a')
        .forEach((a, index) => {
          a.textContent = index === 0 ? placeholderText : templateText;
        });
    }

    const heroPicture = document.querySelector('.hero-bg');

    if (!heroPicture && blueprint) {
      const bpHeroImage = blueprint.querySelector('div:first-of-type img');
      if (bpHeroImage) {
        const heroSection = document.querySelector('main #hero');
        const heroDiv = document.querySelector('main #hero > div');

        if (heroSection && !heroDiv) {
          const p = createTag('p');
          const pic = createTag('picture', { class: 'hero-bg' });
          pic.appendChild(bpHeroImage);
          p.append(pic);
          heroSection.classList.remove('hero-noimage');
          heroDiv.prepend(p);
        }
      }
    }
  }

  const templates = Array.from(block.children);
  // process single column first row as title
  if (templates[0] && templates[0].children.length === 1) {
    const parent = block.closest('.section');
    const titleRow = templates.shift();
    titleRow.classList.add('template-title');
    titleRow.querySelectorAll(':scope a').forEach((a) => {
      a.className = 'template-title-link';
      const p = a.closest('p');
      if (p) {
        p.classList.remove('button-container');
      }
    });

    if (parent && parent.classList.contains('toc-container')) {
      const tocCollidingArea = createTag('div', { class: 'toc-colliding-area' });
      const tocSlot = createTag('div', { class: 'toc-slot' });
      const h2 = titleRow.querySelector('h2');
      if (h2) {
        h2.parentElement.prepend(tocCollidingArea);
        tocCollidingArea.append(tocSlot, h2);
      }
    }

    if (block.classList.contains('collaboration')) {
      const titleHeading = titleRow.querySelector('h3');
      const anchorLink = createTag('a', {
        class: 'collaboration-anchor',
        href: `${document.URL.replace(/#.*$/, '')}#${titleHeading.id}`,
      });
      const clipboardTag = createTag('span', { class: 'clipboard-tag' });
      clipboardTag.textContent = await replaceKey('tag-copied', getConfig());

      anchorLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(anchorLink.href);
        anchorLink.classList.add('copied');
        setTimeout(() => {
          anchorLink.classList.remove('copied');
        }, 2000);
      });

      anchorLink.append(clipboardTag);
      titleHeading.append(anchorLink);
    }
  }

  rows = templates.length;
  let breakpoints = [{ width: '400' }];

  if (rows > 6 && !block.classList.contains('horizontal')) {
    block.classList.add('masonry');
  }

  if (rows === 1) {
    block.classList.add('large');
    breakpoints = [{
      media: '(min-width: 600px)',
      width: '2000',
    }, { width: '750' }];
  }

  block.querySelectorAll(':scope picture > img').forEach((img) => {
    const { src, alt } = img;
    img.parentNode.replaceWith(createOptimizedPicture(src, alt, true, breakpoints));
  });

  // find the edit link and turn the template DIV into the A
  // A
  // +- DIV
  //    +- PICTURE
  // +- DIV
  //    +- SPAN
  //       +- "Edit this template"
  //
  // make copy of children to avoid modifying list while looping

  populateTemplates(block, templates, props);

  if (block.classList.contains('spreadsheet-powered')
    && !block.classList.contains('apipowered')
    && block.classList.contains('mini')) {
    const links = block.querySelectorAll('a:any-link');
    links.forEach((link) => {
      const isPlaceholder = link.querySelector(':scope > div:first-of-type > img[src*=".svg"], :scope > div:first-of-type > svg');
      const secondDiv = link.querySelector(':scope > div:last-of-type');

      if (isPlaceholder) {
        link.classList.add('placeholder');
      }

      secondDiv.classList.add('button-container');
    });
  }

  if (!block.classList.contains('horizontal')) {
    if (rows > 6 || block.classList.contains('sixcols') || block.classList.contains('fullwidth')) {
      /* flex masonry */
      const cells = Array.from(block.children);
      block.classList.remove('masonry');
      block.classList.add('flex-masonry');

      props.masonry = new Masonry(block, cells);
      props.masonry.draw();
      window.addEventListener('resize', () => {
        props.masonry.draw();
      });
    } else {
      block.classList.add('template-list-complete');
    }
  }

  await attachFreeInAppPills(block);

  const templateLinks = block.querySelectorAll('a.template');
  const linksPopulated = new CustomEvent('linkspopulated', { detail: templateLinks });
  document.dispatchEvent(linksPopulated);
}

async function decorateLoadMoreButton(block, props) {
  const loadMoreDiv = createTag('div', { class: 'load-more' });
  const loadMoreButton = createTag('button', { class: 'load-more-button' });
  const loadMoreText = createTag('p', { class: 'load-more-text' });
  loadMoreDiv.append(loadMoreButton, loadMoreText);
  loadMoreText.textContent = await replaceKey('load-more', getConfig());
  block.insertAdjacentElement('afterend', loadMoreDiv);
  loadMoreButton.append(getIconElementDeprecated('plus-icon'));

  loadMoreButton.addEventListener('click', async () => {
    loadMoreButton.classList.add('disabled');
    const scrollPosition = window.scrollY;
    await decorateNewTemplates(block, props);
    window.scrollTo({
      top: scrollPosition,
      left: 0,
      behavior: 'smooth',
    });
    loadMoreButton.classList.remove('disabled');
  });

  return loadMoreDiv;
}

async function decorateTailButton(block, props) {
  const carouselPlatform = block.querySelector('.carousel-platform');

  if (block.classList.contains('spreadsheet-powered')) {
    if (await replaceKey('relevant-rows-view-all', getConfig()) && (props.viewAllLink || await replaceKey('relevant-rows-view-all-link', getConfig()))) {
      props.tailButton = createTag('a', { class: 'button accent tail-cta' });
      props.tailButton.innerText = await replaceKey('relevant-rows-view-all', getConfig());
      props.tailButton.href = props.viewAllLink || await replaceKey('relevant-rows-view-all-link', getConfig());
    }
  }

  if (carouselPlatform && props.tailButton) {
    props.tailButton.classList.add('tail-cta');
    carouselPlatform.append(props.tailButton);
  }
}

function cacheCreatedTemplate(block, props) {
  const lastRow = block.children[block.children.length - 1];
  if (lastRow && lastRow.querySelector(':scope > div:first-of-type > img[src*=".svg"], :scope > div:first-of-type > svg')) {
    props.templates.push(lastRow.cloneNode(true));
    lastRow.remove();
  }
}

function addBackgroundAnimation(block, animationUrl) {
  const parent = block.closest('.template-list-horizontal-apipowered-holiday-container');

  if (parent) {
    parent.classList.add('with-animation');
    const videoBackground = createTag('video', { class: 'animation-background' });
    videoBackground.append(createTag('source', { src: animationUrl, type: 'video/mp4' }));
    videoBackground.setAttribute('autoplay', '');
    videoBackground.setAttribute('muted', '');
    videoBackground.setAttribute('loop', '');
    videoBackground.setAttribute('playsinline', '');
    parent.prepend(videoBackground);
    videoBackground.muted = true;
  }
}

async function fetchBlockFragDeprecated(url, blockName) {
  const location = new URL(window.location);
  const { prefix } = getConfig().locale;
  const fragmentUrl = `${location.origin}${prefix}${url}`;

  const path = new URL(fragmentUrl).pathname.split('.')[0];
  const resp = await fetch(`${path}.plain.html`);
  if (resp.status === 404) {
    return null;
  }

  const html = await resp.text();
  const section = createTag('div');
  section.innerHTML = html;
  section.className = 'section';
  const block = section.querySelector(`.${blockName}`);
  block.dataset.blockName = blockName;
  block.parentElement.className = `${blockName}-wrapper`;
  block.classList.add('block');
  const img = section.querySelector('img');
  if (img) {
    img.setAttribute('loading', 'lazy');
  }
  return section;
}

async function replaceRRTemplateList(block, props) {
  const relevantRowsData = await fetchRelevantRows(window.location.pathname);
  props.limit = parseInt(await replaceKey('relevant-rows-templates-limit', getConfig()), 10) || 10;

  if (relevantRowsData) {
    block.closest('.section').dataset.audience = 'mobile';
    props.headingTitle = relevantRowsData.header || null;
    props.headingSlug = relevantRowsData.shortTitle || null;
    props.viewAllLink = relevantRowsData.viewAllLink || null;

    if (relevantRowsData.manualTemplates === 'Y') {
      const sectionFromFragment = await fetchBlockFragDeprecated(`/express/fragments/relevant-rows/${relevantRowsData.templateFragment}`, 'template-list');
      const newBlock = sectionFromFragment.querySelector('.template-list');

      if (newBlock) {
        const section = block.closest('.section');
        const sectionHeading = section.querySelector('div.content > h2');
        let sectionSlug = null;

        if (sectionHeading.textContent.trim().indexOf('{{heading_placeholder}}') >= 0) {
          if (block.classList.contains('spreadsheet-powered') && props.headingTitle) {
            sectionHeading.textContent = props.headingTitle || '';

            if (props.headingSlug) {
              sectionSlug = createTag('p');
              sectionSlug.textContent = props.headingSlug;
            }
          }
        }
        block.classList.remove('apipowered');
        block.innerHTML = newBlock.innerHTML;
        await fixIcons(block);
      }
    }

    block.innerHTML = block.innerHTML.replaceAll('default-title', relevantRowsData.shortTitle || '')
      .replaceAll('default-tasks', relevantRowsData.templateTasks || '')
      .replaceAll('default-topics', relevantRowsData.templateTopics || '')
      .replaceAll('default-locale', relevantRowsData.templateLocale || 'en')
      .replaceAll('default-premium', relevantRowsData.templatePremium || '')
      .replaceAll('default-animated', relevantRowsData.templateAnimated || '')
      .replaceAll('https://www.adobe.com/express/templates/default-create-link', relevantRowsData.createLink || '/')
      .replaceAll('default-format', relevantRowsData.placeholderFormat || '');

    if (relevantRowsData.templateTasks === '') {
      block.innerHTML = block.innerHTML.replaceAll('default-create-link-text', await replaceKey('start-from-scratch', getConfig()) || '');
    } else {
      block.innerHTML = block.innerHTML.replaceAll('default-create-link-text', relevantRowsData.createText || '');
    }
  } else {
    block.remove();
  }
}

function constructProps() {
  const smScreen = window.matchMedia('(max-width: 900px)');
  const mdScreen = window.matchMedia('(min-width: 901px) and (max-width: 1200px)');
  const bgScreen = window.matchMedia('(max-width: 1440px)');
  const ratioSeparator = getMetadata('placeholder-format')?.includes(':') ? ':' : 'x';
  const ratioFromMetadata = getMetadata('placeholder-format')
    ?.split(ratioSeparator)
    .map((str) => parseInt(str, 10));

  return {
    templates: [],
    filters: {
      locales: getMetadata('locales') || '(en)',
      tasks: getMetadata('tasks') || '',
      topics: getMetadata('topics') || '',
      premium: getMetadata('premium') || '',
      animated: getMetadata('animated') || '',
    },
    tailButton: '',
    // eslint-disable-next-line no-nested-ternary
    limit: smScreen.matches ? 20 : mdScreen.matches ? 30 : bgScreen.matches ? 40 : 70,
    total: 0,
    start: '',
    sort: '-_score,-remixCount',
    masonry: undefined,
    authoringError: false,
    headingTitle: null,
    headingSlug: null,
    viewAllLink: null,
    placeholderFormat: ratioFromMetadata,
    renditionParams: {
      format: 'jpg',
      dimension: 'width',
      size: 151,
    },
    loadedOtherCategoryCounts: false,
  };
}

export default async function decorate(block) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]).then(([utils, placeholders]) => {
    ({ createTag, getConfig, getMetadata } = utils);
    ({ replaceKey } = placeholders);
  });
  const newBlock = block.cloneNode(true);
  block.parentNode.insertBefore(newBlock, block);
  block.remove();
  addTempWrapperDeprecated(newBlock, 'template-list');

  decorateSocialIcons(newBlock);

  await fixIcons(newBlock);

  const section = newBlock.closest('.section');

  section.classList.add(`${[...newBlock.classList].join('-')}-container`);

  newBlock.classList.add(
    ...[...newBlock.classList]
      .slice(1)
      .map((v) => v.split('-'))
      .reduce(
        (result, subclass) => ([...result, ...subclass]),
        [],
      ),
  );

  await decorateButtonsDeprecated(block);

  const props = constructProps();
  if (newBlock.classList.contains('spreadsheet-powered')) {
    await replaceRRTemplateList(newBlock, props);
  }

  if (newBlock.classList.contains('apipowered') && !newBlock.classList.contains('holiday')) {
    cacheCreatedTemplate(newBlock, props);
  }

  await decorateBreadcrumbs(newBlock);

  await decorateTemplateList(newBlock, props);

  if (newBlock.classList.contains('basic-carousel')) {
    await buildBasicCarousel(':scope > .template', newBlock);
  } else if (newBlock.classList.contains('horizontal')) {
    const requireInfiniteScroll = !newBlock.classList.contains('mini') && !newBlock.classList.contains('collaboration');
    await buildCarousel(':scope > .template', newBlock, requireInfiniteScroll);
  } else {
    addAnimationToggle(newBlock);
  }

  if (newBlock.classList.contains('apipowered') && !newBlock.classList.contains('holiday') && !newBlock.classList.contains('mini')) {
    const loadMore = await decorateLoadMoreButton(newBlock, props);

    if (loadMore) {
      updateLoadMoreButton(newBlock, loadMore, props);
    }
  }

  if (newBlock.classList.contains('mini') || newBlock.classList.contains('apipowered')) {
    await decorateTailButton(newBlock, props);
  }

  if (newBlock.classList.contains('holiday') && props.backgroundAnimation) {
    addBackgroundAnimation(newBlock, props.backgroundAnimation);
  }
}
