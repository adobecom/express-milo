import { getLibs, addTempWrapperDeprecated, decorateButtonsDeprecated } from '../../scripts/utils.js';
import { transformLinkToAnimation } from '../../scripts/utils/media.js';
import buildCarousel from '../../scripts/widgets/carousel.js';

let replaceKey; let getConfig;
let createTag;
export function decorateTextWithTag(textSource, options = {}) {
  const {
    baseT,
    tagT,
    baseClass,
    tagClass,
  } = options;
  const text = createTag(baseT || 'label', { class: baseClass || '', for: textSource });
  const tagText = textSource.match(/\[(.*?)]/);

  if (tagText) {
    const [fullText, tagTextContent] = tagText;
    const $tag = createTag(tagT || 'span', { class: tagClass || 'tag' });
    text.textContent = textSource.replace(fullText, '').trim();
    text.dataset.text = text.textContent.toLowerCase();
    $tag.textContent = tagTextContent;
    text.append($tag);
  } else {
    text.textContent = textSource;
    text.dataset.text = text.textContent.toLowerCase();
  }
  return text;
}

export function decorateHeading(block, payload) {
  const headingSection = createTag('div', { class: 'cta-carousel-heading-section' });
  const headingTextWrapper = createTag('div', { class: 'text-wrapper' });
  const heading = decorateTextWithTag(payload.heading, { baseT: 'h2', tagT: 'sup', baseClass: 'cta-carousel-heading' });

  headingSection.append(headingTextWrapper);
  headingTextWrapper.append(heading);

  if (payload.subHeadings.length > 0) {
    payload.subHeadings.forEach((p) => {
      headingTextWrapper.append(p);
    });
  }
  if (payload?.viewAllLink !== null) {
    const viewAllButton = payload.viewAllLink;
    viewAllButton.className = 'cta-carousel-link';
    headingSection.append(viewAllButton);
  }

  block.append(headingSection);
}

function handleGenAISubmit(form, link) {
  const btn = form.querySelector('.gen-ai-submit');
  const input = form.querySelector('.gen-ai-input');

  btn.disabled = true;

  const promptTokens = ['((prompt-text))', '%7B%7Bprompt-text%7D%7D'];
  let genAILink;

  for (const token of promptTokens) {
    if (link.indexOf(token) > -1) {
      genAILink = link.replace(token, encodeURI(input.value).replaceAll(' ', '+'));
      break;
    }
  }
  if (genAILink !== '') window.location.assign(genAILink);
}

function buildGenAIForm(ctaObj) {
  const genAIForm = createTag('form', { class: 'gen-ai-input-form' });
  const formWrapper = createTag('div', { class: 'gen-ai-form-wrapper' });
  const genAIInput = createTag('textarea', {
    class: 'gen-ai-input',
    placeholder: ctaObj.subtext || '',
  });
  const genAISubmit = createTag('button', {
    class: 'gen-ai-submit',
    type: 'submit',
    disabled: true,
  });

  genAIForm.append(formWrapper);
  formWrapper.append(genAIInput, genAISubmit);

  genAISubmit.textContent = ctaObj.ctaLinks[0].textContent;
  genAISubmit.disabled = genAIInput.value === '';

  genAIInput.addEventListener('input', () => {
    genAISubmit.disabled = genAIInput.value.trim() === '';
  }, { passive: true });

  genAIInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGenAISubmit(genAIForm, ctaObj.ctaLinks[0].href);
    }
  });

  genAIForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleGenAISubmit(genAIForm, ctaObj.ctaLinks[0].href);
  });

  return genAIForm;
}

function buildGenAIUpload(cta, card) {
  const mediaWrapper = card.querySelector('.media-wrapper');
  const textWrapper = card.querySelector('.text-wrapper');
  const uploadButton = createTag('a', { class: 'gen-ai-upload', href: cta.ctaLinks[0].href });
  const innerWrapper = createTag('div', { class: 'gen-ai-upload-inner-wrapper' });
  const btnPill = createTag('div', { class: 'gen-ai-upload-btn' }, cta.ctaLinks[0].textContent);

  innerWrapper.append(cta.icon, btnPill);
  uploadButton.append(innerWrapper);

  // Clean up empty divs && unused elements
  if (!mediaWrapper.children.length) mediaWrapper.remove();
  textWrapper.remove();

  return uploadButton;
}

