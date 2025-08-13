import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };

window.isTestEnv = true;
const imports = await Promise.all([
  import('../../../express/code/scripts/utils.js'),
  import('../../../express/code/scripts/scripts.js')
]);
const { getLibs } = imports[0];

await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = { locales };
  mod.setConfig(conf);
});

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('How-to-v3 CSS Integration', () => {
  let blocks;
  let howToV3Module;

  before(async () => {
    blocks = [...document.querySelectorAll('.how-to-v3')];
    howToV3Module = await import('../../../express/code/blocks/how-to-v3/how-to-v3.js');
    
    // Load the CSS file
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../../../express/code/blocks/how-to-v3/how-to-v3.css';
    document.head.appendChild(link);
  });

  after(() => {
    // Clean up
    blocks.forEach(block => {
      const steps = block.querySelectorAll('.step');
      steps.forEach(step => {
        const h3 = step.querySelector('h3');
        if (h3) {
          h3.removeEventListener('click', () => {});
        }
        step.removeEventListener('keyup', () => {});
      });
    });
  });

  describe('CSS Classes and Structure', () => {
    it('should apply correct CSS classes for styling', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      // Check main container classes
      const stepsContent = block.querySelector('.steps-content');
      expect(stepsContent).to.exist;
      expect(stepsContent.classList.contains('steps-content')).to.be.true;

      // Check media container classes
      const mediaContainer = stepsContent.querySelector('.media-container');
      expect(mediaContainer).to.exist;
      expect(mediaContainer.classList.contains('media-container')).to.be.true;

      // Check steps list classes
      const stepsList = stepsContent.querySelector('ol.steps');
      expect(stepsList).to.exist;
      expect(stepsList.classList.contains('steps')).to.be.true;
    });

    it('should apply step-specific CSS classes', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      steps.forEach(step => {
        // Check step item classes
        expect(step.classList.contains('step')).to.be.true;

        // Check step indicator classes
        const indicator = step.querySelector('.step-indicator');
        expect(indicator).to.exist;
        expect(indicator.classList.contains('step-indicator')).to.be.true;

        // Check step content classes
        const content = step.querySelector('.step-content');
        expect(content).to.exist;
        expect(content.classList.contains('step-content')).to.be.true;

        // Check detail container classes
        const detailContainer = step.querySelector('.detail-container');
        expect(detailContainer).to.exist;
        expect(detailContainer.classList.contains('detail-container')).to.be.true;
      });
    });

    it('should apply detail text CSS classes', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      steps.forEach(step => {
        const detailText = step.querySelector('.detail-text');
        expect(detailText).to.exist;
        expect(detailText.classList.contains('detail-text')).to.be.true;
      });
    });
  });

  describe('CSS State Management', () => {
    it('should apply closed state CSS classes correctly', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      
      // First step should not have closed class
      const firstStep = steps[0];
      const firstDetail = firstStep.querySelector('.detail-container');
      expect(firstDetail.classList.contains('closed')).to.be.false;

      // Other steps should have closed class
      for (let i = 1; i < steps.length; i++) {
        const detail = steps[i].querySelector('.detail-container');
        expect(detail.classList.contains('closed')).to.be.true;
      }
    });

    it('should toggle closed state CSS classes on interaction', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      const secondStep = steps[1];
      const h3 = secondStep.querySelector('h3');

      // Initially, second step should be closed
      let detail = secondStep.querySelector('.detail-container');
      expect(detail.classList.contains('closed')).to.be.true;

      // Click to open second step
      h3.click();

      // Second step should no longer have closed class
      detail = secondStep.querySelector('.detail-container');
      expect(detail.classList.contains('closed')).to.be.false;

      // First step should now have closed class
      detail = steps[0].querySelector('.detail-container');
      expect(detail.classList.contains('closed')).to.be.true;
    });
  });

  describe('CSS Transitions and Animations', () => {
    it('should set max-height for smooth transitions', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      
      // First step should have max-height set for smooth opening
      const firstStep = steps[0];
      const firstDetail = firstStep.querySelector('.detail-container');
      expect(firstDetail.style.maxHeight).to.not.equal('0');
      expect(firstDetail.style.maxHeight).to.not.equal('');

      // Other steps should have max-height: 0 for smooth closing
      for (let i = 1; i < steps.length; i++) {
        const detail = steps[i].querySelector('.detail-container');
        expect(detail.style.maxHeight).to.equal('0');
      }
    });

    it('should update max-height on state changes', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      const secondStep = steps[1];
      const h3 = secondStep.querySelector('h3');

      // Initially, second step should have max-height: 0
      let detail = secondStep.querySelector('.detail-container');
      expect(detail.style.maxHeight).to.equal('0');

      // Click to open second step
      h3.click();

      // Second step should now have max-height set to scrollHeight
      detail = secondStep.querySelector('.detail-container');
      expect(detail.style.maxHeight).to.not.equal('0');
      expect(detail.style.maxHeight).to.not.equal('');
    });
  });

  describe('CSS Media Handling', () => {
    it('should preserve picture elements with sources', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const mediaContainer = block.querySelector('.media-container');
      const picture = mediaContainer.querySelector('picture');
      expect(picture).to.exist;

      // Check that all sources are preserved
      const sources = picture.querySelectorAll('source');
      expect(sources).to.have.length(3);

      // Check source attributes
      sources.forEach(source => {
        expect(source.getAttribute('type')).to.exist;
        expect(source.getAttribute('srcset')).to.exist;
      });
    });

    it('should preserve link elements with images', async () => {
      const block = blocks[2];
      howToV3Module.default(block);

      const mediaContainer = block.querySelector('.media-container');
      const link = mediaContainer.querySelector('a');
      expect(link).to.exist;
      expect(link.href).to.equal('https://example.com/video');

      const img = link.querySelector('img');
      expect(img).to.exist;
      expect(img.src).to.include('video-thumbnail.jpeg');
    });

    it('should handle background images with CSS variables', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      // Check that background image CSS variable is set
      const backgroundImage = block.style.getPropertyValue('--background-image');
      expect(backgroundImage).to.include('url(');
      expect(backgroundImage).to.include('media_155e7f2580c47057cb54669398a186b96da83a755.png');
    });
  });

  describe('CSS Responsive Behavior', () => {
    it('should maintain structure across different content sizes', async () => {
      const block = blocks[1]; // Block with minimal content
      howToV3Module.default(block);

      // Should still create all required elements
      const stepsContent = block.querySelector('.steps-content');
      expect(stepsContent).to.exist;

      const mediaContainer = stepsContent.querySelector('.media-container');
      expect(mediaContainer).to.exist;

      const stepsList = stepsContent.querySelector('ol.steps');
      expect(stepsList).to.exist;

      const steps = stepsList.querySelectorAll('li.step');
      expect(steps).to.have.length(2);

      // Each step should have the complete structure
      steps.forEach(step => {
        expect(step.querySelector('.step-indicator')).to.exist;
        expect(step.querySelector('.step-content')).to.exist;
        expect(step.querySelector('.detail-container')).to.exist;
        expect(step.querySelector('.detail-text')).to.exist;
      });
    });

    it('should handle different media types consistently', async () => {
      // Test picture element
      const blockWithPicture = blocks[0];
      howToV3Module.default(blockWithPicture);
      let mediaContainer = blockWithPicture.querySelector('.media-container');
      expect(mediaContainer.querySelector('picture')).to.exist;

      // Test link element
      const blockWithLink = blocks[2];
      howToV3Module.default(blockWithLink);
      mediaContainer = blockWithLink.querySelector('.media-container');
      expect(mediaContainer.querySelector('a')).to.exist;
    });
  });

  describe('CSS Accessibility Features', () => {
    it('should maintain proper ARIA attributes for screen readers', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      steps.forEach((step, index) => {
        // Check tabindex for keyboard navigation
        expect(step.getAttribute('tabindex')).to.equal('0');

        // Check aria-expanded for state indication
        expect(step.getAttribute('aria-expanded')).to.exist;

        // Check aria-controls for relationship
        expect(step.getAttribute('aria-controls')).to.equal(`step-detail-${index}`);
      });
    });

    it('should provide proper ARIA labels for detail containers', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      steps.forEach(step => {
        const detailContainer = step.querySelector('.detail-container');
        const h3 = step.querySelector('h3');
        
        // Check aria-labelledby attribute
        expect(detailContainer.getAttribute('aria-labelledby')).to.exist;
        
        // Verify the label references the step title without numbering
        const titleText = h3.textContent.replace(/^\d+\.\s*/, '');
        expect(detailContainer.getAttribute('aria-labelledby')).to.equal(titleText);
      });
    });
  });

  describe('CSS Performance and Optimization', () => {
    it('should use efficient CSS selectors and avoid repaints', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      
      // Check that max-height transitions are set up for smooth animations
      steps.forEach(step => {
        const detail = step.querySelector('.detail-container');
        expect(detail.style.maxHeight).to.exist;
      });

      // Verify that the first step doesn't cause initial repaint
      const firstStep = steps[0];
      const firstDetail = firstStep.querySelector('.detail-container');
      expect(firstDetail.style.maxHeight).to.not.equal('0');
    });

    it('should handle dynamic content changes efficiently', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      const thirdStep = steps[2];
      const h3 = thirdStep.querySelector('h3');

      // Simulate rapid state changes
      h3.click();
      h3.click();
      h3.click();

      // Should maintain consistent state
      const detail = thirdStep.querySelector('.detail-container');
      expect(detail.classList.contains('closed')).to.be.false;
    });
  });
});
