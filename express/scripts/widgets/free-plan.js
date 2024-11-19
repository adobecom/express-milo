import { getLibs } from '../utils.js';
import { getIconElementDeprecated } from '../utils/icons.js';

let replaceKey;
let getConfig; let createTag;
let getMetadata;
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
  const noSignupRequired = getMetadata('no-signup-required');

  const promises = [];
  for (let i = 0; i < typeMap[typeKey].length; i += 1) {
    promises.push(replaceKey(typeMap[typeKey][i], getConfig()));
  }

  const texts = await Promise.all(promises);
  const freePlanCheck3 = await replaceKey('free-plan-check-3', getConfig());

  for (let i = 0; i < texts.length; i += 1) {
    if (noSignupRequired && texts[i] === 'free-plan-check-2') {
      texts[i] = freePlanCheck3;
    }
    if (texts[i]) {
      const textDiv = createTag('span', { class: 'plan-widget-tag' });
      textDiv.textContent = texts[i];
      widget.append(textDiv);

      if (checkmarks) {
        textDiv.prepend(getIconElementDeprecated('checkmark'));
      }
    }
  }

  return widget;
}

export async function addFreePlanWidget(elem) {
  const freePlanMeta = getMetadata('show-free-plan')?.toLowerCase();

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

  elem.append(widget);
  elem.classList.add('free-plan-container');
}
