import {
  createTag,
  getMobileOperatingSystem,
  getLibs,
  addTempWrapperDeprecated,
  getIconElementDeprecated,
} from '../../scripts/utils.js';
import { createFloatingButton } from '../../scripts/widgets/floating-cta.js';
import { getTextWidth, LONG_TEXT_CUTOFF, createMetadataMap, buildMobileGating } from '../../scripts/utils/mobile-fork-button-utils.js';

export async function createMultiFunctionButton(block, data, audience) {
  const buttonWrapper = await createFloatingButton(block, audience, data);
  buttonWrapper.classList.add('multifunction', 'mobile-fork-button-frictionless');
  buildMobileGating(createTag, buttonWrapper.querySelector('.floating-button'), data);
  return buttonWrapper;
}

function createToolData(metadataMap, index, eligible) {
  const prefix = `fork-cta-${index}`;
  const iconMetadata = (eligible && metadataMap[`${prefix}-icon-frictionless`]) || metadataMap[`${prefix}-icon`];
  const iconTextMetadata = (eligible && metadataMap[`${prefix}-icon-text-frictionless`]) || metadataMap[`${prefix}-icon-text`];
  const hrefMetadata = (eligible && metadataMap[`${prefix}-link-frictionless`]) || metadataMap[`${prefix}-link`] || '';
  const textMetadata = (eligible && metadataMap[`${prefix}-text-frictionless`]) || metadataMap[`${prefix}-text`] || '';

  const iconElement = !iconMetadata || iconMetadata === 'null'
    ? createTag('div', { class: 'mobile-gating-icon-empty' })
    : getIconElementDeprecated(iconMetadata);

  const aTag = createTag('a', { title: textMetadata, href: hrefMetadata });
  if (hrefMetadata.toLowerCase().trim() === '#mobile-fqa-upload') {
    aTag.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('mobile-fqa-upload').click();
    });
  }
  aTag.textContent = textMetadata;

  return {
    icon: iconElement,
    anchor: aTag,
    iconText: iconTextMetadata || '',
  };
}

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
    const toolData = createToolData(metadataMap, i, eligible);
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
  const blockWrapper = await createMultiFunctionButton(block, data, audience);
  const blockLinks = blockWrapper.querySelectorAll('a');
  if (blockLinks && blockLinks.length > 0) {
    const linksPopulated = new CustomEvent('linkspopulated', { detail: blockLinks });
    document.dispatchEvent(linksPopulated);
  }
  if (data.longText) blockWrapper.classList.add('long-text');
}
