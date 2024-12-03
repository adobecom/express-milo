import { getLibs, toClassName, createTag } from '../utils.js';

function sanitizeInput(input) {
  if (Number.isInteger(input)) return input;
  return input.replace(/[^a-zA-Z0-9-_]/g, ''); // Simple regex to strip out potentially dangerous characters
}

function createSVGWrapper(icon, sheetSize, alt, altSrc) {
  const svgWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgWrapper.classList.add('icon');
  svgWrapper.classList.add(`icon-${icon}`);
  svgWrapper.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/1999/xlink');
  if (alt) {
    svgWrapper.appendChild(createTag('title', { innerText: alt }));
  }
  const u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  if (altSrc) {
    u.setAttribute('href', altSrc);
  } else {
    u.setAttribute('href', `/express/icons/ccx-sheet_${sanitizeInput(sheetSize)}.svg#${sanitizeInput(icon)}${sanitizeInput(sheetSize)}`);
  }
  svgWrapper.appendChild(u);
  return svgWrapper;
}

// eslint-disable-next-line default-param-last
export function getIconDeprecated(icons, alt, size = 44, altSrc) {
  // eslint-disable-next-line no-param-reassign
  icons = Array.isArray(icons) ? icons : [icons];
  const [defaultIcon, mobileIcon] = icons;
  const icon = mobileIcon && window.innerWidth < 600 ? mobileIcon : defaultIcon;
  const symbols = [
    'adobefonts',
    'adobe-stock',
    'android',
    'animation',
    'blank',
    'brand',
    'brand-libraries',
    'brandswitch',
    'calendar',
    'certified',
    'color-how-to-icon',
    'changespeed',
    'check',
    'chevron',
    'cloud-storage',
    'crop-image',
    'crop-video',
    'convert',
    'convert-png-jpg',
    'cursor-browser',
    'desktop',
    'desktop-round',
    'download',
    'elements',
    'facebook',
    'globe',
    'incredibly-easy',
    'instagram',
    'image',
    'ios',
    'libraries',
    'library',
    'linkedin',
    'magicwand',
    'mergevideo',
    'mobile-round',
    'muteaudio',
    'palette',
    'photos',
    'photoeffects',
    'pinterest',
    'play',
    'premium-templates',
    'pricingfree',
    'pricingpremium',
    'privacy',
    'qr-code',
    'remove-background',
    'resize',
    'resize-video',
    'reversevideo',
    'rush',
    'snapchat',
    'sparkpage',
    'sparkvideo',
    'stickers',
    'templates',
    'text',
    'tiktok',
    'trim-video',
    'twitter',
    'up-download',
    'upload',
    'users',
    'webmobile',
    'youtube',
    'star',
    'star-half',
    'star-empty',
    'pricing-gen-ai',
    'pricing-features',
    'pricing-import',
    'pricing-motion',
    'pricing-stock',
    'pricing-one-click',
    'pricing-collaborate',
    'pricing-premium-plan',
    'pricing-sync',
    'pricing-brand',
    'pricing-calendar',
    'pricing-fonts',
    'pricing-libraries',
    'pricing-cloud',
    'pricing-support',
    'pricing-sharing',
    'pricing-history',
    'pricing-corporate',
    'pricing-admin',
  ];

  const size22Icons = ['chevron', 'pricingfree', 'pricingpremium'];

  if (symbols.includes(icon) || altSrc) {
    let sheetSize = size;
    if (size22Icons.includes(icon)) sheetSize = 22;
    return createSVGWrapper(icon, sheetSize, alt, altSrc);
  }
  return createTag('img', {
    class: `icon icon-${icon}`,
    src: altSrc || `/express/icons/${icon}.svg`,
    alt: `${alt || icon}`,
  });
}

export function getIconElementDeprecated(icons, size, alt, additionalClassName, altSrc) {
  const icon = getIconDeprecated(icons, alt, size, altSrc);
  if (additionalClassName) icon.classList.add(additionalClassName);
  return icon;
}

/**
 * Icon loader using altText
 * @param {Object} el the container of the buttons to be decorated
 */

export async function fixIcons(el = document) {
  /* backwards compatible icon handling, deprecated */
  el.querySelectorAll('svg use[href^="./_icons_"]').forEach(($use) => {
    $use.setAttribute('href', `/express/icons.svg#${$use.getAttribute('href').split('#')[1]}`);
  });

  let replaceKey;
  let getConfig;
  await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]).then(([utils, placeholders]) => {
    ({ getConfig } = utils);
    ({ replaceKey } = placeholders);
  });
  /* new icons handling */
  el.querySelectorAll('img').forEach(($img) => {
    const alt = $img.getAttribute('alt');
    if (alt) {
      const lowerAlt = alt.toLowerCase();
      if (lowerAlt.includes('icon:')) {
        const [icon, mobileIcon] = lowerAlt
          .split(';')
          .map((i) => {
            if (i) {
              return toClassName(i.split(':')[1].trim());
            }
            return null;
          });
        let altText = null;
        if (replaceKey(icon, getConfig())) {
          altText = replaceKey(icon, getConfig());
        } else if (replaceKey(mobileIcon, getConfig())) {
          altText = replaceKey(mobileIcon, getConfig());
        }
        const $picture = $img.closest('picture');
        const $block = $picture.closest('.section > div');
        let size = 44;
        if ($block) {
          const blockName = $block.classList[0];
          // use small icons in .columns (except for .columns.offer)
          if (blockName === 'columns') {
            size = $block.classList.contains('offer') ? 44 : 22;
          } else if (blockName === 'toc') {
            // ToC block has its own logic
            return;
          }
        }
        $picture.parentElement
          .replaceChild(getIconElementDeprecated([icon, mobileIcon], size, altText), $picture);
      }
    }
  });
}

export function decorateSocialIcons(block) {
  block.querySelectorAll(':scope a').forEach(($a) => {
    if (!$a.href) return;
    const urlObject = new URL($a.href);
    if (urlObject.hash === '#embed-video') return;
    if ($a.closest('.embed')?.dataset.blockName === 'embed') return;
    if ($a.href === $a.textContent.trim()) {
      let icon = '';
      switch (urlObject.hostname) {
        case 'www.instagram.com':
          icon = 'instagram';
          break;
        case 'www.twitter.com':
          icon = 'twitter';
          break;
        case 'www.linkedin.com':
          icon = 'linkedin';
          break;
        case 'www.youtube.com':
          icon = 'youtube';
          break;
        case 'www.tiktok.com':
          icon = 'tiktok';
          break;
        default: {
          const secondLevelDomain = urlObject.hostname.split('.')[1];
          if (secondLevelDomain === 'pinterest') {
            icon = 'pinterest';
          } else if (secondLevelDomain === 'facebook') {
            icon = 'facebook';
          }
        }
      }
      const $parent = $a.parentElement;
      if (!icon && $parent.previousElementSibling && $parent.previousElementSibling.classList.contains('social-links')) {
        icon = 'globe';
      }
      if (icon) {
        $a.textContent = '';
        const $icon = getIconElementDeprecated(icon, 22);
        $icon.classList.add('social', 'is-visible');
        $a.appendChild($icon);
        $a.classList.add('social-link');
        if ($parent.previousElementSibling && $parent.previousElementSibling.classList.contains('social-links')) {
          $parent.previousElementSibling.appendChild($a);
          $parent.remove();
        } else {
          $parent.classList.add('social-links');
        }
      }
    }
  });
}
