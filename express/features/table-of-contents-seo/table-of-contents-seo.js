/* eslint-disable import/named, import/extensions */
import { getLibs } from '../../scripts/utils.js';
import { debounce } from '../../scripts/utils/hofs.js';
import { getIconElementDeprecated } from '../../scripts/utils/icons.js';

const imports = await Promise.all([import(`${getLibs()}/utils/utils.js`)]);
const { createTag, getMetadata } = imports[0];

const MOBILE_SIZE = 600;
const MOBILE = 'MOBILE';
const DESKTOP = 'DESKTOP';
const getDeviceType = (() => {
  let deviceType = window.innerWidth >= MOBILE_SIZE ? DESKTOP : MOBILE;
  const updateDeviceType = () => {
    deviceType = window.innerWidth >= MOBILE_SIZE ? DESKTOP : MOBILE;
  };
  window.addEventListener('resize', debounce(updateDeviceType, 100));
  return () => deviceType;
})();

function setBoldStyle(element) {
  const tocNumber = element.querySelector('.toc-number');
  const tocLink = element.querySelector('a');

  if (tocNumber) {
    tocNumber.classList.remove('toc-normal');
    tocNumber.classList.add('toc-bold');
  }

  if (tocLink) {
    tocLink.classList.remove('toc-normal');
    tocLink.classList.add('toc-bold');
  }
}

function setNormalStyle(element) {
  const tocNumber = element.querySelector('.toc-number');
  const tocLink = element.querySelector('a');

  if (tocNumber) {
    tocNumber.classList.remove('toc-bold');
    tocNumber.classList.add('toc-normal');
  }

  if (tocLink) {
    tocLink.classList.remove('toc-bold');
    tocLink.classList.add('toc-normal');
  }
}

function addHoverEffect(tocEntries) {
  tocEntries.forEach(({ tocItem }) => {
    tocItem.addEventListener('mouseenter', () => setBoldStyle(tocItem));
    tocItem.addEventListener('mouseleave', () => setNormalStyle(tocItem));
  });
}

function addTOCTitle(toc, title) {
  const tocTitle = createTag('div', { class: 'toc-title' });
  const arrowDownIcon = getIconElementDeprecated('arrow-gradient-down');
  Object.assign(arrowDownIcon.style, { width: '18px', height: '18px' });
  toc.appendChild(tocTitle).append(arrowDownIcon, document.createTextNode(title));
}

function formatHeadingText(headingText) {
  const cleanedText = headingText.replace('Adobe Express', '').trim();
  const latinRegex = /^[\x20-\x7F]+$/;
  const allNonLatin = !latinRegex.test(cleanedText);
  const maxLength = allNonLatin ? 12 : 25;
  const textToFormat = allNonLatin ? cleanedText : headingText;
  return textToFormat.length > maxLength
    ? `${textToFormat.substring(0, maxLength)}...`
    : textToFormat;
}

function assignHeadingIdIfNeeded(heading, headingText) {
  if (!heading.id) {
    heading.id = headingText.replace(/\s+/g, '-').toLowerCase();
  }
}

function addTOCItemClickEvent(tocItem, heading) {
  tocItem.addEventListener('click', (event) => {
    event.preventDefault();
    const headerElement = document.getElementById(heading.id);
    if (headerElement) {
      const headerRect = headerElement.getBoundingClientRect();
      const headerOffset = 70;
      const offsetPosition = headerRect.top + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    } else {
      console.error(`Element with id "${heading.id}" not found.`);
    }
  });
}

function findCorrespondingHeading(headingText, doc) {
  return Array.from(doc.querySelectorAll('main :is(h2, h3, h4)'))
    .find((h) => h.textContent.trim().includes(headingText.replace('...', '').trim()));
}

function handleTOCCloning(toc, tocEntries) {
  tocEntries.forEach(({ heading }) => {
    const tocClone = toc.cloneNode(true);
    tocClone.classList.add('mobile-toc');
    const clonedTOC = tocClone.cloneNode(true);
    heading.parentNode.prepend(clonedTOC, heading);
    const clonedTOCEntries = clonedTOC.querySelectorAll('.toc-entry');
    clonedTOCEntries.forEach((tocEntry, index) => {
      addTOCItemClickEvent(tocEntry, tocEntries[index].heading);
    });
  });

  const originalTOC = document.querySelector('.table-of-contents-seo');
  if (originalTOC) originalTOC.style.display = 'none';
}

function setupTOCItem(tocItem, tocCounter, headingText, headingId) {
  tocItem.innerHTML = `
    <span class="toc-number">${tocCounter}.</span>
    <a href="#${headingId}" daa-ll="${headingText}-${tocCounter}--">
      ${headingText}
    </a>
  `;
}

