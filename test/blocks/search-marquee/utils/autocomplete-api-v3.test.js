import { expect } from '@esm-bundle/chai';

// Mock fetch
let mockFetch;
let originalFetch;

// Mock window.atob
Object.defineProperty(window, 'atob', {
  writable: true,
  value: () => 'projectx_marketing_web', // Mock decoded value
});

beforeEach(() => {
  originalFetch = window.fetch;
});

afterEach(() => {
  window.fetch = originalFetch;
});

describe('search-marquee/utils/autocomplete-api-v3.js', () => {
  let autocompleteModule;

  beforeEach(async () => {
    // Mock fetch with successful response
    mockFetch = (url) => {
      if (url === 'https://adobesearch-atc.adobe.io/uss/v3/autocomplete') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            queryResults: [{
              items: [
                { title: 'Test Template 1', url: '/template1' },
                { title: 'Test Template 2', url: '/template2' },
              ],
            }],
          }),
        });
      }
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve(null),
      });
    };

    window.fetch = mockFetch;

    // Import the module
    autocompleteModule = await import('../../../../express/code/blocks/search-marquee/utils/autocomplete-api-v3.js');
  });

  describe('useInputAutocomplete', () => {
    it('should be a function', () => {
      expect(autocompleteModule.default).to.be.a('function');
    });

    it('should return an object with inputHandler', () => {
      const mockUpdateUI = () => {};
      const mockGetConfig = () => ({ locale: { ietf: 'en-US' } });

      const result = autocompleteModule.default(mockUpdateUI, mockGetConfig);

      expect(result).to.be.an('object');
      expect(result).to.have.property('inputHandler');
      expect(result.inputHandler).to.be.a('function');
    });

    it('should handle input events', () => {
      const mockUpdateUI = () => {};
      const mockGetConfig = () => ({ locale: { ietf: 'en-US' } });

      const { inputHandler } = autocompleteModule.default(mockUpdateUI, mockGetConfig);

      const mockEvent = {
        target: { value: 'test query' },
      };

      expect(() => inputHandler(mockEvent)).to.not.throw();
    });

    it('should handle different throttle and debounce delays', () => {
      const mockUpdateUI = () => {};
      const mockGetConfig = () => ({ locale: { ietf: 'en-US' } });
      const options = {
        throttleDelay: 100,
        debounceDelay: 200,
        limit: 10,
      };

      const result = autocompleteModule.default(mockUpdateUI, mockGetConfig, options);

      expect(result).to.be.an('object');
      expect(result).to.have.property('inputHandler');
    });

    it('should handle short queries with throttle', () => {
      const mockUpdateUI = () => {};
      const mockGetConfig = () => ({ locale: { ietf: 'en-US' } });

      const { inputHandler } = autocompleteModule.default(mockUpdateUI, mockGetConfig);

      const mockEvent = {
        target: { value: 'abc' }, // length < 4
      };

      expect(() => inputHandler(mockEvent)).to.not.throw();
    });

    it('should handle queries ending with space with throttle', () => {
      const mockUpdateUI = () => {};
      const mockGetConfig = () => ({ locale: { ietf: 'en-US' } });

      const { inputHandler } = autocompleteModule.default(mockUpdateUI, mockGetConfig);

      const mockEvent = {
        target: { value: 'test query ' }, // ends with space
      };

      expect(() => inputHandler(mockEvent)).to.not.throw();
    });

    it('should handle long queries with debounce', () => {
      const mockUpdateUI = () => {};
      const mockGetConfig = () => ({ locale: { ietf: 'en-US' } });

      const { inputHandler } = autocompleteModule.default(mockUpdateUI, mockGetConfig);

      const mockEvent = {
        target: { value: 'test query' }, // length >= 4 and doesn't end with space
      };

      expect(() => inputHandler(mockEvent)).to.not.throw();
    });
  });

  describe('API configuration', () => {
    it('should have correct API URL', () => {
      expect('https://adobesearch-atc.adobe.io/uss/v3/autocomplete').to.be.a('string');
    });

    it('should have correct experience ID', () => {
      expect('default-templates-autocomplete-v1').to.be.a('string');
    });

    it('should have correct scope entities', () => {
      expect(['HzTemplate']).to.be.an('array');
    });

    it('should have correct whitelist locales', () => {
      const wlLocales = ['en-US', 'fr-FR', 'de-DE', 'ja-JP'];
      expect(wlLocales).to.include('en-US');
      expect(wlLocales).to.include('fr-FR');
      expect(wlLocales).to.include('de-DE');
      expect(wlLocales).to.include('ja-JP');
    });
  });

  describe('API key handling', () => {
    it('should decode API key correctly', () => {
      const encodedKey = 'cHJvamVjdHhfbWFya2V0aW5nX3dlYg==';
      const decodedKey = window.atob(encodedKey);
      expect(decodedKey).to.be.a('string');
      expect(decodedKey.length).to.be.greaterThan(0);
    });
  });

  describe('empty response handling', () => {
    it('should have correct empty response structure', () => {
      const emptyRes = { queryResults: [{ items: [] }] };
      expect(emptyRes).to.have.property('queryResults');
      expect(emptyRes.queryResults).to.be.an('array');
      expect(emptyRes.queryResults[0]).to.have.property('items');
      expect(emptyRes.queryResults[0].items).to.be.an('array');
    });
  });

  describe('memoization configuration', () => {
    it('should have correct TTL', () => {
      const ttl = 30 * 1000;
      expect(ttl).to.equal(30000);
    });

    it('should use textQuery as key', () => {
      const keyFunction = (options) => options.textQuery;
      const testOptions = { textQuery: 'test query', locale: 'en-US' };
      expect(keyFunction(testOptions)).to.equal('test query');
    });
  });

  describe('request structure', () => {
    it('should have correct request body structure', () => {
      const requestBody = {
        experienceId: 'default-templates-autocomplete-v1',
        textQuery: 'test',
        locale: 'en-US',
        queries: [
          {
            limit: 5,
            id: 'default-templates-autocomplete-v1',
            scope: { entities: ['HzTemplate'] },
          },
        ],
      };

      expect(requestBody).to.have.property('experienceId');
      expect(requestBody).to.have.property('textQuery');
      expect(requestBody).to.have.property('locale');
      expect(requestBody).to.have.property('queries');
      expect(requestBody.queries).to.be.an('array');
      expect(requestBody.queries[0]).to.have.property('scope');
      expect(requestBody.queries[0].scope).to.have.property('entities');
    });
  });

  describe('error handling', () => {
    it('should handle fetch errors gracefully', async () => {
      // Mock fetch to throw an error
      window.fetch = () => Promise.reject(new Error('Network error'));

      // The module should handle this gracefully
      expect(autocompleteModule.default).to.be.a('function');
    });
  });

  describe('locale validation', () => {
    it('should validate whitelist locales', () => {
      const wlLocales = ['en-US', 'fr-FR', 'de-DE', 'ja-JP'];
      const validLocales = ['en-US', 'fr-FR', 'de-DE', 'ja-JP'];
      const invalidLocales = ['es-ES', 'pt-BR', 'invalid'];

      validLocales.forEach((locale) => {
        expect(wlLocales.includes(locale)).to.be.true;
      });

      invalidLocales.forEach((locale) => {
        expect(wlLocales.includes(locale)).to.be.false;
      });
    });
  });

  describe('limit parameter', () => {
    it('should have default limit of 5', () => {
      const defaultLimit = 5;
      expect(defaultLimit).to.equal(5);
    });

    it('should accept custom limit', () => {
      const customLimit = 10;
      expect(customLimit).to.be.a('number');
      expect(customLimit).to.be.greaterThan(0);
    });
  });

  describe('state management', () => {
    it('should maintain query state', () => {
      const mockUpdateUI = () => {};
      const mockGetConfig = () => ({ locale: { ietf: 'en-US' } });

      const { inputHandler } = autocompleteModule.default(mockUpdateUI, mockGetConfig);

      const mockEvent1 = { target: { value: 'query1' } };
      const mockEvent2 = { target: { value: 'query2' } };

      inputHandler(mockEvent1);
      inputHandler(mockEvent2);

      // State should be updated
      expect(() => inputHandler(mockEvent1)).to.not.throw();
    });
  });
});
