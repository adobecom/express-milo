// eslint-disable-next-line import/no-unresolved
import { getLibs } from '../../scripts/utils.js';
import { addTempWrapperDeprecated } from '../../scripts/utils/decorate.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);

export default function decorate($block) {
  addTempWrapperDeprecated($block, 'quotes');

  $block.querySelectorAll(':scope>div').forEach(($card) => {
    $card.classList.add('quote');
    if ($card.children.length > 1) {
      const $author = $card.children[1];
      $author.classList.add('author');
      // Create a container for image and summary
      const $authorContent = createTag('div', { class: 'author-content' });

      if ($author.querySelector('picture')) {
        const $authorImg = createTag('div', { class: 'image' });
        $authorImg.appendChild($author.querySelector('picture'));
        $authorContent.appendChild($authorImg);
      }

      const $authorSummary = createTag('div', { class: 'summary' });
      Array.from($author.querySelectorAll('p'))
        .filter(($p) => !!$p.textContent.trim())
        .forEach(($p) => $authorSummary.appendChild($p));
      $authorContent.appendChild($authorSummary);
      // Append the author content container to author
      $author.appendChild($authorContent);
    }
    $card.firstElementChild.classList.add('content');
  });
}
