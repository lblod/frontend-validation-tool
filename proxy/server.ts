const HOST = process.env['EMBER_APP_HOST'] || '0.0.0.0';
const PORT = process.env['PROXY_PORT'] || 8085;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors_proxy = require('cors-anywhere');

cors_proxy
  .createServer({
    httpProxyOptions: {
      secure: false,
      selfHandleResponse: true,
    },
    originWhitelist: [], // Allow all origins
    //requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2'],
  })
  .listen(PORT, HOST, () => {
    console.log('Running CORS Anywhere on ' + HOST + ':' + PORT);
  });
