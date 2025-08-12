import { getLibs, fixIcons, decorateButtonsDeprecated, getIconElementDeprecated, readBlockConfig } from '../../scripts/utils.js';
import { normalizeHeadings } from '../../scripts/utils/decorate.js';

let createTag;

export default async function decorate(block) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`), decorateButtonsDeprecated(block)]).then(([utils]) => {
    ({ createTag } = utils);
  });

  // Check for background image classes early
  const backgroundImageClasses = [
    'light-bg',
    'blue-green-pink-bg',
    'blue-bg',
    'blue-pink-orange-bg',
    'green-blue-red-bg',
    'blue-purple-gray-bg',
    'yellow-pink-blue-bg',
  ];

  let hasBackgroundImage = false;
  for (const className of backgroundImageClasses) {
    if (block.classList.contains(className)) {
      hasBackgroundImage = true;
      break;
    }
  }

  // Load CSS immediately if background variant detected
  if (hasBackgroundImage) {
    // Preload only the specific background image for the detected class
    const backgroundImageMap = {
      'light-bg': '/express/code/blocks/banner-bg/img/light-bg.jpg',
      'blue-green-pink-bg': '/express/code/blocks/banner-bg/img/blue-green-pink-bg.jpg',
      'blue-bg': '/express/code/blocks/banner-bg/img/blue-bg.jpg',
      'blue-pink-orange-bg': '/express/code/blocks/banner-bg/img/blue-pink-orange-bg.jpg',
      'green-blue-red-bg': '/express/code/blocks/banner-bg/img/green-blue-red-bg.jpg',
      'blue-purple-gray-bg': '/express/code/blocks/banner-bg/img/blue-purple-gray-bg.jpg',
      'yellow-pink-blue-bg': '/express/code/blocks/banner-bg/img/yellow-pink-blue-bg.jpg',
    };

    // Find which specific class exists and preload its image
    for (const className of backgroundImageClasses) {
      if (block.classList.contains(className)) {
        const imgSrc = backgroundImageMap[className];
        if (imgSrc && !document.querySelector(`link[href="${imgSrc}"]`)) {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'image';
          preloadLink.href = imgSrc;
          document.head.appendChild(preloadLink);
        }
        break; // Only preload the first matching class
      }
    }
  }

  const section = block.closest('.section');
  if (section?.style?.background) block.style.background = section.style.background;

  // Create background container for banners with background images
  if (hasBackgroundImage) {
    const backgroundContainer = createTag('div', { class: 'background-container' });

    // Move all existing content into the background container
    while (block.firstChild) {
      backgroundContainer.appendChild(block.firstChild);
    }

    block.appendChild(backgroundContainer);

    // Normalize headings first to ensure proper structure
    normalizeHeadings(block, ['h2', 'h3', 'h4']);
  }

  // Check section metadata for inject-logo setting
  const sectionMetadata = section?.querySelector('.section-metadata');
  let shouldInjectLogo = false;

  if (sectionMetadata) {
    const meta = readBlockConfig(sectionMetadata);
    shouldInjectLogo = ['on', 'yes'].includes(meta['inject-logo']?.toLowerCase());
  }

  if (shouldInjectLogo) {
    const logo = getIconElementDeprecated('adobe-express-logo');
    logo.classList.add('express-logo');
    block.querySelector('H2')?.prepend(logo);
  }

  const buttons = block.querySelectorAll('a.button');
  if (buttons.length > 1) {
    block.classList.add('multi-button');
  }

  // Add bg-variant-button class for background image variants FIRST
  if (hasBackgroundImage) {
    buttons.forEach((button, index) => {
      button.classList.add('bg-banner-button');

      // For multi-button banners with background images, style the second button differently
      if (block.classList.contains('multi-button') && index === 1) {
        button.classList.add('bg-banner-button-secondary');
      }
    });
  }

  // button on dark background
  buttons.forEach((button) => {
    button.classList.remove('primary');
    button.classList.remove('secondary');

    button.classList.add('accent', 'dark');
    if (block.classList.contains('multi-button')) {
      button.classList.add('reverse');
    }
  });

  fixIcons(block);
}
