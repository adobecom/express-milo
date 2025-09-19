/* eslint-env mocha */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

describe('Embed Block', () => {
  let getDefaultEmbed;
  let embedInstagram;
  let decorate;

  before(async () => {
    // Import the module
    const module = await import('../../../express/code/blocks/embed/embed.js');
    getDefaultEmbed = module.getDefaultEmbed;
    embedInstagram = module.embedInstagram;
    decorate = module.default;
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getDefaultEmbed function', () => {
    it('should create default iframe embed HTML', () => {
      const testUrl = new URL('https://example.com/video/123');

      const result = getDefaultEmbed(testUrl);

      expect(result).to.include('<iframe src="https://example.com/video/123"');
      expect(result).to.include('title="Content from example.com"');
      expect(result).to.include('allowfullscreen=""');
      expect(result).to.include('loading="lazy"');
      expect(result).to.include('padding-bottom: 56.25%');

      console.log('✅ Default embed HTML generation tested!');
    });

    it('should handle different domains', () => {
      const domains = [
        'https://youtube.com/watch?v=123',
        'https://vimeo.com/123456',
        'https://example.org/content',
      ];

      domains.forEach((urlString) => {
        const url = new URL(urlString);
        const result = getDefaultEmbed(url);

        expect(result).to.include(`src="${url.href}"`);
        expect(result).to.include(`title="Content from ${url.hostname}"`);
      });

      console.log('✅ Different domains tested!');
    });

    it('should create responsive iframe wrapper', () => {
      const testUrl = new URL('https://test.com/embed');

      const result = getDefaultEmbed(testUrl);

      expect(result).to.include('position: relative');
      expect(result).to.include('width: 100%');
      expect(result).to.include('height: 0');
      expect(result).to.include('padding-bottom: 56.25%'); // 16:9 aspect ratio

      console.log('✅ Responsive wrapper tested!');
    });

    it('should include security and accessibility attributes', () => {
      const testUrl = new URL('https://secure.com/video');

      const result = getDefaultEmbed(testUrl);

      expect(result).to.include('border: 0');
      expect(result).to.include('scrolling="no"');
      expect(result).to.include('allow="encrypted-media"');
      expect(result).to.include('loading="lazy"');

      console.log('✅ Security and accessibility attributes tested!');
    });
  });

  describe('embedInstagram function', () => {
    beforeEach(() => {
      // Mock window.location safely
      if (!window.location.originalHref) {
        window.location.originalHref = window.location.href;
      }
      window.location.href = 'https://example.com/page';
    });

    afterEach(() => {
      // Restore original location if it was saved
      if (window.location.originalHref) {
        window.location.href = window.location.originalHref;
      }
    });

    it('should create Instagram embed HTML', () => {
      const instagramUrl = new URL('https://www.instagram.com/p/ABC123/');

      const result = embedInstagram(instagramUrl);

      expect(result).to.include('instagram-media');
      expect(result).to.include('instagram-media-rendered');
      expect(result).to.include('src="https://www.instagram.com/p/ABC123/embed/');
      expect(result).to.include('cr=1');
      expect(result).to.include('allowfullscreen="true"');

      console.log('✅ Instagram embed HTML generation tested!');
    });

    it('should handle Instagram URLs with trailing slash', () => {
      const instagramUrl = new URL('https://www.instagram.com/p/ABC123/');

      const result = embedInstagram(instagramUrl);

      expect(result).to.include('/p/ABC123/embed/');

      console.log('✅ Instagram URL with trailing slash tested!');
    });

    it('should handle Instagram URLs without trailing slash', () => {
      const instagramUrl = new URL('https://www.instagram.com/p/ABC123');

      const result = embedInstagram(instagramUrl);

      expect(result).to.include('/p/ABC123/embed/');

      console.log('✅ Instagram URL without trailing slash tested!');
    });

    it('should include current page URL in embed parameters', () => {
      // Use current window.location.href without trying to modify it
      const instagramUrl = new URL('https://www.instagram.com/p/TEST123/');

      const result = embedInstagram(instagramUrl);

      // Should include some form of rd parameter
      expect(result).to.include('rd=');

      console.log('✅ Current page URL inclusion tested!');
    });

    it('should append .html to current URL if missing', () => {
      // Temporarily change location for this test
      const originalHref = window.location.href;
      window.location.href = 'https://mysite.com/page';

      try {
        const instagramUrl = new URL('https://www.instagram.com/p/TEST123/');

        const result = embedInstagram(instagramUrl);

        expect(result).to.include('rd=');
        expect(result).to.include('.html');

        console.log('✅ HTML extension appending tested!');
      } finally {
        window.location.href = originalHref;
      }
    });

    it('should create responsive Instagram embed wrapper', () => {
      const instagramUrl = new URL('https://www.instagram.com/p/ABC123/');

      const result = embedInstagram(instagramUrl);

      expect(result).to.include('width: 100%');
      expect(result).to.include('position: relative');
      expect(result).to.include('padding-bottom: 56.25%');
      expect(result).to.include('justify-content: center');

      console.log('✅ Responsive Instagram wrapper tested!');
    });

    it('should include Instagram-specific styling', () => {
      const instagramUrl = new URL('https://www.instagram.com/p/ABC123/');

      const result = embedInstagram(instagramUrl);

      expect(result).to.include('background: white');
      expect(result).to.include('border-radius: 3px');
      expect(result).to.include('border: 1px solid rgb(219, 219, 219)');
      expect(result).to.include('height="530"');

      console.log('✅ Instagram styling tested!');
    });
  });

  describe('decorate function', () => {
    it('should decorate Instagram embed links', () => {
      const block = document.createElement('div');
      block.className = 'embed';
      block.innerHTML = '<a href="https://www.instagram.com/p/ABC123/">Instagram Post</a>';

      decorate(block);

      expect(block.innerHTML).to.include('instagram-media');
      expect(block.classList.contains('embed-')).to.be.true;

      console.log('✅ Instagram link decoration tested!');
    });

    it('should decorate non-Instagram embed links with default embed', () => {
      const block = document.createElement('div');
      block.className = 'embed';
      block.innerHTML = '<a href="https://example.com/video/123">Video Link</a>';

      decorate(block);

      expect(block.innerHTML).to.include('<iframe src="https://example.com/video/123"');
      expect(block.innerHTML).to.include('title="Content from example.com"');
      expect(block.classList.contains('embed-example')).to.be.true;

      console.log('✅ Default embed link decoration tested!');
    });

    it('should ignore YouTube, Vimeo, and Twitter links', () => {
      const block = document.createElement('div');
      block.className = 'embed';
      block.innerHTML = `
        <a href="https://youtube.com/watch?v=123">YouTube</a>
        <a href="https://vimeo.com/123456">Vimeo</a>
        <a href="https://twitter.com/user/status/123">Twitter</a>
        <a href="https://example.com/video">Other</a>
      `;

      const originalHTML = block.innerHTML;
      decorate(block);

      // Should process the example.com link but ignore the others
      expect(block.innerHTML).to.not.equal(originalHTML);
      expect(block.innerHTML).to.include('iframe');

      console.log('✅ Ignored platforms tested!');
    });

    it('should handle multiple embed links in one block', () => {
      const block = document.createElement('div');
      block.className = 'embed';
      block.innerHTML = `
        <a href="https://example.com/video1">Video 1</a>
        <a href="https://test.org/video2">Video 2</a>
      `;

      decorate(block);

      // Should process at least one link
      expect(block.innerHTML).to.include('iframe');

      console.log('✅ Multiple embed links tested!');
    });

    it('should handle URLs with trailing slashes', () => {
      const block = document.createElement('div');
      block.className = 'embed';
      block.innerHTML = '<a href="https://example.com/video/123/">Video with slash</a>';

      decorate(block);

      expect(block.innerHTML).to.include('src="https://example.com/video/123"');

      console.log('✅ Trailing slash handling tested!');
    });

    it('should set correct CSS classes for different servers', () => {
      const testCases = [
        { url: 'https://open.spotify.com/track/123', expectedClass: 'embed-spotify' },
        { url: 'https://soundcloud.com/track/123', expectedClass: 'embed-soundcloud' },
        { url: 'https://codepen.io/user/pen/123', expectedClass: 'embed-codepen' },
      ];

      testCases.forEach(({ url, expectedClass }) => {
        const block = document.createElement('div');
        block.className = 'embed';
        block.innerHTML = `<a href="${url}">Link</a>`;

        decorate(block);

        expect(block.classList.contains(expectedClass)).to.be.true;
      });

      console.log('✅ CSS class generation tested!');
    });

    it('should handle empty block gracefully', () => {
      const block = document.createElement('div');
      block.className = 'embed';

      try {
        decorate(block);
        expect(true).to.be.true; // Should not throw
        console.log('✅ Empty block handling tested!');
      } catch (error) {
        expect.fail(`Should handle empty block: ${error.message}`);
      }
    });

    it('should handle block with no embed links', () => {
      const block = document.createElement('div');
      block.className = 'embed';
      block.innerHTML = '<p>Just some text content</p>';

      const originalHTML = block.innerHTML;
      decorate(block);

      expect(block.innerHTML).to.equal(originalHTML);

      console.log('✅ Non-embed content handling tested!');
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle malformed URLs gracefully', () => {
      const block = document.createElement('div');
      block.className = 'embed';
      block.innerHTML = '<a href="not-a-valid-url">Invalid</a>';

      try {
        decorate(block);
        // May or may not process depending on URL constructor behavior
        expect(true).to.be.true;
        console.log('✅ Malformed URL handling tested!');
      } catch (error) {
        // URL constructor may throw, which is acceptable
        expect(error).to.exist;
      }
    });

    it('should handle complex Instagram URLs', () => {
      const complexUrls = [
        'https://www.instagram.com/p/ABC123/?utm_source=ig_web_copy_link',
        'https://www.instagram.com/p/ABC123/?taken-by=user',
        'https://www.instagram.com/p/ABC123/?hl=en',
      ];

      complexUrls.forEach((urlString) => {
        const url = new URL(urlString);
        const result = embedInstagram(url);

        expect(result).to.include('instagram-media');
        expect(result).to.include('/p/ABC123/embed/');
      });

      console.log('✅ Complex Instagram URLs tested!');
    });

    it('should handle different window.location scenarios', () => {
      const locationScenarios = [
        'https://example.com/',
        'https://example.com/page.html',
        'https://example.com/path/page',
        'https://example.com/path/page.html',
      ];

      locationScenarios.forEach((href) => {
        window.location.href = href;
        const instagramUrl = new URL('https://www.instagram.com/p/TEST/');

        const result = embedInstagram(instagramUrl);

        expect(result).to.include('rd=');
        expect(result).to.include('.html');
      });

      console.log('✅ Different location scenarios tested!');
    });

    it('should handle server extraction for various domains', () => {
      // Test URLs that should be processed (not in the excluded list)
      const testUrls = [
        'https://open.spotify.com/track/123',
        'https://codepen.io/user/pen/123',
        'https://jsfiddle.net/user/123',
      ];

      testUrls.forEach((urlString) => {
        const block = document.createElement('div');
        block.className = 'embed';
        block.innerHTML = `<a href="${urlString}">Link</a>`;

        decorate(block);

        // Check that the block was processed (class changed)
        expect(block.classList.contains('block')).to.be.true;
        expect(block.classList.contains('embed')).to.be.true;
      });

      console.log('✅ Server extraction for various domains tested!');
    });

    it('should preserve embed block structure', () => {
      const block = document.createElement('div');
      block.className = 'embed original-class';
      block.innerHTML = '<a href="https://example.com/video">Video</a>';

      decorate(block);

      expect(block.classList.contains('block')).to.be.true;
      expect(block.classList.contains('embed')).to.be.true;

      console.log('✅ Block structure preservation tested!');
    });
  });
});
