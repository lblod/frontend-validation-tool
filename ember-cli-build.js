'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    dotEnv: {
      clientAllowedKeys: ['CORS_PROXY_URL'],
    },
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
  });
  return app.toTree();
};
