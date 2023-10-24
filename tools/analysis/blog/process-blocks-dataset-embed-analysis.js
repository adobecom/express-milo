import fs from 'fs';
import path from 'path';

import  ExcelJS from 'exceljs';


const DATASET = 'blog-blocks2';
const OUTPUT_FILE = `${DATASET}-embed-analysis.xlsx`;

const XLSX_BLOG_REQS_SHEET_NAME = DATASET;
const XLSX_BLOG_REQS_SHEET_HEADERS = [ 'url', 'embed domain', 'embed innerHTML', 'link text different than link url' ];

const JSON_FOLDER = `storage-${DATASET}/datasets/${DATASET}`;

(async() => {
  const jsonsInDir = fs.readdirSync(JSON_FOLDER).filter(file => path.extname(file) === '.json');
  
  const workbook = new ExcelJS.Workbook();
  const sheet1 = workbook.addWorksheet(XLSX_BLOG_REQS_SHEET_NAME);
  sheet1.addRow(XLSX_BLOG_REQS_SHEET_HEADERS);
  sheet1.autoFilter = `A1:${String.fromCharCode(97 + (XLSX_BLOG_REQS_SHEET_HEADERS.length - 1))}1`;

  const tagsData = [];

  for (let i = 0; i < jsonsInDir.length; i++) {
    const file = jsonsInDir[i];
    try {
      const fileData = fs.readFileSync(path.join(JSON_FOLDER, file));
      const json = JSON.parse(fileData.toString());

      const embeds = json.blocks.filter(b => b.class === 'embed');
      if (embeds.length > 0) {
        console.log(json.url);
        embeds.forEach(e => {

          const regex = /<a href="(.+?)">(.+)<\/a>/;
          
          let embedDomain = 'N/A';
          let differentTextThankLink = false;

          const m = regex.exec(e.innerHTML)
          if (m !== null) {
              if (m[1] !== m[2]) {
                differentTextThankLink = true;
              }

              const u = new URL(m[1], 'https://www.adobe.com/express');
              embedDomain = u.host;
            }

          tagsData.push({
            url: json.url,
            embedDomain,
            innerHTML: e.innerHTML.replaceAll('\n', '').replaceAll(/\s+/g, ' ').trim(),
            differentTextThankLink,
          });
        });
      }
    } catch(e) {
      console.log('error', e);
    }
  }

  tagsData.forEach(tag => {
    sheet1.addRow([ tag.url, tag.embedDomain, tag.innerHTML, tag.differentTextThankLink ]);
  });

  await workbook.xlsx.writeFile(OUTPUT_FILE);

  console.log(tagsData);
})();
