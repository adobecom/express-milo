import { getLibs, addTempWrapperDeprecated } from '../../scripts/utils.js';

let createTag;

function decorateList(block) {
  const list = [];

  const rows = Array.from(block.children);
  rows.forEach((row) => {
    const cells = Array.from(row.children);
    const titleEl = cells[0];
    const textEl = cells[1];

    if (titleEl && textEl) {
      const title = titleEl.textContent.trim();
      const text = textEl.textContent.trim();
      list.push({ title, text });
    }
  });
  if (list.length > 0) {
    block.innerHTML = '';
    list.forEach((item) => {
      const { title, text } = item;
      const listItem = createTag('div', { class: 'item' });
      block.append(listItem);
      const titleEl = createTag('h3', { class: 'item-title' });
      titleEl.innerHTML = title;
      listItem.append(titleEl);
      const textEl = createTag('p', { class: 'item-text' });
      textEl.innerHTML = text;
      listItem.append(textEl);
    });
  }
}

export default async function decorate(block) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  addTempWrapperDeprecated(block, 'list');
  decorateList(block);

  const pricingLinks = [...block.querySelectorAll('a')].filter((a) => a.textContent.includes('((pricing'));
  if (!pricingLinks.length) return;
  const { fetchPlanOnePlans } = await import('../../scripts/utils/pricing.js');
  pricingLinks.forEach((link) => {
    const priceType = link.textContent.replace(/\(\(|\)\)/g, '').split('.')[1];
    fetchPlanOnePlans(link.href).then((response) => {
      if (response[priceType]) {
        const priceText = createTag('span', { class: 'inline-pricing' }, response[priceType]);
        link.parentElement.replaceChild(priceText, link);
      }
    });
  });
}
