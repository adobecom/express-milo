import { getLibs } from '../../scripts/utils.js';
import BlockMediator from '../../scripts/block-mediator.min.js';

const [{ createTag, getConfig }, placeholderMod] = await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]);
const PLANS = ['monthly', 'annually'];
const SPECIAL_PLAN = 'annual-billed-monthly';
const SUBSCRIPTION_TYPE = 'subscription-type';
const keyArray = [
  ...PLANS,
  SPECIAL_PLAN,
  SUBSCRIPTION_TYPE,
];
const placeholderValues = await placeholderMod.replaceKeyArray(keyArray, getConfig());
const placeholders = keyArray.reduce((acc, key, index) => {
  acc[key] = placeholderValues[index];
  return acc;
}, {});

function togglePlan(pricingSections, buttons, planIndex) {
  const button = buttons[planIndex];
  if (button.classList.contains('checked')) return;
  buttons.filter((b) => b !== button).forEach((b) => {
    b.classList.remove('checked');
    b.setAttribute('aria-checked', 'false');
  });
  const plan = button.getAttribute('plan');
  button.classList.add('checked');
  button.setAttribute('aria-checked', 'true');
  pricingSections.forEach((section) => {
    if (section.classList.contains(plan)) {
      section.classList.remove('hide');
    } else {
      section.classList.add('hide');
    }
  });
}

function focusNextButton(buttons, currentIndex) {
  const nextIndex = (currentIndex + 1) % buttons.length;
  buttons[nextIndex].focus();
}

function focusPreviousButton(buttons, currentIndex) {
  const prevIndex = (currentIndex - 1 + buttons.length) % buttons.length;
  buttons[prevIndex].focus();
}

function handleKeyNavigation(e, pricingSections, buttons, toggleWrapper) {
  if (!e.target.isEqualNode(document.activeElement)) return;
  const currentIndex = buttons.indexOf(e.target);
  switch (e.code) {
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault();
      focusPreviousButton(buttons, currentIndex);
      break;
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault();
      focusNextButton(buttons, currentIndex);
      break;
    case 'Enter':
    case 'Space':
      e.preventDefault();
      togglePlan(pricingSections, buttons, currentIndex);
      break;
    case 'Tab':
      toggleWrapper.nextElementSibling.focus();
      break;
    default:
      break;
  }
}
export function tagFreePlan(cardContainer) {
  const cards = Array.from(cardContainer.querySelectorAll('.card'));
  let disableAllToggles = true;
  const freePlanStatus = [];

  for (const card of cards) {
    let isFreePlan = true;
    const pricingSections = card.querySelectorAll('.pricing-section');
    for (const section of pricingSections) {
      const price = section.querySelector('.pricing-price > strong')?.textContent;
      if (price && parseInt(price, 10) > 0) {
        isFreePlan = false;
        disableAllToggles = false;
        break;
      }
    }
    freePlanStatus.push(isFreePlan ? card.querySelector('.billing-toggle') : undefined);
  }

  freePlanStatus.forEach((billingToggle) => {
    if (disableAllToggles && billingToggle) {
      billingToggle.remove();
    } else if (billingToggle) {
      billingToggle.classList.add('suppressed-billing-toggle');
    }
  });
}

export default function createToggle(pricingSections, groupID, adjElemPos) {
  const subDesc = placeholders?.['subscription-type'] || 'Subscription Type:';
  const toggleWrapper = createTag('div', {
    class: 'billing-toggle',
    role: 'radiogroup',
    'aria-labelledby': groupID,
  });

  const groupLabel = createTag('strong', { id: groupID }, subDesc);
  toggleWrapper.appendChild(groupLabel);

  const buttons = PLANS.map((basePlan, i) => {
    const planLabelID = (BlockMediator.get(groupID) === 'ABM' && placeholders?.[SPECIAL_PLAN] && basePlan === 'monthly')
      ? SPECIAL_PLAN
      : basePlan;
    const label = placeholders?.[planLabelID];
    const buttonID = `${groupID}:${basePlan}`;
    // urgent update
    const isDefault = i === (BlockMediator.get(groupID) === 'ABM' ? 1 : 0);
    const button = createTag('button', {
      class: isDefault ? 'checked' : '',
      id: buttonID,
      plan: basePlan,
      role: 'radio',
      'aria-checked': isDefault.toString(),
      'aria-labelledby': buttonID,
    });

    button.appendChild(createTag('span'));

    button.appendChild(createTag('div', { id: `${buttonID}:radio` }, label));

    button.addEventListener('click', () => {
      togglePlan(pricingSections, buttons, i);
      adjElemPos();
    });

    return button;
  });

  const toggleButtonWrapper = createTag('div', { class: 'toggle-button-wrapper' });
  toggleButtonWrapper.append(...buttons);
  toggleWrapper.append(toggleButtonWrapper);
  toggleWrapper.addEventListener('keydown', (e) => handleKeyNavigation(e, pricingSections, buttons, toggleWrapper));

  return toggleWrapper;
}
