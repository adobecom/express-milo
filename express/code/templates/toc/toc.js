/* eslint-disable import/named, import/extensions */
import { getLibs } from '../../scripts/utils.js';

let createTag;

function isFollowing(nodeA, nodeB) {
  if (!nodeA || !nodeB) return false;
  return Boolean(nodeA.compareDocumentPosition(nodeB) & Node.DOCUMENT_POSITION_FOLLOWING);
}

function appendIfFollowing(anchor, candidates, container) {
  candidates.forEach((node) => {
    if (isFollowing(anchor, node)) container.append(node);
  });
}

async function decorateTOCTemplate() {
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));

  const main = document.querySelector('main');
  if (!main) {
    document.body.style.visibility = 'visible';
    return;
  }

  const tocSeo = main.querySelector('.toc-seo');

  // Build wrapper structure
  const section = createTag('div', { class: 'section' });
  section.setAttribute('template', 'toc');
  const wrapper = createTag('div', { class: 'template-toc-wrapper container' });
  const leftColumn = createTag('div', { class: 'col-3' });
  const rightColumn = createTag('div', { class: 'col-7' });

  // Find the section containing the highlight (kept outside wrapper)
  const sections = Array.from(main.querySelectorAll(':scope > div.section'));
  const highlightSection = sections.find((s) => s.querySelector(':scope > .highlight, .highlight')) || sections[0] || null;

  // Insert wrapper section immediately after highlight section
  const insertAfter = highlightSection && highlightSection.nextElementSibling ? highlightSection.nextElementSibling : sections[0];
  if (insertAfter) {
    main.insertBefore(section, insertAfter);
  } else {
    main.append(section);
  }

  // If authored TOC exists, move it into left column and remove empty shell
  if (tocSeo) {
    leftColumn.append(tocSeo);
    const tocSection = tocSeo.closest('main > div.section');
    if (tocSection && tocSection !== highlightSection && tocSection.querySelectorAll(':scope > div > *').length === 0) {
      tocSection.remove();
    }
  }

  // If a rendered TOC nav exists (created by the toc-seo block), move it into the left column
  const moveRenderedToc = () => {
    const rendered = document.querySelector('.toc-container');
    if (rendered && rendered.parentElement !== leftColumn) {
      leftColumn.append(rendered);
    }
  };
  moveRenderedToc();
  // Observe for late-rendered TOC
  const observer = new MutationObserver(() => moveRenderedToc());
  observer.observe(main, { childList: true, subtree: true });

  // Move subsequent sections into right column until a breakout section is encountered
  const breakoutSelectors = ['.ax-link-list-v2-container', '.link-list-v2', '.link-list-v2-wrapper'];
  // Find first breakout section
  const breakoutSection = sections.find((s) => breakoutSelectors.some((sel) => s.querySelector(sel))) || null;
  let current = section.nextElementSibling;
  while (current) {
    const next = current.nextElementSibling;
    if (!current.classList?.contains('section')) {
      current = next;
      continue;
    }
    // stop at breakout section
    if (current === breakoutSection) {
      break;
    }
    // Move the whole section into the right column to preserve block structure
    rightColumn.append(current);
    current = next;
  }

  // Compose and attach
  wrapper.append(leftColumn, rightColumn);
  section.append(wrapper);

  // Ensure visibility after transformation
  document.body.style.visibility = 'visible';
}

await decorateTOCTemplate();


