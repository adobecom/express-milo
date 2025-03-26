import { getLibs } from '../utils.js';
import { debounce } from '../utils/hofs.js';

const smalLViewport = 600;
let createTag; let loadStyle;
let getConfig;

function initializeGridCarousel(selector, parent) {
  let currentIndex = 0;
  let scrolling = false;
  let isInitialLoad = true;
  let touchStartX = 0;
  let touchEndX = 0;

  const carouselContent = selector
    ? parent.querySelectorAll(selector)
    : parent.querySelectorAll(':scope > *');

  // Initialize carousel elements
  carouselContent.forEach((el, index) => {
    el.classList.add('basic-carousel-element');
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'group');
    el.setAttribute('aria-label', `Item ${index + 1} of ${carouselContent.length}`);
  });

  // Create carousel structure
  const platform = createTag('div', { class: 'basic-carousel-platform' });
  const container = createTag('div', {
    class: 'basic-carousel-container',
    role: 'region',
    'aria-label': 'Template Grid Carousel',
  });

  // Create navigation controls
  const faderLeft = createTag('div', { class: 'basic-carousel-fader-left' });
  const faderRight = createTag('div', { class: 'basic-carousel-fader-right' });
  const arrowLeft = createTag('a', {
    class: 'button basic-carousel-arrow basic-carousel-arrow-left',
    'aria-label': 'Scroll grid left',
  });
  const arrowRight = createTag('a', {
    class: 'button basic-carousel-arrow basic-carousel-arrow-right',
    'aria-label': 'Scroll grid right',
  });

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

  // Prevent vertical scroll when horizontal scrolling in grid
  platform.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
    }
  }, { passive: false });

  // Create controls wrapper
  const controlsWrapper = createTag('div', { class: 'basic-carousel-controls-wrapper' });
  controlsWrapper.append(faderLeft, faderRight);
  faderLeft.append(arrowLeft);
  faderRight.append(arrowRight);

  // Assemble carousel
  platform.append(...carouselContent);
  container.append(platform, controlsWrapper);
  parent.append(container);

  const elements = platform.querySelectorAll('.template.basic-carousel-element');

  // Update grid layout and scroll position
  function updateGridCarousel(forceUpdate = false) {
    if (!forceUpdate && scrolling) return;
    scrolling = true;

    const elementWidth = elements[0].offsetWidth;
    const platformWidth = platform.offsetWidth;
    const gap = 10;

    if (window.innerWidth <= smalLViewport) {
      // Mobile grid layout
      const totalTemplates = carouselContent.length;
      const midPoint = Math.ceil(totalTemplates / 2);
      carouselContent.forEach((template, index) => {
        if (index < midPoint) {
          template.style.gridArea = `1 / ${index + 1}`;
        } else {
          template.style.gridArea = `2 / ${index - midPoint + 1}`;
        }
      });

      const twoTemplatesWidth = (elementWidth * 2) + gap;
      const centerOffset = (platformWidth - twoTemplatesWidth) / 2;
      const newScrollPos = isInitialLoad ? 0 : (currentIndex * (elementWidth + gap)) - centerOffset;
      platform.scrollTo({
        left: newScrollPos,
        behavior: isInitialLoad ? 'auto' : 'smooth',
      });

      isInitialLoad = false;
    } else {
      // Desktop grid layout
      const newScrollPos = currentIndex * elementWidth;
      platform.scrollTo({
        left: newScrollPos,
        behavior: 'smooth',
      });
    }

    // Update arrow visibility
    faderLeft.classList.toggle('arrow-hidden', currentIndex === 0);
    const eleLength = Math.floor(elements.length / 2) - 1;
    faderRight.classList.toggle('arrow-hidden', currentIndex + 1 === eleLength);

    setTimeout(() => {
      scrolling = false;
    }, 300);
  }

  // Navigation handlers
  faderLeft.addEventListener('click', () => {
    if (scrolling) return;
    if (platform.scrollLeft <= 0) return;
    currentIndex = Math.max(0, currentIndex - 1);
    updateGridCarousel();
  });

  faderRight.addEventListener('click', () => {
    if (scrolling) return;
    const maxScroll = platform.scrollWidth - platform.offsetWidth;
    if (platform.scrollLeft >= maxScroll) return;

    const templatesPerRow = Math.floor(elements.length / 2);
    const maxIndex = templatesPerRow + 2;
    currentIndex = Math.min(maxIndex, currentIndex + 1);
    updateGridCarousel();
  });

  // Touch handling
  platform.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchEndX = touchStartX;
    e.preventDefault();
  });

  platform.addEventListener('touchmove', (e) => {
    touchEndX = e.touches[0].clientX;
    e.preventDefault();
  });

  platform.addEventListener('touchend', (e) => {
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
  });

  // Handle scroll events
  platform.addEventListener('scroll', debounce(() => {
    if (scrolling) return;

    const elementWidth = elements[0].offsetWidth;
    const scrollPosition = platform.scrollLeft;
    const gap = 10;
    const itemWidth = elementWidth + gap;
    currentIndex = Math.round(scrollPosition / itemWidth);

    faderLeft.classList.toggle('arrow-hidden', currentIndex === 0);
    const eleLength = Math.floor(elements.length / 2) - 2;
    faderRight.classList.toggle('arrow-hidden', currentIndex === eleLength);
  }, 100));

  // Handle resize
  window.addEventListener('resize', debounce(() => {
    updateGridCarousel(true);
  }));

  // Initial render
  updateGridCarousel(true);
}

export async function onGridCarouselCSSLoad(selector, parent) {
  const config = getConfig();
  const stylesheetHref = `${config.codeRoot}/scripts/widgets/grid-carousel.css`;

  await new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = stylesheetHref;
    link.onload = resolve;
    link.onerror = () => reject(new Error(`Failed to load ${stylesheetHref}`));
    document.head.appendChild(link);
  });

  initializeGridCarousel(selector, parent);
}

export default async function buildGridCarousel(selector, parent, options = {}) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`)]).then(([utils]) => {
    ({ createTag, getConfig, loadStyle } = utils);
  });
  const config = getConfig();
  return new Promise((resolve) => {
    loadStyle(`${config.codeRoot}/scripts/widgets/grid-carousel.css`, () => {
      onGridCarouselCSSLoad(selector, parent, options);
      resolve();
    });
  });
} 
