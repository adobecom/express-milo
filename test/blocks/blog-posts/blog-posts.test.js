import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([import('../../../express/code/scripts/utils.js'), import('../../../express/code/scripts/scripts.js')]);
const { getLibs } = imports[0];
await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = {};
  mod.setConfig(conf);
});
const [{ default: decorate }] = await Promise.all([import('../../../express/code/blocks/blog-posts/blog-posts.js')]);
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('blog-posts', () => {
  let block;
  before(async () => {
    block = document.querySelector('.blog-posts');
    decorate(block);
  });
  
  it('creates blog posts wrapper', async () => {
    expect(block.querySelector('.blog-posts-decoration')).to.exist;
  });
  
  it('has blog posts content', async () => {
    expect(block.querySelectorAll('div').length).to.be.above(0);
  });
});
