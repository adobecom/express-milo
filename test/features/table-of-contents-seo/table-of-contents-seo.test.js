import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/features/table-of-contents-seo/table-of-contents-seo.js'),
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
    expect(title.getAttribute('role')).to.equal('button');
    expect(title.getAttribute('tabindex')).to.equal('0');
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
