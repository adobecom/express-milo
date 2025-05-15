import { getLibs, yieldToMain, fixIcons, decorateButtonsDeprecated, addTempWrapperDeprecated } from '../../scripts/utils.js';
import { debounce } from '../../scripts/utils/hofs.js';
import { splitAndAddVariantsWithDash } from '../../scripts/utils/decorate.js';
import { formatDynamicCartLink } from '../../scripts/utils/pricing.js';
import { sendEventToAnalytics } from '../../scripts/instrument.js';

let createTag; let getConfig;
let replaceKey;

const MOBILE_SIZE = 981;
function defineDeviceByScreenSize() {
  const screenWidth = window.innerWidth;
  if (screenWidth >= MOBILE_SIZE) return 'DESKTOP';
  return 'MOBILE';
}

function handleHeading(headingRow, headingCols, rowCount) {
  headingRow.classList.add('row-heading', 'table-start-row');
  if (headingCols.length > 3) headingRow.parentElement.classList.add('many-cols');
  else if (headingCols.length < 3) headingRow.parentElement.classList.add('few-cols');
  const parent = headingRow.parentElement;
  parent.setAttribute('role', 'grid');
  parent.setAttribute('aria-rowcount', rowCount);
  parent.setAttribute('aria-colcount', headingCols.length);
  headingCols.forEach(async (col) => {
    col.classList.add('col-heading');
    const elements = col.children;
    if (!elements?.length) {
      col.innerHTML = `<p class="tracking-header">${col.innerHTML}</p>`;
      return;
    }
    await decorateButtonsDeprecated(col, 'button-l');
    const buttonsWrapper = createTag('div', { class: 'buttons-wrapper' });
    const buttons = col.querySelectorAll('.button, .con-button');

    buttons.forEach((btn) => {
      if (btn.classList.contains('con-button', 'blue')) {
        btn.classList.add('primary', 'button');
        btn.parentNode.remove();
      }
      formatDynamicCartLink(btn);
      const btnWrapper = btn.closest('p');
      btnWrapper.classList.add('button-container');
      buttonsWrapper.append(btnWrapper);
    });
    if (buttons.length > 0) {
      col.append(buttonsWrapper);
    }

    if (buttons.length > 1) {
      buttons.forEach((btn, index) => {
        if (index > 0) btn.remove();
      });
    }

    const div = document.createElement('div');
    const colLabel = document.createElement('div');
    colLabel.classList.add('col-heading');
    [...elements].forEach((e) => {
      if (!e.classList.contains('buttons-wrapper')) colLabel.append(e.cloneNode(true));
      div.append(e);
    });
    col.replaceChildren(div);
    const colIndex = col.getAttribute('data-col-index');
    const colItems = headingRow.parentElement.querySelectorAll(`.section-row > .col[data-col-index="${colIndex}"]`);
    colItems.forEach((colItem) => {
      const colWrapper = document.createElement('div');
      colWrapper.classList.add('col-wrapper');
      const colContent = document.createElement('div');
      colContent.classList.add('col-content');
      Array.from(colItem.children).forEach((colItemEl) => {
        colContent.appendChild(colItemEl);
      });
      colWrapper.append(colLabel.cloneNode(true), colContent);
      colItem.append(colWrapper);
    });
  });
}

const EXCLUDE_ICON = '<span class="feat-icon cross"></span>';
const INCLUDE_ICON = '<span class="feat-icon check"></span>';

const assignEvents = (tableEl) => {
  const buttons = tableEl.querySelectorAll('.toggle-row');
  if (!buttons?.length) return;

  // buttons.forEach((btn) => {
  //   btn.classList.add('point-cursor');
  //   btn.addEventListener('click', () => handleToggleMore(btn));
  //   btn.addEventListener('keydown', (e) => {
  //     if (e.key === 'Enter' || e.key === ' ') {
  //       e.preventDefault();
  //       handleToggleMore(btn);
  //     }
  //   });
  // });

  const linksPopulated = new CustomEvent('linkspopulated', { detail: buttons });
  document.dispatchEvent(linksPopulated);
};

