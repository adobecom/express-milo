import {
  readFile,
  emulateMedia,
  setViewport,
} from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };

window.isTestEnv = true;

const imports = await Promise.all([import('../../../express/scripts/utils.js'), import('../../../express/scripts/scripts.js'), import('../../../express/blocks/ax-marquee/ax-marquee.js')]);
const { getLibs } = imports[0];
const {
  default: decorate,
  handleMediaQuery,
  transformToVideoLink,
  decorateToggleContext,
} = imports[2];
await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = { locales };
  mod.setConfig(conf);
});

async function prepBlock(filePath) {
  document.body.innerHTML = await readFile({ path: filePath });
  const marquee = document.querySelector('.ax-marquee');
  await decorate(marquee);
  return marquee;
}

describe('ax-marquee', () => {
  describe('default version', () => {
    it('has a video background', async () => {
      const marquee = await prepBlock('./mocks/default.html');
      const video = marquee.querySelector('video.marquee-background');
      expect(video).to.exist;
    });

    it('has a content foreground', async () => {
      const marquee = await prepBlock('./mocks/default.html');
      const content = marquee.querySelector('.marquee-foreground .content-wrapper');
      expect(content).to.exist;
    });

    it('has at least an H1', async () => {
      const marquee = await prepBlock('./mocks/default.html');
      const h1 = marquee.querySelector('.marquee-foreground .content-wrapper h1');
      expect(h1).to.exist;
    });

    it('has reduce motion toggle', async () => {
      const marquee = await prepBlock('./mocks/default.html');
      const video = marquee.querySelector('video.marquee-background');
      video.dispatchEvent(new Event('canplay'));
      const reduceMotionToggle = marquee.querySelector('.reduce-motion-wrapper');
      expect(reduceMotionToggle).to.exist;
    });

    it('reduce motion toggle on hover adds text', async () => {
      const marquee = await prepBlock('./mocks/default.html');
      const video = marquee.querySelector('video.marquee-background');
      video.dispatchEvent(new Event('canplay'));
      const reduceMotionToggle = marquee.querySelector('.reduce-motion-wrapper');
      expect(reduceMotionToggle.children.length).equals(2);
      await decorateToggleContext(reduceMotionToggle, {});
      expect(reduceMotionToggle.children.length).equals(4);
    });

    it('system accessibility setting affects the page live', async () => {
      const marquee = await prepBlock('./mocks/default.html');
      const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');
      handleMediaQuery(marquee, mediaQuery);
      await emulateMedia({ reducedMotion: 'no-preference' });
      mediaQuery.dispatchEvent(new Event('change'));
      expect(mediaQuery.matches).to.be.false;
      await emulateMedia({ reducedMotion: 'reduce' });
      mediaQuery.dispatchEvent(new Event('change'));
      expect(mediaQuery.matches).to.be.true;
    });

    it('window resize triggers video adjustment', async () => {
      const marquee = await prepBlock('./mocks/default.html');
      const video = marquee.querySelector('video.marquee-background');
      video.src = 'foo';
      await setViewport({ width: 360, height: 640 });
      const newVideo = marquee.querySelector('video.marquee-background');

      expect(newVideo.src).to.not.equal('foo');
    });
  });

  describe('dark version with video', () => {
    it('is dark', async () => {
      const marquee = await prepBlock('./mocks/dark-video.html');
      expect(marquee.classList.contains('dark')).to.be.true;
    });

    it('uses different set of SVG for reduce-motion toggle', async () => {
      const marquee = await prepBlock('./mocks/dark-video.html');
      const video = marquee.querySelector('video.marquee-background');
      video.dispatchEvent(new Event('canplay'));
      const lightPlayIcon = marquee.querySelector('.icon-play-video-light');
      expect(lightPlayIcon).to.exist;
    });
  });

  describe('supports static asset', () => {
    it('renders an image background', async () => {
      const marquee = await prepBlock('./mocks/dark-static.html');
      const video = marquee.querySelector('.background-wrapper video');
      expect(video.poster !== '' && !video.querySelector('source')).to.be.true;
    });

    it('does not load reduce motion toggle', async () => {
      const marquee = await prepBlock('./mocks/dark-static.html');
      const reduceMotionToggle = marquee.querySelector('.reduce-motion-wrapper');
      expect(reduceMotionToggle).to.not.exist;
    });
  });

  describe('supports options', () => {
    it('renders an background color', async () => {
      const marquee = await prepBlock('./mocks/shadow-background.html');
      expect(marquee.getAttribute('style')).to.not.equal('');
    });

    it('renders a shadow', async () => {
      const marquee = await prepBlock('./mocks/shadow-background.html');
      const shadow = marquee.querySelector('.hero-shadow');
      expect(shadow).to.exist;
    });

    it.only('video link click opens video overlay', async () => {
      const marquee = await prepBlock('./mocks/shadow-background.html');
      const videoLink = marquee.querySelector('a[href="./media_1ff62f7924e9f7cb39ebf245d1ac1be92eb868835.mp4"]');
      if (videoLink) transformToVideoLink(videoLink.closest('div'), videoLink);
      videoLink.click();
      setTimeout(() => {
        expect(document.querySelector('.video-overlay')).to.exist;
      }, 100);
    });
  });

  describe('supports wide variant', () => {
    it('renders an wide background', async () => {
      const marquee = await prepBlock('./mocks/wide.html');
      expect(marquee.classList.contains('wide')).to.be.true;
    });
  });
});
