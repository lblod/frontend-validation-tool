'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-cli-babel': { enableTypeScriptTransform: true },
    '@appuniversum/ember-appuniversum': {
      disableWormholeElement: true,
    },
    sassOptions: {
      includePaths: ['node_modules/@appuniversum/ember-appuniversum'], // just "node_modules" would also work, but it seems to slow (re)builds down a lot
    },
    // Add options here
  });

  return app.toTree();
};
