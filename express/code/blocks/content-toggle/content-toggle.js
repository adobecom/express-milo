import { getLibs, readBlockConfig, addTempWrapperDeprecated } from '../../scripts/utils.js';
import { trackButtonClick } from '../../scripts/instrument.js';

let createTag;

function decorateButton($block, $toggle) {
  const $button = createTag('button', { class: 'content-toggle-button' });
  const tagText = $toggle.textContent.trim().match(/\[(.*?)\]/);

  if (tagText) {
    const [fullText, tagTextContent] = tagText;
    const $tag = createTag('span', { class: 'tag' });
    $button.textContent = $toggle.textContent.trim().replace(fullText, '').trim();
    $button.dataset.text = $button.textContent.toLowerCase();
    $tag.textContent = tagTextContent;
    $button.append($tag);
  } else {
    $button.textContent = $toggle.textContent.trim();
    $button.dataset.text = $button.textContent.toLowerCase();
  }
  // for tracking the content toggle buttons
  $button.addEventListener('click', () => {
    trackButtonClick($button);
  });

  $block.append($button);
}

function initButton($block, $sections, index) {
  const $enclosingMain = $block.closest('main');

  if ($enclosingMain) {
    const $buttons = $block.querySelectorAll('.content-toggle-button');
    const $toggleBackground = $block.querySelector('.toggle-background');
    let currentResizeObserver = null;

    const updateBackgroundSize = (activeIndex) => {
      requestAnimationFrame(() => {
        const activeButton = $buttons[activeIndex];
        if (activeButton.getBoundingClientRect().width === 0) {
          requestAnimationFrame(() => updateBackgroundSize(activeIndex));
          return;
        }
        const buttonWidth = activeButton.getBoundingClientRect().width + 5;
        let leftOffset = activeIndex * 10;

        for (let i = 0; i < activeIndex; i += 1) {
          leftOffset += $buttons[i].getBoundingClientRect().width;
        }

        $toggleBackground.style.left = `${leftOffset}px`;
        $toggleBackground.style.width = `${buttonWidth}px`;
      });
    };

    const setActiveButton = (newIndex) => {
      if (currentResizeObserver) {
        currentResizeObserver.disconnect();
      }

      currentResizeObserver = new ResizeObserver(() => {
        updateBackgroundSize(newIndex);
      });
      currentResizeObserver.observe($buttons[newIndex]);

      $buttons.forEach(($btn) => $btn.classList.remove('active'));
      $buttons[newIndex].classList.add('active');
      updateBackgroundSize(newIndex);
    };

    const toggleDefaultOption = $enclosingMain.querySelector('[data-toggle-default]');
    const defaultValue = toggleDefaultOption?.dataset.toggleDefault || toggleDefaultOption?.getAttribute('data-toggle-default');
    const defaultIndex = parseInt(defaultValue, 10) - 1;

    if (index === (defaultIndex || 1)) {
      setActiveButton(index);
    }

    $buttons[index].addEventListener('click', () => {
      const $activeButton = $block.querySelector('button.active');
      const blockPosition = $block.getBoundingClientRect().top;
      const offsetPosition = blockPosition + window.scrollY - 80;

      if ($activeButton !== $buttons[index]) {
        setActiveButton(index);
        $sections.forEach(($section) => {
          if ($buttons[index].dataset.text === $section.dataset.toggle.toLowerCase()) {
            $section.style.display = 'block';
          } else {
            $section.style.display = 'none';
          }
        });
        if (!(window.scrollY < offsetPosition + 1 && window.scrollY > offsetPosition - 1)) {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    });
  }
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
  ({ createTag } = await import(`${getLibs()}/utils/utils.js`));
  addTempWrapperDeprecated(block, 'content-toggle');
  decorteSectionsMetadata();

  const $enclosingMain = block.closest('main');
  if ($enclosingMain) {
    const $sections = $enclosingMain.querySelectorAll('[data-toggle]');
    const $toggleContainer = block.querySelector('ul');
    const $toggleBackground = createTag('div', { class: 'toggle-background' });

    block.innerHTML = '';

    block.prepend($toggleBackground);

    Array.from($toggleContainer.children).forEach(($toggle, index) => {
      decorateButton(block, $toggle);
      initButton(block, $sections, index);
    });

    if ($sections) {
      $sections.forEach(($section, index) => {
        if (index > 0) {
          $section.style.display = 'none';
        }
      });
    }
  }
}