function styleHeadingLink(heading, tocCounter, toc) {
  const numberCircle = createTag('span', {
    class: 'number-circle',
    'data-number': tocCounter,
  });
  const tocClone = toc.cloneNode(true);
  tocClone.classList.add('mobile-toc');
  heading.prepend(numberCircle);
}

function addTOCEntries(toc, config, doc) {
  let tocCounter = 1;
  const tocEntries = [];

  Object.keys(config).forEach((key) => {
    if (key.startsWith('content-')) {
      const tocItem = createTag('div', { class: 'toc-entry' });
      const headingText = formatHeadingText(config[key]);
      const heading = findCorrespondingHeading(headingText, doc);

      if (heading) {
        assignHeadingIdIfNeeded(heading, headingText);
        setupTOCItem(tocItem, tocCounter, headingText, heading.id);

        const verticalLine = createTag('div', { class: 'vertical-line' });
        addTOCItemClickEvent(tocItem, heading);

        tocItem.insertBefore(createTag('span', { class: 'toc-line' }), tocItem.firstChild);
        tocItem.insertBefore(verticalLine, tocItem.firstChild);
        toc.appendChild(tocItem);
        tocEntries.push({ tocItem, heading });

        styleHeadingLink(heading, tocCounter, toc);
        setNormalStyle(tocItem);
        tocCounter += 1;
      }
    }
  });

  if (getDeviceType() !== DESKTOP) handleTOCCloning(toc, tocEntries);

  return tocEntries;
}

function setTOCPosition(toc, tocContainer) {
  const firstLink = toc.querySelector('.toc-entry a');
  if (!firstLink || !tocContainer) {
    return;
  }

  const href = firstLink.getAttribute('href');
  const partialId = href.slice(1).substring(0, 10);
  const targetElement = document.querySelector(`[id^="${partialId}"]`);

  if (!targetElement) {
    return;
  }

  const rect = targetElement.getBoundingClientRect();
  const targetTop = Math.round(window.scrollY + rect.top);
  const viewportMidpoint = window.innerHeight / 2;

  tocContainer.style.top = targetTop <= window.scrollY + viewportMidpoint
    ? `${viewportMidpoint}px`
    : `${targetTop}px`;

  tocContainer.style.position = targetTop <= window.scrollY + viewportMidpoint ? 'fixed' : 'absolute';
  tocContainer.style.display = 'block';
}

function handleSetTOCPos(toc, tocContainer) {
  window.addEventListener('scroll', () => setTOCPosition(toc, tocContainer));
}

function applyTOCBehavior(toc, tocContainer) {
  document.querySelectorAll('.mobile-toc').forEach((mobileToc) => {
    mobileToc.style.display = 'none';
  });
  handleSetTOCPos(toc, tocContainer);
}

function initializeTOCContainer() {
  const tocContainer = document.querySelector('.table-of-contents-seo');
  tocContainer.style.display = 'none';
  return tocContainer;
}

function handleActiveTOCHighlighting(tocEntries) {
  let activeEntry = null;

  window.addEventListener('scroll', () => {
    const currentHeading = tocEntries.find(({ heading }) => {
      const headerElement = document.getElementById(heading.id);
      const rect = headerElement.getBoundingClientRect();
      return rect.top <= window.innerHeight / 2 && rect.bottom > 0;
    })?.tocItem;

    if (!currentHeading) return;

    if (currentHeading !== activeEntry) {
      if (activeEntry) {
        setNormalStyle(activeEntry);
        activeEntry.classList.remove('active');
      }
      activeEntry = currentHeading;
      if (activeEntry) {
        setBoldStyle(activeEntry);
        activeEntry.classList.add('active');
      }
    }
  });
}

function buildMetadataConfigObject() {
  const title = getMetadata('toc-title');
  const contents = [];
  let i = 1;
  let content = getMetadata(`content-${i}`);

  while (content) {
    contents.push({ [`content-${i}`]: content });
    i += 1;
    content = getMetadata(`content-${i}`);
  }
  const config = contents.reduce((acc, el) => ({
    ...acc,
    ...el,
  }), { title });
  return config;
}

export default async function setTOCSEO() {
  const doc = document.querySelector('main');
  const config = buildMetadataConfigObject();
  const tocSEO = createTag('div', { class: 'table-of-contents-seo' });
  const toc = createTag('div', { class: 'toc' });
  if (config.title) addTOCTitle(toc, config.title);

  let tocEntries;
  if (getDeviceType() === DESKTOP) {
    tocEntries = addTOCEntries(toc, config, doc);
    addHoverEffect(tocEntries);
    tocSEO.appendChild(toc);
    doc.appendChild(tocSEO);
    const tocContainer = initializeTOCContainer();
    applyTOCBehavior(toc, tocContainer);
    handleActiveTOCHighlighting(tocEntries);
  } else {
    setTimeout(() => {
      tocEntries = addTOCEntries(toc, config, doc);
    }, 50);
  }
}
