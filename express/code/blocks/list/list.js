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
}
