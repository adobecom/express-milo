/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const [, { default: decorate }] = await Promise.all([
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/blog-article-marquee/blog-article-marquee.js'),
]);

const base = await readFile({ path: './mocks/base.html' });

const META_FIXTURES = {
  'blog-article-eyebrow': 'Metadata Eyebrow',
  'blog-article-title': 'Bring your product story to life',
  'blog-article-subheading': 'Launch campaigns faster with ready-to-use assets and reusable creative systems.',
  'blog-article-product-name': 'Adobe Express Metadata',
  'blog-article-date': 'October 02, 2024',
  'blog-article-description': 'Unlock premium templates, fonts, and collaboration tools built for creative teams.',
};

const applyMetaFixtures = (fixtures) => Object.entries(fixtures).map(([name, content]) => {
  const selector = name.includes(':') ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let meta = document.head.querySelector(selector);
  if (meta) {
    const previousContent = meta.getAttribute('content');
    meta.setAttribute('content', content);
    return { element: meta, previousContent, created: false, selector };
  }
  meta = document.createElement('meta');
  const attr = name.includes(':') ? 'property' : 'name';
  meta.setAttribute(attr, name);
  meta.setAttribute('content', content);
  document.head.append(meta);
  return { element: meta, previousContent: null, created: true, selector };
});

const restoreMetaFixtures = (state) => {
  state.forEach(({ element, previousContent, created, selector }) => {
    const meta = element?.isConnected ? element : document.head.querySelector(selector);
    if (!meta) return;
    if (created) {
      meta.remove();
    } else if (previousContent !== null && previousContent !== undefined) {
      meta.setAttribute('content', previousContent);
    } else {
      meta.removeAttribute('content');
    }
  });
};

describe('Blog Article Marquee block', () => {
  let metaState = [];

  beforeEach(() => {
    metaState = applyMetaFixtures(META_FIXTURES);
    document.body.innerHTML = base;
  });

  afterEach(() => {
    restoreMetaFixtures(metaState);
    metaState = [];
    document.body.innerHTML = '';
  });

  it('decorates marquee content from metadata and positions CTA', async () => {
    const block = document.getElementById('blog-article-marquee-block');
    await decorate(block);

    const wrapper = block.querySelector('.blog-article-marquee-inner');
    expect(wrapper).to.exist;
    const rows = wrapper.querySelectorAll(':scope > div');
    expect(rows.length).to.equal(1);

    const expectedProductName = META_FIXTURES['blog-article-product-name'];
    const expectedProductDate = META_FIXTURES['blog-article-date'];
    const expectedEyebrow = META_FIXTURES['blog-article-eyebrow'];
    const expectedSubcopy = META_FIXTURES['blog-article-subheading'];
    const expectedHeadline = META_FIXTURES['blog-article-title'];
    const expectedProductCopy = META_FIXTURES['blog-article-description'];

    const product = block.querySelector('.blog-article-marquee-product');
    expect(product).to.exist;
    const productHeading = product.querySelector('.blog-article-marquee-product-name');
    expect(productHeading).to.exist;
    expect(productHeading.textContent).to.equal(expectedProductName);
    const productCopyParas = [...product.querySelectorAll('.blog-article-marquee-product-copy p')]
      .filter((p) => !p.classList.contains('blog-article-marquee-product-name')
        && !p.classList.contains('blog-article-marquee-product-date'))
      .map((p) => p.textContent.trim());
    expect(productCopyParas).to.deep.equal([expectedProductCopy]);
    const productDate = product.querySelector('.blog-article-marquee-product-date');
    expect(productDate).to.exist;
    expect(productDate.textContent.trim()).to.equal(expectedProductDate);
    const productLogoWrapper = product.querySelector('.blog-article-marquee-product-media');
    expect(productLogoWrapper).to.exist;
    const productLogo = productLogoWrapper.querySelector('img');
    expect(productLogo).to.exist;
    expect(productLogo.getAttribute('src')).to.equal('/express/code/blocks/blog-article-marquee/adobe.webp');
    expect(productLogo.getAttribute('alt')).to.equal(`${expectedProductName} logo`);
    expect(productLogo.getAttribute('loading')).to.equal('lazy');
    expect(productLogo.getAttribute('decoding')).to.equal('async');
    expect(productLogo.getAttribute('width')).to.equal('48');
    expect(productLogo.getAttribute('height')).to.equal('48');
    expect(productLogo.hasAttribute('fetchpriority')).to.be.false;

    const eyebrow = block.querySelector('.blog-article-marquee-eyebrow');
    expect(eyebrow).to.exist;
    expect(eyebrow.textContent.trim()).to.equal(expectedEyebrow);

    const headline = block.querySelector('.blog-article-marquee-content h1');
    expect(headline).to.exist;
    expect(headline.textContent.trim()).to.equal(expectedHeadline);

    const subcopy = block.querySelector('.blog-article-marquee-subcopy');
    expect(subcopy).to.exist;
    expect(subcopy.textContent.trim()).to.equal(expectedSubcopy);

    const buttonContainer = block.querySelector('.button-container');
    expect(buttonContainer).to.exist;

    const contentColumn = block.querySelector('.blog-article-marquee-content');
    const highlightWrapper = contentColumn.querySelector('.blog-article-marquee-products');
    expect(highlightWrapper).to.exist;
    expect(subcopy.nextElementSibling).to.equal(highlightWrapper);
    expect(highlightWrapper.nextElementSibling).to.equal(buttonContainer);

    const mediaImg = block.querySelector('.blog-article-marquee-media img');
    expect(mediaImg).to.exist;
    expect(mediaImg.getAttribute('loading')).to.equal('eager');
    expect(mediaImg.getAttribute('fetchpriority')).to.equal('high');
    expect(mediaImg.getAttribute('decoding')).to.equal('async');
    expect(mediaImg.getAttribute('src')).to.contain('width=');
    expect(Number(mediaImg.getAttribute('width'))).to.be.greaterThan(0);
  });

  it('omits eyebrow when metadata value is empty', async () => {
    const block = document.getElementById('blog-article-marquee-block');
    const eyebrowMeta = document.head.querySelector('meta[name="blog-article-eyebrow"]');
    eyebrowMeta?.setAttribute('content', '');

    await decorate(block);

    const decoratedEyebrow = block.querySelector('.blog-article-marquee-eyebrow');
    expect(decoratedEyebrow).to.not.exist;
  });

  it('handles marquee without optional CTA row', async () => {
    const block = document.getElementById('blog-article-marquee-block');
    block.lastElementChild.remove();
    await decorate(block);

    const highlight = block.querySelector('.blog-article-marquee-products');
    expect(highlight).to.exist;
    const buttonContainer = block.querySelector('.button-container');
    expect(buttonContainer).to.not.exist;
  });

  it('omits product highlight when product metadata is absent', async () => {
    const block = document.getElementById('blog-article-marquee-block');
    ['blog-article-product-name', 'blog-article-date', 'blog-article-description']
      .forEach((metaName) => {
        const meta = document.head.querySelector(`meta[name="${metaName}"]`);
        meta?.setAttribute('content', '');
      });

    await decorate(block);

    const highlight = block.querySelector('.blog-article-marquee-products');
    expect(highlight).to.not.exist;
  });
});
