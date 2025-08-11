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
    
    const ONE_UP = 'one-up';
    async function handleOneUp(oneUpVariantBlock) {
        const parent = block.parentElement;
        parent.classList.add('one-up');
        // const collapsibleBlock = parent.querySelector('collapsible-rows.blog');
        // console.log('oneUpVariantBlock', oneUpVariantBlock);
        const img = block?.querySelector('picture img');
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

    function handleRestOfVariants(otherVariantsBlock) {
        const pictureElements = block?.querySelectorAll('picture');
        console.log('pictureElements', pictureElements)
        console.log('otherVariantsBlock', otherVariantsBlock);
    }
    // INIT LOGIC
    block?.classList?.contains(ONE_UP) ? handleOneUp(block) : handleRestOfVariants(block);
    // console.log('Block classList:', block.classList);
    // console.log('block', block);
    // console.log('block parent', block.parentElement);
    // console.log('blkock classlist ', block)
    // const pictureElements = block?.querySelectorAll('picture');
    // console.log('pictureElements', pictureElements);
}