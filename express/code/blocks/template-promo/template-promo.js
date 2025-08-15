import { getLibs } from '../../scripts/utils.js';

let createTag;
let getConfig;
let replaceKey;

export default async function decorate(block) {
  // block.parentElement.style.visibility = 'hidden';
  block.parentElement.classList.add('ax-template-promo');

  const freePremiumTags = [];
  const premiumTagsElements = [...(block?.querySelectorAll('div:last-child') || [])];
  premiumTagsElements.forEach((tag) => {
    if (tag.lastChild.nodeName === '#text' && tag.children.length === 0) {
      freePremiumTags.push(tag);
      tag.style.display = 'none';
    }
  });

  await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]).then(([utils, placeholders]) => {
    ({ createTag, getConfig } = utils);
    ({ replaceKey } = placeholders);
  });

  async function handleOneUp(blockElement) {
    const parent = blockElement.parentElement;
    parent.classList.add('one-up');
    const img = blockElement?.querySelector('picture img');

    const templateEditLink = blockElement?.querySelector('a');
    templateEditLink.style.display = 'none';

    const editThisTemplate = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
    const editTemplateButton = createTag('a', {
      href: templateEditLink.href,
      title: `${editThisTemplate} ${img.alt}`,
      class: 'button accent',
      'aria-label': `${editThisTemplate} ${img.alt}`,
    });

    editTemplateButton.textContent = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
    const buttonContainer = createTag('section', { class: 'button-container' });
    buttonContainer.append(editTemplateButton);

    parent.append(buttonContainer);
  }

  async function handleMultipleVariants(multipleVariantsBlock = block) {
    const MULTIPLE_UP = 'multiple-up';
    const pictureElements = [...(multipleVariantsBlock?.querySelectorAll('picture') || [])];

    pictureElements.forEach((picture) => {
      picture.parentElement.parentElement.classList.add('image-container');
    });

    const parent = multipleVariantsBlock.parentElement;
    parent.classList.add(MULTIPLE_UP);

    const templateEditLinks = [...(multipleVariantsBlock?.querySelectorAll('a') || [])];
    templateEditLinks.forEach((link) => {
      link.style.display = 'none';
    });
  }

  const pictureElements = [...(block?.querySelectorAll('picture') || [])];
  const isOneUp = pictureElements.length === 1;

  // INIT LOGIC
  isOneUp ? handleOneUp(block) : handleMultipleVariants(block);
}