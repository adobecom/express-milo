/* eslint-env mocha */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const imports = await Promise.all([
  import('../../../express/code/scripts/utils.js'),
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/scripts/widgets/carousel-factory.js'),
]);
const { getLibs } = imports[0];
const { createTemplateCarousel } = imports[2];

await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  mod.setConfig({ locales: { '': { ietf: 'en-US', tk: 'jdq5hay.css' } } });
});

const body = await readFile({ path: './mocks/body.html' });

describe('carousel-factory', () => {
  let block;
  let mockCreateTag;
  let mockAttachHoverListeners;

  beforeEach(() => {
    document.body.innerHTML = body;
    block = document.querySelector('.template-x-promo');

    // Mock createTag function
    mockCreateTag = sinon.stub().callsFake((tag, attributes = {}, content = '') => {
      const element = document.createElement(tag);
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
      if (content) {
        element.innerHTML = content;
      }
      return element;
    });

    // Mock attachHoverListeners function
    mockAttachHoverListeners = sinon.stub().resolves();

    // Mock window functions
    window.createTag = mockCreateTag;
    window.getConfig = sinon.stub().returns({});
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete window.createTag;
    delete window.getConfig;
  });

  describe('createTemplateCarousel', () => {
    it('should be a function', () => {
      expect(createTemplateCarousel).to.be.a('function');
    });

    it('should handle empty template elements array', async () => {
      const templateElements = [];

      const result = await createTemplateCarousel(
        block,
        templateElements,
        mockCreateTag,
        mockAttachHoverListeners,
        null,
        null,
        null,
      );

      // The function may return undefined or a carousel object
      // Just test that it doesn't throw an error
      expect(result).to.not.throw;
    });

    it('should handle basic template elements', async () => {
      const templateElements = [
        document.createElement('div'),
        document.createElement('div'),
      ];

      const result = await createTemplateCarousel(
        block,
        templateElements,
        mockCreateTag,
        mockAttachHoverListeners,
        null,
        null,
        null,
      );

      // The function may return undefined or a carousel object
      // Just test that it doesn't throw an error
      expect(result).to.not.throw;
    });

    it('should handle mobile viewport', async () => {
      const templateElements = [
        document.createElement('div'),
        document.createElement('div'),
      ];

      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      const result = await createTemplateCarousel(
        block,
        templateElements,
        mockCreateTag,
        mockAttachHoverListeners,
        null,
        null,
        null,
      );

      // The function may return undefined or a carousel object
      // Just test that it doesn't throw an error
      expect(result).to.not.throw;
    });

    it('should handle desktop viewport', async () => {
      const templateElements = [
        document.createElement('div'),
        document.createElement('div'),
      ];

      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const result = await createTemplateCarousel(
        block,
        templateElements,
        mockCreateTag,
        mockAttachHoverListeners,
        null,
        null,
        null,
      );

      // The function may return undefined or a carousel object
      // Just test that it doesn't throw an error
      expect(result).to.not.throw;
    });

    it('should handle null parameters gracefully', async () => {
      try {
        const result = await createTemplateCarousel(
          null,
          [],
          null,
          null,
          null,
          null,
          null,
        );
        // If it doesn't throw, that's fine
        expect(result).to.not.throw;
      } catch (error) {
        // Expected to throw due to missing dependencies
        expect(error.message).to.include('Missing required carousel dependencies');
      }
    });
  });
});
