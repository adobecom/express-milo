import { getLibs } from '../../scripts/utils.js';

let createTag;

export async function initComparisonTableState() {
    const utils = await import(`${getLibs()}/utils/utils.js`);
    createTag = utils.createTag;
    return createTag;
}

export class ComparisonTableState {
    constructor(ariaLiveRegion) {

        this.visiblePlans = [0, 1];
        this.selectedPlans = new Map();
        this.planSelectors = []
        this.ariaLiveRegion = ariaLiveRegion;
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
                    if (e.target.classList.contains('selected')) {
                        return;
                    }
                    const currentPlanIndex = parseInt(option.dataset.planIndex);
                    const selectorIndex = parseInt(selector.dataset.planIndex);
                    
                    // Don't allow selecting the same plan that's currently visible
                    if (this.visiblePlans.includes(currentPlanIndex)) {
                        return; // Exit early, don't process the click
                    }
                    
                    // Update aria-selected
                    choiceWrapper.querySelectorAll('[role="option"]').forEach(opt => {
                        opt.setAttribute('aria-selected', 'false');
                    });
                    option.setAttribute('aria-selected', 'true');
                    
                    this.updateVisiblePlan(selectorIndex, currentPlanIndex)
                    
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
                                // Shift+Tab - go backwards (higher index -> lower index)
                                const nextIndex = currentIndex < visibleOptions.length - 1 ? currentIndex + 1 : 0;
                                visibleOptions.forEach(opt => opt.classList.remove('focused'));
                                visibleOptions[nextIndex].classList.add('focused');
                                visibleOptions[nextIndex].focus();
                            } else {
                                // Tab - go forwards (lower index -> higher index)
                                const prevIndex = currentIndex > 0 ? currentIndex - 1 : visibleOptions.length - 1;
                                visibleOptions.forEach(opt => opt.classList.remove('focused'));
                                visibleOptions[prevIndex].classList.add('focused');
                                visibleOptions[prevIndex].focus();
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
                        const currentPlanIndex = parseInt(option.dataset.planIndex);
                        
                        // Don't allow selecting the same plan that's currently visible
                        if (!this.visiblePlans.includes(currentPlanIndex)) {
                            option.click();
                        }
                        selector.focus();
                    } else if (e.key === 'Tab' && isOpen) {
                        // Focus trap - prevent tabbing out of dropdown
                        e.preventDefault();
                        const visibleOptions = Array.from(choices.querySelectorAll('.plan-selector-choice:not(.invisible-content)'));
                        const currentIndex = visibleOptions.indexOf(option);
                        
                        if (e.shiftKey) {
                            // Shift+Tab - go backwards (higher index -> lower index)
                            const nextIndex = currentIndex < visibleOptions.length - 1 ? currentIndex + 1 : 0;
                            visibleOptions.forEach(opt => opt.classList.remove('focused'));
                            visibleOptions[nextIndex].classList.add('focused');
                            visibleOptions[nextIndex].focus();
                        } else {
                            // Tab - go forwards (lower index -> higher index)
                            const prevIndex = currentIndex > 0 ? currentIndex - 1 : visibleOptions.length - 1;
                            visibleOptions.forEach(opt => opt.classList.remove('focused'));
                            visibleOptions[prevIndex].classList.add('focused');
                            visibleOptions[prevIndex].focus();
                        }
                    }
                });
            });
            if (!this.visiblePlans.includes(index)) {
                selector.closest('.plan-cell').classList.toggle('invisible-content', 1); 
            } else {
                const planCell = selector.closest('.plan-cell');
                planCell.classList.toggle('invisible-content', 0);
                const visibleIndex = this.visiblePlans.indexOf(index);
                if (visibleIndex === 0) {
                    planCell.classList.add('left-plan');
                    planCell.classList.remove('right-plan');
                } else {
                    planCell.classList.add('right-plan');
                    planCell.classList.remove('left-plan');
                }
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
            const firstOption = dropdown.querySelector('.plan-selector-choice:not(.invisible-content)');
            // if (firstOption) {
            //     firstOption.classList.add('focused');
            //     firstOption.focus();
            // }
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

        // Get plan names for announcement
        const oldPlanName = oldHeader.querySelector('.plan-cell-wrapper').textContent.trim();
        const newPlanName = newHeader.querySelector('.plan-cell-wrapper').textContent.trim();

        oldHeader.classList.toggle('invisible-content')
        newHeader.classList.toggle('invisible-content')
         
        // Update positioning classes
        if (visiblePlanIndex === 0) {
            // First visible position (left)
            oldHeader.classList.remove('left-plan');
            newHeader.classList.add('left-plan');
            newHeader.classList.remove('right-plan');
        } else {
            // Second visible position (right)
            oldHeader.classList.remove('right-plan');
            newHeader.classList.add('right-plan');
            newHeader.classList.remove('left-plan');
        }

        const parent = oldHeader.parentElement
        parent.insertBefore(newHeader, oldHeader)
        parent.appendChild(oldHeader)

        this.visiblePlans[visiblePlanIndex] = newPlanIndex;
        this.updatePlanSelectorOptions()
        this.updateTableCells(selectorIndex, newPlanIndex)
        
        // Announce the plan change to screen readers
        if (this.ariaLiveRegion) {
            const position = visiblePlanIndex === 0 ? 'left' : 'right';
            const announcement = `Changed ${position} plan from ${oldPlanName} to ${newPlanName}`;
            this.ariaLiveRegion.textContent = announcement;
            
            // Clear the announcement after a short delay to prepare for next announcement
            setTimeout(() => {
                this.ariaLiveRegion.textContent = '';
            }, 100);
        }
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
                
                // Update selected state and icon
                const planIndex = parseInt(child.dataset.planIndex);
                if (this.visiblePlans.includes(planIndex)) {
                    child.classList.add('selected');
                    this.addSelectedIcon(child);
                } else {
                    child.classList.remove('selected');
                    this.removeSelectedIcon(child);
                }
            }
        }
    }

    addSelectedIcon(option) {
        // Remove existing icon if present
        const existingIcon = option.querySelector('.plan-selector-choice-text').querySelector('.selected-icon');
        if (existingIcon) {
            existingIcon.remove();
        }
        
        // Add selected icon
        const iconSpan = createTag('span', { class: 'selected-icon icon-selected' });
        option.querySelector('.plan-selector-choice-text').prepend(iconSpan);
    }

    removeSelectedIcon(option) {
        const existingIcon = option.querySelector('.plan-selector-choice-text').querySelector('.selected-icon');
        if (existingIcon) {
            existingIcon.remove();
        }
    }
}