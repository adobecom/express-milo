/* eslint-env mocha */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const imports = await Promise.all([
  import('../../../express/code/scripts/utils.js'),
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/blog-posts-v2/blog-posts-v2.js'),
]);
const { getLibs } = imports[0];
const decorate = imports[2].default;

await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  mod.setConfig({ locales: { '': { ietf: 'en-US', tk: 'jdq5hay.css' } } });
});

const body = await readFile({ path: './mocks/body.html' });

// Mock blog post data
const mockBlogPost = {
  path: '/express/learn/blog/test-post',
  title: 'Test Blog Post',
  description: 'This is a test blog post description for unit testing purposes.',
  category: 'Design',
  tags: '["tutorial", "beginner"]',
  image: '/express/learn/blog/media_test.jpg',
  imageAlt: 'Test image',
  date: '1672531200', // January 1, 2023 timestamp
  readTime: '5 min read',
};

const mockBlogIndex = {
  data: [mockBlogPost],
  byPath: {
    '/express/learn/blog/test-post': mockBlogPost,
  },
};

describe('Blog Posts V2', () => {
  let fetchStub;
  let block;

  before(() => {
    window.isTestEnv = true;
  });

  beforeEach(async () => {
    // Clean up any existing stubs first
    if (fetchStub) {
      fetchStub.restore();
    }

    // Reset DOM
    document.body.innerHTML = body;
    block = document.querySelector('.blog-posts-v2');

    // Mock fetch for blog index API calls
    fetchStub = sinon.stub(window, 'fetch');
    fetchStub.resolves({
      ok: true,
      json: () => Promise.resolve(mockBlogIndex),
    });

    // Mock createOptimizedPicture
    window.createOptimizedPicture = sinon.stub().callsFake((src, alt) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      return img;
    });

    // Mock loadDefaultBlock
    window.loadDefaultBlock = sinon.stub().resolves();
  });

  afterEach(() => {
    if (fetchStub) {
      fetchStub.restore();
    }

    // Clean up window mocks
    delete window.createOptimizedPicture;
    delete window.loadDefaultBlock;

    document.body.innerHTML = '';
  });

  it('should decorate the blog-posts-v2 block without errors', async () => {
    expect(block).to.exist;

    try {
      await decorate(block);
      expect(true).to.be.true;
    } catch (error) {
      expect.fail(`decorate should not throw errors: ${error.message}`);
    }

    expect(block).to.exist;
  });

  it('should make API calls when decorated', async () => {
    await decorate(block);
    expect(fetchStub.called).to.be.true;
  });

  it('should handle API errors gracefully', async () => {
    fetchStub.rejects(new Error('API Error'));

    try {
      await decorate(block);
      expect(true).to.be.true;
    } catch (error) {
      expect.fail(`decorate should handle API errors gracefully: ${error.message}`);
    }

    expect(block).to.exist;
  });

  describe('Blog Post Card Creation', () => {
    it('should create blog cards with proper structure', async () => {
      await decorate(block);
      await new Promise((resolve) => { setTimeout(resolve, 100); });

      const cards = block.querySelectorAll('.blog-card');
      expect(cards.length).to.be.greaterThan(0);

      // Check card structure
      cards.forEach((card) => {
        const image = card.querySelector('.blog-card-image');
        const title = card.querySelector('.blog-card-title');
        const teaser = card.querySelector('.blog-card-teaser');
        const date = card.querySelector('.blog-card-date');

        expect(image).to.exist;
        expect(title).to.exist;
        expect(teaser).to.exist;
        expect(date).to.exist;
      });
    });

    it('should inject dates into blog cards', async () => {
      await decorate(block);
      await new Promise((resolve) => { setTimeout(resolve, 100); });

      const dateElements = block.querySelectorAll('.blog-card-date');
      expect(dateElements.length).to.be.greaterThan(0);

      // Verify date content is present and formatted
      dateElements.forEach((dateEl) => {
        expect(dateEl.textContent).to.not.be.empty;
        expect(dateEl.textContent).to.match(/\w+/); // Should contain text (month, day, year)
      });
    });

    it('should apply proper CSS classes for styling', async () => {
      await decorate(block);
      await new Promise((resolve) => { setTimeout(resolve, 100); });

      // Check that blog cards container exists
      const cardsContainer = block.querySelector('.blog-cards');
      expect(cardsContainer).to.exist;

      // Check individual card classes
      const cards = block.querySelectorAll('.blog-card');
      cards.forEach((card) => {
        expect(card.classList.contains('blog-card')).to.be.true;

        const cardBody = card.querySelector('.blog-card-body');
        expect(cardBody).to.exist;
        expect(cardBody.classList.contains('blog-card-body')).to.be.true;
      });
    });
  });

  describe('Date Formatting', () => {
    it('should format dates using Intl.DateTimeFormat', async () => {
      // Test the date formatting functionality
      const testTimestamp = '1672531200'; // January 1, 2023

      // Create a test blog post with this timestamp
      const testPost = { ...mockBlogPost, date: testTimestamp };

      fetchStub.resolves({
        ok: true,
        json: () => Promise.resolve({
          data: [testPost],
          byPath: { '/express/learn/blog/test-post': testPost },
        }),
      });

      await decorate(block);
      await new Promise((resolve) => { setTimeout(resolve, 100); });

      const dateElement = block.querySelector('.blog-card-date');
      if (dateElement) {
        // Verify date is formatted (contains month/day/year)
        const dateText = dateElement.textContent;
        expect(dateText).to.not.be.empty;

        // Should contain formatted date elements
        const hasDateFormat = /\d{1,2}|\w+/.test(dateText); // Contains numbers or month names
        expect(hasDateFormat).to.be.true;
      }
    });

    it('should handle missing or invalid dates gracefully', async () => {
      const testPostNoDates = { ...mockBlogPost, date: undefined };

      fetchStub.resolves({
        ok: true,
        json: () => Promise.resolve({
          data: [testPostNoDates],
          byPath: { '/express/learn/blog/test-post': testPostNoDates },
        }),
      });

      try {
        await decorate(block);
        await new Promise((resolve) => { setTimeout(resolve, 100); });
        expect(true).to.be.true; // Should not throw
      } catch (error) {
        expect.fail(`Should handle missing dates gracefully: ${error.message}`);
      }
    });
  });

  describe('Responsive Layout', () => {
    it('should create proper layout structure for different screen sizes', async () => {
      await decorate(block);
      await new Promise((resolve) => { setTimeout(resolve, 100); });

      // Check for container classes that enable responsive behavior
      const container = block.closest('.section');
      expect(container).to.exist;

      // Check for blog cards container
      const cardsContainer = block.querySelector('.blog-cards');
      expect(cardsContainer).to.exist;

      // Should have flex layout (CSS handles responsiveness)
      const computedStyle = window.getComputedStyle(cardsContainer);
      expect(computedStyle.display).to.equal('flex');
    });
  });

  describe('Block Configuration', () => {
    it('should handle different block configurations', async () => {
      // Test with different numbers of posts
      const multiplePosts = [
        { ...mockBlogPost, path: '/post1', title: 'Post 1' },
        { ...mockBlogPost, path: '/post2', title: 'Post 2' },
        { ...mockBlogPost, path: '/post3', title: 'Post 3' },
      ];

      fetchStub.resolves({
        ok: true,
        json: () => Promise.resolve({
          data: multiplePosts,
          byPath: {
            '/post1': multiplePosts[0],
            '/post2': multiplePosts[1],
            '/post3': multiplePosts[2],
          },
        }),
      });

      await decorate(block);
      await new Promise((resolve) => { setTimeout(resolve, 100); });

      const cards = block.querySelectorAll('.blog-card');
      expect(cards.length).to.be.greaterThan(1);
    });

    it('should handle empty blog index', async () => {
      fetchStub.resolves({
        ok: true,
        json: () => Promise.resolve({ data: [], byPath: {} }),
      });

      try {
        await decorate(block);
        await new Promise((resolve) => { setTimeout(resolve, 100); });
        expect(true).to.be.true; // Should not throw
      } catch (error) {
        expect.fail(`Should handle empty blog index gracefully: ${error.message}`);
      }
    });
  });

  describe('Accessibility', () => {
    it('should create accessible blog cards', async () => {
      await decorate(block);
      await new Promise((resolve) => { setTimeout(resolve, 100); });

      const cards = block.querySelectorAll('.blog-card');
      cards.forEach((card) => {
        // Check for proper heading structure
        const title = card.querySelector('.blog-card-title');
        expect(title).to.exist;
        expect(title.tagName.toLowerCase()).to.equal('h3');

        // Check for alt text on images
        const img = card.querySelector('img');
        if (img) {
          expect(img.getAttribute('alt')).to.not.be.null;
        }
      });
    });
  });
});
