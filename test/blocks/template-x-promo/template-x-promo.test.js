/* eslint-env mocha */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const imports = await Promise.all([
  import('../../../express/code/scripts/utils.js'),
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/template-x-promo/template-x-promo.js'),
  import('../../../express/code/scripts/template-search-api-v3.js'),
]);
const { getLibs } = imports[0];
const { default: decorate } = imports[2];
// const { isValidTemplate: originalIsValidTemplate } = imports[3]; // Not used in tests

await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  mod.setConfig({ locales: { '': { ietf: 'en-US', tk: 'jdq5hay.css' } } });
});

const body = await readFile({ path: './mocks/body.html' });

// Mock responses for tests
const mockFreeResponse = {
  ok: true,
  json: () => Promise.resolve({
    items: [
      {
        id: 'free-template-1',
        title: 'Free Template 1',
        status: 'approved',
        assetType: 'Webpage_Template',
        customLinks: { branchUrl: 'https://express.adobe.com/edit1' },
        thumbnail: { url: 'https://design-assets.adobeprojectm.com/free1.jpg' },
        behaviors: ['still'],
        licensingCategory: 'free',
        _links: {
          'urn:adobe:photoshop:web': { href: 'https://express.adobe.com/edit1' },
          'http://ns.adobe.com/adobecloud/rel/rendition': {
            href: 'https://design-assets.adobeprojectm.com/free1.jpg',
          },
          'http://ns.adobe.com/adobecloud/rel/component': {
            href: 'https://design-assets.adobeprojectm.com/component1',
          },
        },
      },
      {
        id: 'free-template-2',
        title: 'Free Template 2',
        status: 'approved',
        assetType: 'Webpage_Template',
        customLinks: { branchUrl: 'https://express.adobe.com/edit2' },
        thumbnail: { url: 'https://design-assets.adobeprojectm.com/free2.jpg' },
        behaviors: ['still'],
        licensingCategory: 'free',
        _links: {
          'urn:adobe:photoshop:web': { href: 'https://express.adobe.com/edit2' },
          'http://ns.adobe.com/adobecloud/rel/rendition': {
            href: 'https://design-assets.adobeprojectm.com/free2.jpg',
          },
          'http://ns.adobe.com/adobecloud/rel/component': {
            href: 'https://design-assets.adobeprojectm.com/component2',
          },
        },
      },
    ],
  }),
};

