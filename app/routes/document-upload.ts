import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type DocumentService from 'frontend-validation-tool/services/document';

export default class DocumentUploadRoute extends Route {
  @service declare document: DocumentService;

  queryParams = {
    url: {
      refreshModel: true,
    },
  };

  model(params: { url: string }) {
    this.document.clearData();
    // Decode the URL component
    return params.url ? decodeURIComponent(params.url) : '';
  }
}
