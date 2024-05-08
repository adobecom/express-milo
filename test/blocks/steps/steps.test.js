/* eslint-env mocha */
/* eslint-disable no-unused-vars */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([import('../../../express/scripts/scripts.js'), import('../../../express/blocks/steps/steps.js')]);
const { default: decorate } = imports[1];

const body = await readFile({ path: './mocks/body.html' });
const schemaHighlight = await readFile({ path: './mocks/schema-highlight.html' });
const schemaDark = await readFile({ path: './mocks/schema-dark.html' });
const schema = await readFile({ path: './mocks/schema.html' });

describe('Steps', () => {
  before(() => {
    window.isTestEnv = true;
  });

  it('Steps exist', () => {
    document.body.innerHTML = body;
    const steps = document.querySelector('.steps');
    decorate(steps);
    expect(steps).to.exist;
  });

  it('Steps has the right elements', () => {
    document.body.innerHTML = body;
    const steps = document.querySelector('.steps');
    decorate(steps);

    expect(document.querySelector('.section')).to.exist;
    expect(document.querySelector('h3')).to.exist;
    expect(document.querySelector('.step-description')).to.exist;
  });

  it('Highlight schema contains right elements', () => {
    document.body.innerHTML = schemaHighlight;
    const steps = document.querySelector('.steps');
    decorate(steps);

    expect(document.querySelector('.steps-highlight-container')).to.exist;
  });

  it('Dark schema contains right elements', () => {
    document.body.innerHTML = schemaDark;
    const steps = document.querySelector('.steps');
    decorate(steps);

    expect(document.querySelector('.steps-dark-container')).to.exist;
  });

  it('Schema has the right elements', () => {
    document.body.innerHTML = schema;
    const steps = document.querySelector('.steps');
    decorate(steps);

    expect(document.querySelector('.steps-container')).to.exist;
    expect(document.querySelector('script')).to.exist;
  });
});
