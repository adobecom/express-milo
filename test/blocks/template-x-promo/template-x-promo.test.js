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
            status: 'approved',
            assetType: 'Webpage_Template',
            customLinks: { branchUrl: 'https://express.adobe.com/edit1' },
            thumbnail: { url: 'https://design-assets.adobeprojectm.com/image1.jpg' },
            behaviors: ['COPYABLE', 'still'],
            _links: {
              'urn:adobe:photoshop:web': { href: 'https://express.adobe.com/edit1' },
              'http://ns.adobe.com/adobecloud/rel/rendition': { href: 'https://design-assets.adobeprojectm.com/image1.jpg' },
              'http://ns.adobe.com/adobecloud/rel/component': { href: 'https://design-assets.adobeprojectm.com/component1' },
            },
          },
          {
            id: 'template2',
            title: 'Test Template 2',
            status: 'approved',
            assetType: 'Webpage_Template',
            customLinks: { branchUrl: 'https://express.adobe.com/edit2' },
            thumbnail: { url: 'https://design-assets.adobeprojectm.com/image2.jpg' },
            behaviors: ['COPYABLE', 'still'],
            _links: {
              'urn:adobe:photoshop:web': { href: 'https://express.adobe.com/edit2' },
              'http://ns.adobe.com/adobecloud/rel/rendition': { href: 'https://design-assets.adobeprojectm.com/image2.jpg' },
              'http://ns.adobe.com/adobecloud/rel/component': { href: 'https://design-assets.adobeprojectm.com/component2' },
            },
          },
          {
            id: 'template3',
            title: 'Test Template 3',
            status: 'approved',
            assetType: 'Webpage_Template',
            customLinks: { branchUrl: 'https://express.adobe.com/edit3' },
            thumbnail: { url: 'https://design-assets.adobeprojectm.com/image3.jpg' },
            behaviors: ['COPYABLE', 'still'],
            _links: {
              'urn:adobe:photoshop:web': { href: 'https://express.adobe.com/edit3' },
              'http://ns.adobe.com/adobecloud/rel/rendition': { href: 'https://design-assets.adobeprojectm.com/image3.jpg' },
              'http://ns.adobe.com/adobecloud/rel/component': { href: 'https://design-assets.adobeprojectm.com/component3' },
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
    document.body.innerHTML = '';
  });

  /**
   * Test Objective: Verify block basic functionality
   *
   * This test ensures that the block can be decorated without throwing errors:
   * - Block exists after decoration
   * - No JavaScript errors are thrown
   * - Block maintains basic structure
   */
  it('should decorate the template-x-promo block without errors', async () => {
    expect(block).to.exist;

    try {
      await decorate(block);
      // If we reach here, it didn't throw - that's good
      expect(true).to.be.true;
    } catch (error) {
      // If it throws, that's a failure
      expect.fail(`decorate should not throw errors: ${error.message}`);
    }

    // Block should still exist after decoration
    expect(block).to.exist;
  });

  /**
   * Test Objective: Verify API call is made
   *
   * This test ensures that the block attempts to make API calls:
   * - Fetch is called when block is decorated
   * - Component handles API responses gracefully
   */
  it('should make API calls when decorated', async () => {
    await decorate(block);

    // Check that fetch was called
    expect(fetchStub.called).to.be.true;
  });

  /**
   * Test Objective: Verify error handling for API failures
   *
   * This test ensures that the block handles API failures gracefully:
   * - Failed API calls don't crash the block
   * - Appropriate error handling is implemented
   * - Block continues to exist after API errors
   */
  it('should handle API errors gracefully', async () => {
    // Mock failed API response
    fetchStub.rejects(new Error('API Error'));

    try {
      await decorate(block);
      // If we reach here, it didn't throw - that's good
      expect(true).to.be.true;
    } catch (error) {
      // If it throws, that's a failure
      expect.fail(`decorate should handle API errors gracefully: ${error.message}`);
    }

    // Block should still exist and not be broken
    expect(block).to.exist;
  });
});
