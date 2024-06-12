import Controller from '@ember/controller';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type DocumentService from 'frontend-validation-tool/services/document';
import { getDocumentTypes } from 'app-validation-tool/dist/queries';

export default class DocumentReviewController extends Controller {
  @service declare document: DocumentService;
  @service declare router: RouterService;

  @action handleValidation() {
    this.router.transitionTo('validation-results', {
      queryParams: {
        url: this.document.documentURL,
        documentType: this.document.documentType,
      },
    });
  }

  @tracked selectOptions = getDocumentTypes();
}
