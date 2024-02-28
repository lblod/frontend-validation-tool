/* eslint-env node */

'use strict';

const path = require('path');

module.exports = function (/* env */) {
  return {
    clientAllowedKeys: ['PROXY_HOST', 'PROXY_PORT'],
    fastbootAllowedKeys: [],
    failOnMissingKey: false,
    path: path.join(path.dirname(__dirname), '.env'),
  };
};