async function decorateCards(block, payload) {
  const cards = createTag('div', { class: 'cta-carousel-cards' });
  const searchBranchLinksPlaceholder = await replaceKey('search-branch-links', getConfig());
  const searchBranchLinks = searchBranchLinksPlaceholder?.replace(/\s/g, '')?.split(',') || [];

  payload.actions.forEach((cta, index) => {
    const card = createTag('div', { class: 'card' });
    const cardSleeve = createTag('div', { class: 'card-sleeve' });
    const linksWrapper = createTag('div', { class: 'links-wrapper' });
    const mediaWrapper = createTag('div', { class: 'media-wrapper' });
    const textWrapper = createTag('div', { class: 'text-wrapper' });

    cardSleeve.append(mediaWrapper, linksWrapper);
    card.append(cardSleeve, textWrapper);
    card.setAttribute('aria-label', cta.text);
    if (cta.image) mediaWrapper.append(cta.image);

    if (cta.videoLink) {
      const video = transformLinkToAnimation(cta.videoLink, true);
      mediaWrapper.append(video);
    }

    if (cta.icon) mediaWrapper.append(cta.icon);

    if (mediaWrapper.children.length === 0) {
      mediaWrapper.remove();
    }

    const hasGenAIEl = (block.classList.contains('gen-ai') && block.classList.contains('quick-action') && index === 0)
      || (block.classList.contains('gen-ai') && !block.classList.contains('quick-action') && !cta.image);

    if (cta.ctaLinks.length > 0) {
      if (hasGenAIEl) {
        card.classList.add('gen-ai-action');
        const el = block.classList.contains('upload') ? buildGenAIUpload(cta, card) : buildGenAIForm(cta);
        cardSleeve.append(el);
        linksWrapper.remove();
      }

      if ((block.classList.contains('quick-action') || block.classList.contains('gen-ai')) && cta.ctaLinks.length === 1) {
        const a = cta.ctaLinks[0];
        a.removeAttribute('title');
        a.setAttribute('aria-label', `quick action: ${cta.text.toLowerCase().trim()}`);
        a.setAttribute('id', cta.text);
        a.textContent = '';
        a.classList.add('clickable-overlay');
      }

      cta.ctaLinks.forEach((a) => {
        if (a.href) {
          const btnUrl = new URL(a.href);
          if (searchBranchLinks.includes(`${btnUrl.origin}${btnUrl.pathname}`)) {
            btnUrl.searchParams.set('q', cta.text);
            btnUrl.searchParams.set('category', 'templates');
            if (cta.subtext) {
              const match = /(\d+)x(\d+)(.+)/.exec(cta.subtext);
              if (match) {
                const [, width, height, unit] = match;
                if (unit === 'px' || unit === 'in') {
                  if (!btnUrl.searchParams.get('width')) btnUrl.searchParams.set('width', width);
                  if (!btnUrl.searchParams.get('height')) btnUrl.searchParams.set('height', height);
                  if (!btnUrl.searchParams.get('unit')) btnUrl.searchParams.set('unit', unit);
                }
              }
            }
            a.href = decodeURIComponent(btnUrl.toString());
          }
          a.removeAttribute('title');
          a.setAttribute('aria-label', `${cta.text.toLowerCase().trim()} ${a.text.toLowerCase().trim()}`);
        }
        if (block.classList.contains('spotlight')) {
          const cardLink = createTag('a', { href: a.href, class: 'card-link' });
          cardLink.append(cardSleeve, textWrapper);
          card.append(cardLink);
        } else {
          linksWrapper.append(a);
        }
      });
    } else {
      card.classList.add('coming-soon');
    }

    if (cta.text) {
      textWrapper.append(decorateTextWithTag(cta.text, { baseClass: 'cta-card-text' }));
    }

    if (cta.subtext && !hasGenAIEl) {
      const subtext = createTag('label', { class: 'subtext' });
      subtext.textContent = cta.subtext;
      textWrapper.append(subtext);
    }

    cards.append(card);
  });

  block.append(cards);
}

function constructPayload(block) {
  const rows = Array.from(block.children);
  block.innerHTML = '';
  const headingDiv = rows.shift();

  const payload = {
    heading: headingDiv.querySelector('h2, h3, h4, h5, h6')?.textContent?.trim(),
    subHeadings: headingDiv.querySelectorAll('p:not(.button-container)'),
    viewAllLink: headingDiv.querySelector('a.button') ,
    actions: [],
  };

  rows.forEach((row) => {
    const ctaObj = {
      image: row.querySelector(':scope > div:nth-of-type(1) picture'),
      videoLink: row.querySelector(':scope > div:nth-of-type(1) a'),
      icon: row.querySelector(':scope > div:nth-of-type(1) img.icon, :scope > div:nth-of-type(1) svg'),
      text: row.querySelector(':scope p.supplemental-text strong, :scope > div:nth-of-type(2) > *:last-of-type')?.textContent.trim(),
      subtext: row.querySelector(':scope > div:nth-of-type(2) p:not(.button-container) em')?.textContent.trim(),
      ctaLinks: row.querySelectorAll(':scope > div:nth-of-type(2) a'),
    };

    payload.actions.push(ctaObj);
  });

  return payload;
}

export default async function decorate(block) {
  addTempWrapperDeprecated(block, 'cta-carousel');
  await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`), decorateButtonsDeprecated(block)]).then(([utils, placeholders]) => {
    ({ createTag, getConfig } = utils);
    ({ replaceKey } = placeholders);
  });

  const payload = constructPayload(block);
  decorateHeading(block, payload);
  await decorateCards(block, payload);
  await buildCarousel('', block.querySelector('.cta-carousel-cards'));
}
