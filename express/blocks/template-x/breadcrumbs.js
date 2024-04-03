import { getLibs } from '../../scripts/utils.js';
import fetchAllTemplatesMetadata from '../../scripts/utils/all-templates-metadata.js';
import { titleCase } from '../../scripts/utils/string.js';

const imports = await
Promise.all([import(`${getLibs()}/features/placeholders.js`),
  await import(`${getLibs()}/utils/utils.js`)]);

const { replaceKeyArray } = imports[0];
const { createTag, getMetadata, getConfig } = imports[1];

function fetchPlaceholders() {
  const keys = [
    'x-task-categories', 'task-categories',
  ];
  return replaceKeyArray(keys, getConfig());
}

function sanitize(str) {
  return str?.replaceAll(/[$@%'"]/g, '');
}

function translateTask(taskCategories, tasks) {
  return Object.entries(taskCategories)
    .find(([, t]) => t === tasks || t === tasks.replace(/-/g, ' '))
    ?.[0]?.toLowerCase() ?? tasks;
}

function getCrumbsForSearch(templatesUrl, allTemplatesMetadata, placeholders) {
  const { search, origin } = window.location;
  const { tasksx, q } = new Proxy(
    new URLSearchParams(search),
    { get: (searchParams, prop) => searchParams.get(prop) },
  );
  const tasks = sanitize(tasksx);
  const crumbs = [];
  // won't have meaningful short-title with no tasks and no q
  if (!tasks && !sanitize(q)) {
    return crumbs;
  }
  const shortTitle = getMetadata('short-title');
  if (!shortTitle?.trim()) {
    return crumbs;
  }

  const lastCrumb = createTag('li');
  lastCrumb.textContent = shortTitle;
  crumbs.push(lastCrumb);
  if (!tasks) {
    return crumbs;
  }

  const taskUrl = `${templatesUrl}${tasks}`;
  const foundTaskPage = allTemplatesMetadata
    .some((t) => t.url === taskUrl.replace(origin, ''));

  if (foundTaskPage) {
    const taskCrumb = createTag('li');
    const taskAnchor = createTag('a', { href: taskUrl });
    taskCrumb.append(taskAnchor);
    const translatedTasks = translateTask(JSON.parse(placeholders['x-task-categories']), tasks);
    taskAnchor.textContent = titleCase(translatedTasks);
    crumbs.unshift(taskCrumb);
  }

  return crumbs;
}

function getCrumbsForSEOPage(templatesUrl, allTemplatesMetadata, placeholders, segments) {
  const { origin } = window.location;
  // we might have an inconsistent trailing slash problem
  let builtUrl = templatesUrl.replace('templates/', 'templates');
  const crumbs = [];
  segments
    .slice(0, segments.length - 1)
    .forEach((currSeg) => {
      const seg = sanitize(currSeg);
      if (!seg) return;
      builtUrl = `${builtUrl}/${seg}`;
      // at least translate tasks seg
      let translatedSeg = seg;
      if (seg === getMetadata('tasks-x')) {
        translatedSeg = translateTask(JSON.parse(placeholders['x-task-categories']), seg);
      } else if (seg === getMetadata('tasks')) {
        // try old v2 mapping
        translatedSeg = translateTask(JSON.parse(placeholders['task-categories']), seg);
      } else if (placeholders[seg]) {
        // try placeholder sheet
        translatedSeg = placeholders[seg];
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
  if (!shortTitle?.trim()) {
    return crumbs;
  }
  const lastCrumb = createTag('li');
  lastCrumb.textContent = shortTitle;
  crumbs.push(lastCrumb);
  return crumbs;
}

async function renderBreadcrumbs(children, breadcrumbs, placeholders, templatesUrl) {
  if (!children || children === '/') {
    return;
  }
  const allTemplatesMetadata = await fetchAllTemplatesMetadata();
  const isSearchPage = children.startsWith('/search?') || getMetadata('template-search-page') === 'Y';
  const crumbs = isSearchPage
    ? getCrumbsForSearch(templatesUrl, allTemplatesMetadata, placeholders)
    : getCrumbsForSEOPage(templatesUrl, allTemplatesMetadata, placeholders, children.split('/'));

  crumbs.forEach((c) => {
    breadcrumbs.append(c);
  });
}

// returns null if no breadcrumbs
// returns breadcrumbs as an li element
export default async function getBreadcrumbs() {
  if (!document.querySelector('.search-marquee')) {
    return null;
  }
  const { origin, pathname } = window.location;
  const regex = /(.*?\/express\/)templates(.*)/;
  const matches = pathname.match(regex);
  if (!matches) {
    return null;
  }
  const placeholders = await fetchPlaceholders();
  const [, homePath, children] = matches;
  const breadcrumbs = createTag('ol', { class: 'templates-breadcrumbs' });

  const homeCrumb = createTag('li');
  const homeUrl = `${origin}${homePath}`;
  const homeAnchor = createTag('a', { href: homeUrl });
  homeAnchor.textContent = titleCase(placeholders.express || '') || 'Home';
  homeCrumb.append(homeAnchor);
  breadcrumbs.append(homeCrumb);

  const templatesCrumb = createTag('li');
  const templatesUrl = `${homeUrl}templates/`;
  const templatesAnchor = createTag('a', { href: templatesUrl });
  templatesAnchor.textContent = titleCase(placeholders.templates || '') || 'Templates';
  templatesCrumb.append(templatesAnchor);
  breadcrumbs.append(templatesCrumb);

  const nav = createTag('nav', { 'aria-label': 'Breadcrumb' });
  nav.append(breadcrumbs);
  renderBreadcrumbs(children, breadcrumbs, placeholders, templatesUrl);
  return nav;
}
