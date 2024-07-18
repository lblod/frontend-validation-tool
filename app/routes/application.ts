import Route from '@ember/routing/route';

import { service } from '@ember/service';

import type DocumentService from 'frontend-validation-tool/services/document';
import ENV from '../config/environment';

export default class ApplicationRoute extends Route {
  @service declare document: DocumentService;

  model() {
    if (!ENV.CORS_PROXY_URL) {
      const origin = window.location.origin;
      const dispatchPath = '/communica';
      this.document.setCorsProxy(`${origin}${dispatchPath}?url=`);
      return;
    }

    this.document.setCorsProxy(ENV.CORS_PROXY_URL);
  }
}
