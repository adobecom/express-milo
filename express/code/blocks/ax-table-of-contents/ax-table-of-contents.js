/* eslint-disable import/named, import/extensions */
import { getLibs, readBlockConfig, addTempWrapperDeprecated } from '../../scripts/utils.js';

let createTag;

// eslint-disable-next-line no-unused-vars
export default async function decorate(block) {
  addTempWrapperDeprecated(block, 'ax-table-of-contents');
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));

  const config = readBlockConfig(block);
  const headings = document.body.querySelectorAll('main h2, main h3, main h4, main .ax-table-of-contents');
  let skip = true;
  const toc = createTag('div', { class: 'toc' });
  headings.forEach((h) => {
    if (!skip && h.tagName.startsWith('H')) {
      const hLevel = +h.tagName.substring(1);
      if (hLevel <= +config.levels + 1) {
        const entry = createTag('div', { class: `toc-entry toc-level-h${hLevel}` });
        entry.innerHTML = `<a href="#${h.id}">${h.innerHTML}</a>`;
        toc.appendChild(entry);
      }
    }
    if (h === block) skip = false;
  });
  block.innerHTML = '';
  block.appendChild(toc);
}
