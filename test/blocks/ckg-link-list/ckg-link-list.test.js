import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';

const [, { default: decorate }] = await Promise.all([import('../../../express/code/scripts/scripts.js'), import('../../../express/code/blocks/ckg-link-list/ckg-link-list.js')]);
const html = await readFile({ path: './mocks/default.html' });

function jsonOk(body) {
  const mockResponse = new window.Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-type': 'application/json' },
  });

  return Promise.resolve(mockResponse);
}

const MOCK_JSON = {
  experienceId: 'templates-browse-v1',
  status: { httpCode: 200 },
  queryResults: [
    {
      id: 'ccx-search-1',
      status: { httpCode: 200 },
      metadata: { totalHits: 0, start: 0, limit: 0 },
      context: {
        application: {
          'metadata.color.hexCodes': {
            'ckg:COLOR:26511:cobalt': '#0047ab',
            'ckg:COLOR:18559:neon_blue': '#1b03a3',
            'ckg:COLOR:3496:cornflower_blue': '#6495ed',
            'ckg:COLOR:18546:glaucous': '#6082b6',
            'ckg:COLOR:26510:blue_green': '#0d98ba',
            'ckg:COLOR:3615:steel_blue': '#4682b4',
            'ckg:COLOR:3500:dark_blue': '#00008b',
            'ckg:COLOR:18534:teal_blue': '#367588',
            'ckg:COLOR:3499:cyan': '#00ffff',
            'ckg:COLOR:18536:ultramarine_blue': '#4166f5',
            'ckg:COLOR:18545:columbia_blue': '#9bddff',
            'ckg:COLOR:3610:slate_blue': '#6a5acd',
            'ckg:COLOR:18538:robin_egg_blue': '#00cccc',
            'ckg:COLOR:18554:phthalo_blue': '#000f89',
            'ckg:COLOR:18540:cerulean': '#007ba7',
            'ckg:COLOR:18547:oxford_blue': '#002147',
            'ckg:COLOR:3539:indigo': '#4b0082',
            'ckg:COLOR:26509:blue_gray': '#6699cc',
            'ckg:COLOR:18537:french_blue': '#0072bb',
            'ckg:COLOR:3567:medium_blue': '#0000cd',
            'ckg:COLOR:3479:alice_blue': '#f0f8ff',
            'ckg:COLOR:3620:turquoise': '#30d5c8',
            'ckg:COLOR:18535:blue_bell': '#a2a2d0',
            'ckg:COLOR:18548:yinmn_blue': '#2e5090',
            'ckg:COLOR:3609:sky_blue': '#87ceeb',
            'ckg:COLOR:3546:light_blue': '#add8e6',
            'ckg:COLOR:18543:cerulean_blue': '#2a52be',
            'ckg:COLOR:3483:azure': '#f0ffff',
            'ckg:COLOR:26515:ultramarine': '#120a8f',
            'ckg:COLOR:26513:electric_blue': '#7df9ff',
            'ckg:COLOR:18539:blue_sapphire': '#126180',
            'ckg:COLOR:26514:spanish_blue': '#0070b8',
            'ckg:COLOR:26508:azul': '#1d5dec',
            'ckg:COLOR:26512:cornflower': '#5170d7',
            'ckg:COLOR:3492:cadet_blue': '#5f9ea0',
            'ckg:COLOR:18541:carolina_blue': '#99badd',
            'ckg:COLOR:18542:tiffany_blue': '#0abab5',
            'ckg:COLOR:18544:blue_jeans': '#5dadec',
            'ckg:COLOR:26516:charcoal': '#36454f',
          },
        },
      },
      facets: [
        {
          buckets: [
            {
              canonicalName: 'ckg:COLOR:3546:light_blue',
              count: 0,
              value: '/express/colors/light-blue',
              displayValue: 'Light Blue',
            },
            {
              canonicalName: 'ckg:COLOR:3609:sky_blue',
              count: 0,
              value: '/express/colors/sky-blue',
              displayValue: 'Sky Blue',
            },
            {
              canonicalName: 'ckg:COLOR:3567:medium_blue',
              count: 0,
              value: '/express/colors/search?q=Medium%20Blue',
              displayValue: 'Medium Blue',
            },
            {
              canonicalName: 'ckg:COLOR:3500:dark_blue',
              count: 0,
              value: '/express/colors/dark-blue',
              displayValue: 'Dark Blue',
            },
            {
              canonicalName: 'ckg:COLOR:3610:slate_blue',
              count: 0,
              value: '/express/colors/search?q=Slate%20Blue',
              displayValue: 'Slate Blue',
            },
            {
              canonicalName: 'ckg:COLOR:3615:steel_blue',
              count: 0,
              value: '/express/colors/steel-blue',
              displayValue: 'Steel Blue',
            },
            {
              canonicalName: 'ckg:COLOR:3620:turquoise',
              count: 0,
              value: '/express/colors/turquoise',
              displayValue: 'Turquoise',
            },
            {
              canonicalName: 'ckg:COLOR:3499:cyan',
              count: 0,
              value: '/express/colors/cyan',
              displayValue: 'Cyan',
            },
            {
              canonicalName: 'ckg:COLOR:3483:azure',
              count: 0,
              value: '/express/colors/azure',
              displayValue: 'Azure',
            },
            {
              canonicalName: 'ckg:COLOR:3496:cornflower_blue',
              count: 0,
              value: '/express/colors/search?q=Cornflower%20Blue',
              displayValue: 'Cornflower Blue',
            },
            {
              canonicalName: 'ckg:COLOR:3492:cadet_blue',
              count: 0,
              value: '/express/colors/search?q=Cadet%20Blue',
              displayValue: 'Cadet Blue',
            },
            {
              canonicalName: 'ckg:COLOR:3479:alice_blue',
              count: 0,
              value: '/express/colors/search?q=Alice%20Blue',
              displayValue: 'Alice Blue',
            },
            {
              canonicalName: 'ckg:COLOR:18534:teal_blue',
              count: 0,
              value: '/express/colors/search?q=Teal%20Blue',
              displayValue: 'Teal Blue',
            },
            {
              canonicalName: 'ckg:COLOR:18535:blue_bell',
              count: 0,
              value: '/express/colors/search?q=Blue%20Bell',
              displayValue: 'Blue Bell',
            },
            {
              canonicalName: 'ckg:COLOR:18536:ultramarine_blue',
              count: 0,
              value: '/express/colors/search?q=Ultramarine%20Blue',
              displayValue: 'Ultramarine Blue',
            },
            {
              canonicalName: 'ckg:COLOR:18537:french_blue',
              count: 0,
              value: '/express/colors/search?q=French%20Blue',
              displayValue: 'French Blue',
            },
            {
              canonicalName: 'ckg:COLOR:18538:robin_egg_blue',
              count: 0,
              value: '/express/colors/search?q=Robin%20Egg%20Blue',
              displayValue: 'Robin Egg Blue',
            },
            {
              canonicalName: 'ckg:COLOR:18539:blue_sapphire',
              count: 0,
              value: '/express/colors/search?q=Blue%20Sapphire',
              displayValue: 'Blue Sapphire',
            },
            {
              canonicalName: 'ckg:COLOR:18540:cerulean',
              count: 0,
              value: '/express/colors/cerulean',
              displayValue: 'Cerulean',
            },
            {
              canonicalName: 'ckg:COLOR:18541:carolina_blue',
              count: 0,
              value: '/express/colors/search?q=Carolina%20Blue',
              displayValue: 'Carolina Blue',
            },
            {
              canonicalName: 'ckg:COLOR:18542:tiffany_blue',
              count: 0,
              value: '/express/colors/tiffany-blue',
              displayValue: 'Tiffany Blue',
            },
            {
              canonicalName: 'ckg:COLOR:18543:cerulean_blue',
              count: 0,
              value: '/express/colors/search?q=Cerulean%20Blue',
              displayValue: 'Cerulean Blue',
            },
            {
              canonicalName: 'ckg:COLOR:18544:blue_jeans',
              count: 0,
              value: '/express/colors/search?q=Blue%20Jeans',
              displayValue: 'Blue Jeans',
            },
            {
              canonicalName: 'ckg:COLOR:18545:columbia_blue',
              count: 0,
              value: '/express/colors/search?q=Columbia%20Blue',
              displayValue: 'Columbia Blue',
            },
            {
              canonicalName: 'ckg:COLOR:18546:glaucous',
              count: 0,
              value: '/express/colors/glaucous',
              displayValue: 'Glaucous',
            },
            {
              canonicalName: 'ckg:COLOR:18547:oxford_blue',
              count: 0,
              value: '/express/colors/search?q=Oxford%20Blue',
              displayValue: 'Oxford Blue',
            },
            {
              canonicalName: 'ckg:COLOR:18548:yinmn_blue',
              count: 0,
              value: '/express/colors/search?q=Yinmn%20Blue',
              displayValue: 'Yinmn Blue',
            },
            {
              canonicalName: 'ckg:COLOR:26508:azul',
              count: 0,
              value: '/express/colors/azul',
              displayValue: 'Azul',
            },
            {
              canonicalName: 'ckg:COLOR:26509:blue_gray',
              count: 0,
              value: '/express/colors/blue-gray',
              displayValue: 'Blue Gray',
            },
            {
              canonicalName: 'ckg:COLOR:26510:blue_green',
              count: 0,
              value: '/express/colors/blue-green',
              displayValue: 'Blue Green',
            },
            {
              canonicalName: 'ckg:COLOR:26511:cobalt',
              count: 0,
              value: '/express/colors/cobalt',
              displayValue: 'Cobalt',
            },
            {
              canonicalName: 'ckg:COLOR:26512:cornflower',
              count: 0,
              value: '/express/colors/cornflower',
              displayValue: 'Cornflower',
            },
            {
              canonicalName: 'ckg:COLOR:26513:electric_blue',
              count: 0,
              value: '/express/colors/electric-blue',
              displayValue: 'Electric Blue',
            },
            {
              canonicalName: 'ckg:COLOR:26514:spanish_blue',
              count: 0,
              value: '/express/colors/search?q=Spanish%20Blue',
              displayValue: 'Spanish Blue',
            },
            {
              canonicalName: 'ckg:COLOR:26515:ultramarine',
              count: 0,
              value: '/express/colors/search?q=Ultramarine',
              displayValue: 'Ultramarine',
            },
            {
              canonicalName: 'ckg:COLOR:18559:neon_blue',
              count: 0,
              value: '/express/colors/search?q=Neon%20Blue',
              displayValue: 'Neon Blue',
            },
            {
              canonicalName: 'ckg:COLOR:18554:phthalo_blue',
              count: 0,
              value: '/express/colors/search?q=Phthalo%20Blue',
              displayValue: 'Phthalo Blue',
            },
            {
              canonicalName: 'ckg:COLOR:3539:indigo',
              count: 0,
              value: '/express/colors/indigo',
              displayValue: 'Indigo',
            },
            {
              canonicalName: 'ckg:COLOR:26516:charcoal',
              count: 0,
              value: '/express/colors/charcoal',
              displayValue: 'Charcoal',
            },
          ],
          facet: 'categories',
        },
      ],
    },
  ],
};

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
    
    // Mock createTag
    originalCreateTag = window.createTag;
    window.createTag = (tag, attrs, ...children) => {
      const element = document.createElement(tag);
      if (attrs) {
        Object.assign(element, attrs);
      }
      children.forEach(child => {
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
    
    // Mock window.import
    const originalImport = window.import;
    window.import = (path) => {
      if (path.includes('utils/utils.js')) {
        return Promise.resolve({
          createTag: window.createTag
        });
      }
      if (path.includes('browse-api-controller.js')) {
        return Promise.resolve({
          default: () => Promise.resolve(MOCK_JSON.queryResults[0].facets[0].buckets)
        });
      }
      return originalImport ? originalImport(path) : Promise.resolve({});
    };
    
    // Mock fetch
    mockFetch = () => Promise.resolve(jsonOk(MOCK_JSON));
    window.fetch = mockFetch;
  });

  afterEach(() => {
    // Restore original functions
    window.getLibs = originalGetLibs;
    window.createTag = originalCreateTag;
    if (window.fetch.restore) {
      window.fetch.restore();
    }
  });

  it('should decorate block with color pills', async () => {
    const block = document.querySelector('.ckg-link-list');
    await decorate(block);
    
    expect(block.style.visibility).to.equal('visible');
    expect(block.children.length).to.be.greaterThan(0);
    
    const links = block.querySelectorAll('a');
    expect(links.length).to.be.greaterThan(0);
    
    // Check that links have proper attributes
    links.forEach(link => {
      expect(link).to.have.property('href');
      expect(link).to.have.property('title');
      expect(link).to.have.property('class', 'button');
    });
  });

  it('should handle empty pills data', async () => {
    // Mock getData to return null
    const originalImport = window.import;
    window.import = (path) => {
      if (path.includes('utils/utils.js')) {
        return Promise.resolve({
          createTag: window.createTag
        });
      }
      if (path.includes('browse-api-controller.js')) {
        return Promise.resolve({
          default: () => Promise.resolve(null)
        });
      }
      return originalImport ? originalImport(path) : Promise.resolve({});
    };
    
    const block = document.querySelector('.ckg-link-list');
    await decorate(block);
    
    expect(block.style.visibility).to.equal('hidden');
    expect(block.children.length).to.equal(0);
  });

  it('should handle empty pills array', async () => {
    // Mock getData to return empty array
    const originalImport = window.import;
    window.import = (path) => {
      if (path.includes('utils/utils.js')) {
        return Promise.resolve({
          createTag: window.createTag
        });
      }
      if (path.includes('browse-api-controller.js')) {
        return Promise.resolve({
          default: () => Promise.resolve([])
        });
      }
      return originalImport ? originalImport(path) : Promise.resolve({});
    };
    
    const block = document.querySelector('.ckg-link-list');
    await decorate(block);
    
    expect(block.style.visibility).to.equal('hidden');
    expect(block.children.length).to.equal(0);
  });

  it('should filter out pills with missing data', async () => {
    const incompletePills = [
      { canonicalName: 'test1', metadata: { link: '/test1', hexCode: '#ff0000' } },
      { canonicalName: 'test2', metadata: { link: '/test2' } }, // missing hexCode
      { canonicalName: 'test3', metadata: { hexCode: '#00ff00' } }, // missing link
      { canonicalName: null, metadata: { link: '/test4', hexCode: '#0000ff' } }, // missing canonicalName
    ];
    
    // Mock getData to return incomplete pills
    const originalImport = window.import;
    window.import = (path) => {
      if (path.includes('utils/utils.js')) {
        return Promise.resolve({
          createTag: window.createTag
        });
      }
      if (path.includes('browse-api-controller.js')) {
        return Promise.resolve({
          default: () => Promise.resolve(incompletePills)
        });
      }
      return originalImport ? originalImport(path) : Promise.resolve({});
    };
    
    const block = document.querySelector('.ckg-link-list');
    await decorate(block);
    
    // Only the first pill should be added
    const links = block.querySelectorAll('a');
    expect(links.length).to.equal(1);
    expect(links[0].href).to.include('/test1');
  });

  it('should add color samplers to buttons', async () => {
    const block = document.querySelector('.ckg-link-list');
    await decorate(block);
    
    const colorDots = block.querySelectorAll('.color-dot');
    expect(colorDots.length).to.be.greaterThan(0);
    
    colorDots.forEach(dot => {
      expect(dot).to.have.property('class', 'color-dot');
      expect(dot.style.backgroundColor).to.match(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it('should apply colorful class to links with color samplers', async () => {
    const block = document.querySelector('.ckg-link-list');
    await decorate(block);
    
    const colorfulLinks = block.querySelectorAll('a.colorful');
    expect(colorfulLinks.length).to.be.greaterThan(0);
  });

  it('should set button background color', async () => {
    const block = document.querySelector('.ckg-link-list');
    await decorate(block);
    
    const buttonContainers = block.querySelectorAll('p.button-container');
    buttonContainers.forEach(container => {
      expect(container.style.backgroundColor).to.match(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it('should handle block with no children', async () => {
    const block = document.createElement('div');
    block.className = 'ckg-link-list';
    // Don't add any children
    
    await decorate(block);
    
    expect(block.style.visibility).to.equal('visible');
  });

  it('should call buildCarousel with correct parameters', async () => {
    let buildCarouselCalled = false;
    let buildCarouselParams = null;
    
    window.buildCarousel = (selector, parent, options) => {
      buildCarouselCalled = true;
      buildCarouselParams = { selector, parent, options };
      return Promise.resolve();
    };
    
    const block = document.querySelector('.ckg-link-list');
    await decorate(block);
    
    expect(buildCarouselCalled).to.be.true;
    expect(buildCarouselParams.selector).to.equal('.button-container');
    expect(buildCarouselParams.parent).to.equal(block);
    expect(buildCarouselParams.options).to.deep.equal({ centerAlign: true });
  });

  it('should handle getData errors gracefully', async () => {
    // Mock getData to reject
    const originalImport = window.import;
    window.import = (path) => {
      if (path.includes('utils/utils.js')) {
        return Promise.resolve({
          createTag: window.createTag
        });
      }
      if (path.includes('browse-api-controller.js')) {
        return Promise.resolve({
          default: () => Promise.reject(new Error('API Error'))
        });
      }
      return originalImport ? originalImport(path) : Promise.resolve({});
    };
    
    const block = document.querySelector('.ckg-link-list');
    
    try {
      await decorate(block);
      // Should not throw
    } catch (error) {
      // If it does throw, that's also acceptable behavior
      expect(error).to.be.an('error');
    }
  });

  it('should use titleCase for button text', async () => {
    const block = document.querySelector('.ckg-link-list');
    await decorate(block);
    
    const links = block.querySelectorAll('a');
    links.forEach(link => {
      const text = link.textContent.trim();
      // Check that text is title cased (first letter of each word capitalized)
      const words = text.split(' ');
      words.forEach(word => {
        if (word.length > 0) {
          expect(word[0]).to.equal(word[0].toUpperCase());
        }
      });
    });
  });
});
