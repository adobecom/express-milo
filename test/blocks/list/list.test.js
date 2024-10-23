/* eslint-env mocha */
/* eslint-disable no-unused-vars */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: decorate } = await import(
  '../../../express/blocks/list/list.js'
);

const body = await readFile({ path: './mocks/body.html' });
const pricing = await readFile({ path: './mocks/pricing.html' });

describe('List', () => {
  before(() => {
    window.isTestEnv = true;
  });

  it('List exists', () => {
    document.body.innerHTML = body;
    const list = document.querySelector('.list');
    decorate(list);
    expect(list).to.exist;
  });

  it('Should have the right elements', () => {
    document.body.innerHTML = body;
    const list = document.querySelector('.list');
    decorate(list);

    expect(document.querySelector('.item')).to.exist;
    expect(document.querySelector('.item')).to.exist;
    expect(document.querySelector('.item-text')).to.exist;
  });

  it('Should have the right elements', () => {
    document.body.innerHTML = pricing;
    const list = document.querySelector('.list');
    decorate(list);

    expect(document.querySelector('a[title^="{{pricing"]')).to.exist;
  });
});
