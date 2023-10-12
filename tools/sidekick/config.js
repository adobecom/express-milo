/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// This file contains the project-specific configuration for the sidekick.
(() => {
  window.hlx.initSidekick({
    hlx3: true,
    libraries: [
      {
        text: 'Blocks',
        paths: [
          'https://main--milo--adobecom.hlx.page/docs/library/blocks.json',
          'https://main--express-milo--adobecom.hlx.page/docs/library/blocks.json',
        ]
      },
    ],
    plugins: [
      {
        id: 'send-to-caas',
        condition: (s) => s.isHelix() && s.isProd() && !window.location.pathname.endsWith('.json'),
        button: {
          text: 'Send to CaaS',
          action: async (_, sk) => {
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
            const domain = 'https://main--milo--adobecom.hlx.page';
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
    ],
  });
})();
