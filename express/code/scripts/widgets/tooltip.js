import { getIconElementDeprecated, getLibs } from '../utils.js';

let createTag; let loadStyle;
let getConfig;

export async function onTooltipCSSLoad() {
  const config = getConfig();
  const stylesheetHref = `${config.codeRoot}/scripts/widgets/tooltip.css`;
  await new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = stylesheetHref;
    link.onload = resolve;
    link.onerror = () => reject(new Error(`Failed to load ${stylesheetHref}`));
    document.head.appendChild(link);
  });
}

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

function buildTooltip(pricingArea, tooltipPattern) {
  const elements = pricingArea.querySelectorAll('p');
  let tooltipMatch;
  let tooltipContainer;

  Array.from(elements).forEach((p) => {
    const match = tooltipPattern.exec(p.textContent);
    if (match) {
      tooltipMatch = match;
      tooltipContainer = p;
    }
  });
  if (!tooltipMatch) return;

  tooltipContainer.innerHTML = tooltipContainer.innerHTML.replace(tooltipPattern, '');
  const tooltipContent = tooltipMatch[2];
  tooltipContainer.classList.add('tooltip');

  const tooltipPopup = createTag('div', { class: 'tooltip-text' });
  tooltipPopup.innerText = tooltipContent;

  const infoIcon = getIconElementDeprecated('info', 44, 'Info', 'tooltip-icon');
  const tooltipButton = createTag('button');
  tooltipButton.setAttribute('aria-label', tooltipContent);

  tooltipButton.append(infoIcon);
  tooltipButton.append(tooltipPopup);
  tooltipContainer.append(tooltipButton);

  let isTooltipVisible = false;
  let hideTimeout;
  let isMouseOverIcon = false;
  let isMouseOverTooltip = false;

  const showTooltip = () => {
    clearTimeout(hideTimeout);
    isTooltipVisible = true;
    tooltipButton.classList.add('hover');
    tooltipPopup.classList.add('hover');
  };

  const hideTooltip = () => {
    isTooltipVisible = false;
    tooltipButton.classList.remove('hover');
    tooltipPopup.classList.remove('hover');
  };

  const checkAndHideTooltip = () => {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (!isMouseOverIcon && !isMouseOverTooltip) {
        hideTooltip();
      }
    }, 300);
  };

  const toggleTooltip = () => {
    if (isTooltipVisible) {
      hideTooltip();
    } else {
      showTooltip();
    }
  };

  tooltipButton.addEventListener('click', (e) => {
    e.preventDefault();
    adjustElementPosition();
    toggleTooltip();
  });

  window.addEventListener('resize', adjustElementPosition);
  infoIcon.addEventListener('mouseenter', () => {
    isMouseOverIcon = true;
    showTooltip();
  });

  infoIcon.addEventListener('mouseleave', () => {
    isMouseOverIcon = false;
    checkAndHideTooltip();
  });

  tooltipPopup.addEventListener('mouseenter', () => {
    isMouseOverTooltip = true;
    clearTimeout(hideTimeout);
  });

  tooltipPopup.addEventListener('mouseleave', () => {
    isMouseOverTooltip = false;
    checkAndHideTooltip();
  });

  tooltipButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    toggleTooltip();
  });

  document.addEventListener('touchstart', (e) => {
    if (isTooltipVisible && !tooltipButton.contains(e.target)) {
      hideTooltip();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.activeElement.blur();
      hideTooltip();
    }
  });
}

export default async function handleTooltip(pricingArea, tooltipPattern = /\(\(([^]+)\)\)([^]+)\(\(\/([^]+)\)\)/g) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`)]).then(([utils]) => {
    ({ createTag, getConfig, loadStyle } = utils);
  });
  const config = getConfig();
  return new Promise((resolve) => {
    loadStyle(`${config.codeRoot}/scripts/widgets/basic-carousel.css`, () => {
      onTooltipCSSLoad();
      buildTooltip(pricingArea, tooltipPattern);
      resolve();
    });
  });
}
