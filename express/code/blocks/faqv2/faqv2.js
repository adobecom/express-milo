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
      header: cells[0]?.innerHTML.trim(),
      subHeader: cells[1]?.innerHTML,
    };
  });

  collapsibleRows.forEach(({ header, subHeader }, index) => {
    const rowWrapper = createTag('div', { class: 'faqv2-wrapper' });
    container.appendChild(rowWrapper);

    if (isLongFormVariant) {
      // Simple toggle for longform
      const toggle = createTag('div', { class: 'faqv2-toggle' });
      rowWrapper.appendChild(toggle);

      const headerDiv = createTag('h3', { class: 'faqv2-header' });
      headerDiv.innerHTML = header;
      toggle.appendChild(headerDiv);

      const iconElement = createTag('img', {
        src: `${config.codeRoot}/icons/plus-heavy.svg`,
        alt: 'toggle-icon',
        class: 'toggle-icon',
      });
      headerDiv.appendChild(iconElement);

      const content = createTag('div', { class: 'faqv2-content' });
      content.innerHTML = subHeader;
      toggle.appendChild(content);

      // Set initial state
      content.style.maxHeight = '0';
      content.style.overflow = 'hidden';

      headerDiv.addEventListener('click', () => {
        const isOpen = content.classList.contains('open');

        // Close all other accordions first
        const allContents = block.querySelectorAll('.faqv2-content');
        const allIcons = block.querySelectorAll('.toggle-icon');
        allContents.forEach((otherContent, idx) => {
          if (otherContent !== content && otherContent.classList.contains('open')) {
            otherContent.style.maxHeight = `${otherContent.scrollHeight}px`;
            otherContent.offsetHeight; // Force reflow
            otherContent.classList.remove('open');
            otherContent.style.maxHeight = '0';
            allIcons[idx].src = `${config.codeRoot}/icons/plus-heavy.svg`;
          }
        });

        if (!isOpen) {
          // Set height to 0 first
          content.style.maxHeight = '0';
          // Force a reflow
          content.offsetHeight;
          // Add open class and set to actual height
          content.classList.add('open');
          content.style.maxHeight = `${content.scrollHeight}px`;
          iconElement.src = `${config.codeRoot}/icons/minus-heavy.svg`;
        } else {
          // Set to actual height first
          content.style.maxHeight = `${content.scrollHeight}px`;
          // Force a reflow
          content.offsetHeight;
          // Remove open class and set to 0
          content.classList.remove('open');
          content.style.maxHeight = '0';
          iconElement.src = `${config.codeRoot}/icons/plus-heavy.svg`;
        }
      });
    } else {
      // Non-longform version using the same structure
      const toggle = createTag('div', { class: 'faqv2-toggle' });
      rowWrapper.appendChild(toggle);

      const headerDiv = createTag('h3', { class: 'faqv2-header' });
      headerDiv.innerHTML = header;
      toggle.appendChild(headerDiv);

      const iconElement = createTag('img', {
        src: `${config.codeRoot}/icons/plus-heavy.svg`,
        alt: 'toggle-icon',
        class: 'toggle-icon',
      });
      headerDiv.appendChild(iconElement);

      const content = createTag('div', { class: 'faqv2-content' });
      content.innerHTML = subHeader;
      toggle.appendChild(content);

      // Set initial state
      content.style.maxHeight = '0';
      content.style.overflow = 'hidden';

      headerDiv.addEventListener('click', () => {
        const isOpen = content.classList.contains('open');

        // Close all other accordions first
        const allContents = block.querySelectorAll('.faqv2-content');
        const allIcons = block.querySelectorAll('.toggle-icon');
        allContents.forEach((otherContent, idx) => {
          if (otherContent !== content && otherContent.classList.contains('open')) {
            otherContent.style.maxHeight = `${otherContent.scrollHeight}px`;
            otherContent.offsetHeight; // Force reflow
            otherContent.classList.remove('open');
            otherContent.style.maxHeight = '0';
            allIcons[idx].src = `${config.codeRoot}/icons/plus-heavy.svg`;
          }
        });

        if (!isOpen) {
          // Set height to 0 first
          content.style.maxHeight = '0';
          // Force a reflow
          content.offsetHeight;
          // Add open class and set to actual height
          content.classList.add('open');
          content.style.maxHeight = `${content.scrollHeight}px`;
          iconElement.src = `${config.codeRoot}/icons/minus-heavy.svg`;
        } else {
          // Set to actual height first
          content.style.maxHeight = `${content.scrollHeight}px`;
          // Force a reflow
          content.offsetHeight;
          // Remove open class and set to 0
          content.classList.remove('open');
          content.style.maxHeight = '0';
          iconElement.src = `${config.codeRoot}/icons/plus-heavy.svg`;
        }
      });
    }
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
      accordion.classList.add('open');
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

  toggleButton.textContent = viewMoreText;
  if (collapsibleRows.length > visibleCount) {
    block.append(toggleButton);
  }

  toggleButton.addEventListener('click', () => {
    const hiddenItems = block.querySelectorAll('.faqv2-accordion');
    hiddenItems.forEach((item, index) => {
      if (index >= visibleCount) {
        item.classList.toggle('open');
      }
    });

    isExpanded = !isExpanded;
    toggleButton.setAttribute('aria-expanded', isExpanded);
    toggleButton.textContent = isExpanded ? viewLessText : viewMoreText;
  });

  toggleButton.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleButton.click();
    }
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
