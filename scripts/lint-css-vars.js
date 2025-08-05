#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);

// Check if --fix flag is provided
const shouldAutoFix = process.argv.includes('--fix');

// Normalize color values for comparison
function normalizeColor(color) {
  // Remove whitespace
  let normalized = color.trim();

  // Handle shorthand hex (#fff -> #ffffff)
  if (/^#[0-9a-fA-F]{3}$/.test(normalized)) {
    normalized = normalized.replace(/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/, '#$1$1$2$2$3$3');
  }

  // Convert to lowercase for consistency
  return normalized.toLowerCase();
}

// Read the root CSS variables
function getRootVariables() {
  const stylesPath = path.join(currentDir, '../express/code/styles/styles.css');
  const stylesContent = fs.readFileSync(stylesPath, 'utf8');

  const colorVars = {};
  const spacingVars = {};

  // Extract color variables
  const colorRegex = /--color-([^:]+):\s*([^;]+);/g;
  let match = colorRegex.exec(stylesContent);

  while (match !== null) {
    const varName = match[1];
    const value = match[2].trim();
    const normalizedValue = normalizeColor(value);
    colorVars[normalizedValue] = `var(--color-${varName})`;
    match = colorRegex.exec(stylesContent);
  }

  // Extract spacing variables
  const spacingRegex = /--spacing-([^:]+):\s*([^;]+);/g;
  match = spacingRegex.exec(stylesContent);

  while (match !== null) {
    const varName = match[1];
    const value = match[2].trim();
    spacingVars[value] = `var(--spacing-${varName})`;
    match = spacingRegex.exec(stylesContent);
  }

  return { colorVars, spacingVars };
}

// Check a CSS file for hardcoded colors and spacing
function checkFile(filePath, colorVars, spacingVars) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // Find all color values in various properties (including shorthand)
  const colorRegex = /(?:color|background-color|border-color|fill|stroke|background|border):\s*([^;]+);/g;
  let match = colorRegex.exec(content);

  while (match !== null) {
    const fullValue = match[1].trim();
    const matchIndex = match.index;

    // Extract color values from the property value
    // This handles cases like "background: #ffffff url(image.png) no-repeat;"
    const colorMatches = fullValue.match(/#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)|[a-zA-Z]+/g);

    if (colorMatches) {
      colorMatches.forEach((colorValue) => {
        const normalizedColor = normalizeColor(colorValue);

        // Check if this color has a corresponding variable
        if (colorVars[normalizedColor]) {
          const lineNumber = content.substring(0, matchIndex).split('\n').length;
          const fullRule = content.substring(matchIndex, content.indexOf(';', matchIndex) + 1).trim();

          // Find the selector by looking backwards for the opening brace
          const beforeMatch = content.substring(0, matchIndex);
          const lastBraceIndex = beforeMatch.lastIndexOf('{');
          const selectorStart = beforeMatch.lastIndexOf('}', lastBraceIndex) + 1;
          const selector = content.substring(selectorStart, lastBraceIndex).trim();

          issues.push({
            file: filePath,
            line: lineNumber,
            value: colorValue,
            suggestion: colorVars[normalizedColor],
            type: 'color',
            fullRule: `${selector} { ${fullRule} }`,
          });
        }
      });
    }

    match = colorRegex.exec(content);
  }

  // Find spacing values
  const spacingRegex = /(margin(?:-top|-right|-bottom|-left|-inline-start|-inline-end)?|padding(?:-top|-right|-bottom|-left|-inline-start|-inline-end)?|gap|top|right|bottom|left|width|height|min-width|max-width|min-height|max-height):\s*([^;]+);/g;
  match = spacingRegex.exec(content);

  while (match !== null) {
    const fullValue = match[2].trim();
    const matchIndex = match.index;

    // Extract spacing values (numbers with units)
    const spacingMatches = fullValue.match(/\d+px|\d+rem|\d+em|\d+%|\d+vw|\d+vh/g);

    if (spacingMatches) {
      const replacements = [];

      spacingMatches.forEach((spacingValue) => {
        // Check if this spacing has a corresponding variable
        if (spacingVars[spacingValue]) {
          replacements.push({
            from: spacingValue,
            to: spacingVars[spacingValue],
          });
        }
      });

      if (replacements.length > 0) {
        const lineNumber = content.substring(0, matchIndex).split('\n').length;
        const fullRule = content.substring(matchIndex, content.indexOf(';', matchIndex) + 1).trim();

        // Find the selector by looking backwards for the opening brace
        const beforeMatch = content.substring(0, matchIndex);
        const lastBraceIndex = beforeMatch.lastIndexOf('{');
        const selectorStart = beforeMatch.lastIndexOf('}', lastBraceIndex) + 1;
        const selector = content.substring(selectorStart, lastBraceIndex).trim();

        issues.push({
          file: filePath,
          line: lineNumber,
          fullRule: `${selector} { ${fullRule} }`,
          replacements,
          type: 'spacing',
        });
      }
    }

    match = spacingRegex.exec(content);
  }

  return issues;
}

