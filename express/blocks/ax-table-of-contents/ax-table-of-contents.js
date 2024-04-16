/* eslint-disable import/named, import/extensions */
import { getLibs, readBlockConfig } from '../../scripts/utils.js';
import { addTempWrapperDeprecated } from '../../scripts/utils/decorate.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);

export default function decorate($block, name, doc) {
  addTempWrapperDeprecated($block, 'ax-table-of-contents');

  const config = readBlockConfig($block);
  const $headings = doc.querySelectorAll('main h2, main h3, main h4, main .ax-table-of-contents');
  let skip = true;
  const $toc = createTag('div', { class: 'toc' });
  $headings.forEach(($h) => {
    if (!skip && $h.tagName.startsWith('H')) {
      const hLevel = +$h.tagName.substring(1);
      if (hLevel <= +config.levels + 1) {
        const $entry = createTag('div', { class: `toc-entry toc-level-h${hLevel}` });
        $entry.innerHTML = `<a href="#${$h.id}">${$h.innerHTML}</a>`;
        $toc.appendChild($entry);
      }
    }
    if ($h === $block) skip = false;
  });
  $block.innerHTML = '';
  $block.appendChild($toc);
}
