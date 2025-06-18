import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  LOCALES,
  createLocaleDropdown,
  createLocaleDropdownWrapper,
} from '../../express/code/scripts/widgets/frictionless-locale-dropdown.js';

describe('Locale Dropdown Widget', () => {
  let container;

  beforeEach(() => {
    // Create a container for DOM elements
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up DOM elements
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    container = null;
  });

  describe('LOCALES constant', () => {
    it('should contain expected locale structure', () => {
      expect(LOCALES).to.be.an('array');
      expect(LOCALES.length).to.be.greaterThan(0);

      LOCALES.forEach((locale) => {
        expect(locale).to.have.property('code');
        expect(locale).to.have.property('label');
        expect(locale.code).to.be.a('string');
        expect(locale.label).to.be.a('string');
      });
    });

    it('should include expected locales', () => {
      const localeCodes = LOCALES.map((locale) => locale.code);
      expect(localeCodes).to.include('en-us');
      expect(localeCodes).to.include('en-gb');
      expect(localeCodes).to.include('fr-fr');
      expect(localeCodes).to.include('de-de');
      expect(localeCodes).to.include('ja-jp');
    });

    it('should have unique locale codes', () => {
      const codes = LOCALES.map((locale) => locale.code);
      const uniqueCodes = [...new Set(codes)];
      expect(codes.length).to.equal(uniqueCodes.length);
    });
  });

  describe('createLocaleDropdown', () => {
    it('should create dropdown with default options', () => {
      const dropdown = createLocaleDropdown();
      container.appendChild(dropdown);

      expect(dropdown).to.be.instanceOf(HTMLElement);
      expect(dropdown.classList.contains('custom-dropdown')).to.be.true;
      expect(dropdown.dataset.value).to.equal('en-us');

      const button = dropdown.querySelector('.dropdown-btn');
      const text = dropdown.querySelector('.dropdown-text');
      const chevron = dropdown.querySelector('.dropdown-chevron');
      const content = dropdown.querySelector('.dropdown-content');

      expect(button).to.exist;
      expect(text).to.exist;
      expect(chevron).to.exist;
      expect(content).to.exist;
      expect(text.textContent).to.equal('English (US)');
    });

    it('should create dropdown with custom options', () => {
      const options = {
        defaultValue: 'fr-fr',
        className: 'custom-class',
      };
      const dropdown = createLocaleDropdown(options);
      container.appendChild(dropdown);

      expect(dropdown.classList.contains('custom-class')).to.be.true;
      expect(dropdown.dataset.value).to.equal('fr-fr');

      const text = dropdown.querySelector('.dropdown-text');
      expect(text.textContent).to.equal('French');
    });

    it('should call onChange callback when option is selected', () => {
      const onChangeStub = sinon.stub();
      const dropdown = createLocaleDropdown({ onChange: onChangeStub });
      container.appendChild(dropdown);

      const option = dropdown.querySelector('[data-value="fr-fr"]');
      option.click();

      expect(onChangeStub.calledOnce).to.be.true;
      expect(onChangeStub.calledWith('fr-fr', 'French')).to.be.true;
    });

    it('should update display when option is selected', () => {
      const dropdown = createLocaleDropdown();
      container.appendChild(dropdown);

      const text = dropdown.querySelector('.dropdown-text');
      const option = dropdown.querySelector('[data-value="de-de"]');

      option.click();

      expect(text.textContent).to.equal('German');
      expect(dropdown.dataset.value).to.equal('de-de');
    });

    it('should toggle dropdown content on button click', () => {
      const dropdown = createLocaleDropdown();
      container.appendChild(dropdown);

      const button = dropdown.querySelector('.dropdown-btn');
      const content = dropdown.querySelector('.dropdown-content');
      const chevron = dropdown.querySelector('.dropdown-chevron');

      // Initially closed
      expect(content.classList.contains('show')).to.be.false;

      // Click to open
      button.click();
      expect(content.classList.contains('show')).to.be.true;
      expect(chevron.style.transform).to.equal('rotate(180deg)');

      // Click to close
      button.click();
      expect(content.classList.contains('show')).to.be.false;
      expect(chevron.style.transform).to.equal('rotate(0deg)');
    });

    it('should close dropdown when clicking outside', () => {
      const dropdown = createLocaleDropdown();
      container.appendChild(dropdown);

      const button = dropdown.querySelector('.dropdown-btn');
      const content = dropdown.querySelector('.dropdown-content');

      // Open dropdown
      button.click();
      expect(content.classList.contains('show')).to.be.true;

      // Click outside
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);
      outsideElement.click();

      expect(content.classList.contains('show')).to.be.false;

      // Cleanup
      document.body.removeChild(outsideElement);
    });

    it('should close dropdown when option is clicked', () => {
      const dropdown = createLocaleDropdown();
      container.appendChild(dropdown);

      const button = dropdown.querySelector('.dropdown-btn');
      const content = dropdown.querySelector('.dropdown-content');
      const option = dropdown.querySelector('[data-value="ja-jp"]');

      // Open dropdown
      button.click();
      expect(content.classList.contains('show')).to.be.true;

      // Click option
      option.click();
      expect(content.classList.contains('show')).to.be.false;
    });

    it('should support keyboard navigation with Enter key', () => {
      const onChangeStub = sinon.stub();
      const dropdown = createLocaleDropdown({ onChange: onChangeStub });
      container.appendChild(dropdown);

      const option = dropdown.querySelector('[data-value="es-es"]');

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      option.dispatchEvent(enterEvent);

      expect(onChangeStub.calledOnce).to.be.true;
      expect(onChangeStub.calledWith('es-es', 'Spanish')).to.be.true;
    });

    it('should support keyboard navigation with Space key', () => {
      const onChangeStub = sinon.stub();
      const dropdown = createLocaleDropdown({ onChange: onChangeStub });
      container.appendChild(dropdown);

      const option = dropdown.querySelector('[data-value="it-it"]');

      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      option.dispatchEvent(spaceEvent);

      expect(onChangeStub.calledOnce).to.be.true;
      expect(onChangeStub.calledWith('it-it', 'Italian')).to.be.true;
    });

    it('should have proper accessibility attributes', () => {
      const dropdown = createLocaleDropdown();
      container.appendChild(dropdown);

      const dropdownContent = dropdown.querySelector('.dropdown-content');
      expect(dropdownContent.getAttribute('role')).to.equal('listbox');

      const options = dropdown.querySelectorAll('.dropdown-option');
      options.forEach((option) => {
        expect(option.getAttribute('role')).to.equal('option');
        expect(option.getAttribute('tabindex')).to.equal('0');
        expect(option.getAttribute('data-value')).to.exist;
      });
    });

    it('should handle invalid default value gracefully', () => {
      const dropdown = createLocaleDropdown({ defaultValue: 'invalid-locale' });
      container.appendChild(dropdown);

      const text = dropdown.querySelector('.dropdown-text');
      expect(text.textContent).to.equal('English (US)'); // Should fallback to default
    });

    it('should create all locale options', () => {
      const dropdown = createLocaleDropdown();
      container.appendChild(dropdown);

      const options = dropdown.querySelectorAll('.dropdown-option');
      expect(options.length).to.equal(LOCALES.length);

      LOCALES.forEach((locale, index) => {
        expect(options[index].getAttribute('data-value')).to.equal(locale.code);
        expect(options[index].textContent).to.equal(locale.label);
      });
    });
  });

  describe('createLocaleDropdownWrapper', () => {
    it('should create wrapper with default options', () => {
      const { wrapper, dropdown } = createLocaleDropdownWrapper();
      container.appendChild(wrapper);

      expect(wrapper).to.be.instanceOf(HTMLElement);
      expect(wrapper.classList.contains('locale-dropdown-wrapper')).to.be.true;
      expect(dropdown).to.be.instanceOf(HTMLElement);

      const label = wrapper.querySelector('.locale-dropdown-label');
      expect(label).to.exist;
      expect(label.textContent).to.equal('Language spoken in video');
      expect(label.getAttribute('for')).to.equal('locale-select');
    });

    it('should create wrapper with custom options', () => {
      const options = {
        label: 'Custom Label',
        labelId: 'custom-id',
        defaultValue: 'ja-jp',
        className: 'custom-dropdown-class',
      };
      const { wrapper, dropdown } = createLocaleDropdownWrapper(options);
      container.appendChild(wrapper);

      const label = wrapper.querySelector('.locale-dropdown-label');
      expect(label.textContent).to.equal('Custom Label');
      expect(label.getAttribute('for')).to.equal('custom-id');
      expect(dropdown.classList.contains('custom-dropdown-class')).to.be.true;
      expect(dropdown.dataset.value).to.equal('ja-jp');
    });

    it('should pass through dropdown options correctly', () => {
      const onChangeStub = sinon.stub();
      const { wrapper, dropdown } = createLocaleDropdownWrapper({
        onChange: onChangeStub,
        defaultValue: 'ko-kr',
      });
      container.appendChild(wrapper);

      const option = dropdown.querySelector('[data-value="cmn-hans"]');
      option.click();

      expect(onChangeStub.calledOnce).to.be.true;
      expect(onChangeStub.calledWith('cmn-hans', 'Chinese (Simplified)')).to.be
        .true;
    });

    it('should contain both label and dropdown elements', () => {
      const { wrapper } = createLocaleDropdownWrapper();
      container.appendChild(wrapper);

      const label = wrapper.querySelector('.locale-dropdown-label');
      const dropdownElement = wrapper.querySelector('.custom-dropdown');

      expect(label).to.exist;
      expect(dropdownElement).to.exist;
      expect(wrapper.children.length).to.equal(2);
    });
  });
});
