import { getLibs, yieldToMain, decorateButtonsDeprecated } from '../../scripts/utils.js';
import { debounce, throttle } from '../../scripts/utils/hofs.js';

let createTag;

async function syncMinHeights(groups) {
  const maxHeights = groups.map((els) => els
    .filter((e) => !!e)
    .reduce((max, e) => Math.max(max, e.offsetHeight), 0));
  await yieldToMain();
  maxHeights.forEach((maxHeight, i) => groups[i].forEach((e) => {
    if (e) e.style.minHeight = `${maxHeight}px`;
  }));
}

const nextSVGHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="Slider Button - Arrow - Right">
    <circle id="Ellipse 24477" cx="16" cy="16" r="16" fill="#FFFFFF"/>
    <path id="chevron-right" d="M14.6016 21.1996L19.4016 16.3996L14.6016 11.5996" stroke="#292929" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;
const prevSVGHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="Slider Button - Arrow - Left">
    <circle id="Ellipse 24477" cx="16" cy="16" r="16" transform="matrix(-1 0 0 1 32 0)" fill="#FFFFFF"/>
    <path id="chevron-right" d="M17.3984 21.1996L12.5984 16.3996L17.3984 11.5996" stroke="#292929" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;
const scrollPadding = 16;

function createControl(items, container) {
  const control = createTag('div', { class: 'gallery-control loading' });
  const status = createTag('div', { class: 'status' });
  const prevButton = createTag('button', {
    class: 'prev',
    'aria-label': 'Next',
  }, prevSVGHTML);
  const nextButton = createTag('button', {
    class: 'next',
    'aria-label': 'Previous',
  }, nextSVGHTML);

  const intersecting = Array.from(items).fill(false);

  const len = items.length;
  const pageInc = throttle((inc) => {
    const first = intersecting.indexOf(true);
    if (first === -1) return; // middle of swapping only page
    if (first + inc < 0 || first + inc >= len) return; // no looping
    const target = items[(first + inc + len) % len];
    target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }, 200);
  prevButton.addEventListener('click', () => pageInc(-1));
  nextButton.addEventListener('click', () => pageInc(1));

  const dots = items.map(() => {
    const dot = createTag('div', { class: 'dot' });
    status.append(dot);
    return dot;
  });

  const updateDOM = debounce((first, last) => {
    prevButton.disabled = first === 0;
    nextButton.disabled = last === items.length - 1;
    dots.forEach((dot, i) => {
      /* eslint-disable chai-friendly/no-unused-expressions */
      i === first ? dot.classList.add('curr') : dot.classList.remove('curr');
      i === first ? items[i].classList.add('curr') : items[i].classList.remove('curr');
      i > first && i <= last ? dot.classList.add('hide') : dot.classList.remove('hide');
      /* eslint-disable chai-friendly/no-unused-expressions */
    });
    if (items.length === last - first + 1) {
      control.classList.add('hide');
      container.classList.add('gallery--all-displayed');
    } else {
      control.classList.remove('hide');
      container.classList.remove('gallery--all-displayed');
    }
    control.classList.remove('loading');
  }, 300);

  const reactToChange = (entries) => {
    entries.forEach((entry) => {
      intersecting[items.indexOf(entry.target)] = entry.isIntersecting;
    });
    const [first, last] = [intersecting.indexOf(true), intersecting.lastIndexOf(true)];
    if (first === -1) return; // middle of swapping only page
    updateDOM(first, last);
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    reactToChange(entries);
  }, { root: container, threshold: 1, rootMargin: `0px ${scrollPadding}px 0px ${scrollPadding}px` });

  items.forEach((item) => scrollObserver.observe(item));

  control.append(status, prevButton, nextButton);
  return control;
}

export async function buildGallery(
  items,
  container = items?.[0]?.parentNode,
  root = container?.parentNode,
) {
  if (!root) throw new Error('Invalid Gallery input');
  const control = createControl([...items], container);
  container.classList.add('gallery');
  [...items].forEach((item) => {
    item.classList.add('gallery--item');
  });
  root.append(control);
}

export default async function decorate(block) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`), decorateButtonsDeprecated(block)]).then(([utils]) => {
    ({ createTag } = utils);
  });
  const firstChild = block.querySelector(':scope > div:first-child');

  if (firstChild && firstChild.querySelector('h3')) {
    firstChild.classList.add('center-title');
    block.insertBefore(firstChild, block.firstChild);
  }

  const cardsWrapper = createTag('div', { class: 'cards-container' });

  const cards = block.querySelectorAll(':scope > div:not(:first-child)');
  const cardParagraphs = [[]];
  cards.forEach((card) => {
    card.classList.add('card');

    cardsWrapper.appendChild(card);
    const cardDivs = [...card.children];

    cardDivs.forEach((element) => {
      const textHeader = element.querySelector('h4');
      const textBody = element.querySelector('p');
      if (textHeader && textBody) {
        textHeader.classList.add('header');
        textBody.classList.add('body');
        element.classList.add('text-content');
        cardParagraphs[0].push(element);
      }

      element.querySelector('picture img')?.classList.add('short');
      if (element.tagName === 'H2') {
        element.classList.add('card-title');
      } else if (element.querySelector('a.button')) {
        element.classList.add('cta-section');
      }
    });
  });

  block.appendChild(cardsWrapper);
  await buildGallery(cards, cardsWrapper);
  new IntersectionObserver((entries, obs) => {
    obs.unobserve(block);
    syncMinHeights(cardParagraphs);
  }).observe(block);
  window.addEventListener('resize', debounce(() => {
    syncMinHeights(cardParagraphs);
  }, 100));

  block.style.backgroundImage = `
        linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 20%),
        linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 20%),
        url(/express/code/blocks/discover-cards/img/cards-bg-large.webp)
      `;
}
