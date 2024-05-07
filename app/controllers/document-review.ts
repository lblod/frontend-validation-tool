import Controller from '@ember/controller';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type DocumentService from 'frontend-validation-tool/services/document';

export default class DocumentReviewController extends Controller {
  @service declare document: DocumentService;
  @service declare router: RouterService;
  @action handleValidation() {
    this.router.transitionTo('validation-results');
  }

  @tracked selectOptions = [
    {
      label: 'Notulen',
      value: 'Notulen',
    },
    {
      label: 'Besluitenlijst',
      value: 'Besluitenlijst',
    },
    {
      label: 'Agenda',
      value: 'Agenda',
    },
  ];
}
