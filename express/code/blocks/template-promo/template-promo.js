import { getLibs } from '../../scripts/utils.js';
import templateXCarousel from '../template-x-carousel/template-x-carousel.js';
import template from 'templateProps.js';

console.log('templateProps.js', template);

let createTag;
let getConfig;
let replaceKey;

export default async function decorate(block) {
    // block.parentElement.style.visibility = 'hidden';
    block.parentElement.classList.add('ax-template-promo');
    
    const freePremiumTags = [];
    const premiumTagsElements = [...block?.querySelectorAll('div:last-child')];
    premiumTagsElements.forEach((tag) => { 
        if (tag.lastChild.nodeName === '#text' &&  tag.children.length === 0) {
            freePremiumTags.push(tag);
            tag.style.display = 'none';
        }
    });

    await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]).then(([utils, placeholders]) => {
        ({ createTag, getConfig } = utils);
        ({ replaceKey } = placeholders);
      });
    
    
    async function handleOneUp(oneUpVariantBlock) {
        const parent = block.parentElement;
        parent.classList.add('one-up');
        // const collapsibleBlock = parent.querySelector('collapsible-rows.blog');
        // console.log('oneUpVariantBlock', oneUpVariantBlock);
        const img = block?.querySelector('picture img');
        const picture = block?.querySelector('picture');
        // picture.append(topRightButton);
        // pictureElement.parentElement.remove();
        // console.log('img', img);
        // console.log('parent', parent);

        const templateEditLink = block?.querySelector('a');
        templateEditLink.style.display = 'none';
        // console.log('templateEditLink');

        // console.log('picture'. pictureElement)
        const editThisTemplate = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
        const editTemplateButton = createTag('a', {
            href: templateEditLink.href,
            title: `${editThisTemplate} ${img.alt}`,
            class: 'button accent',
            'aria-label': `${editThisTemplate} ${img.alt}`
          });
    
        editTemplateButton.textContent = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
        const buttonContainer = createTag('section', { class: 'button-container' });
        buttonContainer.append(editTemplateButton);

        // parent.replaceChildren(...parent.children, ...variantWrapper);
        parent.append(buttonContainer);
        
    }

    async function handleMultipleVariants(block) {
        const MULTIPLE_UP = 'multiple-up';
        const pictureElements = [...block?.querySelectorAll('picture')];
        // console.log('pictureElements', typeof pictureElements)
        // console.log('otherVariantsBlock', otherVariantsBlock);

        pictureElements.forEach((picture) => {
            picture.parentElement.parentElement.classList.add('image-container');
            // picture.append(topRightButton);
        });

        templateXCarousel(block);

        const parent = block.parentElement;
        parent.classList.add(MULTIPLE_UP);
        const img = block?.querySelector('picture img');
        // console.log('img', img);
        // console.log('parent', parent);

        const templateEditLinks = [...block?.querySelectorAll('a')];
        templateEditLinks.forEach((link) => link.style.display = 'none');
        // templateEditLink.style.display = 'none';
        // console.log('templateEditLink');

        // console.log('picture'. pictureElement)
        // const editThisTemplate = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
        // const editTemplateButton = createTag('a', {
        //     href: templateEditLink.href,
        //     title: `${editThisTemplate} ${img.alt}`,
        //     class: 'button accent',
        //     'aria-label': `${editThisTemplate} ${img.alt}`
        //   });
    
        // editTemplateButton.textContent = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';

        // console.log('editTemplateButton', editTemplateButton);

    }
    const pictureElements = [...block?.querySelectorAll('picture')];
    // console.log('pictureElements.length', pictureElements.length);
    const isOneUp = pictureElements.length === 1;

    // INIT LOGIC
    isOneUp ? handleOneUp(block) : handleMultipleVariants(block);
}