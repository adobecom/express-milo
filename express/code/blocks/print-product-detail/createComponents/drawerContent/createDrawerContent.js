import { getLibs, getIconElementDeprecated } from '../../../../scripts/utils.js';
import createDrawerContentPaperType from './createDrawerContentPaperType.js';
import createDrawerContentPrintingProcess from './createDrawerContentPrintingProcess.js';
import createDrawerContentSizeChart from './createDrawerContentSizeChart.js';

let createTag;

export async function closeDrawer() {
  const curtain = document.querySelector('.pdp-curtain');
  const drawer = document.querySelector('.drawer');
  curtain.classList.add('hidden');
  drawer.classList.add('hidden');
  document.body.classList.remove('disable-scroll');
}

export async function createDrawer() {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const curtain = createTag('div', { class: 'pdp-curtain hidden' });
  curtain.setAttribute('daa-ll', 'pdp-x-drawer-curtainClose');
  const drawer = createTag('div', { class: 'drawer hidden', id: 'pdp-x-drawer' });
  curtain.addEventListener('click', closeDrawer);
  return { curtain, drawer };
}

export function createDrawerHead(drawerLabel) {
  const drawerHead = createTag('div', { class: 'drawer-head' });
  const closeButton = createTag('button', { 'aria-label': 'close' }, getIconElementDeprecated('close-black')); // TODO: analytics
  closeButton.addEventListener('click', closeDrawer);
  drawerHead.append(createTag('div', { class: 'drawer-head-label' }, drawerLabel), closeButton);
  return drawerHead;
}

export async function openDrawer(
  customizationOptions,
  labelText,
  hiddenSelectInputName,
  CTALinkText,
  productDetails,
  defaultValue,
  drawerType,
) {
  const curtain = document.querySelector('.pdp-curtain');
  const drawer = document.querySelector('.drawer');
  drawer.innerHTML = '';
  if (drawerType === 'sizeChart') {
    await createDrawerContentSizeChart(productDetails, drawer);
  } else if (drawerType === 'printingProcess') {
    await createDrawerContentPrintingProcess(productDetails, drawer);
  } else if (drawerType === 'paperType') {
    await createDrawerContentPaperType(
      customizationOptions,
      labelText,
      hiddenSelectInputName,
      CTALinkText,
      productDetails,
      defaultValue,
      drawerType,
      drawer,
    );
  }
  curtain.classList.remove('hidden');
  drawer.classList.remove('hidden');
  document.body.classList.add('disable-scroll');
}
