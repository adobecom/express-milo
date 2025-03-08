import { getLibs, getMobileOperatingSystem, getIconElementDeprecated, addTempWrapperDeprecated } from '../../../utils.js';
import { createFloatingButton } from '../../../widgets/floating-cta.js';

// import { getLibs, getMobileOperatingSystem, getIconElementDeprecated, addTempWrapperDeprecated } 
// from '../../scripts/utils.js';
// import { createFloatingButton } from '../../scripts/widgets/floating-cta.js';

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

function collectFloatingButtonData() {
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
      forkStickyMobileHref: getMetadataLocal('cta-1-link'),
      forkStickyMobileText: getMetadataLocal('cta-1-text'),
    },
    bubbleSheet: getMetadataLocal('floating-cta-bubble-sheet'),
    live: getMetadataLocal('floating-cta-live'),
    forkButtonHeader: getMetadataLocal('fork-button-header'),
  };

  for (let i = 1; i < 3; i += 1) {
    const prefix = `fork-cta-${i}`;
    const iconMetadata = getMetadataLocal(`${prefix}-icon`);
    const iconTextMetadata = getMetadataLocal(`${prefix}-icon-text`);
    const hrefMetadata = getMetadataLocal(`${prefix}-link`);
    const textMetadata = getMetadataLocal(`${prefix}-text`);
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

async function mWebStickyCTA() {
  const blockHTML = `
    <div class="section" data-status="decorated" data-idx="8">
      <div class="floating-button-wrapper">
        <div class="floating-button meta-powered">
          <div>mobile</div>
        </div>
      </div>
    </div>`;
  const block = document.querySelector('.mobile-fork-button');
  block.outerHTML = blockHTML;

  const audience = 'mobile';
  const data = collectFloatingButtonData();

  data.mainCta.text = data.mainCta.forkStickyMobileText ? data.mainCta.forkStickyMobileText : data.mainCta.text;
  data.mainCta.href = data.mainCta.forkStickyMobileHref ? data.mainCta.forkStickyMobileHref : data.mainCta.href;
  const buttonWrapper = await createFloatingButton(block, audience, data);
}

function mWebOverlayScroll() {
  const mobileForkButton = document.querySelector('.mobile-fork-button');
  if (mobileForkButton && mobileForkButton.classList.contains('mweb-mobile-fork')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

function mWebBuildElements() {
  const mobileForkButton = document.querySelector('.mobile-fork-button');
  mobileForkButton.classList.add('mweb-mobile-fork');

  const closeElement = document.createElement('a');
  closeElement.classList.add('mweb-close');
  closeElement.innerHTML =`
    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.45455 5.99986L12.1404 1.31442C12.4041 1.05075 12.4041 0.623598 12.1404 0.359925C11.8767 0.0962522 11.4496 0.0962522 11.1859 0.359925L6.5 5.04537L1.81412 0.359925C1.55044 0.0962522 1.12329 0.0962522 0.85962 0.359925C0.595947 0.623598 0.595947 1.05075 0.85962 1.31442L5.54545 5.99986L0.85962 10.6853C0.595947 10.949 0.595947 11.3761 0.85962 11.6398C0.991452 11.7716 1.16416 11.8376 1.33686 11.8376C1.50956 11.8376 1.68227 11.7716 1.81411 11.6398L6.49999 6.95436L11.1859 11.6398C11.3177 11.7716 11.4904 11.8376 11.6631 11.8376C11.8358 11.8376 12.0085 11.7716 12.1404 11.6398C12.404 11.3761 12.404 10.949 12.1404 10.6853L7.45455 5.99986Z" fill="#292929"/>
    </svg>`;
  mobileForkButton.querySelector('div:first-child').prepend(closeElement);
}

function mWebCloseEvents() {
  const closeElements = document.querySelectorAll('.mweb-mobile-fork a[title="Continue"], .mweb-mobile-fork a.mweb-close');
  closeElements.forEach(element => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      mWebOverlayScroll();
      mWebStickyCTA();
    });
  });
}

function mWebVariant() {
  if(!getMetadata('cta-1-icon') && !getMetadata('cta-1-link')) return;
  mWebBuildElements();
  mWebCloseEvents();
  mWebOverlayScroll();
}

export default async function decorate(block) {
  ({ createTag, getMetadata } = await import(`${getLibs()}/utils/utils.js`));
  if (!androidDeviceAndRamCheck()) {
    const { default: decorateNormal } = await import('../../../../blocks/floating-button/floating-button.js');
    // const { default: decorateNormal } = await import('../floating-button/floating-button.js');
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

  mWebVariant();
}

