import BlockMediator from '../../scripts/block-mediator.min.js';
import { formatDynamicCartLink } from '../../scripts/utils/pricing.js';

function initScrollWatcher(block) {
  const hideOnIntersect = new IntersectionObserver((entries) => {
    const notIntersecting = entries.every((entry) => !entry.isIntersecting);

    if (notIntersecting) {
      block.classList.remove('hidden');
    } else {
      block.classList.add('hidden');
    }
  }, {
    root: null,
    rootMargin: '32px',
    threshold: 0,
  });

  const footer = document.querySelector('footer');
  if (footer) hideOnIntersect.observe(footer);

  const primaryCta = BlockMediator.get('primaryCtaUrl');
  if (!primaryCta) return;

  const primaryUrl = new URL(primaryCta);

  const pageCta = Array.from(document.querySelectorAll(
    '.section:first-of-type a.primaryCTA',
    '.section:first-of-type a.cta',
    '.section:first-of-type a.button',
  )).find((a) => a.href === primaryUrl.href);

  if (pageCta) hideOnIntersect.observe(pageCta);
}

export default async function decorate(block) {
  console.log('block', block);
  const buttons = block.querySelectorAll('a');
  block.classList.add('hidden');

  buttons.forEach((btn) => {
    const parentEl = btn.parentElement;
    formatDynamicCartLink(btn);
    if (['EM', 'STRONG'].includes(parentEl.tagName)) {
      if (parentEl.tagName === 'EM') {
        btn.classList.add('primary', 'reverse');
        btn.classList.remove('accent');
      }

      if (parentEl.tagName === 'STRONG') {
        btn.classList.add('gradient');
      }

      parentEl.parentElement.replaceChild(btn, parentEl);
    } else {
      btn.classList.add('accent', 'cta');
    }

    if (btn.parentElement.classList.contains('button-container') || btn.parentElement.tagName === 'P') {
      btn.parentElement.parentElement.replaceChild(btn, btn.parentElement);
    }

    btn.classList.add('button', 'xlarge');
  });

  initScrollWatcher(block);

  return block;
}
