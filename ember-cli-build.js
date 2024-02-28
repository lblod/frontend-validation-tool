'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

const funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
  });
  const serverTree = funnel('proxy');
  return mergeTrees([app.toTree(), serverTree]);
};
