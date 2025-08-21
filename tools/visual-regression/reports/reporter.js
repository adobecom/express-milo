import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Template paths
const TEMPLATES_DIR = path.join(__dirname, 'templates');

// Read template file
const readTemplate = async (templateName) => {
  const templatePath = path.join(TEMPLATES_DIR, templateName);
  return await fs.readFile(templatePath, 'utf8');
};

// Replace template variables
const replaceTemplateVars = (template, data) => {
  let result = template;
  
  // Replace simple variables like {{variable}}
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, value);
  });
  
  return result;
};

// Generate visual regression comparison report
export const generateComparisonReport = async (comparisonResults, outputPath) => {
  const template = await readTemplate('comparison-report.html');
  
  // Format the results for template
  const templateData = {
    controlBranch: comparisonResults.controlBranch,
    experimentalBranch: comparisonResults.experimentalBranch,
    subdirectory: comparisonResults.subdirectory,
    timestamp: new Date(comparisonResults.timestamp).toLocaleString(),
    performanceInfo: comparisonResults.performance ? `
      <p>⏱️ Performance: Screenshots ${comparisonResults.performance.screenshotTime.toFixed(1)}s, 
      Comparison ${comparisonResults.performance.comparisonTime.toFixed(1)}s, 
      Total ${comparisonResults.performance.totalTime.toFixed(1)}s</p>
    ` : '',
    quickLinks: comparisonResults.results.map(result => `
      <div class="quick-link-group">
        <h4>${result.resolution.charAt(0).toUpperCase() + result.resolution.slice(1)}</h4>
        <a href="screenshots/${path.basename(result.controlPath)}" target="_blank">Control</a> | 
        <a href="screenshots/${path.basename(result.experimentalPath)}" target="_blank">Experimental</a> | 
        <a href="diffs/${path.basename(result.diffPath)}" target="_blank">Diff</a>
      </div>
    `).join(''),
    comparisonResults: comparisonResults.results.map(result => `
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
    `).join('')
  };
  
  const html = replaceTemplateVars(template, templateData);
  await fs.writeFile(outputPath, html);
  return outputPath;
};

// Generate Figma comparison report (simple version)
export const generateFigmaComparisonReport = async (data, outputPath) => {
  const template = await readTemplate('figma-comparison-report.html');
  
  const outputDir = path.dirname(outputPath);
  const templateData = {
    title: `Figma Comparison - ${data.success ? 'PASS' : 'FAIL'}`,
    status: data.success ? '✅ PASS' : '❌ FAIL',
    reference: data.reference,
    websiteUrl: data.websiteUrl,
    viewport: `${data.viewport.width}x${data.viewport.height}`,
    pixelDifference: data.pixelDifference.toFixed(2),
    pixelDiffColor: data.success ? '#28a745' : '#dc3545',
    threshold: data.threshold,
    timestamp: new Date().toLocaleString(),
    referenceImagePath: path.relative(outputDir, data.referencePath),
    screenshotPath: path.relative(outputDir, data.screenshotPath),
    diffPath: path.relative(outputDir, data.diffPath),
    testStatus: data.success ? 'PASS' : 'FAIL'
  };
  
  const html = replaceTemplateVars(template, templateData);
  await fs.writeFile(outputPath, html);
  return outputPath;
};

// Generate interactive Figma comparison report
export const generateInteractiveFigmaReport = async (data, outputPath) => {
  const template = await readTemplate('interactive-comparison.html');
  
  const outputDir = path.dirname(outputPath);
  const html = template
    .replace(/reference\.png/g, path.relative(outputDir, data.referencePath))
    .replace(/screenshot\.png/g, path.relative(outputDir, data.screenshotPath))
    .replace('<title>Interactive Visual Comparison</title>', 
      `<title>Interactive Figma Comparison - ${data.success ? 'PASS' : 'FAIL'}</title>`)
    .replace('<h1>Interactive Visual Comparison</h1>', 
      `<h1>Interactive Figma Comparison - ${data.success ? '✅ PASS' : '❌ FAIL'}</h1>
       <p>Reference: <strong>${data.reference}</strong></p>
       <p>Website: <strong>${data.websiteUrl}</strong></p>
       <p>Viewport: <strong>${data.viewport.width}x${data.viewport.height}</strong></p>
       <p>Pixel Difference: <strong style="color: ${data.success ? '#28a745' : '#dc3545'}">${data.pixelDifference.toFixed(2)}%</strong> (threshold: ${data.threshold}%)</p>
       <p>Generated: ${new Date().toLocaleString()}</p>`);
  
  await fs.writeFile(outputPath, html);
  return outputPath;
};

// Generate live comparison report
export const generateLiveComparisonReport = async (data, outputPath) => {
  const template = await readTemplate('live-comparison-report.html');
  
  const outputDir = path.dirname(outputPath);
  const templateData = {
    sessionId: data.sessionId,
    viewportName: data.viewportName,
    timestamp: new Date().toLocaleString(),
    status: data.diffPercentage <= data.threshold ? 'PASS ✅' : 'FAIL ❌',
    statusClass: data.diffPercentage <= data.threshold ? 'pass' : 'fail',
    diffPercentage: data.diffPercentage,
    threshold: data.threshold,
    comparisonCount: data.comparisonCount,
    referenceImagePath: path.relative(outputDir, data.referenceImage),
    snapshotPath: path.basename(data.snapshotPath),
    diffPath: path.basename(data.diffPath),
  };
  
  const html = replaceTemplateVars(template, templateData);
  await fs.writeFile(outputPath, html);
  return outputPath;
};

// Export all report generation functions
export default {
  generateComparisonReport,
  generateFigmaComparisonReport,
  generateInteractiveFigmaReport,
  generateLiveComparisonReport,
};