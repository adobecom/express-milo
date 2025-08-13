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

describe('How-to-v3', () => {
  let blocks;
  let howToV3Module;

  before(async () => {
    blocks = [...document.querySelectorAll('.how-to-v3')];
    // Import the how-to-v3 module
    howToV3Module = await import('../../../express/code/blocks/how-to-v3/how-to-v3.js');
  });

  after(() => {
    // Clean up any event listeners or modifications
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

  describe('decorate function', () => {
    it('should decorate the block with proper structure', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      // Check if steps-content div is created
      const stepsContent = block.querySelector('.steps-content');
      expect(stepsContent).to.exist;

      // Check if media-container is created
      const mediaContainer = stepsContent.querySelector('.media-container');
      expect(mediaContainer).to.exist;

      // Check if steps list is created
      const stepsList = stepsContent.querySelector('ol.steps');
      expect(stepsList).to.exist;
    });

    it('should handle background image when present', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      // Check if background image CSS variable is set
      const backgroundImage = block.style.getPropertyValue('--background-image');
      expect(backgroundImage).to.include('url(');
      expect(backgroundImage).to.include('media_155e7f2580c47057cb54669398a186b96da83a755.png');
    });

    it('should handle blocks without background image', async () => {
      const block = blocks[1];
      howToV3Module.default(block);

      // Check that no background image CSS variable is set
      const backgroundImage = block.style.getPropertyValue('--background-image');
      expect(backgroundImage).to.equal('');
    });

    it('should extract and preserve media content (picture)', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const mediaContainer = block.querySelector('.media-container');
      const picture = mediaContainer.querySelector('picture');
      expect(picture).to.exist;

      // Check that sources are preserved
      const sources = picture.querySelectorAll('source');
      expect(sources).to.have.length(3);

      // Check that img is preserved
      const img = picture.querySelector('img');
      expect(img).to.exist;
      expect(img.src).to.include('media_18c183a086e758c6c2ffc44ad1c81c05465612bb1.jpeg');
    });

    it('should extract and preserve media content (link)', async () => {
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
  });

  describe('buildAccordion function', () => {
    it('should create ordered list with proper structure', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const stepsList = block.querySelector('ol.steps');
      expect(stepsList).to.exist;
      expect(stepsList.classList.contains('steps')).to.be.true;

      const steps = stepsList.querySelectorAll('li.step');
      expect(steps).to.have.length(5);
    });

    it('should create step items with proper attributes', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      steps.forEach((step, index) => {
        expect(step.classList.contains('step')).to.be.true;
        expect(step.getAttribute('tabindex')).to.equal('0');
        expect(step.getAttribute('aria-expanded')).to.equal(index === 0 ? 'true' : 'false');
        expect(step.getAttribute('aria-controls')).to.equal(`step-detail-${index}`);
      });
    });

    it('should create step indicators and content containers', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      steps.forEach((step) => {
        const indicator = step.querySelector('.step-indicator');
        expect(indicator).to.exist;

        const content = step.querySelector('.step-content');
        expect(content).to.exist;
      });
    });

    it('should create step titles with proper numbering', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      steps.forEach((step, index) => {
        const h3 = step.querySelector('h3');
        expect(h3).to.exist;
        expect(h3.id).to.equal(`step-title-${index}`);
        
        const stepNumber = h3.textContent;
        const expectedNumber = index + 1;
        expect(stepNumber.includes(expectedNumber.toString())).to.be.true;
      });
    });

    it('should create detail containers with proper attributes', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      steps.forEach((step, index) => {
        const detailContainer = step.querySelector('.detail-container');
        expect(detailContainer).to.exist;
        expect(detailContainer.id).to.equal(`step-detail-${index}`);
        expect(detailContainer.classList.contains('detail-text')).to.be.false;

        const detailText = detailContainer.querySelector('.detail-text');
        expect(detailText).to.exist;
        expect(detailText.classList.contains('detail-text')).to.be.true;
      });
    });

    it('should set initial state correctly (first step open, others closed)', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      
      // First step should be open
      const firstStep = steps[0];
      expect(firstStep.getAttribute('aria-expanded')).to.equal('true');
      const firstDetail = firstStep.querySelector('.detail-container');
      expect(firstDetail.classList.contains('closed')).to.be.false;

      // Other steps should be closed
      for (let i = 1; i < steps.length; i++) {
        const step = steps[i];
        expect(step.getAttribute('aria-expanded')).to.equal('false');
        const detail = step.querySelector('.detail-container');
        expect(detail.classList.contains('closed')).to.be.true;
      }
    });
  });

  describe('setStepDetails function', () => {
    it('should open the specified step and close others', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      // Get the setStepDetails function from the module
      const setStepDetails = howToV3Module.setStepDetails || 
        (() => {
          // If not exported, we'll test it indirectly through the click handler
          const steps = block.querySelectorAll('li.step');
          const secondStep = steps[1];
          const h3 = secondStep.querySelector('h3');
          h3.click();
        });

      if (typeof setStepDetails === 'function') {
        // Test opening step 2
        setStepDetails(block, 2);

        const steps = block.querySelectorAll('li.step');
        expect(steps[2].getAttribute('aria-expanded')).to.equal('true');
        expect(steps[2].querySelector('.detail-container').classList.contains('closed')).to.be.false;

        // Other steps should be closed
        [0, 1, 3, 4].forEach(index => {
          expect(steps[index].getAttribute('aria-expanded')).to.equal('false');
          expect(steps[index].querySelector('.detail-container').classList.contains('closed')).to.be.true;
        });
      }
    });

    it('should set proper max-height for open steps', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      const firstStep = steps[0];
      const detail = firstStep.querySelector('.detail-container');
      
      // First step should have max-height set to scrollHeight
      expect(detail.style.maxHeight).to.not.equal('0');
      expect(detail.style.maxHeight).to.not.equal('');
    });

    it('should set max-height to 0 for closed steps', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      
      // Steps after the first should have max-height: 0
      for (let i = 1; i < steps.length; i++) {
        const detail = steps[i].querySelector('.detail-container');
        expect(detail.style.maxHeight).to.equal('0');
      }
    });
  });

  describe('Event handling', () => {
    it('should handle click events on step titles', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      const secondStep = steps[1];
      const h3 = secondStep.querySelector('h3');

      // Click on second step title
      h3.click();

      // Second step should now be open
      expect(secondStep.getAttribute('aria-expanded')).to.equal('true');
      expect(secondStep.querySelector('.detail-container').classList.contains('closed')).to.be.false;

      // First step should now be closed
      expect(steps[0].getAttribute('aria-expanded')).to.equal('false');
      expect(steps[0].querySelector('.detail-container').classList.contains('closed')).to.be.true;
    });

    it('should handle keyboard events (Enter key) on step items', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      const thirdStep = steps[2];

      // Simulate Enter key press on third step
      const enterEvent = new KeyboardEvent('keyup', { which: 13 });
      thirdStep.dispatchEvent(enterEvent);

      // Third step should now be open
      expect(thirdStep.getAttribute('aria-expanded')).to.equal('true');
      expect(thirdStep.querySelector('.detail-container').classList.contains('closed')).to.be.false;
    });

    it('should not handle other keyboard events', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      const thirdStep = steps[2];

      // Simulate Space key press (which !== 13)
      const spaceEvent = new KeyboardEvent('keyup', { which: 32 });
      thirdStep.dispatchEvent(spaceEvent);

      // Third step should remain closed
      expect(thirdStep.getAttribute('aria-expanded')).to.equal('false');
      expect(thirdStep.querySelector('.detail-container').classList.contains('closed')).to.be.true;
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      steps.forEach((step, index) => {
        expect(step.getAttribute('tabindex')).to.equal('0');
        expect(step.getAttribute('aria-expanded')).to.exist;
        expect(step.getAttribute('aria-controls')).to.equal(`step-detail-${index}`);
      });
    });

    it('should have proper ARIA labels for detail containers', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      steps.forEach((step) => {
        const detailContainer = step.querySelector('.detail-container');
        const h3 = step.querySelector('h3');
        
        expect(detailContainer.getAttribute('aria-labelledby')).to.exist;
        // The aria-labelledby should reference the step title without the number
        const titleText = h3.textContent.replace(/^\d+\.\s*/, '');
        expect(detailContainer.getAttribute('aria-labelledby')).to.equal(titleText);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle blocks with minimal content', async () => {
      const block = blocks[1];
      howToV3Module.default(block);

      // Should still create the basic structure
      const stepsContent = block.querySelector('.steps-content');
      expect(stepsContent).to.exist;

      const stepsList = stepsContent.querySelector('ol.steps');
      expect(stepsList).to.exist;

      const steps = stepsList.querySelectorAll('li.step');
      expect(steps).to.have.length(2);
    });

    it('should handle blocks with different media types', async () => {
      const block = blocks[2];
      howToV3Module.default(block);

      const mediaContainer = block.querySelector('.media-container');
      expect(mediaContainer).to.exist;

      // Should handle both picture and link elements
      const link = mediaContainer.querySelector('a');
      expect(link).to.exist;
    });

    it('should auto-click first step after decoration', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      // Wait for the setTimeout to execute
      await new Promise(resolve => setTimeout(resolve, 150));

      const steps = block.querySelectorAll('li.step');
      const firstStep = steps[0];
      
      // First step should be open after auto-click
      expect(firstStep.getAttribute('aria-expanded')).to.equal('true');
      expect(firstStep.querySelector('.detail-container').classList.contains('closed')).to.be.false;
    });
  });

  describe('CSS integration', () => {
    it('should apply proper CSS classes for styling', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      // Check that all required CSS classes are applied
      const stepsContent = block.querySelector('.steps-content');
      expect(stepsContent).to.exist;

      const mediaContainer = stepsContent.querySelector('.media-container');
      expect(mediaContainer).to.exist;

      const stepsList = stepsContent.querySelector('ol.steps');
      expect(stepsList).to.exist;

      const steps = stepsList.querySelectorAll('li.step');
      steps.forEach(step => {
        expect(step.classList.contains('step')).to.be.true;
        
        const indicator = step.querySelector('.step-indicator');
        expect(indicator).to.exist;
        
        const content = step.querySelector('.step-content');
        expect(content).to.exist;
        
        const detailContainer = step.querySelector('.detail-container');
        expect(detailContainer).to.exist;
      });
    });

    it('should handle CSS transitions for accordion effect', async () => {
      const block = blocks[0];
      howToV3Module.default(block);

      const steps = block.querySelectorAll('li.step');
      const firstStep = steps[0];
      const detail = firstStep.querySelector('.detail-container');

      // Check that max-height is set for smooth transitions
      expect(detail.style.maxHeight).to.not.equal('0');
      expect(detail.style.maxHeight).to.not.equal('');
    });
  });
});
