import { getLibs, toClassName } from '../utils.js';

const { createTag, getConfig } = await import(`${getLibs()}/utils/utils.js`);

export function getIconDeprecated(icons, alt, size = 44) {
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

  if (symbols.includes(icon)) {
    const iconName = icon;
    let sheetSize = size;
    if (size22Icons.includes(icon)) sheetSize = 22;
    return `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-${icon}">
      ${alt ? `<title>${alt}</title>` : ''}
      <use href="/express/icons/ccx-sheet_${sheetSize}.svg#${iconName}${sheetSize}"></use>
    </svg>`;
  }
  return `<img class="icon icon-${icon}" src="/express/icons/${icon}.svg" alt="${
    alt || icon
  }">`;
}

export function getIconElementDeprecated(icons, size, alt, additionalClassName) {
  const div = createTag('div');
  div.innerHTML = getIconDeprecated(icons, alt, size);

  if (additionalClassName) {
    div.firstElementChild.classList.add(additionalClassName);
  }
  return div.firstElementChild;
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
  const placeholders = await import(`${getLibs()}/features/placeholders.js`);
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
        if (placeholders.replaceKey(icon, getConfig())) {
          altText = placeholders.replaceKey(icon, getConfig());
        } else if (placeholders.replaceKey(mobileIcon, getConfig())) {
          altText = placeholders.replaceKey(mobileIcon, getConfig());
        }
        const $picture = $img.closest('picture');
        const $block = $picture.closest('.block');
        let size = 44;
        if ($block) {
          const blockName = $block.getAttribute('data-block-name');
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
