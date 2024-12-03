/* eslint-env mocha */
/* eslint-disable no-unused-vars */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

await import('../../../express/scripts/scripts.js');

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Susi-light', async () => {
  const block = document.querySelector('.susi-light');
  const { default: decorate } = await import(
    '../../../express/blocks/susi-light/susi-light.js'
  );
  decorate(block);
  before(() => {
    window.isTestEnv = true;
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
