/* eslint-env mocha */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

// Import utils first to set up getLibs
const { setLibs, getLibs } = await import('../../../express/code/scripts/utils.js');

// Set libs path
setLibs('/libs');

// Configure milo before importing drawer (drawer uses getLibs internally)
await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  mod.setConfig({ locales: { '': { ietf: 'en-US', tk: 'jdq5hay.css' } } });
});

// Now import drawer after configuration
const { default: createDrawer, updatePaperSelectionUI } = await import('../../../express/code/blocks/print-product-detail/createComponents/createDrawer.js');

// Mock UI Strings
const mockUIStrings = {
  zi_common_Select: 'Select',
  zi_common_Recommended: 'Recommended',
  zi_common_LearnMore: 'Learn more',
};

// Mock fetch for UI strings
globalThis.fetch = sinon.stub().resolves({
  ok: true,
  json: () => Promise.resolve(mockUIStrings),
});

describe('createDrawer', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    sinon.restore();
  });

  describe('Comparison Drawer', () => {
    it('should create comparison drawer with two columns', async () => {
      const data = {
        left: {
          title: 'Classic Printing',
          colorCount: '4 Color',
          imageUrl: 'https://example.com/classic.jpg',
          description: 'No underbase layer',
        },
        right: {
          title: 'Vivid Printing',
          colorCount: '5 Color',
          imageUrl: 'https://example.com/vivid.jpg',
          description: 'With white underbase',
        },
      };

      const drawer = await createDrawer({
        drawerLabel: 'Select printing process',
        template: 'comparison',
        data,
      });

      expect(drawer).to.exist;
      expect(drawer.drawer).to.exist;
      expect(drawer.curtain).to.exist;
      expect(drawer.openDrawer).to.exist;

      container.appendChild(drawer.curtain);
      container.appendChild(drawer.drawer);

      // Check drawer structure
      const drawerBody = drawer.drawer.querySelector('.drawer-body--comparison');
      expect(drawerBody).to.exist;

      const columns = drawerBody.querySelectorAll('.comparison-column');
      expect(columns).to.have.lengthOf(2);

      // Check left column
      const leftColumn = columns[0];
      expect(leftColumn.querySelector('.comparison-heading').textContent).to.equal('Classic Printing');
      expect(leftColumn.querySelector('.comparison-image').src).to.include('classic.jpg');

      // Check right column
      const rightColumn = columns[1];
      expect(rightColumn.querySelector('.comparison-heading').textContent).to.equal('Vivid Printing');
      expect(rightColumn.querySelector('.comparison-image').src).to.include('vivid.jpg');
    });

    it('should have proper ARIA labels', async () => {
      const data = {
        left: { title: 'Left', colorCount: '4', imageUrl: '#', description: 'test' },
        right: { title: 'Right', colorCount: '5', imageUrl: '#', description: 'test' },
      };

      const drawer = await createDrawer({
        drawerLabel: 'Select printing',
        template: 'comparison',
        data,
      });

      container.appendChild(drawer.drawer);

      const closeButton = drawer.drawer.querySelector('button[aria-label="close"]');
      expect(closeButton).to.exist;
    });
  });

  describe('Paper Selection Drawer', () => {
    it('should create paper selection drawer with carousel', async () => {
      const data = {
        selectedPaper: {
          name: 'signature-matte',
          title: 'Signature Matte',
          typeName: 'Matte',
          heroImage: 'https://example.com/hero.jpg',
          thumbnail: 'https://example.com/thumb.jpg',
          priceAdjustment: '+US$0.00',
          description: 'Best paper',
          specs: ['17.5pt thickness', '120lb weight'],
          recommended: true,
        },
        papers: [
          {
            name: 'signature-matte',
            title: 'Signature Matte',
            thumbnail: 'https://example.com/thumb1.jpg',
            heroImage: 'https://example.com/hero1.jpg',
            priceAdjustment: '+US$0.00',
            description: 'Desc 1',
            specs: ['Spec 1'],
            recommended: true,
          },
          {
            name: 'glossy',
            title: 'Glossy',
            thumbnail: 'https://example.com/thumb2.jpg',
            heroImage: 'https://example.com/hero2.jpg',
            priceAdjustment: '+US$5.00',
            description: 'Desc 2',
            specs: ['Spec 2'],
            recommended: false,
          },
        ],
      };

      const drawer = await createDrawer({
        drawerLabel: 'Select paper type',
        template: 'paper-selection',
        data,
      });

      container.appendChild(drawer.drawer);

      // Check carousel
      const carousel = drawer.drawer.querySelector('.paper-selection-carousel');
      expect(carousel).to.exist;

      const thumbs = carousel.querySelectorAll('.paper-selection-thumb');
      expect(thumbs).to.have.lengthOf(2);

      // Check hero image
      const heroImage = drawer.drawer.querySelector('.paper-selection-hero');
      expect(heroImage).to.exist;
      expect(heroImage.src).to.include('hero.jpg');

      // Check recommended badge
      const recommendedBadge = drawer.drawer.querySelector('.paper-selection-recommended');
      expect(recommendedBadge).to.exist;

      // Check footer
      const footer = drawer.drawer.querySelector('.drawer-foot');
      expect(footer).to.exist;

      const selectButton = footer.querySelector('.select');
      expect(selectButton).to.exist;
    });

    it('should have scroll arrows for carousel', async () => {
      const data = {
        selectedPaper: {
          name: 'test',
          title: 'Test',
          typeName: 'Test',
          heroImage: '#',
          thumbnail: '#',
          priceAdjustment: '$0',
          description: 'test',
          specs: [],
          recommended: false,
        },
        papers: [
          { name: 'test1', title: 'Test 1', thumbnail: '#', priceAdjustment: '$0' },
          { name: 'test2', title: 'Test 2', thumbnail: '#', priceAdjustment: '$0' },
        ],
      };

      const drawer = await createDrawer({
        template: 'paper-selection',
        data,
      });

      container.appendChild(drawer.drawer);

      const leftArrow = drawer.drawer.querySelector('.paper-carousel-arrow-left');
      const rightArrow = drawer.drawer.querySelector('.paper-carousel-arrow-right');

      expect(leftArrow).to.exist;
      expect(rightArrow).to.exist;
    });
  });

  describe('Size Chart Drawer', () => {
    it('should create size chart drawer with tables', async () => {
      const data = {
        productName: 'Bella+Canvas T-Shirt',
        fit: 'Standard',
        sizes: {
          IN: [
            { name: 'Adult S', body: { chest: '34-37', waist: '30-32' }, garment: { width: '18', length: '28' } },
            { name: 'Adult M', body: { chest: '38-41', waist: '32-34' }, garment: { width: '20', length: '29' } },
          ],
          CM: [
            { name: 'Adult S', body: { chest: '86-94', waist: '76-81' }, garment: { width: '45', length: '71' } },
            { name: 'Adult M', body: { chest: '96-104', waist: '81-86' }, garment: { width: '50', length: '73' } },
          ],
        },
      };

      const drawer = await createDrawer({
        drawerLabel: 'Size Chart',
        template: 'size-chart',
        data,
      });

      container.appendChild(drawer.drawer);

      // Check product name
      const productName = drawer.drawer.querySelector('.size-chart-product-name');
      expect(productName.textContent).to.equal('Bella+Canvas T-Shirt');

      // Check tables exist
      const tables = drawer.drawer.querySelectorAll('.size-chart-table');
      expect(tables).to.have.lengthOf(2); // Body and Garment tables

      // Check unit toggle buttons
      const unitButtons = drawer.drawer.querySelectorAll('.size-chart-unit-button');
      expect(unitButtons).to.have.lengthOf(2);

      // Check fit section
      const fitSection = drawer.drawer.textContent;
      expect(fitSection).to.include('Standard');
    });

    it('should toggle between IN and CM units', async () => {
      const data = {
        productName: 'Test',
        fit: 'Standard',
        sizes: {
          IN: [{ name: 'S', body: { chest: '34', waist: '30' }, garment: { width: '18', length: '28' } }],
          CM: [{ name: 'S', body: { chest: '86', waist: '76' }, garment: { width: '45', length: '71' } }],
        },
      };

      const drawer = await createDrawer({
        template: 'size-chart',
        data,
      });

      container.appendChild(drawer.drawer);

      const unitButtons = drawer.drawer.querySelectorAll('.size-chart-unit-button');
      const inButton = unitButtons[0];
      const cmButton = unitButtons[1];

      // IN should be active by default
      expect(inButton.classList.contains('active')).to.be.true;
      expect(cmButton.classList.contains('active')).to.be.false;

      // Click CM button
      cmButton.click();

      // Wait for re-render
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });

      const newButtons = drawer.drawer.querySelectorAll('.size-chart-unit-button');
      expect(newButtons[1].classList.contains('active')).to.be.true;
    });
  });

  describe('Focus Management', () => {
    it('should provide openDrawer method', async () => {
      const drawer = await createDrawer({
        drawerLabel: 'Test',
        template: 'comparison',
        data: {
          left: { title: 'L', colorCount: '4', imageUrl: '#', description: 'test' },
          right: { title: 'R', colorCount: '5', imageUrl: '#', description: 'test' },
        },
      });

      expect(drawer.openDrawer).to.be.a('function');
    });

    it('should focus close button when drawer opens', async () => {
      const drawer = await createDrawer({
        template: 'comparison',
        data: {
          left: { title: 'L', colorCount: '4', imageUrl: '#', description: 'test' },
          right: { title: 'R', colorCount: '5', imageUrl: '#', description: 'test' },
        },
      });

      container.appendChild(drawer.curtain);
      container.appendChild(drawer.drawer);

      const triggerButton = document.createElement('button');
      container.appendChild(triggerButton);
      triggerButton.focus();

      drawer.openDrawer(triggerButton);

      await new Promise((resolve) => {
        requestAnimationFrame(() => resolve());
      });

      const closeButton = drawer.drawer.querySelector('button[aria-label="close"]');
      expect(document.activeElement).to.equal(closeButton);
    });

    it('should return focus to trigger element when closed', async () => {
      const drawer = await createDrawer({
        template: 'comparison',
        data: {
          left: { title: 'L', colorCount: '4', imageUrl: '#', description: 'test' },
          right: { title: 'R', colorCount: '5', imageUrl: '#', description: 'test' },
        },
      });

      container.appendChild(drawer.curtain);
      container.appendChild(drawer.drawer);

      const triggerButton = document.createElement('button');
      container.appendChild(triggerButton);
      triggerButton.focus();

      drawer.openDrawer(triggerButton);

      const closeButton = drawer.drawer.querySelector('button[aria-label="close"]');
      closeButton.click();

      expect(document.activeElement).to.equal(triggerButton);
    });
  });

  describe('Drawer Interactions', () => {
    it('should close drawer when curtain is clicked', async () => {
      const drawer = await createDrawer({
        template: 'comparison',
        data: {
          left: { title: 'L', colorCount: '4', imageUrl: '#', description: 'test' },
          right: { title: 'R', colorCount: '5', imageUrl: '#', description: 'test' },
        },
      });

      container.appendChild(drawer.curtain);
      container.appendChild(drawer.drawer);

      drawer.openDrawer();

      expect(drawer.drawer.classList.contains('hidden')).to.be.false;

      drawer.curtain.click();

      expect(drawer.drawer.classList.contains('hidden')).to.be.true;
      expect(drawer.curtain.classList.contains('hidden')).to.be.true;
    });

    it('should close drawer when close button is clicked', async () => {
      const drawer = await createDrawer({
        template: 'comparison',
        data: {
          left: { title: 'L', colorCount: '4', imageUrl: '#', description: 'test' },
          right: { title: 'R', colorCount: '5', imageUrl: '#', description: 'test' },
        },
      });

      container.appendChild(drawer.curtain);
      container.appendChild(drawer.drawer);

      drawer.openDrawer();

      const closeButton = drawer.drawer.querySelector('button[aria-label="close"]');
      closeButton.click();

      expect(drawer.drawer.classList.contains('hidden')).to.be.true;
      expect(drawer.curtain.classList.contains('hidden')).to.be.true;
    });
  });

  describe('updatePaperSelectionUI', () => {
    it('should update UI when thumbnail is clicked', async () => {
      const data = {
        selectedPaper: {
          name: 'paper1',
          title: 'Paper 1',
          typeName: 'Type 1',
          heroImage: 'hero1.jpg',
          thumbnail: 'thumb1.jpg',
          priceAdjustment: '$0',
          description: 'Desc 1',
          specs: ['Spec 1'],
          recommended: true,
        },
        papers: [
          {
            name: 'paper1',
            title: 'Paper 1',
            thumbnail: 'thumb1.jpg',
            heroImage: 'hero1.jpg',
            priceAdjustment: '$0',
          },
          {
            name: 'paper2',
            title: 'Paper 2',
            thumbnail: 'thumb2.jpg',
            heroImage: 'hero2.jpg',
            priceAdjustment: '$5',
          },
        ],
      };

      const drawer = await createDrawer({
        template: 'paper-selection',
        data,
      });

      container.appendChild(drawer.drawer);

      const thumbs = drawer.drawer.querySelectorAll('.paper-selection-thumb');
      const secondThumb = thumbs[1];

      secondThumb.click();

      const heroImage = drawer.drawer.querySelector('.paper-selection-hero');
      expect(heroImage.src).to.include('hero2.jpg');
    });
  });
});

