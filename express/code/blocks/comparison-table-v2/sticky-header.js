import { getIconElementDeprecated } from '../../scripts/utils.js';
import { ComparisonTableState } from './comparison-table-state.js';

// Import constants from main file
const BREAKPOINTS = {
  DESKTOP: '(min-width: 1024px)',
  TABLET: '(min-width: 768px)',
};

const TIMING = {
  STICKY_TRANSITION: 100,
};

const DROPDOWN = {
  MIN_COLUMNS_FOR_SELECTOR: 2,
};

const OBSERVER_CONFIG = {
  HEADER_ROOT_MARGIN: '-1px 0px 0px 0px',
  BLOCK_ROOT_MARGIN: '0px 0px -1px 0px',
  THRESHOLD: [0, 1],
};

let createTag;

/**
 * Set the createTag function from utils
 * @param {Function} createTagFn - The createTag function from utils
 */
export function setCreateTag(createTagFn) {
  createTag = createTagFn;
}

/**
 * Create plan dropdown choices for the plan selector
 * @param {Array} headers - Array of header names
 * @returns {HTMLElement} - The dropdown choices element
 */
function createPlanDropdownChoices(headers) {
  const planSelectorChoices = document.createElement('div');
  planSelectorChoices.classList.add('plan-selector-choices', 'invisible-content');
  planSelectorChoices.setAttribute('role', 'listbox');
  planSelectorChoices.setAttribute('aria-label', 'Plan options');

  for (let i = 0; i < headers.length; i += 1) {
    const option = document.createElement('div');
    const a = document.createElement('div');
    a.classList.add('plan-selector-choice-text');
    a.textContent = headers[i];
    option.appendChild(a);
    option.classList.add('plan-selector-choice');
    option.value = i;

    option.setAttribute('data-plan-index', i);
    option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', 'false');
    option.setAttribute('tabindex', '-1');
    planSelectorChoices.appendChild(option);
  }
  return planSelectorChoices;
}

/**
 * Create a plan selector dropdown for plan switching
 * @param {Array} headers - Array of header names
 * @param {number} planIndex - Index of the plan
 * @param {HTMLElement} planCellWrapper - The plan cell wrapper element
 */
function createPlanSelector(headers, planIndex, planCellWrapper) {
  const selectWrapper = document.createElement('div');
  selectWrapper.classList.add('plan-selector-wrapper');
  const chevron = getIconElementDeprecated('chevron-down');
  selectWrapper.appendChild(chevron);

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
  planSelector.appendChild(createPlanDropdownChoices(headers));

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
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        planSelector.click();
      } else if (e.key === 'ArrowDown') {
        const dropdown = planSelector.querySelector('.plan-selector-choices');
        const isOpen = !dropdown.classList.contains('invisible-content');

        if (!isOpen) {
          // Only open dropdown if it's not already open
          e.preventDefault();
          planSelector.click();

          // Focus the first option after dropdown opens
          setTimeout(() => {
            const firstOption = dropdown.querySelector('.plan-selector-choice:not(.invisible-content)');
            if (firstOption) {
              firstOption.classList.add('focused');
              firstOption.focus();
            }
          }, 0);
        } else {
          // If dropdown is already open, check if anything is focused
          const focusedOption = dropdown.querySelector('.plan-selector-choice.focused');
          if (!focusedOption) {
            // Nothing is focused, focus the first option
            e.preventDefault();
            const firstOption = dropdown.querySelector('.plan-selector-choice:not(.invisible-content)');
            if (firstOption) {
              firstOption.classList.add('focused');
              firstOption.focus();
            }
          }
          // If something is already focused, let the event bubble to the selector's keydown handler
        }
      }
    }
  });
  planCellWrapper.appendChild(selectWrapper);
}

/**
 * Create the sticky header for the comparison table
 * @param {Array} headerGroup - Array containing header elements
 * @param {HTMLElement} comparisonBlock - The comparison table block element
 * @returns {Object} - Object containing sticky header element and column titles
 */
