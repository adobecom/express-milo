export default class FrictionlessQaVideo {
  constructor(page, nth = 0) {
    this.page = page;
    this.nth = nth;

    // section and frictionless-qa-video wrapper
    this.section = page.locator('.section').nth(nth);
    this.frictionlessQaVideo = page.locator('.frictionless-quick-action').nth(nth);

    // Frictionless type locators
    this.type = {
      video_to_gif: page.locator('.frictionless-quick-action[data-frictionlesstype=convert-to-gif]').nth(nth),
      video_resize: page.locator('.frictionless-quick-action[data-frictionlesstype=resize-video]').nth(nth),
    };

    // Convert to gif type details
    this.convertToGifHeading = this.type.video_to_gif.locator('h1');
    this.convertToGifContent = this.type.video_to_gif.locator('p').nth(0);
    this.convertToGifImage = this.type.video_to_gif.locator('picture > img').nth(0);
    this.convertToGifDropzone = this.type.video_to_gif.locator('.dropzone').nth(0);
    this.convertToGifDropzoneText = this.convertToGifDropzone.locator('p').nth(0);
    this.convertToGifUploadButton = this.convertToGifDropzone.locator('a').nth(0);
    this.convertToGifTermsAndPolicy = this.convertToGifDropzone.locator('p').nth(2);

    // Resize video type details
    this.resizeVideoHeading = this.type.video_resize.locator('h1');
    this.resizeVideoContent = this.type.video_resize.locator('p').nth(0);
    this.resizeVideoImage = this.type.video_resize.locator('picture > img').nth(0);
    this.resizeVideoDropzone = this.type.video_resize.locator('.dropzone').nth(0);
    this.resizeVideoUploadButton = this.resizeVideoDropzone.locator('a').nth(0);
    this.resizeVideoTermsAndPolicy = this.resizeVideoDropzone.locator('p').nth(2);
  }
}
