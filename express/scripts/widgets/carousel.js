import { getLibs } from '../utils.js';

let createTag; let loadStyle;

function correctCenterAlignment(plat) {
  if (plat.parentElement.offsetWidth <= plat.offsetWidth) return;
  plat.parentElement.style.maxWidth = `${plat.offsetWidth}px`;
}

function initToggleTriggers(parent) {
  if (!parent) return;

  const isInHiddenSection = () => {
    const parentSection = parent.closest('.section');
    if (!parentSection) return false;

    return parentSection.dataset.toggle && parentSection.style.display === 'none';
  };

  const leftControl = parent.querySelector('.carousel-fader-left');
  const rightControl = parent.querySelector('.carousel-fader-right');
  const leftTrigger = parent.querySelector('.carousel-left-trigger');
  const rightTrigger = parent.querySelector('.carousel-right-trigger');
  const platform = parent.querySelector('.carousel-platform');

  // If flex container has a gap, add negative margins to compensate
  const gap = window.getComputedStyle(platform, null).getPropertyValue('gap');
  if (gap !== 'normal') {
    const gapInt = parseInt(gap.replace('px', ''), 10);
    leftTrigger.style.marginRight = `-${gapInt + 1}px`;
    rightTrigger.style.marginLeft = `-${gapInt + 1}px`;
  }

  // intersection observer to toggle right arrow and gradient
  const onSlideIntersect = (entries) => {
    if (isInHiddenSection()) return;

    entries.forEach((entry) => {
      if (entry.target === leftTrigger) {
        if (entry.isIntersecting) {
          leftControl.classList.add('arrow-hidden');
          platform.classList.remove('left-fader');
        } else {
          leftControl.classList.remove('arrow-hidden');
          platform.classList.add('left-fader');
        }
      }

      if (entry.target === rightTrigger) {
        if (entry.isIntersecting) {
          rightControl.classList.add('arrow-hidden');
          platform.classList.remove('right-fader');
        } else {
          rightControl.classList.remove('arrow-hidden');
          platform.classList.add('right-fader');
        }
      }
    });
  };

  const options = { threshold: 0, root: parent };
  const slideObserver = new IntersectionObserver(onSlideIntersect, options);
  slideObserver.observe(leftTrigger);
  slideObserver.observe(rightTrigger);
  // todo: should unobserve triggers where/when appropriate...
}

function onCarouselCSSLoad(selector, parent, options) {
  const carouselContent = selector ? parent.querySelectorAll(selector) : parent.querySelectorAll(':scope > *');

  carouselContent.forEach((el) => el.classList.add('carousel-element'));

  const container = createTag('div', { class: 'carousel-container' });
  const platform = createTag('div', { class: 'carousel-platform' });

  const faderLeft = createTag('div', { class: 'carousel-fader-left arrow-hidden' });
  const faderRight = createTag('div', { class: 'carousel-fader-right arrow-hidden' });

  const arrowLeft = createTag('a', { class: 'button carousel-arrow carousel-arrow-left' });
  const arrowRight = createTag('a', { class: 'button carousel-arrow carousel-arrow-right' });
  arrowLeft.title = 'Carousel Left';
  arrowRight.title = 'Carousel Right';

  platform.append(...carouselContent);

  if (!options.infinityScrollEnabled) {
    const leftTrigger = createTag('div', { class: 'carousel-left-trigger' });
    const rightTrigger = createTag('div', { class: 'carousel-right-trigger' });

    platform.prepend(leftTrigger);
    platform.append(rightTrigger);
  }

  container.append(platform, faderLeft, faderRight);
  faderLeft.append(arrowLeft);
  faderRight.append(arrowRight);
  parent.append(container);

  // Scroll the carousel by clicking on the controls
  const moveCarousel = (increment) => {
    platform.scrollLeft -= increment;
  };

  faderLeft.addEventListener('click', () => {
    const increment = Math.max((platform.offsetWidth / 4) * 3, 300);
    moveCarousel(increment);
  });
  faderRight.addEventListener('click', () => {
    const increment = Math.max((platform.offsetWidth / 4) * 3, 300);
    moveCarousel(-increment);
  });

  // Carousel loop functionality (if enabled)
  const stopScrolling = () => { // To prevent safari shakiness
    platform.style.overflowX = 'hidden';
    setTimeout(() => {
      platform.style.removeProperty('overflow-x');
    }, 20);
  };

  const moveToCenterIfNearTheEdge = (e = null) => {
    // Start at the center and snap back to center if the user scrolls to the edges
    const scrollPos = platform.scrollLeft;
    const maxScroll = platform.scrollWidth;
    if ((scrollPos > (maxScroll / 5) * 4) || scrollPos < 30) {
      if (e) e.preventDefault();
      stopScrolling();
      platform.scrollTo({
        left: ((maxScroll / 5) * 2),
        behavior: 'instant',
      });
    }
  };

  const infinityScroll = (children) => {
    const duplicateContent = () => {
      [...children].forEach((child) => {
        const duplicate = child.cloneNode(true);
        const duplicateLinks = duplicate.querySelectorAll('a');
        platform.append(duplicate);
        if (duplicate.tagName.toLowerCase() === 'a') {
          const linksPopulated = new CustomEvent('linkspopulated', { detail: [duplicate] });
          document.dispatchEvent(linksPopulated);
        }
        if (duplicateLinks) {
          const linksPopulated = new CustomEvent('linkspopulated', { detail: duplicateLinks });
          document.dispatchEvent(linksPopulated);
        }
      });
    };

    // Duplicate children to simulate smooth scrolling
    for (let i = 0; i < 4; i += 1) {
      duplicateContent();
    }

    platform.addEventListener('scroll', (e) => {
      moveToCenterIfNearTheEdge(e);
    }, { passive: false });
  };

  // set initial states
  const setInitialState = (scrollable, opts) => {
    if (opts.infinityScrollEnabled) {
      infinityScroll([...carouselContent]);
      faderLeft.classList.remove('arrow-hidden');
      faderRight.classList.remove('arrow-hidden');
      platform.classList.add('left-fader', 'right-fader');
    }

    const onIntersect = ([entry], observer) => {
      if (!entry.isIntersecting) return;

      if (opts.centerAlign) correctCenterAlignment(scrollable);
      if (opts.startPosition === 'right') moveCarousel(-scrollable.scrollWidth);
      if (!opts.infinityScrollEnabled) initToggleTriggers(container);

      observer.unobserve(scrollable);
    };

    const carouselObserver = new IntersectionObserver(onIntersect, { rootMargin: '1000px', threshold: 0 });
    carouselObserver.observe(scrollable);
  };

  setInitialState(platform, options);
}

export default async function buildCarousel(selector, parent, options = {}) {
  ({ createTag, loadStyle } = await import(`${getLibs()}/utils/utils.js`));
  // Load CSS then build carousel
  return new Promise((resolve) => {
    loadStyle('/express/scripts/widgets/carousel.css', () => {
      onCarouselCSSLoad(selector, parent, options);
      resolve();
    });
  });
}
