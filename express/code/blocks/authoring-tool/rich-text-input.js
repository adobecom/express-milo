import { createTag } from '../../scripts/utils.js';

export async function createRichTextInput(output) {
    const response =  await fetch( window.location.origin + '/express/code/blocks/authoring-tool/rich-text-input.html' );
    const wrapper = createTag('div', {class: "rich-text-input"})
    wrapper.innerHTML = await response.text()
    
    // Elements
    const editor = wrapper.querySelector('.editor');
  
    const boldBtn = wrapper.querySelector('.bold');
    const italicBtn = wrapper.querySelector('.italic');
    const underlineBtn = wrapper.querySelector('.underline');
    const linkBtn = wrapper.querySelector('.link');
    const imageBtn = wrapper.querySelector('.image');

    const linkDialog = wrapper.querySelector('.link-dialog');
    const linkUrl = wrapper.querySelector('.link-url');
    const linkText = wrapper.querySelector('.link-text');
    const insertLinkBtn = wrapper.querySelector('.insert-link');
    const cancelLinkBtn = wrapper.querySelector('.cancel-link');

    const imageDialog = wrapper.querySelector('.image-dialog');
    const imageUrl = wrapper.querySelector('.image-url');
    const imageAlt = wrapper.querySelector('.image-alt');
    const insertImageBtn = wrapper.querySelector('.insert-image');
    const cancelImageBtn = wrapper.querySelector('.cancel-image');

    const overlay = wrapper.querySelector('.overlay');

    // Save selection state
    let savedSelection = null;

    function saveSelection() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            savedSelection = selection.getRangeAt(0);
        }
    }

    function restoreSelection() {
        if (savedSelection) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(savedSelection);
        }
    }

    function makeTextStrong() {
        // Get the current selection
        const selection = window.getSelection();
        
        if (selection.rangeCount > 0) {
          // Get the selected range
          const range = selection.getRangeAt(0);
          
          // Create a strong element
          const strongElement = document.createElement('strong');
          
          // Extract the selected content and put it in the strong element
          strongElement.appendChild(range.extractContents());
          
          // Insert the strong element at the position of the range
          range.insertNode(strongElement);
          
          // Collapse the selection to the end
          selection.collapseToEnd();
        }
      }

    // Text formatting functions
    function formatText(command) {
        document.execCommand(command, false, null);
        editor.focus();
    }

    // Show dialog functions
    function showDialog(dialog) {
        saveSelection();
        overlay.style.display = 'block';
        dialog.style.display = 'block';

        if (dialog === linkDialog) {
            const selection = window.getSelection();
            if (selection.toString()) {
                linkText.value = selection.toString();
            } else {
                linkText.value = '';
            }
            linkUrl.value = 'https://';
            linkUrl.focus();
        } else if (dialog === imageDialog) {
            imageUrl.value = 'https://';
            imageAlt.value = '';
            imageUrl.focus();
        }
    }

    function hideDialog(dialog) {
        overlay.style.display = 'none';
        dialog.style.display = 'none';
        editor.focus();
    }

    // Insert link function
    function insertLink() {
        const url = linkUrl.value;
        const text = linkText.value || url;

        if (url) {
            restoreSelection();
            document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${text}</a>`);
            hideDialog(linkDialog);
        }
    }

    // Insert image function
    function insertImage() {
        const url = imageUrl.value;
        const alt = imageAlt.value || '';

        if (url) {
            restoreSelection();
            document.execCommand('insertHTML', false, `<img src="${url}" alt="${alt}" style="max-width: 100%;">`);
            hideDialog(imageDialog);
        }
    }

    // Button event listeners
    boldBtn.addEventListener('click', () => makeTextStrong());
    italicBtn.addEventListener('click', () => formatText('italic'));
    underlineBtn.addEventListener('click', () => formatText('underline'));
    linkBtn.addEventListener('click', () => showDialog(linkDialog));
    imageBtn.addEventListener('click', () => showDialog(imageDialog));

    // Dialog button event listeners
    insertLinkBtn.addEventListener('click', insertLink);
    cancelLinkBtn.addEventListener('click', () => hideDialog(linkDialog));

    insertImageBtn.addEventListener('click', insertImage);
    cancelImageBtn.addEventListener('click', () => hideDialog(imageDialog));

    // Handle keyboard shortcuts in dialogs
    linkUrl.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            insertLink();
        }
    });

    linkText.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            insertLink();
        }
    });

    imageUrl.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            insertImage();
        }
    });

    imageAlt.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            insertImage();
        }
    });

    // Close dialogs when clicking on overlay
    overlay.addEventListener('click', function () {
        hideDialog(linkDialog);
        hideDialog(imageDialog);
    });

    // Set initial focus
    editor.focus();
    return wrapper
}