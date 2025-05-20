import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';
import { fetchResults } from '../../scripts/template-utils.js';
import renderTemplate from '../template-x/template-rendering.js';
import buildCarousel from '../../scripts/widgets/carousel.js';

let createTag; let getConfig;
let replaceKey;

function createDropdown(optionKeys) {
  let currentIndex = 0;
  const select = createTag('div', { class: 'select', role: 'combobox', 'aria-haspopup': 'listbox', 'aria-expanded': 'false', tabindex: '0' });
  const selectedOption = createTag('div', { class: 'selected-option' }, [getIconElementDeprecated('template-lightning'), optionKeys[0]]);
  const options = optionKeys.map((key) => (createTag('li', { class: 'option', role: 'option' }, [getIconElementDeprecated('template-lightning'), key])));
  options[0].setAttribute('aria-selected', 'true');
  const optionList = createTag('ul', { class: 'options', role: 'listbox', tabindex: -1 }, options);
  function updateFocus() {
    options.forEach((o) => o.classList.remove('hovered'));
    options[currentIndex].classList.add('hovered');
    options[currentIndex].scrollIntoView({ block: 'nearest' });
  }
  const selectedOptionWrapper = createTag('div', { class: 'selected-option-wrapper' }, [selectedOption, getIconElementDeprecated('drop-down-arrow')]);
  select.append(selectedOptionWrapper, optionList);

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
      options.forEach((o) => o.setAttribute('aria-selected', 'false'));
      opt.setAttribute('aria-selected', 'true');
      selectedOption.innerHTML = opt.innerHTML;
      currentIndex = index;
      select.setAttribute('aria-expanded', 'false');
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

async function createTemplates(recipe) {
  const templatesContainer = createTag('div', { class: 'templates-container' });
  const res = await fetchResults(recipe);
  const templates = await Promise.all(res.items.map((item) => renderTemplate(item)));
  templates.forEach((tplt) => tplt.classList.add('template'));
  templatesContainer.append(...templates);
  await buildCarousel(':scope > .template', templatesContainer);
  return templatesContainer;
}

export default async function init(el) {
  [{ createTag, getConfig }, { replaceKey }] = await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]);
  const [headlineRow, recipeRow] = el.children;
  headlineRow.classList.add('headline-container');
  const recipe = recipeRow.textContent.trim().toLowerCase();
  recipeRow.remove();
  const [popular, newTemplates] = await Promise.all(
    [
      replaceKey('popular', getConfig()),
      replaceKey('new-templates', getConfig()),
    ],
  );
  const templates = await createTemplates(recipe); // TODO: lazy load
  el.append(createDropdown([popular, newTemplates]), templates);
}
