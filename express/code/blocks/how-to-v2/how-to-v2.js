/* eslint-disable import/named, import/extensions */
import { createTag } from '../../scripts/utils.js';

function setStepDetails(block, indexOpenedStep) {
  const listItems = block.querySelectorAll(':scope li');

  listItems.forEach((item, i) => {
    const detail = item.querySelector('.detail-container');

    if (i === indexOpenedStep) {
      detail.classList.remove('closed');
      detail.style.maxHeight = `${detail.scrollHeight}px`;
    } else {
      detail.classList.add('closed');
      detail.style.maxHeight = '0';
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

    const listItem = createTag('LI', { class: 'step', tabindex: '0' });
    list.append(listItem);

    const listItemIndicator = createTag('div', { class: 'step-indicator' });
    const listItemContent = createTag('div', { class: 'step-content' });

    const detailText = stepDetail;
    detailText && detailText.classList.add('detail-text');

    const detailContainer = createTag('div', { class: 'detail-container' });

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

export default async function decorate(block) {
  const section = block.closest('.section');
  const rows = Array.from(block.children);

  const backgroundRow = block.children[0];
  const backgroundImage = backgroundRow.querySelector('img');
  const backgroundURL = backgroundImage?.src;
  const hasBackground = !!backgroundURL;

  if (hasBackground) {
    rows.shift();
  }

  const stepsContent = createTag('div', { class: 'steps-content' });

  if (hasBackground) {
    // So that background image goes beyond container
    const stepsContentBackground = createTag('div', { class: 'steps-content-backg' });
    const stepsContentBackgroundImg = createTag('img', { class: 'steps-content-backg-image' });
    stepsContent.append(stepsContentBackground);
    stepsContentBackground.append(stepsContentBackgroundImg);
    stepsContentBackgroundImg.src = backgroundURL;
  }

  // if (isVideoVariant) {
  //   const videoData = rows.shift();

  //   // remove the added social link from the block DOM
  //   block.removeChild(block.children[0]);

  //   const videoLink = videoData.querySelector('a');
  //   const youtubeURL = videoLink?.href;
  //   const url = new URL(youtubeURL);

  //   const videoContainerEl = createTag('div', { class: 'video-container' });

  //   const videoEl = embedYoutube(url);
  //   videoEl.classList.add('video-how-to-steps-accordion');

  //   videoContainerEl.append(videoEl);
  //   stepsContent.append(videoContainerEl);
  // } else {
  //   const imageData = rows.shift();
  //   const imageEl = imageData.querySelector('picture');
  //   const imageContainerEl = createTag('div', { class: 'image-container' });
  //   imageContainerEl.append(imageEl);
  //   stepsContent.append(imageContainerEl);
  // }

  const heading = section.querySelector('h2, h3, h4');
  block.replaceChildren(heading, stepsContent);
  buildAccordion(block, rows, stepsContent);
}
