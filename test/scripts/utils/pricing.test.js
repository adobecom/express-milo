import { expect } from '@esm-bundle/chai';
import {
  getCurrency,
  formatPrice,
  getOfferOnePlans,
  fetchPlanOnePlans,
  shallSuppressOfferEyebrowText,
  buildUrl,
  formatDynamicCartLink,
} from '../../../express/code/scripts/utils/pricing.js';

describe('Pricing Utils', () => {
  let originalFetch;
  let originalGetCountry;

  beforeEach(() => {
    // Save original values
    originalFetch = window.fetch;
    originalGetCountry = window.getCountry;

    // Mock window.fetch
    window.fetch = () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        data: [
          {
            id: 'plan1',
            name: 'Basic Plan',
            price: 9.99,
            currency: 'USD',
          },
          {
            id: 'plan2',
            name: 'Pro Plan',
            price: 19.99,
            currency: 'USD',
          },
        ],
      }),
    });

    // Mock getCountry
    window.getCountry = () => 'us';
  });

  afterEach(() => {
    // Restore original values
    window.fetch = originalFetch;
    window.getCountry = originalGetCountry;
  });

  describe('getCurrency', () => {
    it('should return correct currency for known countries', () => {
      expect(getCurrency('us')).to.equal('USD');
      expect(getCurrency('gb')).to.equal('GBP');
      expect(getCurrency('uk')).to.equal('GBP');
      expect(getCurrency('de')).to.equal('EUR');
      expect(getCurrency('fr')).to.equal('EUR');
      expect(getCurrency('jp')).to.equal('JPY');
      expect(getCurrency('ca')).to.equal('CAD');
      expect(getCurrency('au')).to.equal('AUD');
    });

    it('should return USD for unknown countries', () => {
      expect(getCurrency('unknown')).to.equal('USD');
      expect(getCurrency('xyz')).to.equal('USD');
    });

    it('should handle undefined country', () => {
      expect(getCurrency(undefined)).to.equal('USD');
    });

    it('should handle null country', () => {
      expect(getCurrency(null)).to.equal('USD');
    });

    it('should handle empty string country', () => {
      expect(getCurrency('')).to.equal('USD');
    });

    it('should handle case sensitivity', () => {
      expect(getCurrency('US')).to.equal('USD');
      expect(getCurrency('GB')).to.equal('GBP');
      expect(getCurrency('DE')).to.equal('EUR');
    });
  });

  describe('formatPrice', () => {
    it('should format USD prices correctly', async () => {
      const result = await formatPrice(9.99, 'USD');
      expect(result).to.equal('$9.99');
    });

    it('should format EUR prices correctly', async () => {
      const result = await formatPrice(9.99, 'EUR');
      expect(result).to.equal('€9.99');
    });

    it('should format GBP prices correctly', async () => {
      const result = await formatPrice(9.99, 'GBP');
      expect(result).to.equal('£9.99');
    });

    it('should format JPY prices correctly', async () => {
      const result = await formatPrice(999, 'JPY');
      expect(result).to.equal('¥999');
    });

    it('should handle zero price', async () => {
      const result = await formatPrice(0, 'USD');
      expect(result).to.equal('$0.00');
    });

    it('should handle negative price', async () => {
      const result = await formatPrice(-9.99, 'USD');
      expect(result).to.equal('-$9.99');
    });

    it('should handle large numbers', async () => {
      const result = await formatPrice(9999.99, 'USD');
      expect(result).to.equal('$9,999.99');
    });

    it('should handle decimal places correctly', async () => {
      const result = await formatPrice(9.9, 'USD');
      expect(result).to.equal('$9.90');
    });

    it('should handle unknown currency', async () => {
      const result = await formatPrice(9.99, 'UNKNOWN');
      expect(result).to.equal('$9.99'); // Falls back to USD format
    });

    it('should handle undefined currency', async () => {
      const result = await formatPrice(9.99, undefined);
      expect(result).to.equal('$9.99'); // Falls back to USD format
    });
  });

  describe('getOfferOnePlans', () => {
    it('should return a function', () => {
      expect(getOfferOnePlans).to.be.a('function');
    });

    it('should return cached data on subsequent calls', () => {
      const result1 = getOfferOnePlans();
      const result2 = getOfferOnePlans();
      expect(result1).to.equal(result2);
    });

    it('should return an array', () => {
      const result = getOfferOnePlans();
      expect(result).to.be.an('array');
    });
  });

  describe('fetchPlanOnePlans', () => {
    it('should be a function', () => {
      expect(fetchPlanOnePlans).to.be.a('function');
    });

    it('should fetch and return plan data', async () => {
      const result = await fetchPlanOnePlans('https://example.com/plans');
      expect(result).to.be.an('array');
      expect(result).to.have.length(2);
      expect(result[0]).to.have.property('id', 'plan1');
      expect(result[0]).to.have.property('name', 'Basic Plan');
      expect(result[0]).to.have.property('price', 9.99);
    });

    it('should handle fetch errors', async () => {
      window.fetch = () => Promise.reject(new Error('Network error'));

      const result = await fetchPlanOnePlans('https://example.com/plans');
      expect(result).to.be.null;
    });

    it('should handle non-ok response', async () => {
      window.fetch = () => Promise.resolve({
        ok: false,
        status: 404,
      });

      const result = await fetchPlanOnePlans('https://example.com/plans');
      expect(result).to.be.null;
    });

    it('should handle empty response', async () => {
      window.fetch = () => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      });

      const result = await fetchPlanOnePlans('https://example.com/plans');
      expect(result).to.be.an('array');
      expect(result).to.have.length(0);
    });

    it('should handle missing data property', async () => {
      window.fetch = () => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const result = await fetchPlanOnePlans('https://example.com/plans');
      expect(result).to.be.null;
    });
  });

  describe('shallSuppressOfferEyebrowText', () => {
    it('should return false for unknown offer IDs', () => {
      expect(shallSuppressOfferEyebrowText('unknown')).to.be.false;
    });

    it('should return false for undefined offer ID', () => {
      expect(shallSuppressOfferEyebrowText(undefined)).to.be.false;
    });

    it('should return false for null offer ID', () => {
      expect(shallSuppressOfferEyebrowText(null)).to.be.false;
    });

    it('should return false for empty string offer ID', () => {
      expect(shallSuppressOfferEyebrowText('')).to.be.false;
    });

    it('should return false for offer ID that is not in suppress map', () => {
      expect(shallSuppressOfferEyebrowText('offer123')).to.be.false;
    });
  });

  describe('buildUrl', () => {
    let mockGetConfig;

    beforeEach(() => {
      mockGetConfig = () => ({
        locale: {
          prefix: '/us',
          ietf: 'en-US',
        },
        env: {
          name: 'prod',
        },
        commerce: {
          checkout: {
            url: 'https://commerce.adobe.com/checkout',
          },
        },
      });
    });

    it('should build URL with all parameters', () => {
      const result = buildUrl('https://example.com/plan', 'us', 'en', mockGetConfig, 'offer123');
      expect(result).to.include('https://example.com/plan');
      expect(result).to.include('country=us');
      expect(result).to.include('language=en');
      expect(result).to.include('offerId=offer123');
    });

    it('should build URL without offer ID', () => {
      const result = buildUrl('https://example.com/plan', 'us', 'en', mockGetConfig);
      expect(result).to.include('https://example.com/plan');
      expect(result).to.include('country=us');
      expect(result).to.include('language=en');
      expect(result).to.not.include('offerId');
    });

    it('should handle empty offer ID', () => {
      const result = buildUrl('https://example.com/plan', 'us', 'en', mockGetConfig, '');
      expect(result).to.include('https://example.com/plan');
      expect(result).to.include('country=us');
      expect(result).to.include('language=en');
      expect(result).to.not.include('offerId');
    });

    it('should handle undefined parameters', () => {
      const result = buildUrl('https://example.com/plan', undefined, undefined, mockGetConfig);
      expect(result).to.include('https://example.com/plan');
      expect(result).to.include('country=');
      expect(result).to.include('language=');
    });

    it('should handle null parameters', () => {
      const result = buildUrl('https://example.com/plan', null, null, mockGetConfig);
      expect(result).to.include('https://example.com/plan');
      expect(result).to.include('country=');
      expect(result).to.include('language=');
    });

    it('should handle missing getConfig', () => {
      expect(() => buildUrl('https://example.com/plan', 'us', 'en', null)).to.throw();
    });

    it('should handle missing commerce config', () => {
      const mockGetConfigNoCommerce = () => ({
        locale: { prefix: '/us', ietf: 'en-US' },
        env: { name: 'prod' },
        // No commerce property
      });

      expect(() => buildUrl('https://example.com/plan', 'us', 'en', mockGetConfigNoCommerce)).to.throw();
    });
  });

  describe('formatDynamicCartLink', () => {
    it('should be a function', () => {
      expect(formatDynamicCartLink).to.be.a('function');
    });
  });
});
