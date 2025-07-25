/* eslint-disable import/named, import/extensions */
import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';

let createTag; let getMetadata;

function buildMetadataConfigObject() {
  const title = getMetadata('toc-title');
  const ariaLabel = getMetadata('toc-aria-label');
  const showContentNumbers = getMetadata('toc-content-numbers');
  const contents = [];
  let i = 1;
  let content = getMetadata(`content-${i}`);

  while (content) {
    const abbreviatedContent = getMetadata(`content-${i}-short`);
    if (abbreviatedContent) {
      contents.push({ [`content-${i}-short`]: abbreviatedContent });
    }
    contents.push({ [`content-${i}`]: content });
    i += 1;
    content = getMetadata(`content-${i}`);
  }

  const config = contents.reduce((acc, el) => ({
    ...acc,
    ...el,
  }), { title, ariaLabel, 'toc-content-numbers': showContentNumbers });

  return config;
}

export default async function setTOCSEO() {
  ({ createTag, getMetadata } = await import(`${getLibs()}/utils/utils.js`));
  const config = buildMetadataConfigObject();

  // Dynamically get navigation height for mobile positioning
  let MOBILE_NAV_HEIGHT = 40; // Default fallback
  try {
    const { getGnavHeight } = await import(`${getLibs()}/blocks/global-navigation/utilities/utilities.js`);
    MOBILE_NAV_HEIGHT = getGnavHeight();
  } catch (e) {
    window.lana?.log(`Error getting gnav height ${e}`);
  }

  const toc = createTag('div', {
    class: 'toc toc-container',
    role: 'navigation',
    'aria-label': 'Table of Contents',
  });

  const title = createTag('button', {
    class: 'toc-title',
    'aria-expanded': 'false',
    'aria-controls': 'toc-content',
  });
  title.textContent = config.title;
  toc.appendChild(title);

  const tocContent = createTag('div', {
    class: 'toc-content',
    id: 'toc-content',
    role: 'region',
    'aria-label': config.ariaLabel,
  });

  // Create all links once
  Object.keys(config).forEach((key) => {
    if (key.startsWith('content-') && !key.endsWith('-short')) {
      const link = createTag('a', { href: `#${key}` });
      link.textContent = config[key];

      // Add click handler to scroll to header
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const headerText = config[key];
        const headers = document.querySelectorAll('main h2, main h3, main h4');
        const targetHeader = Array.from(headers).find((h) => h.textContent.trim().includes(headerText.replace('...', '').trim()));

        if (targetHeader) {
          // Scroll to target with offset for sticky TOC
          const tocHeight = toc.offsetHeight;
          // Check current window width dynamically and use dynamic nav height for mobile
          const stickyOffset = window.innerWidth >= 768 ? -120 : MOBILE_NAV_HEIGHT;
          const headerRect = targetHeader.getBoundingClientRect();
          const scrollTop = window.pageYOffset + headerRect.top - tocHeight - stickyOffset - 20;

          window.scrollTo({
            top: scrollTop,
            behavior: 'smooth',
          });

          // Close TOC after clicking
          toc.classList.remove('open');
        }
      });

      tocContent.appendChild(link);
    }
  });

  toc.appendChild(tocContent);

  // Add social icons at bottom (outside tocContent)
  const socialIcons = createTag('div', { class: 'toc-social-icons' });
  const icons = ['x', 'facebook', 'linkedin', 'link'];

  icons.forEach((iconName) => {
    const icon = getIconElementDeprecated(iconName);
    socialIcons.appendChild(icon);
  });

  toc.appendChild(socialIcons);

  title.addEventListener('click', () => {
    // Only toggle on mobile (below 768px)
    if (window.innerWidth < 768) {
      toc.classList.toggle('open');
      const isExpanded = toc.classList.contains('open');
      title.setAttribute('aria-expanded', isExpanded.toString());
    }
  });

  // Add keyboard support for the title
  title.addEventListener('keydown', (e) => {
    // Only toggle on mobile (below 768px)
    if (window.innerWidth < 768 && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toc.classList.toggle('open');
      const isExpanded = toc.classList.contains('open');
      title.setAttribute('aria-expanded', isExpanded.toString());

      // Focus first link when opening
      if (isExpanded) {
        const firstLink = tocContent.querySelector('a');
        if (firstLink) {
          firstLink.focus();
        }
      }
    }
  });

  // Add arrow key navigation for links
  tocContent.addEventListener('keydown', (e) => {
    const links = Array.from(tocContent.querySelectorAll('a'));
    const currentIndex = links.indexOf(document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % links.length;
      links[nextIndex].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex <= 0 ? links.length - 1 : currentIndex - 1;
      links[prevIndex].focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      links[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      links[links.length - 1].focus();
    }
  });

  const firstSection = document.querySelector('main .section');
  firstSection.insertAdjacentElement('afterend', toc);

  // Throttle function using requestAnimationFrame for smooth scrolling
  function throttleRAF(func) {
    let ticking = false;
    return function executedFunction(...args) {
      if (!ticking) {
        requestAnimationFrame(() => {
          func(...args);
          ticking = false;
        });
        ticking = true;
      }
    };
  }

  // Desktop dynamic positioning
  function handleDesktopPositioning() {
    if (window.innerWidth >= 1200) {
      const sectionElement = document.querySelector('main .section');
      const tocElement = document.querySelector('.toc-container');
      const linkListWrapper = document.querySelector('.section:has(.link-list-wrapper)');
      const fixedTopDistance = 200; // Distance from top when fixed

      if (sectionElement && tocElement) {
        const firstSectionBottom = sectionElement.offsetTop + sectionElement.offsetHeight;
        const scrollTop = window.pageYOffset;

        // Calculate where TOC should be positioned
        let topPosition = firstSectionBottom - scrollTop + 40;

        // If TOC would go above the fixed distance, keep it at fixed distance
        if (topPosition < fixedTopDistance) {
          topPosition = fixedTopDistance;
        }

        // If link-list-wrapper exists, prevent TOC from going into it
        if (linkListWrapper) {
          const linkListTop = linkListWrapper.offsetTop - scrollTop;
          const tocHeight = tocElement.offsetHeight;
          const maxTopPosition = linkListTop - tocHeight;

          if (topPosition > maxTopPosition) {
            topPosition = maxTopPosition;
          }
        }
        // Apply dynamic positioning via CSS custom property
        tocElement.style.setProperty('--toc-top-position', `${topPosition}px`);
        tocElement.classList.add('toc-desktop-fixed');
      }
    }
  }

  // Create throttled version for scroll events using requestAnimationFrame
  const throttledHandleDesktopPositioning = throttleRAF(handleDesktopPositioning);

  // Add scroll listener for desktop (throttled with RAF for smooth scrolling)
  window.addEventListener('scroll', throttledHandleDesktopPositioning);
  // Add resize listener for desktop (immediate for responsive viewport changes)
  window.addEventListener('resize', handleDesktopPositioning);

  // Initial positioning
  handleDesktopPositioning();

  // Clean up desktop classes when transitioning away from desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth < 1200) {
      const tocElement = document.querySelector('.toc-container');
      if (tocElement) {
        tocElement.classList.remove('toc-desktop-fixed');
        tocElement.style.removeProperty('--toc-top-position');
      }
    }
  });
}
