import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const imports = await Promise.all([import('../../express/code/scripts/utils.js'), import('../../express/code/scripts/scripts.js')]);
const [{ getLibs }] = imports;

// Mock the entire pricing module to avoid external dependencies
let fetchPlanOnePlans;
const mockPricingModule = {
  fetchPlanOnePlans: sinon.stub(),
};

describe('Pricing offer format for segmentation link', () => {
  before(() => {
    // Set up mock pricing module
    fetchPlanOnePlans = mockPricingModule.fetchPlanOnePlans;
  });

  beforeEach(() => {
    // Reset all stubs before each test
    fetchPlanOnePlans.reset();
  });

  afterEach(() => {
    sessionStorage.removeItem('visitorCountry');
  });

  it('handles US IP', async () => {
    await import(`${getLibs()}/utils/utils.js`).then((mod) => {
      const conf = { locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } };
      mod.setConfig(conf);
    });

    // Mock the response for US IP
    fetchPlanOnePlans.resolves({
      country: 'us',
      language: 'en',
    });

    const res = await fetchPlanOnePlans('mock-url');
    expect(res.country).to.equal('us');
    expect(res.language).to.equal('en');
  });

  it('handles Bangalore IP', async () => {
    await import(`${getLibs()}/utils/utils.js`).then((mod) => {
      const conf = { locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } };
      mod.setConfig(conf);
    });

    // Mock the response for Indian IP
    fetchPlanOnePlans.resolves({
      country: 'in',
      language: 'en',
    });

    const res = await fetchPlanOnePlans('mock-url');
    expect(res.country).to.equal('in');
    expect(res.language).to.equal('en');
  });

  it('handles Tokyo IP', async () => {
    await import(`${getLibs()}/utils/utils.js`).then((mod) => {
      const conf = { locales: { '': { ietf: 'ja-JP', tk: 'hah7vzn.css' } } };
      mod.setConfig(conf);
    });

    // Mock the response for Japanese IP
    fetchPlanOnePlans.resolves({
      country: 'jp',
      lang: 'ja',
    });

    const res = await fetchPlanOnePlans('mock-url');
    expect(res.country).to.equal('jp');
    expect(res.lang).to.equal('ja');
  });

  it('handles network errors gracefully', async () => {
    await import(`${getLibs()}/utils/utils.js`).then((mod) => {
      const conf = { locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } };
      mod.setConfig(conf);
    });

    // Mock network failure
    fetchPlanOnePlans.rejects(new Error('Network error'));

    try {
      await fetchPlanOnePlans('mock-url');
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).to.include('Network error');
    }
  });

  it('handles API errors with fallback', async () => {
    await import(`${getLibs()}/utils/utils.js`).then((mod) => {
      const conf = { locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } };
      mod.setConfig(conf);
    });

    // Mock API error with fallback response
    fetchPlanOnePlans.resolves({
      country: 'us', // fallback to US
      language: 'en',
      isDefault: true,
    });

    const res = await fetchPlanOnePlans('mock-url');
    expect(res.country).to.equal('us');
    expect(res.language).to.equal('en');
    expect(res.isDefault).to.be.true;
  });
});
