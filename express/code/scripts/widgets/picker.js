import { getLibs, createTag } from '../utils.js';

let stylesLoaded = false;
let loadStyle;
let getConfig;

/**
 * Initializes utils from milo
 */
async function initUtils() {
  if (!loadStyle) {
    const utils = await import(`${getLibs()}/utils/utils.js`);
    ({ loadStyle, getConfig } = utils);
  }
}

/**
 * Loads picker styles (once per page)
 */
async function loadPickerStyles() {
  if (stylesLoaded) return;
  await initUtils();
  const config = getConfig();
  loadStyle(`${config.codeRoot}/scripts/widgets/picker.css`);
  stylesLoaded = true;
}

/**
 * Creates a standard picker/selector component
 * @param {Object} config - Configuration object
 * @param {string} config.id - ID for the select element
 * @param {string} config.name - Name attribute for the select
 * @param {string} config.label - Label text
 * @param {boolean} config.required - Whether field is required (adds asterisk)
 * @param {string} config.helpText - Help text below the picker
 * @param {Array} config.options - Array of {value, text, disabled} objects
 * @param {string} config.defaultValue - Default selected value
 * @param {Function} config.onChange - Change handler function(value, event)
 * @param {boolean} config.disabled - Whether picker is disabled
 * @param {string} config.size - Size variant: 's', 'm' (default), 'l', 'xl'
 * @param {string} config.variant - Visual variant: 'default', 'quiet'
 * @param {string} config.labelPosition - Label position: 'top' (default), 'side'
 * @param {string} config.ariaLabel - ARIA label for accessibility
 * @param {string} config.ariaDescribedBy - ARIA described-by for help text
 * @returns {HTMLElement} The picker container element
 */
