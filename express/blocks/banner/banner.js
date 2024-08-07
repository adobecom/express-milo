import { getLibs } from '../../scripts/utils.js';
import { formatSalesPhoneNumber } from '../../scripts/utils/location-utils.js';
import { decorateButtonsDeprecated, normalizeHeadings } from '../../scripts/utils/decorate.js';
import { fixIcons } from '../../scripts/utils/icons.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);

export default async function decorate(block) {
  decorateButtonsDeprecated(block);

  const isBannerLightVariant = block.classList.contains('light');
  const isBannerStandoutVariant = block.classList.contains('standout');

  if (isBannerStandoutVariant) {
    const standoutContainer = createTag('div', {
      class: 'standout-container',
    });

    for (const child of block.children) {
      standoutContainer.append(child);
    }

    block.replaceChildren(standoutContainer);
  }

  normalizeHeadings(block, ['h2', 'h3']);
  const buttons = block.querySelectorAll('a.button');
  if (buttons.length > 1) {
    block.classList.add('multi-button');
  }
  // button on dark background
  buttons.forEach((button) => {
    button.classList.remove('primary');
    button.classList.remove('secondary');

    if (isBannerStandoutVariant) {
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
    await formatSalesPhoneNumber(phoneNumberTags);
  }
  fixIcons(block);
}
