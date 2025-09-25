export default function decorate(block) {
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
          if (nextElement.tagName === 'P' && nextElement.textContent !== 'null' && nextElement.textContent !== null) {
            article.appendChild(nextElement);
            break;
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