export function createStickyHeader(headerGroup, comparisonBlock) {
  const headerGroupElement = headerGroup[1];
  headerGroupElement.classList.add('sticky-header');

  // Create wrapper div for all header content
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('sticky-header-wrapper');

  // Move all existing children to the wrapper
  while (headerGroupElement.firstChild) {
    headerWrapper.appendChild(headerGroupElement.firstChild);
  }

  // Add the wrapper back to the header
  headerGroupElement.appendChild(headerWrapper);

  const headerCells = headerWrapper.querySelectorAll('div');
  const headers = Array.from(headerCells).map((cell) => {
    const children = Array.from(cell.children);
    const childContent = children.filter((child) => !child.querySelector('a'));
    const output = childContent.map((content) => content.textContent.trim()).join(', ').replaceAll(',', '');
    return output;
  });
  const totalColumns = headers.length;
  headers.splice(0, 1);
  const noSubheaders = Array.from(headerGroupElement.querySelectorAll('p')).length === 0;

  comparisonBlock.classList.add(`columns-${totalColumns}`);
  headerCells.forEach((headerCell, cellIndex) => {
    if (cellIndex === 0) {
      headerCell.classList.add('first-cell');
    } else {
      const planCellWrapper = createTag('div', { class: 'plan-cell-wrapper' });

      // Add two-columns class if there are only 2 columns
      if (headers.length === DROPDOWN.MIN_COLUMNS_FOR_SELECTOR) {
        planCellWrapper.classList.add('two-columns');
      }

      // Only set tabindex and interactive attributes on mobile when there are more than 2 columns
      const isDesktop = window.matchMedia(BREAKPOINTS.DESKTOP).matches;
      const hasMoreThanTwoColumns = headers.length > DROPDOWN.MIN_COLUMNS_FOR_SELECTOR;
      if (!isDesktop && hasMoreThanTwoColumns) {
        planCellWrapper.setAttribute('tabindex', '0');
        planCellWrapper.setAttribute('role', 'button');
        planCellWrapper.setAttribute('aria-label', `Select plan ${cellIndex}`);
        planCellWrapper.setAttribute('aria-expanded', 'false');
        planCellWrapper.setAttribute('aria-haspopup', 'listbox');
      }

      if (noSubheaders) {
        planCellWrapper.classList.add('no-subheaders');
      }

      headerCell.classList.add('plan-cell');
      if (cellIndex === headerCells.length - 1) {
        headerCell.classList.add('last');
      }
      const lenght = headerCell.children.length;
      for (let i = 0; i < lenght; i += 1) {
        planCellWrapper.appendChild(headerCell.children[0]);
      }

      // Only create plan selector if there are more than 2 columns
      if (headers.length > DROPDOWN.MIN_COLUMNS_FOR_SELECTOR) {
        createPlanSelector(headers, cellIndex - 1, planCellWrapper);
      }

      headerCell.appendChild(planCellWrapper);
      const button = planCellWrapper.querySelector('.action-area');
      if (button) {
        headerCell.appendChild(button);
      }
    }
    headerWrapper.appendChild(headerCell);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.plan-cell-wrapper')) {
      headerWrapper.querySelectorAll('.plan-selector-choices').forEach((choices) => {
        choices.classList.add('invisible-content');
        choices.querySelectorAll('.plan-selector-choice').forEach((opt) => {
          opt.setAttribute('tabindex', '-1');
          opt.classList.remove('focused');
        });
      });
    }
  });

  return { stickyHeaderEl: headerGroupElement, colTitles: headers };
}

/**
 * Initialize sticky behavior for the header element
 * @param {HTMLElement} stickyHeader - The sticky header element
 * @param {HTMLElement} comparisonBlock - The comparison table block element
 */