// Apply fixes to a CSS file
function applyFixes(filePath, issues) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Sort issues by line number in descending order to avoid offset issues
  const sortedIssues = issues.sort((a, b) => b.line - a.line);

  sortedIssues.forEach((issue) => {
    if (issue.replacements) {
      // Handle spacing replacements
      issue.replacements.forEach((replacement) => {
        const lines = content.split('\n');
        const targetLine = lines[issue.line - 1];

        if (targetLine.includes(replacement.from)) {
          const newLine = targetLine.replace(replacement.from, replacement.to);
          lines[issue.line - 1] = newLine;
          content = lines.join('\n');
          modified = true;
        }
      });
    } else {
      // Handle color replacements
      const lines = content.split('\n');
      const targetLine = lines[issue.line - 1];

      if (targetLine.includes(issue.value)) {
        const newLine = targetLine.replace(issue.value, issue.suggestion);
        lines[issue.line - 1] = newLine;
        content = lines.join('\n');
        modified = true;
      }
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

// Get staged CSS files
function getStagedCSSFiles() {
  try {
    const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
    return stagedFiles
      .split('\n')
      .filter((file) => file.trim() && file.endsWith('.css'))
      .map((file) => path.resolve(file));
  } catch (error) {
    console.error('Error getting staged files:', error.message);
    return [];
  }
}

// Main function
function main() {
  const { colorVars, spacingVars } = getRootVariables();
  const stagedCSSFiles = getStagedCSSFiles();

  if (stagedCSSFiles.length === 0) {
    console.log('✅ No CSS files staged for commit');
    process.exit(0);
  }

  let allIssues = [];

  // Check only staged CSS files
  stagedCSSFiles.forEach((filePath) => {
    const issues = checkFile(filePath, colorVars, spacingVars);
    allIssues = allIssues.concat(issues);
  });

  // Report issues
  if (allIssues.length > 0) {
    console.log('❌ CSS Variable Linting Issues Found in Staged Files:');
    console.log('');

    allIssues.forEach((issue) => {
      console.log(`📁 ${issue.file}:${issue.line}`);
      console.log(`   Found: ${issue.fullRule}`);

      if (issue.replacements) {
        // Multiple replacements for spacing
        console.log('   Replace:');
        issue.replacements.forEach((replacement) => {
          console.log(`     ${replacement.from} → ${replacement.to}`);
        });
      } else {
        // Single replacement for colors
        console.log(`   Use: ${issue.suggestion}`);
      }
      console.log('');
    });

    console.log(`Total issues: ${allIssues.length}`);
    console.log('');
    console.log('💡 Update these hardcoded colors and spacing to use CSS variables from :root');

    if (shouldAutoFix) {
      console.log('🔄 Applying fixes...');
      stagedCSSFiles.forEach((filePath) => {
        applyFixes(filePath, allIssues);
      });
      console.log('✅ Fixes applied. Please re-stage your files.');
    }

    process.exit(1);
  } else {
    console.log('✅ No CSS variable issues found in staged files!');
    process.exit(0);
  }
}

main();
