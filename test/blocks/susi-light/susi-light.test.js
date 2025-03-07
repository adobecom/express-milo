/* eslint-env mocha */
/* eslint-disable no-unused-vars */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { mockRes } from '../test-utilities.js';
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
  const block = document.querySelector('.susi-light');
  before(async () => {
    window.fetch = sinon.stub().callsFake(() => mockRes({}));
    await decorate(block);
    await delay(310);
  });

  after(() => {
    // Do not build up any test state - reset window.fetch to it's original state
    window.fetch = originalFetch;
  });

  it('Susi-light gets decorated with required properties', () => {
    expect(block).to.exist;
    const component = block.querySelector('susi-sentry-light');
    expect(!!component.variant).to.be.true;
    expect(!!component.config).to.be.true;
    expect(!!component.authParams).to.be.true;
  });

  it('Susi-light gets decorated', () => {
    const component = block.querySelector('susi-sentry-light');
    expect(component).to.exist;
    expect(!!component.shadowRoot).to.be.true;
  });
});
