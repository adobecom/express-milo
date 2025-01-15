import { createTag } from '../../scripts/utils.js';

function buildTableLayout(block) {
  const isLongFormVariant = block.classList.contains('longform');
  const parentDiv = block.closest('.section');
  parentDiv?.classList.add('faqv2-grey-bg', 'faqv2-section-padding');
  isLongFormVariant && parentDiv?.classList.add('longform');
  const rows = Array.from(block.children);
  block.innerHTML = '';

  const background = rows.shift();
  background.classList.add('faqv2-background');
  parentDiv.prepend(background);

  const headerText = rows.shift()?.innerText.trim();
  if (headerText) {
    const rowAccordionHeader = createTag('h2', { class: 'faqv2-accordion title' });
    rowAccordionHeader.textContent = headerText;

    if (isLongFormVariant) {
      const container = createTag('div', { class: 'faqv2-longform-header-container' });
      container.appendChild(rowAccordionHeader);
      block.prepend(container);
    } else {
      block.prepend(rowAccordionHeader);
    }
  }

  const container = createTag('div', { class: 'faqv2-accordions-col' });
  block.appendChild(container);

  const collapsibleRows = [];
  rows.forEach((row) => {
    const cells = Array.from(row.children);
    const header = cells[0];
    const subHeader = cells[1];
    collapsibleRows.push({
      header: header.textContent.trim(),
      subHeader: subHeader.innerHTML,
    });
  });

  collapsibleRows.forEach((row) => {
    const { header, subHeader } = row;

    const rowWrapper = createTag('div', { class: 'faqv2-wrapper' });
    container.appendChild(rowWrapper);

    const headerAccordion = createTag('div', { class: 'faqv2-accordion expandable header-accordion' });
    rowWrapper.append(headerAccordion);

    const headerDiv = createTag('h3', { class: 'faqv2-header expandable' });
    headerDiv.innerHTML = header;
    headerAccordion.append(headerDiv);

    const iconElement = createTag('img', {
      src: '/express/code/icons/plus-heavy.svg',
      alt: 'toggle-icon',
      class: 'toggle-icon',
    });
    headerDiv.appendChild(iconElement);

    const subHeaderAccordion = createTag('div', { class: 'faqv2-accordion expandable sub-header-accordion' });
    rowWrapper.append(subHeaderAccordion);

    const subHeaderDiv = createTag('div', { class: 'faqv2-sub-header expandable' });
    subHeaderDiv.innerHTML = subHeader;
    subHeaderAccordion.append(subHeaderDiv);

    headerDiv.addEventListener('click', () => {
      !isLongFormVariant && headerAccordion.classList.toggle('rounded-corners');
      const isCollapsed = subHeaderAccordion.classList.toggle('collapsed');

      if (isCollapsed) {
        headerAccordion.style.borderRadius = '8px 8px 0 0';
      } else {
        headerAccordion.style.borderRadius = '8px';
      }

      iconElement.src = isCollapsed
        ? '/express/code/icons/minus-heavy.svg'
        : '/express/code/icons/plus-heavy.svg';
    });
  });
}

function buildOriginalLayout(block) {
  const collapsibleRows = [];
  const rows = Array.from(block.children);

  rows.forEach((row) => {
    const cells = Array.from(row.children);
    const header = cells[0];
    const subHeader = cells[1];
    collapsibleRows.push({
      header: header.textContent.trim(),
      subHeader: subHeader?.innerHTML,
    });
  });

  block.innerHTML = '';

  const visibleCount = 3;
  let isExpanded = false;

  collapsibleRows.forEach((row, index) => {
    const { header, subHeader } = row;

    const accordion = createTag('div', { class: 'faqv2-accordion' });

    if (index >= visibleCount) {
      accordion.classList.add('collapsed');
      accordion.style.display = 'none';
    }

    block.append(accordion);

    const headerDiv = createTag('h3', { class: 'faqv2-header' });
    accordion.append(headerDiv);
    headerDiv.innerHTML = header;

    const subHeaderDiv = createTag('div', { class: 'faqv2-sub-header' });
    subHeaderDiv.innerHTML = subHeader;
    accordion.append(subHeaderDiv);
  });

  const toggleButton = createTag('a', { class: 'faqv2-toggle-btn button' });
  toggleButton.textContent = 'View more';
  collapsibleRows.length > 3 && block.append(toggleButton);

  toggleButton.addEventListener('click', () => {
    const hiddenItems = block.querySelectorAll('.faqv2-accordion');
    hiddenItems.forEach((item, index) => {
      if (index >= visibleCount) {
        if (item.classList.contains('collapsed')) {
          item.classList.remove('collapsed');
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
          item.classList.add('collapsed');
        }
      }
    });
    isExpanded = !isExpanded;
    toggleButton.textContent = isExpanded ? 'View less' : 'View more';
  });
}

export default async function decorate(block) {
  const isExpandableVariant = block.classList.contains('expandable');

  if (isExpandableVariant) {
    buildTableLayout(block);
  } else {
    buildOriginalLayout(block);
  }
}
