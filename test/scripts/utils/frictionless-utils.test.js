import { expect } from '@esm-bundle/chai';
import {
  QA_CONFIGS,
  EXPERIMENTAL_VARIANTS,
  FRICTIONLESS_UPLOAD_QUICK_ACTIONS,
  selectElementByTagPrefix,
  fadeIn,
  fadeOut,
  createDocConfig,
  createMergeVideosDocConfig,
  createContainerConfig,
  createDefaultExportConfig,
  createMobileExportConfig,
  executeQuickAction,
  getErrorMsg,
  processFileForQuickAction,
  processFilesForQuickAction,
  createSDKConfig,
  loadAndInitializeCCEverywhere,
  initProgressBar,
} from '../../../express/code/scripts/utils/frictionless-utils.js';

describe('Frictionless Utils', () => {
  let originalGetLibs;
  let originalImport;

  beforeEach(() => {
    // Save original values
    originalGetLibs = window.getLibs;
    originalImport = window.import;

    // Mock getLibs and import
    window.getLibs = () => '/libs';
    window.import = (path) => {
      if (path === '/libs/utils/utils.js') {
        return Promise.resolve({
          getConfig: () => ({
            locale: { prefix: '/us', ietf: 'en-US' },
            env: { name: 'prod' },
          }),
        });
      }
      return Promise.reject(new Error('Unknown module'));
    };
  });

  afterEach(() => {
    // Restore original values
    window.getLibs = originalGetLibs;
    window.import = originalImport;
  });

  describe('Constants', () => {
    it('should export QA_CONFIGS', () => {
      expect(QA_CONFIGS).to.be.an('object');
      expect(QA_CONFIGS).to.have.property('image');
      expect(QA_CONFIGS).to.have.property('video');
      expect(QA_CONFIGS).to.have.property('merge-videos');
    });

    it('should export EXPERIMENTAL_VARIANTS', () => {
      expect(EXPERIMENTAL_VARIANTS).to.be.an('array');
    });

    it('should export FRICTIONLESS_UPLOAD_QUICK_ACTIONS', () => {
      expect(FRICTIONLESS_UPLOAD_QUICK_ACTIONS).to.be.an('object');
    });
  });

  describe('selectElementByTagPrefix', () => {
    it('should be a function', () => {
      expect(selectElementByTagPrefix).to.be.a('function');
    });

    it('should return null for invalid prefix', () => {
      const result = selectElementByTagPrefix('invalid');
      expect(result).to.be.null;
    });

    it('should return null for empty prefix', () => {
      const result = selectElementByTagPrefix('');
      expect(result).to.be.null;
    });

    it('should return null for undefined prefix', () => {
      const result = selectElementByTagPrefix(undefined);
      expect(result).to.be.null;
    });
  });

  describe('fadeIn', () => {
    it('should be a function', () => {
      expect(fadeIn).to.be.a('function');
    });

    it('should handle null element', () => {
      expect(() => fadeIn(null)).to.not.throw();
    });

    it('should handle undefined element', () => {
      expect(() => fadeIn(undefined)).to.not.throw();
    });

    it('should handle element without style property', () => {
      const element = {};
      expect(() => fadeIn(element)).to.not.throw();
    });
  });

  describe('fadeOut', () => {
    it('should be a function', () => {
      expect(fadeOut).to.be.a('function');
    });

    it('should handle null element', () => {
      expect(() => fadeOut(null)).to.not.throw();
    });

    it('should handle undefined element', () => {
      expect(() => fadeOut(undefined)).to.not.throw();
    });

    it('should handle element without style property', () => {
      const element = {};
      expect(() => fadeOut(element)).to.not.throw();
    });
  });

  describe('createDocConfig', () => {
    it('should be a function', () => {
      expect(createDocConfig).to.be.a('function');
    });

    it('should create config for image type', () => {
      const data = { test: 'data' };
      const result = createDocConfig(data, 'image');
      expect(result).to.be.an('object');
      expect(result).to.have.property('data', data);
      expect(result).to.have.property('type', 'image');
    });

    it('should create config for video type', () => {
      const data = { test: 'data' };
      const result = createDocConfig(data, 'video');
      expect(result).to.be.an('object');
      expect(result).to.have.property('data', data);
      expect(result).to.have.property('type', 'video');
    });

    it('should default to image type', () => {
      const data = { test: 'data' };
      const result = createDocConfig(data);
      expect(result).to.be.an('object');
      expect(result).to.have.property('data', data);
      expect(result).to.have.property('type', 'image');
    });

    it('should handle null data', () => {
      const result = createDocConfig(null);
      expect(result).to.be.an('object');
      expect(result).to.have.property('data', null);
    });

    it('should handle undefined data', () => {
      const result = createDocConfig(undefined);
      expect(result).to.be.an('object');
      expect(result).to.have.property('data', undefined);
    });
  });

  describe('createMergeVideosDocConfig', () => {
    it('should be a function', () => {
      expect(createMergeVideosDocConfig).to.be.a('function');
    });

    it('should create merge videos config', () => {
      const data = { test: 'data' };
      const result = createMergeVideosDocConfig(data);
      expect(result).to.be.an('object');
      expect(result).to.have.property('data', data);
      expect(result).to.have.property('type', 'video');
    });

    it('should handle null data', () => {
      const result = createMergeVideosDocConfig(null);
      expect(result).to.be.an('object');
      expect(result).to.have.property('data', null);
    });
  });

  describe('createContainerConfig', () => {
    it('should be a function', () => {
      expect(createContainerConfig).to.be.a('function');
    });

    it('should create container config', () => {
      const quickAction = { test: 'action' };
      const result = createContainerConfig(quickAction);
      expect(result).to.be.an('object');
      expect(result).to.have.property('quickAction', quickAction);
    });

    it('should handle null quickAction', () => {
      const result = createContainerConfig(null);
      expect(result).to.be.an('object');
      expect(result).to.have.property('quickAction', null);
    });
  });

  describe('createDefaultExportConfig', () => {
    it('should be a function', () => {
      expect(createDefaultExportConfig).to.be.a('function');
    });

    it('should create default export config', () => {
      const result = createDefaultExportConfig();
      expect(result).to.be.an('object');
    });
  });

  describe('createMobileExportConfig', () => {
    it('should be a function', () => {
      expect(createMobileExportConfig).to.be.a('function');
    });

    it('should create mobile export config', async () => {
      const result = await createMobileExportConfig();
      expect(result).to.be.an('object');
    });
  });

  describe('executeQuickAction', () => {
    it('should be a function', () => {
      expect(executeQuickAction).to.be.a('function');
    });

    it('should handle null parameters', () => {
      expect(() => executeQuickAction(null, null, null)).to.not.throw();
    });

    it('should handle undefined parameters', () => {
      expect(() => executeQuickAction(undefined, undefined, undefined)).to.not.throw();
    });
  });

  describe('getErrorMsg', () => {
    it('should be a function', () => {
      expect(getErrorMsg).to.be.a('function');
    });

    it('should handle null parameters', async () => {
      const result = await getErrorMsg(null, null, null, null);
      expect(result).to.be.a('string');
    });

    it('should handle undefined parameters', async () => {
      const result = await getErrorMsg(undefined, undefined, undefined, undefined);
      expect(result).to.be.a('string');
    });

    it('should handle empty files array', async () => {
      const result = await getErrorMsg([], 'test', 'test', () => ({}));
      expect(result).to.be.a('string');
    });
  });

  describe('processFileForQuickAction', () => {
    it('should be a function', () => {
      expect(processFileForQuickAction).to.be.a('function');
    });

    it('should handle null parameters', async () => {
      const result = await processFileForQuickAction(null, null, null);
      expect(result).to.be.an('object');
    });

    it('should handle undefined parameters', async () => {
      const result = await processFileForQuickAction(undefined, undefined, undefined);
      expect(result).to.be.an('object');
    });
  });

  describe('processFilesForQuickAction', () => {
    it('should be a function', () => {
      expect(processFilesForQuickAction).to.be.a('function');
    });

    it('should handle null parameters', async () => {
      const result = await processFilesForQuickAction(null, null);
      expect(result).to.be.an('array');
    });

    it('should handle undefined parameters', async () => {
      const result = await processFilesForQuickAction(undefined, undefined);
      expect(result).to.be.an('array');
    });

    it('should handle empty files array', async () => {
      const result = await processFilesForQuickAction([], 'test');
      expect(result).to.be.an('array');
    });
  });

  describe('createSDKConfig', () => {
    it('should be a function', () => {
      expect(createSDKConfig).to.be.a('function');
    });

    it('should create SDK config', () => {
      const getConfig = () => ({ test: 'config' });
      const urlParams = new URLSearchParams('test=value');
      const result = createSDKConfig(getConfig, urlParams);
      expect(result).to.be.an('object');
    });

    it('should handle null getConfig', () => {
      const urlParams = new URLSearchParams('test=value');
      expect(() => createSDKConfig(null, urlParams)).to.throw();
    });

    it('should handle null urlParams', () => {
      const getConfig = () => ({ test: 'config' });
      expect(() => createSDKConfig(getConfig, null)).to.throw();
    });
  });

  describe('loadAndInitializeCCEverywhere', () => {
    it('should be a function', () => {
      expect(loadAndInitializeCCEverywhere).to.be.a('function');
    });

    it('should handle null getConfig', async () => {
      const result = await loadAndInitializeCCEverywhere(null);
      expect(result).to.be.undefined;
    });

    it('should handle undefined getConfig', async () => {
      const result = await loadAndInitializeCCEverywhere(undefined);
      expect(result).to.be.undefined;
    });
  });

  describe('initProgressBar', () => {
    it('should be a function', () => {
      expect(initProgressBar).to.be.a('function');
    });

    it('should handle null parameters', async () => {
      const result = await initProgressBar(null, null);
      expect(result).to.be.undefined;
    });

    it('should handle undefined parameters', async () => {
      const result = await initProgressBar(undefined, undefined);
      expect(result).to.be.undefined;
    });
  });
});
