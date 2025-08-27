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
import { program } from 'commander';
import { generateLiveComparisonReport } from './reports/reporter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Constants
const VIEWPORTS = {
  mobile: { width: 375, height: 667, name: 'mobile' },
  tablet: { width: 768, height: 1024, name: 'tablet' },
  desktop: { width: 1920, height: 1080, name: 'desktop' },
  custom: null, // Will be set dynamically
};

const OUTPUT_DIR = path.join(__dirname, 'output', 'live-comparisons');

// State management
let liveSession = {
  sessionId: Date.now(),
  browser: null,
  page: null,
  isConnected: false,
  comparisonCount: 0,
  referenceImage: null,
  currentViewport: 'desktop',
  autoCompare: false,
  threshold: 5,
  mode: 'cdp',
  cdpPort: 9222,
};

// Utility functions
const initializeSession = async (options = {}) => {
  liveSession = {
    ...liveSession,
    ...options,
    sessionId: Date.now(),
  };

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(path.join(OUTPUT_DIR, `session-${liveSession.sessionId}`), { recursive: true });

  console.log(chalk.cyan('🚀 Live Comparison Tool Initialized'));
  console.log(chalk.gray(`Session ID: ${liveSession.sessionId}`));
  console.log(chalk.gray(`Output Directory: ${OUTPUT_DIR}`));
};

const connectToBrowser = async () => {
  const spinner = ora('Connecting to browser...').start();

  try {
    if (liveSession.mode === 'cdp') {
      // Connect via Chrome DevTools Protocol
      liveSession.browser = await chromium.connectOverCDP(`http://localhost:${liveSession.cdpPort}`);

      const contexts = liveSession.browser.contexts();
      if (contexts.length === 0) {
        throw new Error('No browser contexts found. Make sure Chrome is running with debugging enabled.');
      }

      const pages = contexts[0].pages();
      if (pages.length === 0) {
        throw new Error('No pages found in browser context.');
      }

      liveSession.page = pages[0];
      liveSession.isConnected = true;

      spinner.succeed(chalk.green('✅ Connected to browser via CDP'));
      console.log(chalk.gray(`Connected to: ${await liveSession.page.url()}`));
    } else if (liveSession.mode === 'extension') {
      const userDataDir = path.join(__dirname, 'browser-data');
      await fs.mkdir(userDataDir, { recursive: true });

      liveSession.browser = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        viewport: null,
        args: ['--start-maximized'],
      });

      const pages = liveSession.browser.pages();
      liveSession.page = pages.length > 0 ? pages[0] : await liveSession.browser.newPage();
      liveSession.isConnected = true;

      spinner.succeed(chalk.green('✅ Launched browser with persistent context'));
    }

    setupPageListeners();
  } catch (error) {
    spinner.fail(chalk.red('Failed to connect to browser'));
    console.error(chalk.red(error.message));

    if (liveSession.mode === 'cdp') {
      console.log(chalk.yellow('\\n💡 To use CDP mode, start Chrome with:'));
      console.log(chalk.cyan('  chrome --remote-debugging-port=9222'));
      console.log(chalk.cyan('  (On Mac: /Applications/Google\\\\ Chrome.app/Contents/MacOS/Google\\\\ Chrome --remote-debugging-port=9222)'));
    }

    throw error;
  }
};

const setupPageListeners = () => {
  liveSession.page.on('framenavigated', async (frame) => {
    if (frame === liveSession.page.mainFrame()) {
      console.log(chalk.blue(`📍 Navigated to: ${frame.url()}`));

      if (liveSession.autoCompare) {
        setTimeout(() => captureSnapshot(), 2000);
      }
    }
  });
};

