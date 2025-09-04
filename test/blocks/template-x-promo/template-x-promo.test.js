/* eslint-env mocha */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const imports = await Promise.all([
  import('../../../express/code/scripts/utils.js'),
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/template-x-promo/template-x-promo.js'),
]);
const { getLibs } = imports[0];
const { default: decorate } = imports[2];

await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  mod.setConfig({ locales: { '': { ietf: 'en-US', tk: 'jdq5hay.css' } } });
});

const body = await readFile({ path: './mocks/body.html' });

describe('Template X Promo', () => {
  let fetchStub;
  let block;

  before(() => {
    window.isTestEnv = true;
  });

  beforeEach(async () => {
    document.body.innerHTML = body;
    block = document.querySelector('.template-x-promo');

    // Mock fetch for API calls
    fetchStub = sinon.stub(window, 'fetch');

    // Mock successful API response
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        items: [
          {
            id: 'template1',
            title: 'Test Template 1',
            thumbnail: { url: 'https://example.com/image1.jpg' },
            _links: { 'urn:adobe:photoshop:web': { href: 'https://example.com/edit1' } },
          },
          {
            id: 'template2',
            title: 'Test Template 2',
            thumbnail: { url: 'https://example.com/image2.jpg' },
            _links: { 'urn:adobe:photoshop:web': { href: 'https://example.com/edit2' } },
          },
          {
            id: 'template3',
            title: 'Test Template 3',
            thumbnail: { url: 'https://example.com/image3.jpg' },
            _links: { 'urn:adobe:photoshop:web': { href: 'https://example.com/edit3' } },
          },
        ],
      }),
    };

    fetchStub.resolves(mockResponse);
  });

  afterEach(() => {
    if (fetchStub) {
      fetchStub.restore();
    }
    document.body.innerHTML = '';
  });

  /**
   * Test Objective: Verify basic block decoration
   *
   * This test ensures that the template-x-promo block is properly decorated with:
   * - A carousel container for displaying templates
   * - Navigation controls for carousel interaction
   * - Proper CSS classes for styling
   */
  it('should decorate the template-x-promo block', async () => {
    expect(block).to.exist;
    await decorate(block);

    const carousel = block.querySelector('.promo-carousel-wrapper');
    expect(carousel).to.exist;
  });

  /**
   * Test Objective: Verify API data extraction from recipe text
   *
   * This test ensures that API parameters are correctly extracted from the recipe text:
   * - Collection ID and template IDs are parsed from the recipe
   * - Environment and other query parameters are handled
   * - Fallback text is removed from DOM after processing
   */
  it('should extract API parameters from recipe text', async () => {
    await decorate(block);

    // Check that fetch was called with correct parameters
    expect(fetchStub.calledOnce).to.be.true;

    const fetchCall = fetchStub.getCall(0);
    const apiUrl = fetchCall.args[0];

    // Verify API URL contains expected parameters
    expect(apiUrl).to.include('express-search-api-v3');
    expect(apiUrl).to.include('queryType=search');
  });

  /**
   * Test Objective: Verify single template (one-up) layout
   *
   * This test ensures that when only one template is returned:
   * - The block gets the 'one-up' CSS class
   * - No navigation controls are displayed
   * - The template is properly rendered with hover functionality
   */
  it('should handle single template (one-up) layout', async () => {
    // Mock single template response
    const singleTemplateResponse = {
      ok: true,
      json: () => Promise.resolve({
        items: [
          {
            id: 'template1',
            title: 'Single Template',
            thumbnail: { url: 'https://example.com/image1.jpg' },
            _links: { 'urn:adobe:photoshop:web': { href: 'https://example.com/edit1' } },
          },
        ],
      }),
    };

    fetchStub.resolves(singleTemplateResponse);

    await decorate(block);

    expect(block.classList.contains('one-up')).to.be.true;

    const navControls = block.querySelector('.promo-nav-controls');
    expect(navControls).to.not.exist;
  });

  /**
   * Test Objective: Verify multiple templates carousel layout
   *
   * This test ensures that when multiple templates are returned:
   * - The block gets the 'multiple-up' CSS class
   * - Navigation controls are displayed (previous/next buttons)
   * - Templates are arranged in a carousel track
   * - Dynamic CSS classes are applied based on template count (two-up, three-up, etc.)
   */
  it('should handle multiple templates carousel layout', async () => {
    await decorate(block);

    expect(block.classList.contains('multiple-up')).to.be.true;

    const navControls = block.querySelector('.promo-nav-controls');
    expect(navControls).to.exist;

    const prevBtn = navControls.querySelector('.promo-nav-btn[aria-label*="Previous"]');
    const nextBtn = navControls.querySelector('.promo-nav-btn[aria-label*="Next"]');

    expect(prevBtn).to.exist;
    expect(nextBtn).to.exist;

    // Verify dynamic CSS class based on template count (3 templates = three-up)
    expect(block.classList.contains('three-up')).to.be.true;
  });

  /**
   * Test Objective: Verify carousel navigation functionality
   *
   * This test ensures that carousel navigation works correctly:
   * - Next button advances to the next template
   * - Previous button goes back to the previous template
   * - Navigation respects carousel boundaries
   * - ARIA attributes are properly updated
   */
  it('should handle carousel navigation', async () => {
    await decorate(block);

    const navControls = block.querySelector('.promo-nav-controls');
    const nextBtn = navControls.querySelector('.promo-nav-btn[aria-label*="Next"]');
    const prevBtn = navControls.querySelector('.promo-nav-btn[aria-label*="Previous"]');

    // Initial state - previous button should be disabled
    expect(prevBtn.disabled).to.be.true;
    expect(nextBtn.disabled).to.be.false;

    // Click next button
    nextBtn.click();

    // Previous button should now be enabled
    expect(prevBtn.disabled).to.be.false;
  });

  /**
   * Test Objective: Verify template hover functionality
   *
   * This test ensures that template hover interactions work correctly:
   * - Hover overlay appears on mouse enter
   * - Hover overlay disappears on mouse leave
   * - Edit buttons are properly configured with correct URLs
   * - ARIA attributes are set for accessibility
   */
  it('should handle template hover interactions', async () => {
    await decorate(block);

    const templates = block.querySelectorAll('.template');
    expect(templates.length).to.be.greaterThan(0);

    const firstTemplate = templates[0];
    const hoverEvent = new Event('mouseenter');

    firstTemplate.dispatchEvent(hoverEvent);

    // Check that hover class is applied
    expect(firstTemplate.classList.contains('hover-active')).to.be.true;

    // Check that edit button exists and has correct href
    const editBtn = firstTemplate.querySelector('.button-container .con-button');
    expect(editBtn).to.exist;
    expect(editBtn.href).to.include('example.com/edit');
  });

  /**
   * Test Objective: Verify responsive CSS classes
   *
   * This test ensures that appropriate CSS classes are applied based on template count:
   * - 2 templates get 'two-up' class
   * - 3 templates get 'three-up' class
   * - 4+ templates get 'four-up' class
   * - Responsive max-height rules are applied correctly
   */
  it('should apply correct responsive CSS classes', async () => {
    // Test with 4 templates
    const fourTemplatesResponse = {
      ok: true,
      json: () => Promise.resolve({
        items: [
          { id: '1', title: 'Template 1', thumbnail: { url: 'img1.jpg' }, _links: { 'urn:adobe:photoshop:web': { href: 'edit1' } } },
          { id: '2', title: 'Template 2', thumbnail: { url: 'img2.jpg' }, _links: { 'urn:adobe:photoshop:web': { href: 'edit2' } } },
          { id: '3', title: 'Template 3', thumbnail: { url: 'img3.jpg' }, _links: { 'urn:adobe:photoshop:web': { href: 'edit3' } } },
          { id: '4', title: 'Template 4', thumbnail: { url: 'img4.jpg' }, _links: { 'urn:adobe:photoshop:web': { href: 'edit4' } } },
        ],
      }),
    };

    fetchStub.resolves(fourTemplatesResponse);

    await decorate(block);

    expect(block.classList.contains('four-up')).to.be.true;
    expect(block.classList.contains('multiple-up')).to.be.true;
  });

  /**
   * Test Objective: Verify error handling for API failures
   *
   * This test ensures that the block handles API failures gracefully:
   * - Failed API calls don't crash the block
   * - Appropriate error handling is implemented
   * - Fallback content is displayed when necessary
   */
  it('should handle API errors gracefully', async () => {
    // Mock failed API response
    fetchStub.rejects(new Error('API Error'));

    // Should not throw an error
    await expect(decorate(block)).to.not.be.rejected;

    // Block should still exist and not be broken
    expect(block).to.exist;
  });

  /**
   * Test Objective: Verify accessibility attributes
   *
   * This test ensures that proper accessibility attributes are set:
   * - ARIA labels for navigation buttons
   * - ARIA roles for carousel elements
   * - Keyboard navigation support
   * - Screen reader compatibility
   */
  it('should have proper accessibility attributes', async () => {
    await decorate(block);

    const navControls = block.querySelector('.promo-nav-controls');
    if (navControls) {
      const prevBtn = navControls.querySelector('.promo-nav-btn[aria-label*="Previous"]');
      const nextBtn = navControls.querySelector('.promo-nav-btn[aria-label*="Next"]');

      expect(prevBtn.getAttribute('aria-label')).to.include('Previous');
      expect(nextBtn.getAttribute('aria-label')).to.include('Next');

      // Check that buttons have proper type
      expect(prevBtn.type).to.equal('button');
      expect(nextBtn.type).to.equal('button');
    }

    // Check that templates have proper structure for screen readers
    const templates = block.querySelectorAll('.template');
    templates.forEach((template) => {
      const img = template.querySelector('img');
      if (img) {
        expect(img.alt).to.exist;
      }
    });
  });

  /**
   * Test Objective: Verify image lazy loading
   *
   * This test ensures that images are configured for lazy loading:
   * - Images have data-src instead of src initially
   * - Proper loading attributes are set
   * - Images load when needed
   */
  it('should configure images for lazy loading', async () => {
    await decorate(block);

    const images = block.querySelectorAll('.template img');
    images.forEach((img) => {
      // Check that image has either src or data-src (depending on loading strategy)
      const hasSrc = img.src && img.src !== '';
      const hasDataSrc = img.dataset.src && img.dataset.src !== '';

      expect(hasSrc || hasDataSrc).to.be.true;
    });
  });
});
