module.exports = {
  name: 'FAQv2 Block',
  features: [
    {
      tcid: '0',
      name: '@FAQv2 Default',
      path: '/express/feature/faqv2',
      data: {
        h2Text: 'Frequently Asked Questions',
        question1: 'What is Adobe Express?',
        answer1: 'Adobe Express is a quick and easy create-anything app',
        question2: 'Is Adobe Express free?',
        answer2: 'Yes, Adobe Express offers a free plan',
        question3: 'Can I use Adobe Express on mobile?',
        answer3: 'Yes, Adobe Express is available on web, iOS, and Android',
      },
      tags: '@faqv2 @smoke @regression',
    },
    {
      tcid: '1',
      name: '@FAQv2 Expandable',
      path: '/express/feature/faqv2-expandable',
      data: {
        h2Text: 'Frequently Asked Questions',
        question1: 'What is Adobe Express?',
        answer1: 'Adobe Express is a quick and easy create-anything app',
      },
      tags: '@faqv2 @expandable @regression',
    },
    {
      tcid: '2',
      name: '@FAQv2 Longform',
      path: '/express/feature/faqv2-longform',
      data: {
        h2Text: 'Frequently Asked Questions',
        question1: 'What is Adobe Express?',
        answer1: 'Adobe Express is a quick and easy create-anything app',
      },
      tags: '@faqv2 @longform @regression',
    },
  ],
};
