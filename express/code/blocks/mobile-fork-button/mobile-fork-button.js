import { getLibs, getMobileOperatingSystem, getIconElementDeprecated, addTempWrapperDeprecated } from '../../scripts/utils.js';
import { createFloatingButton } from '../../scripts/widgets/floating-cta.js';

let createTag; let getMetadata;

const LONG_TEXT_CUTOFF = 70;

const getTextWidth = (text, font) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};

function buildAction(entry, buttonType) {
  const wrapper = createTag('div', { class: 'floating-button-inner-row mobile-gating-row' });
  const text = createTag('div', { class: 'mobile-gating-text' });
  text.textContent = entry?.iconText;
  const a = entry?.anchor;
  if (a) {
    a.classList.add(buttonType, 'button', 'mobile-gating-link');
    wrapper.append(entry?.icon || null, text, a);
  }
  return wrapper;
}

function buildMobileGating(block, data) {
  block.children[0].remove();
  const header = createTag('div', {
    class:
      'mobile-gating-header',
  });
  header.textContent = data.forkButtonHeader;
  block.append(header, buildAction(data.tools[0], 'accent'), buildAction(data.tools[1], 'outline'));
}

export async function createMultiFunctionButton(block, data, audience) {
  const buttonWrapper = await createFloatingButton(block, audience, data);
  buttonWrapper.classList.add('multifunction', 'mobile-fork-button');
  buildMobileGating(buttonWrapper.querySelector('.floating-button'), data);
  return buttonWrapper;
}

// Checks if the device is an android, enables the mobile gating if it is.
// If there is no metadata check enabled, still enable the gating block in case authors want it.

function androidCheck() {
  if (getMetadata('fork-eligibility-check')?.toLowerCase()?.trim() !== 'on') return true;
  return getMobileOperatingSystem() === 'Android';
}

function createMetadataMap() {
  return Array.from(document.head.querySelectorAll('meta')).reduce((acc, meta) => {
    if (meta?.name && !meta.property) acc[meta.name] = meta.content || '';
    return acc;
  }, {});
}

function createToolData(metadataMap, index) {
  const prefix = `fork-cta-${index}`;
  const iconMetadata = metadataMap[`${prefix}-icon`];
  const iconTextMetadata = metadataMap[`${prefix}-icon-text`];
  const hrefMetadata = metadataMap[`${prefix}-link`];
  const textMetadata = metadataMap[`${prefix}-text`];

  const iconElement = !iconMetadata || iconMetadata === 'null'
    ? createTag('div', { class: 'mobile-gating-icon-empty' })
    : getIconElementDeprecated(iconMetadata);

  const aTag = createTag('a', {
    title: textMetadata,
    href: hrefMetadata,
  });
  aTag.textContent = textMetadata;

  return {
    icon: iconElement,
    iconText: iconTextMetadata,
    anchor: aTag,
  };
}

function collectFloatingButtonData() {
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
    const toolData = createToolData(metadataMap, i);
    data.tools.push(toolData);
    if (getTextWidth(toolData.anchor.textContent, 16) > LONG_TEXT_CUTOFF) {
      data.longText = true;
    }
  }

  return data;
}

export default async function decorate(block) {
  ({ createTag, getMetadata } = await import(`${getLibs()}/utils/utils.js`));
  if (!androidCheck()) {
    const { default: decorateNormal } = await import('../floating-button/floating-button.js');
    decorateNormal(block);
    return;
  }
  addTempWrapperDeprecated(block, 'multifunction-button');
  if (!block.classList.contains('meta-powered')) return;

  const audience = block.querySelector(':scope > div').textContent.trim();
  if (audience === 'mobile') {
    block.closest('.section').remove();
  }
  const data = collectFloatingButtonData();
  const blockWrapper = await createMultiFunctionButton(block, data, audience);
  const blockLinks = blockWrapper.querySelectorAll('a');
  if (blockLinks && blockLinks.length > 0) {
    const linksPopulated = new CustomEvent('linkspopulated', { detail: blockLinks });
    document.dispatchEvent(linksPopulated);
  }
  if (data.longText) blockWrapper.classList.add('long-text');
}