const captureSnapshot = async (viewportName = null) => {
  if (!liveSession.isConnected) {
    console.error(chalk.red('❌ Not connected to browser'));
    return null;
  }

  const viewport = viewportName ? VIEWPORTS[viewportName] : VIEWPORTS[liveSession.currentViewport];
  const timestamp = Date.now();

  try {
    console.log(chalk.cyan(`📸 Capturing snapshot (${viewport.name})...`));

    const originalViewport = await liveSession.page.viewportSize();

    if (viewport.width && viewport.height) {
      console.log(`📐 Setting viewport to: ${viewport.width}x${viewport.height}`);
      await liveSession.page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      // Wait 2 seconds after viewport resize to allow page adjustments
      await liveSession.page.waitForTimeout(2000);
    }

    const screenshotPath = path.join(
      OUTPUT_DIR,
      `session-${liveSession.sessionId}`,
      `snapshot-${timestamp}-${viewport.name}.png`,
    );

    await liveSession.page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    if (originalViewport) {
      await liveSession.page.setViewportSize(originalViewport);
    }

    console.log(chalk.green(`✅ Snapshot saved: ${path.basename(screenshotPath)}`));

    if (liveSession.referenceImage) {
      await compareWithReference(screenshotPath, viewport.name);
    }

    return screenshotPath;
  } catch (error) {
    console.error(chalk.red(`❌ Failed to capture snapshot: ${error.message}`));
    return null;
  }
};

