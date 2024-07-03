// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/utils.js';
import { decorateButtonsDeprecated } from '../../scripts/utils/decorate.js';
import { decorateSocialIcons } from '../../scripts/utils/icons.js';

export default function decorate(block) {
  decorateSocialIcons(block);
  decorateButtonsDeprecated(block);
  const rows = Array.from(block.children);
  rows.forEach((row) => {
    const cells = Array.from(row.children);
    if (cells[2]) {
      const device = toClassName(cells[2].textContent.trim());
      if (device) row.classList.add(`${device}-only`);
      cells[2].remove();
    }
    if (cells[1]) {
      const $a = cells[1].querySelector('a');
      if ($a) {
        $a.innerHTML = cells[0].innerHTML;
        cells[0].remove();
      } else {
        cells[1].remove();
      }
    }
  });
}
