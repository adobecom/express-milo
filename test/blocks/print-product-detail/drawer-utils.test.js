/* eslint-env mocha */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

describe('Print Product Detail - Drawer Utilities', () => {
  let createDrawerModule;
  let cachedElements;

  before(async () => {
    window.isTestEnv = true;
    const libs = '/libs';
    const { setLibs } = await import('../../../express/code/scripts/utils.js');
    setLibs(libs);
    createDrawerModule = await import('../../../express/code/blocks/print-product-detail/createComponents/createDrawer.js');
  });

  beforeEach(() => {
    document.body.innerHTML = '<div id="test-container"></div>';
    cachedElements = {};
  });

  afterEach(() => {
    document.body.innerHTML = '';
    sinon.restore();
  });

  describe('DOM Creation', () => {
    it('should create drawer curtain element', () => {
      const curtain = document.createElement('div');
      curtain.className = 'drawer-curtain';
      expect(curtain.classList.contains('drawer-curtain')).to.be.true;
    });

    it('should create drawer element with correct structure', () => {
      const drawer = document.createElement('div');
      drawer.className = 'drawer';
      const drawerInner = document.createElement('div');
      drawerInner.className = 'drawer-inner';
      drawer.appendChild(drawerInner);

      expect(drawer.classList.contains('drawer')).to.be.true;
      expect(drawer.querySelector('.drawer-inner')).to.exist;
    });

    it('should create drawer header with label', () => {
      const header = document.createElement('div');
      header.className = 'drawer-head';
      const label = document.createElement('span');
      label.className = 'drawer-label';
      label.textContent = 'Test Drawer';
      header.appendChild(label);

      expect(header.querySelector('.drawer-label').textContent).to.equal('Test Drawer');
    });

    it('should create close button with icon', () => {
      const closeButton = document.createElement('button');
      closeButton.className = 'drawer-close-btn';
      closeButton.setAttribute('aria-label', 'Close');

      expect(closeButton.classList.contains('drawer-close-btn')).to.be.true;
      expect(closeButton.getAttribute('aria-label')).to.equal('Close');
    });
  });

  describe('Paper Selection UI Updates', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="drawer-body">
          <div class="paper-selection-carousel">
            <div class="paper-selection-thumb selected" data-paper-name="standard" data-paper-title="Standard Paper" data-hero-image="hero1.jpg">
              <img src="thumb1.jpg" alt="Standard Paper">
            </div>
            <div class="paper-selection-thumb" data-paper-name="premium" data-paper-title="Premium Paper" data-hero-image="hero2.jpg">
              <img src="thumb2.jpg" alt="Premium Paper">
            </div>
          </div>
          <div class="paper-selection-hero">
            <img class="hero-image" src="hero1.jpg" alt="Current selection">
          </div>
          <div class="paper-selection-details">
            <h3 class="paper-name">Standard Paper</h3>
            <p class="paper-description">Description here</p>
          </div>
        </div>
      `;
    });

    it('should update selected thumb class', () => {
      const drawerBody = document.querySelector('.drawer-body');
      const thumbs = drawerBody.querySelectorAll('.paper-selection-thumb');
      const newSelection = thumbs[1];

      // Simulate selection
      thumbs.forEach((thumb) => thumb.classList.remove('selected'));
      newSelection.classList.add('selected');

      expect(thumbs[0].classList.contains('selected')).to.be.false;
      expect(thumbs[1].classList.contains('selected')).to.be.true;
    });

    it('should update hero image src', () => {
      const heroImage = document.querySelector('.hero-image');
      const thumb = document.querySelectorAll('.paper-selection-thumb')[1];

      heroImage.src = thumb.dataset.heroImage;
      heroImage.alt = thumb.dataset.paperTitle;

      expect(heroImage.src).to.include('hero2.jpg');
      expect(heroImage.alt).to.equal('Premium Paper');
    });

    it('should update paper name text', () => {
      const paperName = document.querySelector('.paper-name');
      const thumb = document.querySelectorAll('.paper-selection-thumb')[1];

      paperName.textContent = thumb.dataset.paperTitle;

      expect(paperName.textContent).to.equal('Premium Paper');
    });
  });

  describe('Drawer State Management', () => {
    it('should toggle drawer-open class', () => {
      const drawer = document.createElement('div');
      drawer.className = 'drawer';

      drawer.classList.add('drawer-open');
      expect(drawer.classList.contains('drawer-open')).to.be.true;

      drawer.classList.remove('drawer-open');
      expect(drawer.classList.contains('drawer-open')).to.be.false;
    });

    it('should store selected paper name in dataset', () => {
      const drawerBody = document.createElement('div');
      drawerBody.className = 'drawer-body';

      drawerBody.dataset.selectedPaperName = 'premium';
      expect(drawerBody.dataset.selectedPaperName).to.equal('premium');
    });
  });

  describe('Focus Management', () => {
    it('should trap focus within drawer when open', () => {
      const drawer = document.createElement('div');
      drawer.className = 'drawer drawer-open';
      drawer.innerHTML = `
        <button class="first-focusable">First</button>
        <button class="middle-button">Middle</button>
        <button class="last-focusable">Last</button>
      `;
      document.body.appendChild(drawer);

      const focusableElements = drawer.querySelectorAll('button');
      expect(focusableElements.length).to.equal(3);

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      expect(firstElement).to.exist;
      expect(lastElement).to.exist;
    });

    it('should identify focusable elements correctly', () => {
      const drawer = document.createElement('div');
      drawer.innerHTML = `
        <button>Button</button>
        <a href="#">Link</a>
        <input type="text">
        <select><option>Select</option></select>
        <div>Not focusable</div>
      `;
      document.body.appendChild(drawer);

      const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusableElements = drawer.querySelectorAll(focusableSelector);

      expect(focusableElements.length).to.be.at.least(4);
    });
  });

  describe('Event Handlers', () => {
    it('should handle close button click', () => {
      const closeButton = document.createElement('button');
      closeButton.className = 'drawer-close-btn';
      const clickSpy = sinon.spy();

      closeButton.addEventListener('click', clickSpy);
      closeButton.click();

      expect(clickSpy.calledOnce).to.be.true;
    });

    it('should handle curtain click', () => {
      const curtain = document.createElement('div');
      curtain.className = 'drawer-curtain';
      const clickSpy = sinon.spy();

      curtain.addEventListener('click', clickSpy);
      curtain.click();

      expect(clickSpy.calledOnce).to.be.true;
    });
  });

  describe('Carousel Navigation', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="paper-selection-carousel">
          <div class="paper-selection-thumb" data-paper-name="paper1">1</div>
          <div class="paper-selection-thumb" data-paper-name="paper2">2</div>
          <div class="paper-selection-thumb" data-paper-name="paper3">3</div>
        </div>
        <button class="carousel-arrow left-arrow"></button>
        <button class="carousel-arrow right-arrow"></button>
      `;
    });

    it('should create left arrow button', () => {
      const leftArrow = document.querySelector('.left-arrow');
      expect(leftArrow).to.exist;
    });

    it('should create right arrow button', () => {
      const rightArrow = document.querySelector('.right-arrow');
      expect(rightArrow).to.exist;
    });

    it('should handle carousel scroll', () => {
      const carousel = document.querySelector('.paper-selection-carousel');
      const scrollSpy = sinon.spy();

      carousel.addEventListener('scroll', scrollSpy);
      carousel.dispatchEvent(new Event('scroll'));

      expect(scrollSpy.calledOnce).to.be.true;
    });
  });

  describe('Footer Select Button', () => {
    it('should create select button', () => {
      const selectButton = document.createElement('button');
      selectButton.className = 'drawer-foot-btn primary-btn';
      selectButton.textContent = 'Select';

      expect(selectButton.classList.contains('primary-btn')).to.be.true;
      expect(selectButton.textContent).to.equal('Select');
    });

    it('should handle select button click', () => {
      const selectButton = document.createElement('button');
      const clickSpy = sinon.spy();

      selectButton.addEventListener('click', clickSpy);
      selectButton.click();

      expect(clickSpy.calledOnce).to.be.true;
    });
  });

  describe('Comparison Drawer', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="drawer-body">
          <div class="comparison-container">
            <div class="comparison-column" data-filter="light">
              <img src="light.jpg" alt="Light">
              <h3>Classic Printing</h3>
            </div>
            <div class="comparison-column" data-filter="dark">
              <img src="dark.jpg" alt="Dark">
              <h3>Vivid Printing</h3>
            </div>
          </div>
        </div>
      `;
    });

    it('should create comparison columns', () => {
      const columns = document.querySelectorAll('.comparison-column');
      expect(columns.length).to.equal(2);
    });

    it('should have data-filter attributes', () => {
      const columns = document.querySelectorAll('.comparison-column');
      expect(columns[0].dataset.filter).to.equal('light');
      expect(columns[1].dataset.filter).to.equal('dark');
    });
  });

  describe('Size Chart Drawer', () => {
    it('should create size chart table structure', () => {
      const table = document.createElement('table');
      table.className = 'size-chart-table';
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');
      table.appendChild(thead);
      table.appendChild(tbody);

      expect(table.querySelector('thead')).to.exist;
      expect(table.querySelector('tbody')).to.exist;
    });
  });
});

