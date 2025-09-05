import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, 'import-urls.txt');
const jsonOutputFile = path.join(__dirname, 'import-urls-json.txt');
const noJsonOutputFile = path.join(__dirname, 'import-urls-no-json.txt');

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading import-urls.txt:', err);
    process.exit(1);
  }

  const lines = data.split(/\r?\n/).filter(line => line.trim() !== '');

  const jsonLines = lines.filter(line => line.trim().toLowerCase().endsWith('.json'));
  const noJsonLines = lines.filter(line => !line.trim().toLowerCase().endsWith('.json'));

  fs.writeFile(jsonOutputFile, jsonLines.join('\n'), 'utf8', (err) => {
    if (err) {
      console.error('Error writing import-urls-json.txt:', err);
    }
  });

  fs.writeFile(noJsonOutputFile, noJsonLines.join('\n'), 'utf8', (err) => {
    if (err) {
      console.error('Error writing import-urls-no-json.txt:', err);
    }
  });
});
