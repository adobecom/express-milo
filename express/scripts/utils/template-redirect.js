import { getLibs } from '../utils.js';
import fetchAllTemplatesMetadata from './all-templates-metadata.js';

const imports = await Promise.all([import(`${getLibs()}/utils/utils.js`)]);
const { getConfig } = imports[0];

async function existsTemplatePage(url) {
  const allTemplatesMetadata = await fetchAllTemplatesMetadata();
  return allTemplatesMetadata.some((e) => e.url === url);
}
const sanitizeExp = /['"<>?.;{}]/gm;
export function constructTargetPath(topics, tasks, tasksx) {
  const sanitizedTopics = topics && !topics.match(sanitizeExp) && topics !== "''" ? `/${topics}` : '';
  const sanitizedTasks = tasks && !tasks.match(sanitizeExp) && tasks !== "''" ? `/${tasks}` : '';
  const sanitizedTasksX = tasksx && !tasksx.match(sanitizeExp) && tasksx !== "''" ? `/${tasksx}` : '';
  const slash = !(sanitizedTasks || sanitizedTasksX) && !sanitizedTopics ? '/' : '';
  const targetPath = `/express/templates${slash}${sanitizedTasks || sanitizedTasksX}${sanitizedTopics}`;
  const { prefix } = getConfig().locale;
  const pathToMatch = `${prefix}${targetPath}`;

  return pathToMatch;
}

export default async function redirectToExistingPage() {
  // TODO: check if the search query points to an existing page. If so, redirect.
  const {
    topics,
    tasks,
    tasksx,
    searchId,
    // eslint-disable-next-line max-len
  } = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop) });
  const pathToMatch = constructTargetPath(topics, tasks, tasksx);
  if (await existsTemplatePage(pathToMatch)) {
    window.location.assign(`${window.location.origin}${pathToMatch}${searchId ? `?searchId=${searchId}` : ''}`);
    document.body.style.display = 'none'; // hide the page until the redirect happens
  }
}
