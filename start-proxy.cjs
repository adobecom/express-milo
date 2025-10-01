const http = require('http');
const https = require('https');
const { URL } = require('url');

console.log('🚀 Starting CORS Proxy...');

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Only GET allowed' }));
    return;
  }

  const urlParams = new URLSearchParams(req.url.slice(1));
  const targetUrl = urlParams.get('url');

  if (!targetUrl) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing url parameter' }));
    return;
  }

  console.log('🔄 Proxying:', targetUrl);

  try {
    const parsedUrl = new URL(targetUrl);
    const httpModule = parsedUrl.protocol === 'https:' ? https : http;

    const proxyReq = httpModule.request({
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CORS-Proxy)',
        'Accept': '*/*'
      }
    }, (proxyRes) => {
      console.log('📡 Response:', proxyRes.statusCode);
      
      res.writeHead(proxyRes.statusCode, {
        'Content-Type': proxyRes.headers['content-type'] || 'application/json',
        'Access-Control-Allow-Origin': '*'
      });

      proxyRes.pipe(res);
    });

    proxyReq.on('error', (error) => {
      console.error('❌ Error:', error.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    });

    proxyReq.end();
  } catch (error) {
    console.error('❌ URL Error:', error.message);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid URL' }));
  }
});

server.listen(8081, () => {
  console.log('✅ CORS Proxy running on http://localhost:8081');
  console.log('📖 Usage: http://localhost:8081?url=https://example.com');
});

server.on('error', (error) => {
  console.error('❌ Server error:', error.message);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
