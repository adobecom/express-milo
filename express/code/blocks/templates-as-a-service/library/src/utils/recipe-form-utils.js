import {
  defaultCollectionId,
  popularCollectionId,
  TOPICS_AND_SEPARATOR,
  TOPICS_OR_SEPARATOR,
} from '../../../../../scripts/template-utils.js';

export const initialFormData = {
  collection: 'default',
  collectionId: '',
  q: '',
  limit: 10,
  start: 0,
  orderBy: '',
  // filters
  language: '',
  tasks: '',
  topics: [['']],
  license: '',
  behaviors: '',
  // boosting
  prefLang: '',
  prefRegion: '',
};

export function recipe2Form(recipe) {
  const params = new URLSearchParams(recipe);
  const formData = structuredClone(initialFormData);
  if (params.has('collectionId')) {
    if (params.get('collectionId') === defaultCollectionId) {
      formData.collection = 'default';
      formData.collectionId = '';
    } else if (params.get('collectionId') === popularCollectionId) {
      formData.collection = 'popular';
      formData.collectionId = '';
    } else {
      formData.collection = 'custom';
    }
  } else if (
    params.has('collection') &&
    ['default', 'popular'].includes(params.get('collection'))
  ) {
    formData.collection = params.get('collection');
    formData.collectionId = '';
  } else {
    formData.collection = 'default';
    formData.collectionId = '';
  }
  if (params.get('limit')) formData.limit = params.get('limit');
  if (params.get('start')) formData.start = params.get('start');
  if (params.get('orderBy')) formData.orderBy = params.get('orderBy');
  if (params.get('q')) formData.q = params.get('q');
  if (params.get('language')) formData.language = params.get('language');
  if (params.get('tasks')) formData.tasks = params.get('tasks');
  if (params.get('topics')) {
    formData.topics = params
      .get('topics')
      .split(TOPICS_AND_SEPARATOR)
      .map((group) => group.split(TOPICS_OR_SEPARATOR));
  }
  if (params.get('license')) formData.license = params.get('license');
  if (params.get('behaviors')) formData.behaviors = params.get('behaviors');
  if (params.get('prefLang')) formData.prefLang = params.get('prefLang');
  if (params.get('prefRegion'))
    formData.prefRegion = params.get('prefRegion').toUpperCase();
  return formData;
}

export function form2Recipe(formData) {
  const collection =
    formData.collection === 'custom' ? '' : `collection=${formData.collection}`;
  const collectionId =
    formData.collection === 'custom'
      ? `collectionId=${formData.collectionId}`
      : '';
  const limit = formData.limit ? `limit=${formData.limit}` : '';
  const start = formData.start ? `start=${formData.start}` : '';
  const q = formData.q ? `q=${formData.q}` : '';
  const language = formData.language ? `language=${formData.language}` : '';
  const tasks = formData.tasks ? `tasks=${formData.tasks}` : '';
  const joinedTopics = formData.topics
    .filter((group) => group.some(Boolean))
    .map((group) => group.filter(Boolean).join(TOPICS_OR_SEPARATOR))
    .join(TOPICS_AND_SEPARATOR);
  const topics = joinedTopics ? `topics=${joinedTopics}` : '';
  const license = formData.license ? `license=${formData.license}` : '';
  const behaviors = formData.behaviors ? `behaviors=${formData.behaviors}` : '';
  const orderBy = formData.orderBy ? `orderBy=${formData.orderBy}` : '';
  const prefLang = formData.prefLang ? `prefLang=${formData.prefLang}` : '';
  const prefRegion = formData.prefRegion
    ? `prefRegion=${formData.prefRegion}`
    : '';

  const recipe = [
    q,
    topics,
    tasks,
    language,
    license,
    behaviors,
    orderBy,
    limit,
    collection,
    collectionId,
    prefLang,
    prefRegion,
    start,
  ]
    .filter(Boolean)
    .join('&');

  return recipe;
}
