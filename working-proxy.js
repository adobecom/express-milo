import http from 'http';
import https from 'https';
import { URL } from 'url';

const TARGET_PORT = 3000;
const PROXY_PORT = 3001;

// 🔑 PASTE YOUR AUTH TOKEN HERE:
const AUTH_TOKEN = '';
// To get your auth token:
// 1. Visit localhost:3000 in another tab and login
// 2. Open DevTools > Application > Cookies > localhost:3000
// 3. Copy the value of the 'auth_token' cookie
// 4. Paste it above and restart the proxy

const server = http.createServer((req, res) => {
  console.log('\n🔍 INCOMING REQUEST:');
  console.log(`   Method: ${req.method}`);
  console.log(`   URL: ${req.url}`);
  console.log(`   Host Header: ${req.headers.host}`);
  console.log(`   User-Agent: ${req.headers['user-agent']?.substring(0, 50)}...`);
  console.log(`   Referer: ${req.headers.referer || 'none'}`);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('   ✅ Handling CORS preflight');
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    });
    res.end();
    return;
  }

  // Parse query params for external proxy mode
  let externalUrlParam = null;
  try {
    const incomingUrl = new URL(req.url, `http://localhost:${PROXY_PORT}`);
    externalUrlParam = incomingUrl.searchParams.get('url');
  } catch (e) {
    // ignore
  }

  // Helper to write common CORS headers
  const writeCorsHeaders = () => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
  };

  // When an external url is provided, directly proxy that URL (no HTML spoofing)
  if (externalUrlParam) {
    console.log(`   🌐 External proxy mode → ${externalUrlParam}`);

    const doExternalRequest = (target, redirectCount = 0) => {
      if (redirectCount > 5) {
        res.writeHead(508);
        res.end('Too many redirects');
        return;
      }

      let parsed;
      try {
        parsed = new URL(target);
      } catch (e) {
        res.writeHead(400);
        res.end('Invalid url parameter');
        return;
      }

      const client = parsed.protocol === 'https:' ? https : http;

      // Minimal safe headers
      const extHeaders = {
        'user-agent': req.headers['user-agent'] || 'Mozilla/5.0',
        accept: req.headers.accept || '*/*',
        // Avoid compression complexities
        'accept-encoding': 'identity',
      };

      const requestOptions = {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path: `${parsed.pathname}${parsed.search}`,
        method: req.method,
        headers: extHeaders,
      };

      const extReq = client.request(requestOptions, (extRes) => {
        const status = extRes.statusCode || 0;
        const headers = extRes.headers || {};
        const { location } = headers;

        console.log(`📤 External response: ${status} ${headers['content-type'] || ''}`);

        // Follow redirects
        if (status >= 300 && status < 400 && location) {
          const nextUrl = new URL(location, parsed);
          console.log(`   🔄 Following redirect → ${nextUrl.href}`);
          extRes.resume(); // drain
          doExternalRequest(nextUrl.href, redirectCount + 1);
          return;
        }

        // Filter unsafe headers
        const safeHeaders = {};
        Object.keys(headers).forEach((key) => {
          const lowerKey = key.toLowerCase();
          if (!['content-length', 'transfer-encoding', 'content-encoding', 'connection', 'keep-alive'].includes(lowerKey)) {
            safeHeaders[key] = headers[key];
          }
        });

        // Set headers + CORS and stream
        Object.keys(safeHeaders).forEach((key) => res.setHeader(key, safeHeaders[key]));
        writeCorsHeaders();
        res.writeHead(status);
        extRes.pipe(res);
      });

      extReq.on('error', (err) => {
        console.error(`❌ External proxy error: ${err.message}`);
        res.writeHead(502);
        res.end('Bad Gateway');
      });

      // Pipe body for non-GET/HEAD
      if (req.method && !['GET', 'HEAD'].includes(req.method)) {
        req.pipe(extReq);
      } else {
        extReq.end();
      }
    };

    writeCorsHeaders();
    doExternalRequest(externalUrlParam);
    return;
  }

  // Add auth token cookie only if provided
  let cookieHeader = req.headers.cookie || '';
  if (AUTH_TOKEN && AUTH_TOKEN.trim() !== '') {
    if (cookieHeader.includes('auth_token=')) {
      cookieHeader = cookieHeader.replace(/auth_token=[^;]*/, `auth_token=${AUTH_TOKEN}`);
    } else {
      cookieHeader = cookieHeader ? `${cookieHeader}; auth_token=${AUTH_TOKEN}` : `auth_token=${AUTH_TOKEN}`;
    }
    console.log('   🍪 Injecting auth_token cookie');
  } else {
    console.log('   🔓 No auth token set; skipping cookie injection');
  }

  // Simple proxy with minimal headers to avoid conflicts
  const options = {
    hostname: 'localhost',
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: {
      host: `localhost:${TARGET_PORT}`,
      'user-agent': req.headers['user-agent'] || 'Mozilla/5.0',
      accept: req.headers.accept || '*/*',
      cookie: cookieHeader,
      // Force no compression to avoid header conflicts
      'accept-encoding': 'identity',
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    const contentType = proxyRes.headers['content-type'] || '';
    const isHtml = contentType.includes('text/html');
    const isRedirect = proxyRes.statusCode >= 300 && proxyRes.statusCode < 400;

    // Remove ALL problematic headers that cause conflicts
    const safeHeaders = {};
    Object.keys(proxyRes.headers).forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (!['content-length', 'transfer-encoding', 'content-encoding', 'connection', 'keep-alive'].includes(lowerKey)) {
        safeHeaders[key] = proxyRes.headers[key];
      }
    });

    console.log(`📤 RESPONSE FROM localhost:${TARGET_PORT}:`);
    console.log(`   Status: ${proxyRes.statusCode}`);
    console.log(`   Content-Type: ${contentType}`);
    console.log(`   Is HTML: ${isHtml}`);
    console.log(`   Is Redirect: ${isRedirect}`);
    if (isRedirect) {
      console.log(`   Redirect Location: ${proxyRes.headers.location}`);
    }
    console.log('   Headers:', Object.keys(proxyRes.headers).join(', '));

    // Handle redirects by updating the location header
    if (isRedirect && proxyRes.headers.location) {
      const redirectLocation = proxyRes.headers.location;
      let newLocation = redirectLocation;
      try {
        const absolute = new URL(redirectLocation, `http://localhost:${TARGET_PORT}`);
        // Only rewrite redirects that target our local dev server
        if (absolute.hostname === 'localhost' && Number(absolute.port || (absolute.protocol === 'https:' ? 443 : 80)) === TARGET_PORT) {
          absolute.port = String(PROXY_PORT);
          absolute.host = `localhost:${PROXY_PORT}`;
          absolute.protocol = 'http:';
          newLocation = absolute.href;
        }
      } catch (e) {
        // leave as-is if parsing fails
      }
      console.log(`   🔄 Redirect: ${redirectLocation} → ${newLocation}`);

      res.writeHead(proxyRes.statusCode, {
        Location: newLocation,
        'Access-Control-Allow-Origin': '*',
      });
      res.end();
      return;
    }

    // Add CORS headers
    // Set safe headers with CORS
    Object.keys(safeHeaders).forEach((key) => {
      res.setHeader(key, safeHeaders[key]);
    });
    writeCorsHeaders();

    if (isHtml) {
      console.log('   🔧 Processing HTML for location spoofing...');
      // For HTML, inject location spoofing
      let body = '';
      proxyRes.on('data', (chunk) => {
        body += chunk.toString();
      });

      proxyRes.on('end', () => {
        console.log(`   📄 HTML body length: ${body.length} characters`);
        console.log(`   🔍 Contains <head>: ${body.includes('<head>')}`);

        // Inject location spoofing script BEFORE any other scripts
        const locationSpoof = `<script>
// Spoof location to make Adobe script think we're on adobe.com
console.log('🚀 Location spoofing script starting...');
console.log('Original location:', window.location.hostname);

// Override location properties
Object.defineProperty(window.location, 'hostname', {
  value: 'www.adobe.com',
  writable: false,
  configurable: false
});
Object.defineProperty(window.location, 'host', {
  value: 'www.adobe.com',
  writable: false,
  configurable: false
});
Object.defineProperty(window.location, 'origin', {
  value: 'https://www.adobe.com',
  writable: false,
  configurable: false
});
Object.defineProperty(window.location, 'protocol', {
  value: 'https:',
  writable: false,
  configurable: false
});

console.log('🎭 SPOOFED - Adobe script will see:', window.location.hostname);
console.log('🎭 SPOOFED - Origin:', window.location.origin);
</script>`;

        // Inject right after <head>
        const modifiedBody = body.replace('<head>', `<head>${locationSpoof}`);
        const wasModified = modifiedBody !== body;

        console.log(`   ✅ Location spoofing injected: ${wasModified}`);
        console.log(`   📤 Sending modified HTML (${Buffer.byteLength(modifiedBody)} bytes)`);

        // Send with explicit length
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', Buffer.byteLength(modifiedBody));
        res.writeHead(proxyRes.statusCode);
        res.end(modifiedBody);
      });
    } else {
      console.log(`   📤 Streaming non-HTML content (${contentType})`);
      // For non-HTML, stream without problematic headers
      res.setHeader('Content-Type', contentType);
      res.writeHead(proxyRes.statusCode);
      proxyRes.pipe(res);
    }
  });

  proxyReq.on('error', (err) => {
    console.error(`❌ PROXY REQUEST ERROR: ${err.message}`);
    console.error(`   Target: localhost:${TARGET_PORT}${req.url}`);
    res.writeHead(500);
    res.end('Proxy Error');
  });

  proxyReq.end();
});

server.listen(PROXY_PORT, () => {
  console.log('🚀 Adobe Location Spoofing Proxy Started!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Test URL: http://localhost:${PROXY_PORT}/drafts/bradjohn/pdp-test/testy-test`);
  console.log(`🔄 Proxying to: localhost:${TARGET_PORT}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 Auth Token Status:');
  if (AUTH_TOKEN === 'PASTE_YOUR_AUTH_TOKEN_HERE') {
    console.log('   ❌ NO AUTH TOKEN SET - Will redirect to login');
    console.log('   📝 To fix:');
    console.log('   1. Login at localhost:3000 in another tab');
    console.log('   2. Copy auth_token cookie from DevTools');
    console.log('   3. Paste it in working-proxy.js AUTH_TOKEN variable');
    console.log('   4. Restart this proxy');
  } else {
    console.log('   ✅ Auth token configured');
    console.log(`   🍪 Will inject: auth_token=${AUTH_TOKEN.substring(0, 20)}...`);
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 Debug Info:');
  console.log('   • Will log all incoming requests');
  console.log('   • Will show HTML modification status');
  console.log('   • Will inject location spoofing script');
  console.log('   • Will show if Adobe script sees www.adobe.com');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🛑 Press Ctrl+C to stop');
});
