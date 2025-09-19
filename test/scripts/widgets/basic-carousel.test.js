/* eslint-env mocha */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

describe('Basic Carousel Widget', () => {
  let buildBasicCarousel;
  let getLibsStub;

  before(async () => {
    // Mock getLibs to return proper path
    getLibsStub = sinon.stub();
    getLibsStub.returns('../../../libs');
    window.getLibs = getLibsStub;

    // Import after mocking
    const module = await import('../../../express/code/scripts/widgets/basic-carousel.js');
    buildBasicCarousel = module.default;
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
    expect(buildBasicCarousel).to.be.a('function');
  });

  it('should return a promise', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<div>Test item</div>';
    document.body.appendChild(parent);

    const result = buildBasicCarousel(null, parent);
    expect(result).to.be.a('promise');
  });

  it('should handle null selector', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<div>Test item</div>';
    document.body.appendChild(parent);

    const result = buildBasicCarousel(null, parent);
    expect(result).to.be.a('promise');
  });

  it('should handle custom selector', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<div class="item">Test item</div>';
    document.body.appendChild(parent);

    const result = buildBasicCarousel('.item', parent);
    expect(result).to.be.a('promise');
  });

  it('should handle empty options', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<div>Test item</div>';
    document.body.appendChild(parent);

    const result = buildBasicCarousel(null, parent, {});
    expect(result).to.be.a('promise');
  });

  it('should handle undefined options', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<div>Test item</div>';
    document.body.appendChild(parent);

    const result = buildBasicCarousel(null, parent, undefined);
    expect(result).to.be.a('promise');
  });

  it('should call getLibs for dependencies', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<div>Test item</div>';
    document.body.appendChild(parent);

    buildBasicCarousel(null, parent);
    expect(getLibsStub.called).to.be.true;
  });

  it('should handle multiple items', () => {
    const parent = document.createElement('div');
    parent.innerHTML = `
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    `;
    document.body.appendChild(parent);

    const result = buildBasicCarousel(null, parent);
    expect(result).to.be.a('promise');
  });

  it('should handle empty parent', () => {
    const parent = document.createElement('div');
    document.body.appendChild(parent);

    const result = buildBasicCarousel(null, parent);
    expect(result).to.be.a('promise');
  });

  it('should handle different option configurations', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<div>Test item</div>';
    document.body.appendChild(parent);

    const options = { autoplay: true, loop: false, delay: 3000 };
    const result = buildBasicCarousel(null, parent, options);
    expect(result).to.be.a('promise');
  });
});
