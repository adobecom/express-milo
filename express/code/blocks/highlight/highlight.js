export default async function decorate(block) {
  const rows = Array.from(block.children);

  rows.slice(0).forEach((row) => {
    row.classList.add('icon-row');
    const textDiv = row.children[1];
    if (textDiv) textDiv.classList.add('text');
    block.appendChild(row);
  });
}
