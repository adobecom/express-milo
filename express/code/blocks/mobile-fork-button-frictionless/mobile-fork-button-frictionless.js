import {
  createTag,
  getMobileOperatingSystem,
  getLibs,
  addTempWrapperDeprecated,
  getIconElementDeprecated,
} from '../../scripts/utils.js';
import { createFloatingButton } from '../../scripts/widgets/floating-cta.js';
import { getTextWidth, LONG_TEXT_CUTOFF, createMetadataMap, createMultiFunctionButton, createToolData } from '../../scripts/utils/mobile-fork-button-utils.js';

function collectFloatingButtonData(eligible) {
  const metadataMap = createMetadataMap();
  const getMetadataLocal = (key) => metadataMap[key];
  const data = {
    scrollState: 'withLottie',
    showAppStoreBadge: ['on'].includes(getMetadataLocal('show-floating-cta-app-store-badge')?.toLowerCase()),
    toolsToStash: getMetadataLocal('ctas-above-divider'),
    delay: getMetadataLocal('floating-cta-drawer-delay') || 0,
    tools: [],
    mainCta: {
      desktopHref: getMetadataLocal('desktop-floating-cta-link'),
      desktopText: getMetadataLocal('desktop-floating-cta-text'),
      mobileHref: getMetadataLocal('mobile-floating-cta-link'),
      mobileText: getMetadataLocal('mobile-floating-cta-text'),
      href: getMetadataLocal('main-cta-link'),
      text: getMetadataLocal('main-cta-text'),
    },
    bubbleSheet: getMetadataLocal('floating-cta-bubble-sheet'),
    live: getMetadataLocal('floating-cta-live'),
    forkButtonHeader: getMetadataLocal('fork-button-header'),
  };

  for (let i = 1; i < 3; i += 1) {
    const toolData = createToolData(createTag, getIconElementDeprecated, metadataMap, i, eligible);
    if (toolData) {
      data.tools.push(toolData);
      if (getTextWidth(toolData.anchor.textContent, 16) > LONG_TEXT_CUTOFF) {
        data.longText = true;
      }
    }
  }
  return data;
}

export default async function decorate(block) {
  const { getMetadata } = await import(`${getLibs()}/utils/utils.js`);
  const eligible = getMetadata('frictionless-safari')?.toLowerCase() === 'on' || getMobileOperatingSystem() === 'Android'; // safari is frictionless-eligible too now
  addTempWrapperDeprecated(block, 'multifunction-button');
  if (!block.classList.contains('meta-powered')) return;

  const audience = block.querySelector(':scope > div').textContent.trim();
  if (audience === 'mobile') {
    block.closest('.section').remove();
  }

  const data = collectFloatingButtonData(eligible);
  const blockWrapper = await createMultiFunctionButton(
    createTag,
    createFloatingButton,
    block,
    data,
    audience,
    'mobile-fork-button-frictionless',
  );
  const blockLinks = blockWrapper.querySelectorAll('a');
  if (blockLinks && blockLinks.length > 0) {
    const linksPopulated = new CustomEvent('linkspopulated', { detail: blockLinks });
    document.dispatchEvent(linksPopulated);
  }
  if (data.longText) blockWrapper.classList.add('long-text');
}
