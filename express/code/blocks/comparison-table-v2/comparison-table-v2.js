import { decorateButtonsDeprecated, getLibs } from '../../scripts/utils.js';
import { ComparisonTableState, initComparisonTableState } from './comparison-table-state.js';

let createTag;

function handleCellIcons(cell) {
    let multiParagraph = false;
    let marker = cell
    if (cell.querySelector('p')) {
        multiParagraph = true;
        marker = cell.querySelector('p');
    }

    const text = marker.textContent.trim()[0];
    if (text === '+') {
        if (multiParagraph) {
            marker.remove();
        } else {
            cell.textContent = '';
        }
        const wrapper = createTag('div', { class: 'icon-wrapper' });
        const icon = createTag('span', { class: 'icon-checkmark-no-fill',role: 'img', alt: 'Yes' });
        icon.setAttribute('aria-label', 'Yes');
        wrapper.prepend(icon);
    
        cell.prepend(wrapper);
    } else if (text === '-') {
        if (multiParagraph) {
            marker.remove();
        } else {
            cell.textContent = '';
        }
        const wrapper = createTag('div', { class: 'icon-wrapper' });
        const icon = createTag('span', { class: 'icon-crossmark', role: 'img', alt: 'No' });
        icon.setAttribute('aria-label', 'No');
        wrapper.prepend(icon);
        cell.prepend(wrapper);
    }
}

function partitionContentBySeparators(blockChildren) {
    const contentGroups = [];
    let currentSection = [];

    for (const childElement of blockChildren) {
        const isSeparator = childElement.querySelector('hr')
        const isOpenSeparator = childElement.textContent.trim() === '+++';
        if (isSeparator || isOpenSeparator) {
            if (currentSection.length > 0) {
                if (isOpenSeparator) {
                    currentSection[0].classList.add('open-separator');
                }
                contentGroups.push(currentSection);
                currentSection = [];
            }
        } else {
            currentSection.push(childElement);
        }
    }
    if (currentSection.length > 0) {
        contentGroups.push(currentSection);
    }
    return contentGroups;
}

function createToggleButton(isHidden) {
    const button = document.createElement('button');
    button.classList.add('toggle-button');
    button.setAttribute('aria-label', isHidden ? 'Expand section' : 'Collapse section');
    button.setAttribute('aria-expanded', !isHidden);

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('icon', 'expand-button');
    if (isHidden) {
        iconSpan.classList.add('open');
    }
    button.appendChild(iconSpan);
    return button;
}

function createTableHeader(sectionHeaderRow, columnHeaders) {
    const sectionHeaderContainer = document.createElement('div');
    sectionHeaderContainer.classList.add('first-row');
    // Add section title
    sectionHeaderContainer.appendChild(sectionHeaderRow.children[0]);
    console.log(sectionHeaderRow)
    // Extract colors and clear cells (skip first and last)
    const columnColors = [];
    for (let i = 0; i < sectionHeaderRow.children.length; i++) {
        const colorCell = sectionHeaderRow.children[i];
        const colorValue = colorCell.textContent.trim();
        columnColors.push(colorValue);
        colorCell.textContent = '';
    }

    return { sectionHeaderContainer, columnColors };
}

function createAccessibilityHeaders(sectionTitle, columnTitles) {
    const screenReaderHeaders = document.createElement('thead');
    const headerRow = document.createElement('tr');
    screenReaderHeaders.classList.add('invisible-headers');

    // Add section title header
    const sectionHeader = document.createElement('th');
    sectionHeader.textContent = sectionTitle;
    headerRow.appendChild(sectionHeader);

    // Add column headers
    columnTitles.forEach(columnTitle => {
        const columnHeader = document.createElement('th');
        columnHeader.setAttribute('scope', 'col');
        columnHeader.textContent = columnTitle;
        headerRow.appendChild(columnHeader);
    });

    screenReaderHeaders.appendChild(headerRow);
    return screenReaderHeaders;
}

function createTableRow(featureRowDiv) {
    const tableRow = document.createElement('tr');
    const featureCells = featureRowDiv.children;
    Array.from(featureCells).forEach((cellContent, cellIndex) => {
        const tableCell = document.createElement('td');
        if (cellIndex === 0) {
            tableCell.classList.add('feature-cell-header')
        }
        tableCell.setAttribute('data-plan-index', cellIndex - 1)
        tableCell.classList.add('feature-cell');
        for (let i = 0; i < cellContent.classList.length; i++) {
            tableCell.classList.add(cellContent.classList[i]);
        }

        tableCell.innerHTML = cellContent.innerHTML;
        handleCellIcons(tableCell);
        tableRow.appendChild(tableCell);
    });
    return tableRow;
}

