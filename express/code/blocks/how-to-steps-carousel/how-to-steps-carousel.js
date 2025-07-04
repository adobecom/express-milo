/* eslint-disable import/named, import/extensions */
import { getLibs, decorateButtonsDeprecated } from '../../scripts/utils.js';
import { createOptimizedPicture } from '../../scripts/utils/media.js';
import { addHeaderSizing } from '../../scripts/utils/location-utils.js';

let createTag; let getConfig;
let rotationInterval;
let fixedImageSize = false;

function reset(block) {
  const howToWindow = block.ownerDocument.defaultView;

  howToWindow.clearInterval(rotationInterval);
  rotationInterval = null;

  const container = block.parentElement.parentElement;
  const picture = container.querySelector('picture');

  delete picture.style.height;
  container.classList.remove('no-cover');

  fixedImageSize = false;
}

const loadImage = (img) => new Promise((resolve) => {
  if (img.complete && img.naturalHeight !== 0) resolve();
  else {
    img.onload = () => {
      resolve();
    };
  }
});

function setPictureHeight(block, override) {
  if (!fixedImageSize || override) {
    // trick to fix the image height when vw > 900 and avoid image resize when toggling the tips
    const container = block.parentElement.parentElement;
    const picture = container.querySelector('picture');
    const img = picture.querySelector('img');
    const panelHeight = block.parentElement.offsetHeight;
    const imgHeight = img.naturalHeight;

    picture.style.height = `${panelHeight || imgHeight}px`;
    fixedImageSize = true;
  }
}

function activate(block, target) {
  if (block.classList.contains('image')) {
    setPictureHeight(block);
  }
  // de-activate all
  block.querySelectorAll('.tip, .tip-number').forEach((item) => {
    item.classList.remove('active');
    if (item.tagName === 'BUTTON') {
      item.setAttribute('aria-selected', 'false');
    }
  });
  // get index of the target
  const i = parseInt(target.getAttribute('data-tip-index'), 10);
  // activate corresponding number and tip
  block.querySelectorAll(`.tip-${i}`).forEach((elem) => {
    elem.classList.add('active');
    if (elem.tagName === 'BUTTON') {
      elem.setAttribute('aria-selected', 'true');
    }
  });
}

function initRotation(howToWindow, howToDocument) {
  if (howToWindow && !rotationInterval) {
    rotationInterval = howToWindow.setInterval(() => {
      howToDocument.querySelectorAll('.tip-numbers').forEach((numbers) => {
        // find next adjacent sibling of the currently activated tip
        let activeAdjacentSibling = numbers.querySelector('.tip-number.active+.tip-number');
        if (!activeAdjacentSibling) {
          // if no next adjacent, back to first
          activeAdjacentSibling = numbers.firstElementChild;
        }
        activate(numbers.parentElement, activeAdjacentSibling);
      });
    }, 5000);
  }
}

function buildHowToStepsCarousel(section, block, howToDocument, rows, howToWindow) {
  // join wrappers together
  section.querySelectorAll('.content').forEach((wrapper, i) => {
    if (i === 0) {
      // add block to first wrapper
      wrapper.append(block);
      wrapper.classList.remove('content');
    } else if (i >= 1) {
      // add children from rest of wrappers to first wrapper
      wrapper.previousElementSibling.append(...wrapper.children);
      wrapper.remove();
    }
  });

  const heading = section.querySelector('h2, h3, h4');

  const includeSchema = block.classList.contains('schema');

  // if you're thinking of copying this pattern, don't . Blocks should not be touching the section
  section.classList.add('how-to-steps-carousel-container');

  const schema = {
    '@context': 'http://schema.org',
    '@type': 'HowTo',
    name: (heading && heading.textContent.trim()) || howToDocument.title,
    step: [],
  };

  const numbers = createTag('nav', { class: 'tip-numbers' });
  numbers.setAttribute('role', 'tablist');
  block.prepend(numbers);
  const tips = createTag('div', { class: 'tips' });
  block.append(tips);

  rows.forEach((row, i) => {
    row.classList.add('tip');
    row.classList.add(`tip-${i + 1}`);
    row.setAttribute('data-tip-index', i + 1);

    const cells = Array.from(row.children);

    const h3 = createTag('h3');
    h3.innerHTML = cells[0].textContent.trim();
    const text = createTag('div', { class: 'tip-text' });
    text.append(h3);
    text.append(cells[1]);

    row.innerHTML = '';
    row.append(text);

    tips.prepend(row);

    schema.step.push({
      '@type': 'HowToStep',
      position: i + 1,
      name: h3.textContent.trim(),
      itemListElement: {
        '@type': 'HowToDirection',
        text: text.textContent.trim(),
      },
    });

    const number = createTag('button', {
      class: `tip-number tip-${i + 1}`,
      tabindex: '0',
      title: `${i + 1}`,
    });
    number.setAttribute('role', 'tab');
    number.innerHTML = `<span>${i + 1}</span>`;
    number.setAttribute('data-tip-index', i + 1);

    number.addEventListener('click', (e) => {
      if (rotationInterval) {
        howToWindow.clearTimeout(rotationInterval);
      }

      let { target } = e;
      if (e.target.nodeName.toLowerCase() === 'span') {
        target = e.target.parentElement;
      }
      activate(block, target);
    });

    number.addEventListener('keyup', (e) => {
      if (e.which === 13) {
        e.preventDefault();
        e.target.click();
      }
    });

    numbers.append(number);

    if (i === 0) {
      row.classList.add('active');
      number.classList.add('active');
    }
  });

  if (includeSchema) {
    const $schema = createTag('script', { type: 'application/ld+json' });
    $schema.innerHTML = JSON.stringify(schema);
    const $head = howToDocument.head;
    $head.append($schema);
  }

  if (howToWindow) {
    howToWindow.addEventListener('resize', () => {
      reset(block);
      activate(block, block.querySelector('.tip-number.tip-1'));
      initRotation(howToWindow, howToDocument);
    });
  }

  // set initial states
  const onIntersect = ([entry], observer) => {
    if (!entry.isIntersecting) return;

    activate(block, block.querySelector('.tip-number.tip-1'));
    initRotation(howToWindow, howToDocument);

    observer.unobserve(block);
  };

  const howToStepsObserver = new IntersectionObserver(onIntersect, { rootMargin: '1000px', threshold: 0 });
  howToStepsObserver.observe(block);
}

