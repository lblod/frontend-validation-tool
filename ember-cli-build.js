'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
    '@appuniversum/ember-appuniversum': {
      disableWormholeElement: true,
    },
    autoImport: {
      watchDependencies: [
        'validation-monitoring-module',
        ...Object.keys(require('./package').dependencies || {}),
      ],
    },
    sassOptions: {
      includePaths: ['node_modules/@appuniversum/ember-appuniversum'], // just "node_modules" would also work, but it seems to slow (re)builds down a lot
    },
  });

  return app.toTree();
};