function convertToTable(sectionGroup, columnHeaders) {
    const tableContainer = document.createElement('div');
    tableContainer.classList.add('table-container');
    const comparisonTable = document.createElement('table');
    const tableBody = document.createElement('tbody');


    if (sectionGroup.length === 0) return tableContainer;

    // Process header row
    const sectionHeaderDiv = sectionGroup[0];
    const shouldHideTable = !sectionHeaderDiv.classList.contains('open-separator')
    if (shouldHideTable) {
        comparisonTable.classList.add('hide-table');
    }

    const { sectionHeaderContainer, columnColors } = createTableHeader(sectionHeaderDiv, columnHeaders);

    // Check if table should be hidden
    const visibilityIndicator = sectionHeaderDiv.children[sectionHeaderDiv.children.length - 1];

  
    // Add toggle button
    const toggleButton = createToggleButton(shouldHideTable);
    toggleButton.onclick = () => {
        const isExpanded = !comparisonTable.classList.contains('hide-table');
        comparisonTable.classList.toggle('hide-table');
        toggleButton.querySelector('span').classList.toggle('open');
        toggleButton.setAttribute('aria-expanded', !isExpanded);
        toggleButton.setAttribute('aria-label', isExpanded ? 'Expand section' : 'Collapse section');
    };

    // const toggleButtonContainer = document.createElement('div');
    // toggleButtonContainer.classList.add('button-cell');
    // toggleButtonContainer.appendChild(toggleButton);
    // sectionHeaderContainer.appendChild(toggleButtonContainer);
    const header = sectionHeaderContainer.querySelector('h2,h3,h4,h5,h6')
    if (header) {
        toggleButton.prepend(header)
    }
    console.log(toggleButton)
    console.log(sectionHeaderContainer)
    sectionHeaderContainer.appendChild(toggleButton);
    tableContainer.prepend(sectionHeaderContainer)
    console.log(sectionHeaderContainer)
    // Add accessibility headers
    const sectionTitle = sectionHeaderDiv.children[0].textContent.trim();
    const screenReaderHeaders = createAccessibilityHeaders(sectionTitle, columnHeaders);
    comparisonTable.appendChild(screenReaderHeaders);

    // Process data rows
    for (let featureIndex = 1; featureIndex < sectionGroup.length; featureIndex++) {
        const featureRow = createTableRow(sectionGroup[featureIndex], columnColors);
        tableBody.appendChild(featureRow);
    }

    comparisonTable.appendChild(tableBody);
    tableContainer.appendChild(comparisonTable);
    return tableContainer;
}



function createPlanSelector(headers, planIndex, planCellWrapper) {
    const selectWrapper = document.createElement('div');
    selectWrapper.classList.add('plan-selector-wrapper');

    const planSelector = document.createElement('div');
    planSelector.classList.add('plan-selector');
    planSelector.setAttribute('data-plan-index', planIndex);

    // Add keyboard support for opening dropdown
    selectWrapper.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            planSelector.click();
        }
    });

    selectWrapper.appendChild(planSelector);
    planSelector.appendChild(createPlanDropdownChoices(headers))

       // Add click handler to plan cell wrapper
       planCellWrapper.addEventListener('click', (e) => {
        // Don't trigger if clicking on action button or dropdown
        if (!e.target.closest('.action-area') && !e.target.closest('.plan-selector-wrapper')) {
            planSelector.click();
        }
    });
    
    // Add keyboard support
    planCellWrapper.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target === planCellWrapper && !e.target.closest('.action-area')) {
            e.preventDefault();
            planSelector.click();
        }
    });
    planCellWrapper.appendChild(selectWrapper);
}

function createPlanDropdownChoices(headers) {
    const planSelectorChoices = document.createElement('div');
    planSelectorChoices.classList.add('plan-selector-choices', 'invisible-content');
    planSelectorChoices.setAttribute('role', 'listbox');
    planSelectorChoices.setAttribute('aria-label', 'Plan options');


    for (let i = 0; i < headers.length; i++) {
        const option = document.createElement('div');
        const a = document.createElement('div');
        a.classList.add('plan-selector-choice-text');
        a.textContent = headers[i];
        option.appendChild(a);
        option.classList.add('plan-selector-choice');
        option.value = i;
       
        option.setAttribute('data-plan-index', i)
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', 'false');
        option.setAttribute('tabindex', '-1');
        planSelectorChoices.appendChild(option);
    }
    return planSelectorChoices;
}

function applyColumnShading(headerGroup, comparisonBlock) {
    const columnShadingConfig = Array.from(headerGroup[0].querySelectorAll('div')).map((d) => d.textContent.trim());
    const rows = comparisonBlock.querySelectorAll('div');

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('div');
        cells.forEach((cell, cellIndex) => {
            if (columnShadingConfig[cellIndex] && columnShadingConfig[cellIndex] !== '') {
                cell.classList.add(columnShadingConfig[cellIndex]);
            }
        });
    });
}

