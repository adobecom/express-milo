/* eslint-disable import/named, import/extensions */
import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';

let createTag; let getMetadata;

function buildMetadataConfigObject() {
  const title = getMetadata('toc-title');
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
  }), { title, 'toc-content-numbers': showContentNumbers });

  return config;
}

export default async function setTOCSEO() {
  ({ createTag, getMetadata } = await import(`${getLibs()}/utils/utils.js`));
  const config = buildMetadataConfigObject();

  const toc = createTag('div', {
    class: 'toc toc-container',
  });

  const title = createTag('div', { class: 'toc-title' });
  title.textContent = 'Table of Contents';
  toc.appendChild(title);

  const tocContent = createTag('div', { class: 'toc-content' });

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
          const stickyOffset = 40; // TOC is positioned 40px from top
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
    icon.classList.add('social-icon', `${iconName}-icon`);
    socialIcons.appendChild(icon);
  });

  toc.appendChild(socialIcons);

  title.addEventListener('click', () => {
    toc.classList.toggle('open');
  });

  const firstSection = document.querySelector('main .section');
  firstSection.insertAdjacentElement('afterend', toc);

  // Desktop dynamic positioning
  function handleDesktopPositioning() {
    if (window.innerWidth >= 1200) {
      const sectionElement = document.querySelector('main .section');
      const tocElement = document.querySelector('.toc-container');
      const fixedTopDistance = 200; // Distance from top when fixed

      if (sectionElement && tocElement) {
        const firstSectionBottom = sectionElement.offsetTop + sectionElement.offsetHeight;
        const scrollTop = window.pageYOffset;

        // Calculate where TOC should be positioned
        let topPosition = firstSectionBottom - scrollTop;

        // If TOC would go above the fixed distance, keep it at fixed distance
        if (topPosition < fixedTopDistance) {
          topPosition = fixedTopDistance;
        }

        tocElement.style.position = 'fixed';
        tocElement.style.top = `${topPosition}px`;
        tocElement.style.left = '0';
        tocElement.style.width = '310px';
      }
    }
  }

  // Add scroll listener for desktop
  if (window.innerWidth >= 1200) {
    window.addEventListener('scroll', handleDesktopPositioning);
    window.addEventListener('resize', handleDesktopPositioning);
    // Initial positioning
    handleDesktopPositioning();
  }
}
