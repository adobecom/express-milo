import { getLibs, getLottie, lazyLoadLottiePlayer } from '../utils.js';
import { getIconElementDeprecated } from '../utils/icons.js';

let replaceKey;
let getConfig; let createTag; let
  getMetadata;
const placeholdersProm = import(`${getLibs()}/features/placeholders.js`).then((mod) => {
  ({ replaceKey } = mod);
});
const utilsProm = import(`${getLibs()}/utils/utils.js`).then((mod) => {
  ({ getConfig, createTag, getMetadata } = mod);
});
await Promise.all([placeholdersProm, utilsProm]);

const typeMap = {
  branded: [
    'free-plan-check-1',
    'free-plan-check-2',
  ],
  features: [
    'free-plan-features-1',
    'free-plan-check-2',
  ],
  entitled: [
    'entitled-plan-tag',
  ],
};

export async function buildFreePlanWidget(config) {
  const { typeKey, checkmarks } = config;
  const widget = createTag('div', { class: 'free-plan-widget' });

  typeMap[typeKey].forEach((tagKey) => {
    replaceKey(tagKey, getConfig()).then((tagText) => {
      if (tagText) {
        const textDiv = createTag('span', { class: 'plan-widget-tag' });
        textDiv.textContent = tagText;
        widget.append(textDiv);

        if (checkmarks) {
          textDiv.prepend(getIconElementDeprecated('checkmark'));
        }
      }
    });
  });

  return widget;
}

export async function addFreePlanWidget(elem) {
  const freePlanMeta = getMetadata('show-free-plan').toLowerCase();

  if (!freePlanMeta || ['no', 'false', 'n', 'off'].includes(freePlanMeta)) return;
  let widget;

  if (elem && ['yes', 'true', 'y', 'on', 'branded'].includes(freePlanMeta)) {
    widget = await buildFreePlanWidget({ typeKey: 'branded' });
  }

  if (elem && ['features'].includes(freePlanMeta)) {
    widget = await buildFreePlanWidget({ typeKey: 'features' });
  }

  if (elem && ['entitled'].includes(freePlanMeta)) {
    widget = await buildFreePlanWidget({ typeKey: 'entitled' });
  }

  document.addEventListener('planscomparisonloaded', async () => {
    const learnMoreButton = createTag('a', {
      class: 'learn-more-button',
      href: '#plans-comparison-container',
    });
    const lottieWrapper = createTag('span', { class: 'lottie-wrapper' });

    learnMoreButton.textContent = await replaceKey('learn-more', getConfig());
    lottieWrapper.innerHTML = getLottie('purple-arrows', '/express/icons/purple-arrows.json');
    learnMoreButton.append(lottieWrapper);
    lazyLoadLottiePlayer();
    widget.append(learnMoreButton);

    learnMoreButton.addEventListener('click', (e) => {
      e.preventDefault();
      // temporarily disabling smooth scroll for accurate location
      const html = document.querySelector('html');
      html.style.scrollBehavior = 'unset';
      const $plansComparison = document.querySelector('.plans-comparison-container');
      $plansComparison.scrollIntoView();
      html.style.removeProperty('scroll-behavior');
    });
  });

  elem.append(widget);
  elem.classList.add('free-plan-container');
}
