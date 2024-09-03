import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const [, { decorate }] = await Promise.all([import('../../../express/scripts/scripts.js'), import('../../../express/blocks/logo-row/logo-row.js')]);
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Logo Row', () => {
  let blocks;
  const cardCnts = 5;
  let fetchStub;

  before(async () => {
    window.isTestEnv = true;
    blocks = Array.from(document.querySelectorAll('.logo-row'));
    await Promise.all(blocks.map((block) => decorate(block)));
    fetchStub = sinon.stub(window, 'fetch');
  });

  afterEach(() => {
    // Restore the original functionality after each test
    fetchStub.restore();
  });

  it('Logo Row exists', () => {
    expect(Array.from(document.querySelectorAll('.text-column')).length === 1);
  });

  it(`Card counts to be ${cardCnts}`, () => {
    const cards = document.querySelectorAll('.image-column>picture');
    expect(cards.length === cardCnts.length);
  });
});
