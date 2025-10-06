export default function extractProductId(block) {
  return block.children[0].children[1].textContent;
}
