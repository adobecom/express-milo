/* eslint-env mocha */
/* eslint-disable no-unused-vars */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/blog-posts-v2/blog-posts-v2.js'),
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

document.body.innerHTML = await readFile({ path: './mocks/basic.html' });

describe('Blog Posts V2', () => {
  before(async () => {
    window.isTestEnv = true;
    const blogPostsV2 = document.querySelector('.blog-posts-v2');
    await decorate(blogPostsV2);
  });

  it('Blog posts v2 block exists', () => {
    const blogPostsV2 = document.querySelector('.blog-posts-v2');
    expect(blogPostsV2).to.exist;
  });

  it('Blog posts v2 has correct container class', () => {
    const container = document.querySelector('.ax-blog-posts-container');
    expect(container).to.exist;
  });

  it('Blog posts v2 has correct structure', () => {
    expect(document.querySelector('.blog-posts-v2')).to.exist;
    expect(document.querySelector('.blog-cards')).to.exist;
  });

  it('Blog posts v2 creates cards from featured links', async () => {
    const blogCards = document.querySelectorAll('.blog-card, .blog-hero-card');
    expect(blogCards.length).to.be.greaterThan(0);
  });

  it('Blog cards have correct attributes', () => {
    const blogCards = document.querySelectorAll('.blog-card, .blog-hero-card');
    blogCards.forEach((card) => {
      expect(card.tagName.toLowerCase()).to.equal('a');
      expect(card.getAttribute('href')).to.exist;
      expect(card.classList.contains('blog-card') || card.classList.contains('blog-hero-card')).to.be.true;
    });
  });

  it('Blog cards have required content elements', () => {
    const blogCards = document.querySelectorAll('.blog-card, .blog-hero-card');
    blogCards.forEach((card) => {
      expect(card.querySelector('.blog-card-title')).to.exist;
      expect(card.querySelector('.blog-card-teaser')).to.exist;
      expect(card.querySelector('.blog-card-image')).to.exist;
    });
  });

  it('Blog cards have image wrappers and tags', () => {
    const imageWrappers = document.querySelectorAll('.image-wrapper');
    const blogTags = document.querySelectorAll('.blog-tag');

    expect(imageWrappers.length).to.be.greaterThan(0);
    expect(blogTags.length).to.be.greaterThan(0);

    blogTags.forEach((tag) => {
      expect(tag.textContent.trim()).to.equal('Social Media');
    });
  });

  it('Blog cards have images with correct attributes', () => {
    const images = document.querySelectorAll('.blog-card img');
    images.forEach((img) => {
      expect(img.getAttribute('src')).to.exist;
      expect(img.getAttribute('alt')).to.exist;
      expect(img.getAttribute('loading')).to.equal('lazy');
    });
  });

  it('View all link has right chevron', () => {
    const viewAllLink = document.querySelector('.content a');
    expect(viewAllLink).to.exist;
    expect(viewAllLink.querySelector('svg')).to.exist;
  });

  it('Blog posts v2 handles single featured post as hero card', async () => {
    // Create a single featured post scenario
    const singlePostHTML = `
      <div class="section">
        <div class="blog-posts-v2">
          <div>
            <div>
              <a href="https://www.adobe.com/express/learn/blog/instagram-reels">Single Post</a>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.innerHTML = singlePostHTML;

    const blogPostsV2 = document.querySelector('.blog-posts-v2');
    await decorate(blogPostsV2);

    const heroCard = document.querySelector('.blog-hero-card');
    expect(heroCard).to.exist;
  });
});
