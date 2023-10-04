import fs, { link } from 'fs';
import path from 'path';

import  ExcelJS from 'exceljs';

const DATASET = 'blog-blocks2';
const OUTPUT_FILE = `${DATASET}.xlsx`;

const JSON_FOLDER = `storage-${DATASET}/datasets/${DATASET}`;

const XLSX_BLOG_BLOCKS_SHEET_NAME = DATASET;
const XLSX_BLOG_BLOCKS_SHEET_HEADERS = [ 'name', 'total usage', 'js exists', 'css exists', 'variances', 'url example' ];

const XLSX_BLOG_MP4_LINKS_SHEET_NAME = 'mp4 links';
const XLSX_BLOG_MP4_LINKS_SHEET_HEADERS = [ 'url', 'mp4 link', 'status' ];

(async() => {
  const jsonsInDir = fs.readdirSync(JSON_FOLDER).filter(file => path.extname(file) === '.json');
  
  const workbook = new ExcelJS.Workbook();
  const sheet1 = workbook.addWorksheet(XLSX_BLOG_BLOCKS_SHEET_NAME);
  sheet1.addRow(XLSX_BLOG_BLOCKS_SHEET_HEADERS);
  sheet1.autoFilter = `A1:${String.fromCharCode(97 + (XLSX_BLOG_BLOCKS_SHEET_HEADERS.length - 1))}1`;
  const sheet2 = workbook.addWorksheet(XLSX_BLOG_MP4_LINKS_SHEET_NAME);
  sheet2.addRow(XLSX_BLOG_MP4_LINKS_SHEET_HEADERS);
  sheet2.autoFilter = `A1:${String.fromCharCode(97 + (XLSX_BLOG_MP4_LINKS_SHEET_HEADERS.length - 1))}1`;

  const blocksData = { blocks: {} };

  const linksToCheck = { all: [], mp4: [] };

  for (let i = 0; i < jsonsInDir.length; i++) {
    const file = jsonsInDir[i];
    try {
      const fileData = fs.readFileSync(path.join(JSON_FOLDER, file));
      const json = JSON.parse(fileData.toString());
      
      /**
       * process blocks data
       */

      const blocks = json.blocks;

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const blockVariances = block.class.split(' ');
        console.log(json.url, blockVariances);
        const blockName = blockVariances.shift();
        console.log(blockName);

        if (!blocksData.blocks[blockName]) {
          blocksData.blocks[blockName] = {
            total: 1,
            variances: {},
            urlExample: json.url,
          };

          const e = await checkBlockExistence(json.url, blockName);
          console.log(e);
          blocksData.blocks[blockName].urlExists = e;
        } else {
          blocksData.blocks[blockName].total++;
        }

        blockVariances.forEach(variance => {
          if (!blocksData.blocks[blockName].variances[variance]) {
            blocksData.blocks[blockName].variances[variance] = 1;
          } else {
            blocksData.blocks[blockName].variances[variance]++;
          }
        });
      }

      /**
       * process links
       */
      if (json.links) {
        console.log('process links')
        for (let i = 0; i < json.links.length; i++) {
          const link = json.links[i];
          if (!linksToCheck.all.includes(link.href)) {
            linksToCheck.all.push(link.href);
          }

          // MP4 links to check
          if (link.href.includes('.mp4')) {
            try {
              linksToCheck.mp4.push({
                url: json.url,
                href: link.href,
              });

              const resp = await fetch(link.href, {
                method: 'HEAD',
              });
              sheet2.addRow([ json.url, link.href, resp.status ]);
            } catch(e) {
              console.log('error', e);
              sheet2.addRow([ json.url, link.href, e.message ]);
            }
          }
        }
      }
    } catch(e) {
      console.log('error', e);
    }
  }

  Object.keys(blocksData.blocks).forEach(blockName => {
    const bd = blocksData.blocks[blockName];
    sheet1.addRow([ blockName, bd.total, bd.urlExists.js, bd.urlExists.css, JSON.stringify(bd.variances), bd.urlExample ]);
  });

  sheet1.columns.forEach(function (column, i) {
    let maxLength = 0;
    column["eachCell"]({ includeEmpty: true }, function (cell) {
        var columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength ) {
            maxLength = columnLength;
        }
    });
    column.width = maxLength < 10 ? 10 : maxLength;
  });

  blocksData.total = Object.keys(blocksData.blocks).length;
  console.log(JSON.stringify(blocksData, null, 2));
  await workbook.xlsx.writeFile(OUTPUT_FILE);

  console.log('MP4 links to check', linksToCheck.mp4.length);
  console.log(JSON.stringify(linksToCheck.mp4, null, 2));
})();

async function checkBlockExistence(url, name) {
  const fileExts = ['js', 'css'];
  const u = new URL(url);
  const blockUrlPrefx = `${u.origin}/express/blocks/${name}/${name}`;

  const result = {
    js: false,
    css: false,
  };

  for (let i = 0; i < fileExts.length; i++) {
    const ext = fileExts[i];
    const blockUrl = `${blockUrlPrefx}.${ext}`;
    try {
      const resp = await fetch(blockUrl);
      if (resp.ok) {
        result[ext] = true;
      }
    } catch(e) {
      console.log(`Block ${name} does not exist for ${ext}`);
    }
  }
 
  return result;
}