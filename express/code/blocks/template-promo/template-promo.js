import { getLibs } from '../../scripts/utils.js';
import templatePromoCarousel from '../template-promo-carousel/template-promo-carousel.js';

let createTag;
let getConfig;
let replaceKey;

export default async function decorate(block) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]).then(([utils, placeholders]) => {
    ({ createTag, getConfig } = utils);
    ({ replaceKey } = placeholders);
  });

  block.parentElement.classList.add('ax-template-promo');

  const freePremiumTags = [];
  const premiumTagsElements = [...(block?.querySelectorAll('div:last-child') || [])];
  premiumTagsElements.forEach((tag) => {
    if (tag.lastChild.nodeName === '#text' && tag.children.length === 0) {
      freePremiumTags.push(tag);
      tag.style.display = 'none';
    }
  });


  async function handleOneUp(blockElement) {
    const freePremiumTags2 = blockElement?.children[0].lastElementChild;
    freePremiumTags2.style.display = 'none';
    console.log('freePremiumTags3:', freePremiumTags2);
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

  const imageElements = [...(block?.querySelectorAll('picture > img') || [])];
  // console.log('imageElements:', imageElements);
  const isOneUp = imageElements.length === 1;
  // console.log('Template Promo Block:', block, 'Picture Elements:', imageElements, 'Is One Up:', isOneUp);

  // INIT LOGIC
  isOneUp ? handleOneUp(block) : templatePromoCarousel(block, imageElements);
}
