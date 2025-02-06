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
const { default: init } = await import('../../../express/code/blocks/how-to-v2/how-to-v2.js');

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('How-to-v2', () => {
  let blocks;
  before(async () => {
    blocks = [...document.querySelectorAll('.how-to-v2')];
  });
  after(() => {});
  it('decorates into gallery of steps', async () => {
    const bl = await init(blocks[0]);
    const ol = bl.querySelector('ol');
    expect(ol).to.exist;
    expect(ol.classList.contains('gallery')).to.be.true;
    expect(ol.classList.contains('cards-container')).to.be.true;
    const lis = [...ol.querySelectorAll('li')];
    lis.forEach((li) => {
      expect(li.classList.contains('gallery--item'));
      expect(li.classList.contains('card'));
    });
    expect(lis.length).to.equal(5);
  });

  it('adds step numbers to cards', async () => {
    const numbers = blocks[0].querySelectorAll('number');
    [...numbers].forEach((number, i) => {
      expect(number.querySelector('number-txt')?.textContent === i + 1);
    });
  });
  it('adds schema with schema variant', async () => {
    const ldjson = document.head.querySelector('script[type="application/ld+json"]');
    expect(ldjson).to.exist;
    expect(ldjson.textContent).to.equal(JSON.stringify({
      '@context': 'http://schema.org',
      '@type': 'HowTo',
      name: 'Get started for free.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Get started for free.',
          itemListElement: {
            '@type': 'HowToDirection',
            text: 'Open Adobe Express for free on your desktop or mobile device to start creating your own quote.',
          },
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Explore templates',
          itemListElement: {
            '@type': 'HowToDirection',
            text: 'Search for template types by your project needs such as presentation, infographic, topic, or color to get started. You can also begin your project from a blank canvas.',
          },
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Personalise your quote',
          itemListElement: {
            '@type': 'HowToDirection',
            text: 'Select Elements at the left of the menu in editor and choose from the wide collection bar, pie, and progress charts. Swap out the color schemes, fonts, and add your logo to make a design exactly as you envision it.',
          },
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Feature eye-catching imagery',
          itemListElement: {
            '@type': 'HowToDirection',
            text: 'Fill out the details of your chart. Add a legend, enter your numerical data, and watch as each section of your chart adjusts its proportions. Adjust the opacity of your chart design. Lock your chart to keep it in place as you continue editing the details in your project.',
          },
        },
        {
          '@type': 'HowToStep',
          position: 5,
          name: 'Download and share your creation.',
          itemListElement: {
            '@type': 'HowToDirection',
            text: 'Download your new chart design and share anywhere. Before wrapping things up, invite collaborators to co-edit your work. Go back anytime to make edits or add your chart to documents and presentations made in Adobe Express.',
          },
        },
      ],
    }));
  });
  it('decorates h2 headline + text', async () => {
    const bl = await init(blocks[1]);
    expect(bl.querySelector('div').classList.contains('text')).to.be.true;
    expect(bl.querySelector('div h2')).to.exist;
  });
});
