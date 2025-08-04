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

  // Normalize headings first to ensure proper structure
  normalizeHeadings(block, ['h2', 'h3']);

  // Check section metadata for inject-logo setting
  const sectionMetadata = section?.querySelector('.section-metadata');
  let shouldInjectLogo = false;

  if (sectionMetadata) {
    const meta = readBlockConfig(sectionMetadata);
    console.log('Section metadata:', meta);
    shouldInjectLogo = ['on', 'yes'].includes(meta['inject-logo']?.toLowerCase());
  }

  if (shouldInjectLogo) {
    console.log('Logo injection conditions met');
    console.log('H2 element:', block.querySelector('H2'));

    const logo = getIconElementDeprecated('adobe-express-logo');
    console.log('Logo element:', logo);

    logo.classList.add('express-logo');
    block.querySelector('H2')?.prepend(logo);
  } else {
    console.log('Logo injection conditions NOT met');
    console.log('Section metadata found:', !!sectionMetadata);
    if (sectionMetadata) {
      const meta = readBlockConfig(sectionMetadata);
      console.log('Available metadata keys:', Object.keys(meta));
      console.log('inject-logo value:', meta['inject-logo']);
    }
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
