import { getLibs, getIconElementDeprecated } from '../../../scripts/utils.js';

let createTag;
let loadStyle;
let getConfig;

/**
 * Creates a two-column comparison drawer for "Classic vs. Vivid Printing"
 * @param {Object} data - Comparison data with left and right columns
 * @param {Function} onClose - Callback when drawer closes
 */
export default async function createComparisonDrawer(data, onClose) {
  ({ createTag, loadStyle, getConfig } = await import(`${getLibs()}/utils/utils.js`));

  const styleLoaded = new Promise((resolve) => {
    loadStyle(`${getConfig().codeRoot}/blocks/print-product-detail/createComponents/drawer.css`, () => {
      resolve();
    });
  });

  const curtain = createTag('div', { class: 'pdp-curtain hidden' });
  const drawer = createTag('div', { class: 'drawer drawer--comparison hidden' });

  const closeDrawer = () => {
    curtain.classList.add('hidden');
    drawer.classList.add('hidden');
    document.body.classList.remove('disable-scroll');
    if (onClose) onClose();
  };

  curtain.addEventListener('click', closeDrawer);

  // Header
  const drawerHead = createTag('div', { class: 'drawer-head' });
  const closeButton = createTag('button', { 'aria-label': 'Close comparison', class: 'drawer-close' });
  closeButton.innerHTML = getIconElementDeprecated('close-black');
  closeButton.addEventListener('click', closeDrawer);
  drawerHead.append(
    createTag('div', { class: 'drawer-head-label' }, data.title || 'Classic vs. Vivid Printing'),
    closeButton,
  );

  // Body with two columns
  const drawerBody = createTag('div', { class: 'drawer-body drawer-body--comparison' });

  // Left column (Classic)
  const leftColumn = createTag('div', { class: 'comparison-column' });
  leftColumn.innerHTML = `
    <h3 class="comparison-heading">${data.left.title}</h3>
    <div class="comparison-color">${data.left.colorCount}</div>
    <img class="comparison-image" src="${data.left.imageUrl}" alt="${data.left.title}" />
    <div class="comparison-description">${data.left.description}</div>
  `;

  // Right column (Vivid)
  const rightColumn = createTag('div', { class: 'comparison-column' });
  rightColumn.innerHTML = `
    <h3 class="comparison-heading">${data.right.title}</h3>
    <div class="comparison-color">${data.right.colorCount}</div>
    <img class="comparison-image" src="${data.right.imageUrl}" alt="${data.right.title}" />
    <div class="comparison-description">${data.right.description}</div>
  `;

  drawerBody.append(leftColumn, rightColumn);
  drawer.append(drawerHead, drawerBody);

  await styleLoaded;

  return {
    curtain,
    drawer,
    open: () => {
      curtain.classList.remove('hidden');
      drawer.classList.remove('hidden');
      document.body.classList.add('disable-scroll');
    },
    close: closeDrawer,
  };
}
