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
  const headingId = headingContainer.querySelector('h2,h3')?.id;
  headingId && tabList.setAttribute('aria-labelledby', headingId);

  let activeTab = null;
  const tabs = [...tabList.querySelectorAll('li')].map((listItem, index) => {
    const tabVal = listItem.textContent.trim().toLowerCase();
    const tabId = `ax-panel-tab-${tabVal}`;
    const controlledSection = sections.filter((section) => section.id === `ax-panel-${tabVal}`)[0];
    const tab = createTag('button', {
      role: 'tab',
      'aria-selected': index === 0,
      id: tabId,
      'aria-controls': controlledSection.id,
      tabIndex: index > 0 ? '-1' : '0',
    });
    controlledSection.setAttribute('aria-labelledby', tabId);
    if (index > 0) controlledSection.classList.add('hide');
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
      tab.setAttribute('tabIndex', '0');
      activeTab.setAttribute('aria-selected', false);
      activeTab.setAttribute('tabIndex', '-1');
      sections.forEach((section) => {
        if (tab.getAttribute('aria-controls') === section.id) {
          section.classList.remove('hide');
        } else {
          section.classList.add('hide');
        }
      });
      activeTab = tab;
    });
    listItem.replaceChildren(tab);
    return tab;
  });

  tabList.addEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const currTabIndex = tabs.findIndex((tab) => tab === document.activeElement);
    if (currTabIndex === -1) return;
    e.preventDefault();
    const nextTabIndex = currTabIndex + (e.key === 'ArrowLeft' ? -1 : 1);
    tabs[nextTabIndex].focus();
  });
}
