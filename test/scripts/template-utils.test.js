import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';

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
  getTemplateTitle,
  extractRenditionLinkHref,
  extractComponentLinkHref,
} = imports[2];
await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = {};
  mod.setConfig(conf);
});
const mockAPIResposne = JSON.parse(await readFile({ path: './mocks/template-utils.json' }));

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
      ({ url } = recipe2ApiQuery('limit=10&collectionId=abcde'));
      expect(new URL(url).searchParams.get('collectionId')).to.equal('abcde');
      ({ url } = recipe2ApiQuery('limit=10'));
      expect(new URL(url).searchParams.get('collectionId')).to.equal(defaultCollectionId);
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
      // filters=language==en-US
      const { url } = recipe2ApiQuery('topics=class&tasks=flyer&language=en-US&license=free&behaviors=still&collection=default');
      const params = new URL(url).searchParams;
      const filters = params.getAll('filters');
      expect(filters.length).to.equal(5);
      expect(filters.includes('licensingCategory==free')).to.be.true;
      expect(filters.includes('behaviors==still')).to.be.true;
      expect(filters.includes('pages.task.name==flyer')).to.be.true;
      expect(filters.includes('topics==class')).to.be.true;
      expect(filters.includes('language==en-US')).to.be.true;
    });
    it('handles api response', () => {
      const templates = mockAPIResposne.items;
      expect(getTemplateTitle(templates[0])).to.equal('Black Education Day Video');
      expect(extractRenditionLinkHref(templates[0])).to.equal('https://design-assets.adobeprojectm.com/content/download/express/public/urn:aaid:sc:VA6C2:e579d071-d65f-58ee-ba59-e8943810f1d7/rendition?assetType=TEMPLATE&etag=dfa72c5715e64e33a4ef07f395460906{&page,size,type,fragment}');
      expect(extractComponentLinkHref(templates[0])).to.equal('https://design-assets.adobeprojectm.com/content/download/express/public/urn:aaid:sc:VA6C2:e579d071-d65f-58ee-ba59-e8943810f1d7/component?assetType=TEMPLATE&etag=dfa72c5715e64e33a4ef07f395460906{&revision,component_id}');
    });
  });
});
