import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';
import { formatDynamicCartLink } from '../../scripts/utils/pricing.js';

const iconRegex = /icon-\s*([^\s]+)/;
let decorateButtons; let createTag;

export default async function init(el) {
  ({ decorateButtons } = await import(`${getLibs()}/utils/decorate.js`));
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  decorateButtons(el);
  const rows = [...el.children];
  const [header, subheader, ...linkRows] = rows;
  header.classList.add('header');
  const closeIcon = getIconElementDeprecated('close-white');
  header.append(closeIcon);
  subheader.classList.add('subheader');

  const linkRowsContainer = createTag('div', { class: 'link-rows-container' });
  linkRows.forEach((link) => {
    formatDynamicCartLink(link.querySelector('a'));
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
