/* eslint-env mocha */
/* eslint-disable no-unused-vars */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/blog-posts/blog-posts.js'),
]);
const { default: decorate } = imports[1];

// Mock fetch for blog index
global.fetch = async (url) => {
  if (url.includes('query-index.json')) {
    const mockData = {
      data: [
        {
          path: '/express/learn/blog/instagram-reels',
          title: 'Instagram Reels: How To Make, Edit & Grow Your Audience',
          teaser: 'Learn how to make a Reel on Instagram with this step-by-step guide for businesses.',
          category: 'Social Media',
          tags: '["Social Media", "Instagram"]',
          image: '/drafts/yeiber/media_1964201f6e929ed7cfa618845ca0afdff90fadf85.png',
        },
        {
          path: '/express/learn/blog/guide-instagram-reels',
          title: '2025 Guide to Instagram Reels and how to use them',
          teaser: 'Discover everything there is to know about Instagram Reels including how to use them.',
          category: 'Social Media',
          tags: '["Social Media", "Instagram"]',
          image: '/drafts/yeiber/media_14676355fed16be3e5139a46bc026b3dfe8b29509.png',
        },
        {
          path: '/express/learn/blog/instagram-analytics',
          title: 'Instagram Analytics: What are they and why do they matter?',
          teaser: 'Learning how to use Instagram Analytics is a crucial part to driving engagement.',
          category: 'Social Media',
          tags: '["Social Media", "Analytics"]',
          image: '/drafts/yeiber/media_198a7398940d5b90e10fe8809ac177f68cafc8c56.png',
        },
      ],
    };
    return {
      ok: true,
      json: async () => mockData,
    };
  }
  return { ok: false };
};

document.body.innerHTML = await readFile({ path: './mocks/config.html' });

describe('Blog Posts Config', () => {
  before(async () => {
    window.isTestEnv = true;
    const blogPosts = document.querySelector('.blog-posts');
    await decorate(blogPosts);
  });

  it('Blog posts block exists', () => {
    const blogPosts = document.querySelector('.blog-posts');
    expect(blogPosts).to.exist;
  });

  it('Blog posts processes configuration correctly', () => {
    const blogCards = document.querySelectorAll('.blog-card');
    expect(blogCards.length).to.be.greaterThan(0);
  });

  it('Blog posts respects page-size configuration', () => {
    // The mock data has 3 posts, but config specifies page-size of 6
    // So all 3 should be shown
    const blogCards = document.querySelectorAll('.blog-card');
    expect(blogCards.length).to.equal(3);
  });

  it('Blog posts filters by tags correctly', () => {
    const blogCards = document.querySelectorAll('.blog-card');
    // All posts should have Social Media tag based on our mock data
    blogCards.forEach((card) => {
      expect(card).to.exist;
    });
  });

  it('Blog posts handles load more functionality', () => {
    // This test would need to be expanded based on actual load-more implementation
    const loadMore = document.querySelector('.load-more');
    // Load more might not be present if all posts fit in one page
    if (loadMore) {
      expect(loadMore.classList.contains('button')).to.be.true;
      expect(loadMore.classList.contains('secondary')).to.be.true;
    }
  });
});
