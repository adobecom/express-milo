import {
  defaultCollectionId,
  popularCollectionId,
  TOPICS_AND_SEPARATOR,
  TOPICS_OR_SEPARATOR,
  getBackupRecipe,
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
  // backup recipe
  backupRecipe: '',
};

function isFormFieldEqual(val1, val2) {
  if (!val1 && !val2) return true;
  if (val1 === val2) return true;
  if (Array.isArray(val1) && Array.isArray(val2)) {
    if (val1.length !== val2.length) return false;
    return val1.every((v1, i) => isFormFieldEqual(v1, val2[i]));;
  }
  return false;
}

// return ops where form2==ops(form1)
function diffForms(form1, form2) {
  return Object.keys(initialFormData)
    .filter((key) => !['start', 'backupRecipe', 'limit'].includes(key))
    .reduce((diffs, key) => {
      const val1 = form1[key];
      const val2 = form2[key];
      if (isFormFieldEqual(val1, val2)) {
        return diffs;
      }
      if (val1 && !val2) {
        return [...diffs, { type: '-', key }];
      } else {
        return [...diffs, { type: '+', key, value: val2 }];
      }
    }, []);
}

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
  if (params.get('limit')) formData.limit = Number(params.get('limit'));
  if (params.get('start')) formData.start = Number(params.get('start'));
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
  if (params.get('backup')) {
    const backupStr = params.get('backup');
    params.delete('backup');
    formData.backupRecipe = getBackupRecipe(params, backupStr);
  }
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
  // backup recipe form
  let backup = '';
  if (formData.backupRecipe) {
    const diff = diffForms(formData, recipe2Form(formData.backupRecipe));
    if (diff.length) {
      const diffStr = diff
        .map(({ type, key, value }) => {
          if (type === '-') {
            return `${type}${key}`;
          }
          return `${type}${key}=${value}`;
        })
        .join(',');
      backup = `backup=[${diffStr}]`;
    }
  }

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
    backup,
  ]
    .filter(Boolean)
    .join('&');

  return recipe;
}
