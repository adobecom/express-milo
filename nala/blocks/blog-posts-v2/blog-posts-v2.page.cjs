export default class BlogPostsV2 {
  constructor(page) {
    this.page = page;
    this.blogPostsV2 = page.locator('.blog-posts-v2');
    this.blogCards = page.locator('.blog-card');
  }

  async gotoURL(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForBlogCards() {
    await this.blogCards.first().waitFor({ state: 'visible' });
  }

  async getBlogCardCount() {
    return this.blogCards.count();
  }
}