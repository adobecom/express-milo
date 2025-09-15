#!/usr/bin/env node

/**
 * Test Slack Webhook Script
 * 
 * This script tests your Slack webhook URL to ensure it's working correctly
 * before setting up the GitHub Actions workflows.
 * 
 * Usage:
 *   node scripts/test-slack-webhook.js <WEBHOOK_URL> [CHANNEL]
 * 
 * Example:
 *   node scripts/test-slack-webhook.js https://hooks.slack.com/services/... #test-channel
 */

const https = require('https');
const { URL } = require('url');

// Get command line arguments
const webhookUrl = process.argv[2];
const channel = process.argv[3] || '#express-releases';

if (!webhookUrl) {
  console.error('❌ Error: Webhook URL is required');
  console.log('Usage: node scripts/test-slack-webhook.js <WEBHOOK_URL> [CHANNEL]');
  console.log('Example: node scripts/test-slack-webhook.js https://hooks.slack.com/services/... #test-channel');
  process.exit(1);
}

// Validate webhook URL
try {
  new URL(webhookUrl);
} catch (error) {
  console.error('❌ Error: Invalid webhook URL');
  console.error('Please provide a valid Slack webhook URL');
  process.exit(1);
}

// Test payload
const testPayload = {
  text: '🧪 *Express Milo Slack Integration Test*',
  attachments: [
    {
      color: 'good',
      fields: [
        {
          title: 'Test Type',
          value: 'Webhook connectivity test',
          short: true
        },
        {
          title: 'Channel',
          value: channel,
          short: true
        },
        {
          title: 'Time',
          value: new Date().toISOString(),
          short: true
        },
        {
          title: 'Status',
          value: '✅ Webhook is working correctly!',
          short: false
        }
      ],
      footer: 'Express Milo Test Script',
      footer_icon: 'https://github.com/adobecom/express-milo/raw/main/express/code/img/favicon.ico',
      ts: Math.floor(Date.now() / 1000)
    }
  ]
};

// Send the test message
console.log('🚀 Testing Slack webhook...');
console.log(`📡 URL: ${webhookUrl}`);
console.log(`📺 Channel: ${channel}`);
console.log('');

const url = new URL(webhookUrl);
const postData = JSON.stringify(testPayload);

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
      console.log('✅ Success! Test message sent to Slack');
      console.log('📱 Check your Slack channel for the notification');
      console.log('');
      console.log('🎉 Your webhook is working correctly!');
      console.log('You can now set up the GitHub Actions workflows.');
    } else {
      console.error(`❌ Error: HTTP ${res.statusCode}`);
      console.error('Response:', data);
      console.log('');
      console.log('🔧 Troubleshooting:');
      console.log('1. Check that your webhook URL is correct');
      console.log('2. Verify the webhook is still active in Slack');
      console.log('3. Make sure the channel exists and the webhook has permission');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Network Error:', error.message);
  console.log('');
  console.log('🔧 Troubleshooting:');
  console.log('1. Check your internet connection');
  console.log('2. Verify the webhook URL is accessible');
  console.log('3. Check if there are any firewall restrictions');
});

req.write(postData);
req.end();

// Also test with a simple message
setTimeout(() => {
  console.log('');
  console.log('🔄 Sending simple test message...');
  
  const simplePayload = {
    text: '✅ Express Milo webhook test successful!'
  };
  
  const simplePostData = JSON.stringify(simplePayload);
  const simpleReq = https.request(options, (res) => {
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Simple test message also sent successfully');
      } else {
        console.log('⚠️  Simple test message failed, but detailed test worked');
      }
    });
  });
  
  simpleReq.on('error', () => {
    console.log('⚠️  Simple test message failed, but detailed test worked');
  });
  
  simpleReq.write(simplePostData);
  simpleReq.end();
}, 1000);
