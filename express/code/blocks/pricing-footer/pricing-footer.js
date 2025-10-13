function getMerchCardWidth(el) {
 

  let sibling = el.previousElementSibling;
  while (sibling) {
    console.log(sibling);
    if (sibling.classList?.contains('content')) {
      const computedWidth = window.getComputedStyle(sibling).width;
      console.log(computedWidth);
      if (computedWidth && computedWidth !== 'auto') {
        el.style.maxWidth = computedWidth;
      }
      break;
    }
    sibling = sibling.previousElementSibling;
  }
}

export default function init(el) {
  const firstRow = el.querySelector(':scope > div');
  if (!firstRow) return;

  const columns = Array.from(firstRow.children);
  el.innerHTML = '';
  el.classList.add('ax-grid-container', 'small-gap');

  columns
    .filter((column) => column.innerHTML.trim() !== '')
    .forEach((column) => {
      el.append(column);
    });

  const wrapper = el.closest('.pricing-footer-wrapper');
  let siblingBlock = wrapper?.previousElementSibling;
  let pricingCardsBlock;

  while (siblingBlock && !pricingCardsBlock) {
    pricingCardsBlock = siblingBlock.querySelector('.pricing-cards-v2');
    if (!pricingCardsBlock) {
      siblingBlock = siblingBlock.previousElementSibling;
    }
  }

  // if (!pricingCardsBlock) return;

  // const cardCountClass = Array.from(pricingCardsBlock.classList)
  //   .find((cls) => cls.startsWith('card-count-'));

  // if (cardCountClass) {
  //   el.classList.add(cardCountClass);
  // }


  getMerchCardWidth(el);
}
