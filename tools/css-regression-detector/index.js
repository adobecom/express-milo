import GitUtils from './gitUtils.js';
import CSSParser from './cssParser.js';
import ConflictDetector from './conflictDetector.js';
import UsageScanner from './usageScanner.js';
import Reporter from './reporter.js';
import Config from './config.js';

class CSSRegressionDetector {
  constructor(options = {}) {
    this.options = options;
    this.config = new Config(options.config);
    this.gitUtils = new GitUtils();
    this.cssParser = new CSSParser();
    this.conflictDetector = new ConflictDetector(this.config);
    this.usageScanner = new UsageScanner(this.config);
    this.reporter = new Reporter(options);
  }

  async run() {
    try {
      if (this.options.scanAll) {
        return await this.runScanAll();
      }

      return await this.runStagedCheck();
    } catch (error) {
      throw new Error(`CSS regression detection failed: ${error.message}`);
    }
  }

  async runStagedCheck() {
    // Get staged CSS files
    const stagedFiles = await this.gitUtils.getStagedCSSFiles();

    if (stagedFiles.length === 0) {
      console.log('No staged CSS files found.');
      return { hasErrors: false, hasWarnings: false };
    }

    // Parse staged CSS files
    const stagedCSS = await this.cssParser.parseFiles(stagedFiles);

    // Get all CSS files for baseline comparison
    const allCSSFiles = await GitUtils.getAllCSSFiles();
    const baselineCSS = await this.cssParser.parseFiles(allCSSFiles);

    // Detect conflicts
    const conflicts = this.conflictDetector.detectConflicts(stagedCSS, baselineCSS);

    // Scan JS files for usage
    const usageResults = await this.usageScanner.scanForUsage(stagedCSS);

    // Generate report
    const report = this.reporter.generateReport({
      stagedFiles,
      stagedCSS,
      baselineCSS,
      conflicts,
      usageResults,
    });

    return {
      hasErrors: report.hasErrors,
      hasWarnings: report.hasWarnings,
      report,
    };
  }

  async runScanAll() {
    console.log('🔍 Scanning entire codebase for CSS issues...\n');

    // Get all CSS files
    const allCSSFiles = await GitUtils.getAllCSSFiles();
    const allCSS = await this.cssParser.parseFiles(allCSSFiles);

    // Detect all conflicts within the codebase
    const conflicts = this.conflictDetector.detectAllConflicts(allCSS);

    // Generate report for scan-all mode
    const report = this.reporter.generateScanAllReport({
      allCSSFiles,
      allCSS,
      conflicts,
    });

    return {
      hasErrors: report.hasErrors,
      hasWarnings: report.hasWarnings,
      report,
    };
  }
}

export default CSSRegressionDetector;
