import { createTag } from '../utils.js';
import { addAnimationToggle } from './media.js';

/** Adding a backup here for the rootPath */
const federatedAccessibilityIconsPath = 'https://main--federal--adobecom.aem.live';

export default function createAccessibilityVideoControls(
  videoElement,
  videoLabels,
  federatedRootPath = federatedAccessibilityIconsPath,
) {
  const controlsWrapper = createTag('div', {
    class: 'video-controls-wrapper',
    tabIndex: '0',
    role: 'button',
    'aria-pressed': 'true',
  });

  // Add play and pause icons
  controlsWrapper.append(
    createTag('img', { alt: '', src: `${federatedRootPath}/federal/assets/svgs/accessibility-pause.svg`, class: 'accessibility-control icon-pause-video' }),
    createTag('img', { alt: '', src: `${federatedRootPath}/federal/assets/svgs/accessibility-play.svg`, class: 'accessibility-control icon-play-video isHidden' }),
  );

  // Add keyboard support
  controlsWrapper.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      controlsWrapper.click();
    }
  });

  // Update button state when video state changes
  videoElement.addEventListener('play', () => {
    controlsWrapper.setAttribute('aria-pressed', 'true');
    controlsWrapper.setAttribute('aria-label', videoLabels.playMotion);
  });

  videoElement.addEventListener('pause', () => {
    controlsWrapper.setAttribute('aria-pressed', 'false');
    controlsWrapper.setAttribute('aria-label', videoLabels.pauseMotion);
  });

  /** Add the toggling state changes */
  addAnimationToggle(controlsWrapper);

  return controlsWrapper;
}
