import { getLibs, toClassName } from '../../scripts/utils.js';
import { addTempWrapperDeprecated } from '../../scripts/utils/decorate.js';
import { getIconElementDeprecated, fixIcons } from '../../scripts/utils/icons.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);

export function addBlockClasses(block, classNames) {
  const rows = Array.from(block.children);
  rows.forEach((row) => {
    classNames.forEach((className, i) => {
      row.children[i].className = className;
    });
  });
}

export default async function decorate($block) {
  addTempWrapperDeprecated($block, 'icon-list');
  await fixIcons($block);

  let numCols = 0;
  const $rows = [...$block.children];
  if ($rows[0]) {
    numCols = $rows[0].children.length;
  }
  if (numCols === 2) {
    /* legacy icon list */
    addBlockClasses($block, ['icon-list-image', 'icon-list-description']);
    $block.querySelectorAll(':scope>div').forEach(($row) => {
      if ($row.children && $row.children[1] && !$row.querySelector('img, svg')) {
        const iconName = toClassName($row.children[0].textContent.trim());
        if (iconName && !iconName.startsWith('-')) {
          $row.children[0].textContent = '';
          $row.children[0].append(getIconElementDeprecated(iconName) || '');
        }
      }
    });
  }

  if (numCols === 4) {
    const $cols = ['left', 'right'].map(() => createTag('div', { class: 'icon-list-column' }));
    $rows.forEach(($row, i) => {
      $cols.forEach(($col) => $col.append(createTag('div')));
      const $cells = [...$row.children];
      $cells.forEach(($cell, j) => {
        $cols[Math.floor(j / 2)].children[i].append($cell);
        if (j % 2) {
          if ($cell.querySelector('h3')) {
            $cell.parentNode.classList.add('icon-list-heading');
          } else {
            $cell.parentNode.classList.add('icon-list-regular');
          }
        }
      });
      $row.remove();
    });
    $cols.forEach(($col) => {
      addBlockClasses($col, ['icon-list-image', 'icon-list-description']);
      $block.append($col);
    });
    $block.classList.add('two-column');
    $block.closest('div.section').classList.add('icon-list-two-column-container');
  }
}
