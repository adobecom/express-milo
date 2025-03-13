import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';

const iconRegex = /icon-\s*([^\s]+)/;
let decorateButtons; let createTag;

export default async function init(el) {
  [{ decorateButtons }, { createTag }] = await Promise.all([import(`${getLibs()}/utils/decorate.js`), import(`${getLibs()}/utils/utils.js`)]);

  decorateButtons(el);
  const rows = [...el.children];
  const [header, subheader, ...linkRows] = rows;
  header.classList.add('header');
  const closeButton = createTag('button', {
    class: 'close',
    'aria-label': 'Close', // TODO: localize via placeholders
  }, getIconElementDeprecated('close-white'));
  closeButton.addEventListener('click', () => {
    el.classList.add('hide');
  });
  header.append(closeButton);
  subheader.classList.add('subheader');

  const linkRowsContainer = createTag('div', { class: 'link-rows-container' });
  linkRows.forEach((link) => {
    link.classList.add('floating-panel-link-row');
    const icon = link.querySelector('.icon');
    const match = icon && iconRegex.exec(icon.className);
    if (match?.[1]) {
      icon.append(getIconElementDeprecated(match[1]));
    }
    linkRowsContainer.append(link);
  });
  el.append(linkRowsContainer);
  return el;
}
