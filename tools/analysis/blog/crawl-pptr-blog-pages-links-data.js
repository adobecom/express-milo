import fs from 'fs';
import { Configuration, PuppeteerCrawler, log, LogLevel, Dataset } from 'crawlee';

// crawlee dataset for collected blocks data
let dataset;
const DATASET_NAME = 'blog-links-data';

process.env.CRAWLEE_STORAGE_DIR = `./storage-${DATASET_NAME}`;

const RESULT_STATUS = {
  PENDING: 'analysis pending',
  ERROR: 'error',
  DONE: 'done',
}

log.setLevel(LogLevel.DEBUG);

const interceptedRequests = {};

const crawler = new PuppeteerCrawler({

    minConcurrency: 2,
    maxConcurrency: 4,

    browserPoolOptions: {
      maxOpenPagesPerBrowser: 1,
    },

    // On error, retry each page at most once.
    maxRequestRetries: 1,

    preNavigationHooks: [
      async (crawlingContext, gotoOptions) => {
        const { id, page } = crawlingContext;

        gotoOptions.waitUntil = 'networkidle0';

        interceptedRequests[id] = {};

        await page.setRequestInterception(true);

        page.on('request', interceptedRequest => {
          // console.log(interceptedRequest._requestId);
          // console.log(id, 'new request', interceptedRequest.url());
          interceptedRequests[id][interceptedRequest._requestId] = { 
            url: interceptedRequest.url(),
            initiator: interceptedRequest.initiator(),
            status: 'pending',
            redirectChain: interceptedRequest.redirectChain().map(r => r.url()),
          };
          interceptedRequest.continue();
        });
        page.on('requestfinished', request => {
          // console.log(id, 'request done', interceptedRequest.url(), interceptedRequest.response().status());
          console.log('request', request._requestId, request.resourceType(), request.url(), request.response().status(), request.failure(), request.redirectChain().length);
          interceptedRequests[id][request._requestId] = {
            ...interceptedRequests[id][request._requestId],
            status: request.response()?.status(),
          };
        });
        page.on('requestfailed', request => {
          // console.log(id, 'request done', interceptedRequest.url(), interceptedRequest.response().status());
          console.log('request', request.resourceType(), request.url(), request.response()?.status(), request.failure(), request.redirectChain().length);
          interceptedRequests[id][request._requestId] = {
            ...interceptedRequests[id][request._requestId],
            status: request.response()?.status(),
            // redirectChain: request.redirectChain(),
            failure: request.failure(),
          };
        });
      },
    ],

    async requestHandler({ id, page, request, closeCookieModals, infiniteScroll }) {
      const url = request.url;
      let result = {
        url,
        status: RESULT_STATUS.PENDING,
      };

      log.debug(`Processing ${url} ...`);
      
      try {
        log.debug(`Start closing cookie modal ...`);
        await closeCookieModals();
        log.debug(`Closing cookie modal done.`);
  
        log.debug(`Start scrolling ...`);
        await infiniteScroll();
        log.debug(`Scrolling done.`);

        await page.waitForNetworkIdle({ idleTime: 500 })

        const u = new URL(url);
        // const baseUrl = u.origin;

        const els = await page.$$('body [href]');
        let links = (await Promise.all(els.map(async el => {
          const href = await el.evaluate(el => el.getAttribute('href')) || 'na';
          if (href.startsWith('#')) {
            return null;
          }
          try {
            const absHref = new URL(href, u.origin);
            return {
              origin: (u.origin === absHref.origin) ? 'same' : 'external',
              originalHref: href,
              absHref: absHref.href,
            };
          } catch (e) {
            return null;
          }
        }))).filter(l => l !== null);

        result.links = {
          total: links.length,
          items: links,
        };

        console.log(id, Object.keys(interceptedRequests[id]).length);
        console.log(interceptedRequests[id]);
        result.requests = {
          total: Object.keys(interceptedRequests[id]).length,
          items: interceptedRequests[id],
        };
        result.status = RESULT_STATUS.DONE;
      } catch (err) {
        log.error(`Error while processing ${url}: ${err.message || err}`);
        result.error = err.message || err;
        result.status = RESULT_STATUS.ERROR;
      } finally {
        log.debug(`result ## ${result.url} ##  ${result.status} ## ${result.locationMatchMsg || ''} ## ${JSON.stringify(result.contentType, '', 0)} ## ${result.error || ''}`);
        dataset.pushData(result);
      }
    },

    // This function is called if the page processing failed more than maxRequestRetries + 1 times.
    failedRequestHandler({ request }) {
        log.debug(`Request ${request.url} failed twice.`);
    },
});



//
// main
//

// set crawlee global configuration
const config = Configuration.getGlobalConfig();
config.set('persistStorage', true);
config.set('purgeOnStart', true);
config.set('availableMemoryRatio', 0.8);
config.set('maxUsedCpuRatio', 0.9);
config.set('defaultDatasetId', DATASET_NAME);
config.set('defaultKeyValueStoreId', DATASET_NAME);
config.set('defaultRequestQueueId', DATASET_NAME);

console.log('Starting the crawler with config', config);

(async () => {
  // Open a named dataset
  dataset = await Dataset.open(DATASET_NAME);

  // Load URLs file passed in the command line arguments
  var urlsRaw = fs.readFileSync(process.argv[2], 'utf8').toString().split('\n').filter(line => line.trim() !== "");
  var urls = urlsRaw; //[ 'https://www.adobe.com/de/express/learn/blog/successful-instagram-post' ]; //.slice(3, 10); //.slice(0, urlsRaw.length - 1);
  await crawler.addRequests(urls);
  console.log(`Extracting data for ${urls.length} urls`);

  // Run the crawler and wait for it to finish.
  await crawler.run();

  console.log('Crawler finished.');
  console.log('stats', crawler.stats);
})();
