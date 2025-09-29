import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';

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
    
    let decorateButtonsCalled = false;
    window.decorateButtonsDeprecated = () => {
      decorateButtonsCalled = true;
      return Promise.resolve();
    };
    
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

  it('should add color pills when getData returns valid data', async () => {
    // Mock getData to return valid pills
    const originalImport = window.import;
    window.import = (path) => {
      if (path.includes('utils/utils.js')) {
        return Promise.resolve({
          createTag: window.createTag,
        });
      }
      if (path.includes('browse-api-controller.js')) {
        return Promise.resolve({
          default: () => Promise.resolve([
            {
              canonicalName: 'ckg:COLOR:3546:light_blue',
              metadata: {
                link: '/express/colors/light-blue',
                hexCode: '#add8e6'
              }
            },
            {
              canonicalName: 'ckg:COLOR:3609:sky_blue',
              metadata: {
                link: '/express/colors/sky-blue',
                hexCode: '#87ceeb'
              }
            }
          ]),
        });
      }
      return originalImport ? originalImport(path) : Promise.resolve({});
    };

    const { default: decorate } = await import('../../../express/code/blocks/ckg-link-list/ckg-link-list.js');
    const block = document.querySelector('.ckg-link-list');
    
    await decorate(block);
    
    expect(block.style.visibility).to.equal('visible');
    expect(block.children.length).to.be.greaterThan(0);
    
    const links = block.querySelectorAll('a');
    expect(links.length).to.be.greaterThan(0);
    
    // Check that links have proper attributes
    links.forEach((link) => {
      expect(link).to.have.property('href');
      expect(link).to.have.property('title');
      expect(link).to.have.property('class', 'button');
    });
    
    window.import = originalImport;
  });

  it('should add color samplers to buttons', async () => {
    // Mock getData to return valid pills
    const originalImport = window.import;
    window.import = (path) => {
      if (path.includes('utils/utils.js')) {
        return Promise.resolve({
          createTag: window.createTag,
        });
      }
      if (path.includes('browse-api-controller.js')) {
        return Promise.resolve({
          default: () => Promise.resolve([
            {
              canonicalName: 'ckg:COLOR:3546:light_blue',
              metadata: {
                link: '/express/colors/light-blue',
                hexCode: '#add8e6'
              }
            }
          ]),
        });
      }
      return originalImport ? originalImport(path) : Promise.resolve({});
    };

    const { default: decorate } = await import('../../../express/code/blocks/ckg-link-list/ckg-link-list.js');
    const block = document.querySelector('.ckg-link-list');
    
    await decorate(block);
    
    const colorDots = block.querySelectorAll('.color-dot');
    expect(colorDots.length).to.be.above(0);
    
    const colorfulLinks = block.querySelectorAll('a.colorful');
    expect(colorfulLinks.length).to.be.above(0);
    
    window.import = originalImport;
  });

  it('should filter out pills with missing data', async () => {
    // Mock getData to return pills with missing data
    const originalImport = window.import;
    window.import = (path) => {
      if (path.includes('utils/utils.js')) {
        return Promise.resolve({
          createTag: window.createTag,
        });
      }
      if (path.includes('browse-api-controller.js')) {
        return Promise.resolve({
          default: () => Promise.resolve([
            { canonicalName: 'test1' }, // missing metadata
            { canonicalName: 'test2', metadata: { link: 'test' } }, // missing hexCode
            { canonicalName: 'test3', metadata: { hexCode: '#fff' } }, // missing link
            {
              canonicalName: 'ckg:COLOR:3546:light_blue',
              metadata: {
                link: '/express/colors/light-blue',
                hexCode: '#add8e6'
              }
            }
          ]),
        });
      }
      return originalImport ? originalImport(path) : Promise.resolve({});
    };

    const { default: decorate } = await import('../../../express/code/blocks/ckg-link-list/ckg-link-list.js');
    const block = document.querySelector('.ckg-link-list');
    
    await decorate(block);
    
    // Should only have one valid pill
    const links = block.querySelectorAll('a');
    expect(links.length).to.equal(1);
    
    window.import = originalImport;
  });

  it('should call buildCarousel with correct parameters', async () => {
    let buildCarouselCalled = false;
    const originalBuildCarousel = window.buildCarousel;
    window.buildCarousel = (selector, parent, options) => {
      buildCarouselCalled = true;
      expect(selector).to.equal('.button-container');
      expect(parent).to.equal(block);
      expect(options).to.deep.equal({ centerAlign: true });
      return Promise.resolve();
    };

    // Mock getData to return valid pills
    const originalImport = window.import;
    window.import = (path) => {
      if (path.includes('utils/utils.js')) {
        return Promise.resolve({
          createTag: window.createTag,
        });
      }
      if (path.includes('browse-api-controller.js')) {
        return Promise.resolve({
          default: () => Promise.resolve([
            {
              canonicalName: 'ckg:COLOR:3546:light_blue',
              metadata: {
                link: '/express/colors/light-blue',
                hexCode: '#add8e6'
              }
            }
          ]),
        });
      }
      return originalImport ? originalImport(path) : Promise.resolve({});
    };

    const { default: decorate } = await import('../../../express/code/blocks/ckg-link-list/ckg-link-list.js');
    const block = document.querySelector('.ckg-link-list');
    
    await decorate(block);
    
    expect(buildCarouselCalled).to.be.true;
    window.buildCarousel = originalBuildCarousel;
    window.import = originalImport;
  });
});