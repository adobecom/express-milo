import { getLibs } from '../../scripts/utils.js';

import { titleCase } from '../../scripts/utils/string.js';
import fetchAllTemplatesMetadata from '../../scripts/utils/all-templates-metadata.js';

let createTag; let getMetadata;
let getConfig;
function sanitize(str) {
  return str?.replaceAll(/[$@%'"]/g, '');
}

function translateTask(taskCategories, tasks) {
  return Object.entries(taskCategories)
    // eslint-disable-next-line no-unused-vars
    .find(([_, t]) => t === tasks || t === tasks.replace(/-/g, ' '))
    ?.[0]?.toLowerCase() ?? tasks;
}

async function getCrumbsForSearch(templatesUrl, allTemplatesMetadata, placeholderMod) {
  const { search, origin } = window.location;
  let { tasks, topics } = new Proxy(
    new URLSearchParams(search),
    { get: (searchParams, prop) => searchParams.get(prop) },
  );
  tasks = sanitize(tasks);
  topics = sanitize(topics);
  const crumbs = [];
  if (!tasks && !topics) {
    return crumbs;
  }
  const shortTitle = getMetadata('short-title');
  if (!shortTitle) {
    return crumbs;
  }

  const lastCrumb = createTag('li');
  lastCrumb.textContent = shortTitle;
  crumbs.push(lastCrumb);
  if (!tasks || !topics) {
    return crumbs;
  }

  const taskUrl = `${templatesUrl}${tasks}`;
  const foundTaskPage = allTemplatesMetadata
    .some((t) => t.url === taskUrl.replace(origin, ''));

  if (foundTaskPage) {
    const taskCrumb = createTag('li');
    const taskAnchor = createTag('a', { href: taskUrl });
    taskCrumb.append(taskAnchor);
    const translatedTasks = translateTask(JSON.parse(await placeholderMod.replaceKey('task-categories', getConfig())), tasks);
    taskAnchor.textContent = titleCase(translatedTasks);
    crumbs.unshift(taskCrumb);
  }

  return crumbs;
}

async function getCrumbsForSEOPage(templatesUrl, allTemplatesMetadata, placeholderMod, segments) {
  const { origin, pathname } = window.location;
  const tasks = getMetadata('tasks')
  // TODO: remove templateTasks and allTemplatesMetadata here after all content are updated
    ?? getMetadata('templateTasks')
    ?? allTemplatesMetadata[pathname]?.tasks
    ?? allTemplatesMetadata[pathname]?.templateTasks;
  // we might have an inconsistent trailing slash problem
  let builtUrl = templatesUrl.replace('templates/', 'templates');
  const crumbs = [];
  segments
    .slice(0, segments.length - 1)
    .forEach(async (currSeg) => {
      const seg = sanitize(currSeg);
      if (!seg) return;
      builtUrl = `${builtUrl}/${seg}`;
      // at least translate tasks seg
      let translatedSeg = seg;
      if (seg === tasks) {
        translatedSeg = translateTask(JSON.parse(await placeholderMod.replaceKey('task-categories', getConfig())), seg);
      } else if (seg === getMetadata('tasks-x')) {
        // try new v3x mapping
        translatedSeg = translateTask(JSON.parse(await placeholderMod.replaceKey('x-task-categories', getConfig())), seg);
      } else if (await placeholderMod.replaceKey('seg', getConfig())) {
        // try placeholder sheet
        translatedSeg = await placeholderMod.replaceKey('seg', getConfig());
      }
      const segmentCrumb = createTag('li');
      if (allTemplatesMetadata.some((t) => t.url === builtUrl.replace(origin, ''))) {
        const segmentLink = createTag('a', { href: builtUrl });
        segmentLink.textContent = titleCase(translatedSeg);
        segmentCrumb.append(segmentLink);
      } else {
        segmentCrumb.textContent = titleCase(translatedSeg);
      }
      crumbs.push(segmentCrumb);
    });
  const shortTitle = getMetadata('short-title');
  if (!shortTitle) {
    return crumbs;
  }
  const lastCrumb = createTag('li');
  lastCrumb.textContent = shortTitle;
  crumbs.push(lastCrumb);
  return crumbs;
}

// returns null if no breadcrumbs
// returns breadcrumbs as an li element
export default async function getBreadcrumbs(createTagParam, getMetadataParam, getConfigParam) {
  createTag = createTagParam;
  getMetadata = getMetadataParam;
  getConfig = getConfigParam;
  // for backward compatibility
  // TODO: remove this check after all content are updated
  if (getMetadata('sheet-powered') !== 'Y' && !document.querySelector('.search-marquee')) {
    return null;
  }
  const { origin, pathname } = window.location;
  const regex = /(.*?\/express\/)templates(.*)/;
  const matches = pathname.match(regex);
  if (!matches) {
    return null;
  }
  const placeholderMod = await import(`${getLibs()}/features/placeholders.js`);
  const [, homePath, children] = matches;
  const breadcrumbs = createTag('ol', { class: 'templates-breadcrumbs' });

  const homeCrumb = createTag('li');
  const homeUrl = `${origin}${homePath}`;
  const homeAnchor = createTag('a', { href: homeUrl });
  homeAnchor.textContent = titleCase(await placeholderMod.replaceKey('express', getConfig()) || '') || 'Home';
  homeCrumb.append(homeAnchor);
  breadcrumbs.append(homeCrumb);

  const templatesCrumb = createTag('li');
  const templatesUrl = `${homeUrl}templates/`;
  const templatesAnchor = createTag('a', { href: templatesUrl });
  templatesAnchor.textContent = titleCase(await placeholderMod.replaceKey('templates', getConfig()) || '') || 'Templates';
  templatesCrumb.append(templatesAnchor);
  breadcrumbs.append(templatesCrumb);

  const nav = createTag('nav', { 'aria-label': 'Breadcrumb' });
  nav.append(breadcrumbs);

  if (!children || children === '/') {
    return nav;
  }
  const allTemplatesMetadata = await fetchAllTemplatesMetadata(getConfig);
  const isSearchPage = children.startsWith('/search?') || getMetadata('template-search-page') === 'Y';
  const crumbs = isSearchPage
    ? await getCrumbsForSearch(templatesUrl, allTemplatesMetadata, placeholderMod)
    : await getCrumbsForSEOPage(templatesUrl, allTemplatesMetadata, placeholderMod, children.split('/'));

  crumbs.forEach((c) => {
    breadcrumbs.append(c);
  });
  return nav;
}
