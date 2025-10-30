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

function createDrawerBody({ name, recommended, labels, imgSrc, description }) {
  const drawerBody = createTag('div', { class: 'drawer-body' });
  drawerBody.append(createTag('img', { class: 'hero', src: imgSrc, alt: name }));
  const titleRow = createTag('div', { class: 'title-row' });
  const recommendTag = createTag('span', { class: ['recommended', recommended ? null : 'hidden'].filter(Boolean).join() }, 'Recommended'); // TODO: localize
  titleRow.append(createTag('span', { class: 'name' }, name), recommendTag);
  drawerBody.append(titleRow);
  const labelRow = createTag('div', { class: 'label-row' });
  labels.forEach((label) => {
    const pill = createTag('div', { class: 'label-pill' });
    pill.append(getIconElementDeprecated('checkmark'), label);
    labelRow.append(pill);
  });
  drawerBody.append(labelRow);
  drawerBody.append(createTag('p', { class: 'description' }, description));
  // const onChange = () => {};
  return drawerBody;
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

export async function createDrawerContentPaperType(customizationOptions, labelText, hiddenSelectInputName, CTALinkText, productId, defaultValue, drawerType) {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const paperTypeContainer = createTag('div', { class: 'pdpx-paper-type-container' });
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
  const paperTypeSelectorContainer = await createMiniPillOptionsSelector(customizationOptions, labelText, hiddenSelectInputName, null, productId, defaultValue, drawerType);
  paperTypeContainer.appendChild(drawerHead);
  drawerBody.appendChild(heroImageContainer);
  drawerBody.appendChild(titleRow);
  drawerBody.appendChild(paperTypeSelectorContainer);
  paperTypeContainer.appendChild(drawerBody);
  return paperTypeContainer;
}
