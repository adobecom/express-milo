import { readBlockConfig, addTempWrapperDeprecated } from '../../scripts/utils.js';
import createCarousel from '../../scripts/widgets/carousel.js';

function getTabIndexFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab');
  if (tabParam) {
    const indexOneBased = parseInt(tabParam, 10);
    if (!Number.isNaN(indexOneBased) && indexOneBased >= 1) {
      return indexOneBased - 1; // convert to 0-based internal index
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

function initButton(block, buttons, sections, index, initiallyHasTabParam) {
  const setActiveButton = (newIndex) => {
    buttons.forEach((btn) => btn.classList.remove('active'));
    buttons[newIndex].classList.add('active');
    // Focus the active button for better accessibility
    buttons[newIndex].focus();
  };

  const handleSectionChange = (updateUrl = true) => {
    const activeButton = block.querySelector('.content-toggle-button.carousel-element.active');
    const blockPosition = block.getBoundingClientRect().top;
    const offsetPosition = blockPosition + window.scrollY - 80;

    if (activeButton !== buttons[index]) {
      setActiveButton(index);
      if (updateUrl) updateURLParameter(index + 1); // write 1-based index to URL
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
    // On initial load, only update URL if it already had a tab param
    handleSectionChange(!!initiallyHasTabParam);
  }

  buttons[index].addEventListener('click', () => {
    handleSectionChange(true);
  });

  buttons[index].addEventListener('keydown', (e) => {
    if (e.target === buttons[index]) {
      if (e.key === 'Enter' || e.key === ' ') {
        handleSectionChange(true);
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
    const hadInitialTabParam = new URLSearchParams(window.location.search).has('tab');
    const row = block.querySelector('div');
    const items = block.querySelector('ul');
    const carouselContainer = document.createElement('div');
    carouselContainer.classList.add('content-toggle-carousel-container');
    console.log(items.children);
    while (items.firstChild) {
      carouselContainer.appendChild(items.firstChild);
    } 

    const toggles = carouselContainer.querySelectorAll('li');
    toggles.forEach((toggle) => {
      const button = document.createElement('button');
      button.innerHTML = toggle.innerHTML;
      button.className = `${toggle.className} content-toggle-button`;
      toggle.parentNode.replaceChild(button, toggle);
    });

    createCarousel('button', carouselContainer);

   
    items.parentNode.replaceChild(carouselContainer, items);
    const sections = enclosingMain.querySelectorAll('[data-toggle]');
    const buttons = row.querySelectorAll('.content-toggle-button');

    for (let i = 0; i < buttons.length; i += 1) {
      initButton(block, buttons, sections, i, hadInitialTabParam);
    }
  }
}
