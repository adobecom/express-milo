#!/usr/bin/env node

/**
 * Preview Release Format Script
 * 
 * This script shows you exactly how the release notifications will look
 * without needing a webhook URL. It displays the formatted output in the console.
 * 
 * Usage:
 *   node scripts/preview-release-format.js
 */

console.log('🚀 Express Milo Release Deployed');
console.log('');
console.log('Repository: adobecom/express-milo');
console.log('Branch: main');
console.log('Commit: abc123 (https://github.com/adobecom/express-milo/commit/abc123)');
console.log('');
console.log('## Changes in this Release');
console.log('- Discover - TOC Links Should Highlight When TOC Just Above Header on Mobile / Tablet #573');
console.log('- MWPW-179214: Carousel TaaS individual template ids #585');
console.log('- Content Toggle V2 Indexing #588');
console.log('- Pricing V3 Fast Follow Updates #597');
console.log('- MWPW-175257: fix link contrasts and minor fix on v2 outline cutting off #598');
console.log('- Fixes Nala Image List And How To Steps Tests #600');
console.log('');
console.log('---');
console.log('');
console.log('This is exactly how your Slack notifications will look!');
console.log('');
console.log('To test with a real webhook:');
console.log('  node scripts/test-release-format.js YOUR_WEBHOOK_URL #your-channel');
console.log('');
console.log('To test basic webhook connectivity:');
console.log('  node scripts/test-slack-webhook.js YOUR_WEBHOOK_URL #your-channel');
