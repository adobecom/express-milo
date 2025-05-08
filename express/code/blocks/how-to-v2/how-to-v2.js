/* eslint-disable import/named, import/extensions */
import { createTag } from '../../scripts/utils.js';

function setStepDetails(block, indexOpenedStep) {
  const listItems = block.querySelectorAll(':scope li');

  listItems.forEach((item, i) => {
    const detail = item.querySelector('.detail-container');
    const detailText = item.querySelector('.detail-text');
    const isOpen = i === indexOpenedStep;

    if (isOpen) {
      detail.classList.remove('closed');
      detail.style.maxHeight = `${detail.scrollHeight}px`;
      item.setAttribute('aria-expanded', 'true');
      detail.setAttribute('aria-hidden', 'false');
      detailText.setAttribute('aria-hidden', 'false');
    } else {
      detail.classList.add('closed');
      detail.style.maxHeight = '0';
      item.setAttribute('aria-expanded', 'false');
      detail.setAttribute('aria-hidden', 'true');
      detailText.setAttribute('aria-hidden', 'true');
    }
  });
}

function buildAccordion(block, rows, stepsContent) {
  let indexOpenedStep = 0;
  const list = createTag('OL', { class: 'steps' });

  rows.forEach((row, i) => {
    const [stepTitle, stepDetail] = row.querySelectorAll(':scope div');

    const titleId = `step-title-${i}`;
    const detailId = `step-detail-${i}`;

    const newStepTitle = createTag('h3', { id: titleId });
    newStepTitle.replaceChildren(...stepTitle.childNodes);

    const listItem = createTag('LI', {
      class: 'step',
      tabindex: '0',
      'aria-expanded': i === 0 ? 'true' : 'false',
      'aria-controls': detailId,
    });
    list.append(listItem);

    listItem.setAttribute('aria-label', `Step ${i + 1}: ${newStepTitle.textContent.trim()}`);

    const listItemIndicator = createTag('div', { class: 'step-indicator' });
    const listItemContent = createTag('div', { class: 'step-content' });

    const detailText = stepDetail;
    detailText && detailText.classList.add('detail-text');
    detailText.setAttribute('role', 'region');
    detailText.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');

    const detailContainer = createTag('div', {
      class: 'detail-container',
      id: detailId,
      'aria-labelledby': titleId,
      role: 'region',
      'aria-hidden': i === 0 ? 'false' : 'true',
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
    const mediaWrapper = createTag('div', { class: 'media-wrapper' });
    const stepsContentBackground = createTag('div', { class: 'steps-content-backg' });
    const stepsContentBackgroundImg = createTag('img', { class: 'steps-content-backg-image' });
    stepsContentBackground.append(stepsContentBackgroundImg);
    stepsContentBackgroundImg.src = backgroundURL;
    mediaWrapper.append(stepsContentBackground);

    const mediaContainerEl = createTag('div', { class: 'media-container' });
    const mediaData = rows.shift();
    const mediaEl = mediaData.querySelector('picture') || mediaData.querySelector('a');
    block.removeChild(block.children[0]);
    mediaContainerEl.append(mediaEl);
    mediaWrapper.append(mediaContainerEl);
    stepsContent.append(mediaWrapper);
  } else {
    const mediaContainerEl = createTag('div', { class: 'media-container' });
    const mediaData = rows.shift();
    const mediaEl = mediaData.querySelector('picture') || mediaData.querySelector('a');
    block.removeChild(block.children[0]);
    mediaContainerEl.append(mediaEl);
    stepsContent.append(mediaContainerEl);
  }

  block.append(stepsContent);
  buildAccordion(block, rows, stepsContent);
}
