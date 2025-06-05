import { getIconElementDeprecated, getLibs } from '../../scripts/utils.js';

let createTag; let loadStyle;
let getConfig; let replaceKeyArray;

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

function buildTooltip(pricingArea, tooltipPattern, tooltipAriaLabel ='Tooltip') {

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

    tooltipContainer.innerHTML = tooltipContainer.innerHTML.replace(tooltipPattern, '')
 

    const tooltipContent = tooltipMatch[2];
    tooltipContainer.classList.add('tooltip');

    const tooltipPopup = createTag('div', { class: 'tooltip-text' });
    tooltipPopup.innerText = tooltipContent;
    const tooltipId = `tooltip-${Math.random().toString(36).substring(2, 15)}`;
    tooltipPopup.setAttribute('id', tooltipId);

    const infoIcon = getIconElementDeprecated('info', 44, 'Info', 'tooltip-icon');
    const tooltipButton = createTag('button');
    tooltipButton.setAttribute('aria-expanded', 'false');
    tooltipButton.setAttribute('aria-describedby', tooltipId);
    tooltipButton.setAttribute('aria-label', tooltipAriaLabel);
    tooltipButton.append(infoIcon);
    tooltipButton.append(tooltipPopup);
    tooltipContainer.append(tooltipButton);

    let isTooltipVisible = false;
    const showTooltip = () => {
        isTooltipVisible = true;
        tooltipButton.classList.add('hover');
        tooltipPopup.classList.add('hover');
        tooltipButton.setAttribute('aria-expanded', 'true');
        adjustElementPosition();
    };

    const hideTooltip = () => {
        isTooltipVisible = false;
        tooltipButton.classList.remove('hover');
        tooltipPopup.classList.remove('hover');
        tooltipButton.setAttribute('aria-expanded', 'false');
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

    tooltipButton.addEventListener('focus', showTooltip);
    tooltipButton.addEventListener('blur', hideTooltip);

    tooltipButton.addEventListener('mouseover', showTooltip);
    tooltipButton.addEventListener('mouseleave', () => {
        setTimeout(hideTooltip, 500);
    });

    tooltipPopup.addEventListener('mouseover', () => {
        if (tooltipButton.classList.contains('hover')) {
            tooltipPopup.classList.add('hover');
        }
    });

    tooltipPopup.addEventListener('mouseleave', () => {
        setTimeout(hideTooltip, 500);
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

export default async function handleTooltip(pricingArea, tooltipPattern = /\(\(([^]+)\)\)([^]+)\(\(\/([^]+)\)\)/g, tooltipKey = 'learn-more-about-cancellation') {
    await Promise.all([
        import(`${getLibs()}/utils/utils.js`),
        import(`${getLibs()}/features/placeholders.js`)
    ]).then(([utils, placeholders]) => {
        ({ createTag, getConfig, loadStyle } = utils);
        ({ replaceKeyArray } = placeholders);
    });
 
    const [tooltipAriaLabel] = await replaceKeyArray([tooltipKey],getConfig());
    const config = getConfig();
    return new Promise((resolve) => {
        loadStyle(`${config.codeRoot}/scripts/widgets/basic-carousel.css`, () => {
            onTooltipCSSLoad();
            buildTooltip(pricingArea, tooltipPattern, tooltipAriaLabel);
            resolve();
        });
    });
}