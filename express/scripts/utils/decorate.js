// This was only added for the blocks premigration. It is not to be used for new blocks.
export function decorateButtons_deprecated(el ) {
    el.querySelectorAll(':scope a').forEach(($a) => {
        const originalHref = $a.href;
        const linkText = $a.textContent.trim();
        if ($a.children.length > 0) {
            // We can use this to eliminate styling so only text
            // propagates to buttons.
            $a.innerHTML = $a.innerHTML.replaceAll('<u>', '').replaceAll('</u>', '');
        }
        $a.title = $a.title || linkText;
        const { hash } = new URL($a.href);

        if (originalHref !== linkText
            && !(linkText.startsWith('https') && linkText.includes('/media_'))
            && !/hlx\.blob\.core\.windows\.net/.test(linkText)
            && !linkText.endsWith(' >')
            && !(hash === '#embed-video')
            && !linkText.endsWith(' ›')
            && !linkText.endsWith('.svg')) {
            const $up = $a.parentElement;
            const $twoup = $a.parentElement.parentElement;
            if (!$a.querySelector('img')) {
                if ($up.childNodes.length === 1 && ($up.tagName === 'P' || $up.tagName === 'DIV')) {
                    $a.classList.add('button', 'accent'); // default
                    $up.classList.add('button-container');
                }
                if ($up.childNodes.length === 1 && $up.tagName === 'STRONG'
                    && $twoup.children.length === 1 && $twoup.tagName === 'P') {
                    $a.classList.add('button', 'accent');
                    $twoup.classList.add('button-container');
                }
                if ($up.childNodes.length === 1 && $up.tagName === 'EM'
                    && $twoup.children.length === 1 && $twoup.tagName === 'P') {
                    $a.classList.add('button', 'accent', 'light');
                    $twoup.classList.add('button-container');
                }
            }
            // TODO add with icon code probably
            // if (linkText.startsWith('{{icon-') && linkText.endsWith('}}')) {
            //     const $iconName = /{{icon-([\w-]+)}}/g.exec(linkText)[1];
            //     if ($iconName) {
            //         $a.innerHTML = getIcon($iconName, `${$iconName} icon`);
            //         $a.classList.remove('button', 'primary', 'secondary', 'accent');
            //         $a.title = $iconName;
            //     }
            // }
        }
    });
}

export function addTempWrapper($block, blockName) {
    const wrapper = document.createElement('div');
    const parent = $block.parentElement;
    wrapper.classList.add(`${blockName}-wrapper`);
    parent.insertBefore(wrapper, $block);
    wrapper.append($block);
  }
  