#!/usr/bin/env node

import { chromium } from '@playwright/test';
import chalk from 'chalk';
import ora from 'ora';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import open from 'open';
import chokidar from 'chokidar';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VIEWPORTS = {
  mobile: { width: 375, height: 667, name: 'mobile' },
  tablet: { width: 768, height: 1024, name: 'tablet' },
  desktop: { width: 1920, height: 1080, name: 'desktop' },
  custom: null, // Will be set dynamically
};

class LiveComparisonTool {
  constructor(options = {}) {
    this.outputDir = path.join(__dirname, 'output', 'live-comparisons');
    this.referenceImage = options.reference;
    this.mode = options.mode || 'cdp'; // 'cdp' or 'extension'
    this.cdpPort = options.cdpPort || 9222;
    this.currentViewport = 'desktop';
    this.sessionId = Date.now();
    this.browser = null;
    this.page = null;
    this.isConnected = false;
    this.comparisonCount = 0;
    this.autoCompare = options.autoCompare || false;
    this.threshold = options.threshold || 5;
  }

  async init() {
    await fs.mkdir(this.outputDir, { recursive: true });
    await fs.mkdir(path.join(this.outputDir, `session-${this.sessionId}`), { recursive: true });
    
    console.log(chalk.cyan('🚀 Live Comparison Tool Initialized'));
    console.log(chalk.gray(`Session ID: ${this.sessionId}`));
    console.log(chalk.gray(`Output Directory: ${this.outputDir}`));
  }

  async connectToBrowser() {
    const spinner = ora('Connecting to browser...').start();
    
    try {
      if (this.mode === 'cdp') {
        // Connect via Chrome DevTools Protocol
        // User needs to start Chrome with: --remote-debugging-port=9222
        this.browser = await chromium.connectOverCDP(`http://localhost:${this.cdpPort}`);
        
        // Get the first available context
        const contexts = this.browser.contexts();
        if (contexts.length === 0) {
          throw new Error('No browser contexts found. Make sure Chrome is running with debugging enabled.');
        }
        
        // Get the active page
        const pages = contexts[0].pages();
        if (pages.length === 0) {
          throw new Error('No pages found in browser context.');
        }
        
        this.page = pages[0];
        this.isConnected = true;
        
        spinner.succeed(chalk.green('✅ Connected to browser via CDP'));
        console.log(chalk.gray(`Connected to: ${await this.page.url()}`));
        
      } else if (this.mode === 'extension') {
        // Alternative: Launch browser with persistent context
        const userDataDir = path.join(__dirname, 'browser-data');
        await fs.mkdir(userDataDir, { recursive: true });
        
        this.browser = await chromium.launchPersistentContext(userDataDir, {
          headless: false,
          viewport: null,
          args: [
            '--start-maximized',
          ],
        });
        
        // Create or get existing page
        const pages = this.browser.pages();
        this.page = pages.length > 0 ? pages[0] : await this.browser.newPage();
        this.isConnected = true;
        
        spinner.succeed(chalk.green('✅ Launched browser with persistent context'));
      }
      
      // Set up page event listeners
      this.setupPageListeners();
      
    } catch (error) {
      spinner.fail(chalk.red('Failed to connect to browser'));
      console.error(chalk.red(error.message));
      
      if (this.mode === 'cdp') {
        console.log(chalk.yellow('\n💡 To use CDP mode, start Chrome with:'));
        console.log(chalk.cyan('  chrome --remote-debugging-port=9222'));
        console.log(chalk.cyan('  (On Mac: /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222)'));
      }
      
      throw error;
    }
  }

  setupPageListeners() {
    // Listen for navigation events
    this.page.on('framenavigated', async (frame) => {
      if (frame === this.page.mainFrame()) {
        console.log(chalk.blue(`📍 Navigated to: ${frame.url()}`));
        
        if (this.autoCompare) {
          // Auto-capture after navigation
          setTimeout(() => this.captureSnapshot(), 2000);
        }
      }
    });
  }

