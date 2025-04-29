import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/content-toggle-v2/content-toggle-v2.js'),
  import('../../../express/code/scripts/utils.js'),
]);

const { default: decorate, windowHelper} = imports[1];
const {decorateArea} = imports[2];
const testBody = await readFile({ path: './mocks/body.html' });

describe('Content Toggle V2', () => {
  let carouselPlatform;
  before(async () => {
    window.isTestEnv = true;
    document.body.innerHTML = testBody;
    const contentToggleV2 = document.querySelector('.content-toggle-v2');
    console.log(decorateArea);
    await decorateArea(document.body);
    await decorate(contentToggleV2);
  });
  afterEach(() => {
    window.placeholders = undefined;
  });

  it('should have all things', async () => {
    const contentToggleV2 = document.querySelector('.content-toggle-v2');
    expect(contentToggleV2).to.exist;
    setTimeout(() => {
      carouselPlatform = contentToggleV2.querySelector('.carousel-platform');
      expect(contentToggleV2.querySelector('.carousel-container')).to.exist;
      expect(carouselPlatform).to.exist;
      expect(contentToggleV2.querySelectorAll('button.content-toggle-button')).lengthOf(9);
    }, 100);

  });
  it('should toggle content ', async () => {
    const contentToggleV2 = document.querySelector('.content-toggle-v2');
    const carouselButtons = contentToggleV2.querySelectorAll('button.content-toggle-button');
   
    console.log(carouselPlatform);
    
    setTimeout(() => {
      carouselButtons[2].click(); 
      expect(carouselPlatform.querySelector('.content-toggle-button.active')).to.exist;
    }, 100);

  });

//   function decodeHTMLEntities(text) {
//     const textArea = document.createElement('textarea');
//     textArea.innerHTML = text;
//     return textArea.value;
//   }

//   it('should toggle submit button disabled based on input content', async () => {
//     for (const block of blocks) {
//       const cards = Array.from(block.querySelectorAll('.card'));
//       const card = cards[0];
//       const form = card.querySelector('.gen-ai-input-form');
//       const input = form.querySelector('input');
//       const button = form.querySelector('button');
//       const stub = sinon.stub(windowHelper, 'redirect');
//       expect(button.disabled).to.be.true;
//       const enterEvent = new KeyboardEvent('keyup', {
//         key: 'Enter',
//         code: 'Enter',
//         keyCode: 13,
//         which: 13,
//         bubbles: true,
//         cancelable: true,
//       });
//       input.dispatchEvent(enterEvent);
//       expect(button.disabled).to.be.true;
//       expect(stub.called).to.be.false;
//       form.dispatchEvent(new Event('submit'));
//       expect(stub.called).to.be.false;

//       input.value = 'test';
//       input.dispatchEvent(new Event('input'));
//       expect(button.disabled).to.be.false;

//       input.value = '';
//       input.dispatchEvent(new Event('input'));
//       expect(button.disabled).to.be.true;
//       input.value = 'fakeInput';
//       input.dispatchEvent(enterEvent);
//       expect(stub.called).to.be.true;
//       expect(decodeHTMLEntities(stub.firstCall.args[0])).to.equal(
//         decodeHTMLEntities('https://new.express.adobe.com/new?category=media&#x26;prompt=fakeInput&#x26;action=text+to+image&#x26;width=1080&#x26;height=1080'),
//       );

//       stub.restore();
//     }
//   });
});
