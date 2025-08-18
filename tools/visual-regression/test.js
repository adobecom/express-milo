/* eslint-disable no-console */
import VisualRegression from './index.js';

async function test() {
  const vr = new VisualRegression();

  try {
    console.log('Testing visual regression tool...');

    // Test with a simple page that should exist
    const results = await vr.compare('main', 'stage', '/express/');

    console.log('Test completed successfully!');
    console.log('Results:', JSON.stringify(results, null, 2));

    // Generate report
    const reportPath = await vr.generateHTMLReport(results);
    console.log(`Report generated: ${reportPath}`);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();
