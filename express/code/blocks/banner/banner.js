import { getLibs, fixIcons, decorateButtonsDeprecated, getIconElementDeprecated, readBlockConfig } from '../../scripts/utils.js';
import { formatSalesPhoneNumber } from '../../scripts/utils/location-utils.js';
import { normalizeHeadings } from '../../scripts/utils/decorate.js';

let createTag;

export default async function decorate(block) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`), decorateButtonsDeprecated(block)]).then(([utils]) => {
    ({ createTag } = utils);
  });
  const section = block.closest('.section');
  if (section?.style?.background) block.style.background = section.style.background;

  const isBannerLightVariant = block.classList.contains('light');
  const isBannerStandoutVariant = block.classList.contains('standout');
  const isBannerCoolVariant = block.classList.contains('cool');

  // Check for background image classes
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

  // Load background variants CSS if needed
  if (hasBackgroundImage) {
    // Load our isolated CSS file with higher specificity
    if (!document.querySelector('link[href*="banner-bg.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/express/code/blocks/banner/banner-bg.css';
      document.head.appendChild(link);
    }
  }

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

  if (isBannerStandoutVariant) {
    const contentContainer = createTag('div', { class: 'content-container' });
    for (const child of block.children) {
      contentContainer.append(child);
    }
    block.replaceChildren(contentContainer);
  } else if (isBannerCoolVariant) {
    const wrapperEl = createTag('div', { class: 'wrapper' });
    const contentContainer = createTag('div', { class: 'content-container' });

    wrapperEl.append(contentContainer);

    for (const child of block.children) {
      contentContainer.append(child);
    }
    block.replaceChildren(wrapperEl);
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

    if (isBannerStandoutVariant || isBannerCoolVariant) {
      button.classList.remove('accent');
      button.classList.add('large', 'primary');
    } else if (isBannerLightVariant) {
      button.classList.remove('accent');
      button.classList.add('large', 'primary', 'reverse');
    } else {
      button.classList.add('accent', 'dark');
      if (block.classList.contains('multi-button')) {
        button.classList.add('reverse');
      }
    }
  });

  const phoneNumberTags = block.querySelectorAll('a[title="{{business-sales-numbers}}"]');
  if (phoneNumberTags.length > 0) {
    try {
      await formatSalesPhoneNumber(phoneNumberTags);
    } catch (e) {
      window.lana?.log('banner.js - error fetching sales phones numbers:', e.message);
    }
  }
  fixIcons(block);
}
