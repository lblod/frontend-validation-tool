import cors_proxy from 'cors-anywhere';
import ENV from '../config/environment';

const HOST = ENV.APP['HOST_URL'] || '0.0.0.0';
const PORT = ENV.APP['PROXY_URL'] || 8085;

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
