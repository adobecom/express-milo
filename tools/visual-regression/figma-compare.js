#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import open from 'open';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import VisualRegression from './index.js';
import { downloadFromUrl } from './figma_exporter.js';
import { generateFigmaComparisonReport, generateInteractiveFigmaReport } from './reports/reporter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

program
  .name('figma-compare')
  .description('Compare Figma designs with live websites using visual regression testing')
  .version('1.0.0');

program
  .command('compare')
  .description('Compare a Figma frame with a website URL')
  .argument('<reference>', 'Figma URL or path to reference image')
  .argument('<website-url>', 'Website URL to compare against')
  .option('-o, --open', 'Open report in browser after completion')
  .option('-t, --timeout <ms>', 'Page load timeout in milliseconds (default: 30000)', '30000')
  .option('-w, --wait <ms>', 'Wait time for page load in milliseconds (default: 2000)', '2000')
  .option('--viewport-width <width>', 'Viewport width (default: 1920, auto-detected from Figma)', '1920')
  .option('--viewport-height <height>', 'Viewport height (default: 1080, auto-detected from Figma)', '1080')
  .option('--threshold <percent>', 'Difference threshold percentage (default: 5)', '5')
  .option('--interactive', 'Generate interactive report with area selection')
  .action(async (reference, websiteUrl, options) => {
    const spinner = ora('Starting Figma comparison...').start();

    try {
      let referencePath = reference;
      let figmaDimensions = null;

      // Check if reference is a Figma URL
      if (reference.includes('figma.com')) {
        spinner.text = 'Downloading Figma reference image...';
        const figmaResult = await downloadFromUrl(reference, 'figma-reference.png');
        referencePath = figmaResult.path;
        figmaDimensions = { width: figmaResult.width, height: figmaResult.height };

        console.log(`📐 Using Figma dimensions for viewport: ${figmaDimensions.width}x${figmaDimensions.height}`);
      } else if (!fs.existsSync(reference)) {
        throw new Error(`Reference image not found: ${reference}`);
      }

      spinner.text = 'Capturing website screenshot...';

      // Use the existing VisualRegression class's screenshot capture functionality
      const vr = new VisualRegression({
        pageTimeout: parseInt(options.timeout),
        waitForBlocks: parseInt(options.wait),
        finalWait: parseInt(options.wait),
      });

      await vr.init();

      // Create viewport using Figma dimensions if available, otherwise use options
      const viewport = figmaDimensions ? {
        width: figmaDimensions.width,
        height: figmaDimensions.height,
      } : {
        width: parseInt(options.viewportWidth),
        height: parseInt(options.viewportHeight),
      };

      // Use a temporary approach to capture the website screenshot
      const { chromium } = await import('@playwright/test');
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();

      try {
        console.log('Setting viewport to:', viewport);
        await page.setViewportSize(viewport);

        // Wait 2 seconds after viewport resize to allow page adjustments
        await page.waitForTimeout(2000);

        await page.goto(websiteUrl, {
          waitUntil: 'networkidle',
          timeout: parseInt(options.timeout),
        });

        // Wait for content to load
        await page.waitForTimeout(parseInt(options.wait));

        // Wait for images to load
        await page.waitForFunction(() => {
          const images = document.querySelectorAll('img');
          return Array.from(images).every((img) => img.complete);
        }, { timeout: 10000 }).catch(() => {
          console.log('⚠️  Some images may not have loaded');
        });

        await page.waitForTimeout(1000);

        const screenshotPath = path.join(vr.outputDir, 'screenshots', 'website-screenshot.png');
        await page.screenshot({
          path: screenshotPath,
          fullPage: true,
        });

        spinner.text = 'Creating visual comparison...';

        // Use the existing visual diff functionality
        const diffPath = path.join(vr.outputDir, 'diffs', 'figma-comparison-diff.png');
        const diffResult = await vr.createVisualDiff(referencePath, screenshotPath, diffPath);

        await browser.close();

        spinner.succeed('Comparison completed!');

        // Display results
        const threshold = parseFloat(options.threshold);
        const success = diffResult.percentDiff < threshold;

        console.log(chalk.bold('\\n🔍 Comparison Results:\\n'));

        const status = success ? '✅ PASS' : '❌ FAIL';
        const color = success ? chalk.green : chalk.red;

        console.log(color(
          `${status} - Pixel Difference: ${diffResult.percentDiff.toFixed(2)}% `
          + `(threshold: ${threshold}%)`,
        ));

        console.log(chalk.gray('\\nFiles:'));
        console.log(chalk.gray(`  Reference: ${referencePath}`));
        console.log(chalk.gray(`  Screenshot: ${screenshotPath}`));
        console.log(chalk.gray(`  Diff: ${diffPath}`));

        // Create HTML report (interactive or simple)
        const reportData = {
          referencePath,
          screenshotPath,
          diffPath,
          websiteUrl,
          reference,
          viewport,
          pixelDifference: diffResult.percentDiff,
          success,
          threshold,
        };

        const reportPath = options.interactive
          ? await generateInteractiveFigmaReport(
            reportData,
            path.join(__dirname, 'output', 'interactive-figma-comparison.html'),
          )
          : await generateFigmaComparisonReport(
            reportData,
            path.join(__dirname, 'output', 'figma-comparison-report.html'),
          );

        console.log(chalk.blue(`\\n📄 Report: ${reportPath}`));

        if (options.open) {
          await open(reportPath);
        }
      } finally {
        if (browser) {
          await browser.close();
        }
      }
    } catch (error) {
      spinner.fail('Comparison failed');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program.parse();
