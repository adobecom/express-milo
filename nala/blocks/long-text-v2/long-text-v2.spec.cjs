module.exports = {
  name: 'Express long-text-v2 block',
  features: [
    {
      tcid: '0',
      name: '@long-text-v2 basic content',
      path: '/drafts/nala/blocks/long-text-v2/long-text-v2',
      data: {
        h2Count: 2,
        pCount: 2,
        hasSemanticStructure: true,
        hasDesignTokens: true,
      },
      tags: '@long-text-v2 @basic @express @smoke @regression @t1',
    },
    {
      tcid: '1',
      name: '@long-text-v2 single section',
      path: '/drafts/nala/blocks/long-text-v2/long-text-v2-single',
      data: {
        h2Count: 1,
        pCount: 1,
        hasSemanticStructure: true,
        hasDesignTokens: true,
      },
      tags: '@long-text-v2 @single @express @smoke @regression @t2',
    },
    {
      tcid: '2',
      name: '@long-text-v2 plain variant',
      path: '/drafts/nala/blocks/long-text-v2/long-text-v2-plain',
      data: {
        hasPlainClass: true,
        hasWrapper: true,
        h2Count: 3,
        pCount: 3,
        hasSemanticStructure: true,
      },
      tags: '@long-text-v2 @plain @express @smoke @regression @t3',
    },
    {
      tcid: '3',
      name: '@long-text-v2 accessibility',
      path: '/drafts/nala/blocks/long-text-v2/long-text-v2-a11y',
      data: {
        hasSemanticHTML: true,
        hasProperHeadings: true,
        hasProperParagraphs: true,
        keyboardNavigable: true,
        screenReaderFriendly: true,
      },
      tags: '@long-text-v2 @accessibility @a11y @express @smoke @regression @t4',
    },
  ],
};
