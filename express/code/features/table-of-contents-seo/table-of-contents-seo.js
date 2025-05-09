/* eslint-disable import/named, import/extensions */
import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';

let createTag; let getMetadata;

const MOBILE_SIZE = 600;
let MOBILE_NAV_HEIGHT;

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
    tocItem.addEventListener('mouseenter', () => {
      if (!tocItem.classList.contains('active')) {
        setBoldStyle(tocItem);
      }
    });

    tocItem.addEventListener('mouseleave', () => {
      if (!tocItem.classList.contains('active')) {
        setNormalStyle(tocItem);
      }
    });
  });
}

function addTOCTitle(toc, { title, icon }) {
  if (!title) return;

  const tocTitle = createTag('div', { class: 'toc-title' });
  tocTitle.append(document.createTextNode(title));

  if (icon) {
    const arrowDownIcon = getIconElementDeprecated('arrow-gradient-down');
    Object.assign(arrowDownIcon.style, { width: '18px', height: '18px' });
    tocTitle.prepend(arrowDownIcon);
  }

  toc.appendChild(tocTitle);
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
  function scrollToHeading(targetHeading) {
    const headerElement = document.getElementById(targetHeading.id);
    if (headerElement) {
      const headerRect = headerElement.getBoundingClientRect();
      const headerOffset = 70;
      const offsetPosition = headerRect.top + window.scrollY - headerOffset - MOBILE_NAV_HEIGHT;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    } else {
      window.lana.log(`Element with id "${targetHeading.id}" not found.`);
    }
    document.querySelector('.toc-content')?.classList.toggle('open');
  }

  tocItem.addEventListener('click', (event) => {
    event.preventDefault();
    scrollToHeading(heading);
  });

  tocItem.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToHeading(heading);
    }
  });

  tocItem.addEventListener('focus', () => {
    tocItem.classList.add('toc-focus');
  });

  tocItem.addEventListener('blur', () => {
    tocItem.classList.remove('toc-focus');
  });

  tocItem.setAttribute('tabindex', '0');
}

function findCorrespondingHeading(headingText, doc) {
  return Array.from(doc.querySelectorAll('main :is(h2, h3, h4)'))
    .find((h) => h.textContent.trim().includes(headingText.replace('...', '').trim()));
}
function toggleSticky(tocClone, sticky) {
  const main = document.querySelector('main .section');
  if (window.scrollY >= sticky + MOBILE_NAV_HEIGHT) {
    tocClone.classList.add('sticky');
    tocClone.style.top = `${MOBILE_NAV_HEIGHT}px`;
    main.style.marginBottom = '60px';
  } else {
    tocClone.classList.remove('sticky');
    tocClone.style.top = '';
    main.style.marginBottom = '0';
  }
}

function handleTOCCloning(toc, tocEntries) {
  const mainElement = document.querySelector('.section').firstElementChild;

  if (mainElement) {
    const tocClone = toc.cloneNode(true);
    tocClone.classList.add('mobile-toc');
    tocClone.setAttribute('role', 'navigation');
    tocClone.setAttribute('aria-label', 'Table of Contents');

    const titleWrapper = createTag('button', {
      class: 'toc-title-wrapper',
      'aria-expanded': 'false',
      'aria-controls': 'mobile-toc-content',
      type: 'button',
      id: 'mobile-toc-button',
    });

    const tocTitle = tocClone.querySelector('.toc-title');
    if (tocTitle) {
      tocTitle.setAttribute('role', 'heading');
      tocTitle.setAttribute('aria-level', '2');
    }

    const tocChevron = document.createElement('span');
    tocChevron.className = 'toc-chevron';
    tocChevron.setAttribute('aria-hidden', 'true');

    titleWrapper.appendChild(tocTitle);
    titleWrapper.appendChild(tocChevron);

    tocClone.insertBefore(titleWrapper, tocClone.firstChild);

    const tocContent = createTag('ul', {
      class: 'toc-content',
      id: 'mobile-toc-content',
      'aria-label': 'Table of Contents Sections',
    });

    const entries = tocClone.querySelectorAll('.toc-entry');
    entries.forEach((entry) => {
      const li = document.createElement('li');

      Array.from(entry.attributes).forEach((attr) => {
        li.setAttribute(attr.name, attr.value);
      });

      li.innerHTML = entry.innerHTML;

      entry.parentNode.replaceChild(li, entry);
    });

    tocClone.querySelectorAll('.toc-entry').forEach((entry) => {
      tocContent.appendChild(entry);
    });

    tocClone.appendChild(tocContent);
    mainElement.insertAdjacentElement('afterend', tocClone);

    // Add click event listener for the title wrapper
    titleWrapper.addEventListener('click', () => {
      const isExpanded = tocContent.classList.toggle('open');
      tocChevron.classList.toggle('up');
      titleWrapper.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });

    // Add keyboard event listener for the title wrapper
    titleWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        titleWrapper.click();
      }
    });

    // Add escape key handler to close the TOC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && tocContent.classList.contains('open')) {
        tocContent.classList.remove('open');
        tocChevron.classList.remove('up');
        titleWrapper.setAttribute('aria-expanded', 'false');
        titleWrapper.focus();
      }
    });

    const clonedTOCEntries = tocContent.querySelectorAll('.toc-entry');
    clonedTOCEntries.forEach((tocEntry, index) => {
      addTOCItemClickEvent(tocEntry, tocEntries[index]?.heading);
    });

    const sticky = tocClone.offsetTop - MOBILE_NAV_HEIGHT;
    window.addEventListener('scroll', () => toggleSticky(tocClone, sticky));
  }
}

