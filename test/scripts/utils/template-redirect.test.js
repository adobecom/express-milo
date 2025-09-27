import { expect } from '@esm-bundle/chai';
import {
  constructTargetPath,
} from '../../../express/code/scripts/utils/template-redirect.js';

describe('Template Redirect Utils', () => {
  describe('constructTargetPath', () => {
    it('should construct path with all parameters', () => {
      const mockGetConfig = () => ({
        locale: { prefix: '/us' },
      });

      const result = constructTargetPath('design', 'social-media', 'instagram', mockGetConfig);

      expect(result).to.equal('/us/express/templates/social-media/design');
    });

    it('should construct path with only topics', () => {
      const mockGetConfig = () => ({
        locale: { prefix: '/us' },
      });

      const result = constructTargetPath('design', null, null, mockGetConfig);

      expect(result).to.equal('/us/express/templates/design');
    });

    it('should construct path with only tasks', () => {
      const mockGetConfig = () => ({
        locale: { prefix: '/us' },
      });

      const result = constructTargetPath(null, 'social-media', null, mockGetConfig);

      expect(result).to.equal('/us/express/templates/social-media');
    });

    it('should construct path with only tasksx', () => {
      const mockGetConfig = () => ({
        locale: { prefix: '/us' },
      });

      const result = constructTargetPath(null, null, 'instagram', mockGetConfig);

      expect(result).to.equal('/us/express/templates/instagram');
    });

    it('should construct path with tasks and topics', () => {
      const mockGetConfig = () => ({
        locale: { prefix: '/us' },
      });

      const result = constructTargetPath('design', 'social-media', null, mockGetConfig);

      expect(result).to.equal('/us/express/templates/social-media/design');
    });

    it('should construct path with tasksx and topics', () => {
      const mockGetConfig = () => ({
        locale: { prefix: '/us' },
      });

      const result = constructTargetPath('design', null, 'instagram', mockGetConfig);

      expect(result).to.equal('/us/express/templates/instagram/design');
    });

    it('should construct root path when no parameters', () => {
      const mockGetConfig = () => ({
        locale: { prefix: '/us' },
      });

      const result = constructTargetPath(null, null, null, mockGetConfig);

      expect(result).to.equal('/us/express/templates/');
    });

    it('should sanitize topics with invalid characters', () => {
      const mockGetConfig = () => ({
        locale: { prefix: '/us' },
      });

      const result = constructTargetPath('design<script>', null, null, mockGetConfig);

      expect(result).to.equal('/us/express/templates/');
    });

    it('should sanitize tasks with invalid characters', () => {
      const mockGetConfig = () => ({
        locale: { prefix: '/us' },
      });

      const result = constructTargetPath(null, 'social-media"', null, mockGetConfig);

      expect(result).to.equal('/us/express/templates/');
    });

    it('should sanitize tasksx with invalid characters', () => {
      const mockGetConfig = () => ({
        locale: { prefix: '/us' },
      });

      const result = constructTargetPath(null, null, 'instagram<', mockGetConfig);

      expect(result).to.equal('/us/express/templates/');
    });

    it('should handle empty string parameters', () => {
      const mockGetConfig = () => ({
        locale: { prefix: '/us' },
      });

      const result = constructTargetPath("''", "''", "''", mockGetConfig);

      expect(result).to.equal('/us/express/templates/');
    });

    it('should handle different locale prefixes', () => {
      const mockGetConfig = () => ({
        locale: { prefix: '/fr' },
      });

      const result = constructTargetPath('design', 'social-media', null, mockGetConfig);

      expect(result).to.equal('/fr/express/templates/social-media/design');
    });

    it('should handle special characters in sanitization', () => {
      const mockGetConfig = () => ({
        locale: { prefix: '/us' },
      });

      const testCases = [
        { input: 'test\'', expected: '/us/express/templates/' },
        { input: 'test"', expected: '/us/express/templates/' },
        { input: 'test<', expected: '/us/express/templates/' },
        { input: 'test>', expected: '/us/express/templates/' },
        { input: 'test?', expected: '/us/express/templates/' },
        { input: 'test.', expected: '/us/express/templates/' },
        { input: 'test;', expected: '/us/express/templates/' },
        { input: 'test{', expected: '/us/express/templates/' },
        { input: 'test}', expected: '/us/express/templates/' },
        { input: 'valid-test', expected: '/us/express/templates/valid-test' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = constructTargetPath(input, null, null, mockGetConfig);
        expect(result).to.equal(expected);
      });
    });
  });

  describe('redirectToExistingPage', () => {
    it('should be a function', () => {
      expect(redirectToExistingPage).to.be.a('function');
    });

    it('should handle URLSearchParams proxy correctly', () => {
      const searchParams = new URLSearchParams('?topics=design&tasks=social-media&searchId=123');
      const proxy = new Proxy(searchParams, { get: (params, prop) => params.get(prop) });

      expect(proxy.topics).to.equal('design');
      expect(proxy.tasks).to.equal('social-media');
      expect(proxy.searchId).to.equal('123');
      expect(proxy.nonexistent).to.be.null;
    });
  });
});
