import { expect } from '@esm-bundle/chai';
import { setLibs, hideQuickActionsOnDevices } from '../../express/code/scripts/utils.js';

describe('Libs', () => {
  it('Default Libs', () => {
    const libs = setLibs('/libs');
    expect(libs).to.equal('https://main--milo--adobecom.aem.live/libs');
  });

  it('Does not support milolibs query param on prod', () => {
    const location = {
      hostname: 'business.adobe.com',
      search: '?milolibs=foo',
    };
    const libs = setLibs('/libs', location);
    expect(libs).to.equal('/libs');
  });

  it('Supports milolibs query param', () => {
    const location = {
      hostname: 'localhost',
      search: '?milolibs=foo',
    };
    const libs = setLibs('/libs', location);
    expect(libs).to.equal('https://foo--milo--adobecom.aem.live/libs');
  });

  it('Supports local milolibs query param', () => {
    const location = {
      hostname: 'localhost',
      search: '?milolibs=local',
    };
    const libs = setLibs('/libs', location);
    expect(libs).to.equal('http://localhost:6456/libs');
  });

  it('Supports forked milolibs query param', () => {
    const location = {
      hostname: 'localhost',
      search: '?milolibs=awesome--milo--forkedowner',
    };
    const libs = setLibs('/libs', location);
    expect(libs).to.equal('https://awesome--milo--forkedowner.aem.live/libs');
  });
});

describe('Label Metadata for Frictionless', () => {
  beforeEach(() => {
    document.querySelector('meta[name="fqa-non-qualified"]')?.remove();
    document.querySelector('meta[name="fqa-qualified-desktop"]')?.remove();
    document.querySelector('meta[name="fqa-qualified-mobile"]')?.remove();
    document.querySelector('meta[name="fqa-on"]')?.remove();
    document.querySelector('meta[name="fqa-off"]')?.remove();
  });
  it('labels iOS as fqa-non-qualified', () => {
    hideQuickActionsOnDevices('Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');
    expect(document.querySelector('meta[name="fqa-non-qualified"]')).to.exist;
  });
  it('labels desktop Safari as fqa-non-qualified', () => {
    hideQuickActionsOnDevices('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15');
    expect(document.querySelector('meta[name="fqa-non-qualified"]')).to.exist;
  });
  it('labels Android phone as fqa-qualified-mobile', () => {
    hideQuickActionsOnDevices('Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36');
    expect(document.querySelector('meta[name="fqa-qualified-mobile"]')).to.exist;
  });
  it('labels non-Safari desktop as fqa-qualified-desktop', () => {
    hideQuickActionsOnDevices('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36');
    expect(document.querySelector('meta[name="fqa-qualified-desktop"]')).to.exist;
  });
});
