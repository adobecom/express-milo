import { readBlockConfig, addTempWrapperDeprecated } from '../../scripts/utils.js';
import createCarousel from '../../scripts/widgets/carousel.js';

function getTabIndexFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab');
  if (tabParam) {
    const index = parseInt(tabParam, 10);
    if (!Number.isNaN(index) && index >= 0) {
      return index;
    }
  }
  return null;
}

function updateURLParameter(index) {
  const url = new URL(window.location);
  url.searchParams.set('tab', index);
  window.history.replaceState({}, '', url);
}

function getDefatultToggleIndex(block) {
  // First check URL parameter
  const urlIndex = getTabIndexFromURL();
  if (urlIndex !== null) {
    return urlIndex;
  }

  // Fall back to data attribute
  const enclosingMain = block.closest('main');
  const toggleDefaultOption = enclosingMain.querySelector('[data-toggle-default]');
  const defaultValue = toggleDefaultOption?.dataset.toggleDefault || toggleDefaultOption?.getAttribute('data-toggle-default');
  const parsedIndex = parseInt(defaultValue, 10);
  const defaultIndex = !defaultValue || Number.isNaN(parsedIndex) ? 0 : parsedIndex - 1;
  return defaultIndex;
}

function initButton(block, buttons, sections, index) {
  const setActiveButton = (newIndex) => {
    buttons.forEach((btn) => {
      btn.classList.remove('active');
      btn.removeAttribute('aria-current');
    });
    buttons[newIndex].classList.add('active');
    buttons[newIndex].setAttribute('aria-current', 'page');
  };

  const handleSectionChange = () => {
    const activeButton = block.querySelector('.content-toggle-button.carousel-element.active');
    const blockPosition = block.getBoundingClientRect().top;
    const offsetPosition = blockPosition + window.scrollY - 80;

    if (activeButton !== buttons[index]) {
      setActiveButton(index);
      updateURLParameter(index);
      sections.forEach((section) => {
        if (buttons[index].innerText.toLowerCase() === section.dataset.toggle.toLowerCase()) {
          section.classList.remove('display-none');
        } else {
          section.classList.add('display-none');
        }
      });
      if (!(window.scrollY < offsetPosition + 1 && window.scrollY > offsetPosition - 1)) {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'instant',
        });
      }
    }
  };

  if (index === getDefatultToggleIndex(block)) {
    setActiveButton(index);
    handleSectionChange();
  }

  buttons[index].addEventListener('click', () => {
    handleSectionChange();
  });

  buttons[index].addEventListener('keydown', (e) => {
    if (e.target === buttons[index]) {
      let newIndex = index;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleSectionChange();
          break;
        case 'ArrowRight':
          e.preventDefault();
          newIndex = (index + 1) % buttons.length;
          buttons[newIndex].focus();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = (index - 1 + buttons.length) % buttons.length;
          buttons[newIndex].focus();
          break;
        case 'Home':
          e.preventDefault();
          buttons[0].focus();
          break;
        case 'End':
          e.preventDefault();
          buttons[buttons.length - 1].focus();
          break;
        default:
          break;
      }
    }
  });
}

function decorateSectionMetadata(section) {
  const metadataDiv = section.querySelector(':scope > .section-metadata');
  if (metadataDiv) {
    const meta = readBlockConfig(metadataDiv);
    const keys = Object.keys(meta);
    keys.forEach((key) => {
      if (!['style', 'anchor', 'background'].includes(key)) {
        section.setAttribute(`data-${key}`, meta[key]);
      }
    });
  }
}

function decorteSectionsMetadata() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(decorateSectionMetadata);
}

export default function decorate(block) {
  addTempWrapperDeprecated(block, 'content-toggle');
  decorteSectionsMetadata();

  const enclosingMain = block.closest('main');
  if (enclosingMain) {
    const row = block.querySelector('div');
    const items = block.querySelector('ul');
    items.classList.add('content-toggle-carousel-container');

    // Create nav element and move the ul inside it
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Content navigation');
    nav.className = 'content-toggle-nav';
    items.parentNode.insertBefore(nav, items);
    nav.appendChild(items);

    const toggles = row.querySelectorAll('li');
    toggles.forEach((toggle, idx) => {
      // Keep as li elements but add necessary classes and attributes
      toggle.classList.add('content-toggle-button', 'nav-item');
      toggle.setAttribute('tabindex', '0');

      // Create anchor-like behavior for better semantics
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('data-section-id', `section-${idx}`);
    });

    createCarousel('li.content-toggle-button', items);
    const sections = enclosingMain.querySelectorAll('[data-toggle]');
    const buttons = row.querySelectorAll('.content-toggle-button');

    // Add ARIA attributes to sections
    sections.forEach((section, idx) => {
      section.setAttribute('id', `section-${idx}`);
      section.setAttribute('aria-labelledby', `nav-item-${idx}`);
    });

    // Set id on nav items
    buttons.forEach((btn, idx) => {
      btn.setAttribute('id', `nav-item-${idx}`);
    });

    for (let i = 0; i < buttons.length; i += 1) {
      initButton(block, buttons, sections, i);
    }
  }
}
