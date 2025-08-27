#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import VisualRegression from './index.js';

/**
 * Batch runner: compare many URLs with configurable concurrency.
 *
 * Usage:
 *   node batch-run.js <control-branch> <experimental-branch> <urls.txt> [--concurrency=4] [--slow|--fast] [--timeout=60000] [--wait=5000]
 *   node batch-run.js main stage paths.txt --concurrency=3 --slow
 *
 * Each line in the urls file should be a path like /express/pricing (blank lines and lines starting with # are ignored)
 */

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.length < 3) {
    console.log(chalk.red('Usage: node batch-run.js <control-branch> <experimental-branch> <urls.txt> [--concurrency=4] [--slow|--fast] [--timeout=60000] [--wait=5000]'));
    process.exit(1);
  }

  const [controlBranch, experimentalBranch, urlsFile] = args;
  const opts = { concurrency: 4, timing: 'fast', timeout: undefined, wait: undefined };
  for (const arg of args.slice(3)) {
    if (arg.startsWith('--concurrency=')) opts.concurrency = Math.max(1, parseInt(arg.split('=')[1], 10) || 4);
    if (arg === '--slow') opts.timing = 'slow';
    if (arg === '--fast') opts.timing = 'fast';
    if (arg.startsWith('--timeout=')) opts.timeout = parseInt(arg.split('=')[1], 10);
    if (arg.startsWith('--wait=')) opts.wait = parseInt(arg.split('=')[1], 10);
  }

  return { controlBranch, experimentalBranch, urlsFile, opts };
}

async function readUrls(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return raw
    .split(/\r?\n/) 
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'));
}

function createLimiter(maxConcurrency) {
  let active = 0;
  const queue = [];

  const runNext = () => {
    if (active >= maxConcurrency) return;
    const next = queue.shift();
    if (!next) return;
    active += 1;
    next()
      .catch(() => {})
      .finally(() => {
        active -= 1;
        runNext();
      });
  };

  return (task) => new Promise((resolve, reject) => {
    const wrapped = async () => {
      try { resolve(await task()); } catch (e) { reject(e); }
    };
    queue.push(wrapped);
    setImmediate(runNext);
  });
}

export async function runBatch(controlBranch, experimentalBranch, urlsFile, options = {}) {
  const urls = await readUrls(urlsFile);
  if (urls.length === 0) {
    throw new Error('No URLs found in the provided file.');
  }

  const opts = {
    concurrency: typeof options.concurrency === 'number' ? options.concurrency : 4,
    timing: options.timing === 'slow' ? 'slow' : 'fast',
    timeout: typeof options.timeout === 'number' ? options.timeout : undefined,
    wait: typeof options.wait === 'number' ? options.wait : undefined,
  };

  const spinner = ora(`Starting batch: ${urls.length} URL(s), concurrency ${opts.concurrency}...`).start();

  const vrOptions = {};
  if (opts.timing === 'slow') {
    vrOptions.pageTimeout = 60000;
    vrOptions.waitForBlocks = 5000;
    vrOptions.waitForImages = 10000;
    vrOptions.finalWait = 3000;
  }
  if (typeof opts.timeout === 'number') vrOptions.pageTimeout = opts.timeout;
  if (typeof opts.wait === 'number') { vrOptions.waitForBlocks = opts.wait; vrOptions.finalWait = Math.floor(opts.wait / 2); }

  const limiter = createLimiter(opts.concurrency);

  const results = [];
  const failures = [];
  let completed = 0;

  await Promise.all(urls.map((subdirectory) => limiter(async () => {
    const label = `${subdirectory}`;
    const runSpinner = ora({ text: `Comparing ${controlBranch} vs ${experimentalBranch} ${label}`, spinner: 'dots' }).start();
    try {
      const vr = new VisualRegression(vrOptions);
      const comparison = await vr.compare(controlBranch, experimentalBranch, subdirectory);
      const reportName = `report${subdirectory.replace(/\//g, '_')}.html`;
      const reportPath = await vr.generateHTMLReport(comparison, reportName);
      results.push({ subdirectory, reportPath, comparison });
      runSpinner.succeed(`Done ${label}`);
    } catch (err) {
      failures.push({ subdirectory, error: err.message });
      runSpinner.fail(`Failed ${label} - ${err.message}`);
    } finally {
      completed += 1;
      spinner.text = `Progress: ${completed}/${urls.length}`;
    }
  })));

  spinner.succeed(`Batch complete: ${results.length} succeeded, ${failures.length} failed`);

  const summary = {
    success: failures.length === 0,
    controlBranch,
    experimentalBranch,
    total: urls.length,
    succeeded: results.length,
    failed: failures.length,
    results: results.map((r) => ({ subdirectory: r.subdirectory, reportPath: r.reportPath })),
    failures,
  };

  // Write a machine-readable summary next to reports directory
  const outDir = path.join(path.dirname(new URL(import.meta.url).pathname), 'output');
  const summaryPath = path.join(outDir, `batch-summary-${Date.now()}.json`);
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8');

  console.log('\n' + chalk.bold('Batch Summary:'));
  console.log(JSON.stringify(summary, null, 2));
  console.log(chalk.blue(`\nSummary written to: ${summaryPath}`));

  return { summary, summaryPath };
}

// Allow running directly via `node batch-run.js ...`
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const { controlBranch, experimentalBranch, urlsFile, opts } = parseArgs(process.argv);
    await runBatch(controlBranch, experimentalBranch, urlsFile, {
      concurrency: opts.concurrency,
      timing: opts.timing,
      timeout: opts.timeout,
      wait: opts.wait,
    });
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export default runBatch;

