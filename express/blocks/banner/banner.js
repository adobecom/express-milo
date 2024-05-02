import { formatSalesPhoneNumber } from '../../scripts/utils/location-utils.js';
import {decorateButtonsDeprecated, normalizeHeadings} from '../../scripts/utils/decorate.js';

export default async function decorate(block) {
  decorateButtonsDeprecated(block);
  normalizeHeadings(block, ['h2', 'h3']);
  const buttons = block.querySelectorAll('a.button');
  if (buttons.length > 1) {
    block.classList.add('multi-button');
  }
  // button on dark background
  buttons.forEach((button) => {
    button.classList.remove('primary');
    button.classList.remove('secondary');

    if (block.classList.contains('light')) {
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
}
