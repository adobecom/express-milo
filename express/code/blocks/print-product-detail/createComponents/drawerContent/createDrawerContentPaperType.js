import { getLibs, getIconElementDeprecated } from '../../../../scripts/utils.js';
import createMiniPillOptionsSelector from '../customizationInputs/createMiniPillOptionsSelector.js';
import { createDrawerHead, closeDrawer } from './createDrawerContent.js';

let createTag;

export default async function createDrawerContentPaperType(
  customizationOptions,
  labelText,
  hiddenSelectInputName,
  CTALinkText,
  productDetails,
  defaultValue,
  drawerType,
  drawerContainer,
) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const drawerHead = createDrawerHead('Select Paper Type');
  const drawerBody = createTag('div', { class: 'drawer-body' });
  const defaultValueSafe = defaultValue || customizationOptions[0].name;
  const defaultValueOption = customizationOptions.find(
    (option) => option.name === defaultValueSafe,
  );
  const defaultValueImageSrc = new URL(defaultValueOption.thumbnail);
  defaultValueImageSrc.searchParams.set('max_dim', '1000');
  const defaultValueImageSrcLarge = defaultValueImageSrc.toString();
  const heroImageAlt = '';
  const heroImageContainer = createTag('div', { class: 'pdpx-drawer-hero-image-container' });
  const heroImage = createTag('img', { class: 'pdpx-drawer-hero-image', src: defaultValueImageSrcLarge, alt: heroImageAlt });
  heroImageContainer.appendChild(heroImage);
  const titleRow = createTag('div', { class: 'pdpx-drawer-title-row' });
  const drawerTitle = createTag('span', { class: 'pdpx-drawer-title' }, defaultValueOption.title);
  titleRow.appendChild(drawerTitle);
  if (defaultValueSafe === '175ptmatte') {
    const recommendedBadge = createTag('span', { class: 'pdpx-recommended-badge' }, 'Recommended');
    titleRow.appendChild(recommendedBadge);
  }
  const pillsContainer = createTag('div', { class: 'pdpx-drawer-pills-container' });
  const specs = [
    defaultValueOption.thickness,
    defaultValueOption.weight,
    defaultValueOption.gsm,
  ].filter(Boolean);
  specs.forEach((spec) => {
    const pill = createTag('div', { class: 'pdpx-drawer-pill' });
    const pillIcon = getIconElementDeprecated('circle-check-mark');
    const pillText = createTag('span', { class: 'pdpx-drawer-pill-text' }, spec);
    pill.append(pillIcon, pillText);
    pillsContainer.appendChild(pill);
  });
  const paperTypeSelectorContainer = await createMiniPillOptionsSelector(
    customizationOptions,
    labelText,
    hiddenSelectInputName,
    null,
    productDetails,
    defaultValue,
    drawerType,
  );
  const description = createTag('div', { class: 'pdpx-drawer-description' }, defaultValueOption.description);
  const drawerFoot = createTag('div', { class: 'drawer-foot' });
  const infoContainer = createTag('div', { class: 'pdpx-drawer-foot-info-container' });
  const infoText = createTag('div', { class: 'pdpx-drawer-foot-info-text' });
  infoText.append(createTag('div', { class: 'pdpx-drawer-foot-info-name' }, defaultValueOption.title));
  infoText.append(createTag('div', { class: 'pdpx-drawer-foot-info-price' }, defaultValueOption.priceAdjustment));
  infoContainer.append(createTag('img', { src: defaultValueOption.thumbnail, alt: heroImageAlt }), infoText);
  drawerFoot.appendChild(infoContainer);
  const selectButton = createTag('button', { class: 'pdpx-drawer-foot-select-button' }, 'Select');
  selectButton.addEventListener('click', async () => {
    closeDrawer();
  });
  drawerFoot.appendChild(selectButton);
  drawerContainer.appendChild(drawerHead);
  drawerBody.appendChild(heroImageContainer);
  drawerBody.appendChild(titleRow);
  drawerBody.appendChild(pillsContainer);
  drawerBody.appendChild(paperTypeSelectorContainer);
  drawerBody.appendChild(description);
  drawerContainer.appendChild(drawerBody);
  drawerContainer.appendChild(drawerFoot);
}
