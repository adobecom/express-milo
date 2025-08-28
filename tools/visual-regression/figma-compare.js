#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import open from 'open';
import fs from 'fs';
import path from 'path';
// import { fileURLToPath } from 'url';
import VisualRegression from './index.js';
import { downloadFromUrl } from './figma_exporter.js';
import { generateFigmaComparisonReport, generateInteractiveFigmaReport } from './reports/reporter.js';
import { alignAndCrop, pixelTemplateMatch, flagFeatures } from './utils/image-align.js';

// Note: outputs are written under VisualRegression's session output directory

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
  .option('--report <filename>', 'Custom report filename (e.g., figma-desktop.html)')
  .option('--session <id>', 'Optional session id to group outputs')
  .option('--align', 'Attempt feature-based alignment and crop overlap before diffing')
  .option('--pixel-template-matching', 'Use pixel template matching (NCC) to crop overlap before diffing')
  .option('--flag-features', 'Detect features and output dashed red boxes on both images (requires OpenCV)')
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
        pageTimeout: parseInt(options.timeout, 10),
        waitForBlocks: parseInt(options.wait, 10),
        finalWait: parseInt(options.wait, 10),
        sessionId: options.session,
      });

      await vr.init();

      // Create viewport using Figma dimensions if available, otherwise use options
      const viewport = figmaDimensions ? {
        width: figmaDimensions.width,
        height: figmaDimensions.height,
      } : {
        width: parseInt(options.viewportWidth, 10),
        height: parseInt(options.viewportHeight, 10),
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
          timeout: parseInt(options.timeout, 10),
        });

        // Wait for content to load
        await page.waitForTimeout(parseInt(options.wait, 10));

        // Wait for images to load
        await page.waitForFunction(
          () => Array.from(document.querySelectorAll('img')).every((img) => img.complete),
          { timeout: 10000 },
        ).catch(() => {
          console.log('⚠️  Some images may not have loaded');
        });

        await page.waitForTimeout(1000);

        let screenshotPath = path.join(vr.outputDir, 'screenshots', 'website-screenshot.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Optional alignment step
        if (options.align || options.pixelTemplateMatching) {
          try {
            const aligned = options.pixelTemplateMatching
              ? await pixelTemplateMatch(referencePath, screenshotPath, vr.outputDir, 'single')
              : await alignAndCrop(referencePath, screenshotPath, vr.outputDir, 'single');
            if (aligned) {
              referencePath = aligned.referencePath;
              screenshotPath = aligned.screenshotPath;
            }
          } catch (e) {
            console.log('⚠️  Alignment failed, proceeding without alignment:', e.message);
          }
        }

        spinner.text = 'Creating visual comparison...';

        // Use the existing visual diff functionality
        const diffPath = path.join(vr.outputDir, 'diffs', 'figma-comparison-diff.png');
        const diffResult = await vr.createVisualDiff(referencePath, screenshotPath, diffPath);

        // Optional: feature flagging output images
        if (options.flagFeatures) {
          try {
            await flagFeatures(referencePath, screenshotPath, vr.outputDir, 'single');
          } catch (e) {
            console.log('⚠️  Feature flagging failed:', e.message);
          }
        }

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

        const outName = options.report || (options.interactive ? 'interactive-figma-comparison.html' : 'figma-comparison-report.html');
        const reportPath = options.interactive
          ? await generateInteractiveFigmaReport(
            reportData,
            path.join(vr.outputDir, outName),
          )
          : await generateFigmaComparisonReport(
            reportData,
            path.join(vr.outputDir, outName),
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

// Batch mode: generate multiple figma comparison reports in one session with navigation
program
  .command('batch')
  .description('Run multiple Figma comparisons (e.g., mobile/tablet/desktop) with navigation')
  .argument('<reference>', 'Figma URL or path to reference image (must include node-id for Figma URL)')
  .argument('<website-url>', 'Website URL to compare against')
  .option('-o, --open', 'Open the first report after completion')
  .option('-t, --timeout <ms>', 'Page load timeout in milliseconds (default: 30000)', '30000')
  .option('-w, --wait <ms>', 'Wait time for page load in milliseconds (default: 2000)', '2000')
  .option('--threshold <percent>', 'Difference threshold percentage (default: 5)', '5')
  .option('--session <id>', 'Optional session id to group outputs')
  .option('--align', 'Attempt feature-based alignment and crop overlap before diffing')
  .option('--pixel-template-matching', 'Use pixel template matching (NCC) to crop overlap before diffing')
  .option('--flag-features', 'Detect features and output dashed red boxes on both images (requires OpenCV)')
  .action(async (reference, websiteUrl, options) => {
    const spinner = ora('Starting Figma batch comparison...').start();
    try {
      // Download or validate reference once
      let referencePath = reference;
      let figmaDimensions = null;
      if (reference.includes('figma.com')) {
        spinner.text = 'Downloading Figma reference image...';
        const figmaResult = await downloadFromUrl(reference, 'figma-reference.png');
        referencePath = figmaResult.path;
        figmaDimensions = { width: figmaResult.width, height: figmaResult.height };
        console.log(`📐 Using Figma dimensions for viewport: ${figmaDimensions.width}x${figmaDimensions.height}`);
      } else if (!fs.existsSync(reference)) {
        throw new Error(`Reference image not found: ${reference}`);
      }

      const vr = new VisualRegression({
        pageTimeout: parseInt(options.timeout, 10),
        waitForBlocks: parseInt(options.wait, 10),
        finalWait: parseInt(options.wait, 10),
        sessionId: options.session,
      });
      await vr.init();

      // Define labels and output names (sizes are currently dictated by Figma frame)
      const labels = ['mobile', 'tablet', 'desktop'];
      const outNames = labels.map((l) => `figma-${l}.html`);

      const reports = [];
      for (let i = 0; i < labels.length; i += 1) {
        // Launch browser and capture website screenshot at figma viewport (current behavior)
        const { chromium } = await import('@playwright/test');
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        try {
          const viewport = figmaDimensions || { width: 1920, height: 1080 };
          await page.setViewportSize(viewport);
          await page.waitForTimeout(2000);
          await page.goto(websiteUrl, { waitUntil: 'networkidle', timeout: parseInt(options.timeout, 10) });
          await page.waitForTimeout(parseInt(options.wait, 10));
          await page.waitForFunction(() => Array.from(document.querySelectorAll('img')).every((img) => img.complete), { timeout: 10000 }).catch(() => {
            console.log('⚠️  Some images may not have loaded');
          });
          await page.waitForTimeout(1000);

          let screenshotPath = path.join(vr.outputDir, 'screenshots', `website-screenshot-${labels[i]}.png`);
          await page.screenshot({ path: screenshotPath, fullPage: true });

          // Optional alignment step for each label
          if (options.align || options.pixelTemplateMatching) {
            try {
              const aligned = options.pixelTemplateMatching
                ? await pixelTemplateMatch(referencePath, screenshotPath, vr.outputDir, labels[i])
                : await alignAndCrop(referencePath, screenshotPath, vr.outputDir, labels[i]);
              if (aligned) {
                referencePath = aligned.referencePath;
                screenshotPath = aligned.screenshotPath;
              }
            } catch (e) {
              console.log(`⚠️  Alignment failed for ${labels[i]}, proceeding without alignment:`, e.message);
            }
          }

          // Create diff
          const diffPath = path.join(vr.outputDir, 'diffs', `figma-comparison-diff-${labels[i]}.png`);
          const diffResult = await vr.createVisualDiff(referencePath, screenshotPath, diffPath);

          if (options.flagFeatures) {
            try {
              await flagFeatures(referencePath, screenshotPath, vr.outputDir, labels[i]);
            } catch (e) {
              console.log(`⚠️  Feature flagging failed for ${labels[i]}:`, e.message);
            }
          }

          const threshold = parseFloat(options.threshold);
          const success = diffResult.percentDiff < threshold;

          const reportData = {
            referencePath,
            screenshotPath,
            diffPath,
            websiteUrl,
            reference,
            viewport: figmaDimensions || { width: 1920, height: 1080 },
            pixelDifference: diffResult.percentDiff,
            success,
            threshold,
            navigation: {
              all: outNames.map((n) => path.join(vr.outputDir, n)),
              labels,
              currentIndex: i,
              prev: i > 0 ? path.join(vr.outputDir, outNames[i - 1]) : null,
              next: i < outNames.length - 1 ? path.join(vr.outputDir, outNames[i + 1]) : null,
            },
          };

          const reportPath = await generateFigmaComparisonReport(
            reportData,
            path.join(vr.outputDir, outNames[i]),
          );
          reports.push(reportPath);
          console.log(chalk.blue(`📄 Report: ${reportPath}`));
        } finally {
          await context.close();
          await browser.close();
        }
      }

      spinner.succeed('Figma batch comparison completed!');

      if (options.open && reports[0]) {
        await open(reports[0]);
      }
    } catch (error) {
      spinner.fail('Figma batch comparison failed');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program.parse();
