import { expect } from '@esm-bundle/chai';

const imports = await Promise.all([
  import('../../express/code/scripts/utils.js'),
  import('../../express/code/scripts/scripts.js'),
  import('../../express/code/scripts/template-utils.js'),
]);
const { getLibs } = imports[0];
const {
  recipe2ApiQuery,
  defaultCollectionId,
  popularCollectionId,
  fetchResults,
  getTemplateTitle,
  extractRenditionLinkHref,
  extractComponentLinkHref,
  getImageThumbnailSrc,
  containsVideo,
} = imports[2];
await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = {};
  mod.setConfig(conf);
});
describe('template-utils', () => {
  describe('recipe2ApiQuery', () => {
    it('handles headers', () => {
      let { headers } = recipe2ApiQuery('limit=10&collection=default&prefLang=ja-JP&prefRegion=JP');
      expect(headers['x-express-pref-lang']).to.equal('ja-JP');
      expect(headers['x-express-pref-region-code']).to.equal('JP');
      ({ headers } = recipe2ApiQuery('limit=10&collection=default&prefRegion=IN'));
      expect(headers['x-express-pref-lang']).to.not.exist;
      expect(headers['x-express-pref-region-code']).to.equal('IN');
    });
    it('handles collection', () => {
      let { url } = recipe2ApiQuery('limit=10&collection=default');
      expect(new URL(url).searchParams.get('collectionId')).to.equal(defaultCollectionId);
      ({ url } = recipe2ApiQuery('limit=10&collection=popular'));
      expect(new URL(url).searchParams.get('collectionId')).to.equal(popularCollectionId);
      ({ url } = recipe2ApiQuery('limit=10&collection=abcde'));
      expect(new URL(url).searchParams.get('collectionId')).to.equal('abcde');
    });
    it('handles non filter params', () => {
      const { url } = recipe2ApiQuery('q=dogs running&orderBy=-remixCount&limit=10&collectionId=abcde&start=23');
      const params = new URL(url).searchParams;
      expect(params.get('q')).to.equal('dogs running');
      expect(params.get('limit')).to.equal('10');
      expect(params.get('start')).to.equal('23');
      expect(params.get('orderBy')).to.equal('-remixCount');
    });
    it('handles filters', () => {
      // filters=licensingCategory==free&filters=behaviors==still&filters=pages.task.name==flyer&filters=topics==class&filters=language==en-US
      const { url } = recipe2ApiQuery('topics=class&tasks=flyer&language=en-US&license=free&behaviors=still&collection=default');
      const params = new URL(url).searchParams;
      const filters = params.getAll('filters');
      expect(filters.includes('')).to.equal('dogs running');
    });
  });
});