const compareWithReference = async (snapshotPath, viewportName) => {
  try {
    console.log(chalk.cyan('🔍 Comparing with reference...'));

    const referenceBuffer = await fs.readFile(liveSession.referenceImage);
    const snapshotBuffer = await fs.readFile(snapshotPath);

    const refMeta = await sharp(referenceBuffer).metadata();
    const snapMeta = await sharp(snapshotBuffer).metadata();

    // Use padding approach instead of scaling
    const width = Math.max(refMeta.width, snapMeta.width);
    const height = Math.max(refMeta.height, snapMeta.height);

    let processedRef = referenceBuffer;
    let processedSnap = snapshotBuffer;

    if (refMeta.width !== width || refMeta.height !== height) {
      processedRef = await sharp(referenceBuffer)
        .resize(width, height, {
          fit: 'contain',
          position: 'left top',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .png()
        .toBuffer();
    }

    if (snapMeta.width !== width || snapMeta.height !== height) {
      processedSnap = await sharp(snapshotBuffer)
        .resize(width, height, {
          fit: 'contain',
          position: 'left top',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .png()
        .toBuffer();
    }

    const refPng = PNG.sync.read(processedRef);
    const snapPng = PNG.sync.read(processedSnap);

    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(
      refPng.data,
      snapPng.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 },
    );

    const totalPixels = width * height;
    const diffPercentage = ((numDiffPixels / totalPixels) * 100).toFixed(2);

    const diffPath = path.join(
      OUTPUT_DIR,
      `session-${liveSession.sessionId}`,
      `diff-${Date.now()}-${viewportName}.png`,
    );

    await fs.writeFile(diffPath, PNG.sync.write(diff));

    liveSession.comparisonCount++;

    const status = diffPercentage <= liveSession.threshold ? '✅ PASS' : '❌ FAIL';
    const color = diffPercentage <= liveSession.threshold ? chalk.green : chalk.red;

    console.log(color(`${status} - Difference: ${diffPercentage}% (threshold: ${liveSession.threshold}%)`));
    console.log(chalk.gray(`Diff saved: ${path.basename(diffPath)}`));

    await generateMiniReport(snapshotPath, diffPath, parseFloat(diffPercentage), viewportName);

    return { diffPercentage, diffPath };
  } catch (error) {
    console.error(chalk.red(`❌ Comparison failed: ${error.message}`));
    return null;
  }
};

const generateMiniReport = async (snapshotPath, diffPath, diffPercentage, viewportName) => {
  const reportPath = path.join(
    OUTPUT_DIR,
    `session-${liveSession.sessionId}`,
    `report-${Date.now()}.html`,
  );

  const reportData = {
    sessionId: liveSession.sessionId,
    viewportName,
    diffPercentage,
    threshold: liveSession.threshold,
    comparisonCount: liveSession.comparisonCount,
    referenceImage: liveSession.referenceImage,
    snapshotPath,
    diffPath,
  };

  await generateLiveComparisonReport(reportData, reportPath);
  console.log(chalk.blue(`📄 Report: ${reportPath}`));

  return reportPath;
};

const setCustomViewport = (width, height) => {
  VIEWPORTS.custom = {
    width: parseInt(width),
    height: parseInt(height),
    name: `custom-${width}x${height}`,
  };
  liveSession.currentViewport = 'custom';
  console.log(chalk.green(`✅ Custom viewport set: ${width}x${height}`));
};

const navigateToUrl = async (url) => {
  try {
    await liveSession.page.goto(url, { waitUntil: 'networkidle' });
    console.log(chalk.green(`✅ Navigated to: ${url}`));
  } catch (error) {
    console.error(chalk.red(`❌ Navigation failed: ${error.message}`));
  }
};

const openLatestReport = async () => {
  const reports = await fs.readdir(path.join(OUTPUT_DIR, `session-${liveSession.sessionId}`));
  const htmlReports = reports.filter((f) => f.endsWith('.html')).sort();
  if (htmlReports.length > 0) {
    const latestReport = path.join(OUTPUT_DIR, `session-${liveSession.sessionId}`, htmlReports[htmlReports.length - 1]);
    await open(latestReport);
    console.log(chalk.green('✅ Opened latest report'));
  } else {
    console.log(chalk.yellow('No reports generated yet'));
  }
};

const watchForChanges = async () => {
  if (!liveSession.referenceImage) return;

  console.log(chalk.cyan('👁️  Watching for reference image changes...'));

  const watcher = chokidar.watch(liveSession.referenceImage, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on('change', async () => {
    console.log(chalk.yellow('🔄 Reference image updated, triggering comparison...'));
    await captureSnapshot();
  });
};

const startInteractiveMode = async () => {
  console.log(chalk.cyan('\\n🎮 Interactive Mode Started'));
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
  console.log(chalk.gray('\\nPress Enter after typing command...'));

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
        await captureSnapshot();
        break;

      case 'm':
      case 'mobile':
        liveSession.currentViewport = 'mobile';
        await captureSnapshot('mobile');
        break;

      case 't':
      case 'tablet':
        liveSession.currentViewport = 'tablet';
        await captureSnapshot('tablet');
        break;

      case 'd':
      case 'desktop':
        liveSession.currentViewport = 'desktop';
        await captureSnapshot('desktop');
        break;

      case 'c':
      case 'custom':
        rl.question('Enter width: ', (width) => {
          rl.question('Enter height: ', (height) => {
            setCustomViewport(width, height);
            rl.prompt();
          });
        });
        return;

      case 'a':
      case 'auto':
        liveSession.autoCompare = !liveSession.autoCompare;
        console.log(chalk.yellow(`Auto-capture: ${liveSession.autoCompare ? 'ON' : 'OFF'}`));
        break;

      case 'r':
      case 'report':
        await openLatestReport();
        break;

      case 'u':
      case 'url':
        rl.question('Enter URL: ', async (url) => {
          await navigateToUrl(url);
          rl.prompt();
        });
        return;

      case 'q':
      case 'quit':
        console.log(chalk.yellow('👋 Goodbye!'));
        if (liveSession.browser && liveSession.mode === 'extension') {
          await liveSession.browser.close();
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
    console.log(chalk.yellow('\\n👋 Goodbye!'));
    process.exit(0);
  });
};

// CLI Interface
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
      await initializeSession({
        referenceImage: options.reference,
        mode: options.mode,
        cdpPort: parseInt(options.port, 10),
        autoCompare: options.auto,
        threshold: parseFloat(options.threshold),
      });

      await connectToBrowser();

      if (options.watch) {
        await watchForChanges();
      }

      await startInteractiveMode();
    } catch (error) {
      console.error(chalk.red(`Failed to start: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('help-cdp')
  .description('Show how to start Chrome with CDP')
  .action(() => {
    console.log(chalk.cyan('\\n📖 Chrome DevTools Protocol Setup:\\n'));
    console.log('To enable remote debugging, start Chrome with:');
    console.log(chalk.gray('\\nWindows:'));
    console.log(chalk.yellow('  chrome.exe --remote-debugging-port=9222'));
    console.log(chalk.gray('\\nMac:'));
    console.log(chalk.yellow('  /Applications/Google\\\\ Chrome.app/Contents/MacOS/Google\\\\ Chrome --remote-debugging-port=9222'));
    console.log(chalk.gray('\\nLinux:'));
    console.log(chalk.yellow('  google-chrome --remote-debugging-port=9222'));
    console.log(chalk.gray('\\nOptional flags:'));
    console.log(chalk.yellow('  --user-data-dir=/tmp/chrome-debug  (use separate profile)'));
    console.log(chalk.yellow('  --disable-extensions                (disable extensions)'));
    console.log(chalk.yellow('  --incognito                         (incognito mode)'));
  });

program.parse();
