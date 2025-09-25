import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

await import('../../../express/code/scripts/scripts.js');
const imports = await Promise.all([import('../../../express/code/blocks/long-text-v2/long-text-v2.js')]);
const { default: decorate } = imports[0];

const bodyWithContent = await readFile({ path: './mocks/body-with-content.html' });
const bodyWithMultipleH2s = await readFile({ path: './mocks/body-with-multiple-h2s.html' });
const bodyEmpty = await readFile({ path: './mocks/body-empty.html' });
const bodyWithNullParagraphs = await readFile({ path: './mocks/body-with-null-paragraphs.html' });
const bodyWithPlainClass = await readFile({ path: './mocks/body-with-plain-class.html' });
const bodyOnlyH2s = await readFile({ path: './mocks/body-only-h2s.html' });
const bodyOnlyParagraphs = await readFile({ path: './mocks/body-only-paragraphs.html' });

describe('Long Text V2', () => {
  before(() => {
    window.isTestEnv = true;
  });

  it('should exist and be callable', () => {
    expect(decorate).to.be.a('function');
  });

  it('should restructure DOM with single H2 and paragraph', () => {
    document.body.innerHTML = bodyWithContent;
    const block = document.querySelector('.long-text-v2');

    decorate(block);

    expect(block).to.exist;
    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(1);

    const article = articles[0];
    const h2 = article.querySelector('h2');
    const p = article.querySelector('p');

    expect(h2).to.exist;
    expect(p).to.exist;
    expect(h2.textContent).to.include('Bring your data back to life');
    expect(p.textContent).to.include('Use Adobe Express powerful photo effects');
  });

  it('should restructure DOM with multiple H2 and paragraph pairs', () => {
    document.body.innerHTML = bodyWithMultipleH2s;
    const block = document.querySelector('.long-text-v2');

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

  it('should remove empty blocks', () => {
    document.body.innerHTML = bodyEmpty;
    const block = document.querySelector('.long-text-v2');

    decorate(block);

    const remainingBlock = document.querySelector('.long-text-v2');
    expect(remainingBlock).to.not.exist;
  });

  it('should handle blocks with no H2 elements', () => {
    document.body.innerHTML = bodyOnlyParagraphs;
    const block = document.querySelector('.long-text-v2');

    decorate(block);

    expect(block).to.exist;
    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(0);
  });

  it('should handle blocks with only H2 elements', () => {
    document.body.innerHTML = bodyOnlyH2s;
    const block = document.querySelector('.long-text-v2');

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

  it('should skip null paragraphs', () => {
    document.body.innerHTML = bodyWithNullParagraphs;
    const block = document.querySelector('.long-text-v2');

    decorate(block);

    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(1);

    const article = articles[0];
    const h2 = article.querySelector('h2');
    const p = article.querySelector('p');

    expect(h2).to.exist;
    expect(p).to.exist;
    expect(p.textContent).to.not.equal('null');
    expect(p.textContent).to.include('Valid paragraph content');
  });

  it('should handle plain class blocks', () => {
    document.body.innerHTML = bodyWithPlainClass;
    const block = document.querySelector('.long-text-v2');

    decorate(block);

    expect(block).to.exist;
    expect(block.classList.contains('plain')).to.be.true;

    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(1);
  });

  it('should handle blocks with nested content', () => {
    const html = `
      <div class="long-text-v2">
        <div>
          <div>
            <h2>Nested H2</h2>
            <p>Nested paragraph</p>
          </div>
        </div>
      </div>
    `;
    document.body.innerHTML = html;
    const block = document.querySelector('.long-text-v2');

    decorate(block);

    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(1);

    const article = articles[0];
    const h2 = article.querySelector('h2');
    const p = article.querySelector('p');

    expect(h2).to.exist;
    expect(p).to.exist;
    expect(h2.textContent).to.equal('Nested H2');
    expect(p.textContent).to.equal('Nested paragraph');
  });

  it('should handle mixed content with non-H2/P elements', () => {
    const html = `
      <div class="long-text-v2">
        <div>
          <h1>Main heading</h1>
          <h2>Section heading</h2>
          <p>Section content</p>
          <div>Some div content</div>
          <h2>Another section</h2>
          <p>Another paragraph</p>
        </div>
      </div>
    `;
    document.body.innerHTML = html;
    const block = document.querySelector('.long-text-v2');

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

  it('should handle edge case with empty string content', () => {
    const html = `
      <div class="long-text-v2">
        <div>
          <h2>  </h2>
          <p>  </p>
        </div>
      </div>
    `;
    document.body.innerHTML = html;
    const block = document.querySelector('.long-text-v2');

    decorate(block);

    const articles = block.querySelectorAll('article');
    expect(articles).to.have.length(1);

    const article = articles[0];
    const h2 = article.querySelector('h2');
    const p = article.querySelector('p');

    expect(h2).to.exist;
    expect(p).to.exist;
  });

  it('should handle blocks with no children', () => {
    const html = '<div class="long-text-v2"></div>';
    document.body.innerHTML = html;
    const block = document.querySelector('.long-text-v2');

    decorate(block);

    const remainingBlock = document.querySelector('.long-text-v2');
    expect(remainingBlock).to.not.exist;
  });
});
