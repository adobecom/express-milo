import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';
import { fetchResults } from '../../scripts/template-utils.js';
import renderTemplate from '../template-x/template-rendering.js';
import buildCarousel from '../../scripts/widgets/carousel.js';

let createTag; let getConfig;
let replaceKey;

const fromScratchFallbackLink = 'https://adobesparkpost.app.link/c4bWARQhWAb';

async function createTemplates(recipe) {
  const res = await fetchResults(recipe);
  const templates = await Promise.all(res.items.map((item) => renderTemplate(item)));
  templates.forEach((tplt) => tplt.classList.add('template'));
  return templates;
}

async function createFromScratch() {
  const [fromScratchText, searchBranchLinks] = await Promise.all([
    replaceKey('start-from-scratch', getConfig()),
    replaceKey('search-branch-links', getConfig()),
  ]);
  const fromScratchHref = searchBranchLinks.split(',')[0]?.trim() || fromScratchFallbackLink;
  const fromScratchBorder = createTag('div', { class: 'from-scratch-border' });
  const fromScratchContainer = createTag('a', {
    class: 'from-scratch-container',
    rel: 'nofollow',
    target: '_self',
    href: fromScratchHref,
  }, fromScratchBorder);
  const svg = getIconElementDeprecated('blank');
  const text = createTag('div', { class: 'from-scratch-text' }, fromScratchText);
  fromScratchBorder.append(svg, text);
  return fromScratchContainer;
}

async function createTemplatesContainer(recipe) {
  const templatesContainer = createTag('div', { class: 'templates-container' });
  const [scratch, templates] = await Promise.all([createFromScratch(), createTemplates(recipe)]);
  templatesContainer.append(scratch, ...templates);
  await buildCarousel(':scope > .template, :scope > .from-scratch-container', templatesContainer);
  return {
    templatesContainer,
    updateTemplates: async (newRecipe) => {
      templatesContainer.replaceChildren(...(await createTemplates(newRecipe)));
      buildCarousel(':scope > .template', templatesContainer);
    },
  };
}

function createDropdown(sortOptions, defaultIndex, updateTemplates) {
  let currentIndex = defaultIndex;
  const select = createTag('div', { class: 'select', role: 'combobox', 'aria-haspopup': 'listbox', 'aria-expanded': 'false', tabindex: '0' });
  const selectedOption = createTag('div', { class: 'selected-option' }, [getIconElementDeprecated('template-lightning'), sortOptions[defaultIndex].text]);
  const options = sortOptions.map(({ text }) => (createTag('li', { class: 'option', role: 'option' }, [getIconElementDeprecated('template-lightning'), text])));
  options[defaultIndex].setAttribute('aria-selected', 'true');
  const optionList = createTag('ul', { class: 'options', role: 'listbox', tabindex: -1 }, options);
  function updateFocus() {
    options.forEach((o) => o.classList.remove('hovered'));
    options[currentIndex].classList.add('hovered');
    options[currentIndex].scrollIntoView({ block: 'nearest' });
  }
  const selectedOptionWrapper = createTag('div', { class: 'selected-option-wrapper' }, [selectedOption, getIconElementDeprecated('drop-down-arrow')]);
  select.append(selectedOptionWrapper, optionList);
  const optionListProxy = optionList.cloneNode(true);
  optionListProxy.setAttribute('aria-hidden', 'true');
  optionListProxy.classList.add('sizing-proxy');
  select.append(optionListProxy);

  select.addEventListener('click', () => {
    const expanded = select.getAttribute('aria-expanded') === 'true';
    select.setAttribute('aria-expanded', String(!expanded));
    if (!expanded) {
      options.forEach((o, i) => {
        if (o.getAttribute('aria-selected') === 'true') {
          currentIndex = i;
        }
      });
      updateFocus();
    }
  });
  select.addEventListener('keydown', (e) => {
    const expanded = select.getAttribute('aria-expanded') === 'true';
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (expanded) {
        currentIndex = (currentIndex + 1) % options.length;
        updateFocus();
      } else {
        select.click();
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (expanded) {
        currentIndex = (currentIndex - 1 + options.length) % options.length;
        updateFocus();
      }
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (expanded) {
        options[currentIndex].click();
      } else {
        select.click();
      }
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      select.setAttribute('aria-expanded', 'false');
    }
    if (e.key === 'Tab') {
      if (expanded) {
        select.click();
      }
    }
  });
  options.forEach((opt, index) => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      if (opt.getAttribute('aria-selected') === 'true') {
        select.click();
        return;
      }
      options.forEach((o) => o.setAttribute('aria-selected', 'false'));
      opt.setAttribute('aria-selected', 'true');
      selectedOption.innerHTML = opt.innerHTML;
      currentIndex = index;
      select.setAttribute('aria-expanded', 'false');
      updateTemplates(sortOptions[index].recipe);
    });
    opt.addEventListener('mouseenter', () => {
      currentIndex = index;
      updateFocus();
    });
  });
  document.addEventListener('click', (e) => {
    if (select.contains(e.target)) return;
    select.getAttribute('aria-expanded') === 'true' && select.click();
  });
  return select;
}

const sortConfig = {
  popular: '-remixCount',
  'new-templates': '-createDate',
};

export async function extractSort(recipe) {
  if (!recipe) return null;
  const recipeParams = new URLSearchParams(recipe);
  if (!recipeParams.has('orderBy')) return null;
  const order = recipeParams.get('orderBy');
  if (!Object.values(sortConfig).includes(order)) return null;
  const sortKeys = Object.keys(sortConfig);
  const defaultIndex = sortKeys.indexOf(sortKeys.find((key) => sortConfig[key] === order));
  const sortOptionTexts = await Promise.all(sortKeys.map((key) => replaceKey(key, getConfig())));
  const sortOptions = sortKeys.map((key, i) => {
    const sortedRecipe = new URLSearchParams(recipeParams);
    sortedRecipe.set('orderBy', sortConfig[key]);
    return {
      text: sortOptionTexts[i],
      recipe: sortedRecipe.toString(),
    };
  });
  return { sortOptions, defaultIndex };
}

export default async function init(el) {
  [{ createTag, getConfig }, { replaceKey }] = await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]);
  const [headlineRow, recipeRow] = el.children;
  headlineRow.classList.add('headline-container');
  const recipe = recipeRow.textContent.trim();
  recipeRow.remove();

  // TODO: lazy load templates
  const [
    { templatesContainer, updateTemplates },
    sortSetup,
  ] = await Promise.all([createTemplatesContainer(recipe), extractSort(recipe)]);
  const { sortOptions, defaultIndex } = sortSetup || {};
  sortOptions && headlineRow.append(createDropdown(sortOptions, defaultIndex, updateTemplates));

  el.append(templatesContainer);
  createFromScratch();
}
