import { createTag, getLibs } from '../utils.js';

export function createTextInputBoxWithCTA(options = {}) {
  const { label, placeholder, cta, ctaHref, paramKey } = options;

  const inputBox = createTag('div', { class: 'input-box' });
  const labelTag = createTag('div', { class: 'input-box-label' }, label);
  const inputElement = createTag('input', { id: 'input-box-input-element', type: 'text', placeholder, class: 'input-box-input-element' });
  const ctaElement = createTag('a', { class: 'input-box-cta', href: ctaHref, role: 'button' }, cta);
  ctaElement.addEventListener('click', () => {
    const inputValue = (inputElement.value || '').trim();
    if (!inputValue) return;
    try {
      const linkUrl = new URL(ctaHref, window.location.href);
      linkUrl.searchParams.set(paramKey, inputValue);
      ctaElement.setAttribute('href', linkUrl.toString());
    } catch (err) {
      const [base, hash] = String(ctaHref).split('#');
      const separator = base.includes('?') ? '&' : '?';
      const newHref = `${base}${separator}${encodeURIComponent(paramKey)}=${encodeURIComponent(inputValue)}${hash ? `#${hash}` : ''}`;
      ctaElement.setAttribute('href', newHref);
    }
  });
  inputBox.append(labelTag, inputElement, ctaElement);
  return inputBox;
}

export async function loadStylesForTextInputBoxWithCTA() {
  const { loadStyle } = await import(`${getLibs()}/utils/utils.js`);
  await loadStyle('/express/code/scripts/widgets/text-input-box-with-cta.css');
}