module.exports = {
  name: 'Express blog-posts-v2 block',
  features: [
    {
      tcid: '0',
      name: '@blog-posts-v2 basic functionality',
      path: ['/dev/testing/test-blog-posts-v2'],
      tags: '@express @smoke @regression @blog-posts-v2',
    },
    {
      tcid: '1',
      name: '@blog-posts-v2 with featured posts',
      path: ['/dev/testing/test-blog-posts-v2-featured'],
      tags: '@express @smoke @regression @blog-posts-v2',
    },
    {
      tcid: '2',
      name: '@blog-posts-v2 multiple cards layout',
      path: ['/dev/testing/test-blog-posts-v2-multiple'],
      tags: '@express @smoke @regression @blog-posts-v2',
    },
  ],
};
