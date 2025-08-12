import { getLibs } from '../../scripts/utils.js';
import { fetchResults, isValidTemplate } from '../../scripts/template-utils.js';
import renderTemplate from '../template-x/template-rendering.js';
import buildGallery from '../../scripts/widgets/gallery/gallery.js';

let createTag;
let getConfig;
let replaceKey;

async function createTemplates(recipe) {
  const res = await fetchResults(recipe);
  const templates = await Promise.all(
    res.items
      .filter((item) => isValidTemplate(item))
      .map((item) => renderTemplate(item)),
  );
  templates.forEach((tplt) => tplt.classList.add('template'));
  return templates;
}

async function createTemplatesContainer(recipe) {
  const templatesContainer = createTag('div', { class: 'templates-container' });
  const [templates] = await Promise.all([createTemplates(recipe)]);
  templatesContainer.append(...templates);
  const { control: initialControl } = await buildGallery(
    [...templates],
    templatesContainer,
  );
  return {
    templatesContainer,
    control: initialControl,
  };
}

function decorateHeadingRow(headingRow) {
  headingRow.classList.add('heading-row');
  headingRow.querySelector('h1,h2,h3,h4,h5')?.classList.add('heading');
  [...headingRow.querySelectorAll('p')].forEach((p) => p.classList.add('subcopy'));
}

export default async function init(el) {
  [{ createTag, getConfig }, { replaceKey }] = await Promise.all([
    import(`${getLibs()}/utils/utils.js`),
    import(`${getLibs()}/features/placeholders.js`),
  ]);
  const [headingRow, recipeRow] = el.children;
  decorateHeadingRow(headingRow);
  const recipe = recipeRow.textContent.trim();
  recipeRow.remove();

  try {
    // TODO: lazy load templates
    const [{ templatesContainer, control: galleryControl }] = await Promise.all(
      [createTemplatesContainer(recipe, el)],
    );
    el.append(templatesContainer);
    el.append(galleryControl);
  } catch (err) {
    window.lana?.log(`Error in template-x-carousel-toolbar: ${err}`);
    if (getConfig().env.name === 'prod') {
      el.remove();
    } else {
      el.textContent = 'Error loading templates, please refresh the page or try again later.';
    }
  }
}
