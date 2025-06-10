/* eslint-env mocha */
/* eslint-disable no-unused-vars */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { mockRes } from '../../helpers/test-utilities.js';
import { delay } from '../../helpers/waitfor.js';

const originalFetch = window.fetch;
const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const imports = await Promise.all([import('../../../express/code/scripts/utils.js'), import('../../../express/code/scripts/scripts.js'), import(
  '../../../express/code/blocks/susi-light/susi-light.js'
)]);
const [{ getLibs }, _, { default: decorate }] = imports;
await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = { locales };
  mod.setConfig(conf);
});

describe('Susi-light', async () => {
  const blocks = [...document.querySelectorAll('.susi-light')];
  before(async () => {
    window.fetch = sinon.stub().callsFake(() => mockRes({}));
    await Promise.all(blocks.map((block) => decorate(block)));
    await delay(310);
  });

  after(() => {
    window.fetch = originalFetch;
  });

  it('decorates susi-light with required properties', () => {
    for (const block of blocks) {
      expect(block).to.exist;
      const component = block.querySelector('susi-sentry-light');
      expect(!!component.variant).to.be.true;
      expect(!!component.config).to.be.true;
      expect(!!component.authParams).to.be.true;
    }
  });

  it('loads susi-sentry-light', () => {
    for (const block of blocks) {
      const component = block.querySelector('susi-sentry-light');
      expect(component).to.exist;
      expect(!!component.shadowRoot).to.be.true;
    }
  });

  describe('susi-light tabs variant', () => {
    const block = document.querySelector('.susi-light.tabs');

    it('allocates content into tabs', () => {
      expect(block.querySelector('.express-logo')).to.exist;
      expect(block.querySelector('.title')).to.exist;
      expect(block.querySelectorAll('[role=tablist] > [role=tab]').length).to.equal(2);
      expect(block.querySelectorAll('[role=tabpanel]').length).to.equal(2);
      expect(block.querySelectorAll('[role=tabpanel].standard')).to.exist;
      expect(block.querySelectorAll('[role=tabpanel].edu-express')).to.exist;
    });

    it('decorates bubble footer', () => {
      [...block.querySelectorAll('[role=tabpanel]')].forEach((panel) => {
        expect(panel.querySelector('.footer')).to.exist;
      });
      const bubbleFooter = block.querySelector('.footer:has(h2)');
      expect(bubbleFooter).to.exist;
      expect(bubbleFooter.querySelectorAll('.susi-bubble').length).to.equal(2);
    });

    const [expectTabOneOn, expectTabTwoOn] = [
      () => {
        const [tab1, tab2] = [...block.querySelectorAll('[role=tab]')];
        const [panel1, panel2] = [...block.querySelectorAll('[role=tabpanel]')];
        expect(tab1.getAttribute('aria-selected')).to.equal('true');
        expect(tab2.getAttribute('aria-selected')).to.equal('false');
        expect(panel1.classList.contains('hide')).to.be.false;
        expect(panel2.classList.contains('hide')).to.be.true;
      },
      () => {
        const [tab1, tab2] = [...block.querySelectorAll('[role=tab]')];
        const [panel1, panel2] = [...block.querySelectorAll('[role=tabpanel]')];
        expect(tab1.getAttribute('aria-selected')).to.equal('false');
        expect(tab2.getAttribute('aria-selected')).to.equal('true');
        expect(panel1.classList.contains('hide')).to.be.true;
        expect(panel2.classList.contains('hide')).to.be.false;
      },
    ];
    it('displays first tab by default', () => {
      expectTabOneOn();
    });
    it('switches tabs', () => {
      const tab1 = block.querySelector('[role=tab]');
      const tab2 = block.querySelector('[role=tab]:nth-of-type(2)');
      tab1.click();
      expectTabOneOn();
      tab2.click();
      expectTabTwoOn();
      tab1.click();
      expectTabOneOn();
    });
  });
});
