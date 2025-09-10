/**
 * Carousel Factory - Functional Programming Module
 * Universal carousel creation system with composable architecture
 * Focus: Clean functions, immutable configs, extensible behavior
 *
 * CSS: Pair with carousel-factory.css for complete styling
 */

import { getLibs } from '../utils.js';

// CSS loading - follows existing codebase pattern
let loadStyle;

// Core carousel state (pure functions only)
const CarouselState = {
  create: (config) => ({
    currentIndex: 0,
    templateCount: config.templates.length,
    isMobile: () => window.innerWidth < 768,
    ...config,
  }),

  updateResponsiveState: (state) => ({
    ...state,
    isMobile: () => window.innerWidth < 768,
  }),

  moveNext: (state) => ({
    ...state,
    currentIndex: (state.currentIndex + 1) % state.templateCount,
  }),

  movePrev: (state) => ({
    ...state,
    currentIndex: (state.currentIndex - 1 + state.templateCount) % state.templateCount,
  }),
};

// DOM creation utilities (pure functions)
const CarouselDOM = {
  createStructure: (createTag) => ({
    wrapper: createTag('div', { class: 'promo-carousel-wrapper' }),
    viewport: createTag('div', { class: 'promo-carousel-viewport' }),
    track: createTag('div', {
      class: 'promo-carousel-track',
      id: 'carousel-content',
      tabindex: '0',
      role: 'region',
      'aria-label': 'Template carousel',
    }),
    skipLink: createTag('a', {
      href: '#carousel-content',
      class: 'carousel-skip-link sr-only',
      textContent: 'Skip to carousel content',
    }),
    status: createTag('div', {
      id: 'carousel-status',
      class: 'sr-only',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    }),
  }),

  createNavigation: (createTag) => ({
    container: createTag('div', { class: 'promo-nav-controls' }),
    prevBtn: createTag('button', {
      class: 'promo-nav-btn promo-prev-btn',
      'aria-label': 'Previous templates',
      'aria-describedby': 'carousel-status',
    }),
    nextBtn: createTag('button', {
      class: 'promo-nav-btn promo-next-btn',
      'aria-label': 'Next templates',
      'aria-describedby': 'carousel-status',
    }),
  }),

  createA11yElements: (createTag) => ({
    instructions: createTag('div', {
      id: 'carousel-instructions',
      class: 'sr-only',
      'aria-live': 'polite',
    }),
    status: createTag('div', {
      id: 'carousel-status',
      class: 'sr-only',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    }),
    skipLink: createTag('a', {
      href: '#carousel-end',
      class: 'sr-only carousel-skip-link',
    }),
  }),

  createButtonSVG: (direction) => {
    const isNext = direction === 'next';
    const arrowDirection = isNext ? 'next' : 'previous';
    return `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" 
           aria-hidden="true" focusable="false" role="img">
        <title>${arrowDirection} arrow</title>
        <circle cx="16" cy="16" r="16" fill="#FFFFFF"/>
        <path d="${isNext
    ? 'M14.6016 21.1996L19.4016 16.3996L14.6016 11.5996'
    : 'M17.3984 21.1996L12.5984 16.3996L17.3984 11.5996'}"
              stroke="#292929" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  },
};

// Hover system (pure functions) - commented out since not used
/*
const HoverSystem = {
  create: () => {
    let currentHoveredElement = null;

    return {
      enterHandler: (buttonContainer) => {
        if (currentHoveredElement) {
          currentHoveredElement.classList.remove('singleton-hover');
        }
        currentHoveredElement = buttonContainer;
        if (currentHoveredElement) {
          currentHoveredElement.classList.add('singleton-hover');
        }
        document.activeElement.blur();
      },

      leaveHandler: () => {
        if (currentHoveredElement) {
          currentHoveredElement.classList.remove('singleton-hover');
          currentHoveredElement = null;
        }
      },

      focusHandler: (templateEl) => {
        if (currentHoveredElement) {
          currentHoveredElement.classList.remove('singleton-hover');
        }
        currentHoveredElement = templateEl;
        if (currentHoveredElement) {
          currentHoveredElement.classList.add('singleton-hover');
        }
      },
    };
  },

  attachToTemplate: (templateEl, hoverSystem) => {
    const buttonContainer = templateEl.querySelector('.button-container');
    if (!buttonContainer) return;

    // Mouse events
    templateEl.addEventListener('mouseenter', () => {
      hoverSystem.enterHandler(buttonContainer);
    });

    templateEl.addEventListener('mouseleave', () => {
      hoverSystem.leaveHandler();
    });

    // Touch/mobile events
    const editButton = buttonContainer.querySelector('.button.accent.small');
    const ctaLink = buttonContainer.querySelector('.cta-link');

    const combinedClickHandler = (ev) => {
      // Two-tap behavior for mobile
      if (window.matchMedia('(pointer: coarse)').matches) {
        if (!buttonContainer.classList.contains('singleton-hover')) {
          ev.preventDefault();
          ev.stopPropagation();
          hoverSystem.enterHandler(buttonContainer);
          return false;
        }
      }
      return true;
    };

    if (editButton) {
      editButton.addEventListener('focusin', () => hoverSystem.focusHandler(templateEl));
      editButton.addEventListener('click', combinedClickHandler);
    }
    if (ctaLink) ctaLink.addEventListener('click', combinedClickHandler);
  },
};
*/

// Display logic (pure functions that return instructions)
const DisplayLogic = {
  getVisibleTemplates: (state) => {
    if (state.isMobile()) {
      // Mobile: prev-current-next pattern
      const prevIndex = (state.currentIndex - 1 + state.templateCount) % state.templateCount;
      const nextIndex = (state.currentIndex + 1) % state.templateCount;

      return [
        { index: prevIndex, class: 'prev-template' },
        { index: state.currentIndex, class: 'current-template' },
        { index: nextIndex, class: 'next-template' },
      ];
    }
    // Desktop: all templates visible
    return state.templates.map((_, index) => ({
      index,
      class: '',
    }));
  },

  shouldShowNavigation: (state) => state.isMobile() && state.templateCount > 1,
};

// Core carousel factory function
export const createCarousel = async (config) => {
  // Import loadStyle if not already available
  if (!loadStyle) {
    const { loadStyle: ls } = await import(`${getLibs()}/utils/utils.js`);
    loadStyle = ls;
  }

  // Load CSS using the proper pattern
  if (config.loadCSS !== false) {
    loadStyle('/express/code/scripts/widgets/carousel-factory.css');
  }

  // Validate required dependencies
  const {
    block,
    templates,
    createTag,
    customDOMCallback,
  } = config;

  if (!block || !templates || !createTag) {
    throw new Error('Missing required carousel dependencies');
  }

  // Initialize carousel state
  let state = CarouselState.create({ templates });

  // Create DOM structure
  const dom = CarouselDOM.createStructure(createTag);
  const nav = CarouselDOM.createNavigation(createTag);

  // Setup navigation buttons
  nav.prevBtn.innerHTML = CarouselDOM.createButtonSVG('prev');
  nav.nextBtn.innerHTML = CarouselDOM.createButtonSVG('next');
  nav.container.append(nav.prevBtn, nav.nextBtn);

  // Initialize hover system (commented out since we're not using it)
  // const hoverSystem = HoverSystem.create();

  // Pure function to update display
  const updateDisplay = () => {
    const visibleTemplates = DisplayLogic.getVisibleTemplates(state);
    const currentTemplates = Array.from(dom.track.children);

    // Only update if the visible templates have actually changed
    const needsUpdate = currentTemplates.length !== visibleTemplates.length
      || visibleTemplates.some(({ index, class: className }, i) => {
        const currentTemplate = currentTemplates[i];
        return !currentTemplate
          || currentTemplate.dataset.templateIndex !== index.toString()
          || currentTemplate.className !== `template ${className}`.trim();
      });

    if (!needsUpdate) return;

    // Clear track
    dom.track.innerHTML = '';

    // Add visible templates
    visibleTemplates.forEach(({ index, class: className }) => {
      const template = templates[index];
      // Use original template directly - no cloning needed
      // const templateClone = template.cloneNode(true); // Cloning logic commented out
      const templateClone = template;

      // Add data attribute to track template index
      templateClone.dataset.templateIndex = index.toString();

      if (className) templateClone.classList.add(className);

      // No need to re-attach events since we're not cloning
      // if (attachHoverListeners) {
      //   attachHoverListeners(templateClone);
      // } else {
      //   HoverSystem.attachToTemplate(templateClone, hoverSystem);
      // }

      dom.track.append(templateClone);
    });

    // Update carousel status for screen readers (WCAG Level AA)
    const currentIndex = state.currentIndex + 1;
    const totalTemplates = state.templateCount;
    dom.status.textContent = `Carousel item ${currentIndex} of ${totalTemplates}`;
  };

  // Event handlers (pure functions)
  const handleNext = () => {
    state = CarouselState.moveNext(state);
    updateDisplay();
  };

  const handlePrev = () => {
    state = CarouselState.movePrev(state);
    updateDisplay();
  };

  const handleKeyboard = (event) => {
    // Handle skip link focus
    if (event.target.classList.contains('carousel-skip-link')) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        dom.track.focus();
        return;
      }
    }

    // Only handle keyboard nav when carousel is focused
    if (!dom.wrapper.contains(event.target)) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        handlePrev();
        nav.prevBtn.focus();
        break;
      case 'ArrowRight':
        event.preventDefault();
        handleNext();
        nav.nextBtn.focus();
        break;
      case 'Home':
        event.preventDefault();
        state = { ...state, currentIndex: 0 };
        updateDisplay();
        break;
      case 'End':
        event.preventDefault();
        state = { ...state, currentIndex: state.templateCount - 1 };
        updateDisplay();
        break;
      default:
        // No action needed for other keys
        break;
    }
  };

  const handleResize = () => {
    // Throttled resize handler for better performance
    const now = Date.now();
    const THROTTLE_MS = 100; // Throttle to max once per 100ms

    if (handleResize.lastCall && now - handleResize.lastCall < THROTTLE_MS) {
      return; // Skip if called too recently
    }
    handleResize.lastCall = now;
    // Update the responsive state
    const wasMobile = state.isMobile();
    state = CarouselState.updateResponsiveState(state);
    const isNowMobile = state.isMobile();

    // Update if switching mobile/desktop modes OR if significant width change
    const lastWidth = handleResize.lastWidth || window.innerWidth;
    const widthChange = Math.abs(window.innerWidth - lastWidth);
    const shouldUpdate = wasMobile !== isNowMobile || widthChange > 100;

    if (shouldUpdate) {
      // Clear any existing data-events-attached attributes before updating
      const existingTemplates = dom.track.querySelectorAll('.template');
      existingTemplates.forEach((template) => {
        const shareIcons = template.querySelectorAll('.share-icon-wrapper .icon-share-arrow');
        shareIcons.forEach((icon) => {
          icon.removeAttribute('data-events-attached');
        });
      });
      updateDisplay();
    }

    // Store current width for next comparison
    handleResize.lastWidth = window.innerWidth;
  };

  // Attach event listeners
  nav.nextBtn.addEventListener('click', handleNext);
  nav.prevBtn.addEventListener('click', handlePrev);
  document.addEventListener('keydown', handleKeyboard);
  window.addEventListener('resize', handleResize);

  // Handle orientation changes specifically
  const handleOrientationChange = () => {
    // Force update on orientation change to handle mobile portrait/landscape transitions
    setTimeout(() => {
      state = CarouselState.updateResponsiveState(state);

      // Update on any orientation change to handle mobile portrait/landscape transitions
      const existingTemplates = dom.track.querySelectorAll('.template');
      existingTemplates.forEach((template) => {
        const shareIcons = template.querySelectorAll('.share-icon-wrapper .icon-share-arrow');
        shareIcons.forEach((icon) => {
          icon.removeAttribute('data-events-attached');
        });
      });
      updateDisplay();
    }, 200); // Increased timeout to ensure orientation change is complete
  };

  window.addEventListener('orientationchange', handleOrientationChange);

  // Assemble DOM
  dom.viewport.append(dom.track);
  dom.wrapper.append(dom.skipLink, dom.viewport, dom.status);

  // Add navigation if needed
  if (DisplayLogic.shouldShowNavigation(state)) {
    dom.wrapper.append(nav.container);
  }

  // Apply custom DOM modifications if callback provided
  if (customDOMCallback && typeof customDOMCallback === 'function') {
    customDOMCallback({
      wrapper: dom.wrapper,
      viewport: dom.viewport,
      track: dom.track,
      navigation: nav.container,
      prevButton: nav.prevBtn,
      nextButton: nav.nextBtn,
      block,
      state,
    });
  }

  // Setup block classes
  block.parentElement.classList.add('multiple-up');
  block.classList.add('carousel-factory', 'custom-promo-carousel');
  block.append(dom.wrapper);

  // Initial render
  updateDisplay();

  // Return carousel API (functional interface)
  return {
    // State accessors (read-only)
    getCurrentIndex: () => state.currentIndex,
    getTemplateCount: () => state.templateCount,
    isMobile: () => state.isMobile(),

    // Actions
    next: handleNext,
    prev: handlePrev,
    goTo: (index) => {
      state = { ...state, currentIndex: index };
      updateDisplay();
    },

    // Cleanup
    destroy: () => {
      nav.nextBtn.removeEventListener('click', handleNext);
      nav.prevBtn.removeEventListener('click', handlePrev);
      document.removeEventListener('keydown', handleKeyboard);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      // Clear throttling state
      handleResize.lastCall = 0;
    },
  };
};

// Carousel Factory with presets and main interface
export const CarouselFactory = {
  // Main factory method
  create: createCarousel,

  // Preset configurations
  presets: {
    templatePromo: {
      showNavigation: true,
      responsive: true,
      hoverSystem: true,
      looping: true,
    },

    basic: {
      showNavigation: true,
      responsive: false,
      hoverSystem: false,
      looping: false,
    },
  },
};

// Utility function for easy integration
export const createTemplateCarousel = async (
  block,
  templates,
  createTag,
  attachHoverListeners = null,
  customDOMCallback = null,
  config = {},
) => createCarousel({
  block,
  templates,
  createTag,
  attachHoverListeners,
  customDOMCallback,
  ...CarouselFactory.presets.templatePromo,
  ...config,
});
