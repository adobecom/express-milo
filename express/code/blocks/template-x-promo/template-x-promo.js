import { getLibs } from '../../scripts/utils.js';
import { createTemplateCarousel } from '../../scripts/widgets/carousel-factory.js';
import {
  extractTemplateMetadata,
  extractApiParamsFromRecipe,
  getBlockStylingConfig,
  determineTemplateRouting,
  fetchDirectFromApiUrl,
} from './template-x-promo-utils.js';

let createTag;
let getConfig;
let replaceKey;

async function handleOneUpFromApiData(block, templateData) {
  const parent = block.parentElement;
  parent.classList.add('one-up');
  block.innerHTML = '';

  const metadata = extractTemplateMetadata(templateData);

  let { imageUrl } = metadata;
  if (imageUrl && imageUrl.includes('{&')) {
    imageUrl = imageUrl.replace('{&page,size,type,fragment}', '');
  }

  if (!imageUrl || imageUrl.includes('{') || imageUrl.includes('undefined')) {
    throw new Error('Invalid template image URL');
  }

  const img = createTag('img', {
    src: imageUrl,
    alt: metadata.title,
    loading: 'lazy',
  });

  const imgWrapper = createTag('div', { class: 'image-wrapper' });
  imgWrapper.append(img);

  block.append(imgWrapper);

  const editThisTemplate = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
  const editTemplateButton = createTag('a', {
    href: metadata.editUrl,
    class: 'button accent small',
    title: `${editThisTemplate} ${metadata.title}`,
    'aria-label': `${editThisTemplate} ${metadata.title}`,
    target: '_self',
  });
  editTemplateButton.textContent = editThisTemplate;

  const buttonContainer = createTag('section', { class: 'button-container' });
  buttonContainer.append(editTemplateButton);

  parent.append(buttonContainer);
}

async function createTemplateElementForCarousel(templateData) {
  const { default: renderTemplate } = await import('../template-x/template-rendering.js');

  const singlePageTemplate = {
    ...templateData,
    pages: templateData.pages ? [templateData.pages[0]] : [],
  };

  const templateEl = await renderTemplate(singlePageTemplate, [], {});

  templateEl.classList.add('template');

  return templateEl;
}

async function createDesktopLayout(block, templates) {
  try {
    const templateElements = await Promise.all(
      templates.map((template) => createTemplateElementForCarousel(template)),
    );

    const parent = block.parentElement;
    parent.classList.add('multiple-up');

    const templateCount = templates.length;
    if (templateCount === 2) {
      parent.classList.add('two-up');
    } else if (templateCount === 3) {
      parent.classList.add('three-up');
    } else if (templateCount >= 4) {
      parent.classList.add('four-up');
    }

    templateElements.forEach((template) => {
      parent.append(template);
    });

    return {
      currentIndex: () => 0,
      templateCount: () => templateElements.length,
      destroy: () => {
        // No cleanup needed
      },
    };
  } catch (e) {
    block.textContent = `Error loading templates: ${e.message}`;
    return null;
  }
}

export async function createCustomCarousel(block, templates) {
  try {
    const templateElements = await Promise.all(
      templates.map((template) => createTemplateElementForCarousel(template)),
    );

    const parent = block.parentElement;
    parent.classList.add('multiple-up');

    const templateCount = templates.length;
    if (templateCount === 2) {
      parent.classList.add('two-up');
    } else if (templateCount === 3) {
      parent.classList.add('three-up');
    } else if (templateCount >= 4) {
      parent.classList.add('four-up');
    }

    const carousel = await createTemplateCarousel(
      block,
      templateElements,
      createTag,
      null,
      null,
      {
        loadCSS: false,
        responsive: true,
        showNavigation: true,
        looping: true,
      },
    );

    // eslint-disable-next-line no-underscore-dangle
    block._carousel = carousel;

    return carousel;
  } catch (e) {
    block.textContent = `Error loading templates: ${e.message}`;
    return null;
  }
}

