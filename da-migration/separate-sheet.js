import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, 'crawl-tree.txt');
const noJsonOutputFile = path.join(__dirname, 'crawl-tree-no-json.txt');
const jsonOutputFile = path.join(__dirname, 'crawl-tree-json.txt');

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading crawl-tree.txt:', err);
    process.exit(1);
  }

  const lines = data.split(/\r?\n/).filter((line) => line.trim() !== '');

  const jsonLines = lines.filter((line) => line.trim().toLowerCase().endsWith('.json'));
  const noJsonLines = lines.filter((line) => !line.trim().toLowerCase().endsWith('.json'));

  fs.writeFile(noJsonOutputFile, noJsonLines.join('\n'), 'utf8', (writeErr) => {
    if (writeErr) {
      console.error('Error writing crawl-tree-no-json.txt:', writeErr);
      process.exit(1);
    }
    console.log(`Successfully wrote ${noJsonLines.length} non-JSON entries to crawl-tree-no-json.txt`);
  });

  fs.writeFile(jsonOutputFile, jsonLines.join('\n'), 'utf8', (writeErr) => {
    if (writeErr) {
      console.error('Error writing crawl-tree-json.txt:', writeErr);
      process.exit(1);
    }
    console.log(`Successfully wrote ${jsonLines.length} JSON entries to crawl-tree-json.txt`);
  });
});
