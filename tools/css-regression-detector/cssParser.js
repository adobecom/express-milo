import fs from 'fs';

class CSSParser {
  constructor() {
    this.parsedFiles = new Map();
  }

  async parseFiles(filePaths) {
    const results = [];

    for (const filePath of filePaths) {
      try {
        const content = await fs.promises.readFile(filePath, 'utf8');
        const parsed = CSSParser.parseCSS(content, filePath);
        results.push(parsed);
        this.parsedFiles.set(filePath, parsed);
      } catch (error) {
        console.warn(`Warning: Could not parse ${filePath}: ${error.message}`);
      }
    }

    return results;
  }

  static parseCSS(content, filePath) {
    const rules = [];
    const lines = content.split('\n');
    let currentRule = null;

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i].trim();

      if (line.includes('{')) {
        // Start of a rule
        const selectorMatch = line.match(/^([^{]+)\s*\{/);
        if (selectorMatch) {
          const selector = selectorMatch[1].trim();
          currentRule = {
            selector,
            declarations: [],
            specificity: CSSParser.calculateSpecificity(selector),
            lineNumber: i + 1,
            filePath,
          };
        }
      } else if (line.includes('}') && currentRule) {
        // End of a rule
        rules.push(currentRule);
        currentRule = null;
      } else if (currentRule && line.includes(':')) {
        // Declaration
        const declarationMatch = line.match(/^\s*([^:]+):\s*([^;]+);?/);
        if (declarationMatch) {
          currentRule.declarations.push({
            property: declarationMatch[1].trim(),
            value: declarationMatch[2].trim(),
          });
        }
      }
    }

    return {
      filePath,
      rules,
      totalRules: rules.length,
    };
  }

  static calculateSpecificity(selector) {
    // Simple specificity calculation (a, b, c, d)
    // a = ID selectors, b = class/attribute/pseudo-class, c = element/pseudo-element
    const idCount = (selector.match(/#[a-zA-Z0-9_-]+/g) || []).length;
    const classCount = (selector.match(/\.[a-zA-Z0-9_-]+/g) || []).length;
    const elementCount = (selector.match(/[a-zA-Z0-9_-]+/g) || []).length;

    return [0, idCount, classCount, elementCount];
  }

  static getSpecificityString(specificity) {
    return `(${specificity[0]},${specificity[1]},${specificity[2]},${specificity[3]})`;
  }

  static compareSpecificity(spec1, spec2) {
    for (let i = 0; i < 4; i += 1) {
      if (spec1[i] > spec2[i]) return 1;
      if (spec1[i] < spec2[i]) return -1;
    }
    return 0;
  }
}

export default CSSParser;
