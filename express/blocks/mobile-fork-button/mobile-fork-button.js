import { getLibs } from '../../scripts/utils.js';
import { createFloatingButton } from '../../scripts/widgets/floating-cta.js';
import { getIconElementDeprecated } from '../../scripts/utils/icons.js';
import { addTempWrapperDeprecated } from '../../scripts/utils/decorate.js';
import { getMobileOperatingSystem } from '../../scripts/utils/media.js';

let createTag; let getMetadata;

function buildAction(entry, buttonType) {
  const wrapper = createTag('div', { class: 'floating-button-inner-row mobile-gating-row' });
  const text = createTag('div', { class: 'mobile-gating-text' });
  text.textContent = entry.iconText;
  const a = entry.anchor;
  a.classList.add(buttonType, 'button', 'mobile-gating-link');
  wrapper.append(entry.icon, text, a);
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

// Checks if the device is an android and has sufficient RAM, enables the mobile gating if it is.
// If there is no metadata check enabled, still enable the gating block in case authors want it.

function androidDeviceAndRamCheck() {
  if (getMetadata('fork-eligibility-check')?.toLowerCase()?.trim() !== 'on') return true;
  const isAndroid = getMobileOperatingSystem() === 'Android';
  return navigator.deviceMemory >= 4 && isAndroid;
}

function collectFloatingButtonData(fallback) {
  const metadataMap = Array.from(document.head.querySelectorAll('meta')).reduce((acc, meta) => {
    if (meta?.name && !meta.property) acc[meta.name] = meta.content || '';
    return acc;
  }, {});
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
    const prefix = `fork-cta-${i}`;
    const iconMetadata = (fallback && getMetadataLocal(`${prefix}-icon-${fallback}`)) || getMetadataLocal(`${prefix}-icon`);
    const iconTextMetadata = (fallback && getMetadataLocal(`${prefix}-icon-text-${fallback}`)) || getMetadataLocal(`${prefix}-icon-text`);
    const hrefMetadata = (fallback && getMetadataLocal(`${prefix}-link-${fallback}`)) || getMetadataLocal(`${prefix}-link`);
    const textMetadata = (fallback && getMetadataLocal(`${prefix}-text-${fallback}`)) || getMetadataLocal(`${prefix}-text`);
    if (!iconMetadata) break;
    const completeSet = {
      icon: getIconElementDeprecated(iconMetadata),
      iconText: iconTextMetadata,
      href: hrefMetadata,
      text: textMetadata,
    };

    if (Object.values(completeSet).every((val) => !!val)) {
      const {
        href, text, icon, iconText,
      } = completeSet;
      const aTag = createTag('a', { title: text, href });
      aTag.textContent = text;
      data.tools.push({
        icon,
        anchor: aTag,
        iconText,
      });
    }
  }

  return data;
}

/**
 * Returns null if no fallback needed. Otherwise a string for strategy.
 * @returns {string|null}
 */
function useFallback() {
  if (androidDeviceAndRamCheck()) return null;
  return getMetadata('fallback-strategy')?.toLowerCase()?.trim() || 'single';
}

export default async function decorate(block) {
  ({ createTag, getMetadata } = await import(`${getLibs()}/utils/utils.js`));
  const fallback = useFallback();
  if (fallback === 'single') {
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

  const data = collectFloatingButtonData(fallback);
  const blockWrapper = await createMultiFunctionButton(block, data, audience);
  const blockLinks = blockWrapper.querySelectorAll('a');
  if (blockLinks && blockLinks.length > 0) {
    const linksPopulated = new CustomEvent('linkspopulated', { detail: blockLinks });
    document.dispatchEvent(linksPopulated);
  }
}