  async captureSnapshot(viewportName = null) {
    if (!this.isConnected) {
      console.error(chalk.red('❌ Not connected to browser'));
      return null;
    }
    
    const viewport = viewportName ? VIEWPORTS[viewportName] : VIEWPORTS[this.currentViewport];
    const timestamp = Date.now();
    
    try {
      console.log(chalk.cyan(`📸 Capturing snapshot (${viewport.name})...`));
      
      // Store current viewport
      const originalViewport = await this.page.viewportSize();
      
      // Set viewport for screenshot
      if (viewport.width && viewport.height) {
        await this.page.setViewportSize({ 
          width: viewport.width, 
          height: viewport.height 
        });
        
        // Wait for resize to take effect
        await this.page.waitForTimeout(500);
      }
      
      // Capture screenshot
      const screenshotPath = path.join(
        this.outputDir,
        `session-${this.sessionId}`,
        `snapshot-${timestamp}-${viewport.name}.png`
      );
      
      await this.page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });
      
      // Restore original viewport
      if (originalViewport) {
        await this.page.setViewportSize(originalViewport);
      }
      
      console.log(chalk.green(`✅ Snapshot saved: ${path.basename(screenshotPath)}`));
      
      // If reference image exists, perform comparison
      if (this.referenceImage) {
        await this.compareWithReference(screenshotPath, viewport.name);
      }
      
