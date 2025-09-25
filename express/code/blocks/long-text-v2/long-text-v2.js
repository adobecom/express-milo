export default function decorate(block) {
  const h2Elements = block.querySelectorAll('h2');

  if (h2Elements.length > 0) {
    const allContentElements = Array.from(block.querySelectorAll('h2, p'));
    block.innerHTML = '';

    allContentElements.forEach((element, index) => {
      if (element.tagName === 'H2') {
        const article = document.createElement('article');
        article.appendChild(element);

        // Find the first valid paragraph after this H2
        for (let i = index + 1; i < allContentElements.length; i += 1) {
          const nextElement = allContentElements[i];
          if (nextElement.tagName === 'H2') {
            // Stop at the next H2
            break;
          }
          if (nextElement.tagName === 'P' && nextElement.textContent !== 'null' && nextElement.textContent !== null && nextElement.textContent.trim() !== '') {
            article.appendChild(nextElement);
            break; // Only add the first valid paragraph
          }
        }

        block.appendChild(article);
      }
    });
  }

  const isEmpty = block.textContent.trim() === '' || block.children.length === 0;
  if (isEmpty) {
    block.remove();
  }
}