function createStickyHeader(headerGroup, comparisonBlock) {

    const headerGroupElement = headerGroup[1];
    headerGroupElement.classList.add('sticky-header');
    const headerCells = headerGroupElement.querySelectorAll('div');

    const headers = Array.from(headerCells).map(cell => cell.textContent.trim())
    headers.splice(0, 1)


    headerCells.forEach((headerCell, cellIndex) => {
        if (cellIndex === 0) {
            headerCell.classList.add('first-cell');
        } else {
            const planCellWrapper = createTag('div', { class: 'plan-cell-wrapper' });
            planCellWrapper.setAttribute('tabindex', '0');
            planCellWrapper.setAttribute('role', 'button');
            planCellWrapper.setAttribute('aria-label', `Select plan ${cellIndex}`);
            planCellWrapper.setAttribute('aria-expanded', 'false');
            planCellWrapper.setAttribute('aria-haspopup', 'listbox');
            
            headerCell.classList.add('plan-cell');
            if (cellIndex === headerCells.length - 1) {
                headerCell.classList.add('last');
            }
            const lenght = headerCell.children.length;
            for (let i = 0; i < lenght; i++) {
                planCellWrapper.appendChild(headerCell.children[0]);
            }
           
            createPlanSelector(headers, cellIndex - 1, planCellWrapper);

            headerCell.appendChild(planCellWrapper);
            const button = planCellWrapper.querySelector('.action-area');
            if (button) {
                headerCell.appendChild(button);
            }
            
         
        }
        headerGroupElement.appendChild(headerCell);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.plan-cell-wrapper')) {
            headerGroupElement.querySelectorAll('.plan-selector-choices').forEach(choices => {
                choices.classList.add('invisible-content');
                choices.querySelectorAll('.plan-selector-choice').forEach(opt => {
                    opt.setAttribute('tabindex', '-1');
                    opt.classList.remove('focused');
                });
            });
        }
    });

    return { stickyHeaderElement: headerGroupElement, columnTitles: headers };
}

function initStickyBehavior(stickyHeader, comparisonBlock) {
    // Create placeholder element to maintain layout when header becomes fixed
    const placeholder = document.createElement('div');
    placeholder.classList.add('sticky-header-placeholder');
    comparisonBlock.insertBefore(placeholder, stickyHeader.nextSibling);

    // Intersection Observer to detect when header should stick
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    // Header is scrolled out of view - make it sticky
                    stickyHeader.classList.add('is-stuck');
                    placeholder.style.display = 'flex';
                    placeholder.style.height = `${stickyHeader.offsetHeight}px`;
                } else {
                    // Header is in view - remove sticky
                    stickyHeader.classList.remove('is-stuck');
                    placeholder.style.display = 'none';
                }
            });
        },
        {
            // Trigger when header is about to leave viewport
            rootMargin: '-1px 0px 0px 0px',
            threshold: [0, 1]
        }
    );

    // Create sentinel element to track scroll position
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    sentinel.style.pointerEvents = 'none';
    comparisonBlock.style.position = 'relative';
    comparisonBlock.insertBefore(sentinel, comparisonBlock.firstChild);

    observer.observe(sentinel);
}

export default async function decorate(comparisonBlock) {
    await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`), decorateButtonsDeprecated(comparisonBlock), initComparisonTableState()]).then(([utils, placeholders, buttons]) => { createTag = utils.createTag });
    const blockChildren = Array.from(comparisonBlock.children);
    const contentSections = partitionContentBySeparators(blockChildren);
    applyColumnShading(contentSections[0], comparisonBlock);
    comparisonBlock.innerHTML = '';
    
    // Create aria-live region for plan change announcements
    const ariaLiveRegion = createTag('div', {
        class: 'sr-only',
        'aria-live': 'polite',
        'aria-atomic': 'true'
    });
    ariaLiveRegion.style.position = 'absolute';
    ariaLiveRegion.style.left = '-10000px';
    ariaLiveRegion.style.width = '1px';
    ariaLiveRegion.style.height = '1px';
    ariaLiveRegion.style.overflow = 'hidden';
    comparisonBlock.appendChild(ariaLiveRegion);
    
    const { stickyHeaderElement, columnTitles } = createStickyHeader(contentSections[0], comparisonBlock);
    comparisonBlock.appendChild(stickyHeaderElement);
    for (let sectionIndex = 1; sectionIndex < contentSections.length; sectionIndex++) {
        const sectionTable = convertToTable(contentSections[sectionIndex], columnTitles);
        comparisonBlock.appendChild(sectionTable);
    }
    const planSelectors = Array.from(stickyHeaderElement.querySelectorAll('.plan-selector'))
    const comparisonTableState = new ComparisonTableState(ariaLiveRegion)
    comparisonTableState.initializePlanSelectors(comparisonBlock, planSelectors)
    initStickyBehavior(stickyHeaderElement, comparisonBlock);
}