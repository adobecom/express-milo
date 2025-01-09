import {
  createTag,
  getMobileOperatingSystem, addTempWrapperDeprecated, getIconElementDeprecated,
} from '../../scripts/utils.js';
import { createFloatingButton } from '../../scripts/widgets/floating-cta.js';

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
  buttonWrapper.classList.add('multifunction', 'mobile-fork-button-frictionless');
  buildMobileGating(buttonWrapper.querySelector('.floating-button'), data);
  return buttonWrapper;
}

// frictionless block always check eligibility
function androidDeviceAndRamCheck() {
  const isAndroid = getMobileOperatingSystem() === 'Android';
  return navigator.deviceMemory >= 4 && isAndroid;
}

function collectFloatingButtonData(eligible) {
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
    const iconMetadata = (eligible && getMetadataLocal(`${prefix}-icon-frictionless`)) || getMetadataLocal(`${prefix}-icon`);
    const iconTextMetadata = (eligible && getMetadataLocal(`${prefix}-icon-text-frictionless`)) || getMetadataLocal(`${prefix}-icon-text`);
    const hrefMetadata = (eligible && getMetadataLocal(`${prefix}-link-frictionless`)) || getMetadataLocal(`${prefix}-link`);
    const textMetadata = (eligible && getMetadataLocal(`${prefix}-text-frictionless`)) || getMetadataLocal(`${prefix}-text`);
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
      if (href.toLowerCase().trim() === '#mobile-fqa-upload') {
        // mobile-fork-button-frictionless pairs with mobile-fqa
        // temporary solution before a nicer way for cross-block interactions is found
        aTag.addEventListener('click', (e) => {
          e.preventDefault();
          document.getElementById('mobile-fqa-upload').click();
        });
      }
      aTag.textContent = text;
      if (getTextWidth(text, 16) > LONG_TEXT_CUTOFF) {
        data.longText = true;
      }
      data.tools.push({
        icon,
        anchor: aTag,
        iconText,
      });
    }
  }

  return data;
}

export default async function decorate(block) {
  const eligible = androidDeviceAndRamCheck();
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
