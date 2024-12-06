import { getIconDeprecated } from './icons.js';
import { getLibs } from '../utils.js';

// This was only added for the blocks premigration. It is not to be used for new blocks.
export async function decorateButtonsDeprecated(el, size) {
  const { decorateButtons } = await import(`${getLibs()}/utils/decorate.js`);
  // deactivate milo button styling for ax-columns and banner since links have perhaps unnecessarily
  // been authored bold or italic. We'll want to roll this back at some point.
  if (!el.closest('.ax-columns') && !el.closest('.banner') && !el.closest('.fullscreen-marquee')) decorateButtons(el, size);

  el.querySelectorAll(':scope a:not(.con-button, .social-link, .same-fcta)').forEach(($a) => {
    const originalHref = $a.href;
    const linkText = $a.textContent.trim();
    if ($a.children.length > 0) {
      // We can use this to eliminate styling so only text
      // propagates to buttons.
      $a.innerHTML = $a.innerHTML.replaceAll('<u>', '').replaceAll('</u>', '');
    }
    $a.title = $a.title || linkText;
    try {
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
        if (linkText.startsWith('{{icon-') && linkText.endsWith('}}')) {
          const $iconName = /{{icon-([\w-]+)}}/g.exec(linkText)[1];
          if ($iconName) {
            $a.appendChild(getIconDeprecated($iconName, `${$iconName} icon`));
            $a.classList.remove('button', 'primary', 'secondary', 'accent');
            $a.title = $iconName;
          }
        }
      }
    } catch (e) {
      window.lana?.log(`Ignoring button due to error: ${e}`);
    }
  });
}

export function addTempWrapperDeprecated($block, blockName) {
  const wrapper = document.createElement('div');
  const parent = $block.parentElement;
  wrapper.classList.add(`${blockName}-wrapper`);
  parent.insertBefore(wrapper, $block);
  wrapper.append($block);
}

export function splitAndAddVariantsWithDash(block) {
  // split and add options with a dash
  // (fullscreen-center -> fullscreen-center + fullscreen + center)
  const extra = [];
  block.classList.forEach((className, index) => {
    if (index === 0) return; // block name, no split
    const split = className.split('-');
    if (split.length > 1) {
      split.forEach((part) => {
        extra.push(part);
      });
    }
  });
  block.classList.add(...extra);
}

export function normalizeHeadings(block, allowedHeadings) {
  const allowed = allowedHeadings.map((h) => h.toLowerCase());
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((tag) => {
    const h = tag.tagName.toLowerCase();
    if (allowed.indexOf(h) === -1) {
      // current heading is not in the allowed list -> try first to "promote" the heading
      let level = parseInt(h.charAt(1), 10) - 1;
      while (allowed.indexOf(`h${level}`) === -1 && level > 0) {
        level -= 1;
      }
      if (level === 0) {
        // did not find a match -> try to "downgrade" the heading
        while (allowed.indexOf(`h${level}`) === -1 && level < 7) {
          level += 1;
        }
      }
      if (level !== 7) {
        tag.outerHTML = `<h${level}>${tag.textContent.trim()}</h${level}>`;
      }
    }
  });
}
