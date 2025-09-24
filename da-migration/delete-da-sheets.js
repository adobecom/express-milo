/* eslint-disable no-underscore-dangle */
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, 'crawl-tree-json.txt');

const token = '';

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading crawl-tree.txt:', err);
    process.exit(1);
  }

  const lines = data.split(/\r?\n/).filter((line) => line.trim() !== '');
  const jsonLines = lines.filter((line) => line.trim().toLowerCase().endsWith('.json'));
  const paths = jsonLines.map((line) => /\.aem\.page\/(.+)/.exec(line)[1]);
  const urls = paths.map((p) => `https://admin.da.live/source/adobecom/da-express-milo/${p}`);
  console.log(`Found ${urls.length} URLs to delete`);

  let completedRequests = 0;
  const successfulDeletes = [];
  const failedDeletes = [];

  urls.forEach((url, index) => {
    const urlObject = new URL(url);
    const options = {
      hostname: urlObject.hostname,
      port: 443,
      path: urlObject.pathname,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const req = https.request(options, (res) => {
      // Consume the response body to prevent hanging
      res.on('data', () => {
        // Drain the data - we don't need to do anything with it
      });
      res.on('end', () => {
        completedRequests += 1;

        if (res.statusCode >= 200 && res.statusCode < 300) {
          successfulDeletes.push(url);
          console.log(`✓ [${index + 1}/${urls.length}] Successfully deleted: ${url} (Status: ${res.statusCode})`);
        } else {
          failedDeletes.push({ url, reason: `HTTP ${res.statusCode}` });
          console.log(`✗ [${index + 1}/${urls.length}] Failed to delete: ${url} (Status: ${res.statusCode})`);
        }

        if (completedRequests === urls.length) {
          console.log(`\nCompleted: ${successfulDeletes.length} successful, ${failedDeletes.length} failed out of ${urls.length} total`);
          if (failedDeletes.length > 0) {
            console.log('\nFailed URLs:');
            failedDeletes.forEach(({ url: failedUrl, reason }) => {
              console.log(`  - ${failedUrl} (${reason})`);
            });
          }
        }
      });
    });

    req.on('error', (error) => {
      completedRequests += 1;
      failedDeletes.push({ url, reason: `Network Error: ${error.message}` });
      console.log(`✗ [${index + 1}/${urls.length}] Error deleting ${url}: ${error.message}`);

      if (completedRequests === urls.length) {
        console.log(`\nCompleted: ${successfulDeletes.length} successful, ${failedDeletes.length} failed out of ${urls.length} total`);
        if (failedDeletes.length > 0) {
          console.log('\nFailed URLs:');
          failedDeletes.forEach(({ url: failedUrl, reason }) => {
            console.log(`  - ${failedUrl} (${reason})`);
          });
        }
      }
    });

    req.end();
  });
});
