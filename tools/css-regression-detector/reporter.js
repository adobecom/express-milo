import chalk from 'chalk';

class Reporter {
  constructor(options = {}) {
    this.options = options;
    this.useColor = options.color !== false;
  }

  generateReport(data) {
    const { stagedFiles, stagedCSS, baselineCSS, conflicts, usageResults } = data;

    const report = {
      summary: Reporter.generateSummary(stagedFiles, stagedCSS, baselineCSS, usageResults),
      issues: Reporter.collectIssues(conflicts, usageResults),
      hasErrors: false,
      hasWarnings: false,
    };

    // Determine if there are errors or warnings
    for (const issue of report.issues) {
      if (issue.severity === 'error') {
        report.hasErrors = true;
      } else if (issue.severity === 'warning') {
        report.hasWarnings = true;
      }
    }

    // Store report for summary footer
    this.report = report;

    this.printReport(report);
    return report;
  }

  generateScanAllReport(data) {
    const { allCSSFiles, allCSS, conflicts } = data;

    const report = {
      summary: Reporter.generateScanAllSummary(allCSSFiles, allCSS),
      issues: Reporter.collectIssues(conflicts, { usageWarnings: [], totalUsage: 0 }),
      hasErrors: false,
      hasWarnings: false,
    };

    // Determine if there are errors or warnings
    for (const issue of report.issues) {
      if (issue.severity === 'error') {
        report.hasErrors = true;
      } else if (issue.severity === 'warning') {
        report.hasWarnings = true;
      }
    }

    // Store report for summary footer
    this.report = report;

    this.printScanAllReport(report);
    return report;
  }

  static generateScanAllSummary(allCSSFiles, allCSS) {
    const totalRules = allCSS.reduce((sum, file) => sum + file.totalRules, 0);

    return {
      totalFiles: allCSSFiles.length,
      totalRules,
      scanType: 'full-codebase',
    };
  }

  static generateSummary(stagedFiles, stagedCSS, baselineCSS, usageResults) {
    const totalStagedRules = stagedCSS.reduce((sum, file) => sum + file.totalRules, 0);
    const totalBaselineRules = baselineCSS.reduce((sum, file) => sum + file.totalRules, 0);

    return {
      stagedFiles: stagedFiles.length,
      stagedRules: totalStagedRules,
      baselineFiles: baselineCSS.length,
      baselineRules: totalBaselineRules,
      jsFilesScanned: usageResults.usageWarnings.length,
      totalUsage: usageResults.totalUsage,
    };
  }

  static collectIssues(conflicts, usageResults) {
    const issues = [];

    // Add selector conflicts
    issues.push(...conflicts.selectorConflicts);

    // Add specificity issues
    issues.push(...conflicts.specificityIssues);

    // Add danger selector issues
    issues.push(...conflicts.dangerSelectorIssues);

    // Add usage warnings
    for (const usage of usageResults.usageWarnings) {
      for (const selector of usage.selectors) {
        issues.push({
          type: 'usage',
          selector: selector.selector,
          file: usage.file,
          count: selector.count,
          severity: 'warning',
          message: `Selector "${selector.selector}" used in ${usage.file}`,
        });
      }
    }

    return issues;
  }

  printReport(report) {
    console.log(chalk.blue.bold('🔍 CSS Regression Detector v1.0.0'));
    console.log(chalk.blue('================================\n'));

    // Print summary
    Reporter.printSummary(report.summary);

    // Print issues
    if (report.issues.length > 0) {
      Reporter.printIssues(report.issues);
    } else {
      console.log(chalk.green('✅ No issues found. CSS changes are safe to commit.\n'));
    }

    // Print footer
    this.printFooter(report.hasErrors, report.hasWarnings);
  }

  printScanAllReport(report) {
    console.log(chalk.blue.bold('🔍 CSS Regression Detector - Full Codebase Scan'));
    console.log(chalk.blue('==================================================\n'));

    // Print summary
    Reporter.printScanAllSummary(report.summary);

    // Print issues
    if (report.issues.length > 0) {
      Reporter.printIssues(report.issues);
    } else {
      console.log(chalk.green('✅ No CSS issues found in the entire codebase.\n'));
    }

    // Print footer
    this.printFooter(report.hasErrors, report.hasWarnings);
  }

  static printSummary(summary) {
    console.log(chalk.cyan.bold('📊 Analysis Summary:'));
    console.log(chalk.green(`✅ Parsed ${summary.stagedFiles} staged CSS files and baseline of ${summary.baselineFiles} CSS files`));
    console.log(chalk.green(`✅ Scanned ${summary.jsFilesScanned} JS files for selector usage\n`));
  }

