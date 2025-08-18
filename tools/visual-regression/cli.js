#!/usr/bin/env node

import { program } from 'commander';
import natural from 'natural';
import chalk from 'chalk';
import ora from 'ora';
import open from 'open';
import VisualRegression from './index.js';

// Natural language processing setup
const tokenizer = new natural.WordTokenizer();

function parseNaturalLanguage(input) {
  const tokens = tokenizer.tokenize(input.toLowerCase());
  
  // Find branch names (typically contain dashes or are after 'branch', 'from', 'to', 'vs', 'versus', 'against')
  const branchIndicators = ['branch', 'from', 'to', 'vs', 'versus', 'against', 'compare'];
  const branches = [];
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Check if this might be a branch name
    if (token.includes('-') || token === 'main' || token === 'stage' || token === 'prod') {
      branches.push(token);
    } else if (branchIndicators.includes(token) && i + 1 < tokens.length) {
      // Next token might be a branch
      const nextToken = tokens[i + 1];
      if (!branchIndicators.includes(nextToken)) {
        branches.push(nextToken);
      }
    }
  }
  
  // Find path/subdirectory (typically after 'path', 'page', 'url', 'subdirectory', or contains '/')
  const pathIndicators = ['path', 'page', 'url', 'subdirectory', 'directory', 'at', 'for'];
  let subdirectory = '';
  
  // First, check if input contains a clear path (with slashes)
  const pathMatch = input.match(/\/[^\s]+/);
  if (pathMatch) {
    subdirectory = pathMatch[0];
  } else {
    // Look for path after indicators
    for (let i = 0; i < tokens.length; i++) {
      if (pathIndicators.includes(tokens[i]) && i + 1 < tokens.length) {
        // Collect tokens until we hit a branch indicator or end
        const pathTokens = [];
        for (let j = i + 1; j < tokens.length; j++) {
          if (branchIndicators.includes(tokens[j]) || branches.includes(tokens[j])) {
            break;
          }
          pathTokens.push(tokens[j]);
        }
        if (pathTokens.length > 0) {
          subdirectory = pathTokens.join('/');
          if (!subdirectory.startsWith('/')) {
            subdirectory = '/' + subdirectory;
          }
          break;
        }
      }
    }
  }
  
  // Determine control and experimental branches
  let controlBranch = branches[0] || 'main';
  let experimentalBranch = branches[1] || branches[0] || 'stage';
  
  // If 'main' is mentioned, it's likely the control
  if (branches.includes('main')) {
    controlBranch = 'main';
    experimentalBranch = branches.find(b => b !== 'main') || 'stage';
  }
  
  return {
    controlBranch,
    experimentalBranch,
    subdirectory: subdirectory || '/'
  };
}

// Example natural language patterns
const examples = [
  "compare main branch with feature-xyz at /docs/library/kitchen-sink/comparison-table-v2",
  "check visual differences between main and stage for /express/templates",
  "test main vs experimental-branch on page /docs/library",
  "show me the difference between stage and prod branches for /express",
  "visual regression main against feature-123 path /docs"
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
  .option('-t, --timeout <ms>', 'Page load timeout in milliseconds (default: 60000)', '60000')
  .option('-w, --wait <ms>', 'Wait time for blocks to render in milliseconds (default: 5000)', '5000')
  .option('-f, --final-wait <ms>', 'Final wait time for animations in milliseconds (default: 3000)', '3000')
  .action(async (controlBranch, experimentalBranch, subdirectory, options) => {
    const spinner = ora('Starting visual regression test...').start();
    
    try {
      const vr = new VisualRegression({
        pageTimeout: parseInt(options.timeout),
        waitForBlocks: parseInt(options.wait),
        finalWait: parseInt(options.finalWait)
      });
      const results = await vr.compare(controlBranch, experimentalBranch, subdirectory);
      
      spinner.succeed('Screenshots captured and compared!');
      
      // Generate report
      const reportPath = await vr.generateHTMLReport(results);
      
      // Display results summary
      console.log(chalk.bold('\n📊 Comparison Results:\n'));
      
      results.results.forEach(result => {
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
          `${status} ${result.resolution.padEnd(10)} - ` +
          `Similarity: ${result.perceptualSimilarity}% | ` +
          `Pixel Diff: ${result.pixelDifference}%`
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
  .option('-t, --timeout <ms>', 'Page load timeout in milliseconds (default: 60000)', '60000')
  .option('-w, --wait <ms>', 'Wait time for blocks to render in milliseconds (default: 5000)', '5000')
  .option('-f, --final-wait <ms>', 'Final wait time for animations in milliseconds (default: 3000)', '3000')
  .action(async (queryParts, options) => {
    const query = queryParts.join(' ');
    
    console.log(chalk.gray(`\n🤖 Parsing: "${query}"\n`));
    
    const parsed = parseNaturalLanguage(query);
    
    console.log(chalk.cyan('Understood:'));
    console.log(`  Control Branch: ${chalk.bold(parsed.controlBranch)}`);
    console.log(`  Experimental Branch: ${chalk.bold(parsed.experimentalBranch)}`);
    console.log(`  Subdirectory: ${chalk.bold(parsed.subdirectory)}\n`);
    
    const spinner = ora('Starting visual regression test...').start();
    
    try {
      const vr = new VisualRegression({
        pageTimeout: parseInt(options.timeout),
        waitForBlocks: parseInt(options.wait),
        finalWait: parseInt(options.finalWait)
      });
      const results = await vr.compare(
        parsed.controlBranch,
        parsed.experimentalBranch,
        parsed.subdirectory
      );
      
      spinner.succeed('Screenshots captured and compared!');
      
      const reportPath = await vr.generateHTMLReport(results);
      
      // Display results summary
      console.log(chalk.bold('\n📊 Comparison Results:\n'));
      
      results.results.forEach(result => {
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
          `${status} ${result.resolution.padEnd(10)} - ` +
          `Similarity: ${result.perceptualSimilarity}% | ` +
          `Pixel Diff: ${result.pixelDifference}%`
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
    examples.forEach(example => {
      console.log(chalk.gray('  • ') + example);
    });
    console.log(chalk.dim('\nUsage: visual-compare nl "your natural language query"'));
  });

program.parse();