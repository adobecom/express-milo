#!/usr/bin/env node

/**
 * Test Enhanced Ticket Extraction
 * 
 * This shows how the workflow will now extract ticket numbers
 * from PR titles AND bodies.
 */

console.log('🧪 Enhanced Ticket Extraction Preview');
console.log('=' .repeat(50));
console.log('');

// Simulate PRs with different ticket number locations
const prs = [
  {
    title: 'MWPW-179214: Carousel TaaS individual template ids',
    body: 'This PR implements the carousel functionality...',
    hasTicketInTitle: true,
    ticketNumber: 'MWPW-179214',
    cleanTitle: 'Carousel TaaS individual template ids'
  },
  {
    title: 'Fix link contrasts and minor fix on v2 outline cutting off',
    body: 'Fixes: MWPW-175257\n\nThis PR addresses the contrast issues...',
    hasTicketInTitle: false,
    ticketNumber: 'MWPW-175257',
    cleanTitle: 'Fix link contrasts and minor fix on v2 outline cutting off'
  },
  {
    title: 'Discover - TOC Links Should Highlight When TOC Just Above Header on Mobile / Tablet',
    body: 'Related to: MWPW-172990\n\nThis PR fixes the TOC highlighting...',
    hasTicketInTitle: false,
    ticketNumber: 'MWPW-172990',
    cleanTitle: 'Discover - TOC Links Should Highlight When TOC Just Above Header on Mobile / Tablet'
  },
  {
    title: 'Content Toggle V2 Indexing',
    body: 'This PR adds indexing functionality for content toggles...',
    hasTicketInTitle: false,
    ticketNumber: null,
    cleanTitle: 'Content Toggle V2 Indexing'
  }
];

console.log('📱 Enhanced Release Notification:');
console.log('');
console.log('🚀 *Express Milo Release Deployed*');
console.log('');
console.log('Repository: adobecom/express-milo');
console.log('Branch: main');
console.log('Commit: abc123 (clickable link to commit)');
console.log('');
console.log('## Changes in this Release');

// Show the enhanced format
prs.forEach((pr, index) => {
  const prNumber = 585 + index;
  
  if (pr.ticketNumber) {
    const displayTitle = `${pr.ticketNumber}: ${pr.cleanTitle}`;
    console.log(`- <https://jira.corp.adobe.com/browse/${pr.ticketNumber}|${displayTitle}> (#${prNumber})`);
  } else {
    console.log(`- <https://github.com/adobecom/express-milo/pull/${prNumber}|${pr.cleanTitle}> (#${prNumber})`);
  }
});

console.log('');
console.log('Express Milo');
console.log('');
console.log('🔍 Ticket Detection Logic:');
console.log('   1. Check PR title for MWPW-XXXXXX pattern');
console.log('   2. If not found, check PR body for MWPW-XXXXXX');
console.log('   3. If still not found, check for other ticket patterns (ABC-123)');
console.log('   4. Clean title by removing ticket prefix');
console.log('   5. Link to Jira if ticket found, GitHub PR if not');
console.log('');
console.log('✅ Now extracts tickets from PR bodies too!');
