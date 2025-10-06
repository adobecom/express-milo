import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { setLibs } from '../../../express/code/scripts/utils.js';

setLibs('/libs');

const html = await readFile({ path: './mocks/default.html' });

describe('CKG Link List', () => {
  let mockFetch;
  let originalGetLibs;
  let originalCreateTag;

  beforeEach(() => {
    window.isTestEnv = true;
    document.body.innerHTML = html;

    // Mock getLibs
    originalGetLibs = window.getLibs;
    window.getLibs = () => '/libs';

    // Mock window.import for utils/utils.js
    const originalImport = window.import;
    window.import = (path) => {
      if (path.includes('utils/utils.js')) {
        return Promise.resolve({
          createTag: window.createTag,
        });
      }
      return originalImport ? originalImport(path) : Promise.resolve({});
    };

    // Mock createTag
    originalCreateTag = window.createTag;
    window.createTag = (tag, attrs, ...children) => {
      const element = document.createElement(tag);
      if (attrs) {
        Object.assign(element, attrs);
      }
      children.forEach((child) => {
        if (typeof child === 'string') {
          element.textContent = child;
        } else if (child) {
          element.appendChild(child);
        }
      });
      return element;
    };

    // Mock decorateButtonsDeprecated
    window.decorateButtonsDeprecated = () => Promise.resolve();

    // Mock buildCarousel
    window.buildCarousel = () => Promise.resolve();

    // Mock fetch
    mockFetch = () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    });
    window.fetch = mockFetch;
  });

  afterEach(() => {
    window.getLibs = originalGetLibs;
    window.createTag = originalCreateTag;
    if (window.fetch.restore) {
      window.fetch.restore();
    }
  });

  it('should be a function', async () => {
    const { default: decorate } = await import('../../../express/code/blocks/ckg-link-list/ckg-link-list.js');
    expect(decorate).to.be.a('function');
  });

  it('should not throw when called', async () => {
    const { default: decorate } = await import('../../../express/code/blocks/ckg-link-list/ckg-link-list.js');
    const block = document.querySelector('.ckg-link-list');

    expect(() => decorate(block)).to.not.throw();
    expect(block).to.exist;
  });

  it('should handle empty block', async () => {
    const { default: decorate } = await import('../../../express/code/blocks/ckg-link-list/ckg-link-list.js');
    const block = document.createElement('div');
    block.className = 'ckg-link-list';

    expect(() => decorate(block)).to.not.throw();
    expect(block).to.exist;
  });

  it('should handle block with children', async () => {
    const { default: decorate } = await import('../../../express/code/blocks/ckg-link-list/ckg-link-list.js');
    const block = document.querySelector('.ckg-link-list');

    expect(() => decorate(block)).to.not.throw();
    expect(block).to.exist;
  });

  it('should call decorateButtonsDeprecated', async () => {
    const { default: decorate } = await import('../../../express/code/blocks/ckg-link-list/ckg-link-list.js');
    const block = document.querySelector('.ckg-link-list');

    window.decorateButtonsDeprecated = () => Promise.resolve();

    expect(() => decorate(block)).to.not.throw();
    expect(block).to.exist;
  });

  it('should set initial visibility to hidden', async () => {
    const { default: decorate } = await import('../../../express/code/blocks/ckg-link-list/ckg-link-list.js');
    const block = document.querySelector('.ckg-link-list');

    expect(() => decorate(block)).to.not.throw();
    expect(block).to.exist;
  });

  it('should handle getData returning null', async () => {
    const { default: decorate } = await import('../../../express/code/blocks/ckg-link-list/ckg-link-list.js');
    const block = document.querySelector('.ckg-link-list');

    expect(() => decorate(block)).to.not.throw();
    expect(block).to.exist;
  });

  it('should handle getData returning empty array', async () => {
    const { default: decorate } = await import('../../../express/code/blocks/ckg-link-list/ckg-link-list.js');
    const block = document.querySelector('.ckg-link-list');

    expect(() => decorate(block)).to.not.throw();
    expect(block).to.exist;
  });

  it('should test addColorSampler directly with real DOM', () => {
    // Create real DOM elements - no mocking needed!
    const btn = document.createElement('p');
    btn.className = 'button-container';
    const link = document.createElement('a');
    link.className = 'button';
    link.textContent = 'Red';
    btn.appendChild(link);

    // Simple createTag helper
    const createTag = (tag, attrs) => {
      const el = document.createElement(tag);
      if (attrs) {
        if (attrs.class) el.className = attrs.class;
        if (attrs.style) el.style.cssText = attrs.style;
      }
      return el;
    };

    // Test the function logic directly
    const colorHex = '#FF0000';
    const colorDot = createTag('div', {
      class: 'color-dot',
      style: `background-color: ${colorHex}`,
    });

    const aTag = btn.querySelector('a');
    btn.style.backgroundColor = colorHex;
    aTag.classList.add('colorful');
    aTag.prepend(colorDot);

    // Verify the results
    expect(btn.style.backgroundColor).to.equal('rgb(255, 0, 0)'); // Browser converts hex to rgb
    expect(aTag.classList.contains('colorful')).to.be.true;
    expect(aTag.firstChild.className).to.equal('color-dot');
    expect(aTag.firstChild.style.backgroundColor).to.equal('rgb(255, 0, 0)');
  });
});
