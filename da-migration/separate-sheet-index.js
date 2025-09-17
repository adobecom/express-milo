import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, 'import-urls-all.txt');
const noJsonOutputFile = path.join(__dirname, 'import-urls-no-json.txt');
const jsonOutputFile = path.join(__dirname, 'import-urls-json.txt');

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading import-urls-all.txt:', err);
    process.exit(1);
  }

  const lines = data.split(/\r?\n/).filter((line) => line.trim() !== '');

  const jsonLines = lines.filter((line) => line.trim().toLowerCase().endsWith('.json')).map((line) => `${line}?limit=99999`);
  const noJsonLines = lines.filter((line) => !line.trim().toLowerCase().endsWith('.json'));

  fs.writeFile(noJsonOutputFile, noJsonLines.join('\n'), 'utf8', (writeErr) => {
    if (writeErr) {
      console.error('Error writing import-urls-no-json.txt:', writeErr);
      process.exit(1);
    }
    console.log(`Successfully wrote ${noJsonLines.length} non-JSON entries to import-urls-no-json.txt`);
  });

  fs.writeFile(jsonOutputFile, jsonLines.join('\n'), 'utf8', (writeErr) => {
    if (writeErr) {
      console.error('Error writing import-urls-json.txt:', writeErr);
      process.exit(1);
    }
    console.log(`Successfully wrote ${jsonLines.length} JSON entries to import-urls-json`);
  });
});
