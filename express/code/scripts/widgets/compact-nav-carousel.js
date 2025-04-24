import { getLibs } from '../utils.js';
import { debounce } from '../utils/hofs.js';

const nextSVGHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="Slider Button - Arrow - Right">
    <circle id="Ellipse 24477" cx="16" cy="16" r="16" fill="#FFFFFF"/>
    <path id="chevron-right" d="M14.6016 21.1996L19.4016 16.3996L14.6016 11.5996" stroke="#292929" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;
const prevSVGHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="Slider Button - Arrow - Left">
    <circle id="Ellipse 24477" cx="16" cy="16" r="16" transform="matrix(-1 0 0 1 32 0)" fill="#FFFFFF"/>
    <path id="chevron-right" d="M17.3984 21.1996L12.5984 16.3996L17.3984 11.5996" stroke="#292929" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;

const smalLViewport = 600;
let createTag; let loadStyle;
let getConfig;

function adjustCompactNavPosition(platform) {
  if (!platform) return;
  const rect = platform.getBoundingClientRect();
  const lowerLeftX = rect.left;
  platform.style.setProperty('--carousel-offset-large-screen', `${lowerLeftX}px`);
}

function initializeCarousel(selector, parent) {
  const isMobile = window.innerWidth <= smalLViewport;
  let sign = 1;
  let currentIndex = isMobile ? 0 : 1;
  let scrollCount = 1;
  let scrolling = false;

  const carouselContent = selector
    ? parent.querySelectorAll(selector)
    : parent.querySelectorAll(':scope > *');

  carouselContent.forEach((el, index) => {
    el.classList.add('compact-nav-carousel-element');
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'group');
    el.setAttribute('aria-label', `Item ${index + 1} of ${carouselContent.length}`);

    el.addEventListener('focus', () => {
      currentIndex = index;
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

  const platform = createTag('div', { class: 'compact-nav-carousel-platform' });
  let ariaLabel;
  if (parent.closest('.template-x')) {
    ariaLabel = 'Template-X Carousel';
  } else if (parent.closest('.template-list')) {
    ariaLabel = 'Template List Carousel';
  } else {
    ariaLabel = 'Blog Carousel';
  }
  const container = createTag('div', {
    class: 'compact-nav-carousel-container',
    role: 'region',
    'aria-label': ariaLabel,
  });
  const faderLeft = createTag('button', {
    class: 'prev arrow-hidden',
    'aria-label': 'Next',
  }, prevSVGHTML);
  const faderRight = createTag('button', {
    class: 'next',
    'aria-label': 'Previous',
  }, nextSVGHTML);
  const control = createTag('div', { class: 'gallery-control' });

  platform.append(...carouselContent);
  control.append(faderLeft, faderRight);
  container.append(platform, control);
  parent.append(container);

  const elements = platform.querySelectorAll(selector);

  const determineScrollCount = () => {
    if (platform.closest('.four')) return 4;
    if (platform.closest('.three')) return 3;
    if (platform.closest('.two')) return 2;
    return 1;
  };
  scrollCount = isMobile ? 1 : determineScrollCount();

  const updateCarousel = () => {
    if (scrolling) return;
    scrolling = true;
    const elementWidth = elements[0].offsetWidth;
    const platformWidth = platform.offsetWidth; 

    platform.scrollBy({
      left:  sign * (platformWidth - elementWidth) / 2,
      behavior: 'smooth',
    });

    setTimeout(() => {
      scrolling = false;
    }, 300);

    elements.forEach((el, index) => {
      el.addEventListener('focus', () => {
        currentIndex = index;
        updateCarousel();
      });
    });
  };

  faderLeft.addEventListener('click', () => {
    if (scrolling || currentIndex === 0) return;
    currentIndex -= scrollCount;
    sign = -1;
    currentIndex = Math.max(0, currentIndex);
    updateCarousel();
  });

  faderRight.addEventListener('click', () => {
    if (scrolling || currentIndex + scrollCount >= elements.length) return;
    currentIndex += scrollCount;
    sign = 1;
    updateCarousel();
  });

  window.addEventListener('resize', debounce(() => {
    const newScrollCount = isMobile ? 1 : determineScrollCount();
    if (newScrollCount !== scrollCount) {
      scrollCount = newScrollCount;
      updateCarousel();
    }
  }));

  platform.addEventListener('scroll', () => {
    const isAtMinimumScroll = platform.scrollLeft <= 0;
    const isAtMaximumScroll = platform.scrollLeft + platform.clientWidth >= platform.scrollWidth; 
    faderLeft.classList.toggle('arrow-hidden', isAtMinimumScroll);
    faderRight.classList.toggle('arrow-hidden', isAtMaximumScroll);
  });

  // Add position adjustment
  adjustCompactNavPosition(platform);

  // Add resize listener for position adjustment
  window.addEventListener('resize', debounce(() => {
    adjustCompactNavPosition(platform);
  }, 250));
}

export async function onBasicCarouselCSSLoad(selector, parent) {
  const config = getConfig();
  const stylesheetHref = `${config.codeRoot}/scripts/widgets/compact-nav-carousel.css`;

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
    loadStyle(`${config.codeRoot}/scripts/widgets/compact-nav-carousel.css`, () => {
      onBasicCarouselCSSLoad(selector, parent, options);
      resolve();
    });
  });
}
