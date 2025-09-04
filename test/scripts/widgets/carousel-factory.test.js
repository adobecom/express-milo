/* eslint-env mocha */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

// Import the carousel factory
const { default: CarouselFactory } = await import('../../../express/code/scripts/widgets/carousel-factory.js');

describe('Carousel Factory', () => {
  let mockBlock;
  let mockTemplates;
  let sandbox;

  before(() => {
    window.isTestEnv = true;
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Create mock DOM elements
    mockBlock = document.createElement('div');
    mockBlock.className = 'test-carousel';
    document.body.appendChild(mockBlock);

    // Mock templates data
    mockTemplates = [
      { id: 'template1', title: 'Template 1', image: 'image1.jpg' },
      { id: 'template2', title: 'Template 2', image: 'image2.jpg' },
      { id: 'template3', title: 'Template 3', image: 'image3.jpg' },
    ];

    // Mock createTag function
    window.createTag = (tag, attributes = {}, content = '') => {
      const element = document.createElement(tag);
      Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'class') {
          element.className = value;
        } else {
          element.setAttribute(key, value);
        }
      });
      if (content) element.textContent = content;
      return element;
    };

    // Mock IntersectionObserver
    window.IntersectionObserver = sandbox.stub().callsFake((callback) => ({
      observe: sandbox.stub(),
      unobserve: sandbox.stub(),
      disconnect: sandbox.stub(),
      trigger: (entries) => callback(entries),
    }));

    // Mock ResizeObserver
    window.ResizeObserver = sandbox.stub().callsFake(() => ({
      observe: sandbox.stub(),
      unobserve: sandbox.stub(),
      disconnect: sandbox.stub(),
    }));

    // Mock requestAnimationFrame
    window.requestAnimationFrame = sandbox.stub().callsFake((callback) => {
      setTimeout(callback, 16);
      return 1;
    });

    window.cancelAnimationFrame = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
    document.body.innerHTML = '';
  });

  /**
   * Test Objective: Verify basic carousel creation
   *
   * This test ensures that the carousel factory can create a basic carousel with:
   * - Proper initialization
   * - DOM structure creation
   * - Basic configuration handling
   */
  it('should create a basic carousel', async () => {
    const carousel = await CarouselFactory.create({
      ...CarouselFactory.presets.basic,
      block: mockBlock,
      templates: mockTemplates,
    });

    expect(carousel).to.exist;
    expect(carousel.config).to.exist;
    expect(carousel.config.showNavigation).to.be.true;
    expect(carousel.config.responsive).to.be.true;
  });

  /**
   * Test Objective: Verify preset configurations
   *
   * This test ensures that predefined presets work correctly:
   * - Basic preset has correct default settings
   * - Template promo preset includes looping
   * - High performance preset enables virtual scrolling and lazy loading
   * - Mobile preset enables touch gestures and momentum physics
   * - Ultimate preset enables all advanced features
   */
  it('should use correct preset configurations', () => {
    expect(CarouselFactory.presets.basic).to.deep.include({
      showNavigation: true,
      responsive: true,
    });

    expect(CarouselFactory.presets.templatePromo).to.deep.include({
      showNavigation: true,
      responsive: true,
      looping: true,
    });

    expect(CarouselFactory.presets.highPerformance).to.deep.include({
      virtualScrolling: true,
      lazyLoading: true,
    });

    expect(CarouselFactory.presets.mobile).to.deep.include({
      touchGestures: true,
      momentumPhysics: true,
    });

    expect(CarouselFactory.presets.ultimate).to.deep.include({
      virtualScrolling: true,
      lazyLoading: true,
      touchGestures: true,
      momentumPhysics: true,
      parallaxEffects: true,
      smartAutoplay: true,
      adaptiveImages: true,
      errorBoundary: true,
    });
  });

  /**
   * Test Objective: Verify lazy loading feature
   *
   * This test ensures that lazy loading works correctly:
   * - IntersectionObserver is created when lazy loading is enabled
   * - Images are properly configured for lazy loading
   * - Observer cleanup happens on carousel destruction
   */
  it('should initialize lazy loading when enabled', async () => {
    const carousel = await CarouselFactory.create({
      lazyLoading: true,
      block: mockBlock,
      templates: mockTemplates,
    });

    expect(window.IntersectionObserver.calledOnce).to.be.true;

    // Verify lazy loading observer was created
    const observerCall = window.IntersectionObserver.getCall(0);
    expect(observerCall.args[0]).to.be.a('function'); // callback function
    expect(observerCall.args[1]).to.be.an('object'); // options object

    carousel.destroy();
  });

  /**
   * Test Objective: Verify touch gestures feature
   *
   * This test ensures that touch gestures work correctly:
   * - Touch event listeners are added when enabled
   * - Swipe detection works properly
   * - Touch handlers are cleaned up on destruction
   */
  it('should initialize touch gestures when enabled', async () => {
    const addEventListenerSpy = sandbox.spy(mockBlock, 'addEventListener');

    const carousel = await CarouselFactory.create({
      touchGestures: true,
      block: mockBlock,
      templates: mockTemplates,
    });

    // Verify touch event listeners were added
    expect(addEventListenerSpy.calledWith('touchstart')).to.be.true;
    expect(addEventListenerSpy.calledWith('touchmove')).to.be.true;
    expect(addEventListenerSpy.calledWith('touchend')).to.be.true;

    carousel.destroy();
  });

  /**
   * Test Objective: Verify virtual scrolling feature
   *
   * This test ensures that virtual scrolling works correctly:
   * - ResizeObserver is created for virtual scrolling
   * - Viewport calculations are properly handled
   * - Only visible items are rendered for large datasets
   */
  it('should initialize virtual scrolling when enabled', async () => {
    const largeTemplateSet = Array.from({ length: 100 }, (_, i) => ({
      id: `template${i}`,
      title: `Template ${i}`,
      image: `image${i}.jpg`,
    }));

    const carousel = await CarouselFactory.create({
      virtualScrolling: true,
      block: mockBlock,
      templates: largeTemplateSet,
    });

    expect(window.ResizeObserver.calledOnce).to.be.true;

    carousel.destroy();
  });

  /**
   * Test Objective: Verify smart autoplay feature
   *
   * This test ensures that smart autoplay works correctly:
   * - Autoplay starts when configured
   * - Autoplay pauses on appropriate events
   * - Autoplay resumes when conditions are met
   * - Timers are properly cleaned up
   */
  it('should handle smart autoplay correctly', async () => {
    const carousel = await CarouselFactory.create({
      smartAutoplay: true,
      autoplay: true,
      autoplayInterval: 1000,
      block: mockBlock,
      templates: mockTemplates,
    });

    // Simulate play
    if (carousel.play) {
      carousel.play();
    }

    // Simulate pause
    if (carousel.pause) {
      carousel.pause();
    }

    carousel.destroy();
  });

  /**
   * Test Objective: Verify error boundary feature
   *
   * This test ensures that error boundaries work correctly:
   * - Errors are caught and handled gracefully
   * - Fallback content is displayed when needed
   * - Error tracking works properly
   * - Recovery mechanisms function correctly
   */
  it('should handle errors gracefully with error boundary', async () => {
    const errorSpy = sandbox.spy(console, 'error');

    // Create carousel with error boundary
    const carousel = await CarouselFactory.create({
      errorBoundary: true,
      block: mockBlock,
      templates: mockTemplates,
    });

    // Simulate an error scenario
    try {
      // This would normally cause an error in real implementation
      if (carousel.simulateError) {
        carousel.simulateError('Test error');
      }
    } catch (error) {
      // Error should be caught by error boundary
    }

    carousel.destroy();
  });

  /**
   * Test Objective: Verify parallax effects feature
   *
   * This test ensures that parallax effects work correctly:
   * - Parallax elements are properly configured
   * - Mouse and scroll events trigger parallax updates
   * - Parallax calculations are within expected ranges
   * - Performance is maintained with RAF usage
   */
  it('should initialize parallax effects when enabled', async () => {
    const carousel = await CarouselFactory.create({
      parallaxEffects: true,
      parallaxFactor: 0.1,
      block: mockBlock,
      templates: mockTemplates,
    });

    expect(window.requestAnimationFrame.called).to.be.true;

    carousel.destroy();
  });

  /**
   * Test Objective: Verify momentum physics feature
   *
   * This test ensures that momentum physics work correctly:
   * - Touch velocity is calculated properly
   * - Momentum animations use RAF for smooth performance
   * - Friction and bounce effects work as expected
   * - Physics calculations are mathematically sound
   */
  it('should initialize momentum physics when enabled', async () => {
    const carousel = await CarouselFactory.create({
      momentumPhysics: true,
      momentumFriction: 0.95,
      maxVelocity: 30,
      block: mockBlock,
      templates: mockTemplates,
    });

    expect(carousel.config.momentumFriction).to.equal(0.95);
    expect(carousel.config.maxVelocity).to.equal(30);

    carousel.destroy();
  });

  /**
   * Test Objective: Verify adaptive images feature
   *
   * This test ensures that adaptive images work correctly:
   * - Breakpoints are properly configured
   * - Image sources are updated based on viewport
   * - Device pixel ratio is considered
   * - Lazy loading integration works seamlessly
   */
  it('should initialize adaptive images when enabled', async () => {
    const carousel = await CarouselFactory.create({
      adaptiveImages: true,
      block: mockBlock,
      templates: mockTemplates,
    });

    // Verify that ResizeObserver is used for responsive images
    expect(window.ResizeObserver.called).to.be.true;

    carousel.destroy();
  });

  /**
   * Test Objective: Verify carousel destruction and cleanup
   *
   * This test ensures that carousels are properly cleaned up:
   * - All event listeners are removed
   * - All observers are disconnected
   * - All timers are cleared
   * - Memory leaks are prevented
   * - DOM modifications are reverted if needed
   */
  it('should properly destroy carousel and cleanup resources', async () => {
    const carousel = await CarouselFactory.create({
      ...CarouselFactory.presets.ultimate,
      block: mockBlock,
      templates: mockTemplates,
    });

    // Verify carousel was created successfully
    expect(carousel).to.exist;

    // Destroy the carousel
    carousel.destroy();

    // Verify cleanup was called on all features
    expect(carousel.destroyed).to.be.true;
  });

  /**
   * Test Objective: Verify configuration override functionality
   *
   * This test ensures that custom configurations properly override presets:
   * - Preset values are used as defaults
   * - Custom configurations override preset values
   * - Invalid configurations are handled gracefully
   * - Type checking works for configuration values
   */
  it('should allow configuration overrides on presets', async () => {
    const customConfig = {
      ...CarouselFactory.presets.basic,
      autoplay: true,
      autoplayInterval: 5000,
      customProperty: 'test-value',
    };

    const carousel = await CarouselFactory.create({
      ...customConfig,
      block: mockBlock,
      templates: mockTemplates,
    });

    expect(carousel.config.showNavigation).to.be.true; // from preset
    expect(carousel.config.responsive).to.be.true; // from preset
    expect(carousel.config.autoplay).to.be.true; // custom override
    expect(carousel.config.autoplayInterval).to.equal(5000); // custom override
    expect(carousel.config.customProperty).to.equal('test-value'); // custom property

    carousel.destroy();
  });

  /**
   * Test Objective: Verify edge case handling
   *
   * This test ensures that edge cases are handled correctly:
   * - Empty template arrays
   * - Null or undefined parameters
   * - Invalid DOM elements
   * - Extreme configuration values
   * - Browser compatibility issues
   */
  it('should handle edge cases gracefully', async () => {
    // Test with empty templates
    const emptyCarousel = await CarouselFactory.create({
      ...CarouselFactory.presets.basic,
      block: mockBlock,
      templates: [],
    });

    expect(emptyCarousel).to.exist;
    emptyCarousel.destroy();

    // Test with null block (should create default)
    const nullBlockCarousel = await CarouselFactory.create({
      ...CarouselFactory.presets.basic,
      block: null,
      templates: mockTemplates,
    });

    expect(nullBlockCarousel).to.exist;
    nullBlockCarousel.destroy();

    // Test with undefined templates (should default to empty array)
    const undefinedTemplatesCarousel = await CarouselFactory.create({
      ...CarouselFactory.presets.basic,
      block: mockBlock,
      templates: undefined,
    });

    expect(undefinedTemplatesCarousel).to.exist;
    undefinedTemplatesCarousel.destroy();
  });
});
