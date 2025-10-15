function getMerchCardWidth(el) {
  let sibling = el.previousElementSibling;
  while (sibling) {
    if (sibling.classList?.contains('content')) {
      const cards = sibling.querySelectorAll('merch-card');
      const cardCount = cards.length;

      if (cardCount > 0) {
        Array.from(el.classList)
          .filter((cls) => cls.startsWith('card-count-'))
          .forEach((cls) => el.classList.remove(cls));

        el.classList.add(`card-count-${cardCount}`);

        const contentStyles = window.getComputedStyle(sibling);
        const getCardOuterWidth = (card) => {
          const { width } = card.getBoundingClientRect();
          const cardStyles = window.getComputedStyle(card);
          const marginLeft = parseFloat(cardStyles.marginLeft || '0') || 0;
          const marginRight = parseFloat(cardStyles.marginRight || '0') || 0;
          return width + marginLeft + marginRight;
        };

        // Include horizontal gutter between cards when summing widths.
        // Prefer the computed column gap from CSS; fall back to 16px to align with grid defaults.
        const columnGap = parseFloat(contentStyles.columnGap || contentStyles.gap || '16') || 16;

        const totalWidth = Array.from(cards).reduce((acc, card, index) => {
          let accumulatedWidth = acc + getCardOuterWidth(card);
          if (index > 0) {
            accumulatedWidth += columnGap;
          }
          return accumulatedWidth;
        }, 0);

        const firstCardWidth = getCardOuterWidth(cards[0]);
        const computedWidth = parseFloat(contentStyles.width || '0') || 0;
        const isNarrowViewport = window.matchMedia('(max-width: 1199px)').matches;

        let targetWidth = totalWidth > 0 ? totalWidth : computedWidth;
        if (isNarrowViewport) {
          targetWidth = firstCardWidth > 0 ? firstCardWidth : targetWidth;
        }
        if (targetWidth > 0) {
          el.style.maxWidth = `${targetWidth}px`;
        }
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
  // Width is computed directly from the adjacent .content container.

  const runWidthCalculation = () => getMerchCardWidth(el);

  setTimeout(runWidthCalculation, 200);

  if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(runWidthCalculation);
    resizeObserver.observe(document.documentElement);
    el.resizeObserver = resizeObserver;
  } else {
    window.addEventListener('resize', runWidthCalculation);
  }
}
