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

    const listItemIndicator = createTag('div', { class: 'step-indicator' });
    const listItemContent = createTag('div', { class: 'step-content' });

    const detailText = stepDetail;
    detailText && detailText.classList.add('detail-text');
    const ariaLabelStepTitle = newStepTitle.innerText.replace(/^\d+\.\s*/, '');
    const detailContainer = createTag('div', {
      class: 'detail-container',
      id: detailId,
      'aria-labelledby': ariaLabelStepTitle,
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

  setTimeout(() => {
    const firstStepTitle = list.querySelector('h3');
    firstStepTitle.click();
  }, 100);
}

export default function decorate(block) {
  // LCP optimization: Check if this is a priority block for faster processing
  const isLCPPriority = block.hasAttribute('data-lcp-priority');
  const isFirstSection = block.closest('.section') === document.querySelector('.section');

  // Critical LCP optimization: Ensure first section dominates viewport
  if (isFirstSection) {
    const section = block.closest('.section');
    section.style.minHeight = '100vh';
    section.classList.add('lcp-section');

    // Add high-entropy background for better LCP detection
    if (!section.querySelector('img')) {
      section.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }

  const rows = Array.from(block.children);

  const backgroundRow = block.children[0];
  const backgroundImage = backgroundRow.querySelector('img');
  const backgroundURL = backgroundImage?.src;
  const hasBackground = !!backgroundURL;
  const stepsContent = createTag('div', { class: 'steps-content' });

  if (hasBackground) {
    rows.shift();
    // Optimize background image loading based on priority
    const optimizedURL = backgroundURL.replace(/width=\d+/, 'width=750');

    // For LCP-critical blocks, ensure immediate loading
    if (isLCPPriority || isFirstSection) {
      // Preload critical background images
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimizedURL;
      document.head.appendChild(link);
    }

    block.style.setProperty('--background-image', `url('${optimizedURL}')`);
  }

  const mediaData = rows.shift();
  const mediaEl = mediaData.querySelector('picture') || mediaData.querySelector('a');
  block.removeChild(block.children[0]);
  const mediaContainerEl = createTag('div', { class: 'media-container' });

  // Optimize media loading based on block priority and position
  if (mediaEl && mediaEl.tagName === 'A') {
    try {
      const parsedUrl = new URL(mediaEl.href, document.baseURI);
      const allowedYoutubeHosts = [
        'youtube.com',
        'www.youtube.com',
        'm.youtube.com',
      ];
      if (allowedYoutubeHosts.includes(parsedUrl.hostname)) {
        // For LCP-critical blocks, prioritize loading; otherwise defer
        if (isLCPPriority || isFirstSection) {
          mediaEl.setAttribute('fetchpriority', 'high');
          mediaEl.removeAttribute('loading'); // Ensure immediate loading
        } else {
          mediaEl.setAttribute('loading', 'lazy');
          mediaEl.setAttribute('fetchpriority', 'low');
        }
      }
    } catch (e) {
      // URL parsing failed; do not optimize
    }
  }

  // For images in LCP-critical blocks, ensure eager loading and preloading
  if (mediaEl && mediaEl.tagName === 'PICTURE' && (isLCPPriority || isFirstSection)) {
    const img = mediaEl.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');

      // Preload the LCP image immediately
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = img.src || img.getAttribute('src');
      preloadLink.fetchpriority = 'high';
      document.head.appendChild(preloadLink);

      // Add size attributes for LCP optimization
      if (!img.width) img.width = 800;
      if (!img.height) img.height = 400;
    }
  }

  mediaContainerEl.append(mediaEl);
  stepsContent.append(mediaContainerEl);

  // Create basic structure immediately for LCP
  block.append(stepsContent);

  // Defer accordion building for non-critical blocks to improve LCP
  if (isLCPPriority || isFirstSection) {
    buildAccordion(block, rows, stepsContent);
  } else if (window.requestIdleCallback) {
    requestIdleCallback(() => buildAccordion(block, rows, stepsContent));
  } else {
    setTimeout(() => buildAccordion(block, rows, stepsContent), 0);
  }
}
