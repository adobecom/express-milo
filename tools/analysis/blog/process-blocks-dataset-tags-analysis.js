import fs from 'fs';
import path from 'path';
import  ExcelJS from 'exceljs';
import { flatten } from 'flat'
import { execSync } from 'child_process';

const DATASET = 'blog-blocks2';
const OUTPUT_FILE = 'blog-tags-data.xlsx';
const XLSX_BLOG_REQS_SHEET_NAME = DATASET;
const XLSX_BLOG_REQS_SHEET_HEADERS = [ 'tag', 'sanitized tag', 'total usage', 'lang (automated)', 'lang (manually fixed)', 'possible caas tags' ];
const XLSX_BLOG_REQS_SHEET_02_NAME = 'tags per urls';
const XLSX_BLOG_REQS_SHEET_02_HEADERS = [ 'url', 'tag' ];
const JSON_FOLDER = `storage-${DATASET}/datasets/${DATASET}`;
const ALL_TAGS_URL = 'https://www.adobe.com/chimera-api/tags';

async function getCaasTags() {
  const resp = await fetch(ALL_TAGS_URL)
  const tagsRaw = await resp.json();
  const flatTags = flatten(tagsRaw);

  const tags = Object.keys(flatTags).map(key => {
    const tag = flatTags[key]
    if (key.endsWith('.tagID') && tag.includes('/')) {
      const valueTmp = tag.split(':')[1];
      const sepIdx = valueTmp.lastIndexOf('/');
      const category = valueTmp.substring(0, sepIdx);
      const value = valueTmp.substring(sepIdx + 1);
      return {
        raw: tag,
        value,
        category,
      }
    }
    return null;
  }).filter(tag => tag !== null);

  return tags;
}

function findPossibleCaasTags(tags, tag) {
  const possibleTags = tags.filter(t => t.value.includes(tag));
  return possibleTags;
}

(async() => {
  const jsonsInDir = fs.readdirSync(JSON_FOLDER).filter(file => path.extname(file) === '.json');

  const tagsData = { tags: {}, total: 0 };
  
  const workbook = new ExcelJS.Workbook();
  const sheet1 = workbook.addWorksheet(XLSX_BLOG_REQS_SHEET_NAME);
  sheet1.addRow(XLSX_BLOG_REQS_SHEET_HEADERS);
  sheet1.autoFilter = `A1:${String.fromCharCode(97 + (XLSX_BLOG_REQS_SHEET_HEADERS.length - 1))}1`;
  const sheet2 = workbook.addWorksheet(XLSX_BLOG_REQS_SHEET_02_NAME);
  sheet2.addRow(XLSX_BLOG_REQS_SHEET_02_HEADERS);
  sheet2.autoFilter = `A1:${String.fromCharCode(97 + (XLSX_BLOG_REQS_SHEET_02_HEADERS.length - 1))}1`;

  // get caas tags
  const caasTags = await getCaasTags();

  for (let i = 0; i < jsonsInDir.length; i++) {
    const file = jsonsInDir[i];
    try {
      const fileData = fs.readFileSync(path.join(JSON_FOLDER, file));
      const json = JSON.parse(fileData.toString());

      json.meta.forEach(async m => {
        if (m.name?.includes('tag') || m.property?.includes('tag')) {
          sheet2.addRow([ json.url, m.content ]);

          // console.log(m);
          if (!tagsData.tags[m.content]) {
            const sanitizedTag = m.content.replace(/[^a-zA-Z0-9]/g, '-')/*.replaceAll('--', '-')*//*.replaceAll(/\s+/g, '-')*/.toLowerCase();
            
            try {
              const possibleTags = findPossibleCaasTags(caasTags, sanitizedTag);

              let lang = 'n/a';

              if (!sanitizedTag.includes('--')) {
                try {
                  const stdout = execSync(`lidtk cld2 predict --text '${sanitizedTag}'`);
                  lang = stdout.toString().split('\n').slice(-2)[0];
                } catch (e) {
                  // nothing
                }

                if (lang !== 'n/a' && possibleTags.length > 0) {
                  lang = 'eng';
                }
              }

              console.log(`sanitizedTag: ${lang}, ${sanitizedTag} ${possibleTags.length} ${m.content}`);

              tagsData.tags[m.content] = {
                total: 1,
                lang: lang || 'n/a',
                urls: [json.url],
                sanitizedTag,
                possibleCaasTags: possibleTags.map(t => t.raw).join(','),
              };
              tagsData.total++;
            } catch (e) {
              console.error(e);
            }
          } else {
            tagsData.tags[m.content].total++;
            tagsData.tags[m.content].urls.push(json.url);
          }
        }
      });
    } catch(e) {
      console.log('error', e);
    }
  }

  console.log(tagsData);
  // add tags data to sheet3
  Object.keys(tagsData.tags).forEach(tag => {
    const td = tagsData.tags[tag];
    sheet1.addRow([ tag, td.sanitizedTag, td.total, td.lang, '', td.possibleCaasTags ]);
  });

  // write excel report
  await workbook.xlsx.writeFile(OUTPUT_FILE);
})();
