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

    // Create simplified article structure for no-background variant
    const h2Elements = block.querySelectorAll('h2');
    if (h2Elements.length > 0) {
      const allContentElements = Array.from(block.querySelectorAll('h2, p'));
      block.innerHTML = '';

      allContentElements.forEach((element, index) => {
        if (element.tagName === 'H2') {
          const article = document.createElement('article');
          article.appendChild(element);

          for (let i = index + 1; i < allContentElements.length; i += 1) {
            const nextElement = allContentElements[i];
            if (nextElement.tagName === 'H2') {
              break;
            }
            if (nextElement.tagName === 'P' && 
                nextElement.textContent && 
                nextElement.textContent.trim() !== '' && 
                nextElement.textContent !== 'null' && 
                nextElement.textContent !== null) {
              article.appendChild(nextElement);
            }
          }

          block.appendChild(article);
        }
      });
    }
  }

  if (block.textContent.trim() === '') {
    if (block.parentElement.classList.contains('long-text-wrapper')) {
      block.parentElement.remove();
    } else {
      block.remove();
    }
  }

  // Remove empty or null paragraphs
  block.querySelectorAll('p').forEach(p => {
    if (!p.textContent || p.textContent.trim() === '' || p.textContent === 'null' || p.textContent === null) {
      p.remove();
    }
  });
}
