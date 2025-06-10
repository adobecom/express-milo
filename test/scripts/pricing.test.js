import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { mockRes } from '../helpers/test-utilities.js';
import { fetchPlanOnePlans } from '../../express/code/scripts/utils/pricing.js';

const imports = await Promise.all([import('../../express/code/scripts/utils.js'), import('../../express/code/scripts/scripts.js')]);
const [{ getLibs }] = imports;

const originalFetch = window.fetch;

describe('Pricing offer format for segmentation link', () => {
  afterEach(() => {
    window.fetch = originalFetch;
    sessionStorage.removeItem('visitorCountry');
  });
  it('handles US IP', async () => {
    await import(`${getLibs()}/utils/utils.js`).then((mod) => {
      const conf = { locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } };
      mod.setConfig(conf);
    });
    window.fetch = sinon.stub();
    window.fetch.onFirstCall().returns(mockRes({
      payload: {
        country: 'US',
        state: 'CA',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }));
    window.fetch.onSecondCall().returns(mockRes({
      payload: {
        data: {
          find: () => {},
        },
      },
    }));
    const res = await fetchPlanOnePlans('https://commerce-stg.adobe.com/store/segmentation?cli=cc_express&pa=PA-55&ot=trial&us');
    expect(res.country).to.equal('us');
    expect(res.language).to.equal('en');
  });

  it('handles Bangalore IP', async () => {
    await import(`${getLibs()}/utils/utils.js`).then((mod) => {
      const conf = { locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } };
      mod.setConfig(conf);
    });
    window.fetch = sinon.stub();
    window.fetch.onFirstCall().returns(mockRes({
      payload: {
        country: 'IN',
        state: 'UP',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }));
    window.fetch.onSecondCall().returns(mockRes({
      payload: {
        data: {
          find: () => {},
        },
      },
    }));
    const res = await fetchPlanOnePlans('https://commerce-stg.adobe.com/store/segmentation?cli=cc_express&pa=PA-55&ot=trial&in');
    expect(res.country).to.equal('in');
    expect(res.language).to.equal('en');
  });

  it('handles Tokyo IP', async () => {
    await import(`${getLibs()}/utils/utils.js`).then((mod) => {
      const conf = { locales: { '': { ietf: 'ja-JP', tk: 'hah7vzn.css' } } };
      mod.setConfig(conf);
    });
    window.fetch = sinon.stub();
    window.fetch.onFirstCall().returns(mockRes({
      payload: {
        country: 'JP',
        state: '13',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }));
    window.fetch.onSecondCall().returns(mockRes({
      payload: {
        data: {
          find: () => {},
        },
      },
    }));
    const res = await fetchPlanOnePlans('https://commerce-stg.adobe.com/store/segmentation?cli=cc_express&pa=PA-55&ot=trial&jp');
    expect(res.country).to.equal('jp');
    expect(res.lang).to.equal('ja');
  });
});
