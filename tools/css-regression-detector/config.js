import fs from 'fs';

class Config {
  constructor(configPath = '.css-check.config.json') {
    this.configPath = configPath;
    this.config = this.loadConfig();
  }

  loadConfig() {
    const defaultConfig = {
      dangerSelectors: [
        '.btn',
        '.container',
        'body',
        '.modal',
        '.header',
        '.footer',
        '.nav',
        '.sidebar',
      ],
      thresholds: {
        specificityIncrease: 2,
        maxConflicts: 5,
        maxUsageWarnings: 10,
        minUsageCount: 3,
      },
      ignorePatterns: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/*.min.css',
      ],
      jsScanPatterns: [
        '**/*.js',
        '**/*.jsx',
        '**/*.ts',
        '**/*.tsx',
      ],
      cssScanPatterns: [
        '**/*.css',
        '**/*.scss',
        '**/*.sass',
      ],
    };

    try {
      if (fs.existsSync(this.configPath)) {
        const configContent = fs.readFileSync(this.configPath, 'utf8');
        const userConfig = JSON.parse(configContent);
        return { ...defaultConfig, ...userConfig };
      }
    } catch (error) {
      console.warn(`Warning: Could not load config file ${this.configPath}:`, error.message);
    }

    return defaultConfig;
  }

  get(key) {
    return this.config[key];
  }

  getDangerSelectors() {
    return this.config.dangerSelectors || [];
  }

  getThresholds() {
    return this.config.thresholds || {};
  }

  getIgnorePatterns() {
    return this.config.ignorePatterns || [];
  }

  getJSScanPatterns() {
    return this.config.jsScanPatterns || [];
  }

  getCSSScanPatterns() {
    return this.config.cssScanPatterns || [];
  }
}

export default Config;
