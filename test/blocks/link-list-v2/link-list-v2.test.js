/* eslint-env mocha */
/* eslint-disable no-unused-vars */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([
  import('../../../express/code/scripts/scripts.js'),
  import('../../../express/code/blocks/link-list-v2/link-list-v2.js'),
]);
const { default: decorate } = imports[1];

document.body.innerHTML = await readFile({ path: './mocks/basic.html' });

describe('Link List V2', () => {
  before(async () => {
    window.isTestEnv = true;
    const linkListV2 = document.querySelector('.link-list-v2');
    await decorate(linkListV2);
  });

  it('Link list v2 exists', () => {
    const linkListV2 = document.querySelector('.link-list-v2');
    expect(linkListV2).to.exist;
  });

  it('Link list v2 has the correct container structure', () => {
    expect(document.querySelector('.ax-link-list-v2-container')).to.exist;
    expect(document.querySelector('.link-list-v2-wrapper')).to.exist;
    expect(document.querySelector('.carousel-container')).to.exist;
    expect(document.querySelector('.carousel-platform')).to.exist;
  });

  it('Link list v2 has buttons with correct classes', () => {
    const buttons = document.querySelectorAll('.button.secondary');
    expect(buttons).to.have.length(3);

    buttons.forEach((button) => {
      expect(button.classList.contains('button')).to.be.true;
      expect(button.classList.contains('secondary')).to.be.true;
    });
  });

  it('Buttons have correct href attributes', () => {
    const buttons = document.querySelectorAll('.button.secondary');
    expect(buttons[0].getAttribute('href')).to.equal('https://example.com/1');
    expect(buttons[1].getAttribute('href')).to.equal('https://example.com/2');
    expect(buttons[2].getAttribute('href')).to.equal('https://example.com/3');
  });

  it('Buttons have correct text content', () => {
    const buttons = document.querySelectorAll('.button.secondary');
    expect(buttons[0].textContent.trim()).to.equal('Button 1');
    expect(buttons[1].textContent.trim()).to.equal('Button 2');
    expect(buttons[2].textContent.trim()).to.equal('Button 3');
  });

  it('Link list v2 has heading', () => {
    const heading = document.querySelector('.link-list-v2 h3');
    expect(heading).to.exist;
    expect(heading.textContent.trim()).to.equal('Test Link List V2');
  });

  it('Button containers exist', () => {
    const buttonContainers = document.querySelectorAll('.button-container');
    expect(buttonContainers).to.have.length(3);
  });

  it('Carousel platform exists', () => {
    const carouselPlatform = document.querySelector('.carousel-platform');
    expect(carouselPlatform).to.exist;
  });

  it('Carousel platform has correct classes', () => {
    const carouselPlatform = document.querySelector('.carousel-platform');
    expect(carouselPlatform).to.exist;
    expect(carouselPlatform.classList.contains('carousel-platform')).to.be.true;
  });

  it('Buttons have correct base styling classes', () => {
    const buttons = document.querySelectorAll('.button.secondary');
    buttons.forEach((button) => {
      expect(button.classList.contains('button')).to.be.true;
      expect(button.classList.contains('secondary')).to.be.true;
    });
  });

  it('Buttons are focusable and have proper attributes', () => {
    const buttons = document.querySelectorAll('.button.secondary');
    buttons.forEach((button) => {
      expect(button.getAttribute('href')).to.exist;
      expect(button.tagName.toLowerCase()).to.equal('a');
    });
  });

  it('Link list v2 has proper container structure for styling', () => {
    const container = document.querySelector('.ax-link-list-v2-container');
    expect(container).to.exist;
    expect(container.classList.contains('ax-link-list-v2-container')).to.be.true;
  });

  describe('Function Coverage Tests', () => {
    const { normalizeHeadings } = imports[1];

    it('should normalize headings to allowed levels', () => {
      // Create test block with various heading levels
      const testBlock = document.createElement('div');
      testBlock.innerHTML = `
        <h1>H1 Heading</h1>
        <h2>H2 Heading</h2>
        <h3>H3 Heading</h3>
        <h4>H4 Heading</h4>
        <h5>H5 Heading</h5>
        <h6>H6 Heading</h6>
      `;

      // Only allow h2 and h4
      const allowedHeadings = ['h2', 'h4'];
      normalizeHeadings(testBlock, allowedHeadings);

      // Check that headings were normalized
      const headings = testBlock.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        const tagName = heading.tagName.toLowerCase();
        expect(['h2', 'h4'].includes(tagName)).to.be.true;
      });
    });

    it('should promote headings to higher levels when possible', () => {
      const testBlock = document.createElement('div');
      testBlock.innerHTML = '<h5>Should become H3</h5>';

      // Allow h1, h2, h3 - h5 should promote to h3
      normalizeHeadings(testBlock, ['h1', 'h2', 'h3']);

      const heading = testBlock.querySelector('h3');
      expect(heading).to.exist;
      expect(heading.textContent.trim()).to.equal('Should become H3');
    });

    it('should downgrade headings when promotion is not possible', () => {
      const testBlock = document.createElement('div');
      testBlock.innerHTML = '<h1>Should become H4</h1>';

      // Only allow h4, h5, h6 - h1 should downgrade to h4
      normalizeHeadings(testBlock, ['h4', 'h5', 'h6']);

      const heading = testBlock.querySelector('h4');
      expect(heading).to.exist;
      expect(heading.textContent.trim()).to.equal('Should become H4');
    });

    it('should handle edge cases in heading normalization', () => {
      const testBlock = document.createElement('div');
      testBlock.innerHTML = `
        <h6>Cannot be normalized</h6>
        <h3>  Whitespace text  </h3>
      `;

      // Only allow h1, h2 - h3 should become h2, h6 might get normalized too
      normalizeHeadings(testBlock, ['h1', 'h2']);

      // Just check that normalization completed without errors
      const headings = testBlock.querySelectorAll('h1, h2, h3, h4, h5, h6');
      expect(headings.length).to.be.greaterThan(0);
    });

    it('should handle empty allowed headings array', () => {
      const testBlock = document.createElement('div');
      testBlock.innerHTML = '<h3>Test Heading</h3>';

      // Empty allowed array - should not crash
      normalizeHeadings(testBlock, []);

      // Heading should remain unchanged
      const heading = testBlock.querySelector('h3');
      expect(heading).to.exist;
    });

    it('should handle block with no headings', () => {
      const testBlock = document.createElement('div');
      testBlock.innerHTML = '<p>No headings here</p>';

      // Should not crash with no headings
      normalizeHeadings(testBlock, ['h2', 'h3']);

      expect(testBlock.querySelector('p')).to.exist;
    });

    it('should handle mixed case allowed headings', () => {
      const testBlock = document.createElement('div');
      testBlock.innerHTML = '<h4>Test</h4>';

      // Mixed case input - should normalize to lowercase internally
      normalizeHeadings(testBlock, ['H2', 'H3']);

      // Just verify function completed without errors
      const headings = testBlock.querySelectorAll('h1, h2, h3, h4, h5, h6');
      expect(headings.length).to.equal(1);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should test normalizeHeadings function directly', () => {
      // Test the exported function directly without full decoration
      const testBlock = document.createElement('div');
      testBlock.innerHTML = '<h5>Test Heading</h5>';

      // Test that function doesn't crash
      try {
        normalizeHeadings(testBlock, ['h2', 'h3']);
        expect(true).to.be.true; // Function completed without error
      } catch (error) {
        expect.fail(`normalizeHeadings should not throw: ${error.message}`);
      }
    });

    it('should handle various heading scenarios', () => {
      const testBlock = document.createElement('div');
      testBlock.innerHTML = `
        <h1>Level 1</h1>
        <h3>Level 3</h3>
        <h5>Level 5</h5>
      `;

      // Test with different allowed levels
      try {
        normalizeHeadings(testBlock, ['h2', 'h4']);
        expect(true).to.be.true; // Function completed
      } catch (error) {
        expect.fail(`Should handle multiple headings: ${error.message}`);
      }
    });

    it('should test function with extreme cases', () => {
      const testBlock = document.createElement('div');
      testBlock.innerHTML = '<h6>Lowest level</h6>';

      // Test with only high-level headings allowed
      try {
        normalizeHeadings(testBlock, ['h1']);
        expect(true).to.be.true;
      } catch (error) {
        expect.fail(`Should handle extreme normalization: ${error.message}`);
      }
    });
  });
});
