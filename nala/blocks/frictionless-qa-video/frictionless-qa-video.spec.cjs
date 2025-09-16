module.exports = {
  name: 'Express frictionless-qa-video block',
  features: [
    {
      tcid: '0',
      name: '@frictionless-qa-video  Convert video to GIF',
      path: '/drafts/nala/blocks/frictionless-qa/fqa-video-to-gif',
      data: {
        h1Text: 'Convert video to GIF for free.',
        p1Text: 'Transform your videos into GIFs with our fast, easy, and free GIF maker. Convert to GIFs in just a few taps.',
        dropZoneText: 'Drag and drop a videoor browse to upload.',
        buttonText: 'Upload your video',
        p2Text: 'File length can be up to 1 min',
      },
      tags: '@frictionless-qa-video @frictionless-qa-convert-video-to-gif @express @smoke @regression @t1',
    },
    {
      tcid: '1',
      name: '@frictionless-qa-video  Resize video',
      path: '/drafts/nala/blocks/frictionless-qa/fqa-video-resize',
      data: {
        h1Text: 'Free video resizer.',
        p1Text: 'Easily resize your video in seconds. Select from preset sizes to change the dimensions of your video for any destination.',
        dropZoneText: 'Drag and drop a videoor browse to upload.',
        buttonText: 'Upload your video',
        p2Text: 'File size can be up to 1GB',
      },
      tags: '@frictionless-qa-video @frictionless-qa--video-resize @express @smoke @regression @t1',
    },
  ],
};