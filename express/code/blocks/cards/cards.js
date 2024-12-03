// eslint-disable-next-line import/no-unresolved
import { getLibs } from '../../scripts/utils.js';
import { decorateButtonsDeprecated } from '../../scripts/utils/decorate.js';

let createTag;
/**
 * @param {HTMLDivElement} $block
 */
export default async function decorate($block) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`), decorateButtonsDeprecated($block)]).then(([utils]) => {
    ({ createTag } = utils);
  });
  $block.querySelectorAll(':scope>div').forEach(($card) => {
    $card.classList.add('card');
    const $cardDivs = [...$card.children];
    $cardDivs.forEach(($div) => {
      if ($div.querySelector('img')) {
        $div.classList.add('card-image');
      } else {
        $div.classList.add('card-content');
      }
      const $a = $div.querySelector('a');
      if ($a && $a.textContent.trim().startsWith('https://')) {
        const $wrapper = createTag('a', { href: $a.href, class: 'card' });
        $a.remove();
        $wrapper.innerHTML = $card.innerHTML;
        $block.replaceChild($wrapper, $card);
      }
    });
  });
}
