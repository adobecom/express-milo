#!/usr/bin/env node

/**
 * Test Jira-Focused Slack Format
 * 
 * This shows how the Slack notification will look with Jira links
 * for business stakeholders.
 */

console.log('🧪 Jira-Focused Slack Release Notification Preview');
console.log('=' .repeat(60));
console.log('');

// Simulate the PR list with Jira links
const prs = [
  { 
    title: 'MWPW-179214: Carousel TaaS individual template ids', 
    number: 585,
    hasJira: true,
    jiraTicket: 'MWPW-179214',
    cleanTitle: 'Carousel TaaS individual template ids'
  },
  { 
    title: 'MWPW-175257: fix link contrasts and minor fix on v2 outline cutting off', 
    number: 598,
    hasJira: true,
    jiraTicket: 'MWPW-175257',
    cleanTitle: 'fix link contrasts and minor fix on v2 outline cutting off'
  },
  { 
    title: 'Discover - TOC Links Should Highlight When TOC Just Above Header on Mobile / Tablet', 
    number: 573,
    hasJira: false
  },
  { 
    title: 'Content Toggle V2 Indexing', 
    number: 588,
    hasJira: false
  }
];

console.log('📱 How it will appear in Slack for Business:');
console.log('');
console.log('🚀 *Express Milo Release Deployed*');
console.log('');
console.log('Repository: adobecom/express-milo');
console.log('Branch: main');
console.log('Commit: abc123 (clickable link to commit)');
console.log('');
console.log('## Changes in this Release');

// Show the actual Slack markdown format
prs.forEach(pr => {
  if (pr.hasJira) {
    console.log(`- <https://jira.corp.adobe.com/browse/${pr.jiraTicket}|${pr.cleanTitle}> (#${pr.number})`);
  } else {
    console.log(`- <https://github.com/adobecom/express-milo/pull/${pr.number}|${pr.title}> (#${pr.number})`);
  }
});

console.log('');
console.log('Express Milo');
console.log('');
console.log('🔗 Business Benefits:');
console.log('   • Jira tickets are clickable (MWPW-XXXXXX)');
console.log('   • GitHub PR numbers shown as reference (#XXX)');
console.log('   • Clean titles without Jira prefixes');
console.log('   • Business stakeholders can click directly to Jira');
console.log('   • Developers can still reference GitHub PRs');
