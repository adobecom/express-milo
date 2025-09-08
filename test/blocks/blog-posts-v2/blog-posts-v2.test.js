import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([import('../../../express/code/scripts/utils.js'), import('../../../express/code/scripts/scripts.js')]);
const { getLibs } = imports[0];
await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = {};
  mod.setConfig(conf);
});
const [{ default: decorate }] = await Promise.all([import('../../../express/code/blocks/blog-posts-v2/blog-posts-v2.js')]);
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('blog-posts-v2', () => {
  let block;
  before(async () => {
    block = document.querySelector('.blog-posts-v2');
    decorate(block);
  });

  it('creates blog posts v2 wrapper', async () => {
    expect(block.querySelector('.blog-posts-v2-decoration')).to.exist;
  });

  it('has blog posts content', async () => {
    expect(block.querySelectorAll('div').length).to.be.above(0);
  });
});
