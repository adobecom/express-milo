import { getLibs } from '../utils.js';
import { memoize } from './hofs.js';

const { getConfig, getMetadata } = await import(`${getLibs()}/utils/utils.js`);

const endpoints = {
  dev: {
    cdn: 'https://uss-templates-dev.adobe.io/uss/v3/query',
    url: 'https://uss-templates-dev.adobe.io/uss/v3/query',
    token: window.atob('Y2QxODIzZWQtMDEwNC00OTJmLWJhOTEtMjVmNDE5NWQ1ZjZj'),
    key: window.atob('ZXhwcmVzcy1ja2ctc3RhZ2U='),
  },
  stage: {
    cdn: 'https://www.stage.adobe.com/ax-uss-api/',
    url: 'https://uss-templates-stage.adobe.io/uss/v3/query',
    token: window.atob('ZGI3YTNkMTQtNWFhYS00YTNkLTk5YzMtNTJhMGYwZGJiNDU5'),
    key: window.atob('ZXhwcmVzcy1ja2ctc3RhZ2U='),
  },
  prod: {
    cdn: 'https://www.adobe.com/ax-uss-api/',
    url: 'https://uss-templates.adobe.io/uss/v3/query',
    token: window.atob('MmUwMTk5ZjQtYzRlMi00MDI1LTgyMjktZGY0Y2E1Mzk3NjA1'),
    key: window.atob('dGVtcGxhdGUtbGlzdC1saW5rbGlzdC1mYWNldA=='),
  },
};

const mFetch = memoize(
  (url, data) => fetch(url, data).then((r) => (r.ok ? r.json() : null)),
  { ttl: 1000 * 60 * 60 * 24 },
);

export async function getPillWordsMapping() {
  const locale = getConfig().locale.prefix.replace('/', '');
  const localeColumnString = locale === '' ? 'EN' : locale.toUpperCase();
  try {
    const resp = await fetch('/express/linklist-qa-mapping.json?limit=100000');
    const filteredArray = await resp.json();
    return filteredArray.data.filter(
      (column) => column[`${localeColumnString}`] !== '',
    );
  } catch {
    const resp = await fetch(
      '/express/linklist-qa-mapping-old.json?limit=100000',
    );
    if (resp.ok) {
      const filteredArray = await resp.json();
      return filteredArray.data.filter(
        (column) => column[`${localeColumnString}`] !== '',
      );
    }
    return false;
  }
}

export default async function getData(env = 'dev', data = {}) {
  const endpoint = endpoints[env];
  let targetURl = endpoint.url;

  if (
    ['www.adobe.com', 'www.stage.adobe.com'].includes(window.location.hostname)
  ) {
    targetURl = endpoint.cdn;
  }

  return mFetch(targetURl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.adobe.search-request+json',
      'x-api-key': endpoint.key,
      'x-app-token': endpoint.token,
    },
    body: JSON.stringify(data),
  });
}

export async function getDataWithContext({ urlPath }) {
  const data = {
    experienceId: 'templates-browse-v1',
    context: { application: { urlPath } },
    locale: getConfig().locale.ietf || 'en-US',
    queries: [
      {
        id: 'ccx-search-1',
        start: 0,
        limit: 40,
        scope: { entities: ['HzTemplate'] },
        facets: [{ facet: 'categories', limit: 10 }],
      },
    ],
  };

  const env = window.location.host === 'localhost:3000' ? { name: 'dev' } : getConfig().env;
  const result = await getData(env.name, data);
  if (result?.status?.httpCode !== 200) return null;

  return result;
}

export async function getDataWithId() {
  if (!getMetadata('ckgid')) return null;

  const dataRaw = {
    experienceId: 'templates-browse-v1',
    locale: 'en_US',
    queries: [
      {
        id: 'ccx-search-1',
        start: 0,
        limit: 40,
        scope: { entities: ['HzTemplate'] },
        filters: [
          { categories: [getMetadata('ckgid')] },
        ],
        facets: [
          {
            facet: 'categories',
            limit: 10,
          },
        ],
      },
    ],
  };

  const env = window.location.host === 'localhost:3000' ? { name: 'dev' } : getConfig().env;
  const result = await getData(env.name, dataRaw);
  if (result.status.httpCode !== 200) return null;

  return result;
}
