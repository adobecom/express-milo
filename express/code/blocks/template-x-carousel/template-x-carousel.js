import { getLibs } from '../../scripts/utils.js';
import { fetchResults, isValidTemplate } from '../../scripts/template-utils.js';
import renderTemplate from '../template-x/template-rendering.js';
import buildGallery from '../../scripts/widgets/gallery/gallery.js';

let createTag; let getConfig;
let replaceKey;

async function createTemplates(recipe, customProperties = null) {
  const res = await fetchResults(recipe);
  const templates = await Promise.all(
    res.items
      .filter((item) => isValidTemplate(item))
      .map((item) => renderTemplate(item, undefined, customProperties)),
  );
  templates.forEach((tplt) => tplt.classList.add('template'));
  return templates;
}

async function createTemplatesContainer(recipe, el) {
  const templatesContainer = createTag('div', { class: 'templates-container search-bar-gallery' });

  // Create custom properties for search bar variant
  const customProperties = {
    customUrlConfig: {
      baseUrl: 'https://adobesparkpost.app.link/8JaoEy0DrSb',
      queryParams: 'source=seo-template',
    },
  };

  // Create templates (no from-scratch element in search bar mode)
  const templates = await createTemplates(recipe, customProperties);
  templatesContainer.append(...templates);

  const { control: initialControl } = await buildGallery(
    templates,
    templatesContainer,
  );
  return {
    templatesContainer,
    updateTemplates: async (newRecipe) => {
      const newTemplates = await createTemplates(newRecipe, customProperties);
      templatesContainer.replaceChildren(...newTemplates);
      const { control: newControl } = await buildGallery(
        newTemplates,
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

const sortConfig = {
  popular: '-remixCount',
  'new-templates': '-createDate',
};

export async function extractSort(recipe) {
  const recipeParams = new URLSearchParams(recipe);
  const sortKeys = Object.keys(sortConfig);
  const sortValues = Object.values(sortConfig);
  const [sortPlaceholderText, ...sortOptionTexts] = await Promise.all([
    replaceKey('sort', getConfig()),
    ...(sortKeys.map((key) => replaceKey(key, getConfig()))),
  ]);
  const sortOptions = sortKeys.map((key, i) => {
    const sortedRecipe = new URLSearchParams(recipeParams);
    sortedRecipe.set('orderBy', sortConfig[key]);
    return {
      text: sortOptionTexts[i],
      recipe: sortedRecipe.toString(),
    };
  });
  const defaultIndex = Math.max(0, sortValues.indexOf(
    recipeParams.get('orderBy'),
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

  try {
    // TODO: lazy load templates
    const {
      templatesContainer,
      control: galleryControl } = await createTemplatesContainer(recipe, el);

    const controlsContainer = createTag('div', { class: 'controls-container' });
    controlsContainer.append(galleryControl);
    toolbar.append(controlsContainer);

    el.append(templatesContainer);
  } catch (err) {
    window.lana?.log(`Error in template-x-carousel-toolbar: ${err}`);
    if (getConfig().env.name === 'prod') {
      el.remove();
    } else {
      el.textContent = 'Error loading templates, please refresh the page or try again later.';
    }
  }
}
