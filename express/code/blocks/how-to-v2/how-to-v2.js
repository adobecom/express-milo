/* eslint-disable import/named, import/extensions */
import { createTag } from '../../scripts/utils.js';

function setStepDetails(block, indexOpenedStep) {
  const listItems = block.querySelectorAll(':scope li');

  listItems.forEach((item, i) => {
    const detail = item.querySelector('.detail-container');
    const isOpen = i === indexOpenedStep;

    if (isOpen) {
      detail.classList.remove('closed');
      detail.style.maxHeight = `${detail.scrollHeight}px`;
      item.setAttribute('aria-expanded', 'true');
    } else {
      detail.classList.add('closed');
      detail.style.maxHeight = '0';
      item.setAttribute('aria-expanded', 'false');
    }
  });
}

function buildAccordion(block, rows, stepsContent) {
  let indexOpenedStep = 0;
  const list = createTag('OL', { class: 'steps' });

  rows.forEach((row, i) => {
    const [stepTitle, stepDetail] = row.querySelectorAll(':scope div');

    const newStepTitle = createTag('h3');
    newStepTitle.replaceChildren(...stepTitle.childNodes);

    const detailId = `step-detail-${i}`;
    const listItem = createTag('LI', {
      class: 'step',
      tabindex: '0',
      'aria-expanded': i === 0 ? 'true' : 'false',
      'aria-controls': detailId,
    });
    list.append(listItem);

    const listItemIndicator = createTag('div', { class: 'step-indicator' });
    const listItemContent = createTag('div', { class: 'step-content' });

    const detailText = stepDetail;
    detailText && detailText.classList.add('detail-text');

    const detailContainer = createTag('div', {
      class: 'detail-container',
      id: detailId,
    });

    if (i !== 0) {
      detailContainer.classList.add('closed');
    }

    detailContainer.append(detailText);

    listItem.append(listItemIndicator);
    listItem.append(listItemContent);

    listItemContent.append(newStepTitle);
    listItemContent.append(detailContainer);

    const handleOpenDetails = (ev) => {
      indexOpenedStep = i;
      setStepDetails(block, indexOpenedStep);
      ev.preventDefault();
    };

    newStepTitle.addEventListener('click', handleOpenDetails);
    listItem.addEventListener('keyup', (ev) => ev.which === 13 && handleOpenDetails(ev));
  });

  stepsContent.append(list);

  // set this in the next event cycle when scrollHeight has been established
  setTimeout(() => {
    setStepDetails(block, indexOpenedStep);
  }, 0);
}

export default function decorate(block) {
  const rows = Array.from(block.children);

  const backgroundRow = block.children[0];
  const backgroundImage = backgroundRow.querySelector('img');
  const backgroundURL = backgroundImage?.src;
  const hasBackground = !!backgroundURL;
  const stepsContent = createTag('div', { class: 'steps-content' });

  if (hasBackground) {
    // So that background image goes beyond container
    rows.shift();
    const stepsContentBackground = createTag('div', { class: 'steps-content-backg' });
    const stepsContentBackgroundImg = createTag('img', { class: 'steps-content-backg-image' });
    stepsContent.append(stepsContentBackground);
    stepsContentBackground.append(stepsContentBackgroundImg);
    stepsContentBackgroundImg.src = backgroundURL;
  }

  const mediaData = rows.shift();
  const mediaEl = mediaData.querySelector('picture') || mediaData.querySelector('a');
  block.removeChild(block.children[0]);
  const mediaContainerEl = createTag('div', { class: 'media-container' });
  mediaContainerEl.append(mediaEl);
  stepsContent.append(mediaContainerEl);

  block.append(stepsContent);
  buildAccordion(block, rows, stepsContent);
}
