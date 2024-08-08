import { addTempWrapperDeprecated } from '../../scripts/utils/decorate.js';
import {
  createFloatingButton,
  collectFloatingButtonData,
} from '../../scripts/widgets/floating-cta.js';
import { formatDynamicCartLink } from '../../scripts/utils/pricing.js';

export default function decorate(block) {
  addTempWrapperDeprecated(block, 'floating-button');
  if (!block.classList.contains('metadata-powered')) {
    block.parentElement?.remove();
    return;
  }

  const audience = block.querySelector(':scope > div').textContent.trim();
  if (audience === 'mobile') {
    block.closest('.section')?.remove();
  }

  const parentSection = block.closest('.section');
  const data = collectFloatingButtonData(block);

  const blockWrapper = createFloatingButton(
    block,
    parentSection ? audience : null,
    data,
  );

  const blockLinks = blockWrapper.querySelectorAll('a');
  if (blockLinks && blockLinks.length > 0) {
    formatDynamicCartLink(blockLinks[0]);
    const linksPopulated = new CustomEvent('linkspopulated', { detail: blockLinks });
    document.dispatchEvent(linksPopulated);
  }
}
