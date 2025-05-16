import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';

let createTag; let getConfig;
let replaceKey;

export default async function init(el) {
  [{ createTag, getConfig }, { replaceKey }] = await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]);
  const [headlineRow, recipe] = el.children;
  headlineRow.classList.add('headline-container');
  const [popular, newTemplates] = await Promise.all(
    [
      replaceKey('popular', getConfig()),
      replaceKey('new-templates', getConfig()),
    ],
  );
  const icon = getIconElementDeprecated('close-black');
  const options = [popular, newTemplates].map((key) => createTag('option', { value: key }, key));
  const sortDropdown = createTag('select', {}, options);
  el.append(sortDropdown);
}
