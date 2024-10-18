import { getLibs } from '../../scripts/utils.js';
import { addTempWrapperDeprecated, decorateButtonsDeprecated } from '../../scripts/utils/decorate.js';
import { getIconElementDeprecated } from '../../scripts/utils/icons.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);

function show(block) {
  const body = block.closest('body');
  const card = block.querySelector('.block-body');

  if (!body || !card) return;

  block.classList.remove('hidden');
  body.style.overflow = 'hidden';
  setTimeout(() => {
    block.classList.remove('transparent');
    card.style.bottom = '0';
  }, 10);
}

function initCTAListener(block, href, targetBlock) {
  const buttons = targetBlock ? targetBlock.querySelectorAll('.button') : block.closest('main').querySelectorAll('.button');

  buttons.forEach((button) => {
    if (button.href === href && !button.classList.contains('no-event')) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const buttonOuterWrapper = button.parentElement.parentElement;
        if (buttonOuterWrapper.classList.contains('multifunction')) {
          if (button.parentElement.classList.contains('toolbox-opened')) {
            buttonOuterWrapper.remove();
            show(block);
          }
        } else {
          show(block);
        }
      });
    }
  });
}

function initNotchDragAction(card) {
  let touchStart = 0;
  const notch = card.querySelector('.notch');

  notch.addEventListener('touchstart', (e) => {
    card.style.transition = 'none';
    touchStart = e.changedTouches[0].clientY;
  });

  notch.addEventListener('touchmove', (e) => {
    card.style.bottom = `-${e.changedTouches[0].clientY - touchStart}px`;
  });

  notch.addEventListener('touchend', (e) => {
    card.style.transition = 'bottom 0.2s';
    if (e.changedTouches[0].clientY - touchStart > 100) {
      notch.click();
    } else {
      card.style.bottom = '0';
    }
  });
}

export default function decorate(block) {
  addTempWrapperDeprecated(block, 'split-action');
  decorateButtonsDeprecated(block);

  block.classList.add('hidden');
  block.classList.add('transparent');

  const buttonsWrapper = createTag('div', { class: 'buttons-wrapper' });
  const blockBackground = createTag('div', { class: 'block-background' });
  const card = createTag('div', { class: 'block-body' }, block.innerHTML);
  const underlay = createTag('a', { class: 'underlay' });
  const notch = createTag('a', { class: 'notch' });
  const notchPill = createTag('div', { class: 'notch-pill' });

  let hrefHolder = '';
  block.innerHTML = '';

  card.prepend(getIconElementDeprecated('adobe-express-white'));

  Array.from(card.children).forEach((div) => {
    const anchor = div.querySelector('a');

    if (anchor) {
      buttonsWrapper.append(anchor);
      div.remove();
      const buttons = document.querySelectorAll('.button.primaryCTA');
      const matchingButtons = Array.from(buttons).filter((button) => button.href === anchor.href);

      if (anchor.classList.contains('same-fcta') || matchingButtons.length > 0) {
        anchor.classList.add('no-event');
        anchor.target = '_self';
        hrefHolder = anchor.href;
      }
    }

    if (div.querySelector('picture')) {
      blockBackground.append(div.querySelector('picture'));
      div.remove();
    }
  });

  if (!hrefHolder) {
    block.remove();
    return;
  }

  notch.append(notchPill);
  blockBackground.append(underlay);
  block.append(blockBackground, card);
  card.append(notch, buttonsWrapper);

  [notch, underlay].forEach((element) => {
    element.addEventListener('click', () => {
      const actionCta = block.querySelector('.button[target="_self"]');
      window.location.assign(actionCta.href);
    });
  });

  if (document.body.dataset.device === 'mobile') {
    initNotchDragAction(card);
    initCTAListener(block, hrefHolder);

    document.addEventListener('floatingbuttonloaded', (e) => {
      initCTAListener(block, hrefHolder, e.detail.block);
    });

    document.dispatchEvent(new Event('splitactionloaded'));
  }
}
