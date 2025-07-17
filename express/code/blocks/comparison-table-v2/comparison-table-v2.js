import { getLibs, getMobileOperatingSystem, fixIcons, getIconDeprecated, addTempWrapperDeprecated, decorateButtonsDeprecated } from '../../scripts/utils.js';

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
        wrapper.prepend(createTag('span', { class: 'icon-checkmark-no-fill' }));
        cell.prepend(wrapper);
    } else if (text === '-') {
        if (multiParagraph) {
            marker.remove();
        } else {
            cell.textContent = '';
        }
        const wrapper = createTag('div', { class: 'icon-wrapper' });
        wrapper.prepend(createTag('span', { class: 'icon-crossmark' }));
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

function toggleVisibleContentMobile(comparisonBlock, visibleColumnIndex) {
    const planCells = comparisonBlock.querySelectorAll('.plan-cell');
    planCells.forEach((planCell, index) => {
        planCell.classList.toggle('invisible-content', index !== visibleColumnIndex && index > 0);
    });
    const tableRows = comparisonBlock.querySelectorAll('.table-container tr');
    tableRows.forEach((tableRow) => {
        const featureCells = tableRow.querySelectorAll('.feature-cell');
        featureCells.forEach((featureCell, index) => {
            featureCell.classList.toggle('invisible-content', index !== visibleColumnIndex + 1 && index > 1);
        });
    });
}

function createToggleButton(isHidden) {
    const button = document.createElement('button');
    button.classList.add('toggle-button');

    const iconSpan = document.createElement('span');
    console.log(isHidden);
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
    sectionHeaderContainer.setAttribute('tabindex', '0');

    // Add section title
    sectionHeaderContainer.appendChild(sectionHeaderRow.children[0]);

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
        comparisonTable.classList.toggle('hide-table');
         toggleButton.querySelector('span').classList.toggle('open')
      
       
    };

    const toggleButtonContainer = document.createElement('div');
    toggleButtonContainer.classList.add('button-cell');
    toggleButtonContainer.appendChild(toggleButton);
    sectionHeaderContainer.appendChild(toggleButtonContainer);

    tableContainer.appendChild(sectionHeaderContainer);

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



function createPlanSelector(totalPlans, comparisonBlock, headers) {
    const selectWrapper = document.createElement('div');
    selectWrapper.classList.add('plan-selector-wrapper');


    const planSelector = document.createElement('div');
    planSelector.classList.add('plan-selector');
    planSelector.setAttribute('aria-label', 'Select comparison plan');
    selectWrapper.appendChild(planSelector);
    return selectWrapper;
}

function createPlanDropdown(totalPlans, comparisonBlock, headers, headerGroupElement) {


    const planSelectorChoices = document.createElement('div');
    planSelectorChoices.classList.add('plan-selector-choices');
    for (let i = 1; i < totalPlans; i++) {
        const option = document.createElement('div');
        option.classList.add('plan-selector-choice');
        option.value = i;
        option.textContent = headers[i]
        option.addEventListener('click', () => {
            planSelectorChoices.querySelectorAll('.plan-selector-choice').forEach(div => {
                div.classList.toggle('selected', i === parseInt(div.value));
            });
            toggleVisibleContentMobile(comparisonBlock, parseInt(option.value));
            planSelectorChoices.classList.add('display-none');
        });
        planSelectorChoices.appendChild(option);
    }

    planSelectorChoices.querySelectorAll('.plan-selector-choice').forEach(div => {
        div.classList.toggle('selected', div.value === 1);
    });

    headerGroupElement.querySelectorAll('.plan-cell-wrapper').forEach(planSelector => { 
        planSelector.addEventListener('click', () => {
            planSelectorChoices.classList.toggle('display-none');
        });
    });

    planSelectorChoices.classList.add('display-none');
    headerGroupElement.appendChild(planSelectorChoices);

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.plan-cell-wrapper')) {
            planSelectorChoices.classList.add('display-none');
        }
    });

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
    const columnTitles = [];
    headerGroupElement.classList.add('sticky-header');
    const headerCells = headerGroupElement.querySelectorAll('div');
    const totalPlans = headerCells.length - 1; // Exclude first cell
    const headers = []

    headerCells.forEach((headerCell, cellIndex) => {
        if (cellIndex === 0) {
            headerCell.classList.add('first-cell');
        } else {
            const planCellWrapper = createTag('button', { class: 'plan-cell-wrapper' });

            planCellWrapper.setAttribute('tabindex', 0)
            headerCell.classList.add('plan-cell');
            if (cellIndex === headerCells.length - 1) {
                headerCell.classList.add('last');
            }
            headers.push(headerCell.querySelector('h1,h2,h3,h4,h5,h6').textContent.trim() + ' ' + headerCell.querySelector('p').textContent.trim());
            columnTitles.push(headerCell.textContent.trim());
            const planSelector = createPlanSelector(totalPlans, comparisonBlock, headers);

            const lenght = headerCell.children.length;
            for (let i = 0; i < lenght; i++) {
                planCellWrapper.appendChild(headerCell.children[0]);
            }
            planCellWrapper.appendChild(planSelector);
         
            headerCell.appendChild(planCellWrapper);
            const button = planCellWrapper.querySelector('.action-area');
            if (button) {
                headerCell.appendChild(button);
            }
        }
        headerGroupElement.appendChild(headerCell);
    });

    createPlanDropdown(totalPlans, comparisonBlock, headers, headerGroupElement);
    return { stickyHeaderElement: headerGroupElement, columnTitles };
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
    await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`), decorateButtonsDeprecated(comparisonBlock)]).then(([utils, placeholders, buttons]) => { createTag = utils.createTag });
    const blockChildren = Array.from(comparisonBlock.children);
    const contentSections = partitionContentBySeparators(blockChildren);
    applyColumnShading(contentSections[0], comparisonBlock);
    comparisonBlock.innerHTML = '';
    const { stickyHeaderElement, columnTitles } = createStickyHeader(contentSections[0], comparisonBlock);
    comparisonBlock.appendChild(stickyHeaderElement);
    for (let sectionIndex = 1; sectionIndex < contentSections.length; sectionIndex++) {
        const sectionTable = convertToTable(contentSections[sectionIndex], columnTitles);
        comparisonBlock.appendChild(sectionTable);
    }

    toggleVisibleContentMobile(comparisonBlock, 1);

    initStickyBehavior(stickyHeaderElement, comparisonBlock);




}   