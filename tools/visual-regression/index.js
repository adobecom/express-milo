import { chromium } from '@playwright/test';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateComparisonReport } from './reports/reporter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RESOLUTIONS = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1920, height: 1080, name: 'desktop' },
];

class VisualRegression {
  constructor(options = {}) {
    this.sessionId = options.sessionId || `${Date.now()}`;
    this.baseOutputDir = options.outputDir || path.join(__dirname, 'output');
    this.outputDir = path.join(this.baseOutputDir, 'sessions', this.sessionId);
    this.baseUrl = 'https://{branch}--express-milo--adobecom.aem.live';
    this.pageTimeout = options.pageTimeout || 30000; // 30 seconds (reduced)
    this.waitForBlocks = options.waitForBlocks || 2000; // 2 seconds (reduced)
    this.waitForImages = options.waitForImages || 5000; // 5 seconds (reduced)
    this.finalWait = options.finalWait || 1000; // 1 second (reduced)
  }

  async init() {
    await fs.mkdir(this.outputDir, { recursive: true });
    await fs.mkdir(path.join(this.outputDir, 'screenshots'), { recursive: true });
    await fs.mkdir(path.join(this.outputDir, 'diffs'), { recursive: true });
  }

  constructUrl(branch, subdirectory) {
    const url = this.baseUrl.replace('{branch}', branch);
    const cleanPath = subdirectory.startsWith('/') ? subdirectory : `/${subdirectory}`;
    return `${url}${cleanPath}`;
  }

  async captureScreenshots(branch, subdirectory) {
    const url = this.constructUrl(branch, subdirectory);
    console.log(`🌐 ${branch}: ${url}`);

    // Create separate browser contexts for each resolution to enable parallelism
    const screenshotPromises = RESOLUTIONS.map(async (resolution) => {
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();

      try {
        console.log(`📱 ${branch} - ${resolution.name} (${resolution.width}x${resolution.height}): Starting...`);

        await page.setViewportSize({ width: resolution.width, height: resolution.height });

        // Extended wait for AEM pages
        console.log(`📱 ${branch} - ${resolution.name}: Loading page...`);
        await page.goto(url, {
          waitUntil: 'networkidle',
          timeout: this.pageTimeout,
        });

        // Wait for AEM blocks to load and render
        console.log(`📱 ${branch} - ${resolution.name}: Waiting for blocks...`);
        await page.waitForTimeout(this.waitForBlocks);

        // Wait for any lazy-loaded images or components
        console.log(`📱 ${branch} - ${resolution.name}: Checking images...`);
        await page.waitForFunction(() => {
          const images = document.querySelectorAll('img');
          return Array.from(images).every((img) => img.complete);
        }, { timeout: this.waitForImages }).catch(() => {
          console.log(`⚠️  ${branch} - ${resolution.name}: Some images may not have loaded`);
        });

        // Additional wait for any animations or dynamic content
        await page.waitForTimeout(this.finalWait);

        const screenshotPath = path.join(
          this.outputDir,
          'screenshots',
          `${branch}-${resolution.name}.png`,
        );

        console.log(`📸 ${branch} - ${resolution.name}: Taking screenshot...`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: true,
        });

        console.log(`✅ ${branch} - ${resolution.name}: Complete`);

        return {
          path: screenshotPath,
          resolution: resolution.name,
          branch,
        };
      } finally {
        await browser.close();
      }
    });

    // Wait for all resolutions to complete
    const screenshots = await Promise.all(screenshotPromises);
    console.log(`🎉 ${branch}: All resolutions complete`);

