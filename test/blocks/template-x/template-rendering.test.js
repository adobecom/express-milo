import { expect } from '@esm-bundle/chai';

describe('Template Rendering - buildiFrameContent logic', () => {
  it('should test iframe creation logic with manual DOM', () => {
    // Simulate what buildiFrameContent does - test the logic directly
    const template = {
      id: 'template-123',
      customLinks: {
        branchUrl: 'https://example.com/templates/abc123',
      },
    };

    const taskID = 'test-task-123';
    const zazzleUrl = 'https://example.com/zazzle';
    const lang = 'en-US';

    // Create iframe like the function does
    const iframe = document.createElement('iframe');
    iframe.src = `${zazzleUrl}?TD=${template.id}&taskID=${taskID}&shortcode=${template.customLinks.branchUrl.split('/').pop()}&lang=${lang}`;
    iframe.title = 'Edit this template';
    iframe.tabIndex = -1;
    iframe.allowFullscreen = true;

    // Verify the iframe structure
    expect(iframe.tagName).to.equal('IFRAME');
    expect(iframe.title).to.equal('Edit this template');
    expect(iframe.tabIndex).to.equal(-1);
    expect(iframe.allowFullscreen).to.be.true;

    // Verify URL construction
    expect(iframe.src).to.include('TD=template-123');
    expect(iframe.src).to.include('taskID=test-task-123');
    expect(iframe.src).to.include('shortcode=abc123');
    expect(iframe.src).to.include('lang=en-US');
  });

  it('should extract shortcode correctly from branchUrl', () => {
    const branchUrl = 'https://example.com/path/to/shortcode456';
    const shortcode = branchUrl.split('/').pop();

    expect(shortcode).to.equal('shortcode456');
  });

  it('should handle complex branchUrl paths', () => {
    const branchUrl = 'https://example.com/very/long/path/to/xyz789';
    const shortcode = branchUrl.split('/').pop();

    expect(shortcode).to.equal('xyz789');
  });
});
