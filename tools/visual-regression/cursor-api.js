#!/usr/bin/env node

import VisualRegression from './index.js';
import chalk from 'chalk';
import ora from 'ora';
import open from 'open';

/**
 * Simple API for Cursor AI integration
 * Usage: node cursor-api.js <control-branch> <experimental-branch> <path>
 */

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log(chalk.red('Usage: node cursor-api.js <control-branch> <experimental-branch> <path>'));
    console.log(chalk.gray('Example: node cursor-api.js main feature-xyz /express'));
    process.exit(1);
  }

  const [controlBranch, experimentalBranch, subdirectory] = args;
  const openReport = args.includes('--open');

  const spinner = ora('Starting visual regression test...').start();

  try {
    const vr = new VisualRegression();
    
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

    if (openReport) {
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