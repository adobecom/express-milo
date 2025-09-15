#!/usr/bin/env node

/**
 * Test Release Format Script
 * 
 * This script tests the exact release format you want to see in Slack.
 * It simulates the release notification with the PR list format.
 * 
 * Usage:
 *   node scripts/test-release-format.js <WEBHOOK_URL> [CHANNEL]
 */

import https from 'https';
import { URL } from 'url';

// Get command line arguments
const webhookUrl = process.argv[2];
const channel = process.argv[3] || '#express-releases';

if (!webhookUrl) {
  console.error('❌ Error: Webhook URL is required');
  console.log('Usage: node scripts/test-release-format.js <WEBHOOK_URL> [CHANNEL]');
  process.exit(1);
}

// Sample release data (like what you showed)
const sampleReleaseData = {
  text: '🚀 *Express Milo Release Deployed*',
  attachments: [
    {
      color: 'good',
      fields: [
        {
          title: 'Repository',
          value: 'adobecom/express-milo',
          short: true
        },
        {
          title: 'Branch',
          value: 'main',
          short: true
        },
        {
          title: 'Commit',
          value: '<https://github.com/adobecom/express-milo/commit/abc123|abc123>',
          short: true
        }
      ]
    },
    {
      color: '#36a64f',
      text: `## Changes in this Release
- Discover - TOC Links Should Highlight When TOC Just Above Header on Mobile / Tablet #573
- MWPW-179214: Carousel TaaS individual template ids #585
- Content Toggle V2 Indexing #588
- Pricing V3 Fast Follow Updates #597
- MWPW-175257: fix link contrasts and minor fix on v2 outline cutting off #598
- Fixes Nala Image List And How To Steps Tests #600`,
      mrkdwn_in: ['text']
    }
  ],
  footer: 'Express Milo',
  footer_icon: 'https://github.com/adobecom/express-milo/raw/main/express/code/img/favicon.ico'
};

// Send the test message
console.log('🚀 Testing release format...');
console.log(`📡 URL: ${webhookUrl}`);
console.log(`📺 Channel: ${channel}`);
console.log('');

const url = new URL(webhookUrl);
const postData = JSON.stringify(sampleReleaseData);

const options = {
  hostname: url.hostname,
  port: url.port || 443,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Success! Release format test sent to Slack');
      console.log('📱 Check your Slack channel for the notification');
      console.log('');
      console.log('🎉 This is exactly how your release notifications will look!');
      console.log('');
      console.log('📋 The notification includes:');
      console.log('  • Repository and branch info');
      console.log('  • Commit link');
      console.log('  • Clean PR list with titles and numbers');
      console.log('  • Proper formatting and colors');
    } else {
      console.error(`❌ Error: HTTP ${res.statusCode}`);
      console.error('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Network Error:', error.message);
});

req.write(postData);
req.end();
