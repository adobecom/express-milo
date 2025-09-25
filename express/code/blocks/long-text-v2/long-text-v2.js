export default function decorate(block) {
  if (block.classList.contains('plain')) {
    block.classList.add('plain');
  }

  // Restructure DOM: group h2 + p pairs into flex containers
  const h2Elements = block.querySelectorAll('h2');

  if (h2Elements.length > 0) {
    // Get all h2 and p elements from anywhere in the block
    const allContentElements = Array.from(block.querySelectorAll('h2, p'));

    // Clear the block content
    block.innerHTML = '';

    // Process elements in order
    let i = 0;
    while (i < allContentElements.length) {
      const element = allContentElements[i];

      if (element.tagName === 'H2') {
        // Create semantic article container for h2 + p pair
        const article = document.createElement('article');
        article.classList.add('long-text-v2-item');

        // Add the h2
        article.appendChild(element);

        // Look for the next paragraph
        i += 1;
        while (i < allContentElements.length && allContentElements[i].tagName !== 'P') {
          i += 1;
        }

        if (i < allContentElements.length && allContentElements[i].tagName === 'P') {
          const pElement = allContentElements[i];
          // Remove null paragraphs
          if (pElement.textContent === 'null' || pElement.textContent === null) {
            // Skip null paragraphs
          } else {
            article.appendChild(pElement);
          }
          i += 1;
        }

        // Add article to block
        block.appendChild(article);
      } else {
        i += 1;
      }
    }
  }

  // Check if block is empty after restructuring
  const isEmpty = block.textContent.trim() === '' || block.children.length === 0;

  if (isEmpty) {
    block.remove();
  }
}
