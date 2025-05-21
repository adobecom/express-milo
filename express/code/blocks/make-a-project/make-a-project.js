import { getLibs, fixIcons, addTempWrapperDeprecated } from '../../scripts/utils.js';
import { addFreePlanWidget } from '../../scripts/widgets/free-plan.js';
import buildCarousel from '../../scripts/widgets/carousel.js';

let createTag;

export default async function decorate($block) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`), fixIcons($block)]).then(([utils]) => {
    ({ createTag } = utils);
  });
  addTempWrapperDeprecated($block, 'make-a-project');

  if ($block.children.length) {
    const $projectlist = createTag('div', { class: 'make-a-project-projectlist' });
    const $marquee = createTag('div', { class: 'make-a-project-marquee' });
    const $rows = Array.from($block.children);
    $rows.forEach(($row, index) => {
      const $cells = Array.from($row.children);
      if (index === 0 && $cells.length === 1) {
        $row.classList.add('make-a-project-CTA');
        $marquee.appendChild($row);
      } else if ($row.querySelector(':scope > div > ul:first-child:last-child')) {
        $marquee.appendChild($row);
        $block.classList.add('dark');
        $row.querySelectorAll(':scope ul li a').forEach(($link) => {
          const $icon = $link.previousElementSibling;
          if ($icon) {
            if ($icon.firstElementChild) {
              // remove title from SVG
              $icon.firstElementChild.remove();
            }
            $link.prepend($icon);
          }
        });
      } else if ($cells.length > 1) {
        $row.classList.add('make-a-project-item');
        $row.querySelectorAll('a').forEach(($link) => {
          $link.classList.remove('button');
        });
        const $pictureContainer = $cells[0];
        const img = $pictureContainer.querySelector('img');

        if (img) img.removeAttribute('loading');
        const $linkContainer = $cells[1];
        const $iconSvgContainer = $cells[2];
        const icon = $iconSvgContainer.querySelector('img, svg');
        let $iconDiv = null;
        if (icon) {
          $iconDiv = createTag('div', { class: 'make-a-project-icon' });
          icon?.removeAttribute('alt');
          $iconDiv.appendChild($iconSvgContainer);
        }
        const $numbersContainer = $cells[3];
        if ($numbersContainer) $numbersContainer.classList.add('make-a-project-numbers');
        const $a = $linkContainer.querySelector(':scope a');
        if ($a) {
          $linkContainer.classList.remove('button-container');
          if (icon) $a.prepend($iconDiv);
          if ($numbersContainer) $a.appendChild($numbersContainer);
          $a.prepend($pictureContainer);
        } else {
          if (icon) $linkContainer.prepend($iconDiv);
          if ($numbersContainer) $linkContainer.appendChild($numbersContainer);
          $linkContainer.prepend($pictureContainer);
        }
        const $svgImageInsteadOfPicture = $pictureContainer.querySelector('svg');
        if ($svgImageInsteadOfPicture) {
          $pictureContainer.classList.add('make-a-project-item-svg-image');
        }
        $projectlist.appendChild($row);
      } else {
        $row.classList.add('make-a-project-description');
        addFreePlanWidget($row.firstElementChild);
      }
    });
    if ($projectlist.children.length) {
      $marquee.appendChild($projectlist);
      buildCarousel(':scope > div', $projectlist);
    }
    $block.prepend($marquee);
    const $CTA = $block.querySelector('.make-a-project-CTA');
    if ($CTA) $CTA.querySelectorAll('a.button').forEach(($button) => $button.classList.add('large'));
  }
}
