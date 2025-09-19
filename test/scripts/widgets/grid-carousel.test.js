/* eslint-env mocha */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

describe('Grid Carousel Widget', () => {
  let buildGridCarousel;
  let getLibsStub;

  before(async () => {
    // Mock getLibs to return proper path
    getLibsStub = sinon.stub();
    getLibsStub.returns('../../../libs');
    window.getLibs = getLibsStub;

    // Import after mocking
    const module = await import('../../../express/code/scripts/widgets/grid-carousel.js');
    buildGridCarousel = module.default;
  });

  beforeEach(() => {
    getLibsStub.resetHistory();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  after(() => {
    delete window.getLibs;
  });

  it('should be a function', () => {
    expect(buildGridCarousel).to.be.a('function');
  });

  it('should return a promise', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<div>Test item</div>';
    document.body.appendChild(parent);

    const result = buildGridCarousel(null, parent);
    expect(result).to.be.a('promise');
  });

  it('should handle null selector', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<div>Test item</div>';
    document.body.appendChild(parent);

    const result = buildGridCarousel(null, parent);
    expect(result).to.be.a('promise');
  });

  it('should handle custom selector', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<div class="grid-item">Test item</div>';
    document.body.appendChild(parent);

    const result = buildGridCarousel('.grid-item', parent);
    expect(result).to.be.a('promise');
  });

  it('should handle empty options', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<div>Test item</div>';
    document.body.appendChild(parent);

    const result = buildGridCarousel(null, parent, {});
    expect(result).to.be.a('promise');
  });

  it('should call getLibs for dependencies', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<div>Test item</div>';
    document.body.appendChild(parent);

    buildGridCarousel(null, parent);
    expect(getLibsStub.called).to.be.true;
  });

  it('should handle multiple grid items', () => {
    const parent = document.createElement('div');
    parent.innerHTML = `
      <div>Grid Item 1</div>
      <div>Grid Item 2</div>
      <div>Grid Item 3</div>
      <div>Grid Item 4</div>
    `;
    document.body.appendChild(parent);

    const result = buildGridCarousel(null, parent);
    expect(result).to.be.a('promise');
  });

  it('should handle empty parent', () => {
    const parent = document.createElement('div');
    document.body.appendChild(parent);

    const result = buildGridCarousel(null, parent);
    expect(result).to.be.a('promise');
  });

  it('should handle different option configurations', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<div>Test item</div>';
    document.body.appendChild(parent);

    const options = { visibleItems: 3, spacing: '16px' };
    const result = buildGridCarousel(null, parent, options);
    expect(result).to.be.a('promise');
  });

  it('should handle various parent configurations', () => {
    // Test with different parent setups
    const testCases = [
      '<div>Single item</div>',
      '<div>Item 1</div><div>Item 2</div>',
      '<span>Different tag</span>',
      '<div class="special">Special item</div>',
    ];

    testCases.forEach((innerHTML) => {
      const parent = document.createElement('div');
      parent.innerHTML = innerHTML;
      document.body.appendChild(parent);

      const result = buildGridCarousel(null, parent);
      expect(result).to.be.a('promise');

      parent.remove(); // Clean up
    });
  });
});
