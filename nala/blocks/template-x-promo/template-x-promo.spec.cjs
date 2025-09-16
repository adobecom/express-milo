module.exports = {
  name: 'Express template-x-promo block',
  features: [
    {
      tcid: '0',
      name: '@template-x-promo basic functionality',
      path: ['/drafts/nala/blocks/template-x-promo/template-x-promo-basic'],
      tags: '@express @smoke @regression @template-x-promo',
    },
    {
      tcid: '1',
      name: '@template-x-promo with recipe parameters',
      path: ['/drafts/nala/blocks/template-x-promo/template-x-promo-recipe'],
      tags: '@express @smoke @regression @template-x-promo',
    },
    {
      tcid: '2',
      name: '@template-x-promo real API integration',
      path: ['/drafts/nala/blocks/template-x-promo/template-x-promo-api'],
      tags: '@express @smoke @regression @template-x-promo',
    },
  ],
};
