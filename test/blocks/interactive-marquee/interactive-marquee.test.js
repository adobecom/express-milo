import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

await import('../../../expresscode/scripts/scripts.js');
const [, { default: init }] = await Promise.all([import('../../../expresscode/scripts/scripts.js'), import('../../../expresscode/blocks/interactive-marquee/interactive-marquee.js')]);

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('interactive marquee', () => {
  const im = document.querySelector('.interactive-marquee');
  before(async () => {
    await init(im);
  });

  it('interactive marquee dakr and horiontal variant should exist', () => {
    expect(im.classList.contains('dark')).to.true;
    expect(im.classList.contains('horizontal')).to.true;
  });

  it('has the interactive-area', () => {
    const container = im.querySelector('.foreground .interactive-container');
    expect(container).to.exist;
  });

  it('has a heading-xxl', () => {
    const heading = im.querySelector('.heading-xxl');
    expect(heading).to.exist;
  });
});
