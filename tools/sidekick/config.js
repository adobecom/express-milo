function hasSchema(host) {
  if (window.location.hostname === host) {
    const schema = document.querySelector('script[type="application/ld+json"]');
    return schema !== null;
  }
  return false;
}

// This file contains the project-specific configuration for the sidekick.
(() => {
  window.aem.initSidekick({
    libraries: [
      {
        text: 'Blocks',
        paths: [
          'https://main--milo--adobecom.aem.page/docs/library/blocks.json',
          'https://main--express-milo--adobecom.aem.page/docs/library/blocks.json',
        ],
      },
    ],
    plugins: [
      {
        id: 'send-to-caas',
        condition: (s) => s.isHelix() && s.isProd() && !window.location.pathname.endsWith('.json'),
        button: {
          text: 'Send to CaaS',
          action: async (_, sk) => {
            // eslint-disable-next-line import/no-unresolved
            const { default: sendToCaaS } = await import('https://milo.adobe.com/tools/send-to-caas/sidekick.js');
            sendToCaaS(_, sk);
          },
        },
      },
      // TOOLS ---------------------------------------------------------------------
      {
        id: 'library',
        condition: () => true,
        button: {
          text: 'Library',
          action: (_, s) => {
            const domain = 'https://main--milo--adobecom.aem.page';
            const { config } = s;
            const script = document.createElement('script');
            script.type = 'module';
            script.onload = () => {
              const skEvent = new CustomEvent(
                'hlx:library-loaded',
                { detail: { domain, libraries: config.libraries } },
              );
              document.dispatchEvent(skEvent);
            };
            script.src = `${domain}/libs/ui/library/library.js`;
            document.head.appendChild(script);
          },
        },
      },
      {
        id: 'tools',
        condition: (s) => s.isEditor(),
        button: {
          text: 'Tools',
          action: (_, s) => {
            const { config } = s;
            window.open(`https://${config.innerHost}/tools/`, 'milo-tools');
          },
        },
      },
      {
        id: 'translate',
        condition: (s) => s.isEditor() && s.location.href.includes('/:x'),
        button: {
          text: 'Translate',
          action: (_, sk) => {
            const domain = 'https://main--milo--adobecom.hlx.page';
            const { config } = sk;
            window.open(`${domain}/tools/translation/index.html?sp=${encodeURIComponent(window.location.href)}&owner=${config.owner}&repo=${config.repo}&ref=${config.ref}`, 'hlx-sidekick-spark-translation');
          },
        },
      },
      {
        id: 'seo',
        condition: (s) => hasSchema(s.config.host),
        button: {
          text: 'Check Schema',
          action: () => {
            window.open(`https://search.google.com/test/rich-results?url=${encodeURIComponent(window.location.href)}`, 'check-schema');
          },
        },
      },
    ],
  });
})();
