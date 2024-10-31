import { getLibs } from '../../scripts/utils.js';
import { getIconElementDeprecated } from '../../scripts/utils/icons.js';
const [{ decorateButtons }, { createTag }] = await Promise.all([import(`${getLibs()}/utils/decorate.js`),
  import(`${getLibs()}/utils/utils.js`)]);


export function adjustElementPosition() {
  const elements = document.querySelectorAll('.tooltip-text');

  if (elements.length === 0) return;
  for (const element of elements) {
    const rect = element.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      element.classList.remove('overflow-left');
      element.classList.add('overflow-right');
    } else if (rect.left < 0) {
      element.classList.remove('overflow-right');
      element.classList.add('overflow-left');
    }
  }
}

export function handleTooltip(pricingArea) {
  const elements = pricingArea.querySelectorAll('p');
  const pattern = /\(\(([^]+)\)\)([^]+)\(\(\/([^]+)\)\)/g;
  let tooltip;
  let tooltipDiv;

  Array.from(elements).forEach((p) => {
    const res = pattern.exec(p.textContent);
    if (res) {
      tooltip = res;
      tooltipDiv = p;
    }
  });
  if (!tooltip) return;

  tooltipDiv.innerHTML = tooltipDiv.innerHTML.replace(pattern, '');
  const tooltipText = tooltip[2];
  tooltipDiv.classList.add('tooltip');
  const span = createTag('div', { class: 'tooltip-text' });
  span.innerText = tooltipText;
  const icon = getIconElementDeprecated('info', 44, 'Info', 'tooltip-icon');
  icon.append(span);
  const iconWrapper = createTag('span');
  iconWrapper.append(icon);
  iconWrapper.append(span);
  tooltipDiv.append(iconWrapper);
  iconWrapper.addEventListener('click', adjustElementPosition);
  window.addEventListener('resize', adjustElementPosition);
}
