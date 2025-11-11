import { getLibs, getIconElementDeprecated } from '../../../../scripts/utils.js';

let createTag;

export async function closeDrawer() {
  const curtain = document.querySelector('.pdpx-curtain');
  const drawer = document.querySelector('#pdpx-drawer');
  curtain.classList.add('hidden');
  drawer.classList.add('hidden');
  document.body.classList.remove('disable-scroll');
}

export async function createDrawer() {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  const curtain = createTag('div', { class: 'pdpx-curtain hidden' });
  const drawer = createTag('div', { class: 'pdpx-drawer hidden', id: 'pdpx-drawer' });
  curtain.addEventListener('click', closeDrawer);
  return { curtain, drawer };
}

export function createDrawerHead(drawerLabel) {
  const drawerHead = createTag('div', { class: 'pdpx-drawer-head' });
  const closeButton = createTag('button', { 'aria-label': 'close' }, getIconElementDeprecated('close-black')); // TODO: analytics
  closeButton.addEventListener('click', closeDrawer);
  drawerHead.append(createTag('div', { class: 'pdpx-drawer-head-label' }, drawerLabel), closeButton);
  return drawerHead;
}