export function initStickyBehavior(stickyHeader, comparisonBlock) {
  // Create placeholder element to maintain layout when header becomes fixed
  const placeholder = document.createElement('div');
  placeholder.classList.add('sticky-header-placeholder');
  comparisonBlock.insertBefore(placeholder, stickyHeader.nextSibling);

  let isSticky = false;

  // Intersection Observer to detect when header should become sticky (at the top)
  const headerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Check if parent section is hidden
        if (comparisonBlock?.parentElement?.classList?.contains('display-none')) {
          stickyHeader.classList.remove('is-stuck');
          stickyHeader.classList.remove('gnav-offset');
          placeholder.style.display = 'none';
          isSticky = false;
          return;
        }
        const rect = entry.boundingClientRect;
        const isAboveViewport = rect.top < 0;
        if (!entry.isIntersecting && isAboveViewport && !isSticky) {
          // Header has scrolled past the top - make it sticky
          const stickyHeaderHeight = stickyHeader.offsetHeight;
          stickyHeader.classList.add('is-stuck', 'initial');
          placeholder.style.display = 'flex';
          placeholder.style.height = `${stickyHeaderHeight}px`;

          ComparisonTableState.closeDropdown(stickyHeader
            ?.querySelector('.plan-cell-wrapper[aria-expanded="true"]')?.querySelector('.plan-selector'));
          if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
          }
          setTimeout(() => {
            stickyHeader.classList.add('gnav-offset');
            stickyHeader.classList.remove('initial');
            isSticky = true;
          }, TIMING.STICKY_TRANSITION);
        } else if (entry.isIntersecting && isSticky) {
          stickyHeader.classList.add('initial');
          setTimeout(() => {
            stickyHeader.classList.remove('is-stuck');
            stickyHeader.classList.remove('initial');
            placeholder.style.display = 'none';
            stickyHeader.classList.remove('gnav-offset');
            isSticky = false;
          }, TIMING.STICKY_TRANSITION);
        }
      });
    },
    {
      rootMargin: OBSERVER_CONFIG.HEADER_ROOT_MARGIN,
      threshold: OBSERVER_CONFIG.THRESHOLD,
    },
  );

  // Intersection Observer to detect when comparison block exits/enters viewport (at the bottom)
  const blockObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && isSticky) {
          // Comparison block is leaving viewport at the bottom - remove sticky
          stickyHeader.classList.remove('is-stuck');
          placeholder.style.display = 'none';
          stickyHeader.classList.remove('gnav-offset');
          isSticky = false;
        } else if (entry.isIntersecting && !isSticky) {
          // Comparison block is re-entering viewport - check if header sentinel is above viewport
          const headerSentinel = comparisonBlock.firstChild;
          const sentinelRect = headerSentinel.getBoundingClientRect();
          
          // Only reapply sticky if the header sentinel is above the viewport (user scrolled back up)
          if (sentinelRect.top < 0) {
            const stickyHeaderHeight = stickyHeader.offsetHeight;
            stickyHeader.classList.add('is-stuck', 'initial');
            placeholder.style.display = 'flex';
            placeholder.style.height = `${stickyHeaderHeight}px`;

            ComparisonTableState.closeDropdown(stickyHeader
              ?.querySelector('.plan-cell-wrapper[aria-expanded="true"]')?.querySelector('.plan-selector'));
            if (document.activeElement && document.activeElement.blur) {
              document.activeElement.blur();
            }
            setTimeout(() => {
              stickyHeader.classList.add('gnav-offset');
              stickyHeader.classList.remove('initial');
              isSticky = true;
            }, TIMING.STICKY_TRANSITION);
          }
        }
      });
    },
    {
      // Trigger when comparison block is about to leave viewport at the bottom
      rootMargin: OBSERVER_CONFIG.BLOCK_ROOT_MARGIN,
      threshold: OBSERVER_CONFIG.THRESHOLD,
    },
  );

  // Create sentinel element to track header position
  const headerSentinel = document.createElement('div');
  headerSentinel.style.position = 'absolute';
  headerSentinel.style.top = '0px';
  headerSentinel.style.height = '1px';
  headerSentinel.style.width = '100%';
  headerSentinel.style.pointerEvents = 'none';
  comparisonBlock.style.position = 'relative';
  comparisonBlock.insertBefore(headerSentinel, comparisonBlock.firstChild);

  // Observe the header sentinel for sticky behavior
  headerObserver.observe(headerSentinel);

  // Observe the entire comparison block for exit behavior
  blockObserver.observe(comparisonBlock);

  // Watch for changes to parent section's display property
  const parentSection = comparisonBlock.closest('section');
  if (parentSection) {
    const mutationObserver = new MutationObserver(() => {
      const isHidden = parentSection.style.display === 'none';
      if (isHidden) {
        stickyHeader.classList.remove('is-stuck');
        placeholder.style.display = 'none';
        isSticky = false;
      }
    });

    mutationObserver.observe(parentSection, {
      attributes: true,
      attributeFilter: ['style'],
    });
  }
}

/**
 * Synchronize the heights of plan cell wrappers
 * @param {HTMLElement} comparisonBlock - The comparison table block element
 */
export function synchronizePlanCellHeights(comparisonBlock) {
  const planCellWrappers = comparisonBlock.querySelectorAll('.plan-cell-wrapper');

  if (planCellWrappers.length === 0) return;

  // Reset heights to auto to get natural heights
  planCellWrappers.forEach((wrapper) => {
    wrapper.style.height = 'auto';
  });

  if (comparisonBlock.querySelector('.is-stuck')) return;

  // Find the maximum height
  let maxHeight = 0;
  planCellWrappers.forEach((wrapper) => {
    const height = wrapper.offsetHeight;
    if (height > maxHeight) {
      maxHeight = height;
    }
  });

  // Apply the maximum height to all wrappers
  planCellWrappers.forEach((wrapper) => {
    wrapper.style.height = `${maxHeight}px`;
  });
}
