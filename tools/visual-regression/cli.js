#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import open from 'open';
import VisualRegression from './index.js';
import { parseVisualRegressionQuery, suggestCorrections } from './nlp.js';

// Example natural language patterns
const examples = [
  'compare main branch with feature-xyz at /docs/library/kitchen-sink/comparison-table-v2',
  'check visual differences between main and stage for /express/templates',
  'test main vs experimental-branch on page /docs/library',
  'show me the difference between stage and prod branches for /express',
  'visual regression main against feature-123 path /docs',
];

program
  .name('visual-compare')
  .description('Visual regression testing tool using perceptual hashing')
  .version('1.0.0');

program
  .command('compare')
  .description('Compare two branches visually')
  .argument('<control-branch>', 'Control branch name (e.g., main)')
  .argument('<experimental-branch>', 'Experimental branch name')
  .argument('<subdirectory>', 'Subdirectory path (e.g., /docs/library/kitchen-sink)')
  .option('-o, --open', 'Open report in browser after completion')
  .option('-r, --report <filename>', 'Custom report filename (e.g., report-pricing.html)')
  .option('-t, --timeout <ms>', 'Page load timeout in milliseconds (default: 60000)', '60000')
  .option('-w, --wait <ms>', 'Wait time for blocks to render in milliseconds (default: 5000)', '5000')
  .option('-f, --final-wait <ms>', 'Final wait time for animations in milliseconds (default: 3000)', '3000')
  .action(async (controlBranch, experimentalBranch, subdirectory, options) => {
    const spinner = ora('Starting visual regression test...').start();

    try {
      const vr = new VisualRegression({
        pageTimeout: parseInt(options.timeout),
        waitForBlocks: parseInt(options.wait),
        finalWait: parseInt(options.finalWait),
      });
      const results = await vr.compare(controlBranch, experimentalBranch, subdirectory);

      spinner.succeed('Screenshots captured and compared!');

      // Generate report
      const reportPath = await vr.generateHTMLReport(results, options.report);

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

      if (options.open) {
        await open(reportPath);
      }
    } catch (error) {
      spinner.fail('Error during comparison');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program
  .command('natural <query...>')
  .alias('nl')
  .description('Use natural language to specify comparison')
  .option('-o, --open', 'Open report in browser after completion')
  .option('-r, --report <filename>', 'Custom report filename (e.g., report-pricing.html)')
  .option('-t, --timeout <ms>', 'Page load timeout in milliseconds (default: 60000)', '60000')
  .option('-w, --wait <ms>', 'Wait time for blocks to render in milliseconds (default: 5000)', '5000')
  .option('-f, --final-wait <ms>', 'Final wait time for animations in milliseconds (default: 3000)', '3000')
  .action(async (queryParts, options) => {
    const query = queryParts.join(' ');

    console.log(chalk.gray(`\n🤖 Parsing: "${query}"\n`));

    const parsed = parseVisualRegressionQuery(query);
    const suggestions = suggestCorrections(parsed, query);

    console.log(chalk.cyan('Understood:'));
    console.log(`  Control Branch: ${chalk.bold(parsed.controlBranch)}`);
    console.log(`  Experimental Branch: ${chalk.bold(parsed.experimentalBranch)}`);
    console.log(`  Subdirectory: ${chalk.bold(parsed.subdirectory)}`);
    console.log(`  Timing: ${chalk.bold(parsed.timing)}`);
    console.log(`  Confidence: ${chalk.bold(`${parsed.confidence}%`)}\n`);

    if (suggestions.length > 0) {
      console.log(chalk.yellow('Suggestions:'));
      suggestions.forEach((suggestion) => {
        console.log(chalk.gray(`  • ${suggestion}`));
      });
      console.log('');
    }

    const spinner = ora('Starting visual regression test...').start();

    try {
      // Configure timing based on parsed options
      const vrOptions = {
        pageTimeout: parseInt(options.timeout, 10),
        waitForBlocks: parseInt(options.wait, 10),
        finalWait: parseInt(options.finalWait, 10),
      };

      if (parsed.timing === 'slow') {
        vrOptions.pageTimeout = 60000; // 60s
        vrOptions.waitForBlocks = 5000; // 5s
        vrOptions.waitForImages = 10000; // 10s
        vrOptions.finalWait = 3000; // 3s
      }

      const vr = new VisualRegression(vrOptions);
      const results = await vr.compare(
        parsed.controlBranch,
        parsed.experimentalBranch,
        parsed.subdirectory,
      );

      spinner.succeed('Screenshots captured and compared!');

      const reportPath = await vr.generateHTMLReport(results, options.report);

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

      if (options.open) {
        await open(reportPath);
      }
    } catch (error) {
      spinner.fail('Error during comparison');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program
  .command('examples')
  .description('Show natural language query examples')
  .action(() => {
    console.log(chalk.bold('\n📝 Natural Language Query Examples:\n'));
    examples.forEach((example) => {
      console.log(chalk.gray('  • ') + example);
    });
    console.log(chalk.dim('\nUsage: visual-compare nl "your natural language query"'));
  });

program
  .command('batch')
  .description('Run a batch of comparisons from a text file of URLs')
  .argument('<control-branch>', 'Control branch name (e.g., main)')
  .argument('<experimental-branch>', 'Experimental branch name')
  .argument('<urls-file>', 'Path to a text file containing subdirectory paths')
  .option('-c, --concurrency <n>', 'Max concurrent comparisons (default: 4)', '4')
  .option('--slow', 'Use slow timing for heavy pages')
  .option('--fast', 'Use fast timing (default)')
  .option('-t, --timeout <ms>', 'Page load timeout in milliseconds')
  .option('-w, --wait <ms>', 'Wait time for blocks to render in milliseconds')
  .option('-o, --open', 'Open the batch summary after completion')
  .action(async (controlBranch, experimentalBranch, urlsFile, options) => {
    const { runBatch } = await import('./batch-run.js');
    const concurrency = parseInt(options.concurrency, 10) || 4;
    const timing = options.slow ? 'slow' : 'fast';
    const timeout = options.timeout ? parseInt(options.timeout, 10) : undefined;
    const wait = options.wait ? parseInt(options.wait, 10) : undefined;
    const result = await runBatch(controlBranch, experimentalBranch, urlsFile, { concurrency, timing, timeout, wait });
    if (options.open && result?.summaryHtmlPath) {
      const { default: open } = await import('open');
      await open(result.summaryHtmlPath);
    }
  });

program.parse();
