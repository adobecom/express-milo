import { getLibs } from '../../scripts/utils.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);

import { createOptimizedPicture, transformLinkToAnimation } from "../../scripts/utils/media.js";
import {fixIcons} from "../../scripts/utils/icons.js";

function enableToggle(block, toggleChev) {
  const onToggle = (e) => {
    e.stopPropagation();
    if (e.target.closest('.carousel-container')) {
      return;
    }
    block.classList.toggle('expanded');
  };

  const onOutsideToggle = (e) => {
    if (!block.classList.contains('expanded')) return;
    if (e.target.closest('.carousel-container')) return;
    e.stopPropagation();
    block.classList.remove('expanded');
  };
  const templateImages = block.querySelectorAll('.template');
  templateImages.forEach((template) => {
    template.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  toggleChev.addEventListener('click', onToggle);
  block.querySelector('.toggle-bar').addEventListener('click', onToggle);
  block.querySelector('.toggle-bar > p a').setAttribute('target', '_blank');
  document.addEventListener('click', onOutsideToggle);

  setTimeout(() => {
    block.classList.contains('auto-expand') && block.classList.add('expanded');
  }, 3000);
}

function decorateTemplateImgs(innerWrapper) {
  innerWrapper.querySelectorAll(':scope picture img').forEach((img) => {
    const { src, alt } = img;
    img.parentNode.replaceWith(createOptimizedPicture(src, alt, true, [{ width: '400' }]));
  });
}

async function loadTemplates(props) {
  const [
    { default: renderTemplate },
    { isValidTemplate, fetchTemplates },
  ] = await Promise.all([
    import('../template-x/template-rendering.js'),
    import('../../scripts/template-search-api-v3.js'),
  ]);
  const { response } = await fetchTemplates(props);
  if (!response?.items || !Array.isArray(response.items)) {
    throw new Error('Invalid template response format');
  }
  return response.items
      .filter((item) => isValidTemplate(item))
      .map((template) => renderTemplate(template));
}

async function fetchAndRenderTemplates(block, props) {
  const [
    { default: buildCarousel },
  ] = await Promise.all([
    import('../../scripts/widgets/carousel.js'),
  ]);

  const rows = block.children;
  for (let i = 1; i < rows.length; i += 1) {
    rows[i].innerHTML = '';
  }
  const innerWrapper = createTag('div', { class: 'holiday-blade-inner-wrapper' });
  rows[1].append(innerWrapper);
  const templates = await loadTemplates(props);
  const fragment = document.createDocumentFragment();
  templates.forEach((template) => {
    fragment.append(template);
  });
  innerWrapper.append(fragment);
  decorateTemplateImgs(innerWrapper);
  for (const tmplt of templates) {
    tmplt.classList.add('template');
  }
  await buildCarousel(':scope > .template', innerWrapper);
}

function decorateHoliday(block, toggleChev) {
  const rows = block.children;
  const toggleBar = rows[0].children[0];
  toggleBar.classList.add('toggle-bar');
  const staticImage = rows[0].children[1].querySelector('img');
  if (staticImage) {
    block.classList.add('static-background');
    staticImage.classList.add('static-background-image');
  }
  toggleBar.append(toggleChev);

  const backgroundStyle = rows[0].children[1].querySelector('strong');
  if (backgroundStyle) {
    block.style.background = backgroundStyle.textContent;
    backgroundStyle.remove();
  }

  const animationLink = rows[0].children[1].querySelector('a');
  if (animationLink?.href.includes('.png')) {
    staticImage.href = animationLink.href;
  } else if (animationLink) {
    const animation = transformLinkToAnimation(animationLink);
    block.classList.add('animated');
    staticImage?.remove();
    block.append(animation);
  }
}

export default function decorate(el) {
  fixIcons(el);
  const block = createTag('div', { class: 'holiday-blade-inner-content' });
  block.innerHTML = el.innerHTML;
  el.innerHTML = '';
  el.append(block);
  const rows = block.children;
  const toggleBar = rows[0].children[0];

  toggleBar.classList.add('toggle-bar');
  const locales = rows[1].children[1].textContent;
  const isQuery = rows[2].children[0].textContent.trim().toLowerCase() === 'q';
  const query = rows[2].children[1].textContent;
  const limit = rows[3]?.children[1].textContent;
  const props = {
    filters: {
      locales,
    },
    limit,
  };
  if (block.classList.contains('still-only')) props.filters.behaviors = 'still';
  if (block.classList.contains('animated-only')) props.filters.behaviors = 'animated';
  if (block.classList.contains('free-only')) props.filters.premium = 'false';
  if (block.classList.contains('premium-only')) props.filters.premium = 'true';

  if (isQuery) {
    props.q = query;
    props.collectionId = 'urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418';
  } else {
    props.collectionId = query;
  }
  const toggleChev = createTag('div', { class: 'toggle-button-chev hide' });
  decorateHoliday(block, toggleChev);

  new IntersectionObserver(async (entries, ob) => {
    ob.unobserve(block);
    await fetchAndRenderTemplates(block, props);
    enableToggle(block, toggleChev);
    toggleChev.classList.remove('hide');
  }).observe(block);
}
