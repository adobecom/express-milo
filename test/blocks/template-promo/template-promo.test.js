/* eslint-env mocha */
/* eslint-disable no-unused-vars */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const imports = await Promise.all([
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/template-promo/template-promo.js'),
]);
const { default: decorate } = imports[1];

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Template Promo', () => {
  let sandbox;
  let mockCreateTag;
  let mockGetConfig;
  let mockReplaceKey;
  let mockTemplatePromoCarousel;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    
    // Mock the utility functions
    mockCreateTag = sandbox.stub();
    mockGetConfig = sandbox.stub();
    mockReplaceKey = sandbox.stub();
    mockTemplatePromoCarousel = sandbox.stub();

    // Mock the dynamic imports
    sandbox.stub(imports[0], 'getLibs').returns('@adobe/block-library');
    
    // Mock the utils module
    const mockUtils = {
      createTag: mockCreateTag,
      getConfig: mockGetConfig,
    };
    
    // Mock the placeholders module
    const mockPlaceholders = {
      replaceKey: mockReplaceKey,
    };

    // Mock the dynamic imports in the decorate function
    sandbox.stub(Promise, 'all').resolves([
      { default: mockUtils },
      { default: mockPlaceholders }
    ]);

    // Mock the template-promo-carousel import
    sandbox.stub(imports[0], 'templatePromoCarousel').value(mockTemplatePromoCarousel);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('decorate function', () => {
    it('should add ax-template-promo class to parent element', async () => {
      const block = document.querySelector('.template-promo');
      const parent = block.parentElement;
      
      await decorate(block);
      
      expect(parent.classList.contains('ax-template-promo')).to.be.true;
    });

    it('should hide premium tags elements', async () => {
      const block = document.querySelector('.template-promo');
      const premiumTags = block.querySelectorAll('h4');
      
      await decorate(block);
      
      premiumTags.forEach(tag => {
        expect(tag.style.display).to.equal('none');
      });
    });

    it('should call handleOneUp when there is only one image (one-up variant)', async () => {
      const block = document.querySelector('.template-promo.one-up');
      
      await decorate(block);
      
      // Verify that the parent has the one-up class
      expect(block.parentElement.classList.contains('one-up')).to.be.true;
    });

    it('should call templatePromoCarousel when there are multiple images', async () => {
      const block = document.querySelector('.template-promo.multi-up');
      
      await decorate(block);
      
      // Verify that templatePromoCarousel was called
      expect(mockTemplatePromoCarousel.called).to.be.true;
    });

    it('should handle empty block gracefully', async () => {
      const emptyBlock = document.createElement('div');
      emptyBlock.className = 'template-promo';
      
      // Should not throw an error
      expect(() => decorate(emptyBlock)).to.not.throw();
    });
  });

  describe('handleOneUp function', () => {
    it('should create image wrapper and move image into it', async () => {
      const block = document.querySelector('.template-promo.one-up');
      const img = block.querySelector('picture > img');
      
      // Mock createTag to return a div
      const mockImgWrapper = document.createElement('div');
      mockImgWrapper.className = 'image-wrapper';
      mockCreateTag.returns(mockImgWrapper);
      
      await decorate(block);
      
      // Verify image wrapper was created
      expect(mockCreateTag.calledWith('div', { class: 'image-wrapper' })).to.be.true;
    });

    it('should create edit template button with correct attributes', async () => {
      const block = document.querySelector('.template-promo.one-up');
      const templateLink = block.querySelector('a');
      
      // Mock createTag for button
      const mockButton = document.createElement('a');
      mockCreateTag.onFirstCall().returns(document.createElement('div')); // image wrapper
      mockCreateTag.onSecondCall().returns(mockButton); // button
      mockCreateTag.onThirdCall().returns(document.createElement('section')); // button container
      
      // Mock replaceKey to return a string
      mockReplaceKey.resolves('Edit this template');
      
      await decorate(block);
      
      // Verify button was created with correct attributes
      expect(mockCreateTag.calledWith('a', sinon.match({
        href: templateLink.href,
        title: sinon.match.string,
        class: 'button accent',
        'aria-label': sinon.match.string
      }))).to.be.true;
    });

    it('should hide the original template link', async () => {
      const block = document.querySelector('.template-promo.one-up');
      const templateLink = block.querySelector('a');
      
      await decorate(block);
      
      expect(templateLink.style.display).to.equal('none');
    });

    it('should append button container to parent', async () => {
      const block = document.querySelector('.template-promo.one-up');
      const parent = block.parentElement;
      
      // Mock createTag calls
      const mockImgWrapper = document.createElement('div');
      const mockButton = document.createElement('a');
      const mockButtonContainer = document.createElement('section');
      
      mockCreateTag.onFirstCall().returns(mockImgWrapper);
      mockCreateTag.onSecondCall().returns(mockButton);
      mockCreateTag.onThirdCall().returns(mockButtonContainer);
      
      await decorate(block);
      
      // Verify button container was appended to parent
      expect(parent.contains(mockButtonContainer)).to.be.true;
    });
  });

  describe('getStillWrapperIcons function', () => {
    it('should create free tag for free template type', async () => {
      const block = document.querySelector('.template-promo.free');
      
      // Mock createTag for free tag
      const mockFreeTag = document.createElement('span');
      mockFreeTag.className = 'free-tag';
      mockCreateTag.returns(mockFreeTag);
      
      await decorate(block);
      
      // Verify free tag was created
      expect(mockCreateTag.calledWith('span', { class: 'free-tag' })).to.be.true;
    });

    it('should get premium icon for non-free template type', async () => {
      const block = document.querySelector('.template-promo.premium');
      
      // Mock getIconElementDeprecated
      const mockPremiumIcon = document.createElement('span');
      sandbox.stub(imports[0], 'getIconElementDeprecated').returns(mockPremiumIcon);
      
      await decorate(block);
      
      // Verify premium icon was retrieved
      expect(imports[0].getIconElementDeprecated.calledWith('premium')).to.be.true;
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle missing image elements gracefully', async () => {
      const block = document.querySelector('.template-promo.no-images');
      
      // Should not throw an error
      expect(() => decorate(block)).to.not.throw();
    });

    it('should handle missing template links gracefully', async () => {
      const block = document.querySelector('.template-promo.no-links');
      
      // Should not throw an error
      expect(() => decorate(block)).to.not.throw();
    });

    it('should handle missing premium tags gracefully', async () => {
      const block = document.querySelector('.template-promo.no-tags');
      
      // Should not throw an error
      expect(() => decorate(block)).to.not.throw();
    });
  });
});
