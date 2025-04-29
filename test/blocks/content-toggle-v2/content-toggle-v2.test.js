import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/content-toggle-v2/content-toggle-v2.js'),
  import('../../../express/code/scripts/utils.js'),
]); 
const { default: decorate, windowHelper} = imports[1];
const {decorateArea} = imports[2];

const testBody = await readFile({ path: './mocks/body.html' });

function removeMainDivDisplayNone() {
  // Get all style sheets
  const styleSheets = Array.from(document.styleSheets);
  
  // Find the main stylesheet
  const mainStylesheet = styleSheets.find(sheet => 
    sheet.href && sheet.href.includes('main.css')
  );

  if (mainStylesheet) {
    try {
      // Try to insert the new rule
      mainStylesheet.insertRule(`
        main > div {
          display: block !important;
        }
      `, mainStylesheet.cssRules.length);
    } catch (e) {
      console.error('Error modifying stylesheet:', e);
    }
  }
}

describe('Content Toggle V2', async () => {
  let contentToggleV2;
  before(() => { 
    window.isTestEnv = true;
    document.body.innerHTML = testBody;
    window.placeholders = { 'search-branch-links': 'https://adobesparkpost.app.link/c4bWARQhWAb' };
    contentToggleV2 = document.querySelector('.content-toggle-v2');
    removeMainDivDisplayNone();
  });

  it('should have all things', async () => {
    await decorateArea(document);
    await new Promise(resolve => setTimeout(resolve, 100));
    await decorate(contentToggleV2);
    
    // Wait for the decoration to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const carouselButtons = contentToggleV2.querySelectorAll('button.content-toggle-button');
    const carouselContainer = contentToggleV2.querySelector('.carousel-container');
    const carouselPlatform = carouselContainer?.querySelector('.carousel-platform');
    
    expect(carouselContainer).to.exist;
    expect(carouselPlatform).to.exist;
    expect(contentToggleV2.querySelectorAll('button.content-toggle-button')).lengthOf(9);
  });

  it('should handle keyboard navigation and activation', async () => {
    await decorateArea(document);
    await decorate(contentToggleV2);
    await new Promise(resolve => setTimeout(resolve, 100));

    const carouselButtons = contentToggleV2.querySelectorAll('button.content-toggle-button');
    const carouselPlatform = contentToggleV2.querySelector('.carousel-container .carousel-platform');

    // Test tab navigation
    carouselButtons[0].focus();
    expect(document.activeElement).to.equal(carouselButtons[0]);

    // Tab to button 4
    for (let i = 0; i < 4; i++) {
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        code: 'Tab',
        keyCode: 9,
        which: 9,
        bubbles: true,
        cancelable: true,
      });
      document.activeElement.dispatchEvent(tabEvent);
    }

    expect(document.activeElement).to.equal(carouselButtons[3]);

    // Test enter key activation
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true,
    });
    document.activeElement.dispatchEvent(enterEvent);

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(carouselPlatform.querySelector('.content-toggle-button.active')).to.equal(carouselButtons[3]);
  });
});
