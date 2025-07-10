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

// Actions for keyboard navigation
const SelectActions = {
  Close: 0,
  CloseSelect: 1,
  First: 2,
  Last: 3,
  Next: 4,
  Open: 5,
  PageDown: 6,
  PageUp: 7,
  Previous: 8,
  Select: 9,
  Type: 10,
};

// Helper functions
function filterOptions(options = [], filter = '', exclude = []) {
  return options.filter((option) => {
    const matches = option.label.toLowerCase().indexOf(filter.toLowerCase()) === 0;
    return matches && exclude.indexOf(option.label) < 0;
  });
}

function getActionFromKey(event, menuOpen) {
  const { key, altKey, ctrlKey, metaKey } = event;
  const openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' '];

  // Handle opening when closed
  if (!menuOpen && openKeys.includes(key)) {
    return SelectActions.Open;
  }

  // Home and end move the selected option when open or closed
  if (key === 'Home') {
    return SelectActions.First;
  }
  if (key === 'End') {
    return SelectActions.Last;
  }

  // Handle typing characters when open or closed
  if (
    key === 'Backspace'
    || key === 'Clear'
    || (key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey)
  ) {
    return SelectActions.Type;
  }

  // Handle keys when open
  if (menuOpen) {
    if (key === 'ArrowUp' && altKey) {
      return SelectActions.CloseSelect;
    }
    if (key === 'ArrowDown' && !altKey) {
      return SelectActions.Next;
    }
    if (key === 'ArrowUp') {
      return SelectActions.Previous;
    }
    if (key === 'PageUp') {
      return SelectActions.PageUp;
    }
    if (key === 'PageDown') {
      return SelectActions.PageDown;
    }
    if (key === 'Escape') {
      return SelectActions.Close;
    }
    if (key === 'Enter' || key === ' ') {
      return SelectActions.CloseSelect;
    }
  }

  return null;
}

function getIndexByLetter(options, filter, startIndex = 0) {
  const orderedOptions = [
    ...options.slice(startIndex),
    ...options.slice(0, startIndex),
  ];
  const firstMatch = filterOptions(orderedOptions, filter)[0];
  const allSameLetter = (array) => array.every((letter) => letter === array[0]);

  // First check if there is an exact match for the typed string
  if (firstMatch) {
    return options.findIndex((opt) => opt.label === firstMatch.label);
  }

  // If the same letter is being repeated, cycle through first-letter matches
  if (allSameLetter(filter.split(''))) {
    const matches = filterOptions(options, filter[0]);
    const matchIndex = matches.findIndex(
      (opt) => opt.label === options[startIndex]?.label,
    );
    const nextMatch = matches[(matchIndex + 1) % matches.length];
    return options.findIndex((opt) => opt.label === nextMatch.label);
  }

  // No matches
  return -1;
}

function isScrollable(element) {
  return element && element.clientHeight < element.scrollHeight;
}

function maintainScrollVisibility(activeElement, scrollParent) {
  const { offsetHeight, offsetTop } = activeElement;
  const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

  const isAbove = offsetTop < scrollTop;
  const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;

  if (isAbove) {
    scrollParent.scrollTop = offsetTop;
  } else if (isBelow) {
    scrollParent.scrollTop = offsetTop - parentOffsetHeight + offsetHeight;
  }
}

function isElementInViewport(element, container) {
  if (!element || !container) return true;

  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return (
    elementRect.top >= containerRect.top
    && elementRect.bottom <= containerRect.bottom
  );
}

// ARIA Combobox Class
class LocaleCombobox {
  constructor(element, options = {}) {
    this.el = element;
    this.comboEl = element.querySelector('[role="combobox"]');
    this.listboxEl = element.querySelector('[role="listbox"]');
    this.idBase = this.comboEl.id || 'combobox';
    this.options = LOCALES;
    this.filteredOptions = LOCALES;
    this.defaultValue = options.defaultValue || 'en-us';
    this.onChange = options.onChange || (() => {});

    // Find default locale
    const defaultLocale = this.options.find(
      (opt) => opt.code === this.defaultValue,
    );

    // Set initial active index to the default value
    this.activeIndex = this.options.findIndex(
      (opt) => opt.code === this.defaultValue,
    );
    if (this.activeIndex === -1) this.activeIndex = 0;

    // Initialize with default value
    if (defaultLocale) {
      this.comboEl.textContent = defaultLocale.label;
      this.comboEl.setAttribute('data-value', defaultLocale.code);
    }

    this.open = false;
    this.searchString = '';
    this.searchTimeout = null;
    this.ignoreBlur = false;

    this.init();
  }

