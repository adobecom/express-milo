#!/usr/bin/env node

/**
 * Test Slack Webhook Connection
 * 
 * This script tests your Slack webhook URL to make sure it's working.
 * 
 * Usage:
 *   node scripts/test-webhook-connection.js
 * 
 * Make sure to set your webhook URL as an environment variable:
 *   export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
 *   node scripts/test-webhook-connection.js
 */

import https from 'https';
import { URL } from 'url';

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

if (!webhookUrl) {
  console.log('❌ Error: SLACK_WEBHOOK_URL environment variable not set');
  console.log('');
  console.log('Please set your webhook URL:');
  console.log('  export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"');
  console.log('  node scripts/test-webhook-connection.js');
  process.exit(1);
}

console.log('🧪 Testing Slack Webhook Connection');
console.log('=' .repeat(40));
console.log('');

// Test message
const testMessage = {
  text: '🧪 Test message from Express Milo release notification system!',
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Express Milo Release Notification Test* 🚀\n\nThis is a test message to verify your Slack webhook is working correctly.'
      }
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Test sent at: ${new Date().toISOString()}`
        }
      ]
    }
  ]
};

// Send the test message
const url = new URL(webhookUrl);
const postData = JSON.stringify(testMessage);

const options = {
  hostname: url.hostname,
  port: 443,
  path: url.pathname + url.search,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('📤 Sending test message to Slack...');
console.log(`   Webhook: ${url.hostname}${url.pathname}`);

const req = https.request(options, (res) => {
  console.log(`   Status: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    console.log('✅ Success! Your Slack webhook is working correctly.');
    console.log('');
    console.log('🎉 You should see a test message in your Slack channel!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Add SLACK_WEBHOOK_URL to your GitHub repository secrets');
    console.log('2. The release notification workflow will automatically trigger on pushes to main');
  } else {
    console.log('❌ Error: Webhook returned non-200 status');
    console.log(`   Status: ${res.statusCode}`);
    console.log('   Check your webhook URL and try again.');
  }
});

req.on('error', (error) => {
  console.log('❌ Error sending webhook:');
  console.log(`   ${error.message}`);
  console.log('');
  console.log('Please check:');
  console.log('1. Your webhook URL is correct');
  console.log('2. Your internet connection is working');
  console.log('3. The Slack webhook is still active');
});

req.write(postData);
req.end();
