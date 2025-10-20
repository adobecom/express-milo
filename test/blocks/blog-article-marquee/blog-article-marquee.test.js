/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const [, { default: decorate }] = await Promise.all([
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/blog-article-marquee/blog-article-marquee.js'),
]);

const base = await readFile({ path: './mocks/base.html' });
const multipleProducts = await readFile({ path: './mocks/multiple-products.html' });

describe('Blog Article Marquee block', () => {
  beforeEach(() => {
    document.body.innerHTML = base;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('decorates marquee content and converts product row into highlight', async () => {
    const block = document.getElementById('blog-article-marquee-block');
    await decorate(block);

    const wrapper = block.querySelector('.blog-article-marquee-inner');
    expect(wrapper).to.exist;
    const rows = wrapper.querySelectorAll(':scope > div');
    expect(rows.length).to.equal(1);

    const product = block.querySelector('.blog-article-marquee-product');
    expect(product).to.exist;
    const productHeading = product.querySelector('.blog-article-marquee-product-name');
    expect(productHeading).to.exist;
    expect(productHeading.textContent).to.equal('Adobe Express');
    const productCopyParas = [...product.querySelectorAll('.blog-article-marquee-product-copy p')].map((p) => p.textContent.trim());
    expect(productCopyParas).to.deep.equal([
      'Unlock premium templates, fonts, and collaboration tools built for creative teams.',
      'September 29, 2024',
    ]);
    const productImg = product.querySelector('.blog-article-marquee-product-media img');
    expect(productImg).to.exist;
    expect(productImg.getAttribute('loading')).to.equal('lazy');
    expect(productImg.getAttribute('decoding')).to.equal('async');
    expect(productImg.hasAttribute('fetchpriority')).to.be.false;
    expect(productImg.getAttribute('src')).to.contain('width=');
    expect(Number(productImg.getAttribute('width'))).to.be.greaterThan(0);

    const buttonContainer = block.querySelector('.button-container');
    expect(buttonContainer).to.exist;

    const contentColumn = block.querySelector('.blog-article-marquee-content');
    const highlightWrapper = contentColumn.querySelector('.blog-article-marquee-products');
    expect(highlightWrapper).to.exist;
    const subcopyParagraph = contentColumn.querySelector('p');
    expect(subcopyParagraph.nextElementSibling).to.equal(highlightWrapper);
    expect(highlightWrapper.nextElementSibling).to.equal(buttonContainer);

    const mediaImg = block.querySelector('.blog-article-marquee-media img');
    expect(mediaImg).to.exist;
    expect(mediaImg.getAttribute('loading')).to.equal('eager');
    expect(mediaImg.getAttribute('fetchpriority')).to.equal('high');
    expect(mediaImg.getAttribute('decoding')).to.equal('async');
    expect(mediaImg.getAttribute('src')).to.contain('width=');
    expect(Number(mediaImg.getAttribute('width'))).to.be.greaterThan(0);
  });

  it('adds eyebrow styling to paragraph preceding headline', async () => {
    const block = document.getElementById('blog-article-marquee-block');
    const heading = block.querySelector('h1');
    const eyebrow = document.createElement('p');
    eyebrow.textContent = 'Featured category';
    heading.parentElement.insertBefore(eyebrow, heading);

    await decorate(block);

    const decoratedEyebrow = block.querySelector('.blog-article-marquee-eyebrow');
    expect(decoratedEyebrow).to.exist;
    expect(decoratedEyebrow.textContent.trim()).to.equal('Featured category');
  });

  it('handles marquee without optional product row', async () => {
    const block = document.getElementById('blog-article-marquee-block');
    block.lastElementChild.remove();
    await decorate(block);

    const highlight = block.querySelector('.blog-article-marquee-products');
    expect(highlight).to.not.exist;
    const headline = block.querySelector('.blog-article-marquee-content h1');
    expect(headline?.textContent.trim()).to.equal('Bring your product story to life');

    const mediaImg = block.querySelector('.blog-article-marquee-media img');
    expect(mediaImg?.getAttribute('loading')).to.equal('eager');
    expect(mediaImg?.getAttribute('fetchpriority')).to.equal('high');
  });

  it('collapses extra product rows and maintains highlight placement', async () => {
    document.body.innerHTML = multipleProducts;

    const block = document.getElementById('blog-article-marquee-block');
    await decorate(block);

    const inner = block.querySelector('.blog-article-marquee-inner');
    expect(inner).to.exist;
    expect([...inner.children].filter((child) => child.tagName === 'DIV').length).to.equal(1);

    const highlight = block.querySelector('.blog-article-marquee-products');
    expect(highlight).to.exist;

    const productNames = [...highlight.querySelectorAll('.blog-article-marquee-product-name')]
      .map((heading) => heading.textContent.trim());
    expect(productNames).to.deep.equal(['Adobe Express']);

    const buttonContainer = block.querySelector('.blog-article-marquee-content .button-container');
    expect(buttonContainer).to.exist;
    expect(highlight.nextElementSibling).to.equal(buttonContainer);

    const removedProduct = block.querySelector('.blog-article-marquee-inner h2:nth-of-type(2)');
    expect(removedProduct).to.not.exist;
  });
});
