import { discoverEmberDataModels } from 'ember-cli-mirage';
import { createServer } from 'miragejs';

import { Response as MirageResponse } from 'miragejs';
import { getHTMLExampleOfDocumentType } from '@lblod/lib-decision-shapes';

export default function (config) {
  let finalConfig = {
    ...config,
    models: {
      ...discoverEmberDataModels(config.store),
      ...config.models,
    },
    routes() {
      this.namespace = '';
      this.timing = 2000;

      this.get('/example-notulen', () => {
        return new MirageResponse(
          200,
          { 'Content-Type': 'text/html' },
          getHTMLExampleOfDocumentType('Notulen'),
        );
      });
    },
  };

  return createServer(finalConfig);
}
