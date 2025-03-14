import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([import('../../../express/code/scripts/utils.js'), import('../../../express/code/scripts/scripts.js')]);
const { getLibs } = imports[0];
await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = {};
  mod.setConfig(conf);
});
const [{ default: decorate }] = await Promise.all([import('../../../express/code/blocks/login-page/login-page.js')]);
document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('login-page', () => {
  let block;
  before(async () => {
    block = document.querySelector('.login-page');
    decorate(block);
  });
  it('has a background image', async () => {
    expect(block.querySelector('img.m-background')).to.exist;
    expect(block.querySelector('img.l-background')).to.exist;
    expect(block.querySelector('img.xl-background')).to.exist;
    expect(block.querySelector('img.xxl-background')).to.exist;
  });
});
