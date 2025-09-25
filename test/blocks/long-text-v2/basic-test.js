import { expect } from '@esm-bundle/chai';

await import('../../../express/code/scripts/scripts.js');
const imports = await Promise.all([import('../../../express/code/blocks/long-text-v2/long-text-v2.js')]);
const { default: decorate } = imports[0];

describe('Long Text V2 Basic Test', () => {
  before(() => {
    window.isTestEnv = true;
  });

  it('should exist and be callable', () => {
    expect(decorate).to.be.a('function');
  });

  it('should handle empty blocks', () => {
    const block = document.createElement('div');
    block.className = 'long-text-v2';

    decorate(block);

    const remainingBlock = document.querySelector('.long-text-v2');
    expect(remainingBlock).to.not.exist;
  });

  it('should restructure DOM with single H2 and paragraph', () => {
    const block = document.createElement('div');
    block.className = 'long-text-v2';
    block.innerHTML = `
      <div>
        <div>
          <h2>Test Heading</h2>
          <p>Test paragraph content</p>
        </div>
      </div>
    `;

    decorate(block);

    expect(block).to.exist;
    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(1);

    const article = articles[0];
    const h2 = article.querySelector('h2');
    const p = article.querySelector('p');

    expect(h2).to.exist;
    expect(p).to.exist;
    expect(h2.textContent).to.equal('Test Heading');
    expect(p.textContent).to.equal('Test paragraph content');
  });

  it('should restructure DOM with multiple H2 and paragraph pairs', () => {
    const block = document.createElement('div');
    block.className = 'long-text-v2';
    block.innerHTML = `
      <div>
        <div>
          <h2>First Section</h2>
          <p>First paragraph content</p>
          <h2>Second Section</h2>
          <p>Second paragraph content</p>
        </div>
      </div>
    `;

    decorate(block);

    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(2);

    articles.forEach((article) => {
      const h2 = article.querySelector('h2');
      const p = article.querySelector('p');
      expect(h2).to.exist;
      expect(p).to.exist;
    });
  });

  it('should skip null paragraphs', () => {
    const block = document.createElement('div');
    block.className = 'long-text-v2';
    block.innerHTML = `
      <div>
        <div>
          <h2>Section with null paragraph</h2>
          <p>null</p>
          <p>Valid paragraph content</p>
        </div>
      </div>
    `;

    decorate(block);

    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(1);

    const article = articles[0];
    const h2 = article.querySelector('h2');
    const p = article.querySelector('p');

    expect(h2).to.exist;
    expect(p).to.exist;
    expect(p.textContent).to.not.equal('null');
    expect(p.textContent).to.equal('Valid paragraph content');
  });

  it('should handle blocks with only H2 elements', () => {
    const block = document.createElement('div');
    block.className = 'long-text-v2';
    block.innerHTML = `
      <div>
        <div>
          <h2>First heading only</h2>
          <h2>Second heading only</h2>
        </div>
      </div>
    `;

    decorate(block);

    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(2);

    articles.forEach((article) => {
      const h2 = article.querySelector('h2');
      const p = article.querySelector('p');
      expect(h2).to.exist;
      expect(p).to.not.exist;
    });
  });

  it('should handle blocks with no H2 elements', () => {
    const block = document.createElement('div');
    block.className = 'long-text-v2';
    block.innerHTML = `
      <div>
        <div>
          <p>Just a paragraph</p>
          <p>Another paragraph</p>
        </div>
      </div>
    `;

    decorate(block);

    expect(block).to.exist;
    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(0);
  });

  it('should handle blocks with no children', () => {
    const block = document.createElement('div');
    block.className = 'long-text-v2';

    decorate(block);

    // Block should be removed because it has no children and is empty
    const remainingBlock = document.querySelector('.long-text-v2');
    expect(remainingBlock).to.not.exist;
  });

  it('should handle blocks with empty text content', () => {
    const block = document.createElement('div');
    block.className = 'long-text-v2';
    block.innerHTML = '   '; // Only whitespace

    decorate(block);

    const remainingBlock = document.querySelector('.long-text-v2');
    expect(remainingBlock).to.not.exist;
  });

  it('should handle blocks with only whitespace children', () => {
    const block = document.createElement('div');
    block.className = 'long-text-v2';
    block.innerHTML = '<div>   </div>';

    decorate(block);

    const remainingBlock = document.querySelector('.long-text-v2');
    expect(remainingBlock).to.not.exist;
  });

  it('should handle blocks with H2 but no paragraphs', () => {
    const block = document.createElement('div');
    block.className = 'long-text-v2';
    block.innerHTML = `
      <div>
        <div>
          <h2>Only heading</h2>
        </div>
      </div>
    `;

    decorate(block);

    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(1);

    const article = articles[0];
    const h2 = article.querySelector('h2');
    const p = article.querySelector('p');

    expect(h2).to.exist;
    expect(p).to.not.exist;
  });

  it('should handle blocks with H2 and null paragraph', () => {
    const block = document.createElement('div');
    block.className = 'long-text-v2';
    block.innerHTML = `
      <div>
        <div>
          <h2>Section with null paragraph</h2>
          <p>null</p>
        </div>
      </div>
    `;

    decorate(block);

    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(1);

    const article = articles[0];
    const h2 = article.querySelector('h2');
    const p = article.querySelector('p');

    expect(h2).to.exist;
    expect(p).to.not.exist; // null paragraph should be skipped
  });

  it('should handle blocks with H2 and null paragraph (string null)', () => {
    const block = document.createElement('div');
    block.className = 'long-text-v2';
    block.innerHTML = `
      <div>
        <div>
          <h2>Section with null paragraph</h2>
          <p>null</p>
        </div>
      </div>
    `;

    decorate(block);

    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(1);

    const article = articles[0];
    const h2 = article.querySelector('h2');
    const p = article.querySelector('p');

    expect(h2).to.exist;
    expect(p).to.not.exist; // null paragraph should be skipped
  });

  it('should handle blocks with mixed content (H2, P, other elements)', () => {
    const block = document.createElement('div');
    block.className = 'long-text-v2';
    block.innerHTML = `
      <div>
        <div>
          <h2>Section 1</h2>
          <p>Paragraph 1</p>
          <div>Other content</div>
          <h2>Section 2</h2>
          <p>Paragraph 2</p>
        </div>
      </div>
    `;

    decorate(block);

    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(2);

    // First article should have H2 and P
    const firstArticle = articles[0];
    expect(firstArticle.querySelector('h2')).to.exist;
    expect(firstArticle.querySelector('p')).to.exist;

    // Second article should have H2 and P
    const secondArticle = articles[1];
    expect(secondArticle.querySelector('h2')).to.exist;
    expect(secondArticle.querySelector('p')).to.exist;
  });

  it('should handle blocks with H2 followed by non-paragraph elements', () => {
    const block = document.createElement('div');
    block.className = 'long-text-v2';
    block.innerHTML = `
      <div>
        <div>
          <h2>Section 1</h2>
          <div>Not a paragraph</div>
          <h2>Section 2</h2>
          <span>Also not a paragraph</span>
        </div>
      </div>
    `;

    decorate(block);

    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(2);

    articles.forEach((article) => {
      const h2 = article.querySelector('h2');
      const p = article.querySelector('p');
      expect(h2).to.exist;
      expect(p).to.not.exist; // No paragraphs should be added
    });
  });

  it('should handle blocks with empty paragraphs', () => {
    const block = document.createElement('div');
    block.className = 'long-text-v2';
    block.innerHTML = `
      <div>
        <div>
          <h2>Section with empty paragraph</h2>
          <p></p>
          <p>Valid paragraph</p>
        </div>
      </div>
    `;

    decorate(block);

    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(1);

    const article = articles[0];
    const h2 = article.querySelector('h2');
    const p = article.querySelector('p');

    expect(h2).to.exist;
    expect(p).to.exist;
    expect(p.textContent).to.equal('Valid paragraph');
  });
});