const getId = (function idSetups() {
  const gen = (function* g() {
    let id = 0;
    while (true) {
      yield id;
      id += 1;
    }
  }());
  return () => gen.next().value;
}());

let headerCols;
let globalRows;
let visibleCount;
let isSingleSectionVariant;
let viewAllFeatures;
let sectionRows;

function handleSingleSectionVariant({ row, sectionItem }) {
  const viewAllText = viewAllFeatures ?? 'View all features';
  const isFirstSection = sectionItem === 4;

  const toggleBtn = createTag('button', {
    class: 'toggle-row toggle-content col col-1',
    'aria-expanded': isFirstSection ? 'true' : 'false',
  }, viewAllText);

  const toggleIconTag = createTag('span', {
    class: 'icon expand',
    'aria-expanded': isFirstSection ? 'true' : 'false',
  });

  toggleBtn.prepend(toggleIconTag);

  const colsToToggle = row.querySelectorAll('[data-col-index="2"], [data-col-index="3"]');
  if (!isFirstSection) {
    colsToToggle.forEach((col) => {
      col.classList.add('collapsed');
    });
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'false';
    toggleBtn.setAttribute('aria-expanded', isExpanded.toString());
    colsToToggle.forEach((col) => {
      if (!isExpanded) {
        col.classList.add('collapsed');
      } else {
        col.classList.remove('collapsed');
      }
    });
  });

  row.appendChild(toggleBtn);
}

function toggleContent(element) {
  const pricingTable = element.closest('.pricing-table');
  if (!pricingTable) return;
  const toggleRow = pricingTable.querySelector('.toggle-row');
  if (!toggleRow) return; 
  
  const rows = pricingTable.querySelectorAll('.additional-content');
  const isCurrentlyCollapsed = rows[0]?.classList.contains('collapsed');

  rows.forEach((row) => {
    row.classList.toggle('collapsed', !isCurrentlyCollapsed);
  });
  const icon = pricingTable.querySelector('.icon.expand');
  toggleRow.setAttribute('aria-expanded', isCurrentlyCollapsed);
  toggleRow.classList.toggle('collapsed', !isCurrentlyCollapsed);
  icon?.setAttribute('aria-expanded', isCurrentlyCollapsed ? 'true' : 'false');
}

function createToggleRow(row, sectionLength, index, rows) {
  if (sectionLength <= visibleCount + 1) {
    rows[index -1].classList.add('table-end-row');
    row.classList.add('null-row');
    return;
  }
  const toggleButton = createTag('button', { class: 'toggle-row' });

  const viewAllText = viewAllFeatures ?? 'View all features';
  const toggleOverflowContent = createTag('div', { class: 'toggle-content col', role: 'cell', 'aria-label': viewAllText }, viewAllText);

  toggleOverflowContent.addEventListener('click', () => {
    const buttonEl = toggleOverflowContent.querySelector('span.expand');
    const action = buttonEl && buttonEl.getAttribute('aria-expanded') === 'true' ? 'closed' : 'opened';
    sendEventToAnalytics(`adobe.com:express:cta:pricing:tableToggle:${action || ''}`);
  });

  const toggleIconTag = createTag('span', { class: 'icon expand', 'aria-expanded': false });
  toggleOverflowContent.insertAdjacentElement('afterbegin',toggleIconTag,);
  toggleButton.appendChild(toggleOverflowContent);
  row.appendChild(toggleButton);
  row.classList.add('table-end-row', 'toggle-row');
}

export default async function init(el) {
  await fixIcons(el);
  splitAndAddVariantsWithDash(el);
  isSingleSectionVariant = el.classList.contains('single-section');
  let deviceBySize = defineDeviceByScreenSize();

  
  addTempWrapperDeprecated(el, 'pricing-table');
  await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]).then(([utils, placeholders]) => {
    ({ createTag, getConfig } = utils);
    ({ replaceKey } = placeholders);
  });
  verifyTableIntegrity(el);
  const blockId = getId();
  el.id = `pricing-table-${blockId + 1}`;
  el.setAttribute('role', 'grid');
  visibleCount = parseInt(Array.from(el.classList).find((c) => /^show(\d+)/i.test(c))?.substring(4) ?? '3', 10);

  globalRows = Array.from(el.children);
  viewAllFeatures = await replaceKey('view-all-features', getConfig());
  sectionRows = [];

  const sectionTables = processAllSections(globalRows);

  insertSectionTablesIntoDOM(el, sectionTables);

  setupEventListeners(el, deviceBySize);

  handleResize(el, deviceBySize);
}