function roundedImage(x, y, width, height, radius, ctx) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function layerTemplateImage(canvas, ctx, templateImg) {
  templateImg.style.objectFit = 'contain';

  return new Promise((outerResolve) => {
    let prevWidth;
    const drawImage = (centerX, centerY, maxWidth, maxHeight) => new Promise((resolve) => {
      const obs = new ResizeObserver((changes) => {
        for (const change of changes) {
          if (change.contentRect.width === prevWidth) return;
          prevWidth = change.contentRect.width;
          if (prevWidth <= maxWidth && change.contentRect.height <= maxHeight) {
            ctx.save();
            roundedImage(
              centerX - (templateImg.width / 2),
              centerY - (templateImg.height / 2),
              templateImg.width,
              templateImg.height,
              7,
              ctx,
            );
            ctx.clip();
            ctx.drawImage(
              templateImg,
              0,
              0,
              templateImg.naturalWidth,
              templateImg.naturalHeight,
              centerX - (templateImg.width / 2),
              centerY - (templateImg.height / 2),
              templateImg.width,
              templateImg.height,
            );
            ctx.restore();
            obs.disconnect();
            resolve();
          }
        }
      });
      obs.observe(templateImg);
      templateImg.style.maxWidth = `${maxWidth}px`;
      templateImg.style.maxHeight = `${maxHeight}px`;
    });

    // start and end areas were directly measured and transferred from the spec image
    drawImage(1123, 600, 986, 652)
      .then(() => drawImage(1816, 479, 312, 472))
      .then(() => outerResolve());
  });
}

export default async function decorate(block) {
  ({ createTag, getConfig } = await import(`${getLibs()}/utils/utils.js`));
  const howToWindow = block.ownerDocument.defaultView;
  const howToDocument = block.ownerDocument;
  const isImageVariant = block.classList.contains('image');

  // move first image of container outside of div for styling
  const section = block.closest('.section');
  const howto = block;
  const rows = Array.from(howto.children);
  let picture;

  if (isImageVariant) {
    const canvasWidth = 2000;
    const canvasHeight = 1072;

    const placeholderImgUrl = createTag('div');
    let url;

    await import(`${getLibs()}/features/placeholders.js`).then(async (mod) => {
      url = await mod.replaceKey('how-to-steps-carousel-image-app', getConfig());
      return mod.replaceKey();
    });

    const alt = block.querySelector('picture > img').getAttribute('alt');
    const eagerLoad = document.querySelector('.block') === block;
    const backgroundPic = createOptimizedPicture(url, 'template in express', eagerLoad);
    const backgroundPicImg = backgroundPic.querySelector('img', { alt: 'template in express' });

    if (placeholderImgUrl) {
      backgroundPic.appendChild(backgroundPicImg);
      placeholderImgUrl.remove();
    }

    const templateDiv = rows.shift();
    const templateImg = templateDiv.querySelector(':scope picture > img');

    templateImg.style.visibility = 'hidden';
    templateImg.style.position = 'absolute';
    templateImg.removeAttribute('width');
    templateImg.removeAttribute('height');
    backgroundPicImg.style.width = `${canvasWidth}px`;
    if (window.screen.width < 600) backgroundPicImg.style.height = `${window.screen.width * 0.536}px`;
    picture = backgroundPic;
    section.prepend(picture);

    loadImage(backgroundPicImg).then(() => {
      backgroundPicImg.width = canvasWidth;
      const canvas = createTag('canvas', { width: canvasWidth, height: canvasHeight });
      const ctx = canvas.getContext('2d');
      ctx.drawImage(backgroundPicImg, 0, 0, canvasWidth, canvasHeight);
      const sources = backgroundPic.querySelectorAll(':scope > source');
      sources.forEach((source) => source.remove());
      return loadImage(templateImg).then(() => {
        layerTemplateImage(canvas, ctx, templateImg).then(() => {
          templateDiv.remove();
          const img = createTag('img');
          canvas.toBlob((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            img.src = blobUrl;
            backgroundPic.append(img);
            img.alt = alt;
            backgroundPicImg.remove();
            setPictureHeight(block, true);
          });
        });
      });
    });
  } else {
    picture = section.querySelector('picture');
    const parent = picture.parentElement;
    parent.remove();
    section.prepend(picture);
  }
  await decorateButtonsDeprecated(section);
  addHeaderSizing(section, getConfig);
  buildHowToStepsCarousel(section, block, howToDocument, rows, howToWindow);
}
