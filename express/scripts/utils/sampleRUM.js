export function sampleRUM(checkpoint, data = {}, forceSampleRate) {
    sampleRUM.defer = sampleRUM.defer || [];
    const defer = (fnname) => {
      sampleRUM[fnname] = sampleRUM[fnname]
        || ((...args) => sampleRUM.defer.push({ fnname, args }));
    };
    sampleRUM.drain = sampleRUM.drain
      || ((dfnname, fn) => {
        sampleRUM[dfnname] = fn;
        sampleRUM.defer
          .filter(({ fnname }) => dfnname === fnname)
          .forEach(({ fnname, args }) => sampleRUM[fnname](...args));
      });
    sampleRUM.on = (chkpnt, fn) => {
      sampleRUM.cases[chkpnt] = fn;
    };
    defer('observe');
    defer('cwv');
    defer('stash');
    try {
      window.hlx = window.hlx || {};
      if (!window.hlx.rum) {
        const usp = new URLSearchParams(window.location.search);
        const weight = (usp.get('rum') === 'on') ? 1 : forceSampleRate || window.RUM_LOW_SAMPLE_RATE;
        // eslint-disable-next-line no-bitwise
        const hashCode = (s) => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0);
        const id = `${hashCode(window.location.href)}-${new Date().getTime()}-${Math.random().toString(16).substr(2, 14)}`;
        const random = Math.random();
        const isSelected = (random * weight < 1);
        // eslint-disable-next-line object-curly-newline
        window.hlx.rum = { weight, id, random, isSelected, sampleRUM };
      }
      const { id } = window.hlx.rum;
      if ((window.hlx && window.hlx.rum && window.hlx.rum.isSelected) || checkpoint === 'experiment') {
        const sendPing = (pdata = data) => {
          if (!window.hlx.rum.isSelected) {
            return;
          }
          // eslint-disable-next-line object-curly-newline, max-len, no-use-before-define
          const body = JSON.stringify({ weight: window.hlx.rum.weight, id, referer: window.location.href, generation: window.RUM_GENERATION, checkpoint, ...data });
          const url = `https://rum.hlx.page/.rum/${window.hlx.rum.weight}`;
          // eslint-disable-next-line no-unused-expressions
          navigator.sendBeacon(url, body);
          // eslint-disable-next-line no-console
          console.debug(`ping:${checkpoint}:${window.hlx.rum.weight}`, pdata);
        };
        sampleRUM.cases = sampleRUM.cases || {
          cwv: () => sampleRUM.cwv(data) || true,
          lazy: () => {
            // use classic script to avoid CORS issues
            const script = document.createElement('script');
            script.src = 'https://rum.hlx.page/.rum/@adobe/helix-rum-enhancer@^1/src/index.js';
            document.head.appendChild(script);
            sendPing(data);
            return true;
          },
          experiment: () => {
            // track experiments with higher sampling rate
            window.hlx.rum.weight = Math.min(window.hlx.rum.weight, window.RUM_HIGH_SAMPLE_RATE);
            window.hlx.rum.isSelected = (window.hlx.rum.random * window.hlx.rum.weight < 1);
  
            sampleRUM.drain('stash', sampleRUM);
            sendPing(data);
            return true;
          },
        };
        sendPing(data);
        if (sampleRUM.cases[checkpoint]) {
          sampleRUM.cases[checkpoint]();
        }
      } else {
        sampleRUM.stash(checkpoint, data); // save the event for later
      }
    } catch (error) {
      // something went wrong
    }
  }
  