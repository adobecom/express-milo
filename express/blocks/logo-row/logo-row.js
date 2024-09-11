export default function decorate(block) {
  // Add class to the main block
  block.classList.add('block-layout');

  const row = block.children[0];
  row.classList.add('block-row');

  const [textColumn, imageColumn] = row.children;

  // Style text column
  textColumn.classList.add('text-column');

  // Style image column
  imageColumn.classList.add('image-column');

  // Add classes to all images
  imageColumn.querySelectorAll('img').forEach((img) => img.classList.add('brand-image'));
}
