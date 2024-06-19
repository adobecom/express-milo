import { getLibs, toClassName } from '../../scripts/utils.js';

import {
  addAnimationToggle,
  linkImage,
  transformLinkToAnimation,
} from '../../scripts/utils/media.js';

import { getIconElementDeprecated } from '../../scripts/utils/icons.js';
import { addHeaderSizing } from '../../scripts/utils/location-utils.js';
import {
  decorateButtonsDeprecated,
  splitAndAddVariantsWithDash,
} from '../../scripts/utils/decorate.js';
import { addFreePlanWidget } from '../../scripts/widgets/free-plan.js';
import { displayVideoModal, hideVideoModal } from '../../scripts/widgets/video.js';
import {
  embedYoutube,
  embedVimeo,
  isVideoLink,
} from '../../scripts/utils/embed-videos.js';
import BlockMediator from '../../scripts/block-mediator.min.js';
import {
  appendLinkText,
  getExpressLandingPageType,
  sendEventToAnalytics,
} from '../../scripts/instrument.js';

const { createTag, getMetadata } = await import(`${getLibs()}/utils/utils.js`);

function transformToVideoColumn(cell, aTag, block) {
  const parent = cell.parentElement;
  const title = aTag.textContent.trim();
  // gather video urls from all links in cell
  const vidUrls = [];
  cell.querySelectorAll(':scope a.button, :scope a.con-button').forEach((button) => {
    vidUrls.push(button.href);
    if (button !== aTag) {
      const buttonContainer = button.closest('.button-container');
      if (buttonContainer) buttonContainer.remove();
      else button.remove();
    }
  });
  aTag.setAttribute('rel', 'nofollow');

  cell.classList.add('column-video');
  parent.classList.add('columns-video');

  setTimeout(() => {
    const sibling = parent.querySelector('.column-picture');
    if (sibling && block.classList.contains('highlight')) {
      const videoOverlay = createTag('div', { class: 'column-video-overlay' });
      const videoOverlayIcon = getIconElementDeprecated('play', 44);
      videoOverlay.append(videoOverlayIcon);
      sibling.append(videoOverlay);
    }
  }, 1);

  const modalActivator = block.classList.contains('highlight') ? parent : aTag;
  modalActivator.addEventListener('click', () => {
    displayVideoModal(vidUrls, title, true);
  });

  modalActivator.addEventListener('keyup', ({ key }) => {
    if (key === 'Enter') {
      displayVideoModal(vidUrls, title);
    }
  });

  // auto-play if hash matches title
  const hash = window.location.hash.substring(1);
  const titleName = toClassName(title);
  if (hash && titleName && titleName === hash && hash !== '#embed-video') {
    displayVideoModal(vidUrls, title);
  }
}

function decorateIconList(columnCell, rowNum, blockClasses) {
  const icons = [...columnCell.querySelectorAll('img.icon, svg.icon')].filter(
    (icon) => !icon.closest('p').classList.contains('social-links'),
  );
  // decorate offer icons
  if (rowNum === 0 && blockClasses.contains('offer')) {
    const titleIcon = columnCell.querySelector('img.icon, svg.icon');
    const title = columnCell.querySelector('h1, h2, h3, h4, h5, h6');
    if (title && titleIcon) {
      const titleIconWrapper = createTag('span', { class: 'columns-offer-icon' });
      titleIconWrapper.append(titleIcon);
      title.prepend(titleIconWrapper);
    }
    return;
  }

  if (
    rowNum === 0
    && icons.length === 1
    && icons[0].closest('p').innerText.trim() === ''
    && !icons[0].closest('p').previousElementSibling
  ) {
    // treat icon as brand icon if first element in first row cell and no text next to it
    icons[0].classList.add('brand');
    columnCell.parentElement.classList.add('has-brand');
    return;
  }
  if (icons.length) {
    let iconList = createTag('div', { class: 'columns-iconlist' });
    let iconListDescription;
    [...columnCell.children].forEach(($e) => {
      const imgs = $e.querySelectorAll('img.icon, svg.icon');
      // only build icon list if single icon plus text
      const img = imgs.length === 1 ? imgs[0] : null;
      const hasText = img ? img.closest('p').textContent.trim() !== '' : false;
      if (img && hasText) {
        const iconListRow = createTag('div');
        const iconDiv = createTag('div', { class: 'columns-iconlist-icon' });
        iconDiv.appendChild(img);
        iconListRow.append(iconDiv);
        iconListDescription = createTag('div', { class: 'columns-iconlist-description' });
        iconListRow.append(iconListDescription);
        iconListDescription.appendChild($e);
        iconList.appendChild(iconListRow);
      } else {
        if (iconList.children.length > 0) {
          columnCell.appendChild(iconList);
          iconList = createTag('div', { class: 'columns-iconlist' });
        }
        columnCell.appendChild($e);
      }
    });
    if (iconList.children.length > 0) columnCell.appendChild(iconList);
  }
}

