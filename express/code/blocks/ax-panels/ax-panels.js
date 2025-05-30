import { getLibs, getIconElementDeprecated, convertToInlineSVG, readBlockConfig } from '../../scripts/utils.js';

let createTag;

const iconRegex = /icon-\s*([^\s]+)/;

function tagPanels(section) {
  const metadataDiv = section.querySelector(':scope > .section-metadata');
  if (!metadataDiv) return;
  const meta = readBlockConfig(metadataDiv);
  const keys = Object.keys(meta);
  keys.filter((key) => key.trim().toLowerCase() === 'ax-panel').forEach((key) => {
    const val = meta[key].trim().toLowerCase();
    section.setAttribute('role', 'tabpanel');
    section.setAttribute('data-ax-panel', val);
    section.setAttribute('id', `ax-panel-${val}`);
  });
}

export default async function init(el) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const enclosingMain = el.closest('main');
  if (!enclosingMain) return;
  [...enclosingMain.querySelectorAll('.section')].forEach((section) => tagPanels(section));

  const [headingContainer, tabListContainer] = el.querySelectorAll(':scope > div');
  headingContainer.classList.add('ax-panels-heading-container');
  tabListContainer.classList.add('tablist-container');

  const sections = [...enclosingMain.querySelectorAll('[data-ax-panel]')];

  const tabList = tabListContainer.querySelector('ul');
  tabList.setAttribute('role', 'tablist');
  const listItems = [...tabList.querySelectorAll('li')];

  let activeTab = null;
  const tabs = listItems.map((listItem, index) => {
    const text = listItem.textContent.trim().toLowerCase();
    const tab = createTag('button', {
      role: 'tab',
      'aria-selected': index === 0,
      'data-text': text,
      'aria-controls': sections.filter((section) => section.getAttribute('data-ax-panel') === text)[0].id,
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
        if (tab.dataset.text === section.getAttribute('data-ax-panel')) {
          section.classList.remove('hide');
        } else {
          section.classList.add('hide');
        }
      });
      activeTab = tab;
    });
    return tab;
  });

  tabs.forEach((tab, i) => {
    listItems[i].replaceChildren(tab);
  });

  if (sections) {
    sections.forEach((section, index) => {
      if (index > 0) {
        section.classList.add('hide');
      }
    });
  }
}
