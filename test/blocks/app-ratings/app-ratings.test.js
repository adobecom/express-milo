import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
window.isTestEnv = true;
const imports = await Promise.all([import('../../../express/code/scripts/utils.js'), import('../../../express/code/scripts/scripts.js')]);
const { getLibs } = imports[0];

await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = { locales };
  mod.setConfig(conf);
});
const { default: decorate } = await import('../../../express/code/blocks/app-ratings/app-ratings.js');
const body = await readFile({ path: './mocks/body.html' });
document.body.innerHTML = body;
describe('App Ratings', () => {
  before(() => {
    window.isTestEnv = true;
    window.placeholders = {
      'app-store-ratings': 'Test',
      'app-store-stars': 'Test',
      'app-store-ratings-play-store': 'Test',
      'app-store-ratings-apple-store': 'Test',
    };
  });

  it('App Ratings exists', async () => {
    const block = document.getElementsByClassName('app-ratings')[0];
    await decorate(block);
    const googleRating = block.querySelector('.ratings');
    expect(googleRating).to.exist;
  });
});
