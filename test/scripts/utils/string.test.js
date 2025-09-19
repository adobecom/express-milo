/* eslint-env mocha */
import { expect } from '@esm-bundle/chai';
import { titleCase } from '../../../express/code/scripts/utils/string.js';

describe('String Utils', () => {
  describe('titleCase', () => {
    it('should convert single word to title case', () => {
      expect(titleCase('hello')).to.equal('Hello');
      expect(titleCase('WORLD')).to.equal('World');
      expect(titleCase('tEsT')).to.equal('Test');
    });

    it('should convert multiple words to title case', () => {
      expect(titleCase('hello world')).to.equal('Hello World');
      expect(titleCase('adobe express templates')).to.equal('Adobe Express Templates');
      expect(titleCase('MULTIPLE UPPERCASE WORDS')).to.equal('Multiple Uppercase Words');
      expect(titleCase('mixed CaSe WoRdS')).to.equal('Mixed Case Words');
    });

    it('should handle edge cases', () => {
      expect(titleCase('')).to.equal('');
      expect(titleCase(null)).to.equal('');
      expect(titleCase(undefined)).to.equal('');
    });

    it('should handle special characters and numbers', () => {
      expect(titleCase('hello-world')).to.equal('Hello-world');
      expect(titleCase('test123 item')).to.equal('Test123 Item');
      expect(titleCase('item with spaces')).to.equal('Item With Spaces');
      expect(titleCase('  extra  spaces  ')).to.equal('  Extra  Spaces  ');
    });

    it('should handle single characters', () => {
      expect(titleCase('a')).to.equal('A');
      expect(titleCase('z')).to.equal('Z');
      expect(titleCase('1')).to.equal('1');
    });

    it('should preserve existing spacing', () => {
      expect(titleCase('word1   word2')).to.equal('Word1   Word2');
      expect(titleCase('start middle end')).to.equal('Start Middle End');
    });
  });
});