describe('Template X Promo', () => {
  let fetchStub;
  let block;

  before(() => {
    window.isTestEnv = true;
  });

  beforeEach(async () => {
    // Clean up any existing stubs first
    if (fetchStub) {
      fetchStub.restore();
    }

    // Reset DOM
    document.body.innerHTML = body;
    block = document.querySelector('.template-x-promo');

    // Mock fetch for API calls
    fetchStub = sinon.stub(window, 'fetch');

    // Mock getIconElementDeprecated for testing
    window.getIconElementDeprecated = sinon.stub().callsFake((iconName) => {
      const icon = document.createElement('div');
      icon.className = `icon icon-${iconName}`;
      icon.textContent = iconName;
      return icon;
    });

    // Mock successful API response
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        items: [
          {
            id: 'template1',
            title: 'Test Template 1',
            status: 'approved',
            assetType: 'Webpage_Template',
            customLinks: { branchUrl: 'https://express.adobe.com/edit1' },
            thumbnail: { url: 'https://design-assets.adobeprojectm.com/image1.jpg' },
            behaviors: ['still'],
            licensingCategory: 'free',
            _links: {
              'urn:adobe:photoshop:web': { href: 'https://express.adobe.com/edit1' },
              'http://ns.adobe.com/adobecloud/rel/rendition': {
                href: 'https://design-assets.adobeprojectm.com/image1.jpg',
              },
              'http://ns.adobe.com/adobecloud/rel/component': {
                href: 'https://design-assets.adobeprojectm.com/component1',
              },
            },
          },
          {
            id: 'template2',
            title: 'Test Template 2',
            status: 'approved',
            assetType: 'Webpage_Template',
            customLinks: { branchUrl: 'https://express.adobe.com/edit2' },
            thumbnail: { url: 'https://design-assets.adobeprojectm.com/image2.jpg' },
            behaviors: ['still'],
            licensingCategory: 'free',
            _links: {
              'urn:adobe:photoshop:web': { href: 'https://express.adobe.com/edit2' },
              'http://ns.adobe.com/adobecloud/rel/rendition': {
                href: 'https://design-assets.adobeprojectm.com/image2.jpg',
              },
              'http://ns.adobe.com/adobecloud/rel/component': {
                href: 'https://design-assets.adobeprojectm.com/component2',
              },
            },
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

    // Clean up window mocks
    delete window.isValidTemplate;
    delete window.getIconElementDeprecated;

    document.body.innerHTML = '';
  });

  it('should decorate the template-x-promo block without errors', async () => {
    expect(block).to.exist;

    try {
      await decorate(block);
      expect(true).to.be.true;
    } catch (error) {
      expect.fail(`decorate should not throw errors: ${error.message}`);
    }

    expect(block).to.exist;
  });

  it('should make API calls when decorated', async () => {
    await decorate(block);
    expect(fetchStub.called).to.be.true;
  });

  it('should handle API errors gracefully', async () => {
    fetchStub.rejects(new Error('API Error'));

    try {
      await decorate(block);
      expect(true).to.be.true;
    } catch (error) {
      expect.fail(`decorate should handle API errors gracefully: ${error.message}`);
    }

    expect(block).to.exist;
  });

  it('should display Free tags in multiple-up carousel templates', async () => {
    // Reset fetchStub for this test
    if (fetchStub) {
      fetchStub.restore();
    }
    fetchStub = sinon.stub(window, 'fetch');

    // Set up the mock response for this test
    fetchStub.resolves(mockFreeResponse);

    // Wait for the async operations to complete
    await decorate(block);
    await new Promise((resolve) => { setTimeout(resolve, 1000); });

    // Debug: Check what's in the block
    console.log('Block innerHTML after decorate:', block.innerHTML);
    console.log('Block parent classes:', block.parentElement.className);

    // Verify the parent has been populated (templates are added to parent, not block)
    expect(block.parentElement.innerHTML).to.not.be.empty;

    const freeTags = block.parentElement.querySelectorAll('.free-tag');
    console.log('Free tags found:', freeTags.length);
    expect(freeTags.length).to.be.greaterThan(0, 'Free tags should be present');

    freeTags.forEach((tag) => {
      expect(tag.textContent.trim()).to.equal('Free');
      expect(tag.classList.contains('free-tag')).to.be.true;
    });

    const imageWrapperFreeTags = block.querySelectorAll('.image-wrapper .free-tag');
    expect(imageWrapperFreeTags.length).to.equal(
      freeTags.length,
      'All Free tags should be in image wrappers',
    );
  });

  it('should display Premium icons in multiple-up carousel templates', async () => {
    // Reset fetchStub for this test
    if (fetchStub) {
      fetchStub.restore();
    }
    fetchStub = sinon.stub(window, 'fetch');

    const mockPremiumResponse = {
      ok: true,
      json: () => Promise.resolve({
        items: [
          {
            id: 'premium-template-1',
            title: 'Premium Template 1',
            status: 'approved',
            assetType: 'Webpage_Template',
            customLinks: { branchUrl: 'https://express.adobe.com/edit1' },
            thumbnail: { url: 'https://design-assets.adobeprojectm.com/premium1.jpg' },
            behaviors: ['COPYABLE', 'still', 'premium'],
            licensingCategory: 'premium',
            _links: {
              'urn:adobe:photoshop:web': { href: 'https://express.adobe.com/edit1' },
              'http://ns.adobe.com/adobecloud/rel/rendition': {
                href: 'https://design-assets.adobeprojectm.com/premium1.jpg',
              },
              'http://ns.adobe.com/adobecloud/rel/component': {
                href: 'https://design-assets.adobeprojectm.com/component1',
              },
            },
          },
          {
            id: 'premium-template-2',
            title: 'Premium Template 2',
            status: 'approved',
            assetType: 'Webpage_Template',
            customLinks: { branchUrl: 'https://express.adobe.com/edit2' },
            thumbnail: { url: 'https://design-assets.adobeprojectm.com/premium2.jpg' },
            behaviors: ['COPYABLE', 'still', 'premium'],
            licensingCategory: 'premium',
            _links: {
              'urn:adobe:photoshop:web': { href: 'https://express.adobe.com/edit2' },
              'http://ns.adobe.com/adobecloud/rel/rendition': {
                href: 'https://design-assets.adobeprojectm.com/premium2.jpg',
              },
              'http://ns.adobe.com/adobecloud/rel/component': {
                href: 'https://design-assets.adobeprojectm.com/component2',
              },
            },
          },
        ],
      }),
    };

    fetchStub.resolves(mockPremiumResponse);

    // Wait for the async operations to complete
    await decorate(block);
    await new Promise((resolve) => { setTimeout(resolve, 1000); });

    // Debug: Check what's in the block
    console.log('Premium test - Block innerHTML after decorate:', block.innerHTML);
    console.log('Premium test - Block parent classes:', block.parentElement.className);

    // Verify the block has been populated
    expect(block.innerHTML).to.not.be.empty;

    const premiumIcons = block.querySelectorAll('.icon-premium');
    expect(premiumIcons.length).to.be.greaterThan(0, 'Premium icons should be present');

    premiumIcons.forEach((icon) => {
      expect(icon.classList.contains('icon')).to.be.true;
      expect(icon.classList.contains('icon-premium')).to.be.true;
      const hasSvgContent = icon.querySelector('svg') !== null;
      const hasImgContent = icon.tagName === 'IMG';
      const hasFallbackClass = icon.classList.contains('premium-fallback');
      expect(hasSvgContent || hasImgContent || hasFallbackClass).to.be.true;
    });

    const imageWrapperPremiumIcons = block.querySelectorAll('.image-wrapper .icon-premium');
    expect(imageWrapperPremiumIcons.length).to.equal(premiumIcons.length);
  });

  it('should display Share icons in button containers with proper accessibility', async () => {
    // Reset the DOM for this test
    document.body.innerHTML = body;
    block = document.querySelector('.template-x-promo');

    // Reset fetchStub for this test
    if (fetchStub) {
      fetchStub.restore();
    }
    fetchStub = sinon.stub(window, 'fetch');

    // Use the existing mockFreeResponse which has the correct structure
    fetchStub.resolves(mockFreeResponse);

    // Wait for the async operations to complete
    await decorate(block);
    await new Promise((resolve) => { setTimeout(resolve, 1000); });

    // Verify the block has been populated
    expect(block.innerHTML).to.not.be.empty;

    // Debug: Check what's in the block
    console.log('Share icons test - Block innerHTML after decorate:', block.innerHTML);
    console.log('Share icons test - getIconElementDeprecated available:', typeof window.getIconElementDeprecated);

    const shareIcons = block.querySelectorAll('.icon-share-arrow');
    console.log('Share icons found:', shareIcons.length);
    expect(shareIcons.length).to.be.greaterThan(0, 'Share icons should be present');

    shareIcons.forEach((icon) => {
      expect(icon.classList.contains('icon')).to.be.true;
      expect(icon.classList.contains('icon-share-arrow')).to.be.true;

      expect(icon.getAttribute('role')).to.equal('button');
      expect(icon.getAttribute('tabindex')).to.equal('0');
      expect(icon.getAttribute('aria-label')).to.include('Share');
      const hasSvgContent = icon.querySelector('svg') !== null;
      const hasImgContent = icon.tagName === 'IMG';
      const hasFallbackClass = icon.classList.contains('share-fallback');
      expect(hasSvgContent || hasImgContent || hasFallbackClass).to.be.true;
    });

    const shareWrappers = block.querySelectorAll('.share-icon-wrapper');
    expect(shareWrappers.length).to.be.greaterThan(0);
    shareWrappers.forEach((wrapper) => {
      const shareIcon = wrapper.querySelector('.icon-share-arrow');
      expect(shareIcon).to.exist;
      const tooltip = wrapper.querySelector('.shared-tooltip');
      expect(tooltip).to.exist;
      expect(tooltip.textContent.trim()).to.equal('Copied to clipboard');
    });
  });

  it('should NOT display Free/Premium tags in one-up layout', async () => {
    // Reset fetchStub for this test
    if (fetchStub) {
      fetchStub.restore();
    }
    fetchStub = sinon.stub(window, 'fetch');

    const mockSingleResponse = {
      ok: true,
      json: () => Promise.resolve({
        items: [
          {
            id: 'single-template',
            title: 'Single Template',
            status: 'approved',
            assetType: 'Webpage_Template',
            customLinks: { branchUrl: 'https://express.adobe.com/edit1' },
            thumbnail: { url: 'https://design-assets.adobeprojectm.com/single.jpg' },
            behaviors: ['still'],
            licensingCategory: 'free',
            _links: {
              'urn:adobe:photoshop:web': { href: 'https://express.adobe.com/edit1' },
              'http://ns.adobe.com/adobecloud/rel/rendition': {
                href: 'https://design-assets.adobeprojectm.com/single.jpg',
              },
              'http://ns.adobe.com/adobecloud/rel/component': {
                href: 'https://design-assets.adobeprojectm.com/component1',
              },
            },
          },
        ],
      }),
    };

    fetchStub.resolves(mockSingleResponse);

    // Wait for the async operations to complete
    await decorate(block);
    await new Promise((resolve) => { setTimeout(resolve, 1000); });

    // Verify the block has been populated
    expect(block.innerHTML).to.not.be.empty;

    const { parentElement } = block;
    expect(parentElement.classList.contains('one-up')).to.be.true;

    const freeTags = block.querySelectorAll('.free-tag');
    expect(freeTags.length).to.equal(0, 'One-up layout should NOT have Free tags');

    const premiumIcons = block.querySelectorAll('.icon-premium');
    expect(premiumIcons.length).to.equal(0, 'One-up layout should NOT have Premium icons');

    const images = block.querySelectorAll('img');
    expect(images.length).to.be.greaterThan(0, 'One-up layout should have images');
  });

  it('should not create share icons when getIconElementDeprecated is unavailable', async () => {
    // Reset fetchStub for this test
    if (fetchStub) {
      fetchStub.restore();
    }
    fetchStub = sinon.stub(window, 'fetch');

    const originalGetIcon = window.getIconElementDeprecated;
    window.getIconElementDeprecated = () => null;

    // Set up the mock response for this test
    fetchStub.resolves({
      ok: true,
      json: () => Promise.resolve({
        items: [
          {
            id: 'template1',
            title: 'Test Template 1',
            status: 'approved',
            assetType: 'Webpage_Template',
            customLinks: { branchUrl: 'https://express.adobe.com/edit1' },
            thumbnail: { url: 'https://design-assets.adobeprojectm.com/image1.jpg' },
            behaviors: ['still'],
            licensingCategory: 'free',
            _links: {
              'urn:adobe:photoshop:web': { href: 'https://express.adobe.com/edit1' },
              'http://ns.adobe.com/adobecloud/rel/rendition': {
                href: 'https://design-assets.adobeprojectm.com/image1.jpg',
              },
              'http://ns.adobe.com/adobecloud/rel/component': {
                href: 'https://design-assets.adobeprojectm.com/component1',
              },
            },
          },
        ],
      }),
    });

    try {
      // Wait for the async operations to complete
      await decorate(block);
      await new Promise((resolve) => { setTimeout(resolve, 1000); });

      // Verify the block has been populated
      expect(block.innerHTML).to.not.be.empty;

      // When getIconElementDeprecated returns null, no share icons should be created
      const shareIcons = block.querySelectorAll('.icon-share-arrow');
      expect(shareIcons.length).to.equal(0, 'No share icons should be created when getIconElementDeprecated is unavailable');
    } finally {
      window.getIconElementDeprecated = originalGetIcon;
    }
  });
});
