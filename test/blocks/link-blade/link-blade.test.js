import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const [, { default: decorate }] = await Promise.all([
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/link-blade/link-blade.js'),
]);

const testBody = await readFile({ path: './mocks/body.html' });

describe('Link Blade', () => {
  let block;
  let linksContainer;
  let leftChev;
  let rightChev;

  beforeEach(async () => {
    document.body.innerHTML = testBody;
    block = document.querySelector('.link-blade');
    await decorate(block);

    linksContainer = block.querySelector('.link-blade-links');
    leftChev = block.querySelector('.link-blade-chevron.left');
    rightChev = block.querySelector('.link-blade-chevron:not(.left)');

    // Setup mock dimensions
    Object.defineProperty(linksContainer, 'scrollWidth', { value: 2000, configurable: true });
    Object.defineProperty(linksContainer, 'clientWidth', { value: 500, configurable: true });
  });

  it('should create basic structure', () => {
    expect(block.querySelector('h2.link-blade-header').textContent).to.equal('Header');
    expect(linksContainer.querySelectorAll('a').length).to.equal(16);
    expect(leftChev).to.exist;
    expect(rightChev).to.exist;
  });
});
