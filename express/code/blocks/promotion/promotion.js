/**
 * This block has been deprecated and removed.
 * Unfortunately, it was not possible to remove the block from the
 * authoring side entirely, so this code is left here to ensure
 * we remove the DOM
 */
export default async function decorate($block) {
  $block?.remove();
}
