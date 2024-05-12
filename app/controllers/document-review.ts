import Controller from '@ember/controller';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { DOCUMENT_TYPES } from 'validation-monitoring-tool/constants/document-types';
import type DocumentService from 'validation-monitoring-tool/services/document';

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

  @tracked selectOptions = DOCUMENT_TYPES;
}
