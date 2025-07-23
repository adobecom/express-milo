#!/usr/bin/env node

import { execFileSync } from 'child_process';
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Simple test runner for the CSS regression detector
console.log('🧪 Testing CSS Regression Detector...\n');

const testDir = join(process.cwd(), 'test-temp');

function cleanup() {
  try {
    if (existsSync(testDir)) {
      // Use execFileSync for safer file operations
      execFileSync('rm', ['-rf', testDir]);
    }
  } catch (error) {
    // Ignore cleanup errors
  }
}

function test(name, testFn) {
  console.log(`Testing: ${name}`);
  try {
    testFn();
    console.log(`✅ ${name} - PASSED\n`);
    return true;
  } catch (error) {
    console.log(`❌ ${name} - FAILED: ${error.message}\n`);
    return false;
  }
}

// Test 1: Basic functionality
test('Tool runs without errors', () => {
  const result = execFileSync('node', ['cli.js'], { encoding: 'utf8', cwd: process.cwd() });
  if (!result.includes('No staged CSS files found')) {
    throw new Error('Expected tool to run and show "No staged CSS files found" message');
  }
});

// Test 2: Scan-all mode
test('Scan-all mode works', () => {
  const result = execFileSync('node', ['cli.js', '--scan-all'], { encoding: 'utf8', cwd: process.cwd() });
  if (!result.includes('Full Codebase Scan')) {
    throw new Error('Expected scan-all mode to work');
  }
});

// Test 3: Help output
test('Help command works', () => {
  const result = execFileSync('node', ['cli.js', '--help'], { encoding: 'utf8', cwd: process.cwd() });
  if (!result.includes('Detect CSS regressions')) {
    throw new Error('Expected help output');
  }
});

// Test 4: Configuration loading
test('Configuration loading works', () => {
  const configContent = JSON.stringify({
    dangerSelectors: ['.test-danger'],
    thresholds: { specificityIncrease: 1 },
  });
  const configFile = join(testDir, '.css-check.config.json');

  mkdirSync(testDir, { recursive: true });
  writeFileSync(configFile, configContent);

  try {
    const result = execFileSync('node', ['cli.js', '--config', configFile, '--scan-all'], { encoding: 'utf8', cwd: process.cwd() });
    if (!result.includes('CSS Regression Detector')) {
      throw new Error('Expected tool to run with custom config');
    }
  } finally {
    if (existsSync(configFile)) {
      unlinkSync(configFile);
    }
  }
});

console.log('🎉 All tests completed!');
cleanup();
