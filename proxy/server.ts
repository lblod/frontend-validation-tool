const HOST = process.env['PROXY_HOST'] || '0.0.0.0';
const PORT = process.env['PROXY_PORT'] || 8085;

const cors_proxy = require('cors-anywhere');

cors_proxy
  .createServer({
    httpProxyOptions: {
      secure: false,
      selfHandleResponse: true,
    },
    originWhitelist: [], // Allow all origins
    removeHeaders: ['cookie', 'cookie2'],
  })
  .listen(PORT, HOST, () => {
    console.log('Running CORS Anywhere on ' + HOST + ':' + PORT);
  });
