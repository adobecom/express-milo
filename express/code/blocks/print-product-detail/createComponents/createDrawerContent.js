import { getLibs, getIconElementDeprecated } from '../../../scripts/utils.js';
import createMiniPillOptionsSelector from './customizationInputs/createMiniPillOptionsSelector.js';

let createTag;

export async function closeDrawer() {
  const curtain = document.querySelector('.pdp-curtain');
  const drawer = document.querySelector('.drawer');
  curtain.classList.add('hidden');
  drawer.classList.add('hidden');
  document.body.classList.remove('disable-scroll');
}

export function createDrawerHead(drawerLabel) {
  const drawerHead = createTag('div', { class: 'drawer-head' });
  const closeButton = createTag('button', { 'aria-label': 'close' }, getIconElementDeprecated('close-black')); // TODO: analytics
  closeButton.addEventListener('click', closeDrawer);
  drawerHead.append(createTag('div', { class: 'drawer-head-label' }, drawerLabel), closeButton);
  return drawerHead;
}

function createDrawerFoot({ imgSrc, name, price }) {
  const drawerFoot = createTag('div', { class: 'drawer-foot' });
  const selectButton = createTag('button', { class: 'select' }, 'Select');
  const infoContainer = createTag('div', { class: 'info-container' });
  const infoText = createTag('div', { class: 'info-text' });
  infoText.append(createTag('div', { class: 'info-name' }, name));
  infoText.append(createTag('div', { class: 'info-price' }, price));
  infoContainer.append(createTag('img', { src: imgSrc, alt: name }), infoText);
  drawerFoot.append(infoContainer, selectButton);
  return drawerFoot;
}

export default async function createDrawerContentSizeChart(productDetails) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const sizeChartContainer = createTag('div', { class: 'pdpx-size-chart-container' });
  const sizeChartTitle = createTag('h2', { class: 'pdpx-size-chart-title' }, 'Size Chart');
  sizeChartContainer.appendChild(sizeChartTitle);
  return sizeChartContainer;
}

export async function createDrawerContentPrintingProcess(productDetails) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const printingProcessContainer = createTag('div', { class: 'pdpx-printing-process-container' });
  const printingProcessTitle = createTag('h2', { class: 'pdpx-printing-process-title' }, 'Printing Process');
  printingProcessContainer.appendChild(printingProcessTitle);
  return printingProcessContainer;
}

export async function createDrawerContentPaperType(customizationOptions, labelText, hiddenSelectInputName, CTALinkText, productId, defaultValue, drawerType, drawer) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const paperTypeContainer = drawer;
  const drawerHead = createDrawerHead('Paper Type');
  const drawerBody = createTag('div', { class: 'drawer-body' });
  const defaultValueSafe = defaultValue || customizationOptions[0].name;
  const defaultValueOption = customizationOptions.find((option) => option.name === defaultValueSafe);
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
  const paperTypeSelectorContainer = await createMiniPillOptionsSelector(customizationOptions, labelText, hiddenSelectInputName, null, productId, defaultValue, drawerType);
  const description = createTag('div', { class: 'pdpx-drawer-description' }, defaultValueOption.description);
  const drawerFoot = createTag('div', { class: 'drawer-foot' });
  const infoContainer = createTag('div', { class: 'pdpx-drawer-foot-info-container' });
  const infoText = createTag('div', { class: 'pdpx-drawer-foot-info-text' });
  infoText.append(createTag('div', { class: 'pdpx-drawer-foot-info-name' }, defaultValueOption.title));
  infoText.append(createTag('div', { class: 'pdpx-drawer-foot-info-price' }, defaultValueOption.priceAdjustment));
  infoContainer.append(createTag('img', { src: defaultValueOption.thumbnail, alt: heroImageAlt }), infoText);
  drawerFoot.appendChild(infoContainer);
  const selectButton = createTag('button', { class: 'pdpx-drawer-foot-select-button' }, 'Select');
  drawerFoot.appendChild(selectButton);

  paperTypeContainer.appendChild(drawerHead);
  drawerBody.appendChild(heroImageContainer);
  drawerBody.appendChild(titleRow);
  drawerBody.appendChild(pillsContainer);
  drawerBody.appendChild(paperTypeSelectorContainer);
  drawerBody.appendChild(description);
  paperTypeContainer.appendChild(drawerBody);
  paperTypeContainer.appendChild(drawerFoot);
  return paperTypeContainer;
}
