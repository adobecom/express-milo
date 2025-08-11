import { getLibs } from '../../scripts/utils.js';
console.log('getLibs', getLibs);

let createTag;
let getConfig;
let replaceKey;

export default async function decorate(block) {
console.log('getLibs', getLibs);

    await Promise.all([import(`${getLibs()}/utils/utils.js`), import(`${getLibs()}/features/placeholders.js`)]).then(([utils, placeholders]) => {
        ({ createTag, getConfig } = utils);
        ({ replaceKey } = placeholders);
      });
    
    // Create absolutely positioned button in top right corner
    const topRightButton = createTag('button', {
        class: 'top-right-button',
        style: `
            display: flex;
            padding: 8px 12px;
            justify-content: center;
            align-items: center;
            align-content: center;
            gap: 8px;
            flex-wrap: wrap;
            position: absolute;
            right: 16px;
            top: 16px;
            border-radius: 50px;
            background: rgba(36, 36, 36, 0.70);
            border: none;
            color: white;
            cursor: pointer;
            z-index: 1000;
        `
    });
    
    // Set button text content
    topRightButton.textContent = 'free';
    

    const ONE_UP = 'one-up';
    async function handleOneUp(oneUpVariantBlock) {
        const parent = block.parentElement;
        parent.classList.add('one-up');
        // const collapsibleBlock = parent.querySelector('collapsible-rows.blog');
        // console.log('oneUpVariantBlock', oneUpVariantBlock);
        const img = block?.querySelector('picture img');
        const picture = block?.querySelector('picture');
        picture.append(topRightButton);
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

    async function handleRestOfVariants(otherVariantsBlock) {
        const MULTIPLE_UP = 'multiple-up';
        const pictureElements = [...block?.querySelectorAll('picture')];
        console.log('pictureElements', typeof pictureElements)
        console.log('otherVariantsBlock', otherVariantsBlock);

        pictureElements.forEach((picture) => {
            picture.parentElement.parentElement.classList.add('image-container');
            picture.append(topRightButton);
        });

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
        const editThisTemplate = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';
        const editTemplateButton = createTag('a', {
            href: templateEditLink.href,
            title: `${editThisTemplate} ${img.alt}`,
            class: 'button accent',
            'aria-label': `${editThisTemplate} ${img.alt}`
          });
    
        editTemplateButton.textContent = await replaceKey('edit-this-template', getConfig()) ?? 'Edit this template';

        console.log('editTemplateButton', editTemplateButton);

    }
    // INIT LOGIC
    block?.classList?.contains(ONE_UP) 
        ? handleOneUp(block) 
        : handleRestOfVariants(block);
}