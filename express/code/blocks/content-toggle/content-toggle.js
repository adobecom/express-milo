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

    const updateBackgroundSize = () => {
      const $activeButton = $block.querySelector('button.active');
      if ($activeButton && $activeButton.offsetWidth > 0) {
        requestAnimationFrame(() => {
          const activeButtonWidth = $activeButton.offsetWidth + 5;
          let leftOffset = Array.from($buttons).indexOf($activeButton) * 10;

          for (let i = 0; i < Array.from($buttons).indexOf($activeButton); i += 1) {
            leftOffset += $buttons[i].offsetWidth;
          }

          $toggleBackground.style.left = `${leftOffset}px`;
          $toggleBackground.style.width = `${activeButtonWidth}px`;
        });
      } else {
        setTimeout(updateBackgroundSize, 10);
      }
    };

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateBackgroundSize, 16);
    });

    if (index === 0) {
      $buttons[index].classList.add('active');
      updateBackgroundSize();
    }

    $buttons[index].addEventListener('click', () => {
      const $activeButton = $block.querySelector('button.active');
      const blockPosition = $block.getBoundingClientRect().top;
      const offsetPosition = blockPosition + window.scrollY - 80;

      if ($activeButton !== $buttons[index]) {
        $activeButton.classList.remove('active');
        $buttons[index].classList.add('active');
        updateBackgroundSize();
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
