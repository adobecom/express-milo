class BlogPostsV2Block {
  constructor(page, selector = '.blog-posts-v2', nth = 0) {
    this.page = page;
    this.block = page.locator(selector).nth(nth);
  }
}
module.exports = BlogPostsV2Block;