      return screenshotPath;
      
    } catch (error) {
      console.error(chalk.red(`❌ Failed to capture snapshot: ${error.message}`));
      return null;
    }
  }

  async compareWithReference(snapshotPath, viewportName) {
    try {
      console.log(chalk.cyan('🔍 Comparing with reference...'));
      
      // Read images
      const referenceBuffer = await fs.readFile(this.referenceImage);
      const snapshotBuffer = await fs.readFile(snapshotPath);
      
      // Get dimensions
      const refMeta = await sharp(referenceBuffer).metadata();
      const snapMeta = await sharp(snapshotBuffer).metadata();
      
      // Resize if necessary
      let processedRef = referenceBuffer;
      let processedSnap = snapshotBuffer;
      
      if (refMeta.width !== snapMeta.width || refMeta.height !== snapMeta.height) {
        const targetWidth = Math.min(refMeta.width, snapMeta.width);
        const targetHeight = Math.min(refMeta.height, snapMeta.height);
        
        processedRef = await sharp(referenceBuffer)
          .resize(targetWidth, targetHeight, { fit: 'cover' })
          .toBuffer();
          
        processedSnap = await sharp(snapshotBuffer)
          .resize(targetWidth, targetHeight, { fit: 'cover' })
          .toBuffer();
      }
      
      // Convert to PNG for pixelmatch
      const refPng = PNG.sync.read(await sharp(processedRef).png().toBuffer());
      const snapPng = PNG.sync.read(await sharp(processedSnap).png().toBuffer());
      
      // Create diff image
      const { width, height } = refPng;
      const diff = new PNG({ width, height });
      
      const numDiffPixels = pixelmatch(
        refPng.data,
        snapPng.data,
        diff.data,
        width,
        height,
        { threshold: 0.1 }
      );
      
      const totalPixels = width * height;
      const diffPercentage = ((numDiffPixels / totalPixels) * 100).toFixed(2);
      
      // Save diff image
      const diffPath = path.join(
        this.outputDir,
        `session-${this.sessionId}`,
        `diff-${Date.now()}-${viewportName}.png`
      );
      
      await fs.writeFile(diffPath, PNG.sync.write(diff));
      
      this.comparisonCount++;
      
      // Display results
      const status = diffPercentage <= this.threshold ? '✅ PASS' : '❌ FAIL';
      const color = diffPercentage <= this.threshold ? chalk.green : chalk.red;
      
      console.log(color(`${status} - Difference: ${diffPercentage}% (threshold: ${this.threshold}%)`));
      console.log(chalk.gray(`Diff saved: ${path.basename(diffPath)}`));
      
      // Generate mini report
      await this.generateMiniReport(snapshotPath, diffPath, diffPercentage, viewportName);
      
      return { diffPercentage, diffPath };
      
    } catch (error) {
      console.error(chalk.red(`❌ Comparison failed: ${error.message}`));
      return null;
    }
  }

  async generateMiniReport(snapshotPath, diffPath, diffPercentage, viewportName) {
    const reportPath = path.join(
      this.outputDir,
      `session-${this.sessionId}`,
      `report-${Date.now()}.html`
    );
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Live Comparison Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: #333; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .result { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metrics { display: flex; gap: 20px; margin-bottom: 20px; }
        .metric { background: #f8f8f8; padding: 15px; border-radius: 4px; flex: 1; text-align: center; }
        .images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .image-container { text-align: center; }
        .image-container img { max-width: 100%; height: auto; border: 1px solid #ddd; }
        .pass { color: #28a745; }
        .fail { color: #dc3545; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Live Comparison Report</h1>
        <p>Session: ${this.sessionId}</p>
        <p>Viewport: ${viewportName}</p>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="result">
        <div class="metrics">
            <div class="metric">
                <h3>Status</h3>
                <h2 class="${diffPercentage <= this.threshold ? 'pass' : 'fail'}">
                    ${diffPercentage <= this.threshold ? 'PASS ✅' : 'FAIL ❌'}
                </h2>
            </div>
            <div class="metric">
                <h3>Difference</h3>
                <h2>${diffPercentage}%</h2>
                <p>Threshold: ${this.threshold}%</p>
            </div>
            <div class="metric">
                <h3>Comparisons</h3>
                <h2>${this.comparisonCount}</h2>
                <p>This session</p>
            </div>
        </div>
        
        <div class="images">
            <div class="image-container">
                <h4>Reference</h4>
                <img src="../../../${path.relative(path.dirname(reportPath), this.referenceImage)}" />
            </div>
            <div class="image-container">
                <h4>Current</h4>
                <img src="${path.basename(snapshotPath)}" />
            </div>
            <div class="image-container">
                <h4>Difference</h4>
                <img src="${path.basename(diffPath)}" />
            </div>
        </div>
    </div>
</body>
</html>`;
    
    await fs.writeFile(reportPath, html);
    console.log(chalk.blue(`📄 Report: ${reportPath}`));
    
    return reportPath;
  }

  async startInteractiveMode() {
    console.log(chalk.cyan('\n🎮 Interactive Mode Started'));
    console.log(chalk.gray('Commands:'));
    console.log(chalk.gray('  s, snapshot   - Capture snapshot with current viewport'));
    console.log(chalk.gray('  m, mobile     - Switch to mobile viewport and capture'));
    console.log(chalk.gray('  t, tablet     - Switch to tablet viewport and capture'));
    console.log(chalk.gray('  d, desktop    - Switch to desktop viewport and capture'));
    console.log(chalk.gray('  c, custom     - Set custom viewport dimensions'));
    console.log(chalk.gray('  a, auto       - Toggle auto-capture on navigation'));
    console.log(chalk.gray('  r, report     - Open latest report'));
    console.log(chalk.gray('  u, url        - Navigate to URL'));
    console.log(chalk.gray('  q, quit       - Exit'));
    console.log(chalk.gray('\nPress Enter after typing command...'));
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.cyan('> '),
    });
    
    rl.prompt();
    
    rl.on('line', async (input) => {
      const command = input.trim().toLowerCase();
      
      switch (command) {
        case 's':
        case 'snapshot':
          await this.captureSnapshot();
          break;
          
        case 'm':
        case 'mobile':
          this.currentViewport = 'mobile';
          await this.captureSnapshot('mobile');
          break;
          
        case 't':
        case 'tablet':
          this.currentViewport = 'tablet';
          await this.captureSnapshot('tablet');
          break;
          
        case 'd':
        case 'desktop':
          this.currentViewport = 'desktop';
          await this.captureSnapshot('desktop');
          break;
          
        case 'c':
        case 'custom':
          rl.question('Enter width: ', (width) => {
            rl.question('Enter height: ', (height) => {
              VIEWPORTS.custom = {
                width: parseInt(width),
                height: parseInt(height),
                name: `custom-${width}x${height}`,
              };
              this.currentViewport = 'custom';
              console.log(chalk.green(`✅ Custom viewport set: ${width}x${height}`));
              rl.prompt();
            });
          });
          return; // Don't prompt yet
          
        case 'a':
        case 'auto':
          this.autoCompare = !this.autoCompare;
          console.log(chalk.yellow(`Auto-capture: ${this.autoCompare ? 'ON' : 'OFF'}`));
          break;
          
        case 'r':
        case 'report':
          const reports = await fs.readdir(path.join(this.outputDir, `session-${this.sessionId}`));
          const htmlReports = reports.filter(f => f.endsWith('.html')).sort();
          if (htmlReports.length > 0) {
            const latestReport = path.join(this.outputDir, `session-${this.sessionId}`, htmlReports[htmlReports.length - 1]);
            await open(latestReport);
            console.log(chalk.green('✅ Opened latest report'));
          } else {
            console.log(chalk.yellow('No reports generated yet'));
          }
          break;
          
        case 'u':
        case 'url':
          rl.question('Enter URL: ', async (url) => {
            try {
              await this.page.goto(url, { waitUntil: 'networkidle' });
              console.log(chalk.green(`✅ Navigated to: ${url}`));
            } catch (error) {
              console.error(chalk.red(`❌ Navigation failed: ${error.message}`));
            }
            rl.prompt();
          });
          return; // Don't prompt yet
          
        case 'q':
        case 'quit':
          console.log(chalk.yellow('👋 Goodbye!'));
          if (this.browser && this.mode === 'extension') {
            await this.browser.close();
          }
          process.exit(0);
          break;
          
        default:
          if (command) {
            console.log(chalk.red(`Unknown command: ${command}`));
          }
      }
      
      rl.prompt();
    });
    
    rl.on('close', () => {
      console.log(chalk.yellow('\n👋 Goodbye!'));
      process.exit(0);
    });
  }

  async watchForChanges() {
    if (!this.referenceImage) return;
    
    console.log(chalk.cyan('👁️  Watching for reference image changes...'));
    
    const watcher = chokidar.watch(this.referenceImage, {
      persistent: true,
      ignoreInitial: true,
    });
    
    watcher.on('change', async () => {
      console.log(chalk.yellow('🔄 Reference image updated, triggering comparison...'));
      await this.captureSnapshot();
    });
  }
}

// CLI Interface
import { program } from 'commander';

program
  .name('live-compare')
  .description('Live browser comparison tool with keyboard shortcuts')
  .version('1.0.0');

program
  .command('start')
  .description('Start live comparison session')
  .option('-r, --reference <path>', 'Path to reference image')
  .option('-m, --mode <mode>', 'Connection mode: cdp or extension (default: cdp)', 'cdp')
  .option('-p, --port <port>', 'CDP port (default: 9222)', '9222')
  .option('-a, --auto', 'Auto-capture on navigation')
  .option('-t, --threshold <percent>', 'Difference threshold (default: 5)', '5')
  .option('-w, --watch', 'Watch reference image for changes')
  .action(async (options) => {
    try {
      const tool = new LiveComparisonTool({
        reference: options.reference,
        mode: options.mode,
        cdpPort: parseInt(options.port),
        autoCompare: options.auto,
        threshold: parseFloat(options.threshold),
      });
      
      await tool.init();
      await tool.connectToBrowser();
      
      if (options.watch) {
        await tool.watchForChanges();
      }
      
      await tool.startInteractiveMode();
      
    } catch (error) {
      console.error(chalk.red(`Failed to start: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('help-cdp')
  .description('Show how to start Chrome with CDP')
  .action(() => {
    console.log(chalk.cyan('\n📖 Chrome DevTools Protocol Setup:\n'));
    console.log('To enable remote debugging, start Chrome with:');
    console.log(chalk.gray('\nWindows:'));
    console.log(chalk.yellow('  chrome.exe --remote-debugging-port=9222'));
    console.log(chalk.gray('\nMac:'));
    console.log(chalk.yellow('  /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222'));
    console.log(chalk.gray('\nLinux:'));
    console.log(chalk.yellow('  google-chrome --remote-debugging-port=9222'));
    console.log(chalk.gray('\nOptional flags:'));
    console.log(chalk.yellow('  --user-data-dir=/tmp/chrome-debug  (use separate profile)'));
    console.log(chalk.yellow('  --disable-extensions                (disable extensions)'));
    console.log(chalk.yellow('  --incognito                         (incognito mode)'));
  });

program.parse();