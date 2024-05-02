import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import sinon from 'sinon';
import init from '../../../express/blocks/frictionless-quick-action/frictionless-quick-action.js';
import { mockRes } from '../test-utilities.js';

document.body.innerHTML = await readFile({ path: './mocks/crop-image-quick-action.html' });
const ogFetch = window.fetch;

describe('Frictionless Quick Action Block', () => {
  it('initializes correctly', async () => {
    window.fetch = sinon.stub().callsFake(() => mockRes({
      payload: {
        data: [
          {
            Key: 'free-plan-check-1',
            Text: 'Free use forever',
          },
          {
            Key: 'free-plan-check-2',
            Text: 'No credit card required',
          },
        ],
      },
    }));

    const block = document.body.querySelector('.frictionless-quick-action');
    await init(block);
    const title = block.querySelector(':scope h1');
    const text = block.querySelector('div:nth-child(1) p');
    expect(title).to.not.be.null;
    expect(title.textContent).to.be.equal('Crop your image for free.');
    expect(text).to.not.be.null;
    expect(text.textContent).to.be.equal('The online Crop image tool from Adobe Express transforms your images into the perfect size in seconds.');
    const video = block.querySelector('div:nth-child(2) > div:nth-child(1) video');
    expect(video).to.not.be.null;
    const dropzone = block.querySelector('div:nth-child(2) > div:nth-child(2) .dropzone');
    const dropzoneTitle = dropzone.querySelector(':scope > h4');
    expect(dropzoneTitle.textContent).to.be.equal('Drag and drop an image or browse to upload.');
    const freePlanTexts = dropzone.querySelectorAll(':scope .plan-widget-tag');
    expect(freePlanTexts.length).to.be.equal(2);

    window.fetch = ogFetch;
  });

  it('sdk starts on file drop', async () => {
    const block = document.body.querySelector('.frictionless-quick-action');
    init(block);
    const dropzoneContainer = block.querySelector(':scope .dropzone-container');
    const file = new File([''], 'test', { type: 'image/png' });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const event = new DragEvent('drop', { dataTransfer });
    const callback = function cb(mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'SCRIPT') {
              // eslint-disable-next-line no-console
              console.log('A new script tag was added:', node);
              const script = document.querySelector('head > script[src="https://sdk.cc-embed.adobe.com/v3/CCEverywhere.js"]');
              expect(script).to.not.be.null;
              observer.disconnect();
            }
          });
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(document.head, { childList: true, subtree: true });
    dropzoneContainer.dispatchEvent(event);
  });
});
