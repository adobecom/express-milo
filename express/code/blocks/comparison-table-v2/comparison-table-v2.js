import { decorateButtonsDeprecated, getLibs } from '../../scripts/utils.js';

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



function createPlanSelector(headers, planIndex, planCellWrapper) {
    const selectWrapper = document.createElement('div');
    selectWrapper.classList.add('plan-selector-wrapper');

    const planSelector = document.createElement('div');
    planSelector.classList.add('plan-selector');
    planSelector.setAttribute('aria-label', `Change comparison plan ${planIndex + 1}`);
    planSelector.setAttribute('tabindex', '-1');
    planSelector.setAttribute('role', 'button');
    planSelector.setAttribute('aria-haspopup', 'listbox');
    planSelector.setAttribute('aria-expanded', 'false');
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
        option.classList.add('plan-selector-choice');
        option.value = i;
        option.textContent = headers[i];
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
                // Make options not focusable when closed
                choices.querySelectorAll('.plan-selector-choice').forEach(opt => {
                    opt.setAttribute('tabindex', '-1');
                    opt.classList.remove('focused');
                });
            });
            headerGroupElement.querySelectorAll('.plan-selector').forEach(selector => {
                selector.setAttribute('aria-expanded', 'false');
            });
            // Update plan cell wrapper aria-expanded
            headerGroupElement.querySelectorAll('.plan-cell-wrapper').forEach(wrapper => {
                wrapper.setAttribute('aria-expanded', 'false');
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
    const planSelectors = Array.from(stickyHeaderElement.querySelectorAll('.plan-selector'))
    const comparisonTableState = new ComparisonTableState()
    comparisonTableState.initializePlanSelectors(comparisonBlock, planSelectors)
    initStickyBehavior(stickyHeaderElement, comparisonBlock);
}


export class ComparisonTableState {
    constructor() {

        this.visiblePlans = [0, 1];
        this.selectedPlans = new Map();
        this.planSelectors = []
    }

    initializePlanSelectors(comparisonBlock, planSelectors) {
        this.comparisonBlock = comparisonBlock
        this.planSelectors = planSelectors
        this.planSelectors.forEach((selector, index) => {
            const choiceWrapper = selector.querySelector('.plan-selector-choices')

            const options = Array.from(choiceWrapper.children)
            options.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Update aria-selected
                    choiceWrapper.querySelectorAll('[role="option"]').forEach(opt => {
                        opt.setAttribute('aria-selected', 'false');
                    });
                    option.setAttribute('aria-selected', 'true');
                    
                    this.updateVisiblePlan(parseInt(selector.dataset.planIndex), parseInt(option.dataset.planIndex))
                    
                    // Close dropdown and update aria-expanded
                    this.closeDropdown(selector);
                    selector.focus();
                })
            })

            selector.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openDropdown(selector)
            });

            // Add keyboard navigation support
            selector.addEventListener('keydown', (e) => {
                const choices = selector.querySelector('.plan-selector-choices');
                const isOpen = !choices.classList.contains('invisible-content');
                
                if (isOpen) {
                    const visibleOptions = Array.from(choices.querySelectorAll('.plan-selector-choice:not(.invisible-content)'));
                    const currentIndex = visibleOptions.findIndex(opt => opt.classList.contains('focused'));
                    
                    switch(e.key) {
                        case 'ArrowDown':
                            e.preventDefault();
                            const nextIndex = currentIndex < visibleOptions.length - 1 ? currentIndex + 1 : 0;
                            visibleOptions.forEach(opt => opt.classList.remove('focused'));
                            visibleOptions[nextIndex].classList.add('focused');
                            visibleOptions[nextIndex].focus();
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            const prevIndex = currentIndex > 0 ? currentIndex - 1 : visibleOptions.length - 1;
                            visibleOptions.forEach(opt => opt.classList.remove('focused'));
                            visibleOptions[prevIndex].classList.add('focused');
                            visibleOptions[prevIndex].focus();
                            break;
                        case 'Tab':
                            // Focus trap - cycle through visible options
                            e.preventDefault();
                            if (e.shiftKey) {
                                // Shift+Tab - go backwards
                                const prevIndex = currentIndex > 0 ? currentIndex - 1 : visibleOptions.length - 1;
                                visibleOptions.forEach(opt => opt.classList.remove('focused'));
                                visibleOptions[prevIndex].classList.add('focused');
                                visibleOptions[prevIndex].focus();
                            } else {
                                // Tab - go forwards
                                const nextIndex = currentIndex < visibleOptions.length - 1 ? currentIndex + 1 : 0;
                                visibleOptions.forEach(opt => opt.classList.remove('focused'));
                                visibleOptions[nextIndex].classList.add('focused');
                                visibleOptions[nextIndex].focus();
                            }
                            break;
                        case 'Escape':
                            e.preventDefault();
                            this.closeDropdown(selector);
                            selector.focus();
                            break;
                    }
                }
            });

            // Add keyboard support for option selection
            options.forEach(option => {
                option.addEventListener('keydown', (e) => {
                    const choices = selector.querySelector('.plan-selector-choices');
                    const isOpen = !choices.classList.contains('invisible-content');
                    
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        option.click();
                        selector.focus();
                    } else if (e.key === 'Tab' && isOpen) {
                        // Focus trap - prevent tabbing out of dropdown
                        e.preventDefault();
                        const visibleOptions = Array.from(choices.querySelectorAll('.plan-selector-choice:not(.invisible-content)'));
                        const currentIndex = visibleOptions.indexOf(option);
                        
                        if (e.shiftKey) {
                            // Shift+Tab - go backwards
                            const prevIndex = currentIndex > 0 ? currentIndex - 1 : visibleOptions.length - 1;
                            visibleOptions.forEach(opt => opt.classList.remove('focused'));
                            visibleOptions[prevIndex].classList.add('focused');
                            visibleOptions[prevIndex].focus();
                        } else {
                            // Tab - go forwards
                            const nextIndex = currentIndex < visibleOptions.length - 1 ? currentIndex + 1 : 0;
                            visibleOptions.forEach(opt => opt.classList.remove('focused'));
                            visibleOptions[nextIndex].classList.add('focused');
                            visibleOptions[nextIndex].focus();
                        }
                    }
                });
            });
            if (!this.visiblePlans.includes(index)) {
                selector.closest('.plan-cell').classList.toggle('invisible-content', 1);
                selector.setAttribute('tabindex', '-1'); // Remove from tab order when invisible
            } else {
                selector.closest('.plan-cell').classList.toggle('invisible-content', 0);
                selector.setAttribute('tabindex', '-1'); // Add to tab order when visible
            }

            this.comparisonBlock.querySelectorAll('tr').forEach((row, rowIndex) => {
                const cells = row.querySelectorAll('.feature-cell:not(.feature-cell-header)')
                for (let i = 0; i < cells.length; i++) {
                    cells[i].classList.toggle('invisible-content', !this.visiblePlans.includes(i))
                }
            })
        })
        this.updatePlanSelectorOptions()
    }

    updateTableCells(selectorIndex, newPlanIndex) {
        const tableRows = this.comparisonBlock.querySelectorAll('tr')
        tableRows.forEach((row) => {
            const cells = Array.from(row.querySelectorAll('.feature-cell:not(.feature-cell-header)'))
            if (cells.length === 0) {
                return
            }
            const oldCell = cells.filter(cell => cell.dataset.planIndex === selectorIndex.toString())[0]
            const newCell = cells.filter(cell => cell.dataset.planIndex === newPlanIndex.toString())[0]
            oldCell.classList.toggle('invisible-content', true)
            newCell.classList.toggle('invisible-content', false)
            const parent = oldCell.parentElement
            parent.insertBefore(newCell, oldCell)
            parent.appendChild(oldCell)

        })
    }

    openDropdown(selector) {
        const dropdown = selector.querySelector('.plan-selector-choices')
        const wasOpen = !dropdown.classList.contains('invisible-content');
        
        // Close other dropdowns
        this.planSelectors.forEach(s => {
            if (s !== selector) {
                const otherDropdown = s.querySelector('.plan-selector-choices');
                otherDropdown.classList.add('invisible-content');
                s.setAttribute('aria-expanded', 'false');
                // Make options not focusable when closed
                otherDropdown.querySelectorAll('.plan-selector-choice').forEach(opt => {
                    opt.setAttribute('tabindex', '-1');
                });
            }
        });
        
        dropdown.classList.toggle('invisible-content');
        selector.setAttribute('aria-expanded', !wasOpen);
        
        const planCellWrapper = selector.closest('.plan-cell-wrapper');
        if (planCellWrapper) {
            planCellWrapper.setAttribute('aria-expanded', !wasOpen);
        }
        
        if (!wasOpen) {
            // Make options focusable when opening
            dropdown.querySelectorAll('.plan-selector-choice').forEach(opt => {
                opt.setAttribute('tabindex', '0');
            });
            
            // Focus first visible option when opening
            const firstOption = dropdown.querySelector('.plan-selector-choice:not(.invisible-content)');
            if (firstOption) {
                firstOption.classList.add('focused');
                firstOption.focus();
            }
        } else {
            // Make options not focusable when closing
            dropdown.querySelectorAll('.plan-selector-choice').forEach(opt => {
                opt.setAttribute('tabindex', '-1');
            });
        }
    }

    closeDropdown(selector) {
        const dropdown = selector.querySelector('.plan-selector-choices');
        dropdown.classList.add('invisible-content');
        selector.setAttribute('aria-expanded', 'false');
        
        const planCellWrapper = selector.closest('.plan-cell-wrapper');
        if (planCellWrapper) {
            planCellWrapper.setAttribute('aria-expanded', 'false');
        }
        
        // Make options not focusable when closed
        dropdown.querySelectorAll('.plan-selector-choice').forEach(opt => {
            opt.setAttribute('tabindex', '-1');
            opt.classList.remove('focused');
        });
    }

    updateVisiblePlan(selectorIndex, newPlanIndex) {
        const visiblePlanIndex = this.visiblePlans.indexOf(selectorIndex)

        const oldHeader = this.planSelectors[selectorIndex].closest('.plan-cell')
        const newHeader = this.planSelectors[newPlanIndex].closest('.plan-cell')

        oldHeader.classList.toggle('invisible-content')
        newHeader.classList.toggle('invisible-content')
        
        // Update tabindex for plan selectors
        this.planSelectors[selectorIndex].setAttribute('tabindex', '-1');
        this.planSelectors[newPlanIndex].setAttribute('tabindex', '0');

        const parent = oldHeader.parentElement
        parent.insertBefore(newHeader, oldHeader)
        parent.appendChild(oldHeader)

        this.visiblePlans[visiblePlanIndex] = newPlanIndex;
        this.updatePlanSelectorOptions()
        this.updateTableCells(selectorIndex, newPlanIndex)
    }

    updatePlanSelectorOptions() {
        for (let i = 0; i < this.planSelectors.length; i++) {
            const currentPlanSelectorChildren = this.planSelectors[i].querySelector('.plan-selector-choices').children;
            for (let j = 0; j < currentPlanSelectorChildren.length; j++) {
                const child = currentPlanSelectorChildren[j];
                const otherPlanIndex = this.visiblePlans.filter(plan => plan !== i)
                if (j === otherPlanIndex[0]) {
                    child.classList.add('invisible-content');
                } else {
                    child.classList.remove('invisible-content');
                }
            }
        }
    }
}