const handleVideos = (cell, a, block, thumbnail) => {
  if (!a.href) return;

  const url = new URL(a.href);

  if (url.hash === '#embed-video') {
    if (a.href.includes('youtu')) {
      a.parentElement.replaceChild(embedYoutube(url), a);
    } else if (a.href.includes('vimeo')) {
      a.parentElement.replaceChild(embedVimeo(url, thumbnail), a);
    }
    if (thumbnail) thumbnail.remove();

    return;
  }

  transformToVideoColumn(cell, a, block);
  a.addEventListener('click', (e) => {
    e.preventDefault();
  });
};

export default async function decorate(block) {
  splitAndAddVariantsWithDash(block);
  decorateButtonsDeprecated(block, 'button-xxl');

  const rows = Array.from(block.children);

  let numCols = 0;
  if (rows[0]) numCols = rows[0].children.length;

  if (numCols) block.classList.add(`width-${numCols}-columns`);

  let total = rows.length;
  const isNumberedList = block.classList.contains('numbered');
  if (isNumberedList && block.classList.length > 4) {
    const i = parseInt(block.classList[3], 10);
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(i)) {
      total = i;
    }
  }

  function decodeHTMLEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  rows.forEach((row, rowNum) => {
    const cells = Array.from(row.children);

    cells.forEach((cell, cellNum) => {
      const aTag = cell.querySelector('a');
      const pics = cell.querySelectorAll(':scope picture');
      const p = cell.querySelector('p');


      if (p && p.textContent.includes('<')) {
        p.innerHTML = decodeHTMLEntities(p.textContent);
      }

      if (cellNum === 0 && isNumberedList) {
        // add number to first cell
        let num = rowNum + 1;
        if (total > 9) {
          // stylize with total for 10 or more items
          num = `${num}/${total} —`;
          if (rowNum < 9) {
            // pad number with 0
            num = `0${num}`;
          }
        } else {
          // regular ordered list style for 1 to 9 items
          num = `${num}.`;
        }
        cell.innerHTML = `<span class="num">${num}</span>${cell.innerHTML}`;
      }

      if (pics.length === 1 && pics[0].parentElement.tagName === 'P') {
        // unwrap single picture if wrapped in p tag, see https://github.com/adobe/helix-word2md/issues/662
        const parentDiv = pics[0].closest('div');
        const parentParagraph = pics[0].parentNode;
        parentDiv.insertBefore(pics[0], parentParagraph);
      }

      if (cell.querySelector('img.icon, svg.icon')) {
        decorateIconList(cell, rowNum, block.classList);
      }
      if (isVideoLink(aTag?.href)) {
        handleVideos(cell, aTag, block, pics[0]);
      }

      if (aTag?.textContent.trim().startsWith('https://')) {
        if (aTag.href.endsWith('.mp4')) {
          transformLinkToAnimation(aTag);
        } else if (pics[0]) {
          linkImage(cell);
        }
      }

      if (aTag && (aTag.classList.contains('button') || aTag.classList.contains('con-button'))) {
        if (block.className.includes('fullsize')) {
          aTag.classList.add('xlarge');
          BlockMediator.set('primaryCtaUrl', aTag.href);
          aTag.classList.add('primaryCTA');
        } else if (aTag.classList.contains('light')) {
          aTag.classList.replace('accent', 'primary');
        }
      }

      // handle history events
      window.addEventListener('popstate', ({ state }) => {
        hideVideoModal();
        const { url, title } = state || {};
        if (url) {
          displayVideoModal(url, title);
        }
      });

      cell.querySelectorAll(':scope p:empty').forEach(($p) => {
        if ($p.innerHTML.trim() === '') {
          $p.remove();
        }
      });

      cell.classList.add('column');
      const childEls = [...cell.children];
      const isPictureColumn = childEls.every((el) => ['BR', 'PICTURE'].includes(el.tagName))
        && childEls.length > 0;
      if (isPictureColumn) {
        cell.classList.add('column-picture');
      }

      const $pars = cell.querySelectorAll('p');
      for (let i = 0; i < $pars.length; i += 1) {
        if ($pars[i].innerText.match(/Powered by/)) {
          $pars[i].classList.add('powered-by');
        }
      }
    });
  });
  addAnimationToggle(block);
  addHeaderSizing(block, 'columns-heading');

  // decorate offer
  if (block.classList.contains('offer')) {
    block
      .querySelectorAll('a.button, a.con-button')
      .forEach((aTag) => aTag.classList.add('large', 'wide'));
    if (rows.length > 1) {
      // move all content into first row
      rows.forEach((row, rowNum) => {
        if (rowNum > 0) {
          const cells = Array.from(row.children);
          cells.forEach((cell, cellNum) => {
            rows[0].children[cellNum].append(...cell.children);
          });
          row.remove();
        }
      });
    }
  }

  // add free plan widget to first columns block on every page except blog
  if (
    !(getMetadata('theme') === 'blog' || getMetadata('template') === 'blog')
    && document.querySelector('main .ax-columns') === block && document.querySelector('main .section:first-of-type > div') === block
  ) {
    addFreePlanWidget(
      block.querySelector('.button-container')
        || block.querySelector('.con-button')?.parentElement
        || block.querySelector(
          ':scope .column:not(.hero-animation-overlay,.columns-picture)',
        ),
    );
  }

  // invert buttons in regular columns inside columns-highlight-container
  if (
    block.closest('.section.columns-highlight-container')
    && !block.classList.contains('highlight')
  ) {
    block.querySelectorAll('a.button, a.con-button').forEach((button) => {
      button.classList.add('dark');
    });
  }

  if (block.className === 'columns fullsize top block width-3-columns') {
    const setElementsHeight = (columns) => {
      const elementsMinHeight = {
        PICTURE: 0,
        H3: 0,
        'columns-iconlist': 0,
      };

      const onIntersect = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && columns.length) {
            columns.forEach((col) => {
              const childDivs = col.querySelectorAll(':scope > *');
              if (!childDivs.length) return;

              childDivs.forEach((div) => {
                const referrer = div.className || div.tagName;
                const targetEl = referrer === 'PICTURE' ? div.querySelector('img') : div;
                elementsMinHeight[referrer] = Math.max(
                  elementsMinHeight[referrer],
                  targetEl.offsetHeight,
                );
              });
            });

            columns.forEach((col) => {
              const childDivs = col.querySelectorAll(':scope > *');
              if (!childDivs.length) return;

              childDivs.forEach((div) => {
                const referrer = div.className || div.tagName;
                if (!elementsMinHeight[referrer]) return;

                if (div.offsetHeight < elementsMinHeight[referrer]) {
                  if (referrer === 'PICTURE') {
                    const img = div.querySelector('img');
                    if (!img) return;
                    img.style.objectFit = 'contain';
                    img.style.minHeight = `${elementsMinHeight[referrer]}px`;
                  } else {
                    div.style.minHeight = `${elementsMinHeight[referrer]}px`;
                  }
                }
              });
            });

            observer.unobserve(block);
          }
        });
      };

      const observer = new IntersectionObserver(onIntersect, { threshold: 0 });
      observer.observe(block);
    };

    setElementsHeight(block.querySelectorAll('.column'));
  }

  // variant for the colors pages
  if (block.classList.contains('color')) {
    const [primaryColor, accentColor] = rows[1]
      .querySelector(':scope > div')
      .textContent.trim()
      .split(',');
    const [textCol, svgCol] = Array.from(
      rows[0].querySelectorAll(':scope > div'),
    );
    const svgId = svgCol.textContent.trim();
    const svg = createTag('div', { class: 'img-wrapper' });

    svgCol.remove();
    rows[1].remove();
    textCol.classList.add('text');
    svg.innerHTML = `<svg class='color-svg-img'> <use href='/express/icons/color-sprite.svg#${svgId}'></use></svg>`;
    svg.style.backgroundColor = primaryColor;
    svg.style.fill = accentColor;
    rows[0].append(svg);

    const { default: isDarkOverlayReadable } = await import(
      '../../scripts/utils/color-tools.js'
    );

    if (isDarkOverlayReadable(primaryColor)) {
      block.classList.add('shadow');
    }
  }

  const phoneNumberTags = block.querySelectorAll(
    'a[title="{{business-sales-numbers}}"]',
  );
  if (phoneNumberTags.length > 0) {
    const { formatSalesPhoneNumber } = await import(
      '../../scripts/utils/location-utils.js'
    );
    await formatSalesPhoneNumber(phoneNumberTags);
  }

  // Tracking any video column blocks.
  const columnVideos = block.querySelectorAll('.column-video');
  if (columnVideos.length) {
    columnVideos.forEach((columnVideo) => {
      const parent = columnVideo.closest('.columns');
      const a = parent.querySelector('a');
      const adobeEventName = appendLinkText(`adobe.com:express:cta:learn:columns:${getExpressLandingPageType()}:`, a);

      parent.addEventListener('click', (e) => {
        e.stopPropagation();
        sendEventToAnalytics(adobeEventName);
      });
    });
  }
}
