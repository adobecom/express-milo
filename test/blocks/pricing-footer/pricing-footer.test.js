/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const [utilsModule, , blockModule] = await Promise.all([
  import('../../../express/code/scripts/utils.js'),
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/pricing-footer/pricing-footer.js'),
]);
const { setLibs } = utilsModule;
const { default: decorate } = blockModule;
const libsPath = '/test/blocks/pricing-footer/mocks/libs';

const body = await readFile({ path: './mocks/body.html' });

describe('Pricing Footer', () => {
  let originalResizeObserver;
  let originalGetComputedStyle;
  let matchMediaResult;
  let block;
  let clock;

  before(() => {
    window.isTestEnv = true;
    originalResizeObserver = window.ResizeObserver;
    originalGetComputedStyle = window.getComputedStyle.bind(window);
  });

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    matchMediaResult = false;
    setLibs(libsPath, { hostname: 'www.adobe.com', search: '' });
    document.body.innerHTML = body;
    block = document.querySelector('.pricing-footer');

    sinon.stub(window, 'matchMedia').callsFake((query) => ({
      matches: matchMediaResult,
      media: query,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }));

    sinon.stub(window, 'getComputedStyle').callsFake((element) => {
      if (element?.classList?.contains('content')) {
        return {
          width: '600px',
          marginLeft: '0px',
          marginRight: '0px',
        };
      }

      if (element?.tagName === 'MERCH-CARD') {
        return {
          marginLeft: '0px',
          marginRight: '0px',
        };
      }

      return originalGetComputedStyle(element);
    });

    window.ResizeObserver = class {
      constructor(callback) {
        this.callback = callback;
        this.observe = this.observe.bind(this);
      }

      observe() {
        this.callback([{ target: document.documentElement }]);
      }
    };
  });

  afterEach(() => {
    if (block?.resizeObserver?.disconnect) {
      block.resizeObserver.disconnect();
    }
    if (clock) {
      clock.restore();
      clock = null;
    }

    document.body.innerHTML = '';
    sinon.restore();

    if (originalResizeObserver) {
      window.ResizeObserver = originalResizeObserver;
    } else {
      delete window.ResizeObserver;
    }
  });

  const applyCardWidths = (widths) => {
    const content = block.previousElementSibling;
    const cards = content ? content.querySelectorAll('merch-card') : [];
    widths.forEach((width, index) => {
      const card = cards[index];
      if (card) {
        card.getBoundingClientRect = () => ({ width });
      }
    });
  };

  it('decorates the pricing footer and removes empty columns', async () => {
    await decorate(block);

    const columns = block.querySelectorAll(':scope > div');
    expect(block.classList.contains('ax-grid-container')).to.be.true;
    expect(block.classList.contains('small-gap')).to.be.true;
    expect(columns.length).to.equal(2);
    expect(columns[0].textContent.trim()).to.contain('Primary footer content');
    const cta = columns[0].querySelector('a.con-button');
    expect(cta).to.exist;
    expect(cta.closest('.button-container')).to.exist;
    expect(columns[1].textContent.trim()).to.equal('Secondary footer content');
  });

  it('applies card count class and width for wider viewports', async () => {
    applyCardWidths([200, 200]);
    await decorate(block);
    await clock.tickAsync(200);

    expect(block.classList.contains('card-count-2')).to.be.true;
    expect(block.style.maxWidth).to.equal('416px');
  });

  it('limits width to a single card in narrow viewports', async () => {
    matchMediaResult = true;
    applyCardWidths([150, 170]);
    await decorate(block);
    await clock.tickAsync(200);

    expect(block.classList.contains('card-count-2')).to.be.true;
    expect(block.style.maxWidth).to.equal('150px');
  });
});
