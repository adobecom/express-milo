import { addTempWrapperDeprecated } from '../../scripts/utils.js';
import {
  createFloatingButton,
  collectFloatingButtonData,
} from '../../scripts/widgets/floating-cta.js';
import { formatDynamicCartLink } from '../../scripts/utils/pricing.js';

export default async function decorate(block) {
  addTempWrapperDeprecated(block, 'floating-button');
  console.log(block);
  if (!block.classList.contains('meta-powered')) {
    block.parentElement?.remove();
    return;
  }
  console.log(block);

  const audience = block.querySelector(':scope > div').textContent.trim();
  if (audience === 'mobile') {
    block.closest('.section')?.remove();
  }

  const parentSection = block.closest('.section');
  const data = collectFloatingButtonData();

  const blockWrapper = await createFloatingButton(
    block,
    parentSection ? audience : null,
    data,
  );

  console.log(blockWrapper);

  const blockLinks = blockWrapper.querySelectorAll('a');
  if (blockLinks && blockLinks.length > 0) {
    formatDynamicCartLink(blockLinks[0]);
    const linksPopulated = new CustomEvent('linkspopulated', { detail: blockLinks });
    document.dispatchEvent(linksPopulated);
  }
}
