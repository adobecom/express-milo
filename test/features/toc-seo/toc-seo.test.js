import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

// Set up mocks BEFORE any imports to prevent external calls
if (typeof window !== 'undefined') {
  // Mock fetch globally
  window.fetch = () => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  });

  // Mock LANA logging
  window.lana = {
    log: () => {}, // No-op function
  };

  // Mock geolocation service
  window.geo2 = {
    getCountry: () => Promise.resolve('US'),
    getLanguage: () => Promise.resolve('en'),
  };

  // Mock any other external services
  window.adobeDataLayer = [];
  window.satellite = {
    track: () => {},
  };
}

const imports = await Promise.all([
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/features/toc-seo/toc-seo.js'),
]);

const { default: setTOCSEO } = imports[1];

const setupTest = async (htmlFile) => {
  const testBody = await readFile({ path: htmlFile });
  window.isTestEnv = true;

  document.documentElement.innerHTML = testBody;

  await setTOCSEO();
  return document.querySelector('.toc-container');
};

const cleanupTest = () => {
  document.documentElement.innerHTML = '';
};

describe('Table of Contents SEO - Basic Test', () => {
  it('should load without error', async () => {
    const testBody = await readFile({ path: './mocks/body.html' });
    window.isTestEnv = true;

    document.documentElement.innerHTML = testBody;

    await setTOCSEO();

    const toc = document.querySelector('.toc-container');
    expect(toc).to.exist;

    document.documentElement.innerHTML = '';
  });
});

describe('Table of Contents SEO - Structure Test', () => {
  it('should render the TOC with correct structure', async () => {
    const toc = await setupTest('./mocks/body.html');

    expect(toc).to.exist;
    expect(toc.classList.contains('toc-container')).to.be.true;
    expect(toc.classList.contains('ax-grid-col-12')).to.be.true;
    expect(toc.getAttribute('role')).to.equal('navigation');
    expect(toc.getAttribute('aria-label')).to.equal('Table of Contents');

    cleanupTest();
  });
});

describe('Table of Contents SEO - Title Test', () => {
  it('should have a properly configured title', async () => {
    const toc = await setupTest('./mocks/body.html');
    const title = toc.querySelector('.toc-title');

    expect(title).to.exist;
    expect(title.textContent).to.equal('Table of Contents');
    expect(title.tagName.toLowerCase()).to.equal('button');
    expect(title.getAttribute('aria-expanded')).to.equal('false');
    expect(title.getAttribute('aria-controls')).to.equal('toc-content');

    cleanupTest();
  });
});

describe('Table of Contents SEO - Content Test', () => {
  it('should have properly configured content area', async () => {
    const toc = await setupTest('./mocks/body.html');
    const content = toc.querySelector('.toc-content');

    expect(content).to.exist;
    expect(content.id).to.equal('toc-content');
    expect(content.getAttribute('role')).to.equal('region');
    expect(content.getAttribute('aria-label')).to.equal('Table of Contents Links');

    cleanupTest();
  });
});

describe('Table of Contents SEO - Links Test', () => {
  it('should render all TOC links correctly', async () => {
    const toc = await setupTest('./mocks/body.html');
    const content = toc.querySelector('.toc-content');
    const links = content.querySelectorAll('a');

    expect(links.length).to.equal(3);

    const expectedTexts = ['First Section', 'Second Section', 'Third Section'];
    links.forEach((link, index) => {
      expect(link.textContent).to.equal(expectedTexts[index]);
      expect(link.getAttribute('href')).to.equal(`#content-${index + 1}`);
    });

    cleanupTest();
  });
});

describe('Table of Contents SEO - Error Handling Test', () => {
  it('should handle missing metadata gracefully', async () => {
    const testBody = await readFile({ path: './mocks/body.html' });
    window.isTestEnv = true;

    // Remove metadata to test error handling
    const modifiedBody = testBody.replace(/<meta name="toc-title"/, '<!-- <meta name="toc-title"');
    document.documentElement.innerHTML = modifiedBody;

    // Should not throw an error
    await setTOCSEO();

    cleanupTest();
  });
});

describe('Table of Contents SEO - Social Icons Test', () => {
  it('should render social icons correctly', async () => {
    const toc = await setupTest('./mocks/body.html');
    const socialIcons = toc.querySelector('.toc-social-icons');

    expect(socialIcons).to.exist;
    expect(socialIcons.children.length).to.be.greaterThan(0);

    cleanupTest();
  });
});

describe('Table of Contents SEO - Configuration Test', () => {
  it('should use configuration values correctly', async () => {
    const toc = await setupTest('./mocks/body.html');

    // Test that configuration is being used
    expect(toc.getAttribute('aria-label')).to.equal('Table of Contents');

    const title = toc.querySelector('.toc-title');
    expect(title.getAttribute('aria-controls')).to.equal('toc-content');

    cleanupTest();
  });
});
