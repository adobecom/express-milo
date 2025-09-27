/* eslint-env mocha */
/* eslint-disable no-unused-vars */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/long-text/long-text.js'),
]);
const { default: decorate } = imports[1];

const body = await readFile({ path: './mocks/body.html' });
const noLongTextWrapper = await readFile({ path: './mocks/no-long-text-wrapper.html' });
const longTextWrapper = await readFile({ path: './mocks/long-text-wrapper.html' });

describe('Long Text Block', () => {
  before(() => {
    window.isTestEnv = true;
  });

  describe('Basic functionality', () => {
    it('Long Text exists', () => {
      document.body.innerHTML = body;
      const longText = document.querySelector('.long-text');
      expect(longText).to.exist;
    });

    it('Long Text with no wrapper adds wrapper', () => {
      document.body.innerHTML = noLongTextWrapper;
      const longText = document.querySelector('.long-text');
      decorate(longText);
      expect(longText.parentElement.classList.contains('long-text-wrapper')).to.be.true;
    });

    it('Long Text with existing wrapper preserves wrapper', () => {
      document.body.innerHTML = longTextWrapper;
      const longText = document.querySelector('.long-text');
      decorate(longText);
      expect(longText.parentElement.classList.contains('long-text-wrapper')).to.be.true;
    });

    it('Long Text removes empty blocks', () => {
      document.body.innerHTML = '<div class="long-text"></div>';
      const longText = document.querySelector('.long-text');
      decorate(longText);
      expect(document.querySelector('.long-text')).to.not.exist;
    });

    it('Long Text removes null paragraphs', () => {
      document.body.innerHTML = `
        <div class="long-text">
          <p>null</p>
          <p>Valid content</p>
        </div>
      `;
      const longText = document.querySelector('.long-text');
      decorate(longText);
      const paragraphs = longText.querySelectorAll('p');
      expect(paragraphs).to.have.length(1);
      expect(paragraphs[0].textContent).to.equal('Valid content');
    });
  });

  describe('Plain variant', () => {
    it('Plain variant adds plain class to wrapper', () => {
      document.body.innerHTML = `
        <div class="long-text plain">
          <h2>Test Heading</h2>
          <p>Test paragraph</p>
        </div>
      `;
      const longText = document.querySelector('.long-text');
      decorate(longText);
      expect(longText.parentElement.classList.contains('plain')).to.be.true;
    });

    it('Plain variant does not modify DOM structure', () => {
      document.body.innerHTML = `
        <div class="long-text plain">
          <h2>Test Heading</h2>
          <p>Test paragraph</p>
        </div>
      `;
      const longText = document.querySelector('.long-text');
      const originalHTML = longText.innerHTML;
      decorate(longText);
      expect(longText.innerHTML).to.equal(originalHTML);
    });
  });

  describe('No-background variant', () => {
    it('No-background variant adds no-background class to wrapper', () => {
      document.body.innerHTML = `
        <div class="long-text no-background">
          <h2>Test Heading</h2>
          <p>Test paragraph</p>
        </div>
      `;
      const longText = document.querySelector('.long-text');
      decorate(longText);
      expect(longText.parentElement.classList.contains('no-background')).to.be.true;
    });

    it('No-background variant creates article structure with h2', () => {
      document.body.innerHTML = `
        <div class="long-text no-background">
          <h2>Test Heading</h2>
          <p>Test paragraph</p>
        </div>
      `;
      const longText = document.querySelector('.long-text');
      decorate(longText);

      const articles = longText.querySelectorAll('article');
      expect(articles).to.have.length(1);
      
      const article = articles[0];
      expect(article.querySelector('h2')).to.exist;
      expect(article.querySelector('p')).to.exist;
      expect(article.querySelector('h2').textContent).to.equal('Test Heading');
      expect(article.querySelector('p').textContent).to.equal('Test paragraph');
    });

    it('No-background variant creates article structure with h3', () => {
      document.body.innerHTML = `
        <div class="long-text no-background">
          <h3>Test Heading</h3>
          <p>Test paragraph</p>
        </div>
      `;
      const longText = document.querySelector('.long-text');
      decorate(longText);

      const articles = longText.querySelectorAll('article');
      expect(articles).to.have.length(1);
      
      const article = articles[0];
      expect(article.querySelector('h3')).to.exist;
      expect(article.querySelector('p')).to.exist;
    });

    it('No-background variant creates article structure with h4', () => {
      document.body.innerHTML = `
        <div class="long-text no-background">
          <h4>Test Heading</h4>
          <p>Test paragraph</p>
        </div>
      `;
      const longText = document.querySelector('.long-text');
      decorate(longText);

      const articles = longText.querySelectorAll('article');
      expect(articles).to.have.length(1);
      
      const article = articles[0];
      expect(article.querySelector('h4')).to.exist;
      expect(article.querySelector('p')).to.exist;
    });

    it('No-background variant skips null paragraphs', () => {
      document.body.innerHTML = `
        <div class="long-text no-background">
          <h2>Test Heading</h2>
          <p>null</p>
          <p>Valid paragraph</p>
        </div>
      `;
      const longText = document.querySelector('.long-text');
      decorate(longText);

      const articles = longText.querySelectorAll('article');
      expect(articles).to.have.length(1);
      
      const article = articles[0];
      expect(article.querySelector('h2')).to.exist;
      expect(article.querySelector('p')).to.exist;
      expect(article.querySelector('p').textContent).to.equal('Valid paragraph');
    });

    it('No-background variant handles missing heading gracefully', () => {
      document.body.innerHTML = `
        <div class="long-text no-background">
          <p>Test paragraph</p>
        </div>
      `;
      const longText = document.querySelector('.long-text');
      decorate(longText);

      const articles = longText.querySelectorAll('article');
      expect(articles).to.have.length(0);
    });

    it('No-background variant handles missing paragraph gracefully', () => {
      document.body.innerHTML = `
        <div class="long-text no-background">
          <h2>Test Heading</h2>
        </div>
      `;
      const longText = document.querySelector('.long-text');
      decorate(longText);

      const articles = longText.querySelectorAll('article');
      expect(articles).to.have.length(1);
      
      const article = articles[0];
      expect(article.querySelector('h2')).to.exist;
      expect(article.querySelector('p')).to.not.exist;
    });
  });

  describe('Multiple variants', () => {
    it('Plain and no-background variants work together', () => {
      document.body.innerHTML = `
        <div class="long-text plain no-background">
          <h2>Test Heading</h2>
          <p>Test paragraph</p>
        </div>
      `;
      const longText = document.querySelector('.long-text');
      decorate(longText);
      
      expect(longText.parentElement.classList.contains('plain')).to.be.true;
      expect(longText.parentElement.classList.contains('no-background')).to.be.true;
      
      const articles = longText.querySelectorAll('article');
      expect(articles).to.have.length(1);
    });
  });
});
