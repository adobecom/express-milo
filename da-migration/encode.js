/* eslint-disable no-plusplus */
/* eslint-disable no-empty */
/* eslint-disable prefer-template */
/* eslint-disable no-continue */
/* eslint-disable comma-dangle */
/* eslint-disable prefer-destructuring */
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const TOKEN = '';
const PROJECT_URL = 'https://main--da-express-milo--adobecom.aem.live';
const DA_API = 'https://admin.da.live';

const urls = ['/products/adobe-analytics'];

const processedURLs = [];

async function getContent(url) {
  try {
    let path = url.replace(PROJECT_URL, '');
    if (path.endsWith('/')) path += 'index';
    const options = {
      headers: { Authorization: 'Bearer ' + TOKEN },
      timeout: 10000, // 10 second timeout
    };
    console.log(`Processing URL: ${url}`);
    const response = await fetch(
      `${DA_API}/source/adobecom/da-bacom/${path}.html`,
      options
    );
    if (!response.ok) {
      console.log(response.status);
      console.log('Failed to process URL:', url);
      return null;
    }
    const content = await response.text();
    return content;
  } catch {
    return null;
  }
}

async function processPictures(pictures) {
  let processed = 0;
  for (const picture of pictures) {
    try {
      const image = picture.querySelector('img');
      if (!image || !image.src) continue;
      const status = await fetch(image.src, { timeout: 5000 }); // 5 second timeout
      if (!status.ok) {
        console.log(`Image check failed: ${status.status}`);
        continue;
      }
      const contentType = status.headers.get('content-type');
      console.log(contentType);
      if (contentType.includes('image')) continue;
      processed++;
      console.log(`Image with wrong content type: ${image.src}`);
      for (const child of picture.children) {
        if (child.tagName === 'SOURCE') {
          child.srcset += '?optimize=medium';
        }
        if (child.tagName === 'IMG') {
          child.src += '?optimize=medium';
        }
      }
    } catch {}
  }

  return processed;
}

async function saveContent(url, content) {
  let path = url.replace(PROJECT_URL, '');
  if (path.endsWith('/')) path += 'index';
  const formData = new FormData();
  formData.append('data', new Blob([content], { type: 'text/html' }));
  const options = {
    headers: { Authorization: 'Bearer ' + TOKEN },
    method: 'PUT',
    body: formData,
    timeout: 10000, // 10 second timeout
  };
  const response = await fetch(
    `${DA_API}/source/adobecom/da-bacom/${path}.html`,
    options
  );
  if (!response.ok) {
    console.log('Failed to save content for:', url);
  }
}

async function processURLS() {
  for (const url of urls) {
    try {
      const content = await getContent(url);
      if (!content) continue;
      const dom = new JSDOM(content);
      const document = dom.window.document;
      const pictures = document.querySelectorAll('picture');
      const processed = await processPictures(pictures);
      if (processed) {
        console.log(`Saving updated content for ${url}`);
        await saveContent(url, document.querySelector('html').outerHTML);
        processedURLs.push(url);
      }
    } catch {}
  }
  console.log(processedURLs);
  process.exit(0);
}

processURLS().catch(console.log);
