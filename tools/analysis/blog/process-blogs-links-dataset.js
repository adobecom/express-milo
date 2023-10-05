import fs, { link } from 'fs';
import path from 'path';

import  ExcelJS from 'exceljs';

const DATASET = 'blog-links-data';
const OUTPUT_FILE = `${DATASET}.xlsx`;

const JSON_FOLDER = `storage-${DATASET}/datasets/${DATASET}`;

const XLSX_BLOG_REQS_SHEET_NAME = DATASET;
const XLSX_BLOG_REQS_SHEET_HEADERS = [ 'url', 'request', 'origin', 'status', 'redirected', 'redirect chain' ];

// const XLSX_BLOG_MP4_LINKS_SHEET_NAME = 'mp4 links';
// const XLSX_BLOG_MP4_LINKS_SHEET_HEADERS = [ 'url', 'mp4 link', 'status' ];

(async() => {
  const jsonsInDir = fs.readdirSync(JSON_FOLDER).filter(file => path.extname(file) === '.json');
  
  const workbook = new ExcelJS.Workbook();
  const sheet1 = workbook.addWorksheet(XLSX_BLOG_REQS_SHEET_NAME);
  sheet1.addRow(XLSX_BLOG_REQS_SHEET_HEADERS);
  sheet1.autoFilter = `A1:${String.fromCharCode(97 + (XLSX_BLOG_REQS_SHEET_HEADERS.length - 1))}1`;
  // const sheet2 = workbook.addWorksheet(XLSX_BLOG_MP4_LINKS_SHEET_NAME);
  // sheet2.addRow(XLSX_BLOG_MP4_LINKS_SHEET_HEADERS);
  // sheet2.autoFilter = `A1:${String.fromCharCode(97 + (XLSX_BLOG_MP4_LINKS_SHEET_HEADERS.length - 1))}1`;

  const reqsData = [];

  for (let i = 0; i < jsonsInDir.length; i++) {
    const file = jsonsInDir[i];
    try {
      const fileData = fs.readFileSync(path.join(JSON_FOLDER, file));
      const json = JSON.parse(fileData.toString());
      
      /**
       * process blocks data
       */

      const requests = json.requests.items;

      const originalUrl = new URL(json.url);
      const originalUrlHostname = originalUrl.hostname;
      for (const [key, value] of Object.entries(requests)) {
        const request = value;
        const reqUrl = new URL(request.url);
        const reqUrlHostname = reqUrl.hostname;

        reqsData.push({
          url: json.url,
          request: request.url,
          origin: (reqUrlHostname === originalUrlHostname) ? 'same' : 'different',
          status: request.status,
          redirected: request.redirectChain?.length > 0,
          redirectChain: request.redirectChain.join(' -> '),
        });
      }

    } catch(e) {
      console.log('error', e);
    }
  }

  reqsData.forEach(req => {
    sheet1.addRow([ req.url, req.request, req.origin, req.status, req.redirected, req.redirectChain ]);
  });

  console.log(reqsData.length);

  // // autoSize columns
  // sheet1.columns.forEach(function (column, i) {
  //   let maxLength = 0;
  //   column["eachCell"]({ includeEmpty: true }, function (cell) {
  //       var columnLength = cell.value ? cell.value.toString().length : 10;
  //       if (columnLength > maxLength ) {
  //           maxLength = columnLength;
  //       }
  //   });
  //   column.width = maxLength < 10 ? 10 : maxLength;
  // });

  // reqsData.total = reqsData.length;
  // console.log(JSON.stringify(reqsData, null, 2));
  await workbook.xlsx.writeFile(OUTPUT_FILE);
})();
