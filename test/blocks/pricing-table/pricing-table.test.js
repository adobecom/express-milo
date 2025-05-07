import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/pricing-table/pricing-table.js'),
]);

const { default: decorate } = imports[1];


describe('Pricing Table', () => {
  let block;
  before(async () => {
    const testBody = await readFile({ path: './mocks/body.html' });
    window.isTestEnv = true;
    document.body.innerHTML = testBody;
    window.placeholders = { 'search-branch-links': 'https://adobesparkpost.app.link/c4bWARQhWAb' };
    await decorate(document.querySelector('.pricing-table'));
    block = document.querySelector('.pricing-table-wrapper');
  });
  afterEach(() => {
    window.placeholders = undefined;
    document.body.innerHTML = '';
  });

  it('should render the correct number of rows', async () => {
    const rows = block.querySelectorAll('.pricing-table > .row');
    expect(rows.length).to.equal(11);
  });

  it('should have a header row with "Compare tiers" and tier names', async () => {
    const headerRow = block.querySelector('.row-heading');
    expect(headerRow).to.exist;
    expect(headerRow.querySelector('.col-1').textContent).to.equal('Compare tiers');
    const tierColumns = headerRow.querySelectorAll('.col-heading:nth-child(n+2)');
    const tierNames = Array.from(tierColumns).map((col) => col.textContent.trim());
    expect(tierNames).to.deep.equal(['Champion', 'Icon', 'Legend']);
  });

  it('should have section header rows', async () => {
    const sectionHeaders = block.querySelectorAll('.section-header-row .section-head-title');
    const expectedHeaders = ['Test Header'];
    const actualHeaders = Array.from(sectionHeaders).map((header) => header.textContent);
    expect(actualHeaders).to.deep.equal(expectedHeaders);
  });

  it('should have feature rows with descriptions', async () => {
    const featureRows = block.querySelectorAll('.section-row:not(.shaded):not(.section-header-row)');
    expect(featureRows.length).to.equal(3);
  });

  it('should have additional rows with descriptions', async () => {
    const additionalRows = block.querySelectorAll('.additional-row');
    expect(additionalRows.length).to.equal(4);
  });

  it('should have include indicators for features', async () => {
    const includedFeatures = block.querySelectorAll('.included-feature');
    expect(includedFeatures.length).to.be.greaterThan(0);
    includedFeatures.forEach((feature) => {
      expect(feature.querySelector('.feat-icon.check') || feature.querySelector('p:not(.icon-container)')).to.exist;
    });
  });

  it('should have a "View all features" toggle button', async () => {
    const toggleButton = block.querySelector('.toggle-row');
    expect(toggleButton).to.exist;
    expect(toggleButton.textContent.trim()).to.equal('view all features');
    toggleButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toggleButton.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    }));
    expect(block.querySelectorAll('.additional-row.collapsed').length).to.equal(4);
    toggleButton.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true,
      view: window,
    }));
    expect(block.querySelectorAll('.additional-row.collapsed').length).to.equal(0);
  });
});

describe('Pricing Table Single Section', () => {
    let block;
    before(async () => {
        const testBody = await readFile({ path: './mocks/single-section.html' });
      window.isTestEnv = true;
      document.body.innerHTML = testBody;
      window.placeholders = { 'search-branch-links': 'https://adobesparkpost.app.link/c4bWARQhWAb' };
      await decorate(document.querySelector('.pricing-table'));
      block = document.querySelector('.pricing-table-wrapper');
    });
    afterEach(() => {
      window.placeholders = undefined;
        document.body.innerHTML = '';
    });
  
    it('should render the correct number of rows', async () => {
      const rows = block.querySelectorAll('.pricing-table > .row');
      expect(rows.length).to.equal(10);
    });
  
    it('should have a header row with "Compare tiers" and tier names', async () => {
      const headerRow = block.querySelector('.row-heading');
      expect(headerRow).to.exist;
      expect(headerRow.querySelector('.col-1').textContent).to.equal('Compare tiers');
      const tierColumns = headerRow.querySelectorAll('.col-heading:nth-child(n+2)');
      const tierNames = Array.from(tierColumns).map((col) => col.textContent.trim());
      expect(tierNames).to.deep.equal(['Champion', 'Icon', 'Legend']);
    });
  
    it('should have section header rows', async () => {
      const sectionHeaders = block.querySelectorAll('.section-header-row .section-head-title');
      const expectedHeaders = ['Test Header'];
      const actualHeaders = Array.from(sectionHeaders).map((header) => header.textContent);
      expect(actualHeaders).to.deep.equal(expectedHeaders);
    });
  
    it('should have feature rows with descriptions', async () => {
      const featureRows = block.querySelectorAll('.section-row:not(.shaded):not(.section-header-row)');
      expect(featureRows.length).to.equal(3);
    });
  
    it('should have additional rows with descriptions', async () => {
      const additionalRows = block.querySelectorAll('.additional-row');
      expect(additionalRows.length).to.equal(4);
    });
  
    it('should have include indicators for features', async () => {
      const includedFeatures = block.querySelectorAll('.included-feature');
      expect(includedFeatures.length).to.be.greaterThan(0);
      includedFeatures.forEach((feature) => {
        expect(feature.querySelector('.feat-icon.check') || feature.querySelector('p:not(.icon-container)')).to.exist;
      });
    });
  
    it('should have a "View all features" toggle button', async () => {
      const toggleButton = block.querySelector('.toggle-row');
      expect(toggleButton).to.exist;
      expect(toggleButton.textContent.trim()).to.equal('view all features');
      toggleButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toggleButton.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      }));
      expect(block.querySelectorAll('.additional-row.collapsed').length).to.equal(0);
     
    });
  });
