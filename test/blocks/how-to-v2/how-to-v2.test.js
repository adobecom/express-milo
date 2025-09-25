import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };

window.isTestEnv = true;
const imports = await Promise.all([import('../../../express/code/scripts/utils.js'), import('../../../express/code/scripts/scripts.js')]);
const { getLibs } = imports[0];

await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = { locales };
  mod.setConfig(conf);
});

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('How-to-v2', () => {
  let blocks;
  before(async () => {
    blocks = [...document.querySelectorAll('.how-to-v2')];
  });
  after(() => {});
  it('decorates into collection of steps', async () => {
    const bl = blocks[0];
    const ol = bl.querySelector('ol');
    expect(ol).to.exist;
    expect(ol.classList.contains('steps')).to.be.true;
    const lis = [...ol.querySelectorAll('li')];
    lis.forEach((li) => {
      expect(li.classList.contains('step'));
      const h3 = li.querySelector('h3');
      expect(h3).not.to.be.null;
    });
    expect(lis.length).to.equal(5);
  });
  it('adds step numbers to cards', async () => {
    const bl = blocks[0];
    const ol = bl.querySelector('ol');
    const lis = [...ol.querySelectorAll('li')];
    lis.forEach((li, i) => {
      expect(li.classList.contains('step'));
      const h3 = li.querySelector('h3');
      const stepNumber = h3.textContent;
      const num = i + 1;
      expect(stepNumber.includes(num.toString())).to.be.true;
    });
  });

  it('sets CSS variable for background image when present', async () => {
    const bl = blocks[0];
    const backgroundImage = bl.querySelector('img');
    if (backgroundImage) {
      const backgroundURL = backgroundImage.src;
      expect(bl.style.getPropertyValue('--background-image')).to.include(backgroundURL);
    }
  });

  it('creates proper DOM structure with steps-content container', async () => {
    const bl = blocks[0];
    const stepsContent = bl.querySelector('.steps-content');
    expect(stepsContent).to.exist;
    expect(stepsContent.classList.contains('steps-content')).to.be.true;
  });

  it('creates media container with proper class', async () => {
    const bl = blocks[0];
    const mediaContainer = bl.querySelector('.media-container');
    expect(mediaContainer).to.exist;
    expect(mediaContainer.classList.contains('media-container')).to.be.true;
  });

  it('sets proper ARIA attributes on step items', async () => {
    const bl = blocks[0];
    const lis = [...bl.querySelectorAll('li.step')];
    lis.forEach((li) => {
      expect(li.getAttribute('aria-expanded')).to.exist;
      expect(li.getAttribute('aria-controls')).to.exist;
      expect(li.getAttribute('tabindex')).to.equal('0');
    });
  });

  it('creates step indicators with proper class', async () => {
    const bl = blocks[0];
    const indicators = [...bl.querySelectorAll('.step-indicator')];
    expect(indicators.length).to.be.greaterThan(0);
    indicators.forEach((indicator) => {
      expect(indicator.classList.contains('step-indicator')).to.be.true;
    });
  });

  it('creates detail containers with proper IDs and classes', async () => {
    const bl = blocks[0];
    const detailContainers = [...bl.querySelectorAll('.detail-container')];
    expect(detailContainers.length).to.be.greaterThan(0);
    detailContainers.forEach((container, i) => {
      expect(container.id).to.equal(`step-detail-${i}`);
      expect(container.getAttribute('aria-labelledby')).to.exist;
    });
  });

  it('adds detail-text class to detail content', async () => {
    const bl = blocks[0];
    const detailTexts = [...bl.querySelectorAll('.detail-text')];
    expect(detailTexts.length).to.be.greaterThan(0);
    detailTexts.forEach((detailText) => {
      expect(detailText.classList.contains('detail-text')).to.be.true;
    });
  });

  it('sets first step as open by default', async () => {
    const bl = blocks[0];
    const firstStep = bl.querySelector('li.step');
    expect(firstStep.getAttribute('aria-expanded')).to.equal('true');
    const firstDetailContainer = firstStep.querySelector('.detail-container');
    expect(firstDetailContainer.classList.contains('closed')).to.be.false;
  });

  it('sets other steps as closed by default', async () => {
    const bl = blocks[0];
    const steps = [...bl.querySelectorAll('li.step')];
    steps.slice(1).forEach((step) => {
      expect(step.getAttribute('aria-expanded')).to.equal('false');
      const detailContainer = step.querySelector('.detail-container');
      expect(detailContainer.classList.contains('closed')).to.be.true;
    });
  });

  it('creates proper heading IDs for accessibility', async () => {
    const bl = blocks[0];
    const headings = [...bl.querySelectorAll('h3')];
    headings.forEach((heading, i) => {
      expect(heading.id).to.equal(`step-title-${i}`);
    });
  });

  it('handles blocks without background images gracefully', async () => {
    const bl = blocks[0];
    const backgroundImage = bl.querySelector('img');
    if (!backgroundImage) {
      expect(bl.style.getPropertyValue('--background-image')).to.be.empty;
    }
  });

  it('creates step content containers with proper class', async () => {
    const bl = blocks[0];
    const stepContents = [...bl.querySelectorAll('.step-content')];
    expect(stepContents.length).to.be.greaterThan(0);
    stepContents.forEach((content) => {
      expect(content.classList.contains('step-content')).to.be.true;
    });
  });

  it('sets proper role and aria-label on step items', async () => {
    const bl = blocks[0];
    const lis = [...bl.querySelectorAll('li.step')];
    lis.forEach((li, i) => {
      expect(li.getAttribute('role')).to.equal('button');
      expect(li.getAttribute('aria-label')).to.include(`Template ${i + 1}`);
    });
  });
});
