import { getLibs, getIconElementDeprecated } from '../../scripts/utils.js';
import { createAccessibilityVideoControls } from '../../scripts/utils/media.js';
import { appendLinkText, getExpressLandingPageType, sendEventToAnalytics } from '../../scripts/instrument.js';

let getMetadata;

export default async function decorate(block) {
  await Promise.all([import(`${getLibs()}/utils/utils.js`)]).then(([utils]) => {
    ({ getMetadata } = utils);
  });

  // Add button-container class to p tag after h1 and add classes to the link
  const h1 = block.querySelector('h1:first-of-type');
  if (h1) {
    const pWithLink = block.querySelector('p:has(a)');
    if (pWithLink) {
      pWithLink.classList.add('button-container');
      const link = pWithLink.querySelector('a');
      if (link) {
        link.classList.add('quick-link', 'button', 'accent');
      }
    }
  }

  // Handle video elements
  const videoElement = block.querySelector('video');
  if (videoElement) {
    try {
      const videoParent = videoElement.closest('div');
      if (videoParent) {
        videoParent.classList.add('hero-animation-overlay');
      }
      await createAccessibilityVideoControls(videoElement);
    } catch (error) {
      window.lana?.log('Error creating video controls:', error);
    }
  }

  if (block && ['on', 'yes'].includes(getMetadata('marquee-inject-logo')?.toLowerCase())) {
    const logo = getIconElementDeprecated('adobe-express-logo');
    logo.classList.add('express-logo');

    const isHeroTop = block.classList.contains('hero-top');

    if (isHeroTop) {
      const headerElement = block.querySelector('h1');
      headerElement?.parentElement?.insertBefore(logo, headerElement);
    } else {
      const headerElement = block.querySelector('h1');
      headerElement?.parentElement?.insertBefore(logo, headerElement);
    }
  }

  // Tracking any video elements
  const videoElements = block.querySelectorAll('.video-container');
  if (videoElements.length) {
    videoElements.forEach((videoContainer) => {
      const parent = videoContainer.closest('.ax-marquee-dynamic-hero');
      const a = parent?.querySelector('a');
      const adobeEventName = appendLinkText(`adobe.com:express:cta:learn:marquee-dynamic-hero:${getExpressLandingPageType()}:`, a);

      parent?.addEventListener('click', (e) => {
        e.stopPropagation();
        sendEventToAnalytics(adobeEventName);
      });
    });
  }
}
