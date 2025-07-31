#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import CSSRegressionDetector from './index.js';

const program = new Command();

program
  .name('css-check')
  .description('Detect CSS regressions in staged files')
  .version('1.0.0')
  .option('-f, --files <patterns>', 'Specific file patterns to check')
  .option('-c, --config <path>', 'Path to config file', '.css-check.config.json')
  .option('-v, --verbose', 'Enable verbose output')
  .option('--no-color', 'Disable colored output')
  .option('--format <format>', 'Output format: console, json, html', 'console')
  .option('--ignore-staged', 'Ignore staged files, check all CSS files')
  .option('--scan-all', 'Scan entire codebase for existing CSS issues (not just staged)')
  .option('--dry-run', 'Show what would be checked without making changes')
  .action(async (options) => {
    try {
      const detector = new CSSRegressionDetector(options);
      const result = await detector.run();

      if (result.hasErrors) {
        process.exit(2);
      } else if (result.hasWarnings) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      if (options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

program.parse();
