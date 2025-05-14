import { getLibs, getIconElementDeprecated, convertToInlineSVG } from '../../scripts/utils.js';

let createTag;

const iconRegex = /icon-\s*([^\s]+)/;

function findSection(el) {
  return (!el || el.classList.contains('section')) ? el : findSection(el.parentElement);
}

export default async function init(el) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const section = findSection(el);
  if (!section) return;
  section.classList.add('get-started-section');

  const [headlineContainer, tabListContainer] = el.querySelectorAll(':scope > div');
  headlineContainer.classList.add('get-started-headline-container');
  tabListContainer.classList.add('tablist-container');

  const tabList = tabListContainer.querySelector('ol');
  tabList.setAttribute('role', 'tablist');
  const listItems = [...tabList.querySelectorAll('li')];

  const panels = [];
  const nodes = section.children;
  [...nodes].forEach((node) => {
    if (/^\$\d+\$$/.exec(node.textContent.trim())) {
      node.remove();
      const panel = createTag('div', { role: 'tabpanel', id: `panel-${listItems[panels.length].textContent}` });
      panels.push(panel);
      section.append(panel);
    } else if (panels.length > 0) {
      panels[panels.length - 1].append(node);
    }
  });
  panels.forEach((panel, i) => {
    i > 0 && panel.classList.add('hide');
  });

  // TODO: add aria-controls to the button
  let activeTab = null;
  const tabs = listItems.map((listItem, index) => {
    const tab = createTag('button', {
      role: 'tab',
      'aria-selected': index === 0,
      'aria-controls': panels[index]?.id,
    });
    const icon = listItem.querySelector('.icon');
    const match = icon && iconRegex.exec(icon.className);
    if (match?.[1]) {
      convertToInlineSVG(getIconElementDeprecated(match[1])).then((svg) => icon.append(svg));
    }
    tab.append(icon, listItem.textContent);
    activeTab ||= tab;
    tab.addEventListener('click', () => {
      if (tab === activeTab) return;
      tab.setAttribute('aria-selected', true);
      activeTab.setAttribute('aria-selected', false);
      panels.forEach((panel) => {
        panel === panels[index] ? panel.classList.remove('hide') : panel.classList.add('hide');
      });
      activeTab = tab;
    });
    return tab;
  });
  listItems.forEach((listItem, i) => listItem.replaceWith(tabs[i]));
}
