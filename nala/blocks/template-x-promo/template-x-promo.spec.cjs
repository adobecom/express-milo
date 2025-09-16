module.exports = {
  name: 'Express template-x-promo block',
  features: [
    {
      tcid: '0',
      name: '@template-x-promo basic functionality',
      path: ['/express/'],
      tags: '@express @smoke @regression @template-x-promo',
    },
    {
      tcid: '1',
      name: '@template-x-promo with recipe parameters',
      path: ['/express/create'],
      tags: '@express @smoke @regression @template-x-promo',
    },
    {
      tcid: '2',
      name: '@template-x-promo real API integration',
      path: ['/express/business'],
      tags: '@express @smoke @regression @template-x-promo',
    },
  ],
};
