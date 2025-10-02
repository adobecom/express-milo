import { expect } from '@esm-bundle/chai';
import { createAccessibilityVideoControls } from '../../../express/code/scripts/utils/media.js';

describe('Media Utils', () => {
  describe('createAccessibilityVideoControls', () => {
    let videoElement;
    let container;

    beforeEach(() => {
      // Create a mock video element
      videoElement = document.createElement('video');
      videoElement.src = 'test-video.mp4';
      
      // Create a container for the test
      container = document.createElement('div');
      container.className = 'hero-animation-overlay column';
      document.body.appendChild(container);
    });

    afterEach(() => {
      // Clean up
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });

    it('should create a button element for video controls', async () => {
      const result = await createAccessibilityVideoControls(videoElement);
      
      // Find the controls wrapper
      const controlsWrapper = container.querySelector('.video-controls-wrapper');
      
      expect(controlsWrapper).to.exist;
      expect(controlsWrapper.tagName).to.equal('BUTTON');
      expect(controlsWrapper.type).to.equal('button');
    });

    it('should have proper ARIA attributes', async () => {
      const result = await createAccessibilityVideoControls(videoElement);
      
      const controlsWrapper = container.querySelector('.video-controls-wrapper');
      
      expect(controlsWrapper.getAttribute('aria-pressed')).to.equal('true');
      expect(controlsWrapper.getAttribute('aria-label')).to.exist;
    });

    it('should contain accessibility control icons', async () => {
      const result = await createAccessibilityVideoControls(videoElement);
      
      const pauseIcon = container.querySelector('.accessibility-control.icon-pause-video');
      const playIcon = container.querySelector('.accessibility-control.icon-play-video');
      
      expect(pauseIcon).to.exist;
      expect(playIcon).to.exist;
      expect(playIcon.classList.contains('isHidden')).to.be.true;
    });

    it('should update ARIA attributes when video state changes', async () => {
      const result = await createAccessibilityVideoControls(videoElement);
      
      const controlsWrapper = container.querySelector('.video-controls-wrapper');
      
      // Simulate video pause event
      videoElement.dispatchEvent(new Event('pause'));
      
      expect(controlsWrapper.getAttribute('aria-pressed')).to.equal('false');
    });

    it('should be focusable and clickable', async () => {
      const result = await createAccessibilityVideoControls(videoElement);
      
      const controlsWrapper = container.querySelector('.video-controls-wrapper');
      
      // Should be focusable (native button behavior)
      expect(controlsWrapper.tabIndex).to.equal(0);
      
      // Should be clickable
      let clicked = false;
      controlsWrapper.addEventListener('click', () => {
        clicked = true;
      });
      
      controlsWrapper.click();
      expect(clicked).to.be.true;
    });
  });
});
