/* eslint-env mocha */
/* eslint-disable no-unused-vars */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { mockRes } from '../test-utilities.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const originalFetch = window.fetch;

const [{ getLibs }, _, { default: decorate }] = await Promise.all([import('../../../express/code/scripts/utils.js'), import('../../../express/code/scripts/scripts.js'), import(
  '../../../express/code/blocks/floating-panel/floating-panel.js'
)]);
await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = { locales };
  mod.setConfig(conf);
});

describe('Floating-panel', async () => {
  const block = document.querySelector('.floating-panel');
  before(() => {
    window.fetch = sinon.stub().callsFake(() => mockRes({}));
  });

  after(() => {
    window.fetch = originalFetch;
  });

  it('decorates all required content', async () => {
    expect(block).to.exist;
    await decorate(block);
    expect(block.querySelector('.header')).to.exist;
    expect(block.querySelector('.subheader')).to.exist;
    expect(block.querySelector('.link-rows-container')).to.exist;
    expect(block.querySelectorAll('.floating-panel-link-row').length).to.equal(2);
  });
});