function setupTOCItem(tocItem, tocCounter, headingText, headingId) {
  tocItem.innerHTML = `
    <span class="toc-number">${tocCounter}</span>
    <a href="#${headingId}" daa-ll="${headingText}-${tocCounter}--table-of-contents">
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
  const showContentNumbers = config['toc-content-numbers'];
  const useEllipsis = config['toc-content-ellipsis'];

  Object.keys(config).forEach((key) => {
    if (key.startsWith('content-') && !key.endsWith('-short')) {
      const tocItem = createTag('div', { class: 'toc-entry' });

      const shortKey = `${key}-short`;
      let headingText = config[shortKey] || config[key];

      if (useEllipsis) {
        headingText = formatHeadingText(headingText);
      }

      const heading = findCorrespondingHeading(config[key], doc);

      if (heading) {
        assignHeadingIdIfNeeded(heading, config[key]);
        setupTOCItem(tocItem, tocCounter, headingText, heading.id);

        const verticalLine = createTag('div', { class: 'vertical-line' });
        addTOCItemClickEvent(tocItem, heading);

        tocItem.insertBefore(createTag('span', { class: 'toc-line' }), tocItem.firstChild);
        tocItem.insertBefore(verticalLine, tocItem.firstChild);
        toc.appendChild(tocItem);
        tocEntries.push({ tocItem, heading });

        // eslint-disable-next-line chai-friendly/no-unused-expressions
        showContentNumbers && styleHeadingLink(heading, tocCounter, toc);
        setNormalStyle(tocItem);
        tocCounter += 1;
      }
    }
  });

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

  const footer = document.querySelector('footer');

  if (footer) {
    const footerRect = footer.getBoundingClientRect();
    const footerTop = Math.round(window.scrollY + footerRect.top);
    const tocBottom = Math.round(window.scrollY + tocContainer.getBoundingClientRect().bottom);

    const positionDifference = tocBottom - footerTop;

    if (positionDifference >= 0) {
      tocContainer.style.position = 'absolute';
      tocContainer.style.top = `${footerTop - tocContainer.offsetHeight + 92}px`;
    } else if (targetTop <= window.scrollY + viewportMidpoint) {
      tocContainer.style.position = 'fixed';
      tocContainer.style.top = `${viewportMidpoint}px`;
    }
  }
}

function handleSetTOCPos(toc, tocContainer) {
  window.addEventListener('scroll', () => setTOCPosition(toc, tocContainer));
}

function applyTOCBehavior(toc, tocContainer) {
  handleSetTOCPos(toc, tocContainer);

  const tocContent = toc.querySelector('.toc-content');
  const tocChevron = toc.querySelector('.toc-chevron');
  const titleWrapper = toc.querySelector('.toc-title-wrapper');

  if (titleWrapper && tocContent) {
    titleWrapper.setAttribute('aria-expanded', 'false');
    titleWrapper.setAttribute('aria-controls', 'desktop-toc-content');
    tocContent.id = 'desktop-toc-content';

    titleWrapper.addEventListener('click', () => {
      const isExpanded = tocContent.classList.toggle('open');
      tocChevron.classList.toggle('up');
      titleWrapper.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });

    titleWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        titleWrapper.click();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && tocContent.classList.contains('open')) {
        tocContent.classList.remove('open');
        tocChevron.classList.remove('up');
        titleWrapper.setAttribute('aria-expanded', 'false');
        titleWrapper.focus();
      }
    });
  }
}

function initializeTOCContainer() {
  const tocContainer = document.querySelector('.table-of-contents-seo');
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
  const showContentNumbers = getMetadata('toc-content-numbers');
  const contents = [];
  let i = 1;
  let content = getMetadata(`content-${i}`);

  while (content) {
    const abbreviatedContent = getMetadata(`content-${i}-short`);
    if (abbreviatedContent) {
      contents.push({ [`content-${i}-short`]: abbreviatedContent });
    }
    contents.push({ [`content-${i}`]: content });
    i += 1;
    content = getMetadata(`content-${i}`);
  }

  const config = contents.reduce((acc, el) => ({
    ...acc,
    ...el,
  }), { title, 'toc-content-numbers': showContentNumbers });

  return config;
}

export default async function setTOCSEO() {
  ({ createTag, getMetadata } = await import(`${getLibs()}/utils/utils.js`));
  const doc = document.querySelector('main');
  const config = buildMetadataConfigObject();

  try {
    const { getGnavHeight } = await import(`${getLibs()}/blocks/global-navigation/utilities/utilities.js`);
    MOBILE_NAV_HEIGHT = getGnavHeight();
  } catch (e) {
    window.lana?.log(`Error getting gnav height ${e}`);
  }

  const desktopSkipLink = createTag('a', {
    href: '#desktop-toc',
    class: 'skip-link desktop-skip-link',
    'aria-label': 'Skip to Table of Contents',
  });
  desktopSkipLink.textContent = 'Skip to Table of Contents';

  const mobileSkipLink = createTag('a', {
    href: '#mobile-toc-button',
    class: 'skip-link mobile-skip-link',
    'aria-label': 'Skip to Mobile Table of Contents',
  });
  mobileSkipLink.textContent = 'Skip to Mobile Table of Contents';

  // Add skip links to the document
  document.body.insertBefore(desktopSkipLink, document.body.firstChild);
  document.body.insertBefore(mobileSkipLink, document.body.firstChild);

  const tocSEO = createTag('div', {
    class: 'table-of-contents-seo',
    id: 'desktop-toc',
  });
  const toc = createTag('div', {
    class: 'toc',
    tabindex: '0',
    role: 'navigation',
    'aria-label': 'Table of Contents',
  });
  if (config.title) addTOCTitle(toc, config);

  tocSEO.appendChild(toc);
  doc.appendChild(tocSEO);
  const tocContainer = initializeTOCContainer();

  const tocEntries = addTOCEntries(toc, config, doc);
  addHoverEffect(tocEntries);

  handleTOCCloning(toc, tocEntries);

  applyTOCBehavior(toc, tocContainer);
  handleActiveTOCHighlighting(tocEntries);

  let currentMode = null;

  const handleResize = () => {
    const isMobile = window.innerWidth < MOBILE_SIZE;
    const mobileTOC = document.querySelector('.mobile-toc');

    if (currentMode === isMobile) return;
    currentMode = isMobile;

    if (isMobile) {
      tocSEO.classList.add('mobile-view');
      if (mobileTOC) {
        mobileTOC.classList.remove('desktop-view');
        mobileTOC.id = 'mobile-toc';
      }
      mobileSkipLink.classList.remove('hidden');
      desktopSkipLink.classList.add('hidden');
    } else {
      tocSEO.classList.remove('mobile-view');
      if (mobileTOC) {
        mobileTOC.classList.add('desktop-view');
      }
      setTOCPosition(toc, tocContainer);
      desktopSkipLink.classList.remove('hidden');
      mobileSkipLink.classList.add('hidden');
    }
  };

  handleResize();

  window.addEventListener('resize', handleResize);

  toc.addEventListener('focus', () => {
    toc.classList.add('toc-focused');
  });

  toc.addEventListener('blur', () => {
    toc.classList.remove('toc-focused');
  });
}
