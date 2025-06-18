import { createTag } from '../utils.js';

export const LOCALES = [
  { code: 'zh-hk', label: 'Chinese (Hong Kong)' },
  { code: 'cmn-hans', label: 'Chinese (Simplified)' },
  { code: 'cmn-hant', label: 'Chinese (Traditional)' },
  { code: 'da-dk', label: 'Danish' },
  { code: 'nl-nl', label: 'Dutch' },
  { code: 'en-gb', label: 'English (UK)' },
  { code: 'en-us', label: 'English (US)' },
  { code: 'fr-fr', label: 'French' },
  { code: 'de-de', label: 'German' },
  { code: 'hi-in', label: 'Hindi' },
  { code: 'it-it', label: 'Italian' },
  { code: 'ja-jp', label: 'Japanese' },
  { code: 'ko-kr', label: 'Korean' },
  { code: 'nb-no', label: 'Norwegian' },
  { code: 'pt-pt', label: 'Portuguese' },
  { code: 'ru-ru', label: 'Russian' },
  { code: 'es-es', label: 'Spanish' },
  { code: 'sv-se', label: 'Swedish' },
];

export function createLocaleDropdown(options = {}) {
  const {
    defaultValue = 'en-us',
    onChange = () => {},
    className = 'custom-dropdown',
  } = options;

  const dropdown = createTag('div', { class: className });

  // Create the dropdown button
  const dropdownBtn = createTag('button', {
    class: 'dropdown-btn',
    type: 'button',
  });

  const defaultLocale = LOCALES.find((locale) => locale.code === defaultValue);
  const buttonText = createTag(
    'span',
    { class: 'dropdown-text' },
    defaultLocale?.label || 'English (US)',
  );
  const chevronIcon = createTag('span', { class: 'dropdown-chevron' }, '▼');

  dropdownBtn.append(buttonText, chevronIcon);

  // Create the dropdown content container
  const dropdownContent = createTag('div', { class: 'dropdown-content' });

  // Add all locale options
  LOCALES.forEach((locale, index) => {
    const option = createTag(
      'div',
      {
        class: 'dropdown-option',
        'data-value': locale.code,
        role: 'button',
        tabindex: index + 1,
      },
      locale.label,
    );

    option.addEventListener('click', (e) => {
      e.preventDefault();
      buttonText.textContent = locale.label;
      dropdown.dataset.value = locale.code;
      dropdownContent.classList.remove('show');
      chevronIcon.style.transform = 'rotate(0deg)';

      // Call the onChange callback
      onChange(locale.code, locale.label);
    });

    // Add keyboard support
    option.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        option.click();
      }
    });

    dropdownContent.append(option);
  });

  // Toggle dropdown on button click
  dropdownBtn.addEventListener('click', (e) => {
    e.preventDefault();
    dropdownContent.classList.toggle('show');
    const isOpen = dropdownContent.classList.contains('show');
    chevronIcon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdownContent.classList.remove('show');
      chevronIcon.style.transform = 'rotate(0deg)';
    }
  });

  dropdown.append(dropdownBtn, dropdownContent);
  dropdown.dataset.value = defaultValue;

  return dropdown;
}

export function createLocaleDropdownWrapper(options = {}) {
  const {
    label = 'Language spoken in video',
    labelId = 'locale-select',
    ...dropdownOptions
  } = options;

  const wrapper = createTag('div', { class: 'locale-dropdown-wrapper' });

  // Create label
  const labelElement = createTag(
    'label',
    {
      for: labelId,
      class: 'locale-dropdown-label',
    },
    label,
  );

  const dropdown = createLocaleDropdown(dropdownOptions);
  wrapper.append(labelElement, dropdown);

  return { wrapper, dropdown };
}
