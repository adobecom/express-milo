import { decorateButtonsDeprecated, getLibs } from '../../scripts/utils.js';
import { ComparisonTableState, initComparisonTableState } from './comparison-table-state.js';
import handleTooltip, { adjustElementPosition , getTooltipMatch} from '../../scripts/widgets/tooltip.js';
let createTag;

const TOOLTIP_PATTERN =/\[\[([^]+)\]\]([^]+)\[\[\/([^]+)\]\]/g

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

    let isSeparator = false;
    let isOpenSeparator = false;
    let noAccordion = false;

    let nextSectionClasses = []
    for (const childElement of blockChildren) {
        isSeparator = childElement.querySelector('hr')
        isOpenSeparator = childElement.textContent.trim() === '+++';
        noAccordion = childElement.textContent.trim() === '===';
      
        if (isSeparator || isOpenSeparator || noAccordion) {
            if (currentSection.length > 0) {
                currentSection[0].classList.add(...nextSectionClasses)
                nextSectionClasses = []
                if (isOpenSeparator) {
                    nextSectionClasses.push('open-separator');
                }
                if (noAccordion) {
                    nextSectionClasses.push('no-accordion');
                }
                contentGroups.push(currentSection);
                currentSection = [];
            }
        } else {
            currentSection.push(childElement);
        }
    }
    if (currentSection.length > 0) {
        currentSection[0].classList.add(...nextSectionClasses)
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

        const { tooltipMatch, tooltipContainer} = getTooltipMatch(tableCell, TOOLTIP_PATTERN)
        handleTooltip(tableCell, TOOLTIP_PATTERN, tooltipMatch, tooltipContainer)

  
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
    const shouldHideTable = !sectionHeaderDiv.classList.contains('open-separator') &&!sectionHeaderDiv.classList.contains('no-accordion')
    if (shouldHideTable) {
        comparisonTable.classList.add('hide-table');
    }
    if (sectionHeaderDiv.classList.contains('no-accordion')) {
        tableContainer.classList.add('no-accordion');
    }

    const { sectionHeaderContainer, columnColors } = createTableHeader(sectionHeaderDiv, columnHeaders);
 

    // Add toggle button
    const toggleButton = createToggleButton(shouldHideTable);
    toggleButton.onclick = () => {
        const isExpanded = !comparisonTable.classList.contains('hide-table');
        comparisonTable.classList.toggle('hide-table');
        toggleButton.querySelector('span').classList.toggle('open');
        toggleButton.setAttribute('aria-expanded', !isExpanded);
        toggleButton.setAttribute('aria-label', isExpanded ? 'Expand section' : 'Collapse section');
    };
 
    const header = sectionHeaderContainer.querySelector('h2,h3,h4,h5,h6')
    if (header) {
        toggleButton.prepend(header)
    }
    sectionHeaderContainer.appendChild(toggleButton);
    tableContainer.prepend(sectionHeaderContainer)
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
        if (e.target === planCellWrapper && !e.target.closest('.action-area')) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                planSelector.click();
                
                // If ArrowDown, focus the first option after dropdown opens
                if (e.key === 'ArrowDown') {
                    setTimeout(() => {
                        const dropdown = planSelector.querySelector('.plan-selector-choices');
                        const firstOption = dropdown.querySelector('.plan-selector-choice:not(.invisible-content)');
                        if (firstOption) {
                            firstOption.classList.add('focused');
                            firstOption.focus();
                        }
                    }, 0);
                }
            }
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
    let columnShadingConfig = Array.from(headerGroup[0].querySelectorAll('div')).map((d) => d.textContent.trim());
    columnShadingConfig = columnShadingConfig.map((entry) => entry.split(','));
    console.log(columnShadingConfig)
    const rows = comparisonBlock.querySelectorAll('div');

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('div');
        cells.forEach((cell, cellIndex) => {
            if (columnShadingConfig[cellIndex]) {
                columnShadingConfig[cellIndex].forEach((entry) => {
                    if (entry !== '') {
                        cell.classList.add(entry.trim().toLowerCase());
                    }
                });
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
            
            // Add two-columns class if there are only 2 columns
            if (headers.length === 2) {
                planCellWrapper.classList.add('two-columns');
            }
            
            // Only set tabindex and interactive attributes on mobile when there are more than 2 columns
            const isDesktop = window.matchMedia('(min-width: 1280px)').matches;
            const hasMoreThanTwoColumns = headers.length > 2;
            if (!isDesktop && hasMoreThanTwoColumns) {
                planCellWrapper.setAttribute('tabindex', '0');
                planCellWrapper.setAttribute('role', 'button');
                planCellWrapper.setAttribute('aria-label', `Select plan ${cellIndex}`);
                planCellWrapper.setAttribute('aria-expanded', 'false');
                planCellWrapper.setAttribute('aria-haspopup', 'listbox');
            }
            
            headerCell.classList.add('plan-cell');
            if (cellIndex === headerCells.length - 1) {
                headerCell.classList.add('last');
            }
            const lenght = headerCell.children.length;
            for (let i = 0; i < lenght; i++) {
                planCellWrapper.appendChild(headerCell.children[0]);
            }
           
            // Only create plan selector if there are more than 2 columns
            if (headers.length > 2) {
                createPlanSelector(headers, cellIndex - 1, planCellWrapper);
            }

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
                // Check if parent section is hidde
                if (comparisonBlock.parentElement.classList.contains('display-none')) {
                    stickyHeader.classList.remove('is-stuck');
                    placeholder.style.display = 'none';
                    return;
                }
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
    
    // Watch for changes to parent section's display property
    const parentSection = comparisonBlock.closest('section');
    if (parentSection) {
        const mutationObserver = new MutationObserver(() => {
            const isHidden = parentSection.style.display === 'none';
            if (isHidden) {
                stickyHeader.classList.remove('is-stuck');
                placeholder.style.display = 'none';
            }
        });
        
        mutationObserver.observe(parentSection, {
            attributes: true,
            attributeFilter: ['style']
        });
    }
}

function synchronizePlanCellHeights(comparisonBlock) {
    const planCellWrappers = comparisonBlock.querySelectorAll('.plan-cell-wrapper');
    
    if (planCellWrappers.length === 0) return;
    
    // Reset heights to auto to get natural heights
    planCellWrappers.forEach(wrapper => {
        wrapper.style.height = 'auto';
    });
    
    // Find the maximum height
    let maxHeight = 0;
    planCellWrappers.forEach(wrapper => {
        const height = wrapper.offsetHeight;
        if (height > maxHeight) {
            maxHeight = height;
        }
    });
    
    // Apply the maximum height to all wrappers
    planCellWrappers.forEach(wrapper => {
        wrapper.style.height = `${maxHeight}px`;
    });
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
    const buttons = contentSections[0][1].querySelectorAll('.con-button')
    buttons.forEach(button => {
        if (button.textContent.trim().includes("#_button-fill")) {
            button.classList.add('fill')
            button.textContent = button.textContent.replace('#_button-fill', '')
        } 
    })
    
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
    
    // Handle tabindex updates on window resize
    const updateTabindexOnResize = () => {
        const isDesktop = window.matchMedia('(min-width: 1280px)').matches;
        const planCellWrappers = comparisonBlock.querySelectorAll('.plan-cell-wrapper');
        const hasMoreThanTwoColumns = columnTitles.length > 2;
        
        planCellWrappers.forEach((wrapper, index) => {
            if (isDesktop || !hasMoreThanTwoColumns) {
                wrapper.removeAttribute('tabindex');
                wrapper.removeAttribute('role');
                wrapper.removeAttribute('aria-label');
                wrapper.removeAttribute('aria-expanded');
                wrapper.removeAttribute('aria-haspopup');
            } else {
                wrapper.setAttribute('tabindex', '0');
                wrapper.setAttribute('role', 'button');
                wrapper.setAttribute('aria-label', `Select plan ${index + 1}`);
                wrapper.setAttribute('aria-expanded', 'false');
                wrapper.setAttribute('aria-haspopup', 'listbox');
            }
        });
    };
    
    // Synchronize plan cell heights
    synchronizePlanCellHeights(comparisonBlock);
    
    // Handle updates on window resize
    const handleResize = () => {
        updateTabindexOnResize();
        synchronizePlanCellHeights(comparisonBlock);
    };
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Add ResizeObserver to handle dynamic content changes
    const resizeObserver = new ResizeObserver(() => {
        synchronizePlanCellHeights(comparisonBlock);
    });
    
   // Observe all plan cell wrappers for size changes
    const planCellWrappers = comparisonBlock.querySelectorAll('.plan-cell-wrapper');
    planCellWrappers.forEach(wrapper => {
        resizeObserver.observe(wrapper);
    });
}