const initializeUtilities = async () => {
  const libsPath = getLibs() || '../../scripts';
  try {
    const [utils, placeholders] = await Promise.all([
      import(`${libsPath}/utils.js`),
      import(`${libsPath}/features/placeholders.js`),
    ]);

    return {
      createTag: utils.createTag,
      getConfig: utils.getConfig,
      replaceKey: placeholders.replaceKey,
    };
  } catch (utilsError) {
    return {
      createTag: window.createTag || ((tag, attrs) => {
        const el = document.createElement(tag);
        if (attrs) {
          Object.keys(attrs).forEach((key) => {
            if (key === 'class') el.className = attrs[key];
            else el.setAttribute(key, attrs[key]);
          });
        }
        return el;
      }),
      getConfig: window.getConfig || (() => ({})),
      replaceKey: window.replaceKey || (async () => null),
    };
  }
};

const routeTemplates = async (block, templates) => {
  const routingDecision = determineTemplateRouting(templates);

  switch (routingDecision.strategy) {
    case 'none':
      return;
    case 'one-up':
      await handleOneUpFromApiData(block, routingDecision.template);
      break;
    case 'carousel': {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      if (isMobile) {
        await createCustomCarousel(block, routingDecision.templates);
      } else {
        await createDesktopLayout(block, routingDecision.templates);
      }
      break;
    }
    default:
  }
};

const handleApiDrivenTemplates = async (block, apiUrl) => {
  try {
    const { templates } = await fetchDirectFromApiUrl(apiUrl);
    block.innerHTML = '';

    const parent = block.parentElement;
    const existingTemplates = parent.querySelectorAll('.template');
    existingTemplates.forEach((template) => template.remove());

    await routeTemplates(block, templates);
  } catch (error) {
    // Graceful degradation - API error occurred
  }
};

export default async function decorate(block) {
  if (block.hasAttribute('data-decorated')) {
    return;
  }

  block.setAttribute('data-decorated', 'true');
  const utilities = await initializeUtilities();
  createTag = utilities.createTag;
  getConfig = utilities.getConfig;
  replaceKey = utilities.replaceKey;
  const stylingConfig = getBlockStylingConfig(block);
  if (stylingConfig.shouldApply) {
    block.parentElement.classList.add(...stylingConfig.parentClasses);
  }
  const apiUrl = extractApiParamsFromRecipe(block);
  if (apiUrl) {
    await handleApiDrivenTemplates(block, apiUrl);

    let lastResponsiveCheck = 0;
    const RESPONSIVE_THROTTLE_MS = 100;

    const selectors = {
      carousel: '.promo-carousel-wrapper',
      desktop: '.template:not(.prev-template):not(.next-template):not(.current-template)',
    };
    const handleResponsiveChange = () => {
      const now = Date.now();
      if (now - lastResponsiveCheck < RESPONSIVE_THROTTLE_MS) {
        return;
      }
      lastResponsiveCheck = now;

      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const hasCarousel = block.querySelector(selectors.carousel);
      const hasDesktopLayout = block.parentElement?.querySelector(selectors.desktop);

      if (hasCarousel && !isMobile) {
        // eslint-disable-next-line no-underscore-dangle
        if (block._carousel && block._carousel.destroy) {
          // eslint-disable-next-line no-underscore-dangle
          block._carousel.destroy();
          // eslint-disable-next-line no-underscore-dangle
          block._carousel = null;
        }

        block.innerHTML = '';

        handleApiDrivenTemplates(block, apiUrl);
      } else if (hasDesktopLayout && isMobile) {
        const parent = block.parentElement;
        const existingTemplates = parent.querySelectorAll('.template');
        existingTemplates.forEach((template) => template.remove());

        handleApiDrivenTemplates(block, apiUrl);
      }
    };

    window.addEventListener('resize', handleResponsiveChange);
    window.addEventListener('orientationchange', handleResponsiveChange);

    // eslint-disable-next-line no-underscore-dangle
    block._cleanup = () => {
      window.removeEventListener('resize', handleResponsiveChange);
      window.removeEventListener('orientationchange', handleResponsiveChange);
      // eslint-disable-next-line no-underscore-dangle
      if (block._carousel && block._carousel.destroy) {
        // eslint-disable-next-line no-underscore-dangle
        block._carousel.destroy();
      }
    };
  }
}
