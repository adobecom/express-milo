import { expect } from '@esm-bundle/chai';
import {
  populateStars,
  hasRated,
  determineActionUsed,
  buildSchema,
  updateSliderStyle,
  RATINGS_CONFIG,
} from '../../../express/code/scripts/utils/ratings-utils.js';

describe('Ratings Utils', () => {
  describe('populateStars', () => {
    it('should create the correct number of stars', () => {
      const parent = document.createElement('div');
      const count = 5;
      const starType = 'star';

      populateStars(count, starType, parent);

      expect(parent.children.length).to.equal(count);
    });

    it('should handle zero count', () => {
      const parent = document.createElement('div');
      const count = 0;
      const starType = 'star';

      populateStars(count, starType, parent);

      expect(parent.children.length).to.equal(0);
    });

    it('should handle different star types', () => {
      const parent = document.createElement('div');
      const count = 3;
      const starType = 'star-half';

      populateStars(count, starType, parent);

      expect(parent.children.length).to.equal(count);
    });
  });

  describe('hasRated', () => {
    it('should return false for new sheet', () => {
      const result = hasRated('new-sheet');
      expect(result).to.be.false;
    });

    it('should return true for previously rated sheet', () => {
      // Set up localStorage with rated sheet
      localStorage.setItem('ccxActionRatings', 'test-sheet,other-sheet');

      const result = hasRated('test-sheet');
      expect(result).to.be.true;

      // Clean up
      localStorage.removeItem('ccxActionRatings');
    });

    it('should handle empty localStorage', () => {
      const result = hasRated('test-sheet');
      expect(result).to.be.false;
    });
  });

  describe('determineActionUsed', () => {
    it('should return correct action for segments', () => {
      const segments = 'action1,action2,action3';
      const result = determineActionUsed(segments);
      expect(result).to.be.a('boolean');
    });

    it('should handle empty segments', () => {
      const result = determineActionUsed('');
      expect(result).to.be.a('boolean');
    });

    it('should handle null segments', () => {
      const result = determineActionUsed(null);
      expect(result).to.be.a('boolean');
    });
  });

  describe('buildSchema', () => {
    it('should handle null values', () => {
      const result = buildSchema(null, null);
      expect(result).to.be.undefined;
    });

    it('should handle zero values', () => {
      const result = buildSchema(0, 0);
      expect(result).to.be.undefined;
    });
  });

  describe('updateSliderStyle', () => {
    it('should handle null block', () => {
      const value = 50;

      expect(() => updateSliderStyle(null, value)).to.throw();
    });

    it('should handle zero value', () => {
      const block = document.createElement('div');
      const value = 0;

      expect(() => updateSliderStyle(block, value)).to.throw();
    });
  });

  describe('RATINGS_CONFIG', () => {
    it('should be defined', () => {
      expect(RATINGS_CONFIG).to.be.an('array');
    });

    it('should have config items', () => {
      expect(RATINGS_CONFIG.length).to.be.greaterThan(0);
    });
  });
});
