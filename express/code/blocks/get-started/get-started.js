import { getLibs, getIconElementDeprecated, convertToInlineSVG, readBlockConfig } from '../../scripts/utils.js';

let createTag;

const iconRegex = /icon-\s*([^\s]+)/;

function decorateSectionMetadata(section) {
  const metadataDiv = section.querySelector(':scope > .section-metadata');
  if (!metadataDiv) return;
  const meta = readBlockConfig(metadataDiv);
  const keys = Object.keys(meta);
  keys.filter((key) => key.trim().toLowerCase() === 'get-started').forEach((key) => {
    section.setAttribute('role', 'tabpanel');
    section.setAttribute('data-get-started', meta[key].trim().toLowerCase());
  });
}

export default async function init(el) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const enclosingMain = el.closest('main');
  if (!enclosingMain) return;
  [...enclosingMain.querySelectorAll('.section')].forEach(decorateSectionMetadata);

  const [headlineContainer, tabListContainer] = el.querySelectorAll(':scope > div');
  headlineContainer.classList.add('get-started-headline-container');
  tabListContainer.classList.add('tablist-container');

  const sections = enclosingMain.querySelectorAll('[data-get-started]');

  const tabList = tabListContainer.querySelector('ul');
  tabList.setAttribute('role', 'tablist');
  const listItems = [...tabList.querySelectorAll('li')];

  // TODO: aria-controls
  let activeTab = null;
  const tabs = listItems.map((listItem, index) => {
    const tab = createTag('button', {
      role: 'tab',
      'aria-selected': index === 0,
      'data-text': listItem.textContent.trim().toLowerCase(),
    });
    const icon = listItem.querySelector('.icon');
    const match = icon && iconRegex.exec(icon.className);
    if (match?.[1]) {
      convertToInlineSVG(getIconElementDeprecated(match[1])).then((svg) => {
        icon.setAttribute('aria-hidden', 'true');
        icon.append(svg);
      });
    }
    tab.append(icon, listItem.textContent);
    activeTab ||= tab;
    tab.addEventListener('click', () => {
      if (tab === activeTab) return;
      tab.setAttribute('aria-selected', true);
      activeTab.setAttribute('aria-selected', false);
      sections.forEach((section) => {
        if (tab.dataset.text === section.getAttribute('data-get-started')) {
          section.classList.remove('hide');
        } else {
          section.classList.add('hide');
        }
      });
      activeTab = tab;
    });
    return tab;
  });

  listItems.forEach((li, i) => {
    li.innerHTML = '';
    li.append(tabs[i]);
  });

  if (sections) {
    sections.forEach((section, index) => {
      if (index > 0) {
        section.classList.add('hide');
      }
    });
  }
}