    return screenshots;
  }

  async calculatePerceptualHash(imagePath) {
    // Use Sharp for image processing (more reliable for server environments)
    const image = sharp(imagePath);
    const { data, info } = await image
      .resize(32, 32)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Calculate hash based on relative brightness
    const pixels = Array.from(data);

    // Calculate average brightness
    const average = pixels.reduce((a, b) => a + b, 0) / pixels.length;

    // Create binary hash
    const hash = pixels.map((p) => (p > average ? 1 : 0)).join('');
    return hash;
  }

  calculateHammingDistance(hash1, hash2) {
    let distance = 0;
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] !== hash2[i]) distance++;
    }
    return distance;
  }

  async createVisualDiff(img1Path, img2Path, diffPath) {
    const img1 = PNG.sync.read(await fs.readFile(img1Path));
    const img2 = PNG.sync.read(await fs.readFile(img2Path));

    // Ensure images are same size by padding to largest dimensions
    const width = Math.max(img1.width, img2.width);
    const height = Math.max(img1.height, img2.height);

    // Pad images if needed using Sharp (preserves original image quality)
    let img1Data; let
      img2Data;

    if (img1.width !== width || img1.height !== height) {
      const padded = await sharp(img1Path)
        .resize(width, height, {
          fit: 'contain',
          position: 'left top',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .png()
        .toBuffer();
      img1Data = PNG.sync.read(padded).data;
    } else {
      img1Data = img1.data;
    }

    if (img2.width !== width || img2.height !== height) {
      const padded = await sharp(img2Path)
        .resize(width, height, {
          fit: 'contain',
          position: 'left top',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .png()
        .toBuffer();
      img2Data = PNG.sync.read(padded).data;
    } else {
      img2Data = img2.data;
    }

    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(
      img1Data,
      img2Data,
      diff.data,
      width,
      height,
      { threshold: 0.1 },
    );

    await fs.writeFile(diffPath, PNG.sync.write(diff));

    const percentDiff = (numDiffPixels / (width * height)) * 100;
    return { numDiffPixels, percentDiff };
  }

  async compare(controlBranch, experimentalBranch, subdirectory) {
    await this.init();

    const startTime = Date.now();
    console.log('📸 Capturing screenshots in parallel...');

    // Run both branches concurrently
    const screenshotStartTime = Date.now();
    const [controlScreenshots, experimentalScreenshots] = await Promise.all([
      this.captureScreenshots(controlBranch, subdirectory),
      this.captureScreenshots(experimentalBranch, subdirectory),
    ]);
    const screenshotTime = Date.now() - screenshotStartTime;
    console.log(`⏱️  Screenshot capture completed in ${(screenshotTime / 1000).toFixed(1)}s`);

    console.log('\n🔍 Comparing screenshots in parallel...');

    // Parallelize the comparison process
    const comparisonPromises = RESOLUTIONS.map(async (resolution, i) => {
      const control = controlScreenshots[i];
      const experimental = experimentalScreenshots[i];

      console.log(`🔍 ${resolution.name}: Starting comparison...`);

      // Run hash calculation and diff creation in parallel
      const [hash1, hash2, pixelDiff] = await Promise.all([
        this.calculatePerceptualHash(control.path),
        this.calculatePerceptualHash(experimental.path),
        (async () => {
          const diffPath = path.join(
            this.outputDir,
            'diffs',
            `diff-${control.resolution}.png`,
          );
          return {
            ...await this.createVisualDiff(control.path, experimental.path, diffPath),
            diffPath,
          };
        })(),
      ]);

      const hammingDistance = this.calculateHammingDistance(hash1, hash2);
      const perceptualSimilarity = ((1024 - hammingDistance) / 1024) * 100;

      console.log(`✅ ${resolution.name}: Comparison complete`);

      return {
        resolution: control.resolution,
        perceptualSimilarity: perceptualSimilarity.toFixed(2),
        pixelDifference: pixelDiff.percentDiff.toFixed(2),
        hammingDistance,
        diffPath: pixelDiff.diffPath,
        controlPath: control.path,
        experimentalPath: experimental.path,
      };
    });

    const comparisonStartTime = Date.now();
    const results = await Promise.all(comparisonPromises);
    const comparisonTime = Date.now() - comparisonStartTime;

    const totalTime = Date.now() - startTime;
    console.log(`⏱️  Image comparison completed in ${(comparisonTime / 1000).toFixed(1)}s`);
    console.log(`🎉 Total test completed in ${(totalTime / 1000).toFixed(1)}s`);

    return {
      controlBranch,
      experimentalBranch,
      subdirectory,
      timestamp: new Date().toISOString(),
      performance: {
        screenshotTime: screenshotTime / 1000,
        comparisonTime: comparisonTime / 1000,
        totalTime: totalTime / 1000,
      },
      results,
    };
  }

  async generateHTMLReport(comparisonResults, customFilename, navigationContext) {
    const filename = customFilename && String(customFilename).trim().length > 0
      ? customFilename
      : 'report.html';
    const reportPath = path.join(this.outputDir, filename);
    return generateComparisonReport(comparisonResults, reportPath, navigationContext);
  }
}

export default VisualRegression;
