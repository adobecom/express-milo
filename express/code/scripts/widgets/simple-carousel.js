import { getLibs } from '../utils.js';

let createTag;

function initializeSimpleCarousel(selector, parent, options = {}) {
  const {
    ariaLabel = 'Carousel',
    centerActive = false,
    activeClass = 'active',
  } = options;

  const carouselContent = selector
    ? parent.querySelectorAll(selector)
    : parent.querySelectorAll(':scope > *');

  if (carouselContent.length === 0) return undefined;
  const platform = createTag('div', { class: 'simple-carousel-platform' });
  const container = createTag('div', {
    class: 'simple-carousel-container',
    role: 'region',
    'aria-label': ariaLabel,
  });

  const faderLeft = createTag('div', { class: 'simple-carousel-fader-left arrow-hidden' });
  const faderRight = createTag('div', { class: 'simple-carousel-fader-right arrow-hidden' });

  const arrowLeft = createTag('a', {
    class: 'button simple-carousel-arrow simple-carousel-arrow-left',
    'aria-label': 'Scroll left',
    tabindex: '0',
    role: 'button',
  });
  const arrowRight = createTag('a', {
    class: 'button simple-carousel-arrow simple-carousel-arrow-right',
    'aria-label': 'Scroll right',
    tabindex: '0',
    role: 'button',
  });

  carouselContent.forEach((el, index) => {
    el.classList.add('simple-carousel-item');
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'group');
    el.setAttribute('aria-label', `Item ${index + 1} of ${carouselContent.length}`);
  });

  platform.append(...carouselContent);

  const updateArrowVisibility = () => {
    const hasOverflow = platform.scrollWidth > platform.clientWidth;
    if (!hasOverflow) {
      faderLeft.classList.add('arrow-hidden');
      faderRight.classList.add('arrow-hidden');
      return;
    }
    const isAtStart = platform.scrollLeft <= 1;
    const isAtEnd = platform.scrollLeft >= (platform.scrollWidth - platform.clientWidth - 1);
    faderLeft.classList.toggle('arrow-hidden', isAtStart);
    faderRight.classList.toggle('arrow-hidden', isAtEnd);
  };

  let scrollTimeout;
  const throttledUpdate = () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
      updateArrowVisibility();
      scrollTimeout = null;
    }, 50);
  };

  container.appendChild(platform);
  faderLeft.appendChild(arrowLeft);
  faderRight.appendChild(arrowRight);
  parent.appendChild(container);
  parent.appendChild(faderLeft);
  parent.appendChild(faderRight);

  platform.addEventListener('scroll', throttledUpdate, { passive: true });
  window.addEventListener('resize', throttledUpdate, { passive: true });

  requestAnimationFrame(() => {
    setTimeout(() => {
      updateArrowVisibility();
    }, 150);
  });

  const moveCarousel = (direction) => {
    const scrollAmount = platform.offsetWidth * 0.75;
    platform.scrollLeft += direction === 'right' ? scrollAmount : -scrollAmount;
  };

  arrowLeft.addEventListener('click', (e) => {
    e.preventDefault();
    moveCarousel('left');
  });

  arrowRight.addEventListener('click', (e) => {
    e.preventDefault();
    moveCarousel('right');
  });

  [arrowLeft, arrowRight].forEach((arrow) => {
    arrow.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        arrow.click();
      }
    });
  });

  if (centerActive) {
    const centerActiveItem = () => {
      requestAnimationFrame(() => {
        const activeElement = platform.querySelector(`.${activeClass}`);
        if (activeElement) {
          const activeItem = activeElement.closest('.simple-carousel-item') || activeElement;
          const itemLeft = activeItem.offsetLeft;
          const itemWidth = activeItem.offsetWidth;
          const containerWidth = platform.offsetWidth;
          const maxScroll = platform.scrollWidth - containerWidth;
          let scrollTo = itemLeft - (containerWidth / 2) + (itemWidth / 2);
          scrollTo = Math.max(0, Math.min(scrollTo, maxScroll));
          platform.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
      });
    };

    const activeObserver = new MutationObserver(centerActiveItem);
    activeObserver.observe(platform, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true,
    });

    centerActiveItem();
  }

  platform.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const focusedItem = document.activeElement;
      if (focusedItem.classList.contains('simple-carousel-item')) {
        const items = Array.from(carouselContent);
        const currentIndex = items.indexOf(focusedItem);
        const nextIndex = e.key === 'ArrowLeft'
          ? Math.max(0, currentIndex - 1)
          : Math.min(items.length - 1, currentIndex + 1);
        items[nextIndex].focus();
      }
    }
  });

  return {
    container,
    platform,
    items: carouselContent,
    scrollTo: (index) => {
      if (index >= 0 && index < carouselContent.length) {
        carouselContent[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    },
  };
}

export default async function createSimpleCarousel(selector, parent, options) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));

  const miloLibs = getLibs();
  const base = miloLibs?.replace('/libs', '');
  const cssLoaded = new Promise((resolve) => {
    (async () => {
      const { loadStyle } = await import(`${miloLibs}/utils/utils.js`);
      await loadStyle(`${base}/express/code/scripts/widgets/simple-carousel.css`);
      resolve();
    })();
  });

  await cssLoaded;
  return initializeSimpleCarousel(selector, parent, options);
}
