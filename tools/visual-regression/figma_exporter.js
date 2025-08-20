import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

class FigmaExporter {
  constructor() {
    this.token = process.env.FIGMA_TOKEN;
    if (!this.token) {
      throw new Error('FIGMA_TOKEN environment variable is required');
    }
    this.baseURL = 'https://api.figma.com/v1';
    this.inputDir = path.join(__dirname, 'input');
  }

  ensureInputDirectory() {
    if (!fs.existsSync(this.inputDir)) {
      fs.mkdirSync(this.inputDir, { recursive: true });
    }
  }

  parseFigmaUrl(url) {
    const figmaUrlRegex = /figma\.com\/(?:file|proto|design)\/([A-Za-z0-9]+)\/[^?]*(?:\?.*node-id=([0-9-:]+))?/;
    const match = url.match(figmaUrlRegex);

    if (!match) {
      throw new Error('Invalid Figma URL format');
    }

    const fileKey = match[1];
    let nodeId = match[2];

    if (nodeId) {
      nodeId = nodeId.replace(/-/g, ':');
    }

    return { fileKey, nodeId };
  }

  async downloadFrame(fileKey, nodeId, filename = 'frame.png') {
    try {
      this.ensureInputDirectory();

      // Get image URLs from Figma API
      const imageResponse = await fetch(
        `${this.baseURL}/images/${fileKey}?ids=${nodeId}&format=png&scale=1`,
        {
          headers: {
            'X-Figma-Token': this.token,
          },
        },
      );

      if (!imageResponse.ok) {
        throw new Error(`Figma API error: ${imageResponse.status} ${imageResponse.statusText}`);
      }

      const imageData = await imageResponse.json();

      if (imageData.err) {
        throw new Error(`Figma API error: ${imageData.err}`);
      }

      const imageUrl = imageData.images[nodeId];
      if (!imageUrl) {
        throw new Error(`No image URL found for node ${nodeId}`);
      }

      // Download the actual image
      const downloadResponse = await fetch(imageUrl);
      if (!downloadResponse.ok) {
        throw new Error(`Failed to download image: ${downloadResponse.status} ${downloadResponse.statusText}`);
      }

      const buffer = await downloadResponse.arrayBuffer();
      const outputPath = path.join(this.inputDir, filename);

      fs.writeFileSync(outputPath, Buffer.from(buffer));

      // Get image dimensions using Sharp
      const metadata = await sharp(outputPath).metadata();

      console.log(`Frame downloaded successfully to: ${outputPath}`);
      console.log(`Dimensions: ${metadata.width}x${metadata.height}`);

      return {
        path: outputPath,
        width: metadata.width,
        height: metadata.height,
      };
    } catch (error) {
      console.error('Error downloading frame:', error.message);
      throw error;
    }
  }

  async downloadFromUrl(figmaUrl, filename = 'figma-reference.png') {
    const { fileKey, nodeId } = this.parseFigmaUrl(figmaUrl);

    if (!nodeId) {
      throw new Error('Figma URL must include a node-id parameter to specify which frame to export');
    }

    return this.downloadFrame(fileKey, nodeId, filename);
  }
}

// Export for use as module
export default FigmaExporter;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Figma Exporter - Download frames from Figma');
    console.log('');
    console.log('Usage:');
    console.log('  Download frame by file key and node ID:');
    console.log('    node figma_exporter.js <fileKey> <nodeId> [filename]');
    console.log('');
    console.log('  Download frame from Figma URL:');
    console.log('    node figma_exporter.js url <figmaUrl> [filename]');
    console.log('');
    console.log('Examples:');
    console.log('  node figma_exporter.js abc123 1:123 my-frame.png');
    console.log('  node figma_exporter.js url "https://figma.com/file/abc123/Design?node-id=1-123" reference.png');
    console.log('');
    console.log('For image comparison, use the main visual regression tool:');
    console.log('  visual-compare compare <control-branch> <experimental-branch> <path>');
    process.exit(1);
  }

  const exporter = new FigmaExporter();

  if (args[0] === 'url') {
    const [, figmaUrl, filename] = args;

    if (!figmaUrl) {
      console.error('Error: Figma URL is required');
      console.log('Usage: node figma_exporter.js url <figmaUrl> [filename]');
      process.exit(1);
    }

    exporter.downloadFromUrl(figmaUrl, filename)
      .then((result) => {
        console.log(`✅ Download completed: ${result.path}`);
      })
      .catch((error) => {
        console.error('Download failed:', error.message);
        process.exit(1);
      });
  } else {
    const [fileKey, nodeId, filename] = args;

    if (!fileKey || !nodeId) {
      console.error('Error: Both fileKey and nodeId are required');
      console.log('Usage: node figma_exporter.js <fileKey> <nodeId> [filename]');
      process.exit(1);
    }

    exporter.downloadFrame(fileKey, nodeId, filename)
      .then((result) => {
        console.log(`✅ Download completed: ${result.path}`);
      })
      .catch((error) => {
        console.error('Export failed:', error.message);
        process.exit(1);
      });
  }
}
