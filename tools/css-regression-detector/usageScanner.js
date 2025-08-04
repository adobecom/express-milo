import { glob } from 'glob';
import fs from 'fs';

class UsageScanner {
  constructor(config) {
    this.config = config;
    this.jsPatterns = config.getJSScanPatterns();
    this.ignorePatterns = config.getIgnorePatterns();
  }

  async scanForUsage(stagedCSS) {
    const results = {
      usageWarnings: [],
      totalUsage: 0,
    };

    // Extract selectors from staged CSS
    const selectors = UsageScanner.extractSelectors(stagedCSS);

    if (selectors.length === 0) {
      return results;
    }

    // Get all JS files
    const jsFiles = await this.getJSFiles();

    // Scan each JS file for selector usage
    for (const jsFile of jsFiles) {
      const fileUsage = this.scanFileForSelectors(jsFile, selectors);
      if (fileUsage.length > 0) {
        results.usageWarnings.push({
          file: jsFile,
          selectors: fileUsage,
        });
        results.totalUsage += fileUsage.length;
      }
    }

    return results;
  }

  static extractSelectors(cssFiles) {
    const selectors = [];
    for (const file of cssFiles) {
      for (const rule of file.rules) {
        selectors.push(rule.selector);
      }
    }
    return [...new Set(selectors)]; // Remove duplicates
  }

  async getJSFiles() {
    const files = [];

    for (const pattern of this.jsPatterns) {
      try {
        const matches = await glob(pattern, {
          ignore: this.ignorePatterns,
        });
        files.push(...matches);
      } catch (error) {
        console.warn(`Warning: Could not scan pattern ${pattern}: ${error.message}`);
      }
    }

    return [...new Set(files)]; // Remove duplicates
  }

  scanFileForSelectors(filePath, selectors) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const foundSelectors = [];

      for (const selector of selectors) {
        const usagePatterns = UsageScanner.getUsagePatterns(selector);

        for (const pattern of usagePatterns) {
          if (pattern.test(content)) {
            foundSelectors.push({
              selector,
              pattern: pattern.source,
              count: (content.match(pattern) || []).length,
            });
            break; // Found this selector, move to next
          }
        }
      }

      return foundSelectors;
    } catch (error) {
      console.warn(`Warning: Could not scan ${filePath}: ${error.message}`);
      return [];
    }
  }

  static getUsagePatterns(selector) {
    // Remove leading dot for class selectors
    const cleanSelector = selector.startsWith('.') ? selector.slice(1) : selector;

    return [
      // className="selector"
      new RegExp(`className\\s*=\\s*["']${cleanSelector}["']`, 'g'),
      // classList.add("selector")
      new RegExp(`classList\\.add\\s*\\(\\s*["']${cleanSelector}["']`, 'g'),
      // Template literals - using string concatenation to avoid backtick issues
      new RegExp(`\`[^\`]*${cleanSelector}[^\`]*\``, 'g'),
      // String concatenation
      new RegExp(`["'][^"']*${cleanSelector}[^"']*["']`, 'g'),
      // CSS modules
      new RegExp(`styles\\.${cleanSelector}`, 'g'),
      // Styled components
      new RegExp(`styled\\.${cleanSelector}`, 'g'),
    ];
  }

  getUsageCount(selector, filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const patterns = UsageScanner.getUsagePatterns(selector);
      let totalCount = 0;

      for (const pattern of patterns) {
        const matches = content.match(pattern) || [];
        totalCount += matches.length;
      }

      return totalCount;
    } catch (error) {
      return 0;
    }
  }
}

export default UsageScanner;
