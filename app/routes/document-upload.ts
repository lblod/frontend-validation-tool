import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type DocumentService from 'validation-monitoring-tool/services/document';

export default class DocumentUploadRoute extends Route {
  @service declare document: DocumentService;

  async model() {
    this.document.clearData();
  }
}
