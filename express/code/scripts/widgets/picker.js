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

  const inputWrapper = createTag('div', { class: 'picker-input-wrapper' });

  const selectAttrs = {
    class: 'picker-select',
    name: name || id,
    id,
  };

  if (disabled) selectAttrs.disabled = '';
  if (ariaLabel) selectAttrs['aria-label'] = ariaLabel;
  if (ariaDescribedBy) selectAttrs['aria-describedby'] = ariaDescribedBy;
  if (required) selectAttrs.required = '';

  const select = createTag('select', selectAttrs);

  options.forEach(({ value, text, disabled: optionDisabled }) => {
    const optionAttrs = {
      class: 'picker-option',
      value,
    };

    if (value === defaultValue) optionAttrs.selected = '';
    if (optionDisabled) optionAttrs.disabled = '';

    const option = createTag('option', optionAttrs);
    option.textContent = text;
    select.appendChild(option);
  });

  if (onChange) {
    select.addEventListener('change', (e) => onChange(e.target.value, e));
  }

  // Create chevron icon as an img element
  const chevron = createTag('img', {
    class: 'picker-chevron',
    src: '/express/code/icons/drop-down-arrow.svg',
    alt: '',
    'aria-hidden': 'true',
  });

  inputWrapper.appendChild(select);
  inputWrapper.appendChild(chevron);

  const componentWrapper = labelPosition === 'side'
    ? createTag('div', { class: 'picker-wrapper' })
    : container;

  componentWrapper.appendChild(inputWrapper);

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
      select.setAttribute('aria-describedby', helpTextId);
    }
  }

  container.setPicker = (value) => {
    select.value = value;
    select.dispatchEvent(new Event('change'));
  };

  container.getPicker = () => select.value;

  container.setOptions = (newOptions) => {
    select.innerHTML = '';
    newOptions.forEach(({ value, text, disabled: optionDisabled }) => {
      const optionAttrs = {
        class: 'picker-option',
        value,
      };
      if (optionDisabled) optionAttrs.disabled = '';
      const option = createTag('option', optionAttrs);
      option.textContent = text;
      select.appendChild(option);
    });
  };

  container.setDisabled = (isDisabled) => {
    if (isDisabled) {
      select.setAttribute('disabled', '');
    } else {
      select.removeAttribute('disabled');
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
      container.appendChild(newHelpText);
      select.setAttribute('aria-describedby', helpTextId);
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
      select.setAttribute('disabled', '');
    } else {
      container.classList.remove('loading');
      if (!disabled) {
        select.removeAttribute('disabled');
      }
    }
  };

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
