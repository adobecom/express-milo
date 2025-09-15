#!/usr/bin/env node

/**
 * Test Real Slack Release Notification
 * 
 * This sends the actual enhanced release notification format
 * to your Slack channel using the webhook.
 */

import https from 'https';
import { URL } from 'url';

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

if (!webhookUrl) {
  console.log('❌ Error: SLACK_WEBHOOK_URL environment variable not set');
  console.log('');
  console.log('Please set your webhook URL:');
  console.log('  export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"');
  console.log('  node scripts/test-real-slack-release.js');
  process.exit(1);
}

console.log('🧪 Testing Real Slack Release Notification');
console.log('=' .repeat(50));
console.log('');

// Enhanced release notification payload
const releaseNotification = {
  text: "🚀 *Express Milo Release Deployed*",
  attachments: [
    {
      color: "good",
      fields: [
        {
          title: "Repository",
          value: "adobecom/express-milo",
          short: true
        },
        {
          title: "Branch",
          value: "main",
          short: true
        },
        {
          title: "Commit",
          value: "<https://github.com/adobecom/express-milo/commit/abc123|abc123>",
          short: true
        }
      ]
    },
    {
      color: "#36a64f",
      text: `## Changes in this Release
- <https://jira.corp.adobe.com/browse/MWPW-179214|MWPW-179214: Carousel TaaS individual template ids> (#585)
- <https://jira.corp.adobe.com/browse/MWPW-175257|MWPW-175257: Fix link contrasts and minor fix on v2 outline cutting off> (#598)
- <https://jira.corp.adobe.com/browse/MWPW-172990|MWPW-172990: Discover - TOC Links Should Highlight When TOC Just Above Header on Mobile / Tablet> (#573)
- <https://github.com/adobecom/express-milo/pull/588|Content Toggle V2 Indexing> (#588)
- <https://github.com/adobecom/express-milo/pull/597|Pricing V3 Fast Follow Updates> (#597)
- <https://github.com/adobecom/express-milo/pull/600|Fixes Nala Image List And How To Steps Tests> (#600)`,
      mrkdwn_in: ["text"]
    }
  ],
  footer: "Express Milo",
  footer_icon: "https://github.com/adobecom/express-milo/raw/main/express/code/img/favicon.ico"
};

// Send the notification
const url = new URL(webhookUrl);
const postData = JSON.stringify(releaseNotification);

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

console.log('📤 Sending enhanced release notification to Slack...');
console.log(`   Channel: #automated-release-notification-to-express-dev-core`);
console.log(`   Webhook: ${url.hostname}${url.pathname}`);
console.log('');

const req = https.request(options, (res) => {
  console.log(`   Status: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    console.log('✅ Success! Enhanced release notification sent to Slack!');
    console.log('');
    console.log('🎉 Check your #automated-release-notification-to-express-dev-core channel!');
    console.log('');
    console.log('📋 What you should see:');
    console.log('   • Jira ticket numbers in titles (MWPW-179214:)');
    console.log('   • Clickable Jira links for business stakeholders');
    console.log('   • GitHub PR numbers as reference (#585)');
    console.log('   • Professional release format');
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
