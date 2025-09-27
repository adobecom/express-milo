import { addTempWrapperDeprecated } from '../../scripts/utils.js';

export default function decorate(block) {
  if (!block.parentElement.classList.contains('long-text-wrapper')) {
    addTempWrapperDeprecated(block, 'long-text');
  }

  if (block.classList.contains('plain')) {
    block.parentElement.classList.add('plain');
  }

  if (block.classList.contains('no-background')) {
    block.parentElement.classList.add('no-background');

    const heading = block.querySelector('h2, h3, h4');
    if (heading) {
      const article = document.createElement('article');
      article.appendChild(heading);

      // Find the first valid paragraph
      const paragraphs = block.querySelectorAll('p');
      for (const p of paragraphs) {
        if (p.textContent.trim() !== 'null' && p.textContent.trim() !== '') {
          article.appendChild(p);
          break;
        }
      }

      block.innerHTML = '';
      block.appendChild(article);
    }
  }

  if (block.textContent.trim() === '') {
    if (block.parentElement.classList.contains('long-text-wrapper')) {
      block.parentElement.remove();
    } else {
      block.remove();
    }
  }

  if (block.querySelector('p') && (block.querySelector('p').textContent === 'null' || block.querySelector('p').textContent === null)) {
    block.querySelector('p').remove();
  }
}
