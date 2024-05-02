/* eslint-env mocha */
/* eslint-disable no-unused-vars */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

await import('../../../express/scripts/scripts.js');
const { default: decorate } = await import(
  '../../../express/blocks/quotes/quotes.js'
);
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Quotes', () => {
  before(() => {
    window.isTestEnv = true;
  });

  it('Quotes exists', () => {
    const quotes = document.querySelector('.quotes');
    decorate(quotes);
    expect(quotes).to.exist;
  });

  it('All direct div children get "quote" class', () => {
    const quotes = document.querySelector('.quotes');
    decorate(quotes);

    quotes.querySelectorAll(':scope>div').forEach((card) => {
      expect(card.classList.contains('quote')).to.be.true;
    });
  });

  it('Author and summary are well constructed', () => {
    const quotes = document.querySelector('.quotes');
    decorate(quotes);

    quotes.querySelectorAll(':scope>div').forEach((card) => {
      if (card.children.length > 1) {
        const author = card.children[1];
        expect(author.classList.contains('author')).to.be.true;
        expect(author.querySelector('.summary')).to.exist;
      }
    });
  });

  it('First child of each card has "content" class', () => {
    const quotes = document.querySelector('.quotes');
    decorate(quotes);

    quotes.querySelectorAll(':scope>div').forEach((card) => {
      expect(card.firstElementChild.classList.contains('content')).to.be.true;
    });
  });

  it('Picture is wrapped in div with class "image"', () => {
    const quotes = document.querySelector('.quotes');
    decorate(quotes);

    const image = document.querySelector('.image');
    expect(image).to.exist;
  });
});