function decorateRow({
  row,
  index,
  sectionLength = 0,
  isSingleSectionVariant = false,
}) {
  row.classList.add('row', `row-${index + 1}`);
  row.setAttribute('role', 'row');
  row.setAttribute('aria-rowindex', index + 1);

  const cols = Array.from(row.children);
  if (cols.length <= 1) {
    if (!cols[0]?.innerHTML) {
      cols.shift().remove();
    }
  }
  cols.forEach((col, cdx) => {
    col.dataset.colIndex = cdx + 1;
    col.classList.add('col', `col-${cdx + 1}`);
    col.setAttribute('role', cdx === 0 ? 'rowheader' : 'gridcell');
    col.setAttribute('aria-colindex', cdx + 1);
  });

  if (sectionLength && isSingleSectionVariant) {
    handleSingleSectionVariant({ row, sectionLength });
  }
  if (sectionLength % 2 === 0) row.classList.add('shaded');

  let sectionEnd = false;
  let sectionStart = false;

  if (cols.length === 0) {
    createToggleRow(row, sectionLength, index, globalRows)
    sectionEnd = true;
  } else if (cols.length === 1) {
    row.classList.add('table-start-row');
    row.classList.add('section-header-row');
    cols[0].classList.add('section-head-title');
    cols[0].setAttribute('role', 'rowheader');
    cols[0].setAttribute('aria-colindex', index + 1);
    cols[0].setAttribute('aria-label', 'rowheader');
   // addAccssibleRowHeaders(row, headerCols);
    sectionStart = true;
  } else if (index === 0) {
    row.classList.add('row-heading', 'table-start-row');
  } else {
    row.classList.add('section-row');
    if (sectionLength > visibleCount) {
      row.classList.add('additional-content');
    }
    cols.forEach((col, idx) => {
      decorateButtonsDeprecated(col);
      if (idx === 0) {
        if (!col.children?.length || col.querySelector(':scope > sup')) col.innerHTML = `<p>${col.innerHTML}</p>`;
        return;
      }
      const dim = col.querySelectorAll('em').length > 0;
      if (dim) {
        col.classList.add('dim');
      }
      const child = col.children?.[0] || col;
      if (!child.innerHTML || child.textContent === '-') {
        col.classList.add('excluded-feature');
        child.innerHTML = EXCLUDE_ICON;
        child.classList.add('icon-container');
      } else if (child.textContent === '+') {
        col.classList.add('included-feature');
        child.innerHTML = INCLUDE_ICON;
        child.classList.add('icon-container');
      } else if (!col.children.length) {
        child.innerHTML = `<p>${col.innerHTML}</p>`;
      }
    });
  }

  return { sectionEnd, sectionStart };
}

function verifyTableIntegrity(el) {
  const rows = Array.from(el.closest('.pricing-table').children);
  const lastRow = rows[rows.length - 1];
  if (lastRow.children.length > 0 ) {
      const newRow = createTag('div');
      const newCol = createTag('div');
      newRow.appendChild(newCol);
      el.closest('.pricing-table').appendChild(newRow);
  }
}