  static printScanAllSummary(summary) {
    console.log(chalk.cyan.bold('📊 Scan Summary:'));
    console.log(chalk.green(`✅ Scanned ${summary.totalFiles} CSS files with ${summary.totalRules} total rules\n`));
  }

  static printIssues(issues) {
    const errors = issues.filter((issue) => issue.severity === 'error');
    const warnings = issues.filter((issue) => issue.severity === 'warning');

    if (errors.length > 0) {
      console.log(chalk.red.bold('❌ CRITICAL ISSUES FOUND (Commit Blocked):\n'));
      errors.forEach((issue, index) => {
        Reporter.printIssue(issue, index + 1);
      });
    }

    if (warnings.length > 0) {
      console.log(chalk.yellow.bold('⚠️  WARNINGS FOUND:\n'));
      warnings.forEach((issue, index) => {
        Reporter.printIssue(issue, index + 1);
      });
    }
  }

  static printIssue(issue, index) {
    const icon = issue.severity === 'error' ? '🚨' : '⚠️';
    const color = issue.severity === 'error' ? chalk.red : chalk.yellow;

    console.log(`${index}. ${icon} ${color.bold(issue.type)}`);
    console.log(`   ${chalk.gray('File:')} ${issue.file}`);
    if (issue.lineNumber) {
      console.log(`   ${chalk.gray('Line:')} ${issue.lineNumber}`);
    }
    console.log(`   ${chalk.gray('Issue:')} ${issue.message}`);

    // Show conflicting properties for conflict type issues
    if (issue.type === 'conflict' && issue.conflictingProperties) {
      console.log(`   ${chalk.gray('Conflicts:')}`);
      issue.conflictingProperties.forEach((prop) => {
        // Show lower line number first (typically newer/current),
        // higher line number second (typically older/conflicting)
        if (prop.newLineNumber <= prop.oldLineNumber) {
          console.log(`     ${chalk.green(`Line ${prop.newLineNumber}: ${prop.newDeclaration}`)}`);
          console.log(`     ${chalk.red(`Line ${prop.oldLineNumber}: ${prop.oldDeclaration}`)}`);
        } else {
          console.log(`     ${chalk.red(`Line ${prop.oldLineNumber}: ${prop.oldDeclaration}`)}`);
          console.log(`     ${chalk.green(`Line ${prop.newLineNumber}: ${prop.newDeclaration}`)}`);
        }
        console.log('');
      });
    }

    // Show specificity changes for specificity issues
    if (issue.type === 'specificityIncrease') {
      console.log(`   ${chalk.gray('Specificity:')} ${chalk.red(issue.oldSpecificity.join(','))} → ${chalk.green(issue.newSpecificity.join(','))}`);
    }

    if (issue.recommendation) {
      console.log(`   ${chalk.gray('Recommendation:')} ${issue.recommendation}`);
    }

    console.log('');
  }

  printFooter(hasErrors, hasWarnings) {
    if (hasErrors) {
      console.log(chalk.red('💡 To bypass (not recommended): git commit --no-verify'));
      console.log(chalk.red('💡 To fix: Address issues above and re-run check\n'));
    } else if (hasWarnings) {
      console.log(chalk.yellow('💡 Warnings found but commit can proceed. Review changes carefully.\n'));
    }

    // Add summary section
    this.printSummaryFooter();
  }

  printSummaryFooter() {
    console.log(chalk.cyan.bold('📋 Summary:'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

    const totalIssues = this.report?.issues?.length || 0;
    const errors = this.report?.issues?.filter((issue) => issue.severity === 'error').length || 0;
    const warnings = this.report?.issues?.filter((issue) => issue.severity === 'warning').length || 0;

    console.log(`Total Issues Found: ${chalk.bold(totalIssues)}`);
    console.log(`  🚨 Critical Errors: ${chalk.red.bold(errors)}`);
    console.log(`  ⚠️  Warnings: ${chalk.yellow.bold(warnings)}`);

    if (totalIssues > 0) {
      console.log(`\n${chalk.gray('Files with issues:')}`);
      const filesWithIssues = [...new Set(this.report?.issues?.map((issue) => issue.file) || [])];
      filesWithIssues.forEach((file) => {
        const fileIssues = this.report?.issues?.filter((issue) => issue.file === file).length || 0;
        console.log(`  ${chalk.cyan(file)}: ${chalk.bold(fileIssues)} issue${fileIssues > 1 ? 's' : ''}`);
      });
    }

    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  }
}

export default Reporter;
