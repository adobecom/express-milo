#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import open from 'open';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import VisualRegression from './index.js';
import FigmaExporter from './figma_exporter.js';

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
  .action(async (reference, websiteUrl, options) => {
    const spinner = ora('Starting Figma comparison...').start();

    try {
      let referencePath = reference;
      let figmaDimensions = null;

      // Check if reference is a Figma URL
      if (reference.includes('figma.com')) {
        spinner.text = 'Downloading Figma reference image...';
        const figmaExporter = new FigmaExporter();
        const figmaResult = await figmaExporter.downloadFromUrl(reference, 'figma-reference.png');
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

        // Create a simple HTML report
        const reportPath = await createSimpleReport({
          referencePath,
          screenshotPath,
          diffPath,
          websiteUrl,
          reference,
          viewport,
          pixelDifference: diffResult.percentDiff,
          success,
          threshold,
        });

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

async function createSimpleReport(data) {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Figma Comparison Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: #333; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .comparison { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
        .metric { background: #f8f8f8; padding: 15px; border-radius: 4px; text-align: center; }
        .metric .value { font-size: 24px; font-weight: bold; margin: 10px 0; }
        .good { color: #28a745; }
        .bad { color: #dc3545; }
        .images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .image-container { text-align: center; }
        .image-container h4 { margin: 10px 0; }
        .image-container img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Figma Comparison Report</h1>
        <p>Reference: <strong>${data.reference}</strong></p>
        <p>Website: <strong>${data.websiteUrl}</strong></p>
        <p>Viewport: <strong>${data.viewport.width}x${data.viewport.height}</strong></p>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="comparison">
        <h2>Comparison Results</h2>
        
        <div class="metrics">
            <div class="metric">
                <div>Test Result</div>
                <div class="value ${data.success ? 'good' : 'bad'}">
                    ${data.success ? 'PASS' : 'FAIL'}
                </div>
            </div>
            <div class="metric">
                <div>Pixel Difference</div>
                <div class="value ${data.pixelDifference < data.threshold ? 'good' : 'bad'}">
                    ${data.pixelDifference.toFixed(2)}%
                </div>
                <div style="font-size: 12px; color: #666;">Threshold: ${data.threshold}%</div>
            </div>
        </div>
        
        <div class="images">
            <div class="image-container">
                <h4>Reference (Figma)</h4>
                <img src="../${path.relative(path.join(__dirname, 'output'), data.referencePath)}" alt="Reference">
            </div>
            <div class="image-container">
                <h4>Website Screenshot</h4>
                <img src="../${path.relative(path.join(__dirname, 'output'), data.screenshotPath)}" alt="Screenshot">
            </div>
            <div class="image-container">
                <h4>Difference</h4>
                <img src="../${path.relative(path.join(__dirname, 'output'), data.diffPath)}" alt="Diff">
            </div>
        </div>
    </div>
</body>
</html>
  `;

  const reportPath = path.join(__dirname, 'output', 'figma-comparison-report.html');
  fs.writeFileSync(reportPath, html);
  return reportPath;
}

program.parse();
