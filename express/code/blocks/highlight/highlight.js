export default async function decorate(block) {
  const rows = Array.from(block.children);

  rows.slice(0).forEach((row) => {
    row.classList.add('icon-row');
    row.setAttribute('role', 'listitem');

    const textDiv = row.children[1];
    if (textDiv) {
      // Create an h3 element
      const h3 = document.createElement('h3');
      h3.classList.add('text');
      h3.textContent = textDiv.textContent.trim();
      h3.setAttribute('aria-label', h3.textContent);
      h3.setAttribute('tabindex', '0');
      textDiv.replaceWith(h3);

      const img = row.querySelector('img');
      if (img) {
        img.setAttribute('role', 'presentation');
      }
    }

    block.appendChild(row);
  });

  block.setAttribute('role', 'list');
}
