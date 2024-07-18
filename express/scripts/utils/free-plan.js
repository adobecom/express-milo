import {
  fetchPlaceholders,
  createTag,
  getMetadata,
  getIconElement,
} from '../utils.js';

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
  const placeholders = await fetchPlaceholders();
  const widget = createTag('div', { class: 'free-plan-widget' });

  typeMap[typeKey].forEach((tagKey) => {
    const tagText = placeholders[tagKey];

    if (tagText) {
      const textDiv = createTag('span', { class: 'plan-widget-tag' });
      textDiv.textContent = tagText;
      widget.append(textDiv);

      if (checkmarks) {
        textDiv.prepend(getIconElement('checkmark'));
      }
    }
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

  elem.append(widget);
  elem.classList.add('free-plan-container');
}
