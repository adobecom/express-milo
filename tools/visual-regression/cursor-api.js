#!/usr/bin/env node

import VisualRegression from './index.js';
import chalk from 'chalk';
import ora from 'ora';
import open from 'open';

/**
 * Simple API for Cursor AI integration
 * Usage: node cursor-api.js <control-branch> <experimental-branch> <path> [options]
 * Options:
 *   --open: Open report in browser
 *   --fast: Use fast timing (default)
 *   --slow: Use slow timing for heavy pages
 *   --timeout=<ms>: Custom page timeout
 *   --wait=<ms>: Custom block wait time
 */

function parseOptions(args) {
  const options = {
    openReport: false,
    timing: 'fast',
    customTimeout: null,
    customWait: null,
  };

  args.forEach(arg => {
    if (arg === '--open') options.openReport = true;
    if (arg === '--fast') options.timing = 'fast';
    if (arg === '--slow') options.timing = 'slow';
    if (arg.startsWith('--timeout=')) {
      options.customTimeout = parseInt(arg.split('=')[1], 10);
    }
    if (arg.startsWith('--wait=')) {
      options.customWait = parseInt(arg.split('=')[1], 10);
    }
  });

  return options;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log(chalk.red('Usage: node cursor-api.js <control-branch> <experimental-branch> <path> [options]'));
    console.log(chalk.gray('Example: node cursor-api.js main feature-xyz /express'));
    console.log(chalk.gray('Options:'));
    console.log(chalk.gray('  --open          Open report in browser'));
    console.log(chalk.gray('  --fast          Use fast timing (default)'));
    console.log(chalk.gray('  --slow          Use slow timing for heavy pages'));
    console.log(chalk.gray('  --timeout=<ms>  Custom page timeout'));
    console.log(chalk.gray('  --wait=<ms>     Custom block wait time'));
    process.exit(1);
  }

  const [controlBranch, experimentalBranch, subdirectory] = args;
  const options = parseOptions(args);

  const spinner = ora('Starting visual regression test...').start();

  try {
    // Configure timing based on options
    const vrOptions = {};
    
    if (options.timing === 'slow') {
      vrOptions.pageTimeout = 60000; // 60s
      vrOptions.waitForBlocks = 5000; // 5s
      vrOptions.waitForImages = 10000; // 10s
      vrOptions.finalWait = 3000; // 3s
      spinner.text = `Using slow timing for heavy pages...`;
    } else if (options.timing === 'fast') {
      // Use defaults (already faster)
      spinner.text = `Using fast timing...`;
    }
    
    // Override with custom values if provided
    if (options.customTimeout) {
      vrOptions.pageTimeout = options.customTimeout;
    }
    if (options.customWait) {
      vrOptions.waitForBlocks = options.customWait;
      vrOptions.finalWait = Math.floor(options.customWait / 2);
    }
    
    const vr = new VisualRegression(vrOptions);
    
    spinner.text = `Comparing ${controlBranch} vs ${experimentalBranch} for ${subdirectory}...`;
    const results = await vr.compare(controlBranch, experimentalBranch, subdirectory);

    spinner.succeed('Screenshots captured and compared!');

    // Generate report
    const reportPath = await vr.generateHTMLReport(results);

    // Display results summary
    console.log(chalk.bold('\n📊 Comparison Results:\n'));

    results.results.forEach((result) => {
      const similarity = parseFloat(result.perceptualSimilarity);
      const pixelDiff = parseFloat(result.pixelDifference);

      let status = '✅';
      let color = chalk.green;

      if (similarity < 95 || pixelDiff > 1) {
        status = '⚠️';
        color = chalk.yellow;
      }
      if (similarity < 90 || pixelDiff > 5) {
        status = '❌';
        color = chalk.red;
      }

      console.log(color(
        `${status} ${result.resolution.padEnd(10)} - `
        + `Similarity: ${result.perceptualSimilarity}% | `
        + `Pixel Diff: ${result.pixelDifference}%`,
      ));
    });

    console.log(chalk.blue(`\n📄 Full report: ${reportPath}`));

    if (options.openReport) {
      await open(reportPath);
    }

    // Return structured data for Cursor AI
    const summary = {
      success: true,
      branches: { control: controlBranch, experimental: experimentalBranch },
      path: subdirectory,
      reportPath,
      results: results.results.map((r) => ({
        resolution: r.resolution,
        similarity: parseFloat(r.perceptualSimilarity),
        pixelDiff: parseFloat(r.pixelDifference),
        status: parseFloat(r.perceptualSimilarity) >= 95 && parseFloat(r.pixelDifference) <= 1 ? 'good' : 'different',
      })),
    };

    console.log('\n' + JSON.stringify(summary, null, 2));
  } catch (error) {
    spinner.fail('Error during comparison');
    console.error(chalk.red(error.message));
    
    const errorSummary = {
      success: false,
      error: error.message,
      branches: { control: controlBranch, experimental: experimentalBranch },
      path: subdirectory,
    };
    
    console.log('\n' + JSON.stringify(errorSummary, null, 2));
    process.exit(1);
  }
}

main();