export function createPicker({
  id,
  name,
  label = '',
  required = false,
  helpText = '',
  options = [],
  defaultValue = null,
  onChange = null,
  disabled = false,
  size = 'm',
  variant = 'default',
  labelPosition = 'top',
  ariaLabel = '',
  ariaDescribedBy = '',
} = {}) {
  loadPickerStyles();

  let currentValue = defaultValue || (options.length > 0 ? options[0].value : '');
  let isOpen = false;
  let focusedOptionIndex = -1;

  // eslint-disable-next-line no-console
  console.log('Picker initialized:', { defaultValue, currentValue, options });

  const container = createTag('div', { class: 'picker-container' });

  if (size && size !== 'm') {
    container.classList.add(`size-${size}`);
  }
  if (variant && variant !== 'default') {
    container.classList.add(variant);
  }
  if (labelPosition === 'side') {
    container.classList.add('side');
  }

  if (label) {
    const labelEl = createTag('label', {
      class: `picker-label${required ? ' required' : ''}`,
      for: id,
    });
    labelEl.textContent = label;
    container.appendChild(labelEl);
  }

  // Create button wrapper (what looks like the select)
  const buttonWrapperAttrs = {
    class: 'picker-button-wrapper',
    id,
    role: 'button',
    tabindex: disabled ? '-1' : '0',
    'aria-haspopup': 'listbox',
    'aria-expanded': 'false',
  };

  if (ariaLabel) buttonWrapperAttrs['aria-label'] = ariaLabel;
  if (ariaDescribedBy) buttonWrapperAttrs['aria-describedby'] = ariaDescribedBy;

  const buttonWrapper = createTag('div', buttonWrapperAttrs);

  // Current selected value display
  const currentValueSpan = createTag('span', { class: 'picker-current-value' });
  const selectedOption = options.find((opt) => String(opt.value) === String(currentValue));
  currentValueSpan.textContent = selectedOption ? selectedOption.text : '';

  // eslint-disable-next-line no-console
  console.log('Selected option:', { currentValue, selectedOption, displayText: currentValueSpan.textContent });

  // Chevron icon
  const chevron = createTag('img', {
    class: 'picker-chevron',
    src: '/express/code/icons/drop-down-arrow.svg',
    alt: '',
    'aria-hidden': 'true',
  });

  buttonWrapper.appendChild(currentValueSpan);
  buttonWrapper.appendChild(chevron);

  // Create options wrapper (the dropdown)
  const optionsWrapper = createTag('div', {
    class: 'picker-options-wrapper',
    role: 'listbox',
  });

  // Create option buttons
  const createOptionButtons = (opts) => {
    optionsWrapper.innerHTML = '';
    opts.forEach(({ value, text, disabled: optionDisabled }, index) => {
      const isActive = String(value) === String(currentValue);
      const optionButton = createTag('div', {
        class: `picker-option-button${isActive ? ' active' : ''}${optionDisabled ? ' disabled' : ''}`,
        'data-value': value,
        role: 'option',
        'aria-selected': isActive ? 'true' : 'false',
      });

      // eslint-disable-next-line no-console
      console.log('Creating option:', { value, text, currentValue, isActive });

      // Add checkmark icon for active option
      if (isActive) {
        const checkmark = createTag('img', {
          class: 'picker-option-checkmark',
          src: '/express/code/icons/checkmark.svg',
          alt: '',
          'aria-hidden': 'true',
        });
        optionButton.appendChild(checkmark);
      }

      // Add text content
      const textSpan = createTag('span', { class: 'picker-option-text' });
      textSpan.textContent = text;
      optionButton.appendChild(textSpan);

      if (!optionDisabled) {
        optionButton.addEventListener('click', () => {
          if (String(currentValue) !== String(value)) {
            currentValue = value;
            currentValueSpan.textContent = text;
            hiddenInput.value = value;

            // eslint-disable-next-line no-console
            console.log('Option clicked:', { value, text, newCurrentValue: currentValue });

            // Update active state and checkmarks
            optionsWrapper.querySelectorAll('.picker-option-button').forEach((opt) => {
              opt.classList.remove('active');
              opt.setAttribute('aria-selected', 'false');
              // Remove checkmark
              const existingCheckmark = opt.querySelector('.picker-option-checkmark');
              if (existingCheckmark) {
                existingCheckmark.remove();
              }
            });

            // Add active class and checkmark to selected option
            optionButton.classList.add('active');
            optionButton.setAttribute('aria-selected', 'true');
            const checkmark = createTag('img', {
              class: 'picker-option-checkmark',
              src: '/express/code/icons/checkmark.svg',
              alt: '',
              'aria-hidden': 'true',
            });
            optionButton.insertBefore(checkmark, optionButton.firstChild);

            // Call onChange callback
            if (onChange) {
              onChange(value, { target: { value } });
            }
          }
          closeDropdown();
        });
      }

      optionsWrapper.appendChild(optionButton);
    });
  };

  createOptionButtons(options);

  // Toggle dropdown
  const toggleDropdown = () => {
    if (disabled) return;
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const openDropdown = () => {
    if (disabled) return;
    isOpen = true;
    container.classList.add('opened');
    buttonWrapper.setAttribute('aria-expanded', 'true');
    focusedOptionIndex = -1;
  };

  const closeDropdown = () => {
    isOpen = false;
    container.classList.remove('opened');
    buttonWrapper.setAttribute('aria-expanded', 'false');
    focusedOptionIndex = -1;
  };

  // Click handler for button
  buttonWrapper.addEventListener('click', toggleDropdown);

  // Keyboard navigation
  buttonWrapper.addEventListener('keydown', (e) => {
    const opts = [...optionsWrapper.querySelectorAll('.picker-option-button:not(.disabled)')];

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        openDropdown();
      } else {
        focusedOptionIndex = Math.min(focusedOptionIndex + 1, opts.length - 1);
        if (opts[focusedOptionIndex]) {
          opts[focusedOptionIndex].click();
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        focusedOptionIndex = Math.max(focusedOptionIndex - 1, 0);
        if (opts[focusedOptionIndex]) {
          opts[focusedOptionIndex].click();
        }
      }
    } else if (e.key === 'Home' && isOpen) {
      e.preventDefault();
      focusedOptionIndex = 0;
      if (opts[0]) opts[0].click();
    } else if (e.key === 'End' && isOpen) {
      e.preventDefault();
      focusedOptionIndex = opts.length - 1;
      if (opts[focusedOptionIndex]) {
        opts[focusedOptionIndex].click();
      }
    }
  });

  // Click outside to close
  const handleClickOutside = (e) => {
    if (isOpen && !container.contains(e.target)) {
      closeDropdown();
    }
  };
  document.addEventListener('click', handleClickOutside);

  // Hidden input for form submission
  const hiddenInput = createTag('input', {
    type: 'hidden',
    name: name || id,
    value: currentValue,
  });

  const componentWrapper = labelPosition === 'side'
    ? createTag('div', { class: 'picker-wrapper' })
    : container;

  componentWrapper.appendChild(buttonWrapper);
  componentWrapper.appendChild(optionsWrapper);
  componentWrapper.appendChild(hiddenInput);

  if (labelPosition === 'side') {
    container.appendChild(componentWrapper);
  }

  if (helpText) {
    const helpTextId = `${id}-help`;
    const helpTextEl = createTag('div', {
      class: 'picker-help-text',
      id: helpTextId,
    });
    helpTextEl.textContent = helpText;
    componentWrapper.appendChild(helpTextEl);

    if (!ariaDescribedBy) {
      buttonWrapper.setAttribute('aria-describedby', helpTextId);
    }
  }

  // Public API methods
  container.setPicker = (value) => {
    const option = options.find((opt) => String(opt.value) === String(value));
    if (option) {
      currentValue = value;
      currentValueSpan.textContent = option.text;
      hiddenInput.value = value;

      // Update active state and checkmarks
      optionsWrapper.querySelectorAll('.picker-option-button').forEach((opt) => {
        opt.classList.remove('active');
        opt.setAttribute('aria-selected', 'false');
        // Remove existing checkmark
        const existingCheckmark = opt.querySelector('.picker-option-checkmark');
        if (existingCheckmark) {
          existingCheckmark.remove();
        }

        if (String(opt.getAttribute('data-value')) === String(value)) {
          opt.classList.add('active');
          opt.setAttribute('aria-selected', 'true');
          // Add checkmark to active option
          const checkmark = createTag('img', {
            class: 'picker-option-checkmark',
            src: '/express/code/icons/checkmark.svg',
            alt: '',
            'aria-hidden': 'true',
          });
          opt.insertBefore(checkmark, opt.firstChild);
        }
      });

      if (onChange) {
        onChange(value, { target: { value } });
      }
    }
  };

  container.getPicker = () => currentValue;

  container.setOptions = (newOptions) => {
    options = newOptions;
    createOptionButtons(newOptions);
    if (!newOptions.find((opt) => String(opt.value) === String(currentValue))) {
      currentValue = newOptions[0]?.value || '';
      currentValueSpan.textContent = newOptions[0]?.text || '';
      hiddenInput.value = currentValue;
    }
  };

  container.setDisabled = (isDisabled) => {
    disabled = isDisabled;
    if (isDisabled) {
      buttonWrapper.setAttribute('tabindex', '-1');
      container.classList.add('disabled');
      closeDropdown();
    } else {
      buttonWrapper.setAttribute('tabindex', '0');
      container.classList.remove('disabled');
    }
  };

  container.setError = (errorMessage) => {
    container.classList.add('error');
    const helpTextEl = container.querySelector('.picker-help-text');
    if (helpTextEl) {
      helpTextEl.textContent = errorMessage;
    } else if (errorMessage) {
      const helpTextId = `${id}-help`;
      const newHelpText = createTag('div', {
        class: 'picker-help-text',
        id: helpTextId,
      });
      newHelpText.textContent = errorMessage;
      componentWrapper.appendChild(newHelpText);
      buttonWrapper.setAttribute('aria-describedby', helpTextId);
    }
  };

  container.clearError = () => {
    container.classList.remove('error');
    const helpTextEl = container.querySelector('.picker-help-text');
    if (helpTextEl && helpText) {
      helpTextEl.textContent = helpText;
    }
  };

  container.setLoading = (isLoading) => {
    if (isLoading) {
      container.classList.add('loading');
      container.setDisabled(true);
    } else {
      container.classList.remove('loading');
      if (!disabled) {
        container.setDisabled(false);
      }
    }
  };

  // Cleanup on destroy
  container.destroy = () => {
    document.removeEventListener('click', handleClickOutside);
  };

  if (disabled) {
    container.setDisabled(true);
  }

  return container;
}

/**
 * Default export for block initialization (if used as a standalone block)
 */
export default function decorate(block) {
  const config = {};

  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();

      if (key === 'id') config.id = value;
      if (key === 'name') config.name = value;
      if (key === 'label') config.label = value;
      if (key === 'required') config.required = value === 'true';
      if (key === 'help text') config.helpText = value;
      if (key === 'size') config.size = value;
      if (key === 'variant') config.variant = value;
      if (key === 'disabled') config.disabled = value === 'true';
      if (key === 'default') config.defaultValue = value;
      if (key === 'options') {
        config.options = value.split(',').map((opt) => {
          const [optValue, optText] = opt.trim().split('|');
          return {
            value: optValue.trim(),
            text: optText ? optText.trim() : optValue.trim(),
          };
        });
      }
    }
  });

  if (!config.id) config.id = `picker-${Math.random().toString(36).slice(2, 9)}`;
  if (!config.options) config.options = [];

  const picker = createPicker(config);
  block.innerHTML = '';
  block.appendChild(picker);
}
