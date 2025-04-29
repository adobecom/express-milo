import { readBlockConfig, addTempWrapperDeprecated } from '../../scripts/utils.js';
import createCarousel from '../../scripts/widgets/carousel.js';

function getDefatultToggleIndex(block) {
  const enclosingMain = block.closest('main');
  const toggleDefaultOption = enclosingMain.querySelector('[data-toggle-default]');
  const defaultValue = toggleDefaultOption?.dataset.toggleDefault || toggleDefaultOption?.getAttribute('data-toggle-default');
  const parsedIndex = parseInt(defaultValue, 10);
  const defaultIndex = !defaultValue || Number.isNaN(parsedIndex) ? 0 : parsedIndex - 1;
  return defaultIndex;
}

function initButton(block, buttons, sections, index) {
  const setActiveButton = (newIndex) => {
    buttons.forEach((btn) => btn.classList.remove('active'));
    buttons[newIndex].classList.add('active');
  };

  const handleSectionChange = () => {
    const activeButton = block.querySelector('.content-toggle-button.carousel-element.active');
    const blockPosition = block.getBoundingClientRect().top;
    const offsetPosition = blockPosition + window.scrollY - 80;

    if (activeButton !== buttons[index]) {
      setActiveButton(index);
      sections.forEach((section) => {
        if (buttons[index].innerText.toLowerCase() === section.dataset.toggle.toLowerCase()) {
          section.style.display = 'block';
          section.style.height = 'auto';
        } else {
          section.style.display = 'none';
          section.style.height = '0px';
        }
      });
      if (!(window.scrollY < offsetPosition + 1 && window.scrollY > offsetPosition - 1)) {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
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
      if (e.key === 'Enter' || e.key === ' ') {
        handleSectionChange();
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

export default async function decorate(block) {
  addTempWrapperDeprecated(block, 'content-toggle');
  decorteSectionsMetadata();

  const enclosingMain = block.closest('main');
  if (enclosingMain) {
    const row = block.querySelector('div');
    const items = block.querySelector('ul');
    items.classList.add('content-toggle-carousel-container');

    const toggles = row.querySelectorAll('li');
    toggles.forEach((toggle) => {
      const button = document.createElement('button');
      button.innerHTML = toggle.innerHTML;
      button.className = `${toggle.className} content-toggle-button`;
      toggle.parentNode.replaceChild(button, toggle);
    });

    createCarousel('button', items);
    const sections = enclosingMain.querySelectorAll('[data-toggle]');
    const buttons = row.querySelectorAll('.content-toggle-button');

    for (let i = 0; i < buttons.length; i += 1) {
      initButton(block, buttons, sections, i);
    }
  }
}
