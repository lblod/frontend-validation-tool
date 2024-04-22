'use strict';

module.exports = function (environment) {
  const ENV = {
    'ember-meta': {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      msapplication: {
        square70x70logo:
          'https://ui.vlaanderen.be/2.latest/icons/app-icon/tile-small.png',
        square150x150logo:
          'https://ui.vlaanderen.be/2.latest/icons/app-icon/tile-medium.png',
        wide310x150logo:
          'https://ui.vlaanderen.be/2.latest/icons/app-icon/tile-wide.png',
        square310x310logo:
          'https://ui.vlaanderen.be/2.latest/icons/app-icon/tile-large.png',
        TileColor: '#FFED00',
        'application-name': 'Vlaanderen',
      },
      'og:title': 'Validation Monitoring Tool',
      'twitter:card': 'summary_large_image',

      'twitter:title': ' Validation Monitoring Tool',
      'twitter:site': '@info_vlaanderen',
      'og:type': 'website',
      'og:description':
        'Concept for a tool to validate publications for harvesting. When multiple publishers are publishing data to a triple store, this tool can be used to validate the data against a blueprint of said data.',
      'twitter:description':
        'Concept for a tool to validate publications for harvesting. When multiple publishers are publishing data to a triple store, this tool can be used to validate the data against a blueprint of said data.',
    },
    modulePrefix: 'validation-monitoring-tool',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
    },

    APP: {
      PROXY_URL: process.env.EMBER_APP_PROXY || 'http://localhost:3000',
      CORS_PROXY_URL: process.env.CORS_PROXY_URL || 'https://corsproxy.io/?',
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.APP.CORS_PROXY_URL = '';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
