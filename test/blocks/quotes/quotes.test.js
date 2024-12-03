/* eslint-env mocha */
/* eslint-disable no-unused-vars */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

await import('../../../expresscode/scripts/scripts.js');
const { default: decorate } = await import(
  '../../../expresscode/blocks/quotes/quotes.js'
);
const body = await readFile({ path: './mocks/body.html' });
const singular = await readFile({ path: './mocks/singular.html' });
const singularMultipleQuoteContent = await readFile({ path: './mocks/singular-multiple.html' });

describe('Quotes', () => {
  before(() => {
    window.isTestEnv = true;
  });

  it('Quotes exists', async () => {
    document.body.innerHTML = body;
    const quotes = document.querySelector('.quotes');
    await decorate(quotes);
    expect(quotes).to.exist;
  });

  it('All direct div children get "quote" class', async () => {
    document.body.innerHTML = body;
    const quotes = document.querySelector('.quotes');
    await decorate(quotes);

    quotes.querySelectorAll(':scope>div').forEach((card) => {
      expect(card.classList.contains('quote')).to.be.true;
    });
  });

  it('Author and summary are well constructed', async () => {
    document.body.innerHTML = body;
    const quotes = document.querySelector('.quotes');
    await decorate(quotes);

    quotes.querySelectorAll(':scope>div').forEach((card) => {
      document.body.innerHTML = body;
      if (card.children.length > 1) {
        const author = card.children[1];
        expect(author.classList.contains('author')).to.be.true;
        expect(author.querySelector('.summary')).to.exist;
      }
    });
  });

  it('First child of each card has "content" class', async () => {
    document.body.innerHTML = body;
    const quotes = document.querySelector('.quotes');
    await decorate(quotes);

    quotes.querySelectorAll(':scope>div').forEach((card) => {
      expect(card.firstElementChild.classList.contains('content')).to.be.true;
    });
  });

  it('Picture is wrapped in div with class "image"', async () => {
    document.body.innerHTML = body;
    const quotes = document.querySelector('.quotes');
    await decorate(quotes);

    const image = document.querySelector('.image');
    expect(image).to.exist;
  });

  it('creates a quotes singular variant block', async () => {
    document.body.innerHTML = singular;
    const quotes = document.querySelector('.quotes');
    await decorate(quotes);

    const quoteContainer = document.querySelector('.quote-container');
    expect(quoteContainer).to.exist;
  });

  it('creates a singular variant with desktop and mobile DOM structures', async () => {
    document.body.innerHTML = singular;
    const quotes = document.querySelector('.quotes');
    await decorate(quotes);

    const desktopContainer = document.querySelector('.quote-container .desktop-container');
    expect(desktopContainer).to.exist;

    const mobileContainer = document.querySelector('.quote-container .mobile-container');
    expect(mobileContainer).to.exist;
  });

  it('creates a singular variant with one and only one quote', async () => {
    document.body.innerHTML = singular;
    const quotes = document.querySelector('.quotes');
    await decorate(quotes);

    const desktopQuote = document.querySelectorAll('.quote-container .desktop-container .quote');
    expect(desktopQuote).to.have.lengthOf(1);

    const mobileQuote = document.querySelectorAll('.quote-container .mobile-container .quote');
    expect(mobileQuote).to.have.lengthOf(1);
  });

  it('creates a singular variant with correct author photo', async () => {
    document.body.innerHTML = singular;
    const quotes = document.querySelector('.quotes');
    await decorate(quotes);

    const desktopAuthorPhoto = document.querySelectorAll('.quote-container .desktop-container .quote .author-photo');
    expect(desktopAuthorPhoto).to.have.lengthOf(1);

    const mobileAuthorPhoto = document.querySelectorAll('.quote-container .mobile-container .quote .author-photo');
    expect(mobileAuthorPhoto).to.have.lengthOf(1);
  });

  it('creates a singular variant with correct quote text', async () => {
    document.body.innerHTML = singular;
    const quotes = document.querySelector('.quotes');
    await decorate(quotes);

    const desktopQuoteText = document.querySelectorAll('.quote-container .desktop-container .quote .quote-comment');
    expect(desktopQuoteText).to.have.lengthOf(1);

    const mobileQuoteText = document.querySelectorAll('.quote-container .mobile-container .quote .quote-comment');
    expect(mobileQuoteText).to.have.lengthOf(1);
  });

  it('creates a singular variant with background', async () => {
    document.body.innerHTML = singular;
    const quotes = document.querySelector('.quotes');
    await decorate(quotes);

    const desktopBackground = document.querySelector('.quote-container .desktop-container .background');
    expect(desktopBackground?.style?.background).to.have.string('url');

    const mobileBackground = document.querySelector('.quote-container .mobile-container .background');
    expect(mobileBackground?.style?.background).to.have.string('url');
  });

  it('creates a singular variant with correct structure when multiple quotes are provided', async () => {
    document.body.innerHTML = singularMultipleQuoteContent;
    const quotes = document.querySelector('.quotes');
    await decorate(quotes);

    const quoteContainer = document.querySelector('.quote-container');
    expect(quoteContainer).to.exist;

    const desktopContainer = document.querySelector('.quote-container .desktop-container');
    expect(desktopContainer).to.exist;

    const mobileContainer = document.querySelector('.quote-container .mobile-container');
    expect(mobileContainer).to.exist;

    const desktopQuote = document.querySelector('.quote-container .desktop-container .quote');
    expect(desktopQuote).to.exist;

    const mobileQuote = document.querySelector('.quote-container .mobile-container .quote');
    expect(mobileQuote).to.exist;
  });

  it('creates a singular variant with only one quote when multiple quotes are provided', async () => {
    document.body.innerHTML = singularMultipleQuoteContent;
    const quotes = document.querySelector('.quotes');
    await decorate(quotes);

    // the following is 1 for desktop and 1 for mobile, so the total is 2

    const quote = document.querySelectorAll('.quotes .quote');
    expect(quote).to.have.lengthOf(2);

    const photo = document.querySelectorAll('.quotes .author-photo');
    expect(photo).to.have.lengthOf(2);

    const text = document.querySelectorAll('.quotes .quote-comment');
    expect(text).to.have.lengthOf(2);
  });
});
