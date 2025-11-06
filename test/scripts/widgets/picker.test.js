import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setLibs } from '../../../express/code/scripts/utils.js';
import { createPicker } from '../../../express/code/scripts/widgets/picker.js';

setLibs('/libs');

describe('Picker Widget', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('Initialization and Rendering', () => {
    it('should create a picker with basic options', () => {
      const picker = createPicker({
        id: 'test-picker',
        name: 'test',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
        ],
      });

      expect(picker).to.exist;
      expect(picker.classList.contains('picker-container')).to.be.true;
    });

    it('should render label when provided', () => {
      const picker = createPicker({
        id: 'test-picker',
        label: 'Test Label',
        options: [{ value: '1', text: 'Option 1' }],
      });

      const label = picker.querySelector('.picker-label');
      expect(label).to.exist;
      expect(label.textContent).to.equal('Test Label');
    });

    it('should render label with required indicator when required is true', () => {
      const picker = createPicker({
        id: 'test-picker',
        label: 'Test Label',
        required: true,
        options: [{ value: '1', text: 'Option 1' }],
      });

      const label = picker.querySelector('.picker-label');
      expect(label.classList.contains('required')).to.be.true;
    });

    it('should set default value correctly', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
        ],
        defaultValue: '2',
      });

      expect(picker.getPicker()).to.equal('2');
      const currentValue = picker.querySelector('.picker-current-value');
      expect(currentValue.textContent).to.equal('Option 2');
    });

    it('should default to first option when no defaultValue provided', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
        ],
      });

      expect(picker.getPicker()).to.equal('1');
      const currentValue = picker.querySelector('.picker-current-value');
      expect(currentValue.textContent).to.equal('Option 1');
    });

    it('should render help text when provided', () => {
      const picker = createPicker({
        id: 'test-picker',
        helpText: 'This is help text',
        options: [{ value: '1', text: 'Option 1' }],
      });

      const helpText = picker.querySelector('.picker-help-text');
      expect(helpText).to.exist;
      expect(helpText.textContent).to.equal('This is help text');
    });

    it('should apply size variant class', () => {
      const picker = createPicker({
        id: 'test-picker',
        size: 's',
        options: [{ value: '1', text: 'Option 1' }],
      });

      expect(picker.classList.contains('size-s')).to.be.true;
    });

    it('should apply variant class', () => {
      const picker = createPicker({
        id: 'test-picker',
        variant: 'quiet',
        options: [{ value: '1', text: 'Option 1' }],
      });

      expect(picker.classList.contains('quiet')).to.be.true;
    });

    it('should apply side label position class', () => {
      const picker = createPicker({
        id: 'test-picker',
        labelPosition: 'side',
        label: 'Test',
        options: [{ value: '1', text: 'Option 1' }],
      });

      expect(picker.classList.contains('side')).to.be.true;
    });

    it('should create hidden input for form submission', () => {
      const picker = createPicker({
        id: 'test-picker',
        name: 'test-name',
        options: [{ value: '1', text: 'Option 1' }],
      });

      const hiddenInput = picker.querySelector('input[type="hidden"]');
      expect(hiddenInput).to.exist;
      expect(hiddenInput.name).to.equal('test-name');
      expect(hiddenInput.value).to.equal('1');
    });

    it('should render checkmark on active option', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
        ],
        defaultValue: '1',
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      const activeOption = picker.querySelector('.picker-option-button.active');
      const checkmark = activeOption.querySelector('.picker-option-checkmark');
      expect(checkmark).to.exist;
      expect(checkmark.src).to.include('checkmark.svg');
    });
  });

  describe('Dropdown Open/Close', () => {
    it('should open dropdown when button is clicked', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [{ value: '1', text: 'Option 1' }],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      expect(picker.classList.contains('opened')).to.be.true;
      expect(button.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should close dropdown when button is clicked again', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [{ value: '1', text: 'Option 1' }],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();
      button.click();

      expect(picker.classList.contains('opened')).to.be.false;
      expect(button.getAttribute('aria-expanded')).to.equal('false');
    });

    it('should close dropdown when clicking outside', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [{ value: '1', text: 'Option 1' }],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      document.body.click();

      expect(picker.classList.contains('opened')).to.be.false;
    });

    it('should not open dropdown when disabled', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [{ value: '1', text: 'Option 1' }],
        disabled: true,
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      expect(picker.classList.contains('opened')).to.be.false;
    });
  });

  describe('Option Selection', () => {
    it('should update value when option is clicked', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
        ],
        defaultValue: '1',
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      const options = picker.querySelectorAll('.picker-option-button');
      options[1].click();

      expect(picker.getPicker()).to.equal('2');
      const currentValue = picker.querySelector('.picker-current-value');
      expect(currentValue.textContent).to.equal('Option 2');
    });

    it('should call onChange callback when value changes', () => {
      const onChangeSpy = sinon.spy();
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
        ],
        onChange: onChangeSpy,
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      const options = picker.querySelectorAll('.picker-option-button');
      options[1].click();

      expect(onChangeSpy.calledOnce).to.be.true;
      expect(onChangeSpy.firstCall.args[0]).to.equal('2');
    });

    it('should not call onChange when selecting same value', () => {
      const onChangeSpy = sinon.spy();
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
        ],
        onChange: onChangeSpy,
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      const options = picker.querySelectorAll('.picker-option-button');
      options[0].click();

      expect(onChangeSpy.called).to.be.false;
    });

    it('should close dropdown after selection', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
        ],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      const options = picker.querySelectorAll('.picker-option-button');
      options[1].click();

      expect(picker.classList.contains('opened')).to.be.false;
    });

    it('should update checkmark on new active option', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
        ],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      const options = picker.querySelectorAll('.picker-option-button');
      options[1].click();

      button.click();

      const checkmarks = picker.querySelectorAll('.picker-option-checkmark');
      expect(checkmarks.length).to.equal(1);
      expect(options[1].querySelector('.picker-option-checkmark')).to.exist;
    });

    it('should not allow selection of disabled option', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2', disabled: true },
        ],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      const options = picker.querySelectorAll('.picker-option-button');
      const initialValue = picker.getPicker();

      options[1].click();

      expect(picker.getPicker()).to.equal(initialValue);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should open dropdown on Enter key', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [{ value: '1', text: 'Option 1' }],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.focus();

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      button.dispatchEvent(event);

      expect(picker.classList.contains('opened')).to.be.true;
    });

    it('should open dropdown on Space key', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [{ value: '1', text: 'Option 1' }],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.focus();

      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      button.dispatchEvent(event);

      expect(picker.classList.contains('opened')).to.be.true;
    });

    it('should close dropdown on Escape key', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [{ value: '1', text: 'Option 1' }],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      button.dispatchEvent(event);

      expect(picker.classList.contains('opened')).to.be.false;
    });

    it('should navigate options with ArrowDown', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
          { value: '3', text: 'Option 3' },
        ],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      button.dispatchEvent(event);

      const options = picker.querySelectorAll('.picker-option-button');
      expect(options[0].classList.contains('focused')).to.be.true;
    });

    it('should navigate options with ArrowUp', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
          { value: '3', text: 'Option 3' },
        ],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      let event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      button.dispatchEvent(event);
      event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      button.dispatchEvent(event);
      event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      button.dispatchEvent(event);

      const options = picker.querySelectorAll('.picker-option-button');
      expect(options[0].classList.contains('focused')).to.be.true;
    });

    it('should jump to first option with Home key', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
          { value: '3', text: 'Option 3' },
        ],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      let event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      button.dispatchEvent(event);
      event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      button.dispatchEvent(event);
      event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      button.dispatchEvent(event);

      const options = picker.querySelectorAll('.picker-option-button');
      expect(options[0].classList.contains('focused')).to.be.true;
    });

    it('should jump to last option with End key', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
          { value: '3', text: 'Option 3' },
        ],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      button.dispatchEvent(event);

      const options = picker.querySelectorAll('.picker-option-button');
      expect(options[2].classList.contains('focused')).to.be.true;
    });

    it('should select focused option on Enter', (done) => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
        ],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      let event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      button.dispatchEvent(event);
      event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      button.dispatchEvent(event);
      event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      button.dispatchEvent(event);

      setTimeout(() => {
        expect(picker.getPicker()).to.equal('2');
        done();
      }, 50);
    });

    it('should close dropdown on Tab key', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [{ value: '1', text: 'Option 1' }],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      button.dispatchEvent(event);

      expect(picker.classList.contains('opened')).to.be.false;
    });

    it('should skip disabled options when navigating', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2', disabled: true },
          { value: '3', text: 'Option 3' },
        ],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      button.dispatchEvent(event);
      button.dispatchEvent(event);

      const options = picker.querySelectorAll('.picker-option-button:not(.disabled)');
      expect(options[1].classList.contains('focused')).to.be.true;
    });
  });

  describe('Public API Methods', () => {
    describe('setPicker', () => {
      it('should update picker value programmatically', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [
            { value: '1', text: 'Option 1' },
            { value: '2', text: 'Option 2' },
          ],
        });

        container.appendChild(picker);
        picker.setPicker('2');

        expect(picker.getPicker()).to.equal('2');
        const currentValue = picker.querySelector('.picker-current-value');
        expect(currentValue.textContent).to.equal('Option 2');
      });

      it('should update checkmark when value is set', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [
            { value: '1', text: 'Option 1' },
            { value: '2', text: 'Option 2' },
          ],
        });

        container.appendChild(picker);
        picker.setPicker('2');

        const button = picker.querySelector('.picker-button-wrapper');
        button.click();

        const activeOption = picker.querySelector('.picker-option-button.active');
        expect(activeOption.getAttribute('data-value')).to.equal('2');
        expect(activeOption.querySelector('.picker-option-checkmark')).to.exist;
      });

      it('should handle string and number value types', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [
            { value: 1, text: 'Option 1' },
            { value: 2, text: 'Option 2' },
          ],
        });

        picker.setPicker('2');
        expect(String(picker.getPicker())).to.equal('2');
      });
    });

    describe('getPicker', () => {
      it('should return current picker value', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [
            { value: '1', text: 'Option 1' },
            { value: '2', text: 'Option 2' },
          ],
          defaultValue: '2',
        });

        expect(picker.getPicker()).to.equal('2');
      });
    });

    describe('setOptions', () => {
      it('should update options dynamically', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [{ value: '1', text: 'Option 1' }],
        });

        container.appendChild(picker);

        const newOptions = [
          { value: 'a', text: 'Option A' },
          { value: 'b', text: 'Option B' },
        ];
        picker.setOptions(newOptions);

        const button = picker.querySelector('.picker-button-wrapper');
        button.click();

        const optionButtons = picker.querySelectorAll('.picker-option-button');
        expect(optionButtons.length).to.equal(2);
        expect(optionButtons[0].querySelector('.picker-option-text').textContent).to.equal('Option A');
      });

      it('should preserve current value if it exists in new options', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [
            { value: '1', text: 'Option 1' },
            { value: '2', text: 'Option 2' },
          ],
          defaultValue: '2',
        });

        picker.setOptions([
          { value: '2', text: 'Option 2 Updated' },
          { value: '3', text: 'Option 3' },
        ]);

        expect(picker.getPicker()).to.equal('2');
      });

      it('should reset to first option if current value not in new options', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [
            { value: '1', text: 'Option 1' },
            { value: '2', text: 'Option 2' },
          ],
          defaultValue: '2',
        });

        picker.setOptions([
          { value: 'a', text: 'Option A' },
          { value: 'b', text: 'Option B' },
        ]);

        expect(picker.getPicker()).to.equal('a');
      });
    });

    describe('setDisabled', () => {
      it('should disable picker', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [{ value: '1', text: 'Option 1' }],
        });

        container.appendChild(picker);
        picker.setDisabled(true);

        expect(picker.classList.contains('disabled')).to.be.true;
        const button = picker.querySelector('.picker-button-wrapper');
        expect(button.getAttribute('tabindex')).to.equal('-1');
      });

      it('should enable picker', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [{ value: '1', text: 'Option 1' }],
          disabled: true,
        });

        container.appendChild(picker);
        picker.setDisabled(false);

        expect(picker.classList.contains('disabled')).to.be.false;
        const button = picker.querySelector('.picker-button-wrapper');
        expect(button.getAttribute('tabindex')).to.equal('0');
      });

      it('should prevent interaction when disabled', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [{ value: '1', text: 'Option 1' }],
        });

        container.appendChild(picker);
        picker.setDisabled(true);

        const button = picker.querySelector('.picker-button-wrapper');
        button.click();

        expect(picker.classList.contains('opened')).to.be.false;
      });
    });

    describe('setError', () => {
      it('should set error state with message', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [{ value: '1', text: 'Option 1' }],
        });

        container.appendChild(picker);
        picker.setError('This field is required');

        expect(picker.classList.contains('error')).to.be.true;
        const errorText = picker.querySelector('.picker-help-text');
        expect(errorText).to.exist;
        expect(errorText.textContent).to.equal('This field is required');
      });

      it('should update existing error message', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [{ value: '1', text: 'Option 1' }],
        });

        container.appendChild(picker);
        picker.setError('Error 1');
        picker.setError('Error 2');

        const errorTexts = picker.querySelectorAll('.picker-help-text');
        expect(errorTexts.length).to.equal(1);
        expect(errorTexts[0].textContent).to.equal('Error 2');
      });
    });

    describe('clearError', () => {
      it('should clear error state and message', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [{ value: '1', text: 'Option 1' }],
        });

        container.appendChild(picker);
        picker.setError('This field is required');
        picker.clearError();

        expect(picker.classList.contains('error')).to.be.false;
        const errorText = picker.querySelector('.picker-help-text');
        expect(errorText).to.not.exist;
      });
    });

    describe('setLoading', () => {
      it('should set loading state', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [{ value: '1', text: 'Option 1' }],
        });

        container.appendChild(picker);
        picker.setLoading(true);

        expect(picker.classList.contains('loading')).to.be.true;
        expect(picker.classList.contains('disabled')).to.be.true;
      });

      it('should clear loading state and re-enable if not originally disabled', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [{ value: '1', text: 'Option 1' }],
        });

        container.appendChild(picker);
        picker.setLoading(true);
        picker.setLoading(false);

        expect(picker.classList.contains('loading')).to.be.false;
        expect(picker.classList.contains('disabled')).to.be.false;
      });

      it('should not re-enable if was already disabled', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [{ value: '1', text: 'Option 1' }],
          disabled: true,
        });

        container.appendChild(picker);
        picker.setLoading(true);
        picker.setLoading(false);

        expect(picker.classList.contains('disabled')).to.be.true;
      });
    });

    describe('destroy', () => {
      it('should remove event listeners', () => {
        const picker = createPicker({
          id: 'test-picker',
          options: [{ value: '1', text: 'Option 1' }],
        });

        container.appendChild(picker);
        const button = picker.querySelector('.picker-button-wrapper');
        button.click();

        picker.destroy();

        document.body.click();
        expect(picker.classList.contains('opened')).to.be.true;
      });
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA attributes on button', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [{ value: '1', text: 'Option 1' }],
      });

      const button = picker.querySelector('.picker-button-wrapper');
      expect(button.getAttribute('role')).to.equal('button');
      expect(button.getAttribute('aria-haspopup')).to.equal('listbox');
      expect(button.getAttribute('aria-expanded')).to.equal('false');
      expect(button.getAttribute('tabindex')).to.equal('0');
    });

    it('should update aria-expanded when opened', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [{ value: '1', text: 'Option 1' }],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      expect(button.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should have correct ARIA attributes on options wrapper', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [{ value: '1', text: 'Option 1' }],
      });

      const optionsWrapper = picker.querySelector('.picker-options-wrapper');
      expect(optionsWrapper.getAttribute('role')).to.equal('listbox');
    });

    it('should have correct ARIA attributes on options', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' },
        ],
        defaultValue: '1',
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      const options = picker.querySelectorAll('.picker-option-button');
      expect(options[0].getAttribute('role')).to.equal('option');
      expect(options[0].getAttribute('aria-selected')).to.equal('true');
      expect(options[1].getAttribute('aria-selected')).to.equal('false');
    });

    it('should support custom aria-label', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [{ value: '1', text: 'Option 1' }],
        ariaLabel: 'Custom Label',
      });

      const button = picker.querySelector('.picker-button-wrapper');
      expect(button.getAttribute('aria-label')).to.equal('Custom Label');
    });

    it('should support custom aria-describedby', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [{ value: '1', text: 'Option 1' }],
        ariaDescribedBy: 'custom-description',
      });

      const button = picker.querySelector('.picker-button-wrapper');
      expect(button.getAttribute('aria-describedby')).to.equal('custom-description');
    });

    it('should auto-generate aria-describedby for help text', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [{ value: '1', text: 'Option 1' }],
        helpText: 'This is help text',
      });

      const button = picker.querySelector('.picker-button-wrapper');
      const describedBy = button.getAttribute('aria-describedby');
      expect(describedBy).to.include('test-picker-help');

      const helpText = picker.querySelector(`#${describedBy}`);
      expect(helpText).to.exist;
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [],
      });

      expect(picker).to.exist;
      expect(picker.getPicker()).to.equal('');
    });

    it('should handle options with same values', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: 'Option 1A' },
          { value: '1', text: 'Option 1B' },
        ],
      });

      container.appendChild(picker);
      const button = picker.querySelector('.picker-button-wrapper');
      button.click();

      const options = picker.querySelectorAll('.picker-option-button');
      expect(options.length).to.equal(2);
    });

    it('should handle numeric values', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: 1, text: 'One' },
          { value: 2, text: 'Two' },
        ],
        defaultValue: 1,
      });

      expect(picker.getPicker()).to.equal(1);
    });

    it('should handle boolean values', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: true, text: 'Yes' },
          { value: false, text: 'No' },
        ],
        defaultValue: true,
      });

      expect(picker.getPicker()).to.equal(true);
    });

    it('should handle very long option text', () => {
      const longText = 'This is a very long option text that should not break the layout or cause issues';
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: '1', text: longText },
        ],
      });

      container.appendChild(picker);
      const currentValue = picker.querySelector('.picker-current-value');
      expect(currentValue.textContent).to.equal(longText);
    });

    it('should handle special characters in values', () => {
      const picker = createPicker({
        id: 'test-picker',
        options: [
          { value: 'option-1', text: 'Option 1' },
          { value: 'option_2', text: 'Option 2' },
          { value: 'option.3', text: 'Option 3' },
        ],
        defaultValue: 'option-1',
      });

      expect(picker.getPicker()).to.equal('option-1');
    });
  });
});
