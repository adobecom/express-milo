import { getCountry } from '../../scripts/utils/pricing.js';
import { normalizeHeadings } from '../../scripts/utils/decorate.js';

const formatSalesPhoneNumber = (() => {
  let numbersMap;
  return async (tags, placeholder = '') => {
    if (tags.length <= 0) return;

    if (!numbersMap) {
      numbersMap = await fetch('/express/system/business-sales-numbers.json').then((r) => r.json());
    }

    if (!numbersMap?.data) return;
    const country = await getCountry() || 'us';
    tags.forEach((a) => {
      const r = numbersMap.data.find((d) => d.country === country);

      const decodedNum = r ? decodeURI(r.number.trim()) : decodeURI(a.href.replace('tel:', '').trim());

      a.textContent = placeholder ? a.textContent.replace(placeholder, decodedNum) : decodedNum;
      a.setAttribute('title', placeholder ? a.getAttribute('title').replace(placeholder, decodedNum) : decodedNum);
      a.href = `tel:${decodedNum}`;
    });
  };
})();

export default async function decorate(block) {
  normalizeHeadings(block, ['h2', 'h3']);
  const buttons = block.querySelectorAll('a.button');
  if (buttons.length > 1) {
    block.classList.add('multi-button');
  }
  // button on dark background
  buttons.forEach(($button) => {
    $button.classList.remove('primary');
    $button.classList.remove('secondary');

    if (block.classList.contains('light')) {
      $button.classList.remove('accent');
      $button.classList.add('large', 'primary', 'reverse');
    } else {
      $button.classList.add('accent', 'dark');
      if (block.classList.contains('multi-button')) {
        $button.classList.add('reverse');
      }
    }
  });

  const phoneNumberTags = block.querySelectorAll('a[title="{{business-sales-numbers}}"]');
  if (phoneNumberTags.length > 0) {
    await formatSalesPhoneNumber(phoneNumberTags);
  }
}
