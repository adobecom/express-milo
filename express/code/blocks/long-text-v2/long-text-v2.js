/**
 * Decorates a long-text-v2 block by restructuring its DOM to group H2 headings
 * with their following paragraphs into semantic article containers.
 * @param {HTMLElement} block - The block element to decorate
 */
export default function decorate(block) {
  const h2Elements = block.querySelectorAll('h2');

  if (h2Elements.length > 0) {
    const allContentElements = Array.from(block.querySelectorAll('h2, p'));
    block.innerHTML = '';

    let i = 0;
    while (i < allContentElements.length) {
      const element = allContentElements[i];

      if (element.tagName === 'H2') {
        const article = document.createElement('article');
        article.appendChild(element);

        i += 1;
        while (i < allContentElements.length && allContentElements[i].tagName !== 'P') {
          i += 1;
        }

        if (i < allContentElements.length && allContentElements[i].tagName === 'P') {
          const pElement = allContentElements[i];
          if (pElement.textContent !== 'null' && pElement.textContent !== null) {
            article.appendChild(pElement);
          }
          i += 1;
        }

        block.appendChild(article);
      } else {
        i += 1;
      }
    }
  }

  const isEmpty = block.textContent.trim() === '' || block.children.length === 0;
  if (isEmpty) {
    block.remove();
  }
}
