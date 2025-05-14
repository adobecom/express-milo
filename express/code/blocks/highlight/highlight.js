export default async function decorate(block) {
  const rows = Array.from(block.children);

  rows.slice(0).forEach((row) => {
    row.classList.add('icon-row');

    row.setAttribute('role', 'listitem');

    const textDiv = row.children[1];
    if (textDiv) {
      textDiv.classList.add('text');
      const textContent = textDiv.textContent.trim();

      row.setAttribute('aria-label', textContent);

      const img = row.querySelector('img');
      if (img) {
        img.setAttribute('alt', textContent);
      }
    }

    block.appendChild(row);
  });

  block.setAttribute('role', 'list');
}
