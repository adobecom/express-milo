// fires 'billing-plan' BM and has global sync values when multiple on same page
// import { createTag } from '../../scripts/utils.js';
// import BlockMediator from '../../scripts/block-mediator.min.js';
// import { addTempWrapper } from '../../scripts/decorate.js';

// const BILLING_PLAN = 'billing-plan';

export default function init(el) {
  el.remove();
  // const title = el.querySelector('strong');
  // const plans = Array.from(el.querySelectorAll('ol > li')).map((li) => li.textContent.trim());
  // el.innerHTML = '';
  // el.setAttribute('role', 'radiogroup');
  // el.setAttribute('aria-labelledby', 'radio-group-label');
  // el.append(title);
  // const label = el.children[0];
  // label.setAttribute('id', 'radio-group-label');
  // const buttons = [];
  // if (BlockMediator.get(BILLING_PLAN) === undefined) BlockMediator.set(BILLING_PLAN, 0);
  // plans.forEach((plan, planIndex) => {
  //   const checked = planIndex === (BlockMediator.get(BILLING_PLAN) || 0);
  //   const button = createTag('button', {
  //     id: plan,
  //     class: checked ? 'checked' : '',
  //   });
  //   button.setAttribute('aria-checked', !!checked);
  //   button.append(createTag('label', { for: plan }, plan));
  //   button.setAttribute('role', 'radio');
  //   button.prepend(createTag('span'));
  //   button.addEventListener('click', () => {
  //     if (planIndex !== BlockMediator.get(BILLING_PLAN)) {
  //       BlockMediator.set(BILLING_PLAN, planIndex);
  //     }
  //   });
  //   if (planIndex > 0) {
  //     button.setAttribute('tabindex', -1);
  //   }
  //   el.append(button);
  //   buttons.push(button);
  // });

  // function focusNextButton(currentIndex) {
  //   const nextIndex = (currentIndex + 1) % buttons.length;
  //   buttons[nextIndex].focus();
  // }

  // function focusPreviousButton(currentIndex) {
  //   const prevIndex = (currentIndex - 1 + buttons.length) % buttons.length;
  //   buttons[prevIndex].focus();
  // }

  // el.addEventListener('keydown', (e) => {
  //   if (!e.target.isEqualNode(document.activeElement)) return;
  //   const currentIndex = buttons.indexOf(e.target);
  //   switch (e.code) {
  //     case 'ArrowLeft':
  //     case 'ArrowUp':
  //       e.preventDefault();
  //       focusPreviousButton(currentIndex);
  //       break;
  //     case 'ArrowRight':
  //     case 'ArrowDown':
  //       e.preventDefault();
  //       focusNextButton(currentIndex);
  //       break;
  //     case 'Enter':
  //     case 'Space':
  //       e.preventDefault();
  //       BlockMediator.set(BILLING_PLAN, currentIndex);
  //       break;
  //     case 'Tab':
  //       el.nextElementSibling.focus();
  //       break;
  //     default:
  //       break;
  //   }
  // });

  // BlockMediator.subscribe(BILLING_PLAN, ({ newValue, oldValue }) => {
  //   buttons[oldValue || 0].classList.remove('checked');
  //   buttons[oldValue || 0].setAttribute('aria-checked', 'false');
  //   buttons[newValue].classList.add('checked');
  //   buttons[newValue].setAttribute('aria-checked', 'true');
  //   buttons[newValue].focus();
  // });
}
