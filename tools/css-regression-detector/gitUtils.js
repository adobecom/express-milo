import { simpleGit } from 'simple-git';
import { glob } from 'glob';
import fs from 'fs';

class GitUtils {
  constructor() {
    this.git = simpleGit();
  }

  async getStagedCSSFiles() {
    try {
      const stagedFiles = await this.git.diff(['--cached', '--name-only']);
      const cssFiles = stagedFiles
        .split('\n')
        .filter((file) => file.trim() && GitUtils.isCSSFile(file))
        .filter((file) => fs.existsSync(file));

      return cssFiles;
    } catch (error) {
      throw new Error(`Failed to get staged CSS files: ${error.message}`);
    }
  }

  static async getAllCSSFiles() {
    try {
      const cssPatterns = ['**/*.css', '**/*.scss', '**/*.sass'];
      const files = [];

      for (const pattern of cssPatterns) {
        const matches = await glob(pattern, {
          ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/*.min.css'],
        });
        files.push(...matches);
      }

      return [...new Set(files)]; // Remove duplicates
    } catch (error) {
      throw new Error(`Failed to get all CSS files: ${error.message}`);
    }
  }

  static isCSSFile(filePath) {
    const cssExtensions = ['.css', '.scss', '.sass'];
    const ext = filePath.toLowerCase().substring(filePath.lastIndexOf('.'));
    return cssExtensions.includes(ext);
  }

  async getFileContent(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error.message}`);
    }
  }

  async isStaged(filePath) {
    try {
      const stagedFiles = await this.git.diff(['--cached', '--name-only']);
      return stagedFiles.includes(filePath);
    } catch (error) {
      return false;
    }
  }
}

export default GitUtils;
