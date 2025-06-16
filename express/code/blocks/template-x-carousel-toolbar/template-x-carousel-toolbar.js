import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';
import { fetchResults } from '../../scripts/template-utils.js';
import renderTemplate from '../template-x/template-rendering.js';
import buildGallery from '../../scripts/widgets/gallery/gallery.js';

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
  const svg = getIconElementDeprecated('start-from-scratch');
  const text = createTag('div', { class: 'from-scratch-text' }, fromScratchText);
  fromScratchBorder.append(svg, text);
  return fromScratchContainer;
}

async function createTemplatesContainer(recipe, el) {
  const templatesContainer = createTag('div', { class: 'templates-container' });
  const [scratch, templates] = await Promise.all([createFromScratch(), createTemplates(recipe)]);
  templatesContainer.append(scratch, ...templates);
  const { control: initialControl } = await buildGallery(
    [scratch, ...templates],
    templatesContainer,
  );
  return {
    templatesContainer,
    updateTemplates: async (newRecipe) => {
      const newTemplates = await createTemplates(newRecipe);
      templatesContainer.replaceChildren(scratch, ...newTemplates);
      const { control: newControl } = await buildGallery(
        [scratch, ...newTemplates],
        templatesContainer,
      );
      const oldControl = el.querySelector('.gallery-control');
      // hack to reduce cls. TODO: implement updateItems() for gallery
      newControl.style.display = 'flex';
      oldControl.replaceWith(newControl);
    },
    control: initialControl,
  };
}

function createDropdown(sortOptions, defaultIndex, updateTemplates, sortPlaceholderText) {
  let currentIndex = defaultIndex;
  const select = createTag('div', {
    class: 'select',
    role: 'combobox',
    'aria-haspopup': 'listbox',
    'aria-label': sortPlaceholderText,
    'aria-expanded': 'false',
    tabindex: '0',
  });
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
  const recipeParams = new URLSearchParams(recipe);
  const sortKeys = Object.keys(sortConfig);
  const sortValues = Object.values(sortConfig);
  // const [sortPlaceholderText, ...sortOptionTexts] = await Promise.all(
  const ha = await Promise.all([
    replaceKey('sort', getConfig()),
    ...(sortKeys.map((key) => replaceKey(key, getConfig()))),
  ]);
  const [sortPlaceholderText, ...sortOptionTexts] = ha;
  const sortOptions = sortKeys.map((key, i) => {
    const sortedRecipe = new URLSearchParams(recipeParams);
    sortedRecipe.set('orderBy', sortConfig[key]);
    return {
      text: sortOptionTexts[i],
      recipe: sortedRecipe.toString(),
    };
  });
  const defaultIndex = Math.max(0, sortValues.indexOf(
    (sortValues.includes(recipeParams.get('orderBy'))),
  ));
  return { sortOptions, defaultIndex, sortPlaceholderText };
}

export default async function init(el) {
  [{ createTag, getConfig }, { replaceKey }] = await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]);
  const [toolbar, recipeRow] = el.children;
  const heading = toolbar.querySelector('h1,h2,h3');
  if (heading) {
    heading.classList.add('heading');
    el.prepend(heading);
  }
  toolbar.classList.add('toolbar');
  const recipe = recipeRow.textContent.trim();
  recipeRow.remove();

  // TODO: lazy load templates
  const [
    { templatesContainer, updateTemplates, control: galleryControl },
    sortSetup,
  ] = await Promise.all([createTemplatesContainer(recipe, el), extractSort(recipe)]);
  const { sortOptions, defaultIndex, sortPlaceholderText } = sortSetup;
  const dropdown = createDropdown(sortOptions, defaultIndex, updateTemplates, sortPlaceholderText);
  const controlsContainer = createTag('div', { class: 'controls-container' }, [dropdown, galleryControl]);
  sortOptions && controlsContainer.append(dropdown);
  controlsContainer.append(galleryControl);
  toolbar.append(controlsContainer);
  el.append(templatesContainer);
}
