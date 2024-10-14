'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
    babel: {
      plugins: [
        require.resolve("ember-concurrency/async-arrow-task-transform"),
  
        // NOTE: put any code coverage plugins last, after the transform.
      ],
      sourceMaps: 'inline'
    }
  });
  return app.toTree();
};
