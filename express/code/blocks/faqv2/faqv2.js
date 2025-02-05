import { createTag, getLibs } from '../../scripts/utils.js';

let replaceKey;
let getConfig;
function buildTableLayout(block) {
  const config = getConfig();
  const isLongFormVariant = block.classList.contains('longform');
  const rows = [...block.children];

  const parentContainer = createTag('div');

  const headerText = rows.shift()?.innerText.trim();
  if (headerText) {
    const rowAccordionHeader = createTag('h2', { class: 'faqv2-accordion title' });
    rowAccordionHeader.textContent = headerText;

    if (isLongFormVariant) {
      const container = createTag('div', { class: 'faqv2-longform-header-container' });
      container.appendChild(rowAccordionHeader);
      parentContainer.appendChild(container);
    } else {
      parentContainer.appendChild(rowAccordionHeader);
    }
  }

  const container = createTag('div', { class: 'faqv2-accordions-col' });
  parentContainer.appendChild(container);

  const collapsibleRows = rows.map((row) => {
    const cells = [...row.children];
    return {
      header: cells[0]?.textContent.trim(),
      subHeader: cells[1]?.textContent,
    };
  });

  collapsibleRows.forEach(({ header, subHeader }) => {
    const rowWrapper = createTag('div', { class: 'faqv2-wrapper' });
    container.appendChild(rowWrapper);

    const headerAccordion = createTag('div', { class: 'faqv2-accordion expandable header-accordion' });
    rowWrapper.appendChild(headerAccordion);

    const headerDiv = createTag('h3', { class: 'faqv2-header expandable' });
    headerDiv.textContent = header;
    headerAccordion.appendChild(headerDiv);

    const iconElement = createTag('img', {
      src: `${config.codeRoot}/icons/plus-heavy.svg`,
      alt: 'toggle-icon',
      class: 'toggle-icon',
    });
    headerDiv.appendChild(iconElement);

    const subHeaderAccordion = createTag('div', { class: 'faqv2-accordion expandable sub-header-accordion' });
    rowWrapper.appendChild(subHeaderAccordion);
    const subHeaderDiv = createTag('div', { class: 'faqv2-sub-header expandable' });
    subHeaderDiv.textContent = subHeader;
    subHeaderAccordion.appendChild(subHeaderDiv);

    headerDiv.addEventListener('click', () => {
      const isCollapsed = subHeaderAccordion.classList.toggle('collapsed');
      if (!isLongFormVariant) {
        headerAccordion.classList.toggle('rounded-corners', isCollapsed);
      }
      iconElement.src = isCollapsed
        ? `${config.codeRoot}/icons/minus-heavy.svg`
        : `${config.codeRoot}/icons/plus-heavy.svg`;
    });
  });
  block.replaceChildren(...parentContainer.childNodes);
}

async function buildOriginalLayout(block) {
  const viewMoreText = await replaceKey('view-more', getConfig());
  const viewLessText = await replaceKey('view-less', getConfig());
  const collapsibleRows = [];
  const rows = Array.from(block.children);

  rows.forEach((row) => {
    const cells = Array.from(row.children);
    const header = cells[0];
    const subHeader = cells[1];
    collapsibleRows.push({
      header: header.textContent.trim(),
      subHeader: subHeader?.textContent,
    });
  });

  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }

  const visibleCount = 3;
  let isExpanded = false;

  collapsibleRows.forEach((row, index) => {
    const { header, subHeader } = row;

    const accordion = createTag('div', { class: 'faqv2-accordion' });

    if (index >= visibleCount) {
      accordion.classList.add('collapsed');
    }

    block.append(accordion);

    const headerDiv = createTag('h3', { class: 'faqv2-header' });
    accordion.append(headerDiv);
    headerDiv.textContent = header;

    let subHeaderDiv;
    if (subHeader) {
      subHeaderDiv = createTag('div', { class: 'faqv2-sub-header' });
      subHeaderDiv.textContent = subHeader;
      accordion.append(subHeaderDiv);
    }
  });

  const toggleButton = createTag('a', {
    class: 'faqv2-toggle-btn button',
    'aria-expanded': false,
    'aria-label': 'Expand quotes',
    role: 'button',
    tabIndex: 0,
  });
  toggleButton.textContent = 'View more';

  if (collapsibleRows.length > visibleCount) {
    block.append(toggleButton);
  }

  toggleButton.addEventListener('click', () => {
    const hiddenItems = block.querySelectorAll('.faqv2-accordion');
    hiddenItems.forEach((item, index) => {
      if (index >= visibleCount) {
        item.classList.toggle('collapsed');
      }
    });

    isExpanded = !isExpanded;
    toggleButton.setAttribute('aria-expanded', isExpanded);
    toggleButton.textContent = isExpanded ? viewLessText : viewMoreText;
  });
}

export default async function decorate(block) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]).then(([utils, placeholders]) => {
    ({ getConfig } = utils);
    ({ replaceKey } = placeholders);
  });
  const isExpandableVariant = block.classList.contains('expandable');

  if (isExpandableVariant) {
    buildTableLayout(block);
  } else {
    buildOriginalLayout(block);
  }
}