  init() {
    // Set up initial ARIA attributes
    this.comboEl.setAttribute('aria-expanded', 'false');
    this.comboEl.setAttribute('aria-haspopup', 'listbox');
    this.comboEl.setAttribute('aria-controls', this.listboxEl.id);
    this.comboEl.setAttribute('tabindex', '0');

    // Create options
    this.createOptions();

    // Set initial selected state
    const options = this.listboxEl.querySelectorAll('[role="option"]');
    if (options[this.activeIndex]) {
      options[this.activeIndex].setAttribute('aria-selected', 'true');
    }

    // Set up event listeners
    this.comboEl.addEventListener('blur', this.onComboBlur.bind(this));
    this.comboEl.addEventListener('click', this.onComboClick.bind(this));
    this.comboEl.addEventListener('keydown', this.onComboKeyDown.bind(this));

    // Close dropdown when clicking outside
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  createOptions() {
    this.listboxEl.innerHTML = '';
    this.options.forEach((option, index) => {
      const optionEl = createTag(
        'div',
        {
          role: 'option',
          id: `${this.idBase}-${index}`,
          class: 'combobox-option',
          'aria-selected': 'false',
        },
        option.label,
      );

      optionEl.addEventListener('click', () => this.onOptionClick(index));
      optionEl.addEventListener('mousedown', this.onOptionMouseDown.bind(this));

      this.listboxEl.appendChild(optionEl);
    });
  }

  onComboBlur() {
    if (this.ignoreBlur) {
      this.ignoreBlur = false;
      return;
    }
    this.updateMenuState(false);
  }

  onComboClick() {
    this.updateMenuState(!this.open, false);
  }

  onComboKeyDown(event) {
    const { key } = event;
    const max = this.options.length - 1;

    const action = getActionFromKey(event, this.open);

    switch (action) {
      case SelectActions.Last:
      case SelectActions.First:
        this.updateMenuState(true);
      // Fall through
      case SelectActions.Next:
      case SelectActions.Previous: {
        event.preventDefault();
        let newIndex;
        if (action === SelectActions.First) {
          newIndex = 0;
        } else if (action === SelectActions.Last) {
          newIndex = max;
        } else if (action === SelectActions.Next) {
          newIndex = Math.min(max, this.activeIndex + 1);
        } else {
          newIndex = Math.max(0, this.activeIndex - 1);
        }
        return this.onOptionChange(newIndex);
      }
      case SelectActions.PageUp:
        event.preventDefault();
        if (this.open) {
          this.onOptionChange(Math.max(0, this.activeIndex - 10));
        }
        return undefined;
      case SelectActions.PageDown:
        event.preventDefault();
        if (this.open) {
          this.onOptionChange(Math.min(max, this.activeIndex + 10));
        }
        return undefined;
      case SelectActions.CloseSelect:
        event.preventDefault();
        this.selectOption(this.activeIndex);
        return this.updateMenuState(false);
      case SelectActions.Close:
        event.preventDefault();
        return this.updateMenuState(false);
      case SelectActions.Open:
        event.preventDefault();
        return this.updateMenuState(true);
      case SelectActions.Type: {
        this.updateMenuState(true);
        this.searchString += key.toLowerCase();
        this.searchTimeout = window.setTimeout(() => {
          this.searchString = '';
        }, 500);

        const searchIndex = getIndexByLetter(
          this.options,
          this.searchString,
          this.activeIndex + 1,
        );

        if (searchIndex >= 0) {
          this.onOptionChange(searchIndex);
        } else {
          window.clearTimeout(this.searchTimeout);
          this.searchString = '';
        }
        return undefined;
      }
      default:
        return undefined;
    }
  }

  onOptionChange(index) {
    // Update state
    this.activeIndex = index;

    // Update aria-activedescendant for keyboard navigation
    this.comboEl.setAttribute(
      'aria-activedescendant',
      `${this.idBase}-${index}`,
    );

    // Update visual highlight for keyboard navigation only
    const options = this.listboxEl.querySelectorAll('[role="option"]');
    [...options].forEach((optionEl) => {
      optionEl.classList.remove('option-current');
    });

    if (options[index]) {
      options[index].classList.add('option-current');

      // Smooth scroll management
      if (isScrollable(this.listboxEl)) {
        maintainScrollVisibility(options[index], this.listboxEl);
      }
    }
  }

  onOptionClick(index) {
    this.onOptionChange(index);
    this.selectOption(index);
    this.updateMenuState(false);
  }

  onOptionMouseDown() {
    // Prevent blur when clicking on options
    this.ignoreBlur = true;
  }

  selectOption(index) {
    // Update state
    this.activeIndex = index;

    // Update displayed value
    const selected = this.options[index];
    this.comboEl.textContent = selected.label;
    this.comboEl.setAttribute('data-value', selected.code);

    // Update aria-selected on the actual selected option
    const options = this.listboxEl.querySelectorAll('[role="option"]');
    [...options].forEach((optionEl) => {
      optionEl.setAttribute('aria-selected', 'false');
    });

    if (options[index]) {
      options[index].setAttribute('aria-selected', 'true');
    }

    // Call the onChange callback
    this.onChange(selected.code, selected.label);
  }

  updateMenuState(open, callFocus = true) {
    if (this.open === open) {
      return;
    }

    // Update state
    this.open = open;

    // Update aria-expanded and styles
    this.comboEl.setAttribute('aria-expanded', `${open}`);
    open ? this.el.classList.add('open') : this.el.classList.remove('open');

    // Update activedescendant
    const activeID = open ? `${this.idBase}-${this.activeIndex}` : '';
    this.comboEl.setAttribute('aria-activedescendant', activeID);

    if (activeID === '' && !isElementInViewport(this.comboEl, this.el)) {
      this.comboEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Move focus back to the combobox, if needed
    if (callFocus) {
      this.comboEl.focus();
    }

    // Update option highlight when opening
    if (open) {
      this.onOptionChange(this.activeIndex);
    }
  }

  onDocumentClick(event) {
    if (!this.el.contains(event.target)) {
      this.updateMenuState(false);
    }
  }
}

export function createLocaleDropdown(options = {}) {
  const {
    defaultValue = 'en-us',
    onChange = () => {},
    className = 'locale-combobox',
    id = 'locale-combobox',
  } = options;

  // Find default locale
  const defaultLocale = LOCALES.find((locale) => locale.code === defaultValue);

  // Create container
  const container = createTag('div', {
    class: className,
    id: `${id}-container`,
  });

  // Create combobox element
  const combobox = createTag(
    'div',
    {
      role: 'combobox',
      id,
      class: 'combobox-input',
      'aria-expanded': 'false',
      'aria-haspopup': 'listbox',
      'aria-controls': `${id}-listbox`,
      'data-value': defaultValue,
      tabindex: '0',
    },
    defaultLocale?.label || 'English (US)',
  );

  // Create listbox
  const listbox = createTag('div', {
    role: 'listbox',
    id: `${id}-listbox`,
    class: 'combobox-listbox',
    'aria-label': 'Language options',
  });

  container.append(combobox, listbox);

  // Initialize the combobox
  const comboboxInstance = new LocaleCombobox(container, {
    defaultValue,
    onChange,
  });

  // Return container and instance for external access
  container.comboboxInstance = comboboxInstance;
  return container;
}

export function createLocaleDropdownWrapper(options = {}) {
  const {
    label = 'Choose the language spoken in video',
    labelId = 'locale-select-label',
    comboboxId = 'locale-select',
    ...dropdownOptions
  } = options;

  const wrapper = createTag('div', { class: 'locale-dropdown-wrapper' });

  // Create label
  const labelElement = createTag(
    'p',
    {
      id: labelId,
      class: 'locale-dropdown-label',
    },
    label,
  );

  const dropdown = createLocaleDropdown({
    ...dropdownOptions,
    id: comboboxId,
  });

  // Associate label with combobox
  const comboboxEl = dropdown.querySelector('[role="combobox"]');
  comboboxEl.setAttribute('aria-labelledby', labelId);
  comboboxEl.setAttribute('id', comboboxId);

  wrapper.append(labelElement, dropdown);

  return { wrapper, dropdown };
}
