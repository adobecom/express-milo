



function partitionContentBySeparators(blockChildren) {
    const contentGroups = [];
    let currentSection = [];

    for (const childElement of blockChildren) {
        const isSeparator = childElement.querySelector('hr');
        if (isSeparator) {
            if (currentSection.length > 0) {
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
    button.textContent = 'Toggle';
    return button;
}

function createTableHeader(sectionHeaderRow, columnHeaders) {
    const sectionHeaderContainer = document.createElement('div');
    sectionHeaderContainer.classList.add('first-row');
    
    // Add section title
    sectionHeaderContainer.appendChild(sectionHeaderRow.children[0]);
    
    // Extract colors and clear cells (skip first and last)
    const columnColors = [];
    for (let i = 1; i < sectionHeaderRow.children.length - 1; i++) {
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

function createTableRow(featureRowDiv, columnColors) {
    const tableRow = document.createElement('tr');
    const featureCells = featureRowDiv.children;
    
    Array.from(featureCells).forEach((cellContent, cellIndex) => {
        const tableCell = document.createElement('td');
        tableCell.classList.add('feature-cell');
        
        // Apply color class to non-feature-name cells (skip first cell)
        if (cellIndex > 0 && cellIndex <= columnColors.length) {
            const colorClass = columnColors[cellIndex - 1];
            if (colorClass) {
                tableCell.classList.add(`color-${colorClass}`);
            }
        }
        
        tableCell.innerHTML = cellContent.innerHTML;
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
    const { sectionHeaderContainer, columnColors } = createTableHeader(sectionHeaderDiv, columnHeaders);
    
    // Check if table should be hidden
    const visibilityIndicator = sectionHeaderDiv.children[sectionHeaderDiv.children.length - 1];
    const shouldHideTable = visibilityIndicator && visibilityIndicator.textContent.trim() === 'hidden';
    if (shouldHideTable) {
        comparisonTable.classList.add('hide-table');
    }
    
    // Add toggle button
    const toggleButton = createToggleButton(shouldHideTable);
    toggleButton.onclick = () => comparisonTable.classList.toggle('hide-table');
    
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



function createStickyHeader(headerGroupElement) {
    const columnTitles = [];
    headerGroupElement.classList.add('sticky-header');
    const headerCells = headerGroupElement.querySelectorAll('div');
    
    headerCells.forEach((headerCell, cellIndex) => {
        if (cellIndex === 0) {
            headerCell.classList.add('first-cell');
        } else {
            headerCell.classList.add('plan-cell');
            const planSelectorButton = document.createElement('button');
            planSelectorButton.textContent = '>';
            planSelectorButton.classList.add('choices-button');
            headerCell.appendChild(planSelectorButton);
            columnTitles.push(headerCell.textContent.trim());
        }
        headerGroupElement.appendChild(headerCell);
    });
    
    return { stickyHeaderElement: headerGroupElement, columnTitles };
}

export default async function decorate(comparisonBlock) {
    const blockChildren = Array.from(comparisonBlock.children);

    const contentSections = partitionContentBySeparators(blockChildren);

    comparisonBlock.innerHTML = '';

    const { stickyHeaderElement, columnTitles } = createStickyHeader(contentSections[0][0]);
    comparisonBlock.appendChild(stickyHeaderElement);
    
    for (let sectionIndex = 1; sectionIndex < contentSections.length; sectionIndex++) {
        const sectionTable = convertToTable(contentSections[sectionIndex], columnTitles);
        comparisonBlock.appendChild(sectionTable);
    }

    toggleVisibleContentMobile(comparisonBlock, 1);
}   