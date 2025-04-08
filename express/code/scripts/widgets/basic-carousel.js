import { getLibs } from '../utils.js';
import { debounce } from '../utils/hofs.js';

const smalLViewport = 600;
let createTag; let loadStyle;
let getConfig;

function initializeCarousel(selector, parent) {
  let scrollCount = 1;
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let scrolling = false;
  let isInitialLoad = true;
  let autoPlayInterval = null;
  let isPlaying = false;
  let currentSetIndex = 0;

  const carouselContent = selector
    ? parent.querySelectorAll(selector)
    : parent.querySelectorAll(':scope > *');

  const isGridLayout = parent.closest('.template-x.basic-carousel.grid') !== null;

  // Create platform and other elements
  const platform = createTag('div', { class: 'basic-carousel-platform' });
  let ariaLabel;
  if (parent.closest('.template-x')) {
    ariaLabel = 'Template-X Carousel';
  } else if (parent.closest('.template-list')) {
    ariaLabel = 'Template List Carousel';
  } else {
    ariaLabel = 'Blog Carousel';
  }
  const container = createTag('div', {
    class: 'basic-carousel-container',
    role: 'region',
    'aria-label': ariaLabel,
  });

  // Assign grid areas for grid layout
  if (isGridLayout && window.innerWidth <= smalLViewport) {
    const totalTemplates = carouselContent.length;
    const midPoint = Math.ceil(totalTemplates / 2);
    carouselContent.forEach((template, index) => {
      if (index < midPoint) {
        template.style.gridArea = `1 / ${index + 1}`;
      } else {
        template.style.gridArea = `2 / ${index - midPoint + 1}`;
      }
    });
  }

  carouselContent.forEach((el, index) => {
    el.classList.add('basic-carousel-element');
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'group');
    el.setAttribute('aria-label', `Item ${index + 1} of ${carouselContent.length}`);

    el.addEventListener('focus', () => {
      if (isGridLayout && window.innerWidth <= smalLViewport) {
        return;
      }
      currentSetIndex = Math.floor(index / scrollCount);
      // eslint-disable-next-line no-use-before-define
      updateCarousel();
    });
    el.addEventListener('mouseleave', () => {
      if (window.innerWidth > smalLViewport) {
        const isHover = el.querySelector('.button-container.singleton-hover');
        if (isHover) {
          isHover.classList.remove('singleton-hover');
          isHover.classList.remove('hovering');
        }
      }
    });
  });

  const faderLeft = createTag('div', { class: 'basic-carousel-fader-left arrow-hidden' });
  const faderRight = createTag('div', { class: 'basic-carousel-fader-right arrow-hidden' });

  const arrowLeft = createTag('a', {
    class: 'button basic-carousel-arrow basic-carousel-arrow-left',
    'aria-label': 'Scroll carousel left',
  });
  const arrowRight = createTag('a', {
    class: 'button basic-carousel-arrow basic-carousel-arrow-right',
    'aria-label': 'Scroll carousel right',
  });

  platform.append(...carouselContent);

  // Add trigger elements for intersection observer
  const leftTrigger = createTag('div', { class: 'basic-carousel-left-trigger' });
  const rightTrigger = createTag('div', { class: 'basic-carousel-right-trigger' });
  platform.prepend(leftTrigger);
  platform.append(rightTrigger);

  // Set up intersection observer for arrow visibility
  const onSlideIntersect = (entries) => {
    entries.forEach((entry) => {
      if (entry.target === leftTrigger) {
        faderLeft.classList.toggle('arrow-hidden', entry.isIntersecting);
      }
      if (entry.target === rightTrigger) {
        faderRight.classList.toggle('arrow-hidden', entry.isIntersecting);
      }
    });
  };

  const options = { threshold: 0, root: container };
  const slideObserver = new IntersectionObserver(onSlideIntersect, options);
  slideObserver.observe(leftTrigger);
  slideObserver.observe(rightTrigger);

  if (isGridLayout) {
    platform.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  // Create a wrapper for all controls
  const controlsWrapper = createTag('div', { class: 'basic-carousel-controls-wrapper' });

  container.append(platform, controlsWrapper);

  // Create play/pause control first if the carousel-play-pause class is present
  let playPauseControl;
  let playPauseButton;
  const hasPlayPause = parent.closest('.carousel-play-pause');

  if (hasPlayPause) {
    playPauseControl = createTag('div', { class: 'basic-carousel-play-pause' });
    playPauseButton = createTag('a', {
      class: 'button basic-carousel-control basic-carousel-play-pause-button playing',
      'aria-label': 'Pause carousel',
      'daa-ll': 'Pause carousel',
    });
    playPauseControl.appendChild(playPauseButton);
    // Add pla/pause button first
    controlsWrapper.appendChild(playPauseControl);
  }

  // Then add arrow controls
  controlsWrapper.append(faderLeft, faderRight);
  faderLeft.append(arrowLeft);
  faderRight.append(arrowRight);
  parent.append(container);

  const elements = platform.querySelectorAll('.template.basic-carousel-element');

  // Determine scroll count based on viewport and classes
  const determineScrollCount = () => {
    if (platform.closest('.four')) return 4;
    if (platform.closest('.three')) return 3;
    if (platform.closest('.two')) return 2;
    return 1;
  };
  scrollCount = window.innerWidth <= smalLViewport ? 1 : determineScrollCount();

  // Calculate total number of distinct positions needed
  const totalSets = Math.ceil(elements.length / scrollCount);

  // Define updateCarousel as a function declaration for hoisting
  function updateCarousel(forceUpdate = false) {
    if (!forceUpdate && scrolling) return;
    scrolling = true;

    const elementWidth = elements[0].offsetWidth;
    const platformWidth = platform.offsetWidth;
    const defaultGap = 10;

    // Special handling for grid layout on mobile
    if (isGridLayout && window.innerWidth <= smalLViewport) {
      const twoTemplatesWidth = (elementWidth * 2) + defaultGap;
      const centerOffset = (platformWidth - twoTemplatesWidth) / 2;
      const newScrollPos = isInitialLoad
        ? 0
        : (currentSetIndex * (elementWidth + defaultGap)) - centerOffset;

      platform.scrollTo({
        left: newScrollPos,
        behavior: isInitialLoad ? 'auto' : 'smooth',
      });

      isInitialLoad = false;

      // Update arrow visibility for grid layout
      faderLeft.classList.toggle('arrow-hidden', currentSetIndex === 0);
      const eleLength = Math.floor(elements.length / 2) - 1;
      faderRight.classList.toggle('arrow-hidden', currentSetIndex + 1 === eleLength);
    } else {
      // Standard carousel scrolling
      const newScrollPos = window.innerWidth <= smalLViewport
        ? currentSetIndex * elementWidth - (platformWidth - elementWidth) / 2
        : currentSetIndex * elementWidth;

      platform.scrollTo({
        left: newScrollPos,
        behavior: 'smooth',
      });

      // Update arrow visibility for standard layout
      faderLeft.classList.toggle('arrow-hidden', currentSetIndex === 0);
      faderRight.classList.toggle('arrow-hidden', currentSetIndex + scrollCount >= elements.length);
    }

    setTimeout(() => {
      scrolling = false;
    }, 300);
  }

  // Function to start auto-play
  const startAutoPlay = () => {
    if (!hasPlayPause || autoPlayInterval) return;
    isPlaying = true;
    playPauseButton.classList.add('playing');
    playPauseButton.classList.remove('paused');
    playPauseButton.setAttribute('aria-label', 'Pause carousel');
    playPauseButton.setAttribute('daa-ll', 'Pause carousel');

    const moveNext = () => {
      // Check if right trigger is intersecting (meaning we're at the end)
      const rightTriggerRect = rightTrigger.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const isAtEnd = rightTriggerRect.left <= containerRect.right;

      if (isAtEnd) {
        currentSetIndex = 0;
        updateCarousel(true);
      } else {
        currentSetIndex += 1;
        updateCarousel();
      }
    };

    autoPlayInterval = setInterval(moveNext, 3000);
  };

  // Function to stop auto-play
  const stopAutoPlay = () => {
    if (!hasPlayPause || !autoPlayInterval) return;
    isPlaying = false;
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
    playPauseButton.classList.remove('playing');
    playPauseButton.classList.add('paused');
    playPauseButton.setAttribute('aria-label', 'Play carousel');
    playPauseButton.setAttribute('daa-ll', 'Play carousel');
  };

  if (hasPlayPause) {
    // Toggle play/pause on button click
    playPauseButton.addEventListener('click', () => {
      if (isPlaying) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    });

    // Start auto-play by default
    startAutoPlay();
  }

  // Pause on user interaction with arrows
  const pauseOnUserInteraction = () => {
    if (hasPlayPause && isPlaying) {
      stopAutoPlay();
    }
  };

  // Add event listeners for user interaction
  faderLeft.addEventListener('click', pauseOnUserInteraction);
  faderRight.addEventListener('click', pauseOnUserInteraction);
  platform.addEventListener('touchstart', pauseOnUserInteraction);

  // Update click handlers for grid layout
  faderLeft.addEventListener('click', () => {
    if (scrolling) return;
    if (isGridLayout && window.innerWidth <= smalLViewport) {
      if (platform.scrollLeft <= 0) return;
      currentSetIndex = Math.max(0, currentSetIndex - 1);
    } else {
      if (currentSetIndex === 0) return;
      currentSetIndex -= scrollCount;
      currentSetIndex = Math.max(0, currentSetIndex);
    }
    updateCarousel();
  });

  faderRight.addEventListener('click', () => {
    if (scrolling) return;
    if (isGridLayout && window.innerWidth <= smalLViewport) {
      const maxScroll = platform.scrollWidth - platform.offsetWidth;
      if (platform.scrollLeft >= maxScroll) return;

      const templatesPerRow = Math.floor(elements.length / 2);
      const maxIndex = templatesPerRow + 2;
      currentSetIndex = Math.min(maxIndex, currentSetIndex + 1);
    } else {
      if (currentSetIndex + scrollCount >= elements.length) return;
      currentSetIndex += scrollCount;
    }
    updateCarousel();
  });

  // Don't call preventDefault() here to allow normal scrolling
  platform.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchEndX = touchStartX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  // For vertical scrolling - passive listener (won't call preventDefault)
  platform.addEventListener('touchmove', (e) => {
    touchEndX = e.touches[0].clientX;
    // Just update touch coordinates without preventing default
  }, { passive: true });

  // For horizontal swiping - handle horizontal swipes only
  platform.addEventListener('touchmove', (e) => {
    const touchEndY = e.touches[0].clientY;
    const deltaX = Math.abs(touchEndX - touchStartX);
    const deltaY = Math.abs(touchEndY - touchStartY);
    const isHorizontalMovement = deltaX > deltaY && deltaX > 10;
    const allowVerticalScroll = isGridLayout && window.innerWidth <= smalLViewport;
    if (isHorizontalMovement && !allowVerticalScroll) {
      e.preventDefault();
    }
  }, { passive: false });

  platform.addEventListener('touchend', (e) => {
    if (isGridLayout && window.innerWidth <= smalLViewport) {
      const tappedElement = document.elementFromPoint(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY,
      );
      const isCard = tappedElement?.closest('.template.basic-carousel-element');
      if (isCard) {
        const editButton = isCard.querySelector('.button-container a[title="Edit this template"]');
        if (editButton?.href) {
          window.location.href = editButton.href;
        }
      }
      return;
    }
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        if (currentSetIndex > 0) {
          currentSetIndex -= 1;
          updateCarousel();
        }
      } else if (currentSetIndex + 1 < elements.length) {
        currentSetIndex += 1;
        updateCarousel();
      }
      return;
    }
    const tappedElement = document.elementFromPoint(
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY,
    );
    const isBtn = tappedElement.querySelector('.button-container.singleton-hover');
    const isCard = tappedElement.closest('.template.basic-carousel-element');
    if (tappedElement) {
      const shareIconWrapper = tappedElement.closest('.share-icon-wrapper');
      const linkHref = isCard?.querySelector('a')?.href || isBtn?.querySelector('a')?.href;
      if (linkHref && shareIconWrapper) {
        e.stopPropagation();
        navigator.clipboard.writeText(linkHref).then(() => {
          const tooltip = shareIconWrapper.querySelector('.shared-tooltip');
          if (tooltip) {
            tooltip.classList.add('display-tooltip');
            setTimeout(() => tooltip.classList.remove('display-tooltip'), 2000);
          }
        }).catch((err) => {
          window.lana?.log('Failed to copy link:', err);
        });
        return;
      }
      if (isCard && linkHref) {
        const isHoverActive = isCard?.querySelector('.button-container.singleton-hover');
        if (isHoverActive && linkHref) {
          window.location.href = linkHref;
        }
        const tappedIndex = Array.from(elements).indexOf(isCard);
        if (tappedIndex !== -1) {
          const currentPosition = currentSetIndex * scrollCount;
          if (tappedIndex < currentPosition) {
            currentSetIndex = Math.max(0, Math.floor(tappedIndex / scrollCount));
            updateCarousel();
          } else if (tappedIndex > currentPosition) {
            currentSetIndex = Math.min(totalSets - 1, Math.floor(tappedIndex / scrollCount));
            updateCarousel();
          } else {
            const btnContainer = isCard.querySelector('.button-container');
            if (btnContainer) {
              btnContainer.dispatchEvent(new Event('carouseltapstart'));
              setTimeout(() => {
                btnContainer.dispatchEvent(new Event('carouseltapend'));
              }, 0);
            }
          }
        }
      } else if (isBtn && linkHref) {
        window.location.href = linkHref;
      }
    }
  });

  // Handle scroll events for grid layout
  platform.addEventListener('scroll', debounce(() => {
    if (!isGridLayout || scrolling) return;

    const elementWidth = elements[0].offsetWidth;
    const scrollPosition = platform.scrollLeft;
    const gap = 10;
    const itemWidth = elementWidth + gap;
    currentSetIndex = Math.round(scrollPosition / itemWidth);

    faderLeft.classList.toggle('arrow-hidden', currentSetIndex === 0);
    const eleLength = Math.floor(elements.length / 2) - 2;
    faderRight.classList.toggle('arrow-hidden', currentSetIndex === eleLength);
  }, 100));

  window.addEventListener('resize', debounce(() => {
    const newScrollCount = window.innerWidth <= smalLViewport ? 1 : determineScrollCount();
    if (window.innerWidth > platform.offsetWidth) {
      faderLeft.style.display = 'none';
      faderRight.style.display = 'none';
    } else {
      faderLeft.style.display = 'unset';
      faderRight.style.display = 'unset';
    }
    if (newScrollCount !== scrollCount) {
      scrollCount = newScrollCount;
      updateCarousel();
    }
  }));

  updateCarousel();
}

export async function onBasicCarouselCSSLoad(selector, parent) {
  const config = getConfig();
  const stylesheetHref = `${config.codeRoot}/scripts/widgets/basic-carousel.css`;

  await new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = stylesheetHref;
    link.onload = resolve;
    link.onerror = () => reject(new Error(`Failed to load ${stylesheetHref}`));
    document.head.appendChild(link);
  });

  initializeCarousel(selector, parent);
}

export default async function buildBasicCarousel(selector, parent, options = {}) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`)]).then(([utils]) => {
    ({ createTag, getConfig, loadStyle } = utils);
  });
  const config = getConfig();
  return new Promise((resolve) => {
    loadStyle(`${config.codeRoot}/scripts/widgets/basic-carousel.css`, () => {
      onBasicCarouselCSSLoad(selector, parent, options);
      resolve();
    });
  });
}
