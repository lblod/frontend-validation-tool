import Route from '@ember/routing/route';

import { service } from '@ember/service';

import type DocumentService from 'frontend-validation-tool/services/document';

export default class ApplicationRoute extends Route {
  @service declare document: DocumentService;

  model() {
    const origin = window.location.origin;
    const dispatchPath = '/communica';

    this.document.setCorsProxy(`${origin}${dispatchPath}?url=`);
  }
}
