import { chromium } from '@playwright/test';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RESOLUTIONS = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1920, height: 1080, name: 'desktop' }
];

class VisualRegression {
  constructor(options = {}) {
    this.outputDir = options.outputDir || path.join(__dirname, 'output');
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
          timeout: this.pageTimeout
        });
        
        // Wait for AEM blocks to load and render
        console.log(`📱 ${branch} - ${resolution.name}: Waiting for blocks...`);
        await page.waitForTimeout(this.waitForBlocks);
        
        // Wait for any lazy-loaded images or components
        console.log(`📱 ${branch} - ${resolution.name}: Checking images...`);
        await page.waitForFunction(() => {
          const images = document.querySelectorAll('img');
          return Array.from(images).every(img => img.complete);
        }, { timeout: this.waitForImages }).catch(() => {
          console.log(`⚠️  ${branch} - ${resolution.name}: Some images may not have loaded`);
        });
        
        // Additional wait for any animations or dynamic content
        await page.waitForTimeout(this.finalWait);
        
        const screenshotPath = path.join(
          this.outputDir, 
          'screenshots', 
          `${branch}-${resolution.name}.png`
        );
        
        console.log(`📸 ${branch} - ${resolution.name}: Taking screenshot...`);
        await page.screenshot({ 
          path: screenshotPath,
          fullPage: true 
        });
        
        console.log(`✅ ${branch} - ${resolution.name}: Complete`);
        
        return {
          path: screenshotPath,
          resolution: resolution.name,
          branch
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
    const hash = pixels.map(p => p > average ? 1 : 0).join('');
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
    
    // Ensure images are same size by resizing to largest dimensions
    const width = Math.max(img1.width, img2.width);
    const height = Math.max(img1.height, img2.height);
    
    // Resize images if needed using Sharp
    let img1Data, img2Data;
    
    if (img1.width !== width || img1.height !== height) {
      const resized = await sharp(img1Path)
        .resize(width, height)
        .png()
        .toBuffer();
      img1Data = PNG.sync.read(resized).data;
    } else {
      img1Data = img1.data;
    }
    
    if (img2.width !== width || img2.height !== height) {
      const resized = await sharp(img2Path)
        .resize(width, height)
        .png()
        .toBuffer();
      img2Data = PNG.sync.read(resized).data;
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
      { threshold: 0.1 }
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
            `diff-${control.resolution}.png`
          );
          return {
            ...await this.createVisualDiff(control.path, experimental.path, diffPath),
            diffPath
          };
        })()
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
        experimentalPath: experimental.path
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
        totalTime: totalTime / 1000
      },
      results
    };
  }

  async generateHTMLReport(comparisonResults) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Visual Regression Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: #333; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .comparison { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px; }
        .metric { background: #f8f8f8; padding: 15px; border-radius: 4px; text-align: center; }
        .metric .value { font-size: 24px; font-weight: bold; margin: 10px 0; }
        .good { color: #28a745; }
        .warning { color: #ffc107; }
        .bad { color: #dc3545; }
        .images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .image-container { text-align: center; }
        .image-container h4 { margin: 10px 0; }
        .screenshot-link { 
            text-decoration: none; 
            color: inherit;
            display: block;
        }
        .thumbnail {
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 8px;
            padding: 30px 20px;
            color: #6c757d;
            transition: all 0.2s ease;
            cursor: pointer;
            text-align: center;
        }
        .thumbnail:hover {
            background: #e9ecef;
            border-color: #007bff;
            color: #007bff;
            transform: translateY(-2px);
        }
        .thumbnail-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }
        .thumbnail-text {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 4px;
        }
        .thumbnail-detail {
            font-size: 12px;
            opacity: 0.7;
        }
        .summary {
            background: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .quick-links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .quick-link-group {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
        }
        .quick-link-group h4 {
            margin: 0 0 8px 0;
            color: #495057;
        }
        .quick-link-group a {
            color: #007bff;
            text-decoration: none;
            font-size: 14px;
        }
        .quick-link-group a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Visual Regression Report</h1>
        <p>Comparing: <strong>${comparisonResults.controlBranch}</strong> vs <strong>${comparisonResults.experimentalBranch}</strong></p>
        <p>Path: ${comparisonResults.subdirectory}</p>
        <p>Generated: ${new Date(comparisonResults.timestamp).toLocaleString()}</p>
        ${comparisonResults.performance ? `
        <p>⏱️ Performance: Screenshots ${comparisonResults.performance.screenshotTime.toFixed(1)}s, 
        Comparison ${comparisonResults.performance.comparisonTime.toFixed(1)}s, 
        Total ${comparisonResults.performance.totalTime.toFixed(1)}s</p>
        ` : ''}
    </div>
    
    <div class="summary">
        <h2>Quick Links</h2>
        <div class="quick-links">
            ${comparisonResults.results.map(result => `
                <div class="quick-link-group">
                    <h4>${result.resolution.charAt(0).toUpperCase() + result.resolution.slice(1)}</h4>
                    <a href="screenshots/${path.basename(result.controlPath)}" target="_blank">Control</a> | 
                    <a href="screenshots/${path.basename(result.experimentalPath)}" target="_blank">Experimental</a> | 
                    <a href="diffs/${path.basename(result.diffPath)}" target="_blank">Diff</a>
                </div>
            `).join('')}
        </div>
    </div>
    
    ${comparisonResults.results.map(result => `
        <div class="comparison">
            <h2>${result.resolution.charAt(0).toUpperCase() + result.resolution.slice(1)} Resolution</h2>
            
            <div class="metrics">
                <div class="metric">
                    <div>Perceptual Similarity</div>
                    <div class="value ${result.perceptualSimilarity > 95 ? 'good' : result.perceptualSimilarity > 90 ? 'warning' : 'bad'}">
                        ${result.perceptualSimilarity}%
                    </div>
                </div>
                <div class="metric">
                    <div>Pixel Difference</div>
                    <div class="value ${result.pixelDifference < 1 ? 'good' : result.pixelDifference < 5 ? 'warning' : 'bad'}">
                        ${result.pixelDifference}%
                    </div>
                </div>
                <div class="metric">
                    <div>Hamming Distance</div>
                    <div class="value">${result.hammingDistance}</div>
                </div>
            </div>
            
            <div class="images">
                <div class="image-container">
                    <h4>Control (${comparisonResults.controlBranch})</h4>
                    <a href="../screenshots/${path.basename(result.controlPath)}" target="_blank" class="screenshot-link">
                        <div class="thumbnail">
                            <div class="thumbnail-icon">📸</div>
                            <div class="thumbnail-text">View Screenshot</div>
                            <div class="thumbnail-detail">${result.resolution} resolution</div>
                        </div>
                    </a>
                </div>
                <div class="image-container">
                    <h4>Experimental (${comparisonResults.experimentalBranch})</h4>
                    <a href="../screenshots/${path.basename(result.experimentalPath)}" target="_blank" class="screenshot-link">
                        <div class="thumbnail">
                            <div class="thumbnail-icon">📸</div>
                            <div class="thumbnail-text">View Screenshot</div>
                            <div class="thumbnail-detail">${result.resolution} resolution</div>
                        </div>
                    </a>
                </div>
                <div class="image-container">
                    <h4>Difference</h4>
                    <a href="../diffs/${path.basename(result.diffPath)}" target="_blank" class="screenshot-link">
                        <div class="thumbnail">
                            <div class="thumbnail-icon">🔍</div>
                            <div class="thumbnail-text">View Diff</div>
                            <div class="thumbnail-detail">${result.pixelDifference}% different</div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    `).join('')}
</body>
</html>
    `;
    
    const reportPath = path.join(this.outputDir, 'report.html');
    await fs.writeFile(reportPath, html);
    return reportPath;
  }
}

export default VisualRegression;