function processAllSections(allRows) {
  const sectionTables = [];
  let currentSection = [];
  let inSection = false;

  const headingRow = allRows[0];
  const headingChildren = Array.from(headingRow.children);
  decorateRow({
    row: headingRow,
    index: 0,
  });
  handleHeading(headingRow, headingChildren, allRows.length);

  for (let index = 1; index < allRows.length; index += 1) {
    const row = allRows[index];
    const { sectionEnd, sectionStart } = decorateRow({
      row,
      index,
      sectionLength: currentSection.length,
      isSingleSectionVariant,
    });

    if (sectionStart) {
      if (inSection && currentSection.length > 0) {
        sectionTables.push([...currentSection]);
        currentSection = [];
      }
      inSection = true;
      currentSection.push(row);
    } else if (sectionEnd) {
      currentSection.push(row);
      sectionTables.push([...currentSection]);
      currentSection = [];
      inSection = false;
    } else if (inSection) {
      currentSection.push(row);
    } else if (index > 0) {
      if (currentSection.length === 0) {
        currentSection = [row];
        inSection = true;
      } else {
        currentSection.push(row);
      }
    }
  }

  if (currentSection.length > 0) {
    sectionTables.push(currentSection);
  }

  return sectionTables;
}

function insertSectionTablesIntoDOM(parentEl, sectionTables) {
  const headingRow = parentEl.firstElementChild;
  while (parentEl.children.length > 1) {
    parentEl.removeChild(parentEl.lastElementChild);
  }

  sectionTables.forEach((section, sectionIndex) => {
    if (section.length === 0) return;
    const pricingTableDiv = createTag('div', {
      class: `pricing-table section-${sectionIndex + 1}`,
      role: 'grid',
    });

    if (section.length > 0 && section[0].children.length > 0) {
      pricingTableDiv.setAttribute('aria-rowcount', section.length);
      pricingTableDiv.setAttribute('aria-colcount', section[0].children.length);
    }
    section.forEach(row => {
      pricingTableDiv.appendChild(row);
    });
    parentEl.appendChild(pricingTableDiv);
    if (sectionIndex > 0 ) {
      toggleContent(pricingTableDiv);
    }

    const btn = pricingTableDiv.querySelector('.toggle-row');
    if (btn) {
      btn.classList.add('point-cursor');
      btn.addEventListener('click', () =>toggleContent(btn));
       btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleContent(btn);
      }
    });
    }
  });
}

function setupEventListeners(el, initialDeviceSize) {
  let deviceBySize = initialDeviceSize;

  window.addEventListener('resize', debounce(() => {
    if (deviceBySize === defineDeviceByScreenSize()) return;
    deviceBySize = defineDeviceByScreenSize();
    handleResize(el, deviceBySize);
  }, 100));

  if (el.classList.contains('sticky')) {
    setupStickyHeaderBehavior(el, deviceBySize);
  }
}

function handleResize(el, deviceBySize) {
  const pricingTables = el.querySelectorAll('.pricing-table-section');

  pricingTables.forEach(table => {
    const collapisbleRows = table.querySelectorAll('.section-row, .toggle-row');
    const toggleRows = table.querySelectorAll('.toggle-row');

    if (isSingleSectionVariant) {
      if (deviceBySize === 'DESKTOP') {
        table.classList.remove('single-section');
      } else {
        table.classList.add('single-section');
      }

      collapisbleRows.forEach((collapisbleRow) => {
        collapisbleRow.classList.add('collapsed');
      });
    }

    toggleRows.forEach((toggleRow) => {
      toggleRow.querySelector('.icon.expand').setAttribute('aria-expanded', false);
    });
  });
}

function setupStickyHeaderBehavior(el, deviceBySize) {
  const scrollHandler = () => {
    if (deviceBySize === 'MOBILE') return;

    const headingRow = el.querySelector('.row-heading');
    if (!headingRow || el.closest('div.tabpanel')?.getAttribute('hidden')) {
      return;
    }

    const gnav = document.querySelector('header');
    const gnavHeight = gnav.offsetHeight;
    const { top } = headingRow.getBoundingClientRect();

    if (top <= gnavHeight && !headingRow.classList.contains('stuck')) {
      headingRow.style.top = `${gnavHeight}px`;
    } else if (headingRow.classList.contains('stuck') && top > gnavHeight) {
      headingRow.classList.remove('stuck');
    }

    const nextRow = headingRow.nextElementSibling;
    if (nextRow) {
      const p = nextRow.getBoundingClientRect();
      if (top >= p.top && top > 0) {
        headingRow.classList.add('stuck');
      }
    }
  };

  window.addEventListener('scroll', debounce(scrollHandler, 16), { passive: true });
}
