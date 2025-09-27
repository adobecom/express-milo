import { expect } from '@esm-bundle/chai';

describe('All Templates Metadata', () => {
  let mockFetch;

  beforeEach(() => {
    // Mock window.location.search
    window.location.search = '';

    // Mock fetch
    mockFetch = (url) => {
      if (url.includes('templates-dev.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [{ id: 'dev-template' }] }),
        });
      }
      if (url.includes('metadata.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [{ id: 'prod-template' }] }),
        });
      }
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve(null),
      });
    };

    window.fetch = mockFetch;
  });

  it('should fetch templates metadata for production environment', async () => {
    const { default: fetchAllTemplatesMetadata } = await import('../../../express/code/scripts/utils/all-templates-metadata.js');

    const mockGetConfig = () => ({
      locale: { prefix: '/us' },
      env: { name: 'prod' },
    });

    const result = await fetchAllTemplatesMetadata(mockGetConfig);

    expect(result).to.deep.equal([{ id: 'prod-template' }]);
  });

  it('should use different locale prefix', async () => {
    const { default: fetchAllTemplatesMetadata } = await import('../../../express/code/scripts/utils/all-templates-metadata.js');

    const mockGetConfig = () => ({
      locale: { prefix: '/fr' },
      env: { name: 'prod' },
    });

    const result = await fetchAllTemplatesMetadata(mockGetConfig);

    expect(result).to.deep.equal([{ id: 'prod-template' }]);
  });

  it('should handle case sensitivity in dev parameter', async () => {
    window.location.search = '?dev=TRUE';

    const { default: fetchAllTemplatesMetadata } = await import('../../../express/code/scripts/utils/all-templates-metadata.js');

    const mockGetConfig = () => ({
      locale: { prefix: '/us' },
      env: { name: 'stage' },
    });

    const result = await fetchAllTemplatesMetadata(mockGetConfig);

    // Should not match because includes() is case sensitive
    expect(result).to.deep.equal([{ id: 'prod-template' }]);
  });

  it('should return cached result on subsequent calls', async () => {
    const { default: fetchAllTemplatesMetadata } = await import('../../../express/code/scripts/utils/all-templates-metadata.js');

    const mockGetConfig = () => ({
      locale: { prefix: '/us' },
      env: { name: 'prod' },
    });

    // First call
    const result1 = await fetchAllTemplatesMetadata(mockGetConfig);
    expect(result1).to.deep.equal([{ id: 'prod-template' }]);

    // Second call should return cached result
    const result2 = await fetchAllTemplatesMetadata(mockGetConfig);
    expect(result2).to.deep.equal([{ id: 'prod-template' }]);
    expect(result1).to.deep.equal(result2);
  });
});
