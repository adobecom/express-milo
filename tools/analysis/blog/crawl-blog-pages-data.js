import fs from 'fs';
import { Configuration, JSDOMCrawler, log, LogLevel, Dataset } from 'crawlee';

// crawlee dataset for collected blocks data
let dataset;
const DATASET_NAME = 'blog-blocks-data';

process.env.CRAWLEE_STORAGE_DIR = `./storage-${DATASET_NAME}`;

const RESULT_STATUS = {
  MISSING_CARDS: 'missing cards',
  PENDING: 'analysis pending',
  ERROR: 'error',
  DONE: 'done',
  LOCATION_MATCH_MSG: 'location match message',
}

log.setLevel(LogLevel.DEBUG);

const crawler = new JSDOMCrawler({
    minConcurrency: 1,
    maxConcurrency: 1,

    // On error, retry each page at most once.
    maxRequestRetries: 1,
    async requestHandler({ request, window, contentType, body }) {
      const url = request.url;
      let result = {
        url,
        contentType,
        body,
        status: RESULT_STATUS.PENDING,
      };

      log.debug(`Processing ${url} ...`);

      try {
        const u = new URL(url);
        const baseUrl = u.origin;

        const { document } = window;

        /**
         * Collect metadata
         */
        result.meta = [...document.querySelectorAll('meta')].map(el => {
          // extract attributes from el into object
          return Object.keys(el.attributes).reduce((acc, key) => {
            const attr = el.attributes[key];
            acc[attr.name] = attr.value;
            return acc;
          }, {});
        });

        /**
         * Collect blocks data
         */
        const classes = [];
        const stats = {};

        result.blocks = [...document.querySelectorAll('[class]')].map(el => {
          classes.push(el.classList.value);

          if (!stats.hasOwnProperty(el.classList.value)) {
            stats[el.classList.value] = 1;
          } else {
            stats[el.classList.value]++;
          }

          // return array of all classes for each element
          const c = {
            class: el.classList.value,
            innerHTML: el.innerHTML,
          };

          if (c.class === 'table-of-contents') {
            // extract second div of inner div
            c.levels = el.querySelector(':scope > div > div:nth-child(2)').textContent || -1;
          }

          return c;
        });

        result.classes = classes.join(' ');
        result.stats = stats;

        /**
         * collect all links
         */
        const domainExclusions = [ 'adobesparkpost.app.link' ];
        const links = [...document.querySelectorAll('[href]')].map(async (el) => {
          const u = new URL(el.href, baseUrl);
          // if (u.origin !== baseUrl || domainExclusions.some(exclusion => u.host === exclusion)) {
          //   return {
          //     href: el.href,
          //     status: 'excluded',
          //   };
          // }

          return {
            href: el.href,
            status: 'pending',
          }

          // try {
          //   const resp = await fetch(u.href, {
          //     redirect: 'follow',
          //     follow: 10,
          //   });
          //   console.log(resp.status, u.href);
          //   return {
          //     href: el.href,
          //     status: resp.status,
          //   };
          // } catch (err) {
          //   console.log(err);
          //   return {
          //     href: el.href,
          //     status: err.message,
          //     error: `${err} - ${err.cause}`,
          //   };
          // }
        });

        result.links = await Promise.all(links);

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

  // await blocksDataset.exportToCSV('blocks-data');
  // process.exit(0);

  // Load URLs file passed in the command line arguments
  var urlsRaw = fs.readFileSync(process.argv[2], 'utf8').toString().split('\n').filter(line => line.trim() !== "");
  var urls = urlsRaw; //.slice(3, 10); //.slice(0, urlsRaw.length - 1);
  await crawler.addRequests(urls);
  console.log(`Extracting data for ${urls.length} urls`);

  // Run the crawler and wait for it to finish.
  await crawler.run();

  console.log('Crawler finished.');
  console.log('stats', crawler.stats);

  // clearInterval(csvSaveRoutine);